# Handoff: the System One scoring columns

ShadowyRealm now scores each period with two models, Clef for depth and Clairic for the people affected (`ScoringConfig.breadth = "people"`, src/sites/shadowyrealm.ts). The Worker needs somewhere to store Clairic's head-counts, the evidence stored once, and link strengths finer than two places. This is the schema change for that. It belongs to the monorepo, which owns the shared database's migrations.

Prior Art (`inventions`) is not touched.

## Where

- **Checkout:** `/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance`, on `main`, the branch it is on.
- **Databases:** the cloud project `qgfmwstgkwyqqwyqroav`, then the local stack on gideon (`the-mark-of-gideon.local:35322`).
- **Migration name:** `shadowyrealm_system_one_scoring`. The cloud assigns the version; the monorepo file takes that version, as `20261113105044_inventions_site` did.

## The SQL

Generated from `peopleColumns()` in this repo's `tools/site-schema.ts`, so it matches what `bun tools/site-schema.ts shadowyrealm` now emits:

```sql
-- ShadowyRealm System One scoring (shadowyrealm repo, .kiro/handoffs/shadowyrealm-system-one-scoring.md).
--
-- 1. Each assessment records, beside each of its ten levels, the living people
--    affected in a typical year of its period (Clairic's count). Null for an
--    assessment made before; the Worker leaves such an assessment unplaced.
-- 2. A scored assessment keeps its evidence once, in evidence, instead of in
--    every justification: the evidence is now the whole Wikipedia article.
-- 3. Link strengths keep four places, because System One's proposed links and
--    the scaled curated ones go down to 0.01 of a consequence.
-- No existing row changes value, and credit_shares() is untouched: the Worker
-- computes ShadowyRealm's credit itself.

alter table shadowyrealm.assessments
  add column scientific_benefit_people numeric constraint assessments_scientific_benefit_people_check check (scientific_benefit_people >= 0),
  add column scientific_harm_people numeric constraint assessments_scientific_harm_people_check check (scientific_harm_people >= 0),
  add column economic_benefit_people numeric constraint assessments_economic_benefit_people_check check (economic_benefit_people >= 0),
  add column economic_harm_people numeric constraint assessments_economic_harm_people_check check (economic_harm_people >= 0),
  add column human_rights_benefit_people numeric constraint assessments_human_rights_benefit_people_check check (human_rights_benefit_people >= 0),
  add column human_rights_harm_people numeric constraint assessments_human_rights_harm_people_check check (human_rights_harm_people >= 0),
  add column health_benefit_people numeric constraint assessments_health_benefit_people_check check (health_benefit_people >= 0),
  add column health_harm_people numeric constraint assessments_health_harm_people_check check (health_harm_people >= 0),
  add column cultural_benefit_people numeric constraint assessments_cultural_benefit_people_check check (cultural_benefit_people >= 0),
  add column cultural_harm_people numeric constraint assessments_cultural_harm_people_check check (cultural_harm_people >= 0),
  add column evidence text;

alter table shadowyrealm.relationships
  alter column strength type numeric(5,4);
```

The deployed Worker keeps working on the new schema: it selects named columns, and inserts that leave out the new ones get nulls. So the migration can go in before the new Worker is deployed.

## Steps

1. **Record the strengths before**, on the cloud:
   ```sql
   select count(*), sum(strength) from shadowyrealm.relationships;
   ```
2. **Apply to the cloud** as migration `shadowyrealm_system_one_scoring`, in one transaction.
3. **Apply to gideon**: the same SQL in one transaction, and a row in `supabase_migrations.schema_migrations` with the cloud's version and the name `shadowyrealm_system_one_scoring`.
4. **Copy the file** into `supabase/migrations/<cloud version>_shadowyrealm_system_one_scoring.sql` and commit it on `main`.

## What must not be done

- **Never `db reset`** either database. Both hold other properties' production data.
- **Never fill the new columns by hand.** They are filled when the Worker re-scores each period through `score_period`.
- **Never edit `credit_shares()`.** Prior Art still calls it, and ShadowyRealm no longer does.
- **Never edit the SQL by hand** to make it differ from the generator. Change `tools/site-schema.ts` in this repo and regenerate instead.

## How to check it

- The eleven new columns, in this order, after `updated_at`:
  ```sql
  select column_name, data_type
  from information_schema.columns
  where table_schema = 'shadowyrealm' and table_name = 'assessments'
  order by ordinal_position;
  ```
  The last eleven are `scientific_benefit_people` … `cultural_harm_people` (numeric), then `evidence` (text).
- Strengths at four places, with the same values as before:
  ```sql
  select numeric_precision, numeric_scale
  from information_schema.columns
  where table_schema = 'shadowyrealm' and table_name = 'relationships' and column_name = 'strength';
  select count(*), sum(strength) from shadowyrealm.relationships;
  ```
  The first query gives 5 and 4. The second matches step 1.
- The same results on gideon.

## Then, in this repo

1. `bun run db:types`, so `src/lib/database.types.ts` has the new columns.
2. `npm run deploy` the Worker.
3. Run the loader. It writes the 3,076 proposed links and the scaled strengths, then re-scores all 733 periods on whole articles with Clef and Clairic, at about $4.35 on Cloudflare's meter:
   ```bash
   MCP_URL=https://shadowyrealm.com/mcp MCP_API_KEY=… bun tools/realm-load.ts content/realm.ts --rescore --concurrency 4
   ```
   Until each period is re-scored, its old assessment has no head-counts and adds nothing.
