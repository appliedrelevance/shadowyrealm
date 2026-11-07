-- pgRouting cross-check of shadowyrealm.credit_shares (Requirement 5).
--
-- Runs on a throwaway database only: pgRouting pulls PostGIS into the
-- database, and the shared project has no use for either. The recursive CTE in
-- the migration is the implementation the Worker uses.
--
-- The strongest chain is the shortest path when an edge costs -ln(strength),
-- and exp(-total cost) turns the path back into a share. pgr_johnson keeps only
-- edges with a positive cost, so a strength of 1.00 is costed at 1e-9 rather
-- than 0.

create extension if not exists pgrouting cascade;

create or replace function shadowyrealm.credit_shares_pgrouting(published_only boolean default true)
returns table (ancestor_id bigint, descendant_id bigint, share numeric)
language sql
stable
-- pgRouting's own functions call each other unqualified, so its schema must be on the path.
set search_path = public, extensions
as $$
  select j.start_vid, j.end_vid, exp(-j.agg_cost)::numeric
  from pgr_johnson(
    format(
      $q$
        select r.source_entity_id as source, r.target_entity_id as target,
               greatest(-ln(r.strength::float8), 1e-9) as cost
        from shadowyrealm.relationships r
        join shadowyrealm.entities s on s.id = r.source_entity_id
        join shadowyrealm.entities t on t.id = r.target_entity_id
        where r.relationship_type in ('influence', 'mentorship')
          and r.strength > 0
          and (not %L or (s.status = 'published' and t.status = 'published'))
      $q$,
      published_only
    ),
    directed => true
  ) j
  where exp(-j.agg_cost) >= 0.001
$$;

-- The two implementations agree when this returns no rows.
select coalesce(c.ancestor_id, p.ancestor_id) as ancestor_id,
       coalesce(c.descendant_id, p.descendant_id) as descendant_id,
       c.share as cte_share, p.share as pgrouting_share
from shadowyrealm.credit_shares(true) c
full join shadowyrealm.credit_shares_pgrouting(true) p
  on p.ancestor_id = c.ancestor_id and p.descendant_id = c.descendant_id
where c.share is null or p.share is null or abs(c.share - p.share) > 0.005;
