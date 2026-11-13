/**
 * Entity research: the Wikipedia summary and categories for a title. Writes
 * nothing and calls no model; drafting the description and choosing periods is
 * the MCP client's job, and scoring is score_period's.
 */
import type { SiteConfig } from "../sites/types";
import type { ResearchEntityInput } from "./sr-schemas";

interface WikipediaSearchResult {
  title: string;
  extract: string;
  thumbnail?: string;
  categories: string[];
  page_url: string;
}

// Wikimedia rejects requests that carry no User-Agent (HTTP 403); each site sends its own.
export async function fetchWikipedia(site: SiteConfig, query: string): Promise<WikipediaSearchResult | null> {
  const WIKIPEDIA_HEADERS = { "User-Agent": site.brand.userAgent };
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

export async function research(site: SiteConfig, args: ResearchEntityInput) {
  const wikipedia = await fetchWikipedia(site, args.query);
  if (!wikipedia) throw new Error(`Wikipedia has no article titled "${args.query}"`);
  return wikipedia;
}
