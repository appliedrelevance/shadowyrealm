/**
 * ShadowyRealm CF Worker entry point.
 * Handles /api/ai/* routes via AI Gateway binding.
 * All other routes serve the static SPA.
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  AIGATEWAY: {
    run: (options: {
      provider: string;
      endpoint: string;
      headers: Record<string, string>;
      body: Record<string, unknown>;
    }) => Promise<unknown>;
  };
  ANTHROPIC_API_KEY: string;
}

interface WikipediaSearchResult {
  title: string;
  extract: string;
  thumbnail?: string;
  categories: string[];
  page_url: string;
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

  // Fetch categories
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
  "description": "Brief description of the entity",
  "biography": "Detailed biographical or contextual summary",
  "impact_summary": "Summary of their overall historical impact",
  "key_achievements": ["achievement 1", "achievement 2", "achievement 3"],
  "suggested_scores": {
    "scientific": <number -10 to +10>,
    "economic": <number -10 to +10>,
    "human_rights": <number -10 to +10>,
    "health": <number -10 to +10>,
    "cultural": <number -10 to +10>
  },
  "suggested_justifications": {
    "scientific": "justification",
    "economic": "justification",
    "human_rights": "justification",
    "health": "justification",
    "cultural": "justification"
  },
  "confidence_level": <number 0 to 1>,
  "analysis_reasoning": "Explanation of the analysis approach",
  "potential_biases": ["bias warning 1", "bias warning 2"]
}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/ai/research" && request.method === "POST") {
      try {
        const { query } = (await request.json()) as { query: string };
        if (!query) {
          return Response.json({ error: "query is required" }, { status: 400 });
        }

        // Wikipedia lookup
        const wikipedia = await fetchWikipedia(query);

        // AI Gateway call
        const aiResponse = await env.AIGATEWAY.run({
          provider: "anthropic",
          endpoint: "messages",
          headers: {
            "x-api-key": env.ANTHROPIC_API_KEY,
          },
          body: {
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            temperature: 0.3,
            messages: [
              {
                role: "user",
                content: buildAnalysisPrompt(query, wikipedia),
              },
            ],
          },
        });

        // Parse AI response
        const aiData = aiResponse as {
          content?: Array<{ type: string; text: string }>;
        };
        const textContent = aiData.content?.find((c) => c.type === "text");
        let aiProfile = null;
        if (textContent?.text) {
          try {
            aiProfile = JSON.parse(textContent.text);
          } catch {
            aiProfile = { raw: textContent.text, parse_error: true };
          }
        }

        return Response.json({
          wikipedia,
          ai_profile: aiProfile,
          bias_warnings: aiProfile?.potential_biases ?? [],
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "AI Gateway unavailable";
        return Response.json({ error: message }, { status: 502 });
      }
    }

    // Serve SPA for all other routes
    return env.ASSETS.fetch(request);
  },
};
