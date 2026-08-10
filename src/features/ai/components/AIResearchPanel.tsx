import { useState } from "react";
import { Bot, Search, AlertTriangle, Loader2 } from "lucide-react";
import { AIContentBadge } from "@/components/AIContentBadge";

interface AIProfile {
  description?: string;
  biography?: string;
  impact_summary?: string;
  key_achievements?: string[];
  suggested_scores?: {
    scientific: number;
    economic: number;
    human_rights: number;
    health: number;
    cultural: number;
  };
  suggested_justifications?: {
    scientific: string;
    economic: string;
    human_rights: string;
    health: string;
    cultural: string;
  };
  confidence_level?: number;
  analysis_reasoning?: string;
  potential_biases?: string[];
}

interface WikipediaData {
  title: string;
  extract: string;
  thumbnail?: string;
  categories: string[];
  page_url: string;
}

interface AIResearchResult {
  wikipedia: WikipediaData | null;
  ai_profile: AIProfile | null;
  bias_warnings: string[];
}

interface AIResearchPanelProps {
  onApply: (data: {
    description: string;
    biography: string;
    scores: AIProfile["suggested_scores"];
    justifications: AIProfile["suggested_justifications"];
    aiModelUsed: string;
  }) => void;
}

export function AIResearchPanel({ onApply }: AIResearchPanelProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResearchResult | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await fetch("/api/ai/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!resp.ok) {
        const data = (await resp.json()) as { error: string };
        throw new Error(data.error || `HTTP ${resp.status}`);
      }

      const data = (await resp.json()) as AIResearchResult;
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "AI research unavailable",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-info/30 bg-info/5 p-4">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-info" />
        <h3 className="font-display text-lg font-semibold text-ink">
          AI Research Assistant
        </h3>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter entity name to research..."
          className="flex-1 rounded border border-line bg-surface-1 px-3 py-2 text-sm text-ink-2 focus:border-action focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="flex items-center gap-1 rounded bg-info px-4 py-2 text-sm font-semibold text-ink hover:bg-info/80 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Research
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded border border-crit/50 bg-crit/10 p-3 text-sm text-crit">
          <AlertTriangle className="h-4 w-4" />
          {error} — You can still create the entity manually.
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          {/* Wikipedia data */}
          {result.wikipedia && (
            <div className="rounded border border-line bg-surface-1 p-3">
              <div className="flex gap-3">
                {result.wikipedia.thumbnail && (
                  <img
                    src={result.wikipedia.thumbnail}
                    alt={result.wikipedia.title}
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-ink">
                    {result.wikipedia.title}
                  </h4>
                  <p className="mt-1 text-sm text-ink-muted">
                    {result.wikipedia.extract}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.wikipedia.categories.slice(0, 5).map((c) => (
                      <span
                        key={c}
                        className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-ink-muted"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bias warnings */}
          {result.bias_warnings.length > 0 && (
            <div className="rounded border border-gold/50 bg-gold/10 p-3">
              <div className="flex items-center gap-1 text-sm font-semibold text-gold">
                <AlertTriangle className="h-4 w-4" />
                Bias Warnings
              </div>
              <ul className="mt-1 space-y-1 text-sm text-ink-muted">
                {result.bias_warnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI profile */}
          {result.ai_profile?.suggested_scores && (
            <div className="space-y-3">
              <AIContentBadge model="Claude Sonnet" />

              <div className="rounded border border-line bg-surface-1 p-3 text-sm">
                <p className="text-ink-muted">
                  {result.ai_profile.impact_summary}
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center text-sm">
                {Object.entries(result.ai_profile.suggested_scores).map(
                  ([dim, score]) => (
                    <div
                      key={dim}
                      className="rounded border border-line bg-surface-2 p-2"
                    >
                      <div className="text-xs text-ink-muted">
                        {dim.replace("_", " ").toUpperCase()}
                      </div>
                      <div
                        className={`mt-1 font-mono font-bold ${score > 0 ? "text-ok" : score < 0 ? "text-crit" : "text-ink-muted"}`}
                      >
                        {score > 0 ? "+" : ""}
                        {score}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  onApply({
                    description: result.ai_profile?.description ?? "",
                    biography: result.ai_profile?.biography ?? "",
                    scores: result.ai_profile?.suggested_scores,
                    justifications: result.ai_profile?.suggested_justifications,
                    aiModelUsed: "claude-sonnet-4-20250514",
                  })
                }
                className="w-full rounded bg-action px-4 py-2 text-sm font-semibold text-ink hover:bg-action-hi"
              >
                Apply AI Suggestions to Form
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
