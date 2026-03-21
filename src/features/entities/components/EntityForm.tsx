import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { Entity } from "../types";

const entitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  entity_type: z.enum(["person", "organization", "event"]),
  description: z.string().min(1, "Description is required"),
  biography: z.string().optional(),
  // Person metadata
  birth_date: z.string().optional(),
  death_date: z.string().optional(),
  nationality: z.string().optional(),
  // Organization metadata
  founded_date: z.string().optional(),
  headquarters: z.string().optional(),
  organization_type: z.string().optional(),
  // Event metadata
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().optional(),
  event_type: z.string().optional(),
});

type EntityFormData = z.infer<typeof entitySchema>;

interface EntityFormProps {
  initialData?: Entity;
  mode: "create" | "edit";
}

export function EntityForm({ initialData, mode }: EntityFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const metadata = (initialData?.metadata ?? {}) as Record<string, unknown>;

  const {
    register,
    handleSubmit,
    watch,
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

  const entityType = watch("entity_type");

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
          ...(data.organization_type && {
            organization_type: data.organization_type,
          }),
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
      const { error } = await supabase
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
        });

      if (error) {
        setSubmitError(error.message);
        return;
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
          Name *
        </label>
        <input id="name" {...register("name")} className={inputClass} />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Entity Type */}
      {mode === "create" && (
        <div>
          <label htmlFor="entity_type" className={labelClass}>
            Entity Type *
          </label>
          <select
            id="entity_type"
            {...register("entity_type")}
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
          Description *
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className={inputClass}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Biography */}
      <div>
        <label htmlFor="biography" className={labelClass}>
          Biography
        </label>
        <textarea
          id="biography"
          rows={5}
          {...register("biography")}
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
          <legend className="px-2 text-sm font-medium text-text-muted">
            Person Details
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="birth_date" className={labelClass}>
                Birth Date
              </label>
              <input
                id="birth_date"
                type="date"
                {...register("birth_date")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="death_date" className={labelClass}>
                Death Date
              </label>
              <input
                id="death_date"
                type="date"
                {...register("death_date")}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="nationality" className={labelClass}>
              Nationality
            </label>
            <input
              id="nationality"
              {...register("nationality")}
              className={inputClass}
            />
          </div>
        </fieldset>
      )}

      {entityType === "organization" && (
        <fieldset className="space-y-4 rounded border border-realm-border p-4">
          <legend className="px-2 text-sm font-medium text-text-muted">
            Organization Details
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="founded_date" className={labelClass}>
                Founded Date
              </label>
              <input
                id="founded_date"
                type="date"
                {...register("founded_date")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="headquarters" className={labelClass}>
                Headquarters
              </label>
              <input
                id="headquarters"
                {...register("headquarters")}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="organization_type" className={labelClass}>
              Type
            </label>
            <select
              id="organization_type"
              {...register("organization_type")}
              className={inputClass}
            >
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
          <legend className="px-2 text-sm font-medium text-text-muted">
            Event Details
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start_date" className={labelClass}>
                Start Date
              </label>
              <input
                id="start_date"
                type="date"
                {...register("start_date")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="end_date" className={labelClass}>
                End Date
              </label>
              <input
                id="end_date"
                type="date"
                {...register("end_date")}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                {...register("location")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="event_type" className={labelClass}>
                Event Type
              </label>
              <select
                id="event_type"
                {...register("event_type")}
                className={inputClass}
              >
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-primary px-4 py-2.5 font-semibold text-text-bright hover:bg-primary-hover disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting
          ? "Conjuring..."
          : mode === "create"
            ? "Summon Entity"
            : "Update Entity"}
      </button>
    </form>
  );
}
