# Handoff: remove signed-in write access to the `shadowyrealm` schema

> **Executed 2026-11-07.** The SQL below went out as part of migration
> `20261107000827_shadowyrealm_influence_graph` (monorepo commit `b8ba8265`), which also
> made child rows readable only for published entities. Verified afterwards: `anon` and
> `authenticated` hold only `SELECT`, and every remaining policy is a `SELECT` policy.

**Execute from:** the appliedrelevance monorepo root checkout
(`/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance`), on the branch it is on.
The shared Supabase project (`qgfmwstgkwyqqwyqroav`) and its migrations belong to that repo.
The ShadowyRealm repo writes no migrations.

## The problem

Every signed-in account on the shared project can write to ShadowyRealm's tables
through PostgREST with the public anon key. The INSERT policies only check
`created_by = auth.uid()`, so any account (including the bot sign-ups that hit the
old ShadowyRealm form) can:

- insert an entity with `status = 'published'`, which then appears on shadowyrealm.com;
- add assessments, periods and links to any published entity, changing its public score.

ShadowyRealm no longer needs these grants. All writes go through its Worker, which
uses the service role and bypasses RLS (`src/lib/sr-service.ts` in the shadowyrealm
repo). The browser app never writes to Supabase: its one manual control posts to the
Worker (`src/lib/operator-api.ts`).

## The migration

Create `supabase/migrations/<timestamp>_shadowyrealm_authenticated_write_lockdown.sql`
with exactly this, following the precedent of
`20261016122542_glorieta_schema_and_podograph_authenticated_lockdown.sql`:

```sql
-- ShadowyRealm writes only through its Worker, as service_role. Signed-in users
-- of the shared project could insert published entities and score other
-- people's entities directly through PostgREST.

drop policy if exists entities_insert          on shadowyrealm.entities;
drop policy if exists entities_update_own      on shadowyrealm.entities;
drop policy if exists assessments_insert       on shadowyrealm.assessments;
drop policy if exists assessments_update_own   on shadowyrealm.assessments;
drop policy if exists periods_insert           on shadowyrealm.assessment_periods;
drop policy if exists periods_update_own       on shadowyrealm.assessment_periods;
drop policy if exists relationships_insert     on shadowyrealm.relationships;
drop policy if exists relationships_delete_own on shadowyrealm.relationships;
drop policy if exists audit_insert             on shadowyrealm.entity_audit_log;

revoke insert, update, delete, truncate, references, trigger
  on all tables in schema shadowyrealm from authenticated;
revoke usage, update on all sequences in schema shadowyrealm from anon, authenticated;

alter default privileges in schema shadowyrealm
  revoke insert, update, delete, truncate, references, trigger on tables from authenticated;
alter default privileges in schema shadowyrealm
  revoke usage, update on sequences from anon, authenticated;
```

Apply it to the cloud project. If you apply it with the Supabase MCP `apply_migration`,
rename the file to the version MCP assigns, so the file and the
`schema_migrations` row agree.

## Do not

- **Do not `db reset` the cloud project.** It holds production data for every AR property.
- Do not drop the SELECT policies or SELECT grants. The public site reads through
  `entities_select_published`, `assessments_select`, `periods_select`,
  `relationships_select` and `audit_select`. The owner's drafts list in the SPA reads
  through `entities_select_own_drafts`.
- Do not touch `service_role` grants. The Worker's MCP tools and status endpoint need them.
- Do not touch any other schema.

## Verify

```sql
-- Expect only SELECT for both roles on every table.
select grantee, table_name, string_agg(privilege_type, ',' order by privilege_type)
from information_schema.role_table_grants
where table_schema = 'shadowyrealm' and grantee in ('anon', 'authenticated')
group by 1, 2 order by 2, 1;

-- Expect only SELECT policies: entities_select_published, entities_select_own_drafts,
-- assessments_select, periods_select, relationships_select, audit_select.
select tablename, policyname, cmd from pg_policies
where schemaname = 'shadowyrealm' order by 1, 2;
```

Then check that https://shadowyrealm.com still loads the index, an entity page and
the compare search without errors.

## Known state when this was written (2026-11-06)

- Production `shadowyrealm` holds one entity (Marie Curie, `under_review`) and no
  periods, assessments or links, so nothing else depends on the dropped policies.
- `authenticated` held `DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE`
  on all five tables. `anon` held `SELECT` on the tables and `SELECT, USAGE` on the
  sequences.
