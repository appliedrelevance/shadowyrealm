import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { EntityFilters } from "../types";

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

      query = query
        .order("created_at", { ascending: false })
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
