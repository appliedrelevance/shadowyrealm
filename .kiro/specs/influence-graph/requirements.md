# Requirements Document

## Introduction

ShadowyRealm's score today measures net benefit. Within each period the five signed dimension scores are averaged, so harm cancels benefit. A figure who transformed science while causing mass death scores about the same as one who did nothing.

This feature makes the score measure **influence**:
- **Magnitude** is how much an entity changed the world. **Direction** is a separate figure for whether that change leaned towards benefit or harm.
- **Credit flows through a graph.** A consequence credits its causes along influence links, over any number of hops, by the strongest chain. Harm done by institutions in a figure's name reaches the figure: Crusades → Church → Jesus.
- **Postgres computes the graph.** ShadowyRealm doubles as a research platform for Supabase and Postgres extensions. The graph is computed with a recursive CTE, with pgRouting as a cross-check.
- **Clef scores each period.** Scoring moves from a generative model to Cloudflare's Clef decision model, one call per period.

Whether an entity really existed plays no part. Jesus, the Buddha, Santa, Rumpelstiltskin, Harry Potter, the Catholic Church and 9/11 are all scored on what the idea of them did.

Discovery findings and the rationale for each decision are in `research.md`.

## Boundary Context
- **In scope**:
  - the ATIS calculator in `src/lib/atis-calculator.ts`;
  - the shadowyrealm service layer, MCP tools and `/api` routes;
  - the research tool;
  - the profile, comparison and methodology screens;
  - a benchmark run on the local database.
- **Out of scope**:
  - the Temporal Canvas (monorepo spec `shadowyrealm-temporal-perspective`);
  - deploying the Worker;
  - publishing entities to the live site.
- **Adjacent expectations**:
  - Every change to the shared database is executed by a session rooted in the appliedrelevance monorepo, from a `handoff.md` in this spec folder. That covers columns, policies, extensions, views and functions. This repo writes no migrations.
  - The Temporal Canvas, when built, takes its impact wake from this feature's period curve and tail.

## Requirements

### Requirement 1: Benefit and harm per dimension
**Objective:** As the operator, I want each assessment to record benefit and harm separately for each dimension, so that a dimension with large effects in both directions still counts as large.

#### Acceptance Criteria
1. The shadowyrealm schema shall store, for each of the five dimensions (scientific, economic, human_rights, health, cultural), a benefit level and a harm level on each assessment. Each level is a number from 0 to 10.
2. The shadowyrealm schema shall no longer store the signed −10 to +10 dimension scores.
3. The shadowyrealm schema shall keep one required justification per dimension.
4. When `add_assessment` is called, the MCP Server shall require a benefit and a harm level for every dimension.
5. If any benefit or harm level is outside 0–10, the MCP Server shall reject the call with a message naming the field.

### Requirement 2: Influence magnitude and direction
**Objective:** As a reader, I want a score that says how much an entity mattered, and separately which way it leaned, so that influence is not cancelled out by harm.

#### Acceptance Criteria
1. The ATIS Calculator shall compute a period's magnitude level from the weighted mean of benefit + harm across the five dimensions.
2. The ATIS Calculator shall compute a period's signed level from the weighted mean of benefit − harm across the five dimensions.
3. The ATIS Calculator shall apply the same reach, uncertainty, curve and tail rules to the magnitude level and to the signed level.
4. The ATIS Calculator shall report an entity's direction as its signed total divided by its magnitude total, in the range −1 to +1.
5. If an entity's magnitude total is 0, the ATIS Calculator shall report its direction as 0.
6. The ATIS Calculator shall assign tiers by magnitude only.
7. The ATIS Calculator shall not apply the consensus factor or the controversy penalty.
8. The ATIS Calculator shall not apply network amplification.

### Requirement 3: Credit-bearing links
**Objective:** As the operator, I want link strength to mean "this share of the consequence is credited to the cause", so that institutions and events pass their impact back to the figures behind them.

#### Acceptance Criteria
1. The Scoring Service shall treat a link as pointing from cause (source) to consequence (target).
2. The Scoring Service shall treat `influence` and `mentorship` links as credit-bearing, and `collaboration` and `opposition` links as descriptive only.
3. When `add_relationship` creates a credit-bearing link, the Scoring Service shall reject it if the target's credit-bearing incoming strengths would then total more than 1.00. The rejection message shall state the current total.
4. The shadowyrealm schema shall require a strength on every link.
5. The MCP Server's `add_relationship` description shall state the cause → consequence direction, and that a reaction is recorded as `influence` from whatever provoked it.

### Requirement 4: Credit graph in Postgres
**Objective:** As the operator exploring Postgres, I want the credit shares computed in the database with a recursive CTE, so that the graph walk lives in SQL and any SQL client sees the same shares.

#### Acceptance Criteria
1. The shadowyrealm schema shall provide a view of best credit shares, one row per (ancestor, descendant) pair reachable through credit-bearing links. Each row carries the largest product of strengths over any chain between the two.
2. The credit share view shall use `WITH RECURSIVE` with a `CYCLE` clause, so that a cycle in the links ends that path rather than repeating it.
3. The credit share view shall exclude an entity's share of itself.
4. The credit share view shall be created with `security_invoker = true`.
5. The credit share view shall be readable by the service role and not by `anon`.
6. When the benchmark links are loaded, the credit share view shall return 0.40 for (Jesus, Crusades), given Jesus → Church at 0.8 and Church → Crusades at 0.5.

### Requirement 5: pgRouting cross-check
**Objective:** As the operator exploring Postgres extensions, I want the same shares computed with pgRouting, so that I can compare a real graph algorithm against the recursive CTE.

#### Acceptance Criteria
1. Where pgRouting is installed, the shadowyrealm schema shall provide a function that returns best credit shares computed with `pgr_johnson`, using edge cost −ln(strength).
2. Where pgRouting is installed, the pgRouting share function shall keep links with a strength of 1.00 in the graph.
3. When the benchmark links are loaded, the pgRouting share function and the credit share view shall return the same set of pairs, with shares that agree within 0.005.

### Requirement 6: Entity score composition
**Objective:** As a reader, I want an entity's score to include the credited share of everything downstream of it, so that a founder's score reflects the movement and the events it led to.

#### Acceptance Criteria
1. The Scoring Service shall compute an entity's own magnitude and own signed total from its own periods only.
2. The Scoring Service shall compute an entity's credited magnitude as the sum, over every descendant in the credit share view, of share × the descendant's own magnitude. It shall compute the credited signed total the same way.
3. The Scoring Service shall report total magnitude as own + credited, and direction as total signed ÷ total magnitude.
4. The Scoring Service shall use descendants' own totals, never their credited totals, so that no chain is counted twice.
5. While computing public scores, the Scoring Service shall include only published entities, both as ancestors and as descendants.

### Requirement 7: Scores served from one place
**Objective:** As the operator, I want one computation of scores that the MCP client and the web UI both read, so that an entity cannot score differently on two screens.

#### Acceptance Criteria
1. The MCP Server shall provide a read-only `get_scores` tool. It returns, for every entity, total magnitude, direction, tier, own magnitude, credited magnitude and the five largest credit contributors with their shares, ordered by total magnitude.
2. When `get_scores` is called with `include_drafts: true`, the MCP Server shall include entities of every status and label each entity's status.
3. The Worker shall serve `GET /api/scores` with the same fields for published entities only, without requiring sign-in.
4. The Web UI profile and comparison screens shall display scores from `GET /api/scores` and shall not compute scores in the browser.
5. The Web UI profile screen shall show total magnitude, direction, tier, own versus credited magnitude, and the top credit contributors.
6. The Web UI shall show benefit and harm per dimension where it shows dimension scores today.
7. The methodology page shall describe magnitude, direction and credit, and shall not describe network amplification, consensus or controversy.

### Requirement 8: Clef scores each period
**Objective:** As the operator, I want each period scored by Clef from evidence I supply, so that scores are repeatable and tied to the text they came from.

#### Acceptance Criteria
1. The MCP Server shall provide a `score_period` tool that takes an entity slug, one of its period ids and an evidence text.
2. When `score_period` is called, the Research Tool shall make one Clef request through the Worker's `AI` binding and AI Gateway. The request shall have the evidence text as `state` and ten `score` questions: benefit and harm for each dimension.
3. The Research Tool's question instructions shall tell Clef to judge only from the evidence, to score only the entity's direct activity in that period, and to leave out consequences that exist as separate entities.
4. The Research Tool shall convert each answer to a level from 0 to 10 using the probability-weighted expected value over the rubric.
5. The Research Tool shall set the assessment's confidence to the mean of the ten answers' confidence values.
6. When the Clef answers are usable, the Research Tool shall write the assessment for that period with `ai_suggested = true` and `ai_model_used = "@cf/cloudflare/clef"`. Each justification shall be the evidence excerpt the dimension was judged on. The tool shall return the stored row.
7. If Clef returns an answer without usable probabilities, the Research Tool shall write nothing and return an error naming the question. It shall not substitute a default value.
8. The Research Tool shall not fall back to another model.
9. The `research_entity` tool shall return the Wikipedia summary and categories only, with no generative model call.
10. The Worker shall no longer require `ANTHROPIC_API_KEY` or `OPENROUTER_API_KEY`.

### Requirement 9: Shared database changes, by handoff
**Objective:** As the owner of the shared database, I want every schema, policy and extension change delivered as a precise handoff, so that a session in the monorepo root can apply it without rediscovery.

#### Acceptance Criteria
1. This spec shall include a `handoff.md` with the exact SQL for:
   - Requirements 1, 3.4, 4 and 5;
   - the policy changes in criteria 2 and 3;
   - installing pgRouting on cloud and local;
   - aligning `ltree` and `pg_graphql` between cloud and local.
   Each change shall come with a verification query and its expected result.
2. The shadowyrealm schema shall let `anon` read assessments, periods, links and audit entries only for published entities.
3. The shadowyrealm schema shall have no insert, update or delete policies for the `authenticated` role, because the Worker writes with the service role.
4. The handoff shall state that cloud holds no shadowyrealm assessments, periods or links, and one draft entity, on 2026-10-26. It shall also state that the column replacement in Requirement 1 must stop if that is no longer true.

### Requirement 10: Benchmark and tiers
**Objective:** As the operator, I want a benchmark set scored end to end on the local database, so that tiers are anchored to real results and the credit graph is exercised.

#### Acceptance Criteria
1. The Benchmark shall create, through the MCP tools against the local database:
   - the entities Jesus, Catholic Church, First Crusade, Muhammad, the Buddha, Shakespeare, Harry Potter, al-Qaeda, Osama bin Laden, 9/11 and War on Terror;
   - their periods;
   - the links Jesus → Catholic Church, Catholic Church → First Crusade, Osama bin Laden → al-Qaeda, al-Qaeda → 9/11 and 9/11 → War on Terror.
2. The Benchmark shall score every period with `score_period`, using evidence text gathered from Wikipedia.
3. When the Benchmark completes, `research.md` shall record each entity's total magnitude, direction, own and credited magnitude, and the date of the run.
4. When the Benchmark completes, the ATIS Calculator's tier thresholds shall be set from the benchmark spread, and `research.md` shall record the rule used.
5. The e2e suite shall seed its data through the service layer, not through UI forms.
