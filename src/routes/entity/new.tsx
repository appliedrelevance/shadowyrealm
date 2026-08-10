import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Search, Loader2, AlertTriangle, PenLine } from "lucide-react";
import { EntityForm } from "@/features/entities/components/EntityForm";
import { useAIResearch } from "@/features/ai/hooks/useAIResearch";
import { AIContentBadge } from "@/components/AIContentBadge";
import { useToast } from "@/components/Toast";
import { COPY } from "@/lib/copy";
import type { AIEntityData, AIResearchResponse } from "@/features/ai/types";

export const Route = createFileRoute("/entity/new")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/login", search: { redirect: "/entity/new" } });
    }
  },
  component: NewEntityPage,
});

function confidenceLabel(value: number): string {
  if (value <= 0.25) return "Low";
  if (value <= 0.50) return "Medium";
  if (value <= 0.75) return "High";
  return "Very High";
}

function buildAIEntityData(query: string, res: AIResearchResponse): AIEntityData | null {
  if (!res.ai_profile) return null;
  const p = res.ai_profile;
  return {
    name: res.wikipedia?.title ?? query,
    entity_type: p.detected_type,
    description: p.description,
    biography: p.biography,
    metadata: p.metadata,
    scores: p.suggested_scores,
    justifications: p.suggested_justifications,
    confidence_level: p.confidence_level,
    model_used: res.model_used,
  };
}

function NewEntityPage() {
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedData, setAppliedData] = useState<AIEntityData | undefined>();
  const { research, data, isLoading, error, reset } = useAIResearch();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await research(searchQuery);
  };

  const handleApply = () => {
    if (!data) return;
    const entityData = buildAIEntityData(searchQuery, data);
    if (!entityData) {
      toast("AI could not generate a complete profile", "error");
      return;
    }
    setAppliedData(entityData);
    setMode("manual"); // Show form with AI data applied
  };

  const handleDismiss = () => {
    reset();
  };

  const handleManualMode = () => {
    setMode("manual");
    setAppliedData(undefined);
    reset();
  };

  // Auto-switch to manual on error
  if (error && mode === "ai") {
    toast(error.message, "error");
    setMode("manual");
  }

  // If AI returned no results
  const noResults = data && !data.ai_profile && !data.wikipedia;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-ink">
        {COPY.entity.addFigure}
      </h1>
      <p className="mt-2 text-ink-muted">
        {COPY.entity.subtitle}
      </p>

      {/* AI Search Section */}
      {mode === "ai" && !appliedData && (
        <div className="mt-8 space-y-4">
          <div className="rounded-lg border border-info/30 bg-info/5 p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-info" />
              <h2 className="font-display text-lg font-semibold text-ink">
                AI Research Assistant
              </h2>
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              Enter a person, organization, or event name. AI will research and fill the form for you.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Marie Curie, United Nations, The Renaissance..."
                className="flex-1 rounded border border-line bg-surface-1 px-3 py-2 text-sm text-ink-2 focus:border-action focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="flex items-center gap-1 rounded bg-info px-4 py-2 text-sm font-semibold text-ink hover:bg-info/80 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Research
              </button>
            </div>

            <button
              onClick={handleManualMode}
              className="mt-2 flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
            >
              <PenLine className="h-3.5 w-3.5" />
              Enter manually instead
            </button>
          </div>

          {/* No results message */}
          {noResults && (
            <div className="rounded-lg border border-line bg-surface-1 p-4 text-center">
              <p className="text-ink-muted">No results found for "{searchQuery}"</p>
              <button
                onClick={handleManualMode}
                className="mt-2 text-sm text-action-ink hover:underline"
              >
                Fill in the details manually
              </button>
            </div>
          )}

          {/* AI Results Panel */}
          {data && data.ai_profile && (
            <AIResultsPanel
              data={data}
              onApply={handleApply}
              onDismiss={handleDismiss}
            />
          )}
        </div>
      )}

      {/* Form Section */}
      {(mode === "manual" || appliedData) && (
        <div className="mt-8">
          {appliedData && !data && (
            <div className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
              <AIContentBadge model={appliedData.model_used} />
              <span>AI suggestions applied — review and edit before submitting</span>
            </div>
          )}
          <EntityForm mode="create" aiData={appliedData} />
        </div>
      )}
    </div>
  );
}

function AIResultsPanel({
  data,
  onApply,
  onDismiss,
}: {
  data: AIResearchResponse;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const profile = data.ai_profile;
  if (!profile) return null;

  return (
    <div className="space-y-4">
      {/* Wikipedia data */}
      {data.wikipedia && (
        <div className="rounded-lg border border-line bg-surface-1 p-4">
          <div className="flex gap-3">
            {data.wikipedia.thumbnail && (
              <img
                src={data.wikipedia.thumbnail}
                alt={data.wikipedia.title}
                className="h-16 w-16 rounded object-cover"
              />
            )}
            <div>
              <h4 className="font-semibold text-ink">{data.wikipedia.title}</h4>
              <p className="mt-1 line-clamp-3 text-sm text-ink-muted">{data.wikipedia.extract}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detected type + scores */}
      <div className="rounded-lg border border-line bg-surface-1 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AIContentBadge model={data.model_used} />
            <span className="rounded bg-surface-2 px-2 py-0.5 text-xs font-medium capitalize text-ink-muted">
              {profile.detected_type}
            </span>
          </div>
          <span className="text-xs text-ink-muted">
            Confidence: {(profile.confidence_level * 100).toFixed(0)}% — {confidenceLabel(profile.confidence_level)}
          </span>
        </div>

        <p className="mt-3 text-sm text-ink-muted">{profile.impact_summary}</p>

        {/* Scores grid */}
        <div className="mt-3 grid grid-cols-5 gap-2 text-center text-sm">
          {Object.entries(profile.suggested_scores).map(([dim, score]) => (
            <div key={dim} className="rounded border border-line bg-surface-2 p-2">
              <div className="text-xs text-ink-muted">{dim.replace("_", " ").toUpperCase()}</div>
              <div className={`mt-1 font-mono font-bold ${score > 0 ? "text-ok" : score < 0 ? "text-crit" : "text-ink-muted"}`}>
                {score > 0 ? "+" : ""}{score}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bias warnings */}
      {data.bias_warnings.length > 0 && (
        <div className="rounded-lg border border-gold/50 bg-gold/10 p-3">
          <div className="flex items-center gap-1 text-sm font-semibold text-gold">
            <AlertTriangle className="h-4 w-4" />
            Bias Warnings
          </div>
          <ul className="mt-1 space-y-1 text-sm text-ink-muted">
            {data.bias_warnings.map((w, i) => (
              <li key={i}>- {w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onApply}
          className="flex-1 rounded bg-action px-4 py-2.5 text-sm font-semibold text-ink hover:bg-action-hi"
        >
          Apply to Form
        </button>
        <button
          onClick={onDismiss}
          className="rounded border border-line px-4 py-2.5 text-sm text-ink-muted hover:border-action hover:text-ink-2"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
