/**
 * The evidence a period is scored from: its description, then the whole Wikipedia article in order,
 * without the reference sections. Every site reads the whole article; it is cut, at a section
 * boundary, only where it would not fit Clef's context.
 *
 * Shared by the loader (realm-load.ts) and any offline run, so both build the same evidence.
 */
import type { SiteEntity, SitePeriod } from "../content/types";

/** Clef's context window, from its Workers AI model page. */
export const CLEF_CONTEXT_TOKENS = 65_536;
/**
 * The most a period's twelve questions have taken, and the fewest characters of evidence a token
 * has held, over the 1,212 whole-article Clef requests of 2026-11-15: 10,245 and 2.89. Evidence up
 * to this length fits the context however it tokenizes.
 */
const QUESTION_TOKENS = 10_245;
const FEWEST_CHARS_PER_TOKEN = 2.89;
export const EVIDENCE_MAX_CHARS = Math.floor((CLEF_CONTEXT_TOKENS - QUESTION_TOKENS) * FEWEST_CHARS_PER_TOKEN);

const SKIP_SECTIONS = /^(see also|references|further reading|external links|notes|bibliography|sources|citations|footnotes|works cited|gallery|explanatory notes)$/i;

export interface Article {
  title: string;
  text: string;
  revid: number;
}

/**
 * A Wikipedia API read as JSON. Wikimedia answers a client it thinks too quick with 429, and its
 * servers sometimes with 5xx: both are waited out, longer each time, eight times at most.
 */
export async function wikipediaJson<T>(url: string, userAgent: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": userAgent } });
    if (res.ok) return (await res.json()) as T;
    if (attempt >= 8 || !(res.status === 429 || res.status >= 500)) {
      throw new Error(`Wikipedia: HTTP ${res.status} for ${url.slice(0, 200)}`);
    }
    await Bun.sleep(10_000 * (attempt + 1));
  }
}

/** Articles stored as JSONL rows of { key, article } (tools/wiki-links.ts's store), by their key. */
export async function storedArticles(path: string): Promise<Map<string, Article>> {
  const out = new Map<string, Article>();
  for (const line of (await Bun.file(path).text()).split("\n")) {
    if (!line) continue;
    const row = JSON.parse(line) as { key: string; article: Article };
    out.set(row.key, row.article);
  }
  if (out.size === 0) throw new Error(`${path} holds no articles`);
  return out;
}

export class Wikipedia {
  private articles = new Map<string, Article>();
  /**
   * With stored articles, every article is read from them, as it stood when it was stored, and none is
   * fetched: a period is then scored from the same text as the offline run that stored them.
   */
  constructor(
    private readonly userAgent: string,
    private readonly stored?: ReadonlyMap<string, Article>,
  ) {}

  async article(title: string): Promise<Article> {
    if (this.stored) {
      const found = this.stored.get(title);
      if (!found) throw new Error(`The stored articles have no "${title}"`);
      return found;
    }
    const cached = this.articles.get(title);
    if (cached) return cached;
    const url =
      "https://en.wikipedia.org/w/api.php?" +
      new URLSearchParams({
        action: "query",
        prop: "extracts|revisions",
        rvprop: "ids",
        explaintext: "1",
        exsectionformat: "wiki",
        titles: title,
        redirects: "1",
        format: "json",
      });
    const body = await wikipediaJson<{ query: { pages: Record<string, unknown> } }>(url, this.userAgent);
    const pages = body.query.pages as Record<
      string,
      { title: string; extract?: string; missing?: string; revisions?: { revid: number }[] }
    >;
    const page = Object.values(pages)[0];
    if (page.missing !== undefined || !page.extract) throw new Error(`Wikipedia has no article "${title}"`);
    const revid = page.revisions?.[0]?.revid;
    if (!revid) throw new Error(`Wikipedia gave no revision id for "${title}"`);
    const found = { title: page.title, text: page.extract, revid };
    this.articles.set(title, found);
    return found;
  }

  /** A period's evidence and the permalink of the revision it was read from. */
  async evidence(entity: SiteEntity<string>, period: SitePeriod) {
    const source = await this.article(period.wiki ?? entity.wiki);
    return { evidence: wholeArticleEvidence(period.description, source.text), source_url: permalink(source) };
  }
}

interface Section {
  heading: string;
  text: string;
}

export function sections(text: string): Section[] {
  const out: Section[] = [];
  let current: Section = { heading: "", text: "" };
  for (const line of text.split("\n")) {
    const m = line.match(/^(=+)\s*(.+?)\s*\1\s*$/);
    if (m) {
      out.push(current);
      current = { heading: m[2], text: "" };
    } else if (line.trim()) {
      current.text += `${line}\n`;
    }
  }
  out.push(current);
  return out.filter((s) => s.text.trim() && !SKIP_SECTIONS.test(s.heading));
}

/** The description, then each section in order while the evidence fits (EVIDENCE_MAX_CHARS). */
export function wholeArticleEvidence(description: string, articleText: string, max = EVIDENCE_MAX_CHARS): string {
  let text = `${description}\n\n`;
  let taken = 0;
  for (const s of sections(articleText)) {
    const next = s.heading === "" ? s.text : `\n${s.heading}\n${s.text}`;
    if (text.length + next.length > max) break;
    text += next;
    taken++;
  }
  if (taken === 0) throw new Error(`the article's first section alone is over ${max} characters`);
  return text;
}

export const permalink = (source: { title: string; revid: number }) =>
  `https://en.wikipedia.org/w/index.php?title=${encodeURIComponent(source.title.replace(/ /g, "_"))}&oldid=${source.revid}`;
