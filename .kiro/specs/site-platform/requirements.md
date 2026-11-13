# Requirements Document

## Introduction

ShadowyRealm's machinery is not specific to history. Periods, Clef scoring, reach and persistence, the credit graph and the logarithmic river work for any field where things cause other things. This feature turns the app into a **platform that serves many sites**. Each site is an index of its own field, scored on its own dimensions.

The platform rests on three rules:
- **One codebase, one config per site.** Everything specific to a field lives in one site config: dimensions, rubrics, entity types, link types, the timeline, the influence unit, tiers, copy and brand. The calculator, the credit composer, Clef, the service layer and every screen read the config, never their own constants.
- **One Postgres schema per site.** Each site gets its own schema in the shared Supabase project, built from ShadowyRealm's table shapes with columns named after its own dimensions. The code already reads profile columns as `{dimension}_benefit` and `{dimension}_harm`, so a site with different dimensions needs no new data model.
- **One deployment per site.** Each site has its own Worker, secrets, cache, domain and sitemap. A bad deploy of one site leaves the others up.

ShadowyRealm is the first site and keeps its behaviour exactly. The inventions site (spec `inventions-site`) is the second. A current-events site is planned as a spec of its own, and this spec keeps the dimension count, the rubrics and the time unit open for it.

Forecasting is shelved. A forecaster would learn from what was known at each date, so Requirement 12 keeps that record from now on: every score a period has had, and the exact revision of the evidence each score was computed from.

## Boundary Context
- **In scope**:
  - the site config and every module that reads it;
  - ShadowyRealm's config, extracted from today's constants;
  - one build and one Worker deployment per site;
  - generating a site's schema DDL from its config;
  - the tier calibration gate;
  - keeping every score and the revision of its evidence.
- **Out of scope**:
  - any site other than ShadowyRealm (each new site has its own spec);
  - time units shorter than a year;
  - forecasting;
  - links or shared entities between sites, and any combined view of several sites.
- **Adjacent expectations**:
  - Every change to the shared database is executed by a session rooted in the appliedrelevance monorepo, from a `handoff.md` in the spec of the site that needs it. This repo writes no migrations.
  - The current-events spec adds a `day` time unit and the date columns it needs. This spec puts the time unit in the config and keeps period length and axis placement each in one function, so that change stays local.

## Requirements

### Requirement 1: Sites are configuration
**Objective:** As the operator, I want a new site to be a config, a schema and a deployment, so that each new field costs content and judgment, not code.

#### Acceptance Criteria
1. The codebase shall define one `SiteConfig` per site in `src/sites/`, and a registry that returns a site's config by its key.
2. When the registry is asked for a key it does not hold, it shall throw an error naming the key and the keys it holds.
3. Adding a site shall need only:
   - a config in `src/sites/`;
   - its schema, applied by handoff;
   - a wrangler environment;
   - its brand assets in `src/sites/<site>/`;
   - its content in `content/<site>/`.
4. No module other than a site config shall declare a list of dimensions, entity types, link types, credit-bearing link types, rubric levels, persistence time constants or timeline ticks.

### Requirement 2: What a site may vary
**Objective:** As the operator, I want every field-specific choice to be a config value, so that a site about inventions or current events can be as specific as its field needs.

#### Acceptance Criteria
1. A site config shall set:
   - its key and its Postgres schema name;
   - its dimensions, from 1 to 31, each with a key, label, meaning, weight and Clef wording;
   - its intensity, reach and persistence rubrics, ten levels each, and the persistence time constant for each level;
   - the influence unit: the years per unit and the unit's name;
   - its entity types, each with labels, a Clef subject phrase, and the link type of which it must have at least one outgoing link, where the site requires one;
   - its link types, each with whether it carries credit, the entity types allowed at each end, and a label for each end;
   - its timeline: time unit, start, axis ticks, near offset and bucket count;
   - its tiers, or `null` while they are not calibrated;
   - its copy, brand and MCP server text.
2. The only time unit in this spec shall be `year`.
3. Each dimension key shall be a lowercase SQL identifier that, with its `_justification` suffix, fits Postgres's 63-character limit.
4. A unit test shall check every registered config against criteria 1 and 3, and check that every link type names only that site's entity types.

### Requirement 3: A pure scoring core
**Objective:** As the operator, I want the calculator and the credit composer to take a site's scoring config as an argument, so that one implementation scores every site and its tests run against every config.

#### Acceptance Criteria
1. The ATIS Calculator and the credit composer shall receive the site's scoring config as an argument and read no module-level dimension list, weights, rubric constants or tiers.
2. The calculator's unit tests shall run once for each registered site config.
3. Period length and the time axis shall each be computed in one function that takes the site's timeline, so that a later time unit changes those two functions only.

### Requirement 4: One deployment per site
**Objective:** As the operator, I want each site built and deployed on its own, so that a deploy, a cache or a secret of one site cannot reach another.

#### Acceptance Criteria
1. `wrangler.json` shall keep ShadowyRealm as the top-level Worker and shall hold one environment for each further site, each with its own Worker name, `SITE` variable, assets directory and routes.
2. The SPA build shall take its site from the Vite mode and write its output to `dist/<site>/`.
3. `index.html` shall take the title, description, Open Graph fields and site name from the build's site config.
4. `bun run build` shall typecheck once and build every registered site.
5. CI shall run the lint, the design-token check, the unit tests and the build for every site.
6. Each site's Worker shall have its own `MCP_API_KEY` secret.
7. When the Worker receives a request and its `SITE` variable is unset or names no registered site, the Worker shall answer 500 with a message naming the variable, and shall serve nothing else.
8. The Worker shall send an `X-Site` header with the site key on every `/api/*` response.
9. When an `/api/*` response's `X-Site` header differs from the site the SPA was built for, the SPA shall show an error naming both sites in place of the page.
10. Deploys shall stay manual: `bunx wrangler deploy` for ShadowyRealm and `bunx wrangler deploy --env <site>` for every other site.

### Requirement 5: One schema per site
**Objective:** As the owner of the shared database, I want each site's schema generated from its config, so that a schema and its config cannot disagree and every new site's handoff is mechanical.

#### Acceptance Criteria
1. `bun tools/site-schema.ts <site>` shall print the complete DDL for that site's schema. The DDL is a structural copy of `shadowyrealm` after migration `20261107000827`: enums, tables, identity columns, constraints, foreign keys, indexes, the `update_updated_at` function and triggers, row-level security, policies, grants, default privileges and `credit_shares`.
2. The generated DDL shall differ from `shadowyrealm` only in:
   - the schema name;
   - the `entity_type` and `relationship_type` enum values, which come from the config;
   - the dimension columns, which are `{key}_benefit` and `{key}_harm` (`numeric(4,2)`, 0–10, not null) and `{key}_justification` (text, not empty) for each dimension key;
   - the credit-bearing types that `credit_shares` walks.
3. When run for `shadowyrealm`, the tool's output shall match the live `shadowyrealm` schema, as compared by a schema diff of the local stack against a throwaway database loaded with the output.
4. `src/lib/database.types.ts` shall include every site's schema, and `bun run db:types` shall generate them.
5. A type test shall assert that every generated schema fits the service layer's shared `SiteTables` shape, and that each schema's assessment columns are exactly its config's dimension keys with the three suffixes.

### Requirement 6: Clef from the config
**Objective:** As the operator, I want Clef's questions built from the site's wording, so that each site's scoring speaks its field's terms.

#### Acceptance Criteria
1. The Clef request shall keep its shape: one request per period, a benefit and a harm question for each dimension, plus reach and persistence, each with ten levels.
2. Each dimension shall supply the area text, the phrase for who or what it affected, and the depth sentence its questions use.
3. Each entity type shall supply the subject phrase its questions use.
4. The rubrics shall come from the site config.
5. For the same input, ShadowyRealm's Clef request shall be identical, byte for byte, to the request built before this feature.

### Requirement 7: Screens from the config
**Objective:** As a reader, I want every screen to speak the site's own vocabulary, so that no site shows another's dimensions or examples.

#### Acceptance Criteria
1. The home page, lineage graph, profile, comparison and methodology pages shall take dimension labels, entity-type filters, link labels, the timeline, the influence unit, tiers and copy from the site config.
2. The profile and comparison charts shall lay out any number of dimensions from 1 to 31.
3. The methodology page shall list the site's dimensions, weights, rubrics and link types from the config, and shall take its prose from the site's copy.
4. A profile's lineage lists shall label each link with its link type's label for that end.

### Requirement 8: MCP surface and content
**Objective:** As the operator, I want each site's MCP server to describe its own vocabulary, so that an MCP client builds content in the right terms without reading the code.

#### Acceptance Criteria
1. Each site's MCP server shall take its server name, instructions and tool descriptions from the site config.
2. The MCP input schemas shall accept exactly the site's entity types, link types and dimension keys.
3. When `add_relationship` is called with an entity type that the link type does not allow at either end, the Service shall reject the call with a message naming the link type and the types it allows.
4. When `add_period` is called with a start before the site's timeline start, the Service shall reject it with a message stating the site's earliest year.
5. The content loader shall load any site's content file through that site's `/mcp`.
6. A content file shall be typed by its site, so that an entity type or link type the site lacks fails the typecheck.
7. When the content loader loads a file, it shall reject any entity whose type requires an outgoing link that the entity lacks in the same file, naming the entity and the link type.

### Requirement 9: Brand per site
**Objective:** As the owner, I want each site to have its own name, domain and look, so that readers meet each site as a site in its own right.

#### Acceptance Criteria
1. Each site config shall supply the site name, origin, page title, description, Open Graph image and alt text, logo, hero image and alt text, and design-token values.
2. The Worker's sitemap, entity pages and Wikipedia `User-Agent` shall use the site's name and origin.
3. Each site's token values shall use the Applied Relevance token vocabulary and pass `bun run lint:tokens`.

### Requirement 10: Tier calibration gate
**Objective:** As the owner, I want a new site's tiers set from its own results, so that no site labels entities on another site's distribution.

#### Acceptance Criteria
1. While a site's tiers are `null`, screens shall show no tier and the API shall return `tier: null`.
2. While a site's tiers are `null`, the Service shall reject `set_entity_status` to `published` with a message saying the site's tiers are not set.
3. A site's tier thresholds shall be the round values nearest the 20th, 50th, 80th and 95th percentiles of total magnitude from its first full scoring run, the rule ShadowyRealm used.

### Requirement 11: ShadowyRealm unchanged
**Objective:** As the owner, I want ShadowyRealm to behave exactly as before, so that the platform costs the live site nothing.

#### Acceptance Criteria
1. For the same data and as-of year, ShadowyRealm's `/api/scores`, `/api/realm` and `/api/entities/:slug` responses shall be identical before and after this feature, apart from the `X-Site` header.
2. ShadowyRealm's unit tests shall pass unchanged.
3. ShadowyRealm's e2e suite shall pass against production after its deploy.
4. The minimum start year for a ShadowyRealm period shall move from 5000 BCE to the site's timeline start of 3500 BCE. Before the change ships, a query of the published data shall confirm that no period starts earlier. The earliest period in `content/` starts in 1792 BCE.

### Requirement 12: The record a forecaster would need
**Objective:** As the owner, I want every score kept with the exact evidence it came from, so that a later forecasting layer can learn from what was known at each date. That record cannot be rebuilt afterwards.

#### Acceptance Criteria
1. When `score_period` replaces a period's earlier Clef assessment, the Service shall write the replaced assessment to the audit entry's `old_value`. That covers its benefit and harm levels, confidence, sources, creation time and evidence text, and the period's reach and persistence factors before the update.
2. The audit entry shall hold the evidence text once, not once per dimension.
3. The content loader shall record each period's evidence source as a Wikipedia revision permalink (`index.php?title=…&oldid=…`) for the revision it read.
4. The scoring core shall keep computing any site's scores as of a given year.
5. These changes shall alter no score. Requirement 11.1's identity check still holds.
