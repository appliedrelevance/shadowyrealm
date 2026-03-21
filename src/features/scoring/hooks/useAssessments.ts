import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

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

export function useCreateAssessment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      entity_id: number;
      period_id?: number | null;
      scientific_score: number;
      economic_score: number;
      human_rights_score: number;
      health_score: number;
      cultural_score: number;
      scientific_justification: string;
      economic_justification: string;
      human_rights_justification: string;
      health_justification: string;
      cultural_justification: string;
      confidence_level?: number;
      ai_suggested?: boolean;
      ai_model_used?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .schema("shadowyrealm")
        .from("assessments")
        .insert({ ...data, created_by: user.id });
      if (error) throw error;

      // Audit log
      await supabase
        .schema("shadowyrealm")
        .from("entity_audit_log")
        .insert({
          entity_id: data.entity_id,
          action: "score_added",
          new_value: {
            scientific: data.scientific_score,
            economic: data.economic_score,
            human_rights: data.human_rights_score,
            health: data.health_score,
            cultural: data.cultural_score,
          },
          performed_by: user.id,
        });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assessments", variables.entity_id],
      });
    },
  });
}

export function useCreatePeriod() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      entity_id: number;
      label: string;
      start_year: number;
      end_year: number;
      description?: string;
      reach_factor?: number;
      persistence_factor?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .schema("shadowyrealm")
        .from("assessment_periods")
        .insert({ ...data, created_by: user.id });
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assessment_periods", variables.entity_id],
      });
    },
  });
}
