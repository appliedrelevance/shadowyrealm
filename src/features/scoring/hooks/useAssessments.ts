import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAssessments(entityId: number) {
  return useQuery({
    queryKey: ["assessments", entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("shadowyrealm")
        .from("assessments")
        .select("*")
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAssessmentPeriods(entityId: number) {
  return useQuery({
    queryKey: ["assessment_periods", entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("shadowyrealm")
        .from("assessment_periods")
        .select("*")
        .eq("entity_id", entityId)
        .order("start_year", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useRelationships(entityId: number) {
  return useQuery({
    queryKey: ["relationships", entityId],
    queryFn: async () => {
      const { data: outgoing, error: e1 } = await supabase
        .schema("shadowyrealm")
        .from("relationships")
        .select("*, target:target_entity_id(id, name, slug)")
        .eq("source_entity_id", entityId);
      if (e1) throw e1;

      const { data: incoming, error: e2 } = await supabase
        .schema("shadowyrealm")
        .from("relationships")
        .select("*, source:source_entity_id(id, name, slug)")
        .eq("target_entity_id", entityId);
      if (e2) throw e2;

      return { outgoing: outgoing ?? [], incoming: incoming ?? [] };
    },
  });
}
