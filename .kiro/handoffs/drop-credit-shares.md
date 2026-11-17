# Handoff: drop the unused credit_shares functions

`shadowyrealm.credit_shares(boolean)` and `inventions.credit_shares(boolean)` walk the credit-bearing links in Postgres and keep each pair's strongest chain. Neither site uses them any more. Both Workers compute credit themselves, with every route added up (`walkShares` in this repo's `src/lib/credit.ts`):
- ShadowyRealm since its System One scoring went live on 2026-11-15 (Worker `f102fd12`);
- Prior Art since shadowyrealm commit `101db45` on 2026-11-16 (Worker `45a99c18`).

The Workers live now, ShadowyRealm `90dc605e` and Prior Art `94ab1b34`, call neither function. This is the schema change that removes them. It belongs to the monorepo, which owns the shared database's migrations.

No table, column, row, policy or grant changes.

## Established on 2026-11-17

- **On the cloud,** both functions exist, each executable only by `postgres` and `service_role`.
  - Neither has a dependent in `pg_depend`.
  - No other function's body, view or materialized view names them.
  - `pg_cron` is not installed.
  - `track_functions` is `none`, so Postgres keeps no call counts to consult.
- **In the code,** nothing calls them. A search of every checkout under `Landru/code/appliedrelevance` for `credit_shares`, skipping dependencies and build output, finds:
  - the monorepo's three migrations;
  - in this repo, only documentation, `src/lib/database.types.ts`, and the schema generator `tools/site-schema.ts`. The generator no longer emits the function, as of the commit that added this handoff.

## Where

- **Checkout:** `/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance`, on `main`, the branch it is on. Run `git status` first; if it shows changes you did not make, stop and ask.
- **Databases:**
  - the cloud project `qgfmwstgkwyqqwyqroav`;
  - then the local stack on gideon, port `35322`. From Geordie's Mac, `the-mark-of-gideon.local` does not route; the Tailscale address `100.73.69.118` does.
- **Migration name:** `drop_credit_shares`. The cloud assigns the version, and the monorepo file takes that version, as `20261115071456_shadowyrealm_system_one_scoring` did.

## The SQL

```sql
-- Drop the strongest-chain credit_shares() functions (shadowyrealm repo,
-- .kiro/handoffs/drop-credit-shares.md). Both sites' Workers compute credit
-- themselves, every route added up (src/lib/credit.ts, walkShares), and nothing
-- in the database or the code calls these. No table or row changes.

drop function shadowyrealm.credit_shares(boolean);
drop function inventions.credit_shares(boolean);
```

## Steps

1. **Check before, on the cloud.** Two rows, one per schema, each with `0` dependents:
   ```sql
   select n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args,
     (select count(*) from pg_depend d where d.refobjid = p.oid and d.deptype = 'n') as dependents
   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where p.proname = 'credit_shares'
   order by 1;
   ```
2. **Apply to the cloud** as migration `drop_credit_shares`, in one transaction.
3. **Apply to gideon.**
   - Run the same check there first. If it does not show both functions, drop only those it shows.
   - Run the SQL in one transaction.
   - Add a row to `supabase_migrations.schema_migrations` with the cloud's version and the name `drop_credit_shares`.
4. **Copy the file** into `supabase/migrations/<cloud version>_drop_credit_shares.sql`, and commit only that file on `main`.

## What must not be done

- **Never `db reset`** either database. Both hold other properties' production data.
- **Never add `cascade`.** A dependent nobody knows about should stop the drop, not vanish with it. If a drop fails on a dependency, stop and report it.
- **Never touch any other object** in either schema.
- **Never apply to gideon first.** Its migration row takes the cloud's version.

## How to check it

- The check in step 1 returns no rows, on the cloud and on gideon.
- Both sites still serve their scores. Each command prints `200`:
  ```bash
  curl -s -o /dev/null -w "%{http_code}\n" https://shadowyrealm.com/api/realm
  ```
  ```bash
  curl -s -o /dev/null -w "%{http_code}\n" https://priorart.shadowyrealm.com/api/realm
  ```

## Then, in this repo

1. **Regenerate the database types,** so `src/lib/database.types.ts` loses `credit_shares` in both schemas. This is `bun run db:types`, or from Geordie's Mac, by the Tailscale address:
   ```bash
   bunx supabase gen types typescript --db-url postgresql://postgres:postgres@100.73.69.118:35322/postgres --schema public,shadowyrealm,inventions > src/lib/database.types.ts
   ```
2. **Run `bun test ./test`,** then commit the regenerated types on `main`.
