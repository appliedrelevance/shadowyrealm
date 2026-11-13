# Handoff: the inventions schema

Applied on 2026-11-13 with Geordie's authorization, from this session. It is recorded here so that the next schema change, and anyone auditing this one, can repeat every step and check every result.

## What was applied

| Where | What | Record |
|---|---|---|
| Cloud project `qgfmwstgkwyqqwyqroav` | The output of `bun tools/site-schema.ts inventions` | migration `20261113105044_inventions_site` |
| Cloud project | `alter role authenticator set pgrst.db_schemas = 'public,graphql_public,blog,shadowyrealm,podograph,fibertarian,carbonera,glorieta,strawyer,inventions'`, then `notify pgrst, 'reload config'` and `notify pgrst, 'reload schema'` | role setting |
| Local stack on gideon (`the-mark-of-gideon.local:35322`) | The same DDL, in one transaction | row `20261113105044 inventions_site` in `supabase_migrations.schema_migrations` |
| Monorepo `appliedrelevance` | `supabase/migrations/20261113105044_inventions_site.sql` and `"inventions"` in `supabase/config.toml` `[api] schemas` | commit `57c037db` on `main` |

The schema was created before it was exposed, in that order. `supabase/config.toml` records why the order matters: a schema named in PostgREST's path that does not exist makes every REST request fail with PGRST002.

## What must not be done

- Never `db reset` either database: both hold other properties' production data.
- Never expose a schema in `pgrst.db_schemas` before it exists.
- Never edit the generated DDL by hand: change `src/sites/inventions.ts` or `tools/site-schema.ts` and regenerate, so the schema and the config cannot disagree.
- The local `[api] schemas` change takes effect at the local stack's next restart; the schema is already in place there, so the restart is safe.

## How it was verified

### 1. The generator reproduces shadowyrealm exactly

`bun tools/site-schema.ts shadowyrealm` was loaded into a throwaway `public.ecr.aws/supabase/postgres:17.6.1.121` container as `postgres`. A catalog signature (one line per column, constraint, index, policy, RLS flag, trigger, function body and ACL, table grant, sequence ACL, schema ACL, default privilege and enum, with the schema name replaced by `S`) was hashed per category on the container and on the cloud's live `shadowyrealm`. All twelve categories matched:

| Category | Lines | md5 |
|---|---|---|
| col | 68 | `6f2f96d18da527dc2eb9bcc221861fca` |
| con | 40 | `aef38b0b02bf0981be601eac95abddf5` |
| defacl | 2 | `d66f931ce97f1d27f1062b6a93a8699e` |
| enum | 3 | `989652cf82906422b40cfa7d7b2369dc` |
| fn | 2 | `6eaf5c994b2281ac0ab39c3384897250` |
| idx | 19 | `d2bd361d409bef8eafb50919c99f59c4` |
| nsacl | 1 | `945d00a74b18652c0ae3a6d8f676b4c2` |
| pol | 6 | `17110136e6329988fd9432fd1a9b3b6d` |
| rls | 5 | `ce78b38b1dc82f971f6d7f2f728e69b9` |
| sgrant | 5 | `becd27cca711c97a643252010f18de0b` |
| tgrant | 80 | `5347323f2b310d62e801ee55068caa67` |
| trg | 3 | `497e2714c339a32304ac94ff0fa906ce` |

The full signatures of the generated `shadowyrealm` and `inventions` schemas are identical once dimension columns, the two type enums and `credit_shares` are set aside (211 lines each).

### 2. The inventions schema is the same everywhere

The same per-category hashes, taken on the throwaway container, the cloud and gideon after applying, are identical in all twelve categories:

| Category | md5 |
|---|---|
| col | `2a8be4bbd79144f10b383fe0a6d42c18` |
| con | `2c9edfcad5c434cc88c526127b8c86a9` |
| enum | `5f8f8bf36cc3da48e09bc499570d3e1e` |
| fn | `5f452c94c6cf6b5786a85cd438be474e` |

The other eight categories carry the same hashes as `shadowyrealm` above, because they do not depend on the enums or the dimensions.

### 3. The schema behaves

On the throwaway container, with Bell Labs → transistor (originated 0.6), transistor → integrated circuit (builds_on 0.5), integrated circuit → iPhone (embodies 0.2) and Bell Labs → iPhone (rivalry 0.5):

```
bell-labs|integrated-circuit|0.3000
bell-labs|iphone|0.060000
bell-labs|transistor|0.60
integrated-circuit|iphone|0.20
transistor|integrated-circuit|0.50
transistor|iphone|0.1000
```

Multi-hop shares are the products of their chains (checked with python3), and the rivalry link carries no credit.

### 4. The Data API serves it, read-only

Against the cloud with the anon key:

| Request | Expected | Got |
|---|---|---|
| `GET /rest/v1/entities` with `Accept-Profile: inventions` | 200, `[]` | 200, `[]` |
| `GET /rest/v1/entities` with `Accept-Profile: shadowyrealm` | 200 | 200 |
| `POST /rest/v1/rpc/credit_shares` (inventions) | refused | 401 |
| `POST /rest/v1/entities` (inventions) | refused | 401 |

With the shared project's secret key, `POST /rest/v1/rpc/credit_shares` returned 200.

## Repeating it for the next site

1. Add `src/sites/<site>.ts` and register it.
2. `bun tools/site-schema.ts <site>`, load it into a throwaway `supabase/postgres` container, and compare signatures with `shadowyrealm` as in step 1.
3. Apply the DDL to the cloud project as a migration, then to gideon, and copy the file into the monorepo under the cloud's version.
4. Only then add the schema to the cloud's `pgrst.db_schemas` and the monorepo's `config.toml`, and reload PostgREST's config and schema cache.
5. `bun run db:types`, or splice the new schema's generated block into `src/lib/database.types.ts`, and add the site to `src/lib/site-tables.typetest.ts`.
