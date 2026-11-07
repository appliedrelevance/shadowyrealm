# Implementation Plan

- [x] 1. Shared database
  - [x] 1.1 Write the migration: benefit and harm columns, `strength not null`, `credit_shares()`, the write lockdown and published-only child reads (Requirements 1.1–1.3, 3.4, 4, 9.2–9.4)
  - [x] 1.2 Test it on a throwaway `supabase/postgres` 17.6 container loaded with the baseline `shadowyrealm` DDL. Results: (Jesus, Crusades) = 0.40; collaboration ignored; drafts excluded unless asked for; cycles terminate; anon cannot call the function; anon sees only links between published entities.
  - [x] 1.3 Cross-check the CTE against `pgr_johnson` on the throwaway database (`pgrouting-crosscheck.sql`). Every pair agrees, with and without drafts (Requirement 5).
  - [x] 1.4 Apply it to the shared project (version 20261107000827) and verify the grants, policies and function privileges. Commit the file in the monorepo (`b8ba8265`).
  - [x] 1.5 Update `src/lib/database.types.ts`.

- [x] 2. Calculator and credit
  - [x] 2.1 Rewrite `calculateImpact` around the ten-number profile: no netting, no bonus or factors, a tail only without credit descendants, plus the exact curve (Requirements 2.1–2.8)
  - [x] 2.2 `composeScores`: own plus share × descendants' own profiles, contributors and credits (Requirements 6.1–6.5)
  - [x] 2.3 Unit tests in `test/atis-calculator.test.ts`, run by `bun run test` (12 tests: linearity, no cancellation, averaging, tail rule, area equals magnitude, bucket means keep area)

- [x] 3. Clef and the service layer
  - [x] 3.1 `clef.ts`: twelve ten-level questions per period, strict answer reading, no fallback (Requirements 8.2–8.9)
  - [x] 3.2 `scorePeriod`: writes reach, persistence and one assessment with the evidence as justification; replaces an earlier Clef assessment of the same period
  - [x] 3.3 `addAssessment` with benefit and harm, and a required period (Requirements 1.4, 1.5)
  - [x] 3.4 `addRelationship` rejects credit shares into one target that total more than 1.00, naming the current total (Requirement 3.3)
  - [x] 3.5 `research_entity` returns the Wikipedia summary and categories only (Requirement 8.10)
  - [x] 3.6 `getScores`, `getRealm`, `getEntityProfile` over one `loadScoring`, with paging past Supabase's 1,000-row limit

- [x] 4. Transport
  - [x] 4.1 MCP: `score_period` and `get_scores`; updated descriptions and server instructions (Requirements 3.5, 7.1, 7.2, 8.1)
  - [x] 4.2 HTTP: `GET /api/scores`, `/api/realm`, `/api/entities/:slug`; drafts for the owner only; 60-second edge cache for visitors (Requirement 7.3)
  - [x] 4.3 Remove `ANTHROPIC_API_KEY` and `OPENROUTER_API_KEY` from the Worker (Requirement 8.11)

- [x] 5. Web UI
  - [x] 5.1 Home: the impact river and the ranked, filterable index
  - [x] 5.2 Lineage graph at `/realm`
  - [x] 5.3 Profile: total, tier, own versus credited, curve, ten-number bars, lineage, periods with evidence (Requirements 7.4–7.6)
  - [x] 5.4 Compare: curve overlays and a profile table
  - [x] 5.5 Methodology rewritten for the profile, credit and the tail rule (Requirement 7.7)
  - [x] 5.6 Benefit and harm tokens, and series tokens re-stepped, validated with the dataviz palette checker

- [x] 6. Content and benchmark
  - [x] 6.1 `content/` launch set and `tools/realm-load.ts`, an MCP client that gathers Wikipedia evidence per period
  - [x] 6.2 Load and score the benchmark and launch set through MCP (Requirements 10.1, 10.2)
  - [x] 6.3 Record the benchmark and set the tier thresholds from it (Requirements 10.3, 10.4)

- [x] 7. Tests and delivery
  - [x] 7.1 Replace the e2e global setup, which deleted every entity in its target, with read-only specs that run against production by default (Requirement 10.5)
  - [x] 7.2 Deploy, publish and verify in the browser
