/**
 * Entity research: a Wikipedia summary plus an LLM-drafted impact assessment,
 * routed through the Cloudflare AI Gateway. Writes nothing.
 */
import type { ResearchEntityInput } from "./sr-schemas";

export interface AiGateway {
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

export interface ResearchEnv {
  AI: { gateway: (gatewayId: string) => AiGateway };
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

// Wikimedia rejects requests that carry no User-Agent (HTTP 403).
const WIKIPEDIA_HEADERS = { "User-Agent": "ShadowyRealm/1.0 (https://shadowyrealm.com)" };

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export async function fetchWikipedia(query: string): Promise<WikipediaSearchResult | null> {
  const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  const resp = await fetch(searchUrl, { headers: WIKIPEDIA_HEADERS });
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error(`Wikipedia summary lookup failed: HTTP ${resp.status}`);

  const data = (await resp.json()) as {
    title: string;
    extract: string;
    thumbnail?: { source: string };
    content_urls?: { desktop?: { page?: string } };
  };

  const catUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(data.title)}&prop=categories&cllimit=20&format=json&origin=*`;
  const catResp = await fetch(catUrl, { headers: WIKIPEDIA_HEADERS });
  if (!catResp.ok) throw new Error(`Wikipedia category lookup failed: HTTP ${catResp.status}`);
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

function validateAndClampProfile(raw: Record<string, unknown>): Record<string, unknown> {
  if (!raw.description || !raw.suggested_scores) {
    throw new Error("AI response is missing description or suggested_scores");
  }

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

export async function research(env: ResearchEnv, args: ResearchEntityInput) {
  const wikipedia = await fetchWikipedia(args.query);

  const gateway = env.AI.gateway(env.AI_GATEWAY_NAME);
  const selectedModel = args.model ?? "claude-sonnet-4-5";
  const useOpenRouter = selectedModel.includes("/");
  const messages = [{ role: "user", content: buildAnalysisPrompt(args.query, wikipedia) }];

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
      query: { model: selectedModel, max_tokens: 3000, temperature: 0.3, messages },
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
      query: { model: selectedModel, max_tokens: 3000, temperature: 0.3, messages },
    });
  }

  if (!aiResp.ok) {
    const errText = await aiResp.text();
    throw new Error(`AI Gateway ${aiResp.status}: ${errText.slice(0, 200)}`);
  }

  // OpenRouter returns OpenAI format, Anthropic returns Messages format
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
  if (!textContent) throw new Error(`${selectedModel} returned no text`);

  // Strip markdown code fences if present
  const cleaned = textContent.replace(/^```(?:json)?\s*\n?/m, "").replace(/\n?```\s*$/m, "").trim();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    throw new Error(`${selectedModel} did not return valid JSON: ${cleaned.slice(0, 200)}`);
  }
  const aiProfile = validateAndClampProfile(parsed);

  return {
    wikipedia,
    ai_profile: aiProfile,
    bias_warnings: aiProfile.potential_biases ?? [],
    model_used: selectedModel,
  };
}
