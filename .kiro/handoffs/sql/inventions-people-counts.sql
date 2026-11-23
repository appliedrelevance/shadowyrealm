-- Inventions counts people (shadowyrealm repo, .kiro/handoffs/music-and-inventions-schema.md).
--
-- The same change shadowyrealm had in 20261115071456_shadowyrealm_system_one_scoring,
-- for the inventions schema:
-- 1. Beside each of its ten levels, each assessment records the living people
--    affected in a typical year of its period (Clairic's count). Null for an
--    assessment made before; the Worker fills them when it re-scores a period.
-- 2. A scored assessment keeps its evidence once, in evidence, instead of in
--    every justification.
-- 3. Link strengths keep four places, because model-sized shares go down to
--    0.01 of a consequence.
-- No existing row changes value. The columns come from peopleColumns() in the
-- shadowyrealm repo's tools/site-schema.ts, so this matches what
-- `bun tools/site-schema.ts inventions` emits once Inventions counts people.

alter table inventions.assessments
  add column prosperity_benefit_people numeric constraint assessments_prosperity_benefit_people_check check (prosperity_benefit_people >= 0),
  add column prosperity_harm_people numeric constraint assessments_prosperity_harm_people_check check (prosperity_harm_people >= 0),
  add column health_benefit_people numeric constraint assessments_health_benefit_people_check check (health_benefit_people >= 0),
  add column health_harm_people numeric constraint assessments_health_harm_people_check check (health_harm_people >= 0),
  add column knowledge_benefit_people numeric constraint assessments_knowledge_benefit_people_check check (knowledge_benefit_people >= 0),
  add column knowledge_harm_people numeric constraint assessments_knowledge_harm_people_check check (knowledge_harm_people >= 0),
  add column freedom_benefit_people numeric constraint assessments_freedom_benefit_people_check check (freedom_benefit_people >= 0),
  add column freedom_harm_people numeric constraint assessments_freedom_harm_people_check check (freedom_harm_people >= 0),
  add column environment_benefit_people numeric constraint assessments_environment_benefit_people_check check (environment_benefit_people >= 0),
  add column environment_harm_people numeric constraint assessments_environment_harm_people_check check (environment_harm_people >= 0),
  add column evidence text;

alter table inventions.relationships
  alter column strength type numeric(5,4);
