/**
 * Which entries' Wikipedia articles name which: the links an article's own wikitext makes, followed
 * through redirects to the articles they land on. Navigation boxes are templates, so their links are
 * not in the wikitext and are not counted; an infobox's links are.
 *
 * Everything read from Wikipedia is kept in a folder of JSONL stores, so a re-run reads the same
 * revisions and asks Wikipedia nothing it already answered:
 *   articles.jsonl   { key, article: { title, text, revid } }, as tools/wiki-evidence.ts reads it
 *   links.jsonl      { revid, links }, the titles a revision's wikitext links to
 *   redirects.jsonl  { title, redirects }, the titles that redirect to an article
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import type { Article } from "./wiki-evidence";

const API = "https://en.wikipedia.org/w/api.php";
/** Titles or revisions per API request, the most Wikipedia allows a client that is not a bot. */
const PER_REQUEST = 50;

/** A title as Wikipedia files it: spaces for underscores, one space at a time, the first letter capital. */
export function normalizeTitle(raw: string): string {
  const t = raw
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;| /g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const NOT_AN_ARTICLE =
  /^(file|image|media|category|template|help|portal|wikipedia|wp|special|talk|user|draft|module|mos|wikt|wiktionary|commons|s|w|q|n|b|v|voy|species|[a-z]{2,3}(-[a-z]+)?)\s*:/i;

/** The article titles a page's wikitext links to, each once, in order of first appearance. */
export function wikilinks(wikitext: string): string[] {
  const seen = new Set<string>();
  for (const m of wikitext.matchAll(/\[\[([^[\]|]+?)(?:\|[^[\]]*)?\]\]/g)) {
    const target = m[1].replace(/^:/, "").split("#")[0];
    if (!target.trim() || NOT_AN_ARTICLE.test(target)) continue;
    seen.add(normalizeTitle(target));
  }
  return [...seen];
}

function readJsonl<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as T);
}

export class WikiStore {
  private articles = new Map<string, Article>();
  private links = new Map<number, string[]>();
  private redirects = new Map<string, string[]>();
  private readonly articlesPath: string;

  /** `articles` is an article store kept elsewhere (music-vital's), read and added to in place. */
  constructor(
    readonly dir: string,
    private readonly userAgent: string,
    articles?: string,
  ) {
    mkdirSync(dir, { recursive: true });
    this.articlesPath = articles ?? `${dir}/articles.jsonl`;
    for (const a of readJsonl<{ key: string; article: Article }>(this.articlesPath)) this.articles.set(a.key, a.article);
    for (const l of readJsonl<{ revid: number; links: string[] }>(`${dir}/links.jsonl`)) this.links.set(l.revid, l.links);
    for (const r of readJsonl<{ title: string; redirects: string[] }>(`${dir}/redirects.jsonl`)) this.redirects.set(r.title, r.redirects);
  }

  private async get(params: Record<string, string>): Promise<Record<string, unknown>> {
    const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`;
    for (let attempt = 0; ; attempt++) {
      const res = await fetch(url, { headers: { "User-Agent": this.userAgent } });
      if (res.ok) return (await res.json()) as Record<string, unknown>;
      if (attempt >= 8 || !(res.status === 429 || res.status >= 500)) throw new Error(`Wikipedia: HTTP ${res.status} for ${url.slice(0, 200)}`);
      await Bun.sleep(10_000 * (attempt + 1));
    }
  }

  /** The article filed under a title, read from Wikipedia the first time and kept. */
  async article(title: string): Promise<Article> {
    const held = this.articles.get(title);
    if (held) return held;
    const body = await this.get({ action: "query", prop: "extracts|revisions", rvprop: "ids", explaintext: "1", exsectionformat: "wiki", titles: title, redirects: "1" });
    const page = (body.query as { pages: { title: string; extract?: string; missing?: boolean; revisions?: { revid: number }[] }[] }).pages[0];
    if (page.missing || !page.extract) throw new Error(`Wikipedia has no article "${title}"`);
    const revid = page.revisions?.[0]?.revid;
    if (!revid) throw new Error(`Wikipedia gave no revision id for "${title}"`);
    const article = { title: page.title, text: page.extract, revid };
    this.articles.set(title, article);
    appendFileSync(this.articlesPath, `${JSON.stringify({ key: title, article })}\n`);
    return article;
  }

  /** For each revision, the titles its wikitext links to. */
  async linksOf(revids: number[]): Promise<Map<number, string[]>> {
    const missing = [...new Set(revids)].filter((r) => !this.links.has(r));
    for (let i = 0; i < missing.length; i += PER_REQUEST) {
      const batch = missing.slice(i, i + PER_REQUEST);
      const body = await this.get({ action: "query", prop: "revisions", revids: batch.join("|"), rvprop: "ids|content", rvslots: "main" });
      const pages = (body.query as { pages: { revisions?: { revid: number; slots: { main: { content: string } } }[] }[] }).pages;
      for (const page of pages) {
        for (const rev of page.revisions ?? []) {
          const links = wikilinks(rev.slots.main.content);
          this.links.set(rev.revid, links);
          appendFileSync(`${this.dir}/links.jsonl`, `${JSON.stringify({ revid: rev.revid, links })}\n`);
        }
      }
      for (const r of batch) if (!this.links.has(r)) throw new Error(`Wikipedia returned no wikitext for revision ${r}`);
    }
    return new Map(revids.map((r) => [r, this.links.get(r)!]));
  }

  /** For each article title, the titles that redirect to it. */
  async redirectsTo(titles: string[]): Promise<Map<string, string[]>> {
    const missing = [...new Set(titles)].filter((t) => !this.redirects.has(t));
    for (let i = 0; i < missing.length; i += PER_REQUEST) {
      const batch = missing.slice(i, i + PER_REQUEST);
      const found = new Map<string, string[]>(batch.map((t) => [t, []]));
      let next: Record<string, string> = {};
      for (;;) {
        const body = await this.get({
          action: "query",
          prop: "redirects",
          rdprop: "title",
          rdnamespace: "0",
          rdlimit: "max",
          titles: batch.join("|"),
          ...next,
        });
        const pages = (body.query as { pages: { title: string; redirects?: { title: string }[] }[] }).pages;
        for (const page of pages) {
          if (!found.has(page.title)) throw new Error(`Wikipedia answered for "${page.title}", which was not asked; pass canonical titles`);
          found.get(page.title)!.push(...(page.redirects ?? []).map((r) => r.title));
        }
        const cont = body.continue as Record<string, string> | undefined;
        if (!cont) break;
        next = cont;
      }
      for (const [title, redirects] of found) {
        this.redirects.set(title, redirects);
        appendFileSync(`${this.dir}/redirects.jsonl`, `${JSON.stringify({ title, redirects })}\n`);
      }
    }
    return new Map(titles.map((t) => [t, this.redirects.get(t)!]));
  }
}
