# Design Document

## Overview

The influence graph turns ShadowyRealm's score from net benefit into influence. Every entity carries ten numbers (benefit and harm for each of five dimensions), Clef scores each period from evidence, and a consequence passes a share of its own profile back to its causes along links, over any number of hops. Postgres computes the shares; a TypeScript calculator in the Worker computes the curves and areas; every screen and the MCP tools read one computation.

The design also covers the public demo built on it: a home page whose centrepiece is a mirrored river of every entity's influence across five thousand years, a lineage graph, and profile and comparison pages that only display what the Worker computes.

## Architecture

```
MCP client ──► /mcp (12 tools) ─┐
                                ├─► sr-service.ts ──► Supabase (shadowyrealm schema, service role)
Browser ──► /api/* (reads) ─────┘        │                 └─ credit_shares(): recursive CTE
                                         ├─► clef.ts ──► Workers AI @cf/cloudflare/clef (AI Gateway)
                                         └─► credit.ts + atis-calculator.ts (pure)
```

- **Writes** go only through `src/lib/sr-service.ts` with the service role. After the migration, signed-in users of the shared project hold no write policy or grant on the schema.
- **Scores** are computed per request from the whole published dataset (`loadScoring`), so no stored score can go stale. Visitor reads of `/api/scores`, `/api/realm` and `/api/entities/:slug` are cached at the edge for 60 seconds.
- **The browser computes no score.** It draws sampled curves and numbers from the Worker (Requirement 7.4).

## Data model

Migration `20261107000827_shadowyrealm_influence_graph` (monorepo `supabase/migrations/`), applied to the shared project on 2026-11-07:

| Change | Detail |
|---|---|
| `assessments` | `{dimension}_score` (−10..10) replaced by `{dimension}_benefit` and `{dimension}_harm`, `numeric(4,2)`, 0–10, not null. Justifications unchanged. A precondition check aborts if any assessment exists. |
| `relationships.strength` | `not null` |
| `credit_shares(published_only boolean default true)` | Recursive CTE with `CYCLE`; returns `(ancestor_id, descendant_id, share)`, the strongest chain per pair, self-pairs excluded. Execute granted to `service_role` only. |
| Policies | Every `authenticated` insert, update and delete policy dropped; child-table select policies require a published parent (links: both ends). |
| Grants | `authenticated` keeps only `SELECT`; sequences revoked from `anon` and `authenticated`; default privileges match. |

## Components

### `src/lib/atis-calculator.ts`
- `calculateImpact(assessments, periods, { hasCreditDescendants, asOfYear })` returns the ten-number `profile`, `magnitude` (their sum), `benefit_total`, `harm_total`, per-period `breakdown`, the `tail`, and the `curve` (segments plus fading tail parts).
- Level per number = weight × value × `reachMultiplier(reach)`, the mean over the period's assessments. Area = level × years / 100.
- The tail is scaled by `1 − creditPassedOn`, the sum of the entity's outgoing credit shares, and disappears at 1 or more. This refines Requirements 2.4 and 2.5; see research.md.
- `curveAreaBetween` and `sampleCurve` integrate the curve exactly. A bucket's value is its mean level, so a four-year event keeps its area inside a fifty-year bucket.
- Removed: the extraordinary bonus, consensus, controversy, uncertainty and network amplification (Requirement 2.8).

### `src/lib/credit.ts`
`composeScores` computes each entity's own impact, then adds `share × descendant own profile` number by number, using descendants' own profiles only (Requirement 6.4). It also returns every contributor and every ancestor credited, ranked.

### `src/lib/clef.ts`
- One request per period: the state is the subject, the period and the evidence. There are twelve `score` questions of ten levels each: benefit and harm per dimension, plus reach and persistence.
- The instructions name the entity's linked consequences and tell Clef to leave them out (Requirement 8.3).
- `readClefAnswers` is strict: an answer without a numeric expected value or confidence is an error naming the question. Benefit and harm are `score × 10/9`; reach and persistence are `round(score) + 1`.

### `src/lib/timeline.ts`
- One logarithmic axis of years before the present, from 3200 BCE to the end of the as-of year, shared by the Worker (bucket edges) and the browser (drawing). It has 200 buckets.
- The scale gives the twentieth century and the ancient world comparable room.

### Service and transport
| Surface | Read | Write |
|---|---|---|
| MCP | `list_entities`, `get_entity`, `research_entity` (Wikipedia only), `get_scores` | `create_entity`, `update_entity`, `set_entity_status`, `delete_entity`, `add_period`, `add_assessment` (benefit/harm), `add_relationship` (credit cap), `score_period` |
| HTTP | `GET /api/scores`, `GET /api/realm[?drafts=1]`, `GET /api/entities/:slug[?drafts=1]`, `GET /api/session` | `POST /api/entities/:slug/status` |

`?drafts=1` takes effect only with the owner's session token.

### Web UI (`src/features/realm/`)
- **Home** (`RealmHome`, `ImpactRiver`):
  - One band per entity for its own influence, benefit stacked above the axis and harm below, oldest nearest the axis.
  - Height uses a square-root transform of the stack boundaries, which keeps the tiling exact while keeping ancient bands visible.
  - Hover identifies a band; a click opens its profile. The ranked index below is the table view.
- **Lineage** (`/realm`, `LineageGraph`):
  - Entities sit at their first year on the same axis, sized by √total, with the circle split by benefit share.
  - Credit arrows run from cause to consequence, with width set by strength.
  - Selecting an entity lights its upstream and downstream chains and opens a panel with its top contributors.
- **Profile**:
  - Hero total, tier, and own versus credited.
  - The influence curve, with own impact solid and credited impact hatched.
  - The ten-number profile as diverging bars.
  - Lineage lists with shares, and periods with their stored evidence.
- **Compare**: total-curve overlays for up to five entities and a table of every profile number.
- **Colours**: brand extension tokens `benefit` (#3e9ad6) and `harm` (#d9534f), validated with the dataviz palette checker on the dark ground. The categorical series tokens were re-stepped into the dark lightness band.

## Content

- `content/*.ts` holds the launch set: 114 entities, 140 periods and 85 links, from Hammurabi to the COVID-19 pandemic.
- `tools/realm-load.ts` loads a content file through the MCP tools. It creates entities with Wikipedia thumbnails, adds periods and links, then scores every period with `score_period`.
- Evidence per period is the article's lead plus the sections that mention the period's years, capped at 7,800 characters.
- The loader is re-runnable and skips anything already present.

## Decisions that refine the requirements

| Requirement | Built as | Why |
|---|---|---|
| 4.1 "a view" | A `security invoker` SQL function `credit_shares(published_only)` | Public scores must walk only published entities. A view can filter its output but not its walk, so a draft in the middle of a chain would leak credit. |
| 4.1 "every pair reachable" | Chains stop below a share of 0.001 | Bounds path enumeration on a dense graph; contributions under 0.1% are invisible at the display precision. |
| 5 pgRouting | `pgrouting-crosscheck.sql`, run on a throwaway `supabase/postgres` 17.6 container | Installing pgRouting pulls PostGIS into the shared database for an experiment. The cross-check matched the CTE on every pair, including a 1.00-strength edge and a cycle. |
| 8.7 "return the stored row" | The stored row without its five justifications, plus a note | Each justification holds the evidence (up to 8,000 characters), so returning all five would make every response 40 KB. |
| 8 reruns | `score_period` replaces the period's earlier Clef assessment | A rerun is a correction; averaging it with the run it corrects would keep the error. |
| 7.3 one endpoint | `/api/scores` as specified, plus `/api/realm` and `/api/entities/:slug` | The river and the profile need curves and lineage. All three call the same `loadScoring` and `composeScores`. |
| 2.4, 2.5 tail | The tail is scaled by 1 − the credit shares passed on, rather than removed by any link | The all-or-nothing rule ranked World War II 51st once it was linked to the Cold War and the UN |
| 9 handoff | Applied directly with Geordie's authorization (2026-11-07) and committed in the monorepo as `b8ba8265` | Recorded in the migration file. `ltree` and `pg_graphql` drift on gideon is untouched; this work did not use gideon. |
| 10.1 benchmark on local | The benchmark and the launch content were loaded into the shared project as drafts through a local `wrangler dev`, then published | The benchmark entities are launch content, so loading them twice would duplicate the work. |
| 10.5 e2e seeding | The e2e suite seeds nothing and writes nothing | Content arrives through the MCP tools. The old global setup deleted every entity in the target database. |
