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

export class Wikipedia {
  private articles = new Map<string, Article>();
  constructor(private readonly userAgent: string) {}

  async article(title: string): Promise<Article> {
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
    const res = await fetch(url, { headers: { "User-Agent": this.userAgent } });
    if (!res.ok) throw new Error(`Wikipedia ${title}: HTTP ${res.status}`);
    const pages = (await res.json()).query.pages as Record<
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
