/**
 * Loads a content file into ShadowyRealm through its MCP tools, the same
 * surface any MCP client uses: entities, their periods, their links, then one
 * score_period call per period with evidence gathered from Wikipedia.
 *
 * Re-runnable: entities, periods and links that already exist are left alone,
 * and a period is scored only if it has no Clef assessment yet (--rescore
 * scores every period again).
 *
 *   MCP_URL=http://localhost:35421/mcp MCP_API_KEY=… bun tools/realm-load.ts content/realm.ts [--only slug,slug] [--rescore] [--publish]
 */
import type { RealmContent, RealmEntity, RealmPeriod } from "../content/types";

const MCP_URL = process.env.MCP_URL ?? "http://localhost:35421/mcp";
const MCP_API_KEY = process.env.MCP_API_KEY;
if (!MCP_API_KEY) throw new Error("MCP_API_KEY is not set");

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) throw new Error("Pass the content file, e.g. content/realm.ts");
const only = args.includes("--only") ? new Set(args[args.indexOf("--only") + 1].split(",")) : null;
const rescore = args.includes("--rescore");
const publish = args.includes("--publish");

const WIKI_HEADERS = { "User-Agent": "ShadowyRealm/1.0 (https://shadowyrealm.com)" };
const EVIDENCE_MAX = 7800;
const SKIP_SECTIONS = /^(see also|references|further reading|external links|notes|bibliography|sources|citations|footnotes|works cited|gallery|explanatory notes)$/i;

// ---------- MCP ----------

let rpcId = 0;
async function call<T = unknown>(name: string, input: Record<string, unknown>): Promise<T> {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MCP_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method: "tools/call", params: { name, arguments: input } }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${text.slice(0, 300)}`);
  const json = text.startsWith("{")
    ? JSON.parse(text)
    : JSON.parse(text.split("\n").find((l) => l.startsWith("data: "))!.slice(6));
  if (json.error) throw new Error(`${name}: ${json.error.message}`);
  const body = json.result.content[0].text as string;
  if (json.result.isError) throw new Error(`${name}: ${body}`);
  return JSON.parse(body) as T;
}

// ---------- Wikipedia ----------

const articles = new Map<string, { title: string; text: string }>();

async function article(title: string) {
  const cached = articles.get(title);
  if (cached) return cached;
  const url =
    "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      prop: "extracts",
      explaintext: "1",
      exsectionformat: "wiki",
      titles: title,
      redirects: "1",
      format: "json",
    });
  const res = await fetch(url, { headers: WIKI_HEADERS });
  if (!res.ok) throw new Error(`Wikipedia ${title}: HTTP ${res.status}`);
  const pages = (await res.json()).query.pages as Record<string, { title: string; extract?: string; missing?: string }>;
  const page = Object.values(pages)[0];
  if (page.missing !== undefined || !page.extract) throw new Error(`Wikipedia has no article "${title}"`);
  const found = { title: page.title, text: page.extract };
  articles.set(title, found);
  return found;
}

interface Section {
  heading: string;
  text: string;
}

function sections(text: string): Section[] {
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

/** Years a section mentions, BCE as negative. */
function yearsIn(text: string): number[] {
  const years: number[] = [];
  for (const m of text.matchAll(/\b(\d{1,4})\s*(BCE|BC)\b/g)) years.push(-Number(m[1]));
  for (const m of text.matchAll(/\b(\d{3,4})\b(?!\s*(BCE|BC))/g)) years.push(Number(m[1]));
  return years;
}

/**
 * Evidence for one period: the article's lead, then the sections that talk
 * about the period's years (or the sections the content names), up to the
 * evidence limit.
 */
async function evidenceFor(entity: RealmEntity, period: RealmPeriod) {
  const source = await article(period.wiki ?? entity.wiki);
  const all = sections(source.text);
  const lead = all.find((s) => s.heading === "");
  const rest = all.filter((s) => s.heading !== "");

  let chosen: Section[];
  if (period.sections) {
    const wanted = period.sections.map((h) => h.toLowerCase());
    chosen = rest.filter((s) => wanted.some((w) => s.heading.toLowerCase().startsWith(w)));
    if (chosen.length === 0) throw new Error(`${entity.slug} / ${period.label}: none of ${period.sections.join(", ")} found`);
  } else {
    const lo = period.start - 10;
    const hi = period.end + 10;
    const scored = rest.map((s, i) => ({
      s,
      i,
      hits: yearsIn(s.text).filter((y) => y >= lo && y <= hi).length / Math.sqrt(s.text.length / 1000 + 1),
    }));
    chosen = scored
      .filter((x) => x.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .map((x) => x.s);
    if (chosen.length === 0) chosen = rest;
  }

  let text = `${period.description}\n\n`;
  if (lead) text += `${lead.text.slice(0, 2000)}\n`;
  for (const s of chosen) {
    if (text.length >= EVIDENCE_MAX) break;
    text += `\n${s.heading}\n${s.text}`;
  }
  return {
    evidence: text.slice(0, EVIDENCE_MAX),
    source_url: `https://en.wikipedia.org/wiki/${encodeURIComponent(source.title.replace(/ /g, "_"))}`,
  };
}

async function thumbnail(title: string): Promise<{ image_url?: string; page_url: string }> {
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
    headers: WIKI_HEADERS,
  });
  if (!res.ok) throw new Error(`Wikipedia summary ${title}: HTTP ${res.status}`);
  const data = (await res.json()) as { thumbnail?: { source: string }; content_urls?: { desktop?: { page?: string } } };
  return {
    image_url: data.thumbnail?.source,
    page_url: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  };
}

// ---------- Load ----------

interface EntityDetail {
  entity: { slug: string; status: string };
  periods: { id: number; label: string }[];
  assessments: { period_id: number | null; ai_model_used: string | null }[];
  relationships: { direction: string; relationship_type: string; other: { slug: string } }[];
}

async function detail(slug: string): Promise<EntityDetail | null> {
  try {
    return await call<EntityDetail>("get_entity", { slug });
  } catch (err) {
    if (String(err).includes("No entity with slug")) return null;
    throw err;
  }
}

async function main() {
  const content = (await import(`${process.cwd()}/${file}`)).default as RealmContent;
  const entities = content.entities.filter((e) => !only || only.has(e.slug));
  const slugs = new Set(content.entities.map((e) => e.slug));
  for (const l of content.links) {
    if (!slugs.has(l.from) || !slugs.has(l.to)) throw new Error(`Link ${l.from} -> ${l.to} names an unknown entity`);
  }

  for (const e of entities) {
    let d = await detail(e.slug);
    if (!d) {
      const wiki = await thumbnail(e.wiki);
      await call("create_entity", {
        slug: e.slug,
        name: e.name,
        entity_type: e.type,
        description: e.description,
        ...(wiki.image_url ? { image_url: wiki.image_url } : {}),
        metadata: { ...e.metadata, wikipedia_url: wiki.page_url },
      });
      console.log(`created ${e.slug}`);
      d = (await detail(e.slug))!;
    }
    for (const p of e.periods) {
      if (d.periods.some((x) => x.label === p.label)) continue;
      await call("add_period", {
        slug: e.slug,
        label: p.label,
        start_year: p.start,
        end_year: p.end,
        description: p.description,
        reach_factor: 5,
        persistence_factor: 5,
      });
      console.log(`  period ${e.slug} / ${p.label}`);
    }
  }

  for (const l of content.links) {
    if (only && !only.has(l.from) && !only.has(l.to)) continue;
    const d = (await detail(l.from))!;
    const type = l.type ?? "influence";
    if (d.relationships.some((r) => r.direction === "outgoing" && r.other.slug === l.to && r.relationship_type === type)) {
      continue;
    }
    await call("add_relationship", {
      source_slug: l.from,
      target_slug: l.to,
      relationship_type: type,
      description: l.why,
      strength: l.share,
    });
    console.log(`link ${l.from} -> ${l.to} (${type} ${l.share})`);
  }

  for (const e of entities) {
    const d = (await detail(e.slug))!;
    for (const p of e.periods) {
      const period = d.periods.find((x) => x.label === p.label)!;
      const scored = d.assessments.some((a) => a.period_id === period.id && a.ai_model_used === "@cf/cloudflare/clef");
      if (scored && !rescore) continue;
      const { evidence, source_url } = await evidenceFor(e, p);
      const result = await call<{ assessment: Record<string, number>; period: { reach_factor: number; persistence_factor: number } }>(
        "score_period",
        { slug: e.slug, period_id: period.id, evidence, source_url },
      );
      const a = result.assessment;
      const benefit = ["scientific", "economic", "human_rights", "health", "cultural"].map((k) => Number(a[`${k}_benefit`]));
      const harm = ["scientific", "economic", "human_rights", "health", "cultural"].map((k) => Number(a[`${k}_harm`]));
      console.log(
        `  scored ${e.slug} / ${p.label}: benefit ${benefit.map((v) => v.toFixed(1)).join(" ")} | harm ${harm
          .map((v) => v.toFixed(1))
          .join(" ")} | reach ${result.period.reach_factor} persistence ${result.period.persistence_factor}`,
      );
    }
    if (publish && d.entity.status !== "published") {
      await call("set_entity_status", { slug: e.slug, status: "published" });
      console.log(`  published ${e.slug}`);
    }
  }
}

await main();
