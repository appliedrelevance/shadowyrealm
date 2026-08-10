import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useEntities } from "@/features/entities/hooks/useEntities";

const relationshipSchema = z.object({
  target_entity_id: z.number().min(1, "Select a target entity"),
  relationship_type: z.enum(["influence", "mentorship", "collaboration", "opposition"]),
  description: z.string().min(1, "Description is required"),
  strength: z.number().min(0).max(1),
  temporal_overlap: z.number().min(0).max(1),
});

type RelationshipFormData = z.infer<typeof relationshipSchema>;

interface RelationshipFormProps {
  sourceEntityId: number;
  onSuccess?: () => void;
}

export function RelationshipForm({ sourceEntityId, onSuccess }: RelationshipFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: searchResults } = useEntities({
    page: 1,
    perPage: 10,
    status: "published",
  });

  const mutation = useMutation({
    mutationFn: async (data: RelationshipFormData) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .schema("shadowyrealm")
        .from("relationships")
        .insert({
          source_entity_id: sourceEntityId,
          target_entity_id: data.target_entity_id,
          relationship_type: data.relationship_type,
          description: data.description,
          strength: data.strength,
          temporal_overlap: data.temporal_overlap,
          created_by: user.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships", sourceEntityId] });
      onSuccess?.();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RelationshipFormData>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      target_entity_id: 0,
      relationship_type: "influence",
      description: "",
      strength: 0.5,
      temporal_overlap: 0.5,
    },
  });

  const inputClass =
    "mt-1 w-full rounded border border-line bg-surface-1 px-3 py-2 text-ink-2 text-sm focus:border-action focus:outline-none";

  const filteredEntities = (searchResults?.entities ?? []).filter(
    (e) => e.id !== sourceEntityId && e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {mutation.isError && (
        <p className="text-sm text-crit">{mutation.error.message}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-ink-muted">
          Target Entity *
        </label>
        <input
          type="text"
          placeholder="Search entities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
        <select
          {...register("target_entity_id", { valueAsNumber: true })}
          className={`${inputClass} mt-1`}
          size={3}
        >
          {filteredEntities.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.entity_type})
            </option>
          ))}
        </select>
        {errors.target_entity_id && (
          <p className="mt-1 text-xs text-crit">
            {errors.target_entity_id.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-muted">
          Relationship Type *
        </label>
        <select {...register("relationship_type")} className={inputClass}>
          <option value="influence">Influence</option>
          <option value="mentorship">Mentorship</option>
          <option value="collaboration">Collaboration</option>
          <option value="opposition">Opposition</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-muted">
          Description *
        </label>
        <textarea rows={2} {...register("description")} className={inputClass} />
        {errors.description && (
          <p className="mt-1 text-xs text-crit">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink-muted">
            Strength (0-1)
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            {...register("strength", { valueAsNumber: true })}
            className="mt-1 w-full accent-action"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-muted">
            Temporal Overlap (0-1)
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            {...register("temporal_overlap", { valueAsNumber: true })}
            className="mt-1 w-full accent-action"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-action px-4 py-2 text-sm font-semibold text-ink hover:bg-action-hi disabled:opacity-50"
      >
        {isSubmitting ? "Forging..." : "Forge Connection"}
      </button>
    </form>
  );
}
