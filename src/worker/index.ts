/**
 * ShadowyRealm CF Worker entry point.
 * Handles /api/ai/* routes via AI Gateway binding.
 * All other routes serve the static SPA.
 */

interface AiGateway {
  run(input: {
    provider: string;
    endpoint: string;
    headers: Record<string, string>;
    query: Record<string, unknown>;
  }): Promise<Response>;
  patchLog(logId: string, data: Record<string, unknown>): Promise<void>;
  getLog(logId: string): Promise<unknown>;
  getUrl(provider?: string): Promise<string>;
}

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  AI: {
    gateway: (gatewayId: string) => AiGateway;
  };
  AI_GATEWAY_NAME: string;
  ANTHROPIC_API_KEY: string;
  OPENROUTER_API_KEY: string;
}

interface WikipediaSearchResult {
  title: string;
  extract: string;
  thumbnail?: string;
  categories: string[];
  page_url: string;
}

const VALID_TYPES = ["person", "organization", "event"] as const;
type EntityType = (typeof VALID_TYPES)[number];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

async function fetchWikipedia(query: string): Promise<WikipediaSearchResult | null> {
  const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  const resp = await fetch(searchUrl);
  if (!resp.ok) return null;

  const data = (await resp.json()) as {
    title: string;
    extract: string;
    thumbnail?: { source: string };
    content_urls?: { desktop?: { page?: string } };
  };

  const catUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(data.title)}&prop=categories&cllimit=20&format=json&origin=*`;
  const catResp = await fetch(catUrl);
  const catData = (await catResp.json()) as {
    query?: { pages?: Record<string, { categories?: { title: string }[] }> };
  };
  const pages = catData.query?.pages ?? {};
  const firstPage = Object.values(pages)[0];
  const categories = (firstPage?.categories ?? [])
    .map((c) => c.title.replace("Category:", ""))
    .filter((c) => !c.startsWith("Articles") && !c.startsWith("All "));

  return {
    title: data.title,
    extract: data.extract,
    thumbnail: data.thumbnail?.source,
    categories,
    page_url: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
  };
}

function buildAnalysisPrompt(query: string, wiki: WikipediaSearchResult | null): string {
  const wikiContext = wiki
    ? `Wikipedia summary for "${wiki.title}":\n${wiki.extract}\n\nCategories: ${wiki.categories.join(", ")}`
    : `No Wikipedia article found for "${query}".`;

  return `You are an expert historian and impact analyst. Analyze the following entity and provide a structured assessment.

${wikiContext}

Respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "detected_type": "person" | "organization" | "event",
  "description": "Brief 1-2 sentence description",
  "biography": "Detailed biographical or contextual summary (3-5 paragraphs)",
  "impact_summary": "Summary of their overall historical impact",
  "key_achievements": ["achievement 1", "achievement 2", "achievement 3"],
  "metadata": {
    "birth_date": "YYYY-MM-DD or empty string if unknown (persons only)",
    "death_date": "YYYY-MM-DD or empty string if unknown/alive (persons only)",
    "nationality": "nationality or empty string (persons only)",
    "founded_date": "YYYY-MM-DD or empty string (organizations only)",
    "headquarters": "city/country or empty string (organizations only)",
    "organization_type": "corporation|ngo|government|institution|military or empty string (organizations only)",
    "start_date": "YYYY-MM-DD or empty string (events only)",
    "end_date": "YYYY-MM-DD or empty string (events only)",
    "location": "location or empty string (events only)",
    "event_type": "war|discovery|movement|disaster|treaty|revolution or empty string (events only)"
  },
  "suggested_scores": {
    "scientific": <integer -10 to +10>,
    "economic": <integer -10 to +10>,
    "human_rights": <integer -10 to +10>,
    "health": <integer -10 to +10>,
    "cultural": <integer -10 to +10>
  },
  "suggested_justifications": {
    "scientific": "2-3 sentence justification",
    "economic": "2-3 sentence justification",
    "human_rights": "2-3 sentence justification",
    "health": "2-3 sentence justification",
    "cultural": "2-3 sentence justification"
  },
  "confidence_level": <number 0 to 1>,
  "analysis_reasoning": "Explanation of the analysis approach and any caveats",
  "potential_biases": ["bias warning 1", "bias warning 2"]
}

Important: For detected_type, classify as "person" for individual humans, "organization" for companies/institutions/governments, and "event" for historical events/wars/discoveries/movements. Only include metadata fields relevant to the detected type — leave irrelevant fields as empty strings.`;
}

function validateAndClampProfile(raw: Record<string, unknown>): Record<string, unknown> | null {
  if (!raw.description || !raw.suggested_scores) return null;

  const detectedType = VALID_TYPES.includes(raw.detected_type as EntityType)
    ? raw.detected_type
    : "person";

  const scores = raw.suggested_scores as Record<string, number>;
  const clampedScores: Record<string, number> = {};
  for (const key of ["scientific", "economic", "human_rights", "health", "cultural"]) {
    clampedScores[key] = clamp(Math.round(Number(scores[key]) || 0), -10, 10);
  }

  return {
    ...raw,
    detected_type: detectedType,
    suggested_scores: clampedScores,
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/ai/research" && request.method === "POST") {
      const { query, model } = (await request.json()) as { query: string; model?: string };
      if (!query) {
        return Response.json({ error: "query is required" }, { status: 400 });
      }

      // Wikipedia lookup
      const wikipedia = await fetchWikipedia(query);

      const gateway = env.AI.gateway(env.AI_GATEWAY_NAME);
      const selectedModel = model ?? "claude-sonnet-4-5";
      const useOpenRouter = selectedModel.includes("/");

      let aiResp: Response;

      if (useOpenRouter) {
        // OpenRouter — OpenAI-compatible format via gateway binding
        aiResp = await gateway.run({
          provider: "openrouter",
          endpoint: "chat/completions",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
            "cf-aig-metadata": JSON.stringify({ project: "shadowyrealm" }),
          },
          query: {
            model: selectedModel,
            max_tokens: 3000,
            temperature: 0.3,
            messages: [
              {
                role: "user",
                content: buildAnalysisPrompt(query, wikipedia),
              },
            ],
          },
        });
      } else {
        // Anthropic — Messages API format via gateway binding
        aiResp = await gateway.run({
          provider: "anthropic",
          endpoint: "messages",
          headers: {
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "cf-aig-metadata": JSON.stringify({ project: "shadowyrealm" }),
          },
          query: {
            model: selectedModel,
            max_tokens: 3000,
            temperature: 0.3,
            messages: [
              {
                role: "user",
                content: buildAnalysisPrompt(query, wikipedia),
              },
            ],
          },
        });
      }

      if (!aiResp.ok) {
        const errText = await aiResp.text();
        throw new Error(`AI Gateway ${aiResp.status}: ${errText.slice(0, 200)}`);
      }

      // Parse response — OpenRouter returns OpenAI format, Anthropic returns Messages format
      let textContent: string | undefined;
      if (useOpenRouter) {
        const data = (await aiResp.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        textContent = data.choices?.[0]?.message?.content ?? undefined;
      } else {
        const data = (await aiResp.json()) as {
          content?: Array<{ type: string; text?: string }>;
        };
        textContent = data.content?.find((b) => b.type === "text")?.text;
      }
      let aiProfile = null;

      if (textContent) {
        try {
          // Strip markdown code fences if present
          const cleaned = textContent.replace(/^```(?:json)?\s*\n?/m, "").replace(/\n?```\s*$/m, "").trim();
          const parsed = JSON.parse(cleaned) as Record<string, unknown>;
          aiProfile = validateAndClampProfile(parsed);
        } catch {
          aiProfile = null;
        }
      }

      return Response.json({
        wikipedia,
        ai_profile: aiProfile,
        bias_warnings: (aiProfile as Record<string, unknown>)?.potential_biases ?? [],
        model_used: selectedModel,
      });
    }

    // Serve SPA for all other routes
    return env.ASSETS.fetch(request);
  },
};
