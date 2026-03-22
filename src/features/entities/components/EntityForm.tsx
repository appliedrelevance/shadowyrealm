import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { useToast } from "@/components/Toast";
import { AIContentBadge } from "@/components/AIContentBadge";
import { slugify } from "@/lib/utils";
import type { Entity } from "../types";
import type { AIEntityData } from "@/features/ai/types";

const entitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  entity_type: z.enum(["person", "organization", "event"]),
  description: z.string().min(1, "Description is required"),
  biography: z.string().optional(),
  birth_date: z.string().optional(),
  death_date: z.string().optional(),
  nationality: z.string().optional(),
  founded_date: z.string().optional(),
  headquarters: z.string().optional(),
  organization_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().optional(),
  event_type: z.string().optional(),
});

type EntityFormData = z.infer<typeof entitySchema>;

const SCORE_DIMENSIONS = [
  { key: "scientific", label: "Scientific" },
  { key: "economic", label: "Economic" },
  { key: "human_rights", label: "Human Rights" },
  { key: "health", label: "Health" },
  { key: "cultural", label: "Cultural" },
] as const;

interface EntityFormProps {
  initialData?: Entity;
  mode: "create" | "edit";
  aiData?: AIEntityData;
}

export function EntityForm({ initialData, mode, aiData }: EntityFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [aiFields, setAiFields] = useState<Set<string>>(new Set());

  // AI score state (separate from entity form)
  const [aiScores, setAiScores] = useState<Record<string, number> | null>(null);
  const [aiJustifications, setAiJustifications] = useState<Record<string, string> | null>(null);

  const metadata = (initialData?.metadata ?? {}) as Record<string, unknown>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EntityFormData>({
    resolver: zodResolver(entitySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      entity_type: initialData?.entity_type ?? "person",
      description: initialData?.description ?? "",
      biography: initialData?.biography ?? "",
      birth_date: (metadata.birth_date as string) ?? "",
      death_date: (metadata.death_date as string) ?? "",
      nationality: (metadata.nationality as string) ?? "",
      founded_date: (metadata.founded_date as string) ?? "",
      headquarters: (metadata.headquarters as string) ?? "",
      organization_type: (metadata.organization_type as string) ?? "",
      start_date: (metadata.start_date as string) ?? "",
      end_date: (metadata.end_date as string) ?? "",
      location: (metadata.location as string) ?? "",
      event_type: (metadata.event_type as string) ?? "",
    },
  });

  // Apply AI data when it arrives
  useEffect(() => {
    if (!aiData) return;

    const fields = new Set<string>();

    setValue("name", aiData.name);
    fields.add("name");

    setValue("entity_type", aiData.entity_type);
    fields.add("entity_type");

    setValue("description", aiData.description);
    fields.add("description");

    if (aiData.biography) {
      setValue("biography", aiData.biography);
      fields.add("biography");
    }

    // Type-specific metadata
    const m = aiData.metadata;
    if (m.birth_date) { setValue("birth_date", m.birth_date); fields.add("birth_date"); }
    if (m.death_date) { setValue("death_date", m.death_date); fields.add("death_date"); }
    if (m.nationality) { setValue("nationality", m.nationality); fields.add("nationality"); }
    if (m.founded_date) { setValue("founded_date", m.founded_date); fields.add("founded_date"); }
    if (m.headquarters) { setValue("headquarters", m.headquarters); fields.add("headquarters"); }
    if (m.organization_type) { setValue("organization_type", m.organization_type); fields.add("organization_type"); }
    if (m.start_date) { setValue("start_date", m.start_date); fields.add("start_date"); }
    if (m.end_date) { setValue("end_date", m.end_date); fields.add("end_date"); }
    if (m.location) { setValue("location", m.location); fields.add("location"); }
    if (m.event_type) { setValue("event_type", m.event_type); fields.add("event_type"); }

    setAiFields(fields);

    // Set scores
    if (aiData.scores) {
      setAiScores({ ...aiData.scores });
      setAiJustifications({ ...aiData.justifications });
    }
  }, [aiData, setValue]);

  const entityType = watch("entity_type");

  const handleFieldChange = (fieldName: string) => {
    setAiFields((prev) => {
      const next = new Set(prev);
      next.delete(fieldName);
      return next;
    });
  };

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      setUploading(true);
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("entity-images")
        .upload(path, file);

      if (error) {
        setSubmitError(`Image upload failed: ${error.message}`);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("entity-images").getPublicUrl(path);

      setImageUrl(publicUrl);
      setUploading(false);
    },
    [user],
  );

  const buildMetadata = (data: EntityFormData): Record<string, unknown> => {
    switch (data.entity_type) {
      case "person":
        return {
          ...(data.birth_date && { birth_date: data.birth_date }),
          ...(data.death_date && { death_date: data.death_date }),
          ...(data.nationality && { nationality: data.nationality }),
        };
      case "organization":
        return {
          ...(data.founded_date && { founded_date: data.founded_date }),
          ...(data.headquarters && { headquarters: data.headquarters }),
          ...(data.organization_type && { organization_type: data.organization_type }),
        };
      case "event":
        return {
          ...(data.start_date && { start_date: data.start_date }),
          ...(data.end_date && { end_date: data.end_date }),
          ...(data.location && { location: data.location }),
          ...(data.event_type && { event_type: data.event_type }),
        };
    }
  };

  const onSubmit = async (data: EntityFormData) => {
    if (!user) return;
    setSubmitError(null);

    const entityMetadata = buildMetadata(data);
    const hasMetadata = Object.keys(entityMetadata).length > 0;

    if (mode === "create") {
      const slug = slugify(data.name);

      // Step 1: Create entity
      const { data: entityRow, error: entityError } = await supabase
        .schema("shadowyrealm")
        .from("entities")
        .insert({
          slug,
          name: data.name,
          entity_type: data.entity_type,
          description: data.description,
          biography: data.biography || null,
          image_url: imageUrl || null,
          metadata: hasMetadata ? entityMetadata : null,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (entityError) {
        setSubmitError(entityError.message);
        return;
      }

      // Step 2: Create assessment if AI scores are present
      if (aiScores && aiJustifications && entityRow) {
        const { error: assessmentError } = await supabase
          .schema("shadowyrealm")
          .from("assessments")
          .insert({
            entity_id: entityRow.id,
            assessor_id: user.id,
            scientific_score: aiScores.scientific,
            economic_score: aiScores.economic,
            human_rights_score: aiScores.human_rights,
            health_score: aiScores.health,
            cultural_score: aiScores.cultural,
            scientific_justification: aiJustifications.scientific,
            economic_justification: aiJustifications.economic,
            human_rights_justification: aiJustifications.human_rights,
            health_justification: aiJustifications.health,
            cultural_justification: aiJustifications.cultural,
            confidence_level: aiData?.confidence_level ?? 0.5,
            ai_suggested: true,
            ai_model_used: aiData?.model_used ?? null,
          });

        if (assessmentError) {
          // Entity created but assessment failed — navigate anyway
          toast("Figure created but initial assessment could not be saved", "error");
          navigate({ to: "/entity/$slug", params: { slug } });
          return;
        }

        toast("Figure created with initial assessment");
      } else {
        toast("Figure created");
      }

      navigate({ to: "/entity/$slug", params: { slug } });
    } else if (initialData) {
      const { error } = await supabase
        .schema("shadowyrealm")
        .from("entities")
        .update({
          name: data.name,
          description: data.description,
          biography: data.biography || null,
          image_url: imageUrl || null,
          metadata: hasMetadata ? entityMetadata : null,
        })
        .eq("id", initialData.id);

      if (error) {
        setSubmitError(error.message);
        return;
      }

      navigate({ to: "/entity/$slug", params: { slug: initialData.slug } });
    }
  };

  const inputClass =
    "mt-1 w-full rounded border border-realm-border bg-realm-surface px-3 py-2 text-text focus:border-arcane-purple focus:outline-none";
  const labelClass = "block text-sm font-medium text-text-muted";

  const fieldLabel = (name: string, label: string) => (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {aiFields.has(name) && <AIContentBadge />}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <p className="rounded border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {submitError}
        </p>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          {fieldLabel("name", "Name *")}
        </label>
        <input
          id="name"
          {...register("name", { onChange: () => handleFieldChange("name") })}
          className={inputClass}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Entity Type */}
      {mode === "create" && (
        <div>
          <label htmlFor="entity_type" className={labelClass}>
            {fieldLabel("entity_type", "Entity Type *")}
          </label>
          <select
            id="entity_type"
            {...register("entity_type", { onChange: () => handleFieldChange("entity_type") })}
            className={inputClass}
          >
            <option value="person">Person</option>
            <option value="organization">Organization</option>
            <option value="event">Event</option>
          </select>
        </div>
      )}

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          {fieldLabel("description", "Description *")}
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description", { onChange: () => handleFieldChange("description") })}
          className={inputClass}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Biography */}
      <div>
        <label htmlFor="biography" className={labelClass}>
          {fieldLabel("biography", "Biography")}
        </label>
        <textarea
          id="biography"
          rows={5}
          {...register("biography", { onChange: () => handleFieldChange("biography") })}
          className={inputClass}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Entity Image</label>
        <div className="mt-1 flex items-center gap-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Entity"
              className="h-20 w-20 rounded border border-realm-border object-cover"
            />
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded border border-realm-border bg-realm-surface-raised px-3 py-2 text-sm text-text-muted hover:border-arcane-purple hover:text-text">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Type-specific metadata fields */}
      {entityType === "person" && (
        <fieldset className="space-y-4 rounded border border-realm-border p-4">
          <legend className="px-2 text-sm font-medium text-text-muted">Person Details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="birth_date" className={labelClass}>{fieldLabel("birth_date", "Birth Date")}</label>
              <input id="birth_date" type="date" {...register("birth_date", { onChange: () => handleFieldChange("birth_date") })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="death_date" className={labelClass}>{fieldLabel("death_date", "Death Date")}</label>
              <input id="death_date" type="date" {...register("death_date", { onChange: () => handleFieldChange("death_date") })} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="nationality" className={labelClass}>{fieldLabel("nationality", "Nationality")}</label>
            <input id="nationality" {...register("nationality", { onChange: () => handleFieldChange("nationality") })} className={inputClass} />
          </div>
        </fieldset>
      )}

      {entityType === "organization" && (
        <fieldset className="space-y-4 rounded border border-realm-border p-4">
          <legend className="px-2 text-sm font-medium text-text-muted">Organization Details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="founded_date" className={labelClass}>{fieldLabel("founded_date", "Founded Date")}</label>
              <input id="founded_date" type="date" {...register("founded_date", { onChange: () => handleFieldChange("founded_date") })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="headquarters" className={labelClass}>{fieldLabel("headquarters", "Headquarters")}</label>
              <input id="headquarters" {...register("headquarters", { onChange: () => handleFieldChange("headquarters") })} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="organization_type" className={labelClass}>{fieldLabel("organization_type", "Type")}</label>
            <select id="organization_type" {...register("organization_type", { onChange: () => handleFieldChange("organization_type") })} className={inputClass}>
              <option value="">Select...</option>
              <option value="corporation">Corporation</option>
              <option value="ngo">NGO</option>
              <option value="government">Government</option>
              <option value="institution">Institution</option>
              <option value="military">Military</option>
            </select>
          </div>
        </fieldset>
      )}

      {entityType === "event" && (
        <fieldset className="space-y-4 rounded border border-realm-border p-4">
          <legend className="px-2 text-sm font-medium text-text-muted">Event Details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start_date" className={labelClass}>{fieldLabel("start_date", "Start Date")}</label>
              <input id="start_date" type="date" {...register("start_date", { onChange: () => handleFieldChange("start_date") })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="end_date" className={labelClass}>{fieldLabel("end_date", "End Date")}</label>
              <input id="end_date" type="date" {...register("end_date", { onChange: () => handleFieldChange("end_date") })} className={inputClass} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className={labelClass}>{fieldLabel("location", "Location")}</label>
              <input id="location" {...register("location", { onChange: () => handleFieldChange("location") })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="event_type" className={labelClass}>{fieldLabel("event_type", "Event Type")}</label>
              <select id="event_type" {...register("event_type", { onChange: () => handleFieldChange("event_type") })} className={inputClass}>
                <option value="">Select...</option>
                <option value="war">War</option>
                <option value="discovery">Discovery</option>
                <option value="movement">Movement</option>
                <option value="disaster">Disaster</option>
                <option value="treaty">Treaty</option>
                <option value="revolution">Revolution</option>
              </select>
            </div>
          </div>
        </fieldset>
      )}

      {/* AI Impact Scores Section */}
      {aiScores && aiJustifications && (
        <fieldset className="space-y-4 rounded border border-arcane-blue/30 bg-arcane-blue/5 p-4">
          <legend className="flex items-center gap-2 px-2 text-sm font-medium text-text-muted">
            Impact Assessment
            <AIContentBadge model={aiData?.model_used} />
          </legend>

          {SCORE_DIMENSIONS.map((dim) => {
            const score = aiScores[dim.key] ?? 0;
            return (
              <div key={dim.key} className="rounded-lg border border-realm-border bg-realm-surface p-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-text-bright">{dim.label}</label>
                  <span className={`font-mono text-lg font-bold ${score > 0 ? "text-spectral-green" : score < 0 ? "text-blood-red" : "text-text-muted"}`}>
                    {score > 0 ? "+" : ""}{score}
                  </span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  step={1}
                  value={score}
                  onChange={(e) => setAiScores((prev) => prev ? { ...prev, [dim.key]: Number(e.target.value) } : prev)}
                  className="mt-2 w-full accent-arcane-purple"
                />
                <textarea
                  rows={2}
                  value={aiJustifications[dim.key] ?? ""}
                  onChange={(e) => setAiJustifications((prev) => prev ? { ...prev, [dim.key]: e.target.value } : prev)}
                  className={`${inputClass} mt-2 text-sm`}
                />
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => { setAiScores(null); setAiJustifications(null); }}
            className="text-sm text-text-muted hover:text-destructive"
          >
            Remove impact scores
          </button>
        </fieldset>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-primary px-4 py-2.5 font-semibold text-text-bright hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting
          ? COPY.entity.saving
          : mode === "create"
            ? aiScores ? "Create Figure with Assessment" : COPY.entity.addFigure
            : "Update Figure"}
      </button>
    </form>
  );
}
