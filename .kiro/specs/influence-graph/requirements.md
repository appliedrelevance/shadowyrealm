# Requirements Document

## Introduction

ShadowyRealm's score today measures net benefit. Within each period the five signed dimension scores are averaged, so harm cancels benefit. A figure who transformed science while causing mass death scores about the same as one who did nothing.

This feature makes the score measure **influence**, and keeps the shape of that influence visible:
- **A ten-number profile.** Every entity carries benefit and harm for each of the five dimensions: scientific, economic, human rights, health and cultural. The profile is never collapsed into a net score or a direction. Magnitude, the sum of the ten numbers, is used only to rank entities and assign tiers.
- **Credit flows through a graph.** A consequence credits its causes along influence links, over any number of hops, by the strongest chain. Harm done by institutions in a figure's name reaches the figure: Crusades → Church → Jesus.
- **Postgres computes the graph.** ShadowyRealm doubles as a research platform for Supabase and Postgres extensions. The graph is computed with a recursive CTE, with pgRouting as a cross-check.
- **Clef scores each period.** Scoring moves from a generative model to Cloudflare's Clef decision model, one call per period.

Whether an entity really existed plays no part. Jesus, the Buddha, Santa, Rumpelstiltskin, Harry Potter, the Catholic Church and 9/11 are all scored on what the idea of them did.

Discovery findings, the 2026-10-26 rubric experiment and the rationale for each decision are in `research.md`.

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

### Requirement 2: The ten-number impact profile
**Objective:** As a reader, I want an entity's impact kept as ten numbers through every step, so that a figure whose huge harms and huge benefits roughly balance is not mistaken for one who did little.

#### Acceptance Criteria
1. The ATIS Calculator shall treat an entity's impact as a profile of ten numbers: benefit and harm for each of the five dimensions.
2. The ATIS Calculator shall compute each profile number's level for a period as dimension weight × the assessed 0–10 value × the period's reach multiplier, taking the mean across that period's assessments.
3. The ATIS Calculator shall compute each profile number's area in influence-centuries under the existing curve rules: periods laid end to end, overlapping periods adding, and gaps contributing nothing.
4. While an entity has no outgoing credit-bearing link, the ATIS Calculator shall add a fading tail after its last period to each profile number, at the rate set by that period's persistence factor.
5. If an entity has at least one outgoing credit-bearing link, the ATIS Calculator shall not add a tail, because its descendants carry its legacy.
6. The ATIS Calculator shall report magnitude as the sum of the ten profile areas, and shall assign tiers by magnitude.
7. The ATIS Calculator shall not combine the profile into a net score, a direction or a ratio.
8. The ATIS Calculator shall not apply the extraordinary-achievement bonus, the consensus factor, the controversy penalty, the uncertainty factor or network amplification. The ten profile areas shall add up exactly to magnitude.

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
**Objective:** As a reader, I want an entity's profile to include the credited share of everything downstream of it, so that a founder's score reflects the movement and the events it led to.

#### Acceptance Criteria
1. The Scoring Service shall compute an entity's own profile from its own periods only, as in Requirement 2.
2. The Scoring Service shall compute an entity's credited profile number by number. Each number is the sum, over every descendant in the credit share view, of share × the descendant's own value of that number.
3. The Scoring Service shall report the total profile as own + credited for each of the ten numbers, and total magnitude as the sum of the total profile.
4. The Scoring Service shall use descendants' own profiles, never their credited profiles, so that no chain is counted twice.
5. While computing public scores, the Scoring Service shall include only published entities, both as ancestors and as descendants.

### Requirement 7: Scores served from one place
**Objective:** As the operator, I want one computation of scores that the MCP client and the web UI both read, so that an entity cannot score differently on two screens.

#### Acceptance Criteria
1. The MCP Server shall provide a read-only `get_scores` tool that returns, for every entity, ordered by total magnitude:
   - total magnitude and tier;
   - own magnitude and credited magnitude;
   - the ten-number total profile, split into own and credited parts;
   - the benefit total and the harm total (the sums of the five benefit numbers and of the five harm numbers);
   - the five largest credit contributors, each with its share and the magnitude it contributed.
2. When `get_scores` is called with `include_drafts: true`, the MCP Server shall include entities of every status and label each entity's status.
3. The Worker shall serve `GET /api/scores` with the same fields for published entities only, without requiring sign-in.
4. The Web UI profile and comparison screens shall display scores from `GET /api/scores` and shall not compute scores in the browser.
5. The Web UI profile screen shall show total magnitude, tier, own versus credited magnitude, the ten-number profile with its own and credited parts, and the top credit contributors.
6. The Web UI shall show benefit and harm side by side wherever it shows dimension values.
7. The methodology page shall describe the profile, credit and the tail rule. It shall not describe network amplification, consensus, controversy, the uncertainty factor or the extraordinary-achievement bonus.

### Requirement 8: Clef scores each period
**Objective:** As the operator, I want each period scored by Clef from evidence I supply, so that scores are repeatable and tied to the text they came from.

#### Acceptance Criteria
1. The MCP Server shall provide a `score_period` tool that takes an entity slug, one of its period ids and an evidence text.
2. When `score_period` is called, the Research Tool shall make one Clef request through the Worker's `AI` binding and AI Gateway. The request shall have the evidence text as `state` and twelve `score` questions: benefit and harm for each dimension, plus the period's reach and its persistence.
3. The Research Tool's benefit and harm instructions shall tell Clef to:
   - judge only from the evidence;
   - rate the effect's intensity for the people it affected, leaving breadth to the reach question;
   - score only the entity's direct activity in that period;
   - leave out consequences that exist as separate entities.
4. Each benefit and harm question shall use a ten-level rubric, lowest first. The Research Tool shall convert Clef's expected value (0–9) to a level from 0 to 10 by multiplying it by 10/9.
5. The Research Tool shall set the period's reach factor and persistence factor to Clef's expected value rounded to the nearest level, plus one, giving 1–10.
6. The Research Tool shall store the mean of the twelve answers' confidence values as the assessment's confidence. The ATIS Calculator does not use it.
7. When the Clef answers are usable, the Research Tool shall write the assessment for that period with `ai_suggested = true` and `ai_model_used = "@cf/cloudflare/clef"`. Each justification shall be the evidence excerpt the dimension was judged on. The tool shall return the stored row.
8. If Clef returns an answer without a numeric expected value, the Research Tool shall write nothing and return an error naming the question. It shall not substitute a default value.
9. The Research Tool shall not fall back to another model.
10. The `research_entity` tool shall return the Wikipedia summary and categories only, with no generative model call.
11. The Worker shall no longer require `ANTHROPIC_API_KEY` or `OPENROUTER_API_KEY`.

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
3. When the Benchmark completes, `research.md` shall record each entity's total magnitude, own and credited magnitude, benefit and harm totals, and the date of the run.
4. When the Benchmark completes, the ATIS Calculator's tier thresholds shall be set from the benchmark spread, and `research.md` shall record the rule used.
5. The e2e suite shall seed its data through the service layer, not through UI forms.
