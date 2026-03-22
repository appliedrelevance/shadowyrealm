import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/Toast";
import { useCreatePeriod } from "../hooks/useAssessments";

const periodSchema = z
  .object({
    label: z.string().min(1, "Label is required"),
    start_year: z.number().int().min(-5000).max(2100),
    end_year: z.number().int().min(-5000).max(2100),
    description: z.string().optional(),
    reach_factor: z.number().int().min(1).max(10),
    persistence_factor: z.number().int().min(1).max(10),
  })
  .refine((d) => d.end_year >= d.start_year, {
    message: "End year must be >= start year",
    path: ["end_year"],
  });

type PeriodFormData = z.infer<typeof periodSchema>;

interface PeriodFormProps {
  entityId: number;
  onSuccess?: () => void;
}

export function PeriodForm({ entityId, onSuccess }: PeriodFormProps) {
  const mutation = useCreatePeriod();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PeriodFormData>({
    resolver: zodResolver(periodSchema),
    defaultValues: {
      label: "",
      start_year: 1900,
      end_year: 2000,
      description: "",
      reach_factor: 5,
      persistence_factor: 5,
    },
  });

  const onSubmit = async (data: PeriodFormData) => {
    await mutation.mutateAsync({ entity_id: entityId, ...data });
    toast("Period created");
    onSuccess?.();
  };

  const inputClass =
    "mt-1 w-full rounded border border-realm-border bg-realm-surface px-3 py-2 text-text text-sm focus:border-arcane-purple focus:outline-none";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mutation.isError && (
        <p className="text-sm text-destructive">{mutation.error.message}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-text-muted">
          Period Label *
        </label>
        <input
          placeholder="e.g. Early Career, World War II Era"
          {...register("label")}
          className={inputClass}
        />
        {errors.label && (
          <p className="mt-1 text-xs text-destructive">
            {errors.label.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted">
            Start Year *
          </label>
          <input
            type="number"
            {...register("start_year", { valueAsNumber: true })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted">
            End Year *
          </label>
          <input
            type="number"
            {...register("end_year", { valueAsNumber: true })}
            className={inputClass}
          />
          {errors.end_year && (
            <p className="mt-1 text-xs text-destructive">
              {errors.end_year.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted">
          Description
        </label>
        <textarea
          rows={2}
          {...register("description")}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted">
            Reach Factor (1-10)
          </label>
          <input
            type="number"
            min={1}
            max={10}
            {...register("reach_factor", { valueAsNumber: true })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted">
            Persistence Factor (1-10)
          </label>
          <input
            type="number"
            min={1}
            max={10}
            {...register("persistence_factor", { valueAsNumber: true })}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-text-bright hover:bg-primary-hover disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Period"}
      </button>
    </form>
  );
}
