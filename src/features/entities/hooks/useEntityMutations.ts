import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { PublicationStatus } from "../types";

export function useUpdateEntityStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityId,
      slug,
      oldStatus,
      newStatus,
    }: {
      entityId: number;
      slug: string;
      oldStatus: PublicationStatus;
      newStatus: PublicationStatus;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Update entity status
      const { error: updateError } = await supabase
        .schema("shadowyrealm")
        .from("entities")
        .update({ status: newStatus })
        .eq("id", entityId);

      if (updateError) throw updateError;

      // Write audit log
      const { error: auditError } = await supabase
        .schema("shadowyrealm")
        .from("entity_audit_log")
        .insert({
          entity_id: entityId,
          action: "status_change",
          old_value: { status: oldStatus },
          new_value: { status: newStatus },
          performed_by: user.id,
        });

      if (auditError) throw auditError;

      return { slug, newStatus };
    },
    onSuccess: ({ slug }) => {
      queryClient.invalidateQueries({ queryKey: ["entity", slug] });
      queryClient.invalidateQueries({ queryKey: ["entities"] });
    },
  });
}

export function useDeleteEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityId }: { entityId: number }) => {
      // Published entities get archived, not deleted (Req 1.7)
      // Only draft entities can be permanently deleted
      const { error } = await supabase
        .schema("shadowyrealm")
        .from("entities")
        .delete()
        .eq("id", entityId)
        .eq("status", "draft");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
    },
  });
}
