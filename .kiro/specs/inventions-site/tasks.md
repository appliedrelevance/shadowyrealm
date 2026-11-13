# Implementation Plan

Starts when `site-platform` is complete.

- [x] 1. Name and domain
  - [x] 1.1 Prior Art, at priorart.shadowyrealm.com (Requirement 9.2)

- [x] 2. Config
  - [x] 2.1 `src/sites/inventions.ts`: dimensions, entity types, link types and labels, rubrics, unit, timeline, `tiers: null` (Requirements 2–6)
  - [x] 2.2 Copy, methodology prose, tier descriptors and MCP instructions (Requirement 8)
  - [x] 2.3 Confirm `test/site-config.test.ts` and the calculator tests pass for the new config

- [x] 3. Schema
  - [x] 3.1 Write `handoff.md` from `bun tools/site-schema.ts inventions`, with verification queries for the cloud project and the local stack (Requirement 1.1)
  - [x] 3.2 Applied to the cloud project (20261113105044) and gideon with Geordie's authorization; monorepo commit 57c037db
  - [x] 3.3 `bun run db:types`; the type test passes for `inventions` (Requirement 1.3)

- [x] 4. Deploy
  - [x] 4.1 `wrangler.json` `inventions` environment; set `MCP_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and `OWNER_USER_ID` secrets for it (Requirement 9.1)
  - [x] 4.2 Working brand assets and token values in `src/sites/inventions/` (Requirement 9.3)
  - [x] 4.3 `bun run build`, then `bunx wrangler deploy --env inventions`, serving at priorart.shadowyrealm.com (Requirement 9.2)

- [x] 5. Benchmark
  - [x] 5.1 `content/inventions/benchmark.ts` (Requirement 10.1)
  - [x] 5.2 Load and score it as drafts through the site's MCP tools (Requirement 10.2)
  - [x] 5.3 Record the results and the five expectations in `research.md`; explain any that fail (Requirements 10.3, 10.4)

- [x] 6. Launch set
  - [x] 6.1 `content/inventions/launch.ts` to 150 entities, held to the content rules in the design
  - [x] 6.2 Load and score it
  - [x] 6.3 Measure `credit_shares(false)` with `EXPLAIN ANALYZE` (Requirement 7): 332 pairs in 5.8 ms over 186 links, so the relaxation is not needed
  - [x] 6.4 Set the tier thresholds and record them (Requirement 10.5): 50, 100, 200, 2,000

- [x] 7. Launch
  - [x] 7.1 Final brand: logo, hero, Open Graph image, tokens (Requirement 9.3)
  - [x] 7.2 Deploy the final build to priorart.shadowyrealm.com (Requirement 9.2)
  - [x] 7.3 Publish the launch set (150 entities, then 159 with the originators of the six unlinked entries); the site-neutral e2e project passes against priorart.shadowyrealm.com, 11 of 11
