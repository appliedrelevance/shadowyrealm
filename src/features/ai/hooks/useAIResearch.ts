import { useState, useCallback } from "react";
import type { AIResearchResponse } from "../types";

interface UseAIResearchReturn {
  research: (query: string) => Promise<void>;
  data: AIResearchResponse | null;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useAIResearch(): UseAIResearchReturn {
  const [data, setData] = useState<AIResearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const research = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const resp = await fetch("/api/ai/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.trim() }),
    });

    if (!resp.ok) {
      const body = (await resp
        .json()
        .catch(() => ({}))) as { error?: string };
      setIsLoading(false);
      throw new Error(body.error || `HTTP ${resp.status}`);
    }

    const result = (await resp.json()) as AIResearchResponse;
    setData(result);
    setIsLoading(false);
  }, []);

  const wrappedResearch = useCallback(
    async (query: string) => {
      try {
        await research(query);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("AI research failed"));
      }
    },
    [research],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { research: wrappedResearch, data, isLoading, error, reset };
}
