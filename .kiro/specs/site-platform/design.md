# Design Document

## Overview

One codebase serves many sites. A `SiteConfig` per site holds everything specific to its field, each site has its own Postgres schema in the shared Supabase project, and each site is built and deployed on its own.

The work moves every constant specific to a field into ShadowyRealm's own config, with no change in behaviour, which is verified by identical API output. It then makes the build, the deploy and the schema per site, so the inventions site and the sites after it are new configs, not new code.

## Architecture

```
       src/sites/shadowyrealm.ts   src/sites/inventions.ts   src/sites/<next>.ts
                     └────────────────────┼────────────────────┘
                              registry: siteFor(key)
                                          │
 vite build --mode <site>  ──► dist/<site>/   (SPA: labels, axis, copy, brand)
 tools/site-schema.ts <site> ──► DDL for the site's handoff
                                          │
 Worker (SITE var) ─┬─► /mcp ──┐
                    └─► /api ──┴─► sr-service.ts ──► Supabase schema = site.schema
                                         ├─► clef.ts (site wording and rubrics)
                                         └─► credit.ts + atis-calculator.ts (site.scoring)

 wrangler.json:  top level         → Worker "shadowyrealm", SITE=shadowyrealm, dist/shadowyrealm
                 env.<site> (each) → Worker "<site>",       SITE=<site>,        dist/<site>
```

The Worker imports every site config and selects one by `env.SITE` on each request. The SPA is built once per site, so it ships only its own site's config, assets and token values.

## The site config

```ts
// src/sites/types.ts
export interface DimensionDef {
  key: string;            // column prefix: {key}_benefit, {key}_harm, {key}_justification
  label: string;
  meaning: string;        // methodology table
  weight: number;
  clef: { area: string; affected: string; depth: string };
}

export interface EntityTypeDef {
  key: string;
  label: string;
  plural: string;         // index filter
  clefSubject: (name: string) => string;
  requiresOutgoing?: string;   // a link type key; the loader rejects an entity of this type without one
}

export interface LinkLabels { cause: string; consequence: string }

export interface LinkTypeDef {
  key: string;
  credit: boolean;
  from: readonly string[] | "any";
  to: readonly string[] | "any";
  labels: LinkLabels;
  labelsByTarget?: Record<string, LinkLabels>;
}

export interface Rubrics {
  intensity: readonly string[];      // ten levels, lowest first
  reach: readonly string[];
  persistence: readonly string[];
  persistenceTimeConstants: readonly number[];   // years, one per persistence level; Infinity never fades
}

export interface TierDef { tier: ATISTier; min: number; label: string; descriptor: string }

export interface ScoringConfig {
  dimensions: readonly DimensionDef[];
  rubrics: Rubrics;
  unit: { years: number; name: string };         // ShadowyRealm: 100, "influence-centuries"
  tiers: readonly TierDef[] | null;              // null until calibrated
}

export interface Timeline {
  unit: "year";
  start: number;
  ticks: readonly number[];
  near: number;           // log-axis offset that keeps the present off infinity
  buckets: number;
}

export interface SiteConfig {
  key: string;
  schema: string;
  brand: {
    name: string; origin: string; title: string; description: string;
    ogImage: string; ogImageAlt: string; heroAlt: string; userAgent: string;
  };
  scoring: ScoringConfig;
  entityTypes: readonly EntityTypeDef[];
  linkTypes: readonly LinkTypeDef[];
  timeline: Timeline;
  copy: SiteCopy;          // today's COPY shape, plus the methodology prose
  mcp: { serverName: string; instructions: string; examples: McpExamples };
}
```

`src/sites/rubrics.ts` exports today's intensity, reach and persistence levels and time constants as `HISTORICAL_RUBRICS`. ShadowyRealm and the inventions site both use it, and a site on a shorter timescale defines its own.

The reach multiplier, `(reach / 5)^1.8 × 3`, stays shared code. It shapes how breadth compares with depth, not what a field means.

ShadowyRealm's config reproduces today's constants exactly:
- the five dimensions with today's weights, `AREAS` text and Clef phrasing;
- `HISTORICAL_RUBRICS`;
- `{ years: 100, name: "influence-centuries" }`;
- its three entity types, each with the subject phrase "{name}'s own direct activity";
- its four link types;
- a timeline starting at −3500, with today's ticks, near offset 40 and 200 buckets;
- today's tiers and `COPY`.

## Data model

`tools/site-schema.ts` holds one template of the `shadowyrealm` schema after migration `20261107000827` and fills it from a config. The template is written against the baseline (`20260810120000_baseline.sql`) and the influence-graph migration in the monorepo:

| Part | Filled from the config |
|---|---|
| `create schema <schema>` | `schema` |
| `entity_type` enum | `entityTypes[].key` |
| `publication_status` enum | fixed: `draft`, `submitted`, `under_review`, `published`, `archived` |
| `relationship_type` enum | `linkTypes[].key` |
| `entities`, `assessment_periods`, `relationships`, `entity_audit_log` | fixed columns |
| `assessments` | fixed columns plus `{key}_benefit`, `{key}_harm`, `{key}_justification` for each dimension |
| indexes, triggers, foreign keys, RLS, policies, grants, default privileges | fixed, schema-qualified |
| `credit_shares(published_only)` | `linkTypes.filter(credit)` in the `relationship_type in (…)` filter |
| Data API exposure | emitted as a comment block: the hosted project's exposed-schemas setting and the `[api] schemas` line in `supabase/config.toml` |

Each new site's `handoff.md` is the tool's output plus a verification query for each step and its expected result, for both the cloud project and the local stack on gideon.

### Shared table types

The generated types are per schema, but the service needs one shape. `SiteTables` declares the entity, period, relationship and audit rows, with `entity_type` and `relationship_type` as `string`, plus assessments as the fixed columns and `Record<\`${string}_${"benefit" | "harm"}\`, number>`. `test/site-tables.typetest.ts`, checked by `tsc`, asserts that each generated schema is assignable to `SiteTables` and that its assessment columns match its config.

## Module changes

| Module | Change |
|---|---|
| `src/sites/` (new) | `types.ts`, `rubrics.ts`, `shadowyrealm.ts`, `index.ts` (registry and `siteFor(key)`) |
| `src/lib/atis-calculator.ts` | `DIMENSIONS`, `Dimension`, `DIMENSION_WEIGHTS`, `PERSISTENCE_TIME_CONSTANTS`, `TIER_THRESHOLDS` and `YEARS_PER_UNIT` leave. `calculateImpact`, the profile arithmetic and `classifyMagnitude` take a `ScoringConfig`. `Dimensions` becomes `Record<string, number>`, checked against the config at the boundaries. Period length moves into one function, `periodYears(period, asOf, timeline)`. |
| `src/lib/credit.ts` | `CREDIT_TYPES` comes from `site.linkTypes`. `AssessmentRow` becomes the fixed columns plus the config's `{key}_benefit` and `{key}_harm`. |
| `src/lib/clef.ts` | `AREAS` and the three level lists leave. `buildClefRequest(site, period)` takes the subject from the entity type, the wording from each dimension and the rubrics from `scoring.rubrics`. |
| `src/lib/sr-schemas.ts` | `schemasFor(site)` builds the zod enums for entity and link types and the per-dimension assessment fields. The minimum start comes from `site.timeline.start`. |
| `src/lib/sr-service.ts` | The client uses `db: { schema: site.schema }`. The select lists at lines 378 and 485 are built from the dimension keys. The evidence is read from the first dimension's justification. `addRelationship` checks the link type's allowed entity types. `setEntityStatus` refuses `published` while `scoring.tiers` is `null`. Rows are typed by `SiteTables`. |
| `src/lib/timeline.ts` | `TIMELINE_START`, `TIMELINE_TICKS`, `NEAR` and `BUCKET_COUNT` leave. `yearToUnit`, `unitToYear` and `bucketEdges` take a `Timeline`. |
| `src/lib/copy.ts` | Becomes ShadowyRealm's `copy` in its config. |
| `src/lib/research.ts`, `tools/realm-load.ts` | `User-Agent` from `site.brand`. |
| `src/worker/index.ts`, `env.ts` | `SITE` var. A missing or unknown value answers 500 for every path. `X-Site` goes on every `/api/*` response. |
| `src/worker/mcp.ts` | Server name, instructions and every tool description that names dimensions, types or examples come from the config. |
| `src/worker/pages.ts` | `ORIGIN` and the schema come from the config. |
| `src/features/realm/api.ts` | The fetch wrapper compares `X-Site` with `import.meta.env.VITE_SITE` and throws `SiteMismatchError`, which the root route renders. |
| `ProfileCharts.tsx`, `ComparisonView.tsx`, `methodology.tsx` | `DIMENSION_LABELS` and `DIMENSION_MEANING` come from the config. Row counts follow the dimension count. The methodology prose and the unit's name come from the config. |
| `RealmHome.tsx` | The entity-type filters come from `entityTypes`. |
| `LineageGraph.tsx` | Its own `CREDIT_TYPES` set is removed; it uses the config. |
| `EntityProfilePage.tsx` | Link lists use `labels` or `labelsByTarget` for each end. The descriptive types come from `credit: false`. The dimension count and the unit's name come from the config. |
| `src/features/entities/types/index.ts` | Types come from `SiteTables`, not `Database["shadowyrealm"]`. |
| `index.html` | Title, description, Open Graph and site name through Vite's `%VITE_*%` replacement, set per mode. |
| `src/styles/global.css` | Keeps the token vocabulary. Values move to `src/sites/<site>/tokens.css`, imported through the `@site` alias. |
| `vite.config.ts` | The mode selects the site: `VITE_SITE`, the `@site` alias to `src/sites/<site>/`, and `build.outDir` of `dist/<site>`. |
| `content/types.ts` | `SiteContent<E extends string, L extends string>`. `content/realm.ts` uses ShadowyRealm's unions. |
| `tools/site-schema.ts` (new) | Prints a site's DDL (Requirement 5). |
| `package.json` | `build` runs `tsc`, then `vite build --mode <site>` for each registered site. `db:types` lists every site's schema. `deploy:<site>` runs `wrangler deploy --env <site>`. |
| `wrangler.json` | Top level: `SITE=shadowyrealm`, assets `./dist/shadowyrealm`. |
| `tools/check-tokens.config.json` | Checks every site's token file. |
| `e2e/`, `playwright.config.ts` | Specs that name ShadowyRealm content move under a ShadowyRealm project. A site-neutral project checks page structure on any site through `E2E_BASE_URL`. |

## Testing

| Test | What it proves |
|---|---|
| `test/atis-calculator.test.ts`, run once per registered config | The calculator's properties hold for any dimension set and unit |
| `test/clef-request.test.ts` | ShadowyRealm's request equals a snapshot taken before the refactor, byte for byte |
| `test/site-config.test.ts` | Every config meets Requirement 2: dimension count, identifiers, ten levels per rubric, link endpoints within its own entity types, credit types a subset of link types, ticks within the timeline |
| `test/site-tables.typetest.ts` | Every generated schema fits `SiteTables` and matches its config |
| `tools/site-schema.ts shadowyrealm` | Loaded into a throwaway `supabase/postgres` container, it diffs clean against the local stack's `shadowyrealm` schema |
| API identity | Before the refactor ships, `/api/scores`, `/api/realm` and five `/api/entities/:slug` responses from production are saved. They are compared against a local `wrangler dev` of the refactor, against the same data and as-of year. |
| e2e | The ShadowyRealm project against shadowyrealm.com; the site-neutral project against every deployed site |

## Decisions

| Decision | Why |
|---|---|
| A schema per site, not a site column | Row-level security, grants, the credit walk and Data API exposure stay separate per site, and ShadowyRealm's schema needs no migration |
| Columns named after dimensions, not jsonb | The code already reads `${d}_benefit`, and each column keeps its own check constraint |
| DDL generated from the config | A schema and its config cannot disagree, and each new site's handoff is the same reviewed template |
| A deployment per site, not one Worker choosing by hostname | Separate secrets, caches, sitemaps and deploys. A bad deploy of one site leaves the others up. |
| Up to 31 dimensions | Clef takes at most 64 questions per request. Two per dimension, plus reach and persistence, fits 31. |
| Rubrics and time constants in the config | A site on a timescale of weeks needs "faded within days" as a level; ShadowyRealm's lowest is "faded within a year" |
| Year is the only time unit here | Day placement needs date columns and a different axis, and the current-events spec is the right place to design them against real events. Period length and axis placement each sit in one function so that spec changes two functions. |
| Tiers are `null` until calibrated, and publishing is refused meanwhile | Borrowed thresholds would label entities on a distribution that does not exist yet |
| "Site", not "realm" | "Realm" already names the lineage page, `/api/realm` and `content/realm.ts` |
| Hand-written `SiteTables` with a type test | The service needs one row shape for every schema, and the type test catches a schema that drifts from it |
