# Handoff: an influence link type for Inventions

One value added to one enum in the shared Supabase project, for a session in the monorepo, which owns
the shared database's migrations.

Inventions' credit links proposed by System One (shadowyrealm `content/inventions/system-one-graph.json`)
load as `influence`, the type History and Music already have. `inventions.relationship_type` lacks it.

## Where

- **Checkout:** `/Volumes/Berthold/Landru/code/appliedrelevance/appliedrelevance`, on `main`, the branch it is on.
- **Databases:** the cloud project `qgfmwstgkwyqqwyqroav`, then the local stack on gideon
  (`the-mark-of-gideon.local:35322`).
- **Migration name:** `inventions_influence_link`. The cloud assigns the version; the monorepo file takes it.

## The SQL

```sql
alter type inventions.relationship_type add value if not exists 'influence';
notify pgrst, 'reload schema';
```

## Steps

1. Apply it to the cloud as migration `inventions_influence_link`.
2. Apply it to gideon, with a row in `supabase_migrations.schema_migrations` carrying the cloud's version
   and name.
3. Copy it into `supabase/migrations/<cloud version>_inventions_influence_link.sql` and commit it on `main`.

## What must not be done

- **Never `db reset`** either database. Both hold every property's production data.
- **Never recreate the enum** (drop and create, or rename and replace). Every existing link uses it; the
  new value is appended, nothing else changes.
- **Never add links by hand.** The shadowyrealm loader adds them through Inventions' MCP tools.

## How to check it

On the cloud and on gideon:

```sql
select enum_range(null::inventions.relationship_type);
select count(*), sum(strength) from inventions.relationships;
```

`{originated,builds_on,embodies,made,led,mentorship,collaboration,rivalry,supersedes,influence}`, with
`influence` last; 558 links summing to 90.39, unchanged.

## Then, in this repo

`bun run db:types`, then `bun test ./test`: the Inventions schema test passes once the enum has the value.
