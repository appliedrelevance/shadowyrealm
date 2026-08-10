import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { COPY } from "@/lib/copy";
import { useToast } from "@/components/Toast";
import { useCreateAssessment } from "../hooks/useAssessments";

const DIMENSIONS = [
  { key: "scientific", label: "Scientific" },
  { key: "economic", label: "Economic" },
  { key: "human_rights", label: "Human Rights" },
  { key: "health", label: "Health" },
  { key: "cultural", label: "Cultural" },
] as const;

const TICK_MARKS = [-10, -5, 0, 5, 10];

function confidenceLabel(value: number): string {
  if (value <= 0.25) return "Low";
  if (value <= 0.50) return "Medium";
  if (value <= 0.75) return "High";
  return "Very High";
}

const scoringSchema = z.object({
  scientific_score: z.number().int().min(-10).max(10),
  economic_score: z.number().int().min(-10).max(10),
  human_rights_score: z.number().int().min(-10).max(10),
  health_score: z.number().int().min(-10).max(10),
  cultural_score: z.number().int().min(-10).max(10),
  scientific_justification: z.string().min(1, "Justification required"),
  economic_justification: z.string().min(1, "Justification required"),
  human_rights_justification: z.string().min(1, "Justification required"),
  health_justification: z.string().min(1, "Justification required"),
  cultural_justification: z.string().min(1, "Justification required"),
  period_id: z.number().nullable().optional(),
  confidence_level: z.number().min(0).max(1).optional(),
});

type ScoringFormData = z.infer<typeof scoringSchema>;

interface ScoringFormProps {
  entityId: number;
  periods?: { id: number; label: string }[];
  onSuccess?: () => void;
}

export function ScoringForm({ entityId, periods, onSuccess }: ScoringFormProps) {
  const mutation = useCreateAssessment();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ScoringFormData>({
    resolver: zodResolver(scoringSchema),
    defaultValues: {
      scientific_score: 0,
      economic_score: 0,
      human_rights_score: 0,
      health_score: 0,
      cultural_score: 0,
      scientific_justification: "",
      economic_justification: "",
      human_rights_justification: "",
      health_justification: "",
      cultural_justification: "",
      period_id: null,
      confidence_level: 0.5,
    },
  });

  const onSubmit = async (data: ScoringFormData) => {
    await mutation.mutateAsync({
      entity_id: entityId,
      period_id: data.period_id ?? null,
      scientific_score: data.scientific_score,
      economic_score: data.economic_score,
      human_rights_score: data.human_rights_score,
      health_score: data.health_score,
      cultural_score: data.cultural_score,
      scientific_justification: data.scientific_justification,
      economic_justification: data.economic_justification,
      human_rights_justification: data.human_rights_justification,
      health_justification: data.health_justification,
      cultural_justification: data.cultural_justification,
      confidence_level: data.confidence_level ?? 0.5,
    });
    toast("Assessment saved");
    onSuccess?.();
  };

  const inputClass =
    "mt-1 w-full rounded border border-line bg-surface-1 px-3 py-2 text-ink-2 text-sm focus:border-action focus:outline-none";

  const confidenceValue = watch("confidence_level") ?? 0.5;
  const confidencePct = (confidenceValue * 100).toFixed(0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {mutation.isError && (
        <p className="rounded border border-crit/50 bg-crit/10 p-3 text-sm text-crit">
          {mutation.error.message}
        </p>
      )}

      {/* Optional period selection */}
      {periods && periods.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-ink-muted">
            Assessment Period
          </label>
          <select
            {...register("period_id", { valueAsNumber: true })}
            className={inputClass}
          >
            <option value="">Overall (no specific period)</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Five dimensions */}
      {DIMENSIONS.map((dim) => {
        const scoreKey = `${dim.key}_score` as keyof ScoringFormData;
        const justKey = `${dim.key}_justification` as keyof ScoringFormData;
        const scoreValue = watch(scoreKey) as number;

        return (
          <div
            key={dim.key}
            className="rounded-lg border border-line bg-surface-1 p-4"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-ink">
                {dim.label}
              </label>
              <span
                className={`font-mono text-lg font-bold ${scoreValue > 0 ? "text-ok" : scoreValue < 0 ? "text-crit" : "text-ink-muted"}`}
              >
                {scoreValue > 0 ? "+" : ""}
                {scoreValue}
              </span>
            </div>

            <input
              type="range"
              min={-10}
              max={10}
              step={1}
              {...register(scoreKey, { valueAsNumber: true })}
              className="mt-2 w-full accent-action"
            />
            <div className="flex justify-between text-xs text-ink-muted">
              {TICK_MARKS.map((t) => (
                <span key={t}>{t > 0 ? `+${t}` : t}</span>
              ))}
            </div>

            <textarea
              rows={2}
              placeholder={`Justify your ${dim.label.toLowerCase()} score...`}
              {...register(justKey)}
              className={`${inputClass} mt-2`}
            />
            {errors[justKey] && (
              <p className="mt-1 text-xs text-crit">
                {(errors[justKey] as { message?: string })?.message}
              </p>
            )}
          </div>
        );
      })}

      {/* Confidence */}
      <div>
        <label className="block text-sm font-medium text-ink-muted">
          Confidence: {confidencePct}% — {confidenceLabel(confidenceValue)}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          {...register("confidence_level", { valueAsNumber: true })}
          className="mt-1 w-full accent-action"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-action px-4 py-2.5 font-semibold text-ink hover:bg-action-hi disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? COPY.entity.saving : "Submit Assessment"}
      </button>
    </form>
  );
}
