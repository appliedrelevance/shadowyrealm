# Research & Design Decisions

## Summary
- **Feature**: `influence-graph`
- **Discovery Scope**: Complex Integration (calculator rework, a Postgres extension in the shared database, a new model)
- **Key Findings**:
  - The calculator nets the five signed dimensions inside each period, so harm cancels benefit before anything else happens. `magnitude` is only the absolute value of that net total.
  - `research_entity` drafts one whole-entity assessment with no period. Since the curve model (`69c1864`), an assessment with no `period_id` is counted as unplaced and scores zero, so the documented research → `add_assessment` flow produces entities that score nothing unless someone adds periods by hand.
  - Both databases run Postgres 17.6, so `WITH RECURSIVE … CYCLE` is available. pgRouting 3.4.1 is available but not installed on either. Apache AGE is not available on either.
  - Row-level security lets anyone read every draft's assessments, periods, links and audit trail, and lets any signed-in account write directly through PostgREST, bypassing the Worker.
  - There is almost no data. Cloud has 1 draft entity and nothing else; local has nothing. The benchmark has to seed its own entities.
  - The influence curve already gives the temporal-canvas spec (monorepo `shadowyrealm-temporal-perspective`) its "impact wake": the wake is the curve after the lifespan, plus the tail.

## Research Log

### Current scoring code
- **Context**: Where do magnitude, direction and graph credit plug in?
- **Sources Consulted**: `src/lib/atis-calculator.ts`, `src/lib/atis-inputs.ts`, `src/features/scoring/hooks/useAssessments.ts`, `src/components/ATISBreakdown.tsx`, `src/routes/methodology.tsx`
- **Findings**:
  - `calculateATIS(assessments, periods, relationships, config, asOfYear)` is the single entry point. Per period: `level = I_base × C_consensus × N_network × U_uncertainty`; score = area under the levels in influence-centuries, plus a fading tail after the last period.
  - `calculateUnboundedBaseImpact` takes the weighted mean of the signed dimension scores (weights: scientific 1.0, economic 1.0, human_rights 1.2, health 1.1, cultural 0.9). Example: +8, +8, +8 cultural, −9 human_rights, −9 health nets to 0.5.
  - `calculateNetworkAmplification` is a capped multiplier over the entity's own links (mentorship ×1.3, collaboration ×1.2, influence ×1.1, opposition ×0.9). It appears as the "Network" column in `ATISBreakdown` and in a section on the methodology page.
  - `buildATISInputs` hardcodes `consensus_score: 0.5`. `add_assessment` cannot set `controversy_level`, so the ×0.8 controversy penalty never fires through the real path.
  - The profile page and the comparison view load one entity at a time through browser hooks with the anon key.
- **Implications**:
  - Magnitude and direction are a change inside `calculateUnboundedBaseImpact` and the result type.
  - Graph credit replaces `calculateNetworkAmplification`, and the UI column and methodology section go with it.
  - Credit needs every reachable entity's own area, so scoring becomes a whole-dataset computation and the per-entity loading pattern changes.

### Research tool
- **Context**: How does scoring enter the system today?
- **Sources Consulted**: `src/lib/research.ts`, `src/lib/sr-schemas.ts`, `src/worker/mcp.ts`
- **Findings**:
  - One generative call, through AI Gateway to Anthropic or OpenRouter, returns type, biography, metadata, five whole-entity scores, justifications and a confidence figure as free JSON.
  - `Number(scores[key]) || 0` turns a missing or garbled score into 0 silently.
  - It needs `ANTHROPIC_API_KEY` or `OPENROUTER_API_KEY`.
- **Implications**: The research tool has to score per period to be useful at all under the curve model. Biography and metadata drafting can stay with the MCP client (Claude), which already reads the Wikipedia text.

### Clef
- **Context**: Replace generative scoring with a decision model.
- **Sources Consulted**: Cloudflare model page (fetched 2026-10-26); `appliedrelevance-home/src/lib/triage/suggest.ts`; monorepo `.kiro/specs/napkin-sketch-triage/research.md`
- **Findings**:
  - `env.AI.run("@cf/cloudflare/clef", { model: "clef", state, questions })`. `clef-flash` (9B) is the smaller sibling.
  - `questions` maps ids to typed questions, 1–64 per request. A `score` question has `instructions` and `criteria`, an array of levels ordered lowest first.
  - The context window is 65,536 tokens, and `state` is truncated to fit.
  - $0.24 per million input tokens; output is free.
  - Answer shape, confirmed in the napkin-sketch-triage build: `{ type, score, legend, probabilities: { "0": …, "1": …, … }, confidence }`. `suggest.ts` reads it strictly and throws on anything unusable.
  - The Worker already has the `AI` binding and `AI_GATEWAY_NAME`. Passing `{ gateway: { id } }` as the third argument routes through the gateway, as `suggest.ts` does.
  - The model page does not state a maximum number of levels for a `score` question. The experiment below found it is 10.
- **Implications**:
  - One request per period: 5 dimensions × a benefit question and a harm question is 10 questions, well under 64.
  - The expected value from `probabilities` gives a continuous score, and the probability spread gives `confidence_level` directly.
  - The provider secrets can go.

### Rubric experiment, 2026-10-26
- **Context**: Run a few entities through the proposed benefit/harm rubric before fixing the requirements.
- **Sources Consulted**:
  - Clef over Workers AI REST: 10 calls, 122,576 input tokens, about $0.03.
  - Wikipedia article extracts as evidence, plus one synthetic control ("Uncle Bob", a short invented biography of an ordinary man).
  - The real `calculateATIS`, run once on benefit + harm and once on benefit − harm.
  - Hand-set links: Jesus → Catholic Church 0.8, Catholic Church → First Crusade 0.5.
  - Scratch script and raw answers stayed in the session scratchpad.
- **Findings**:
  - **A `score` question takes at most 10 levels.** 11 is rejected with HTTP 422. Ten levels, read as 0–9 and scaled to 0–10, work.
  - **The answer's `score` field is the probability-weighted expected value**, so no client-side arithmetic is needed.
  - **Clef's `confidence` runs about 0.2 even on a sharply peaked answer.** Through `calculateUncertaintyFactor` that always lands on the 0.7 floor, so the uncertainty factor is a constant in practice.
  - **Total magnitude, in influence-centuries:**

    | Entity | Total magnitude |
    |---|---|
    | Catholic Church | 455 |
    | Jesus | 406 (own 41, credited 364) |
    | Shakespeare | 72 |
    | First Crusade | 43 |
    | 9/11 | 7.3 |
    | Harry Potter | 6.9 |
    | Uncle Bob | 1.0 |

  - **Benefit share of magnitude:** Shakespeare 86%, Harry Potter 77%, Bob 76%, Jesus 55%, Church 54%, First Crusade 26%, 9/11 14%.
  - **Jesus's own 41.4 is 41.2 tail.** His ministry's persistence (8) keeps its level fading across 1,996 years, on top of the 364 credited through the Church. The legacy is counted twice: once as his tail and once as credit.
  - **The First Crusade's 42.8 is 41.7 tail**, from persistence 6 over 927 years. The four-year event itself is 1.1.
  - **Recent entities are small by construction.** 9/11 and Harry Potter have had 25–29 years to accumulate area.
- **Implications**:
  - The rubric is 10 levels.
  - Drop the uncertainty factor, or replace it with something that varies.
  - A tail should not run for an entity whose legacy is carried by credited descendants. That is a change to Requirements 2 and 6.

### Shared database schema
- **Context**: What do the graph and scoring work have to fit?
- **Sources Consulted**: monorepo `supabase/migrations/20260810120000_baseline.sql`; live queries on cloud `qgfmwstgkwyqqwyqroav` and local gideon (read-only, 2026-10-26)
- **Findings**:
  - `relationships`: `source_entity_id`, `target_entity_id`, `relationship_type` enum (`influence`, `mentorship`, `collaboration`, `opposition`), `strength numeric(3,2)`, nullable, default 0.5, check 0–1. Also `temporal_overlap`, `unique (source, target, type)`, and a no-self-link check.
  - `entity_type` enum: `person`, `organization`, `event`. Fictional characters fit `person` (or `organization`/`event`); no enum change is needed.
  - `assessments`: integer scores −10 to 10, non-empty justifications, plus `sources text[]`, `confidence_level` and `controversy_level`.
  - `assessment_periods.geographic_scope` (default `'national'`) exists, but no code reads it.
  - Postgres is 17.6 on both cloud and local.
  - Extensions:

    | Extension | Cloud | Local (gideon) |
    |---|---|---|
    | `ltree` | installed | available, not installed |
    | `pg_graphql` | available, not installed | installed |
    | `pgrouting` 3.4.1, `postgis` 3.3.7 | available on both | available on both |
    | `age` | absent | absent |

  - Row counts: cloud has 1 entity (draft) and 0 assessments, periods and relationships; local has 0 of everything.
- **Implications**:
  - Credit needs no table change: `strength` is already a 0–1 share, and links already point from cause to consequence.
  - The CTE runs as-is on 17.6.
  - Local and cloud have drifted on `ltree` and `pg_graphql`. Fix that in the same migration handoff that installs pgRouting.

### Row-level security and grants
- **Context**: A scoring view over every entity must not publish drafts.
- **Sources Consulted**: baseline migration, policies and grants sections
- **Findings**:
  - `anon` has `SELECT` on all five `shadowyrealm` tables.
  - `assessments_select`, `periods_select`, `relationships_select` and `audit_select` are `USING (true)`. Only `entities` filters by status (`entities_select_published`).
  - `authenticated` has insert policies on entities, assessments, periods and relationships whose only check is `created_by = auth.uid()`. Any account that can sign in to the shared project can add an assessment to any entity, including a published one, straight through PostgREST.
  - `src/lib/operator-api.ts` says "The browser never writes to Supabase directly". That is true of our code but not enforced by the database.
- **Implications**:
  - Any score view has to join `entities` and filter to `published`, and must be created `with (security_invoker = true)`.
  - Tightening the policies is a migration in the monorepo root:
    - drop the `authenticated` write policies, because the Worker writes with the service role;
    - make the child-table select policies require a published parent.

### pgRouting 3.4.1
- **Context**: The extension experiment.
- **Sources Consulted**: `docs.pgrouting.org/3.4/en/pgr_johnson.html`; Supabase pgrouting guide
- **Findings**:
  - `pgr_johnson(edges_sql, directed DEFAULT true)` returns `(start_vid, end_vid, agg_cost)` for every reachable pair. Edges SQL needs `source`, `target` and `cost`. It is official since 2.0.0.
  - The docs say it processes "only edges with positive costs".
  - Install with `create extension pgrouting cascade`, which pulls in PostGIS. Extensions are database-wide in the shared project.
- **Implications**:
  - With `cost = −ln(strength)`, the shortest path is the strongest chain, and `exp(−agg_cost)` is the best share. One call returns the whole credit matrix.
  - A strength of 1.00 gives cost 0, which may be dropped. Clamp the cost to a small positive minimum, or test on a throwaway database.

### Recursive CTE
- **Context**: The in-core version, with no install.
- **Sources Consulted**: PostgreSQL 17 `WITH RECURSIVE` and `CYCLE` clause
- **Findings**: Start from each entity's outgoing influence links and step one hop at a time, multiplying the shares. `CYCLE entity_id SET is_cycle USING path` stops loops, and `max(share)` per pair keeps the strongest chain.
- **Implications**: It returns the same matrix as `pgr_johnson`, so the two implementations cross-check each other.

### Benchmark and launch run, 2026-11-07
- **Context**: Requirement 10. Score the benchmark end to end and set the tiers from the spread.
- **Sources Consulted**:
  - The 114-entity launch set in `content/`, which includes all eleven benchmark entities.
  - Scored through the production MCP tools: 140 periods, one Clef request each, with Wikipedia evidence of up to 7,800 characters per period.
  - Scores read with `get_scores` (`include_drafts: true`) before publishing.
- **Findings**:

  | Entity | Rank of 114 | Total | Own | Credited | Benefit | Harm |
  |---|---|---|---|---|---|---|
  | Catholic Church | 1 | 4,351.2 | 3,575.7 | 775.5 | 2,053.3 | 2,297.9 |
  | Jesus | 3 | 3,481.9 | 0.9 | 3,481.0 | 1,643.3 | 1,838.6 |
  | Buddhism | 4 | 2,874.3 | 2,874.3 | 0.0 | 2,003.2 | 871.1 |
  | The Buddha | 6 | 2,605.8 | 18.9 | 2,586.9 | 1,816.5 | 789.3 |
  | Islam | 8 | 1,834.3 | 1,826.9 | 7.4 | 1,003.6 | 830.7 |
  | Muhammad | 9 | 1,667.3 | 16.5 | 1,650.9 | 909.6 | 757.7 |
  | First Crusade | 36 | 264.6 | 264.6 | 0.0 | 63.3 | 201.3 |
  | William Shakespeare | 61 | 153.5 | 153.5 | 0.0 | 122.8 | 30.7 |
  | Osama bin Laden | 85 | 97.0 | 45.0 | 52.0 | 20.9 | 76.0 |
  | al-Qaeda | 95 | 74.2 | 48.7 | 25.6 | 16.5 | 57.7 |
  | War on Terror | 108 | 43.9 | 43.9 | 0.0 | 11.4 | 32.5 |
  | Harry Potter | 112 | 32.5 | 32.5 | 0.0 | 26.9 | 5.6 |
  | September 11 attacks | 114 | 28.4 | 2.0 | 26.4 | 7.3 | 21.0 |

  - Totals over all 114 entities run from 28.4 (September 11 attacks) to 4,351.2 (Catholic Church), with a median of 161.3.
  - Duration dominates. Institutions that have lasted millennia lead (Catholic Church, Judaism, Buddhism, Roman Empire). Founders rank beside them on credit alone: Jesus's own 0.9 is his three-year ministry.
  - The tail rule ranks short events with linked consequences low. World War II has its own six years (30.2) plus credit from the Cold War and the United Nations, 185.4 in all, and ranks 51st, below the Holodomor (191.5), which has no consequences linked and keeps its tail. The September 11 attacks rank last for the same reason.
  - Credit through drafts and through the published set matched, because every launch entity was published.
- **Implications**:
  - Tier rule: the boundaries are the round values nearest the 20th, 50th, 80th and 95th percentiles of total magnitude, which were 76.3, 161.3, 571.6 and 2,239.7. That gives `TIER_THRESHOLDS` of 100, 200, 500 and 2,000, with 32, 33, 23, 19 and 7 entities from lowest to highest tier. Readers see the labels Notable, Major, Great, Epochal and Legendary; the tier keys still name the colour tokens.
  - The all-or-nothing tail rule was then replaced (see the next decision).

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|---|---|---|---|---|
| TypeScript credit | Calculator walks all edges in memory | No database change | Explores nothing in Postgres | Rejected: misses the point of the platform |
| Recursive CTE view | Best share per (ancestor, descendant) pair in SQL | Core Postgres, no install, readable by any client | Enumerates paths, so it is exponential on dense graphs; irrelevant at this size | **Primary** |
| pgRouting `pgr_johnson` | All-pairs shortest path on `−ln(strength)` | One call, real graph algorithm | Extension install on the shared database; zero-cost edge question | **Experiment**, cross-checks the CTE |
| Apache AGE | Cypher inside Postgres | Native graph queries | Not available on cloud or local | Rejected |
| Area in SQL | Move the period-curve math into SQL too | One place for everything | Duplicates the calculator; two implementations drift | Rejected: shares in SQL, area in TypeScript |

## Design Decisions

### Decision: The score is a ten-number profile; magnitude only ranks
- **Context**:
  - Netting harm against benefit measured net benefit, not influence (2026-10-11 benchmark).
  - On 2026-10-26 Geordie objected to collapsing impact to one or two numbers: that would make Jesus "as consequential as my uncle Bob".
- **Alternatives Considered**:
  1. Net benefit (keep as is).
  2. Magnitude plus a −1 to +1 direction.
  3. Keep the ten numbers (benefit and harm per dimension) all the way through.
- **Selected Approach**: 3.
  - Each dimension stores a benefit level and a harm level, 0–10, in place of one signed score.
  - Each of the ten numbers gets its own level, curve, tail and credit. The arithmetic is linear, so the ten areas add up exactly to magnitude.
  - Magnitude ranks entities and assigns tiers. Nothing computes a net score or a direction.
  - The extraordinary-achievement bonus goes, because its power curve would break that linearity.
- **Rationale**:
  - A direction near 0 reads like "did little" even when it is enormous harm balanced by enormous benefit.
  - Geordie's own rules (founders credited for movements, intent immaterial) need credit that doesn't depend on moral direction.
  - The column change is free now: cloud holds no assessments.
- **Status**:
  - Influence over net benefit: Claude's pick, 2026-10-25; Geordie did not object.
  - Benefit and harm columns: Claude's pick, 2026-10-26.
  - Ten-number profile, no direction: approved by Geordie, 2026-10-26 ("yes, revise the requirements").

### Decision: No tail when descendants carry the legacy
- **Context**: In the rubric experiment, 41.2 of Jesus's own 41.4 was the tail of his ministry. That tail sat on top of 364 credited through the Church, so his legacy was counted twice.
- **Selected Approach**: An entity with at least one outgoing credit-bearing link gets no tail after its last period. An entity with none keeps its tail; the First Crusade, for example, still fades over the following centuries.
- **Status**: Approved by Geordie, 2026-10-26.

### Decision: The tail shrinks by the credit passed on (2026-11-07)
- **Context**: Under the all-or-nothing rule, any outgoing credit link removed an entity's tail. In the launch run World War II ranked 51st, below the Holodomor and Santa Claus, because its links to the Cold War and the United Nations (0.7 in all) removed the tail of a six-year event. The September 11 attacks ranked last for the same reason.
- **Selected Approach**: The tail is scaled by `max(0, 1 − Σ outgoing credit shares)`. An entity that passes on all of itself keeps no tail, as before, and the double count the original rule prevented stays prevented. Jesus passes 0.8 to the Church and keeps a fifth of his ministry's tail.
- **Result**: World War II moved to 42nd (277.7), above the Holocaust (251.2) and World War I (245.4). The September 11 attacks rose from 28.4 to 48.0. Jesus's own rose from 0.9 to 40.2.
- **Status**: Claude's pick, made during the unattended run Geordie asked for. Reverting is one line in `calculateImpact`.

### Second wave, 2026-11-07
- **Context**: 500 more entities, drafted by era and domain (`content/next-500.ts`), loaded through the production MCP tools four at a time and published. Scored with the proportional tail.
- **Findings**:
  - The index holds 614 entities, 712 Clef-scored periods, 289 links and 936 credit pairs. The assessments table is 19 MB.
  - Totals run from 6.4 to 5,393.6, with a median of 186.5. The leaders are long-lived civilisations and religions: Ancient Egypt, the Maya, Hinduism, the Catholic Church, the Bantu expansion, Judaism.
  - The 20th, 50th, 80th and 95th percentiles are 82.4, 186.5, 607.1 and 1,686.5, so the tier rule still gives 100, 200, 500 and 2,000. That puts 159, 165, 147, 123 and 20 entities in the tiers from Notable to Legendary.
  - `/api/realm` is 195 KB gzipped and the first computation took 0.6 s.

### Decision: Reality is irrelevant
- **Selected Approach**: Fictional characters and legal fictions are entities like any other, scored on what the idea of them did. No field records existence.
- **Status**: Decided by Geordie, 2026-10-25.

### Decision: Credit flows upstream, multi-hop, by the strongest chain
- **Context**: Harm done by institutions in a figure's name must reach the figure, and "historical impact demands a richer model" than one hop.
- **Selected Approach**:
  - Links point from cause to consequence (Jesus → Church, Church → Crusades, 9/11 → War on Terror).
  - An ancestor's share of a descendant is the largest product of `strength` over any chain between them.
  - For each of the ten profile numbers: `total(entity) = own(entity) + Σ best_share × own(descendant)`.
  - `influence` and `mentorship` carry credit. `collaboration` and `opposition` are descriptive. A reaction is recorded as `influence` from whatever provoked it, since intent doesn't matter.
- **Status**:
  - Multi-hop: decided by Geordie, 2026-10-25.
  - Strongest chain and which types carry credit: Claude's pick.

### Decision: An entity gives away at most 100% of itself
- **Selected Approach**: `addRelationship` rejects an influence or mentorship link that would push the target's incoming strengths over 1. This is a service-layer check, with no migration.
- **Rationale**: The number of descendants is unbounded, but each contributes a fraction of something finite.
- **Status**: Proposed, 2026-10-25.

### Decision: Count each thing once
- **Selected Approach**: A movement's periods score its direct activity. Anything big enough to be its own entity (the Crusades, the Inquisition) is scored there and credited back along the link. Clef's question instructions carry this rule.
- **Status**: Proposed, 2026-10-25.

### Decision: Events
- **Selected Approach**: An event's lasting weight comes from its own aftermath periods, its persistence tail, or downstream entities linked to it. Use one of the first and third for any given consequence, not both.
- **Status**: Proposed, 2026-10-25.

### Decision: Clef scores; no generative model in the Worker
- **Selected Approach**:
  - A new `score_period` tool asks Clef, per period, twelve `score` questions with evidence text supplied by the MCP client as `state`: a benefit and a harm question for each dimension, plus the period's reach and persistence.
  - It writes the assessment directly, marked `ai_suggested`, and sets the period's reach and persistence factors. Entity status already gates what the public sees.
  - Benefit and harm use a ten-level intensity rubric (Clef's maximum), with breadth left to the reach question so reach is not counted twice. Clef's `score` field, an expected value from 0 to 9, is scaled to 0–10.
  - The mean of the answers' `confidence` is stored, but the calculator no longer uses it.
  - The evidence excerpt goes in the required justification column.
  - There is no fallback model, as in napkin-sketch-triage.
  - `research_entity` keeps only the Wikipedia lookup. Biography and metadata drafting stays with the MCP client.
- **Status**: Raised by Geordie, 2026-10-25; approach is Claude's pick.

### Decision: Shares in Postgres, area in TypeScript, scores served by the Worker
- **Selected Approach**:
  - A `security_invoker` view returns best shares for published entities.
  - The service layer computes own areas with the existing calculator and combines them with the shares.
  - The result is exposed as an MCP tool and a `GET /api/scores` endpoint. The UI displays it, so one entity cannot score differently on two screens.
- **Status**: Claude's pick.

### Decision: Remove network amplification, consensus, controversy, uncertainty and the extraordinary bonus
- **Selected Approach**:
  - Graph credit replaces the capped network multiplier.
  - The consensus factor (hardcoded 0.5) and the controversy penalty (never settable) are dead in practice and go.
  - The uncertainty factor goes because Clef's confidence (about 0.2) always pins it at its 0.7 floor.
  - The extraordinary-achievement bonus goes for linearity (see the profile decision).
  - Their `ATISBreakdown` columns and methodology sections go too.
- **Status**: Approved by Geordie, 2026-10-26. Follows from the credit decision, the rubric experiment, and his 2026-10-02 objection to dead constants.

### Decision: The credit share view is not public
- **Selected Approach**: The view is granted to the service role only. Public scores reach readers through `GET /api/scores`, which counts published entities only, so drafts never leak through the view. Links get `strength NOT NULL`, since the column is nullable today.
- **Status**: Claude's pick, 2026-10-26.

### Decision: Re-anchor tiers after the benchmark
- **Selected Approach**:
  - Seed the benchmark entities: Jesus, Church, Crusades, Muhammad, Buddha, Shakespeare, Harry Potter, 9/11, War on Terror, al-Qaeda, bin Laden.
  - Score them, then set `TIER_THRESHOLDS` from the spread.
- **Status**: Claude's pick, 2026-10-16.

## Risks & Mitigations
- **pgRouting drops zero-cost edges** (strength 1.00). Clamp the cost to a small positive minimum and confirm on a throwaway database before the shared install.
- **Drafts are publicly readable, and signed-in accounts can write directly.** Hand off the policy tightening before any score is published.
- **Extensions and policies on the shared database belong to the monorepo root.** Every DDL item goes in a handoff for a session rooted there, with the exact SQL and a verification query.
- **The local and cloud databases have drifted.** Align `ltree`, `pg_graphql` and `pgrouting` in the same handoff, so `bun run db:types` and the e2e suite match production.

## References
- [Clef model page](https://developers.cloudflare.com/workers-ai/models/clef/): request and response schema, limits, pricing.
- [pgr_johnson, pgRouting 3.4](https://docs.pgrouting.org/3.4/en/pgr_johnson.html): all-pairs shortest path signature.
- [Supabase pgrouting guide](https://supabase.com/docs/guides/database/extensions/pgrouting): enabling the extension.
- [PostgreSQL 17, WITH queries](https://www.postgresql.org/docs/17/queries-with.html): recursive CTEs and the `CYCLE` clause.
- `/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance/supabase/migrations/20260810120000_baseline.sql`: `shadowyrealm` DDL, policies and grants.
- `/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance/.kiro/specs/napkin-sketch-triage/research.md`: Clef answer shape and the no-fallback decision.
- `/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance/.kiro/specs/shadowyrealm-temporal-perspective/requirements.md`: the canvas whose wake this feeds.
