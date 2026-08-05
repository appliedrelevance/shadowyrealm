import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { EntityFilters, EntitySort } from "../types";

/**
 * Sanitize a user-supplied search term for use inside a PostgREST
 * `or=(...ilike...)` filter: commas and parens are filter syntax, and
 * %/_ are LIKE wildcards.
 */
function toSearchPattern(term: string): string {
  const cleaned = term
    .replace(/[,()]/g, " ")
    .replace(/[%_]/g, "\\$&")
    .trim();
  return cleaned ? `%${cleaned}%` : "";
}

const SORT_ORDERS: Record<
  EntitySort,
  { column: "created_at" | "name"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  name_asc: { column: "name", ascending: true },
  name_desc: { column: "name", ascending: false },
};

export function useEntities(filters: EntityFilters) {
  return useQuery({
    queryKey: ["entities", filters],
    queryFn: async () => {
      let query = supabase
        .schema("shadowyrealm")
        .from("entities")
        .select("*", { count: "exact" });

      if (filters.entityType) {
        query = query.eq("entity_type", filters.entityType);
      }
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.search) {
        const pattern = toSearchPattern(filters.search);
        if (pattern) {
          query = query.or(
            `name.ilike.${pattern},description.ilike.${pattern}`,
          );
        }
      }

      const order = SORT_ORDERS[filters.sort ?? "newest"];
      query = query
        .order(order.column, { ascending: order.ascending })
        .range(
          (filters.page - 1) * filters.perPage,
          filters.page * filters.perPage - 1,
        );

      const { data, error, count } = await query;
      if (error) throw error;
      return { entities: data, total: count ?? 0 };
    },
  });
}

export function useEntity(slug: string) {
  return useQuery({
    queryKey: ["entity", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("shadowyrealm")
        .from("entities")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
