# Implementation Plan

Starts when `site-platform` is complete.

- [x] 1. Name and domain
  - [x] 1.1 Prior Art, at priorart.shadowyrealm.com (Requirement 9.2)

- [ ] 2. Config
  - [ ] 2.1 `src/sites/inventions.ts`: dimensions, entity types, link types and labels, rubrics, unit, timeline, `tiers: null` (Requirements 2–6)
  - [ ] 2.2 Copy, methodology prose, tier descriptors and MCP instructions (Requirement 8)
  - [ ] 2.3 Confirm `test/site-config.test.ts` and the calculator tests pass for the new config

- [ ] 3. Schema
  - [ ] 3.1 Write `handoff.md` from `bun tools/site-schema.ts inventions`, with verification queries for the cloud project and the local stack (Requirement 1.1)
  - [ ] 3.2 A monorepo session applies it
  - [ ] 3.3 `bun run db:types`; the type test passes for `inventions` (Requirement 1.3)

- [ ] 4. Deploy
  - [ ] 4.1 `wrangler.json` `inventions` environment; set `MCP_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and `OWNER_USER_ID` secrets for it (Requirement 9.1)
  - [ ] 4.2 Working brand assets and token values in `src/sites/inventions/` (Requirement 9.3)
  - [ ] 4.3 `bun run build`, then `bunx wrangler deploy --env inventions`, serving at priorart.shadowyrealm.com (Requirement 9.2)

- [ ] 5. Benchmark
  - [ ] 5.1 `content/inventions/benchmark.ts` (Requirement 10.1)
  - [ ] 5.2 Load and score it as drafts through the site's MCP tools (Requirement 10.2)
  - [ ] 5.3 Record the results and the five expectations in `research.md`; explain any that fail (Requirements 10.3, 10.4)

- [ ] 6. Launch set
  - [ ] 6.1 `content/inventions/launch.ts` to 150 entities, held to the content rules in the design
  - [ ] 6.2 Load and score it
  - [ ] 6.3 Measure `credit_shares(false)` with `EXPLAIN ANALYZE`; hand off the relaxation if it exceeds 500 ms, and verify agreement on the benchmark (Requirement 7)
  - [ ] 6.4 Set the tier thresholds and record them (Requirement 10.5)

- [ ] 7. Launch
  - [ ] 7.1 Final brand: logo, hero, Open Graph image, tokens (Requirement 9.3)
  - [ ] 7.2 Deploy the final build to priorart.shadowyrealm.com (Requirement 9.2)
  - [ ] 7.3 Publish the launch set; run the site-neutral e2e project against the site
