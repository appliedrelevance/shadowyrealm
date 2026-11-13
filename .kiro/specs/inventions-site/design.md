# Design Document

## Overview

The inventions site is `src/sites/inventions.ts` and its assets, the `inventions` schema, an `inventions` wrangler environment, and the content in `content/inventions/`. It adds no code paths beyond the platform's, apart from the credit-walk replacement that Requirement 7 calls for if the walk proves too slow.

## The inventions config

### Dimensions

| Key | Label | Clef area | Affected |
|---|---|---|---|
| `prosperity` | Prosperity | work, productivity, the cost of goods, livelihoods and wealth | the people it affected |
| `health` | Health & Safety | survival, disease, injury and physical danger | the people it affected |
| `knowledge` | Knowledge & Culture | learning, communication, information, art and entertainment | the people it affected |
| `freedom` | Freedom & Power | people's independence and choices, and the power some people hold over others | the people it affected |
| `environment` | Environment | air, water, soil, climate, wildlife and natural resources | the people and the natural world it affected |

Every weight is 1.0. Environment's depth sentence reads "Rate how deeply they were affected, not how widely; breadth is judged separately." The other four use ShadowyRealm's sentence.

### Entity types and Clef subjects

| Key | Plural | Clef subject | Requires outgoing |
|---|---|---|---|
| `person` | People | {name}'s own direct activity | |
| `organization` | Organizations | {name}'s own direct activity | |
| `project` | Projects | {name}'s own direct activity | |
| `invention` | Inventions | the making and use of {name} | |
| `product` | Products | the making and use of {name} | |
| `discovery` | Discoveries | the spread and use of {name} | `builds_on` |

### Link types and labels

| Key | From → to | Credit | On the cause | On the consequence |
|---|---|---|---|---|
| `originated` | person, organization, project → invention, discovery, product | yes | Invented / Discovered / Created | Invented by / Discovered by / Created by |
| `builds_on` | discovery, invention, product → invention, product | yes | Led to | Builds on |
| `embodies` | invention → product | yes | Used in | Embodies |
| `made` | organization → product | yes | Made | Made by |
| `led` | person → organization, project | yes | Founded or led | Founded or led by |
| `mentorship` | person → person | yes | Mentored | Mentored by |
| `collaboration` | any → any | no | Worked with | Worked with |
| `rivalry` | any → any | no | Rival of | Rival of |
| `supersedes` | invention, product → invention, product | no | Replaced by | Replaced |

The three `originated` labels come from `labelsByTarget`, keyed by the consequence's type: invention, discovery, product.

### Periods

| Entity type | Periods |
|---|---|
| invention | first working form; commercialization; mass adoption; decline, where it has declined |
| product | one per generation or era of the product line |
| person | phases of their working life |
| organization, project | eras of the organization's work |

### Scoring, timeline and tiers

- Rubrics: `HISTORICAL_RUBRICS`. Unit: `{ years: 100, name: "influence-centuries" }`.
- Timeline: `{ start: -10000, ticks: [-10000, -5000, -3000, -1000, 1, 1000, 1500, 1700, 1800, 1900, 1950, 2000], near: 40, buckets: 200 }`.
- Tiers: `null` until the launch run. The labels are ShadowyRealm's, with the descriptors in Requirement 8.2.

## Data model

`bun tools/site-schema.ts inventions` produces the schema. Against `shadowyrealm`, it differs in:

| Object | Value |
|---|---|
| schema | `inventions` |
| `entity_type` | `person`, `organization`, `project`, `invention`, `product`, `discovery` |
| `relationship_type` | the nine keys above |
| `assessments` | `prosperity_*`, `health_*`, `knowledge_*`, `freedom_*`, `environment_*`, each with `_benefit`, `_harm` and `_justification` |
| `credit_shares` | walks `originated`, `builds_on`, `embodies`, `made`, `led`, `mentorship` |

The schema starts empty, so there is no data to protect, but the handoff still forbids `db reset` on either database.

## The credit walk on a dense graph

ShadowyRealm has 298 links across 624 entities. A technology tree fans out much further: the transistor alone feeds hundreds of later inventions. `credit_shares` enumerates every chain until its share falls below 0.001, so its cost grows with the number of chains, not the number of pairs.

Requirement 7 measures it on the launch set. If it takes more than 500 ms, a handoff replaces the inventions schema's function with a relaxation whose work per pass grows with pairs times links:

```sql
create or replace function inventions.credit_shares(published_only boolean default true)
returns table (ancestor_id bigint, descendant_id bigint, share numeric)
language plpgsql volatile set search_path = '' as $$
declare changed bigint;
begin
  drop table if exists pg_temp.cs_edges, pg_temp.cs_best;
  create temp table cs_edges on commit drop as
    select r.source_entity_id as source, r.target_entity_id as target, r.strength::numeric as strength
    from inventions.relationships r
    join inventions.entities s on s.id = r.source_entity_id
    join inventions.entities t on t.id = r.target_entity_id
    where r.relationship_type in ('originated','builds_on','embodies','made','led','mentorship')
      and r.strength > 0
      and (not published_only or (s.status = 'published' and t.status = 'published'));
  create temp table cs_best (ancestor_id bigint, descendant_id bigint, share numeric,
                             primary key (ancestor_id, descendant_id)) on commit drop;
  insert into cs_best select source, target, max(strength) from cs_edges group by 1, 2;
  loop
    insert into cs_best
      select b.ancestor_id, e.target, max(b.share * e.strength)
      from cs_best b join cs_edges e on e.source = b.descendant_id
      where b.ancestor_id <> e.target and b.share * e.strength >= 0.001
      group by 1, 2
    on conflict (ancestor_id, descendant_id)
      do update set share = excluded.share where excluded.share > cs_best.share;
    get diagnostics changed = row_count;
    exit when changed = 0;
  end loop;
  return query select * from cs_best;
end $$;
```

Every strength is at most 1, so a longer chain is never stronger than the chain it extends, and a cycle never improves a share. That means the loop ends. The function is `volatile` because it creates temporary tables. supabase-js calls RPCs with POST, which PostgREST allows for volatile functions.

## Content

- `content/inventions/benchmark.ts` holds the chains of Requirement 10.1.
- `content/inventions/launch.ts` extends the benchmark to 150 entities, from 10,000 BCE to today.
- `content/inventions/index.ts` combines the two for the loader:

  ```bash
  MCP_URL=https://inventions.<account>.workers.dev/mcp MCP_API_KEY=… bun tools/realm-load.ts content/inventions/index.ts
  ```

| Rule | Enforced by |
|---|---|
| Entity types and link endpoints as in Requirements 3 and 4 | the typecheck, and `add_relationship` |
| A discovery has an outgoing `builds_on` link in the same file | the loader's `requiresOutgoing` check |
| No period starts before 10,000 BCE | `add_period` |
| A target's incoming credit shares total 1.00 at most | `add_relationship` |
| An `originated` link's `why` names rival claimants, and its share is smaller for each rival who came close | review of the content file |

## Decisions

| Decision | Why |
|---|---|
| No dimension for advancing technology | What an invention makes possible is what lineage credit measures. Scoring it as a dimension too would count the transistor's descendants twice: once in its own score and again as credit from the integrated circuit. |
| Five dimensions | Daily convenience is split between Prosperity (time saved) and Freedom & Power (mobility, independence), which keeps the profile as compact as ShadowyRealm's |
| Environment as a dimension | The field's largest harms, leaded petrol and CFCs among them, fall on the natural world, which ShadowyRealm's dimensions do not cover |
| Every weight 1.0 | ShadowyRealm's weights express a view about history. This site starts neutral, and a weight changes only when the benchmark shows a reason. |
| A `discovery` type, entered only as a prerequisite | Without discoveries the tree has gaps (induction before the generator), but the site is about things people built |
| Timeline from 10,000 BCE | Takes in farming, the plough and bronze. Reaching back to fire or stone tools would let sheer age swamp everything, since area is level × years. |
| `HISTORICAL_RUBRICS` | Inventions persist on the same scales as historical influence, from a fad that faded within a year to the wheel |
| An entity in both sites is two rows | No links cross sites. Gutenberg, Watt and Apple are scored by each site on its own dimensions. |
