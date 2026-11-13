# Implementation Plan

- [ ] 1. Baselines for the identity checks
  - [ ] 1.1 Save production's `/api/scores`, `/api/realm` and five `/api/entities/:slug` responses, with the as-of year they were computed for (Requirement 11.1)
  - [ ] 1.2 Save ShadowyRealm's Clef request for three periods of different entity types as test fixtures (Requirement 6.5)
  - [ ] 1.3 Query the published data for the earliest period start (Requirement 11.4)

- [ ] 2. Site config and the scoring core
  - [ ] 2.1 `src/sites/types.ts`, `rubrics.ts`, `shadowyrealm.ts` and the registry, with ShadowyRealm's config built from today's constants (Requirements 1, 2)
  - [ ] 2.2 The calculator and the credit composer take a `ScoringConfig` (Requirement 3)
  - [ ] 2.3 Run the calculator tests once per registered config, and add `test/site-config.test.ts` (Requirements 2.3, 3.2)
  - [ ] 2.4 `buildClefRequest(site, period)`, with the byte-identity test against the fixtures from 1.2 (Requirement 6)
  - [ ] 2.5 `timeline.ts` takes a `Timeline` (Requirement 2.1)

- [ ] 3. Service, transport and crawler pages
  - [ ] 3.1 `schemasFor(site)`; the service's schema client, select lists and `SiteTables`; the link-endpoint check; the earliest start; the tier gate (Requirements 5.5, 8.2–8.4, 10)
  - [ ] 3.2 MCP server name, instructions and tool descriptions from the config (Requirement 8.1)
  - [ ] 3.3 The Worker's `SITE` check and `X-Site` header; `pages.ts` and the Wikipedia `User-Agent` from the brand (Requirements 4.7, 4.8, 9.2)
  - [ ] 3.4 `score_period` writes the replaced assessment and the prior reach and persistence to the audit log; the loader records revision permalinks (Requirement 12)

- [ ] 4. Screens
  - [ ] 4.1 Every screen from the config, with charts for 1 to 31 dimensions (Requirement 7)
  - [ ] 4.2 The SPA's `X-Site` check and `SiteMismatchError` page (Requirement 4.9)

- [ ] 5. Build and deploy
  - [ ] 5.1 Vite modes, the `@site` alias, `dist/<site>/`, the `index.html` replacement, and token values moved to `src/sites/shadowyrealm/tokens.css` (Requirements 4.2, 4.3, 9.3)
  - [ ] 5.2 `bun run build` for every site; CI for every site; `check-tokens` for every token file (Requirements 4.4, 4.5)
  - [ ] 5.3 `wrangler.json`: `SITE=shadowyrealm` and assets `./dist/shadowyrealm` at the top level (Requirement 4.1)
  - [ ] 5.4 Content types parameterized by site; the loader's `User-Agent` from the brand; the loader's `requiresOutgoing` check (Requirements 8.5–8.7)

- [ ] 6. Schema tool
  - [ ] 6.1 `tools/site-schema.ts`, from the baseline and influence-graph migrations in the monorepo (Requirements 5.1, 5.2)
  - [ ] 6.2 Load `site-schema.ts shadowyrealm` into a throwaway `supabase/postgres` container and diff it against the local stack's `shadowyrealm` schema (Requirement 5.3)
  - [ ] 6.3 `db:types` lists every site's schema, plus `test/site-tables.typetest.ts` (Requirements 5.4, 5.5)

- [ ] 7. Verify and ship
  - [ ] 7.1 Compare a local `wrangler dev` of the refactor against the baselines from 1.1, using the same data and as-of year (Requirement 11.1)
  - [ ] 7.2 Unit tests pass unchanged; e2e split into the ShadowyRealm and site-neutral projects (Requirements 11.2, 7)
  - [ ] 7.3 Deploy ShadowyRealm and run its e2e suite against production (Requirement 11.3)
