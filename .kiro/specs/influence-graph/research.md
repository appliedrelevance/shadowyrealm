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
  - The model page does not state a maximum number of levels for a `score` question.
- **Implications**:
  - One request per period: 5 dimensions × a benefit question and a harm question is 10 questions, well under 64.
  - The expected value from `probabilities` gives a continuous score, and the probability spread gives `confidence_level` directly.
  - The provider secrets can go.

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

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|---|---|---|---|---|
| TypeScript credit | Calculator walks all edges in memory | No database change | Explores nothing in Postgres | Rejected: misses the point of the platform |
| Recursive CTE view | Best share per (ancestor, descendant) pair in SQL | Core Postgres, no install, readable by any client | Enumerates paths, so it is exponential on dense graphs; irrelevant at this size | **Primary** |
| pgRouting `pgr_johnson` | All-pairs shortest path on `−ln(strength)` | One call, real graph algorithm | Extension install on the shared database; zero-cost edge question | **Experiment**, cross-checks the CTE |
| Apache AGE | Cypher inside Postgres | Native graph queries | Not available on cloud or local | Rejected |
| Area in SQL | Move the period-curve math into SQL too | One place for everything | Duplicates the calculator; two implementations drift | Rejected: shares in SQL, area in TypeScript |

## Design Decisions

### Decision: The score measures influence; direction is separate
- **Context**: Netting harm against benefit measured net benefit, not influence (2026-10-11 benchmark).
- **Alternatives Considered**:
  1. Net benefit (keep as is).
  2. Magnitude plus direction.
  3. Report both, labelled.
- **Selected Approach**: 2.
  - Each dimension stores a benefit level and a harm level, 0–10, in place of one signed score.
  - Magnitude is the weighted mean of benefit + harm; the signed level is the weighted mean of benefit − harm. Both are carried through the curve and credit.
  - Direction is signed total ÷ magnitude total, from −1 to +1.
- **Rationale**:
  - Geordie's own rules (founders credited for movements, intent immaterial) only make sense if credit doesn't depend on moral direction.
  - Taking the absolute value of a signed score would still lose a dimension that is large in both directions (+9 benefit, −6 harm nets to +3). Storing benefit and harm keeps it.
  - The column change is free now: cloud holds no assessments.
- **Status**: Influence over net benefit: Claude's pick, 2026-10-25; Geordie did not object. Benefit and harm columns: Claude's pick, 2026-10-26, when writing requirements.

### Decision: Reality is irrelevant
- **Selected Approach**: Fictional characters and legal fictions are entities like any other, scored on what the idea of them did. No field records existence.
- **Status**: Decided by Geordie, 2026-10-25.

### Decision: Credit flows upstream, multi-hop, by the strongest chain
- **Context**: Harm done by institutions in a figure's name must reach the figure, and "historical impact demands a richer model" than one hop.
- **Selected Approach**:
  - Links point from cause to consequence (Jesus → Church, Church → Crusades, 9/11 → War on Terror).
  - An ancestor's share of a descendant is the largest product of `strength` over any chain between them.
  - `score(entity) = own area + Σ best_share × own area(descendant)`.
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
  - A new `score_period` tool asks Clef, per period, a benefit `score` question and a harm `score` question for each dimension, with evidence text supplied by the MCP client as `state`. It writes the assessment directly, marked `ai_suggested`. Entity status already gates what the public sees.
  - The expected value from `probabilities` is the level; the mean of the answers' `confidence` is the assessment's confidence.
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

### Decision: Remove network amplification, consensus and controversy
- **Selected Approach**:
  - Graph credit replaces the capped network multiplier.
  - The consensus factor (hardcoded 0.5) and the controversy penalty (never settable) are dead in practice and go.
  - Their `ATISBreakdown` column and methodology sections go too.
- **Status**: Claude's pick; follows from the credit decision and from Geordie's 2026-10-02 objection to dead constants.

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
- **Clef's maximum number of `score` levels is undocumented.** Confirm a 7-level rubric with a real call before fixing the rubric.
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
