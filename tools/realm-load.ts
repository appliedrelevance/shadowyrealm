/**
 * Loads a content file into a site through its MCP tools, the same
 * surface any MCP client uses: entities, their periods, their links, then one
 * score_period call per period with evidence gathered from Wikipedia.
 *
 * Re-runnable: entities, periods and links that already exist are left alone,
 * and a period is scored only if it has no Clef assessment yet (--rescore
 * scores every period again).
 *
 *   MCP_URL=http://localhost:35421/mcp MCP_API_KEY=… bun tools/realm-load.ts content/realm.ts [--only slug,slug] [--rescore] [--publish] [--concurrency 4]
 *
 * The content index exports `site`, the key of its site (src/sites): that picks
 * the User-Agent, the dimensions it logs, the default link type and the link
 * each entity type requires. Evidence is cited by the permalink of the
 * Wikipedia revision it was read from, so a score's source can be read again
 * exactly as it stood. Every period is scored from its whole article
 * (wiki-evidence.ts), cut only where it would not fit Clef's context.
 *
 * --concurrency creates and scores that many entities at once; links are
 * always added one at a time, so the credit cap is checked in order.
 *
 * A site that counts people (ScoringConfig.breadth) takes its links from the stored graph
 * (tools/credit-graph.ts): the curated links and System One's proposals, scaled
 * to each consequence's inherited share. A link already in the index whose
 * strength differs is set to the stored one, lowered strengths first so the
 * credit cap holds throughout.
 */
import type { SiteContent } from "../content/types";
import { creditTypes, siteFor } from "../src/sites";
import type { SiteConfig } from "../src/sites/types";
import { storedGraph, type StoredLink } from "./credit-graph";
import { Wikipedia } from "./wiki-evidence";

const MCP_URL = process.env.MCP_URL ?? "http://localhost:35421/mcp";
const MCP_API_KEY = process.env.MCP_API_KEY;
if (!MCP_API_KEY) throw new Error("MCP_API_KEY is not set");

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) throw new Error("Pass the content file, e.g. content/realm.ts");
const only = args.includes("--only") ? new Set(args[args.indexOf("--only") + 1].split(",")) : null;
const rescore = args.includes("--rescore");
const publish = args.includes("--publish");
const concurrency = args.includes("--concurrency") ? Number(args[args.indexOf("--concurrency") + 1]) : 1;

let WIKI_HEADERS: Record<string, string> = {};
let wiki: Wikipedia;

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
  relationships: { direction: string; relationship_type: string; strength: number | string; other: { slug: string } }[];
}

async function detail(slug: string): Promise<EntityDetail | null> {
  try {
    return await call<EntityDetail>("get_entity", { slug });
  } catch (err) {
    if (String(err).includes("No entity with slug")) return null;
    throw err;
  }
}

/** Run fn over items, at most n at a time; the first failure stops the run. */
async function inPool<T>(items: T[], n: number, fn: (item: T) => Promise<void>) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await fn(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.max(1, n) }, worker));
}

/** An entity whose type requires an outgoing link must have one in the same file. */
function checkRequiredLinks(site: SiteConfig, content: SiteContent<string, string>) {
  for (const e of content.entities) {
    const required = site.entityTypes.find((t) => t.key === e.type)?.requiresOutgoing;
    if (!required) continue;
    if (!content.links.some((l) => l.from === e.slug && (l.type ?? "influence") === required)) {
      throw new Error(`"${e.slug}" is a ${e.type}, which needs an outgoing ${required} link in the same file`);
    }
  }
}

/** The link type a link without one gets: "influence", where the site has it. */
function linkTypeOf(site: SiteConfig, l: { from: string; to: string; type?: string }): string {
  if (l.type) return l.type;
  if (site.linkTypes.some((t) => t.key === "influence")) return "influence";
  throw new Error(`The link ${l.from} -> ${l.to} has no type, and ${site.brand.name} has no default`);
}

async function main() {
  const mod = (await import(file.startsWith("/") ? file : `${process.cwd()}/${file}`)) as { default: SiteContent<string, string>; site?: string };
  if (!mod.site) throw new Error(`${file} must export \`site\`, the key of the site it belongs to`);
  const site = siteFor(mod.site);
  WIKI_HEADERS = { "User-Agent": site.brand.userAgent };
  wiki = new Wikipedia(site.brand.userAgent);
  const dims = site.scoring.dimensions.map((d) => d.key);
  const content = mod.default;
  checkRequiredLinks(site, content);
  const entities = content.entities.filter((e) => !only || only.has(e.slug));
  // A link may point at an entity already in the index rather than in this file.
  const slugs = new Set(content.entities.map((e) => e.slug));
  for (const slug of new Set(content.links.flatMap((l) => [l.from, l.to]))) {
    if (!slugs.has(slug) && !(await detail(slug))) throw new Error(`A link names "${slug}", which is neither in this file nor in the index`);
  }

  await inPool(entities, concurrency, async (e) => {
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
  });

  const countsPeople = site.scoring.breadth === "people";
  const curated = content.links.map((l) => ({ from: l.from, to: l.to, share: l.share, type: linkTypeOf(site, l), why: l.why }));
  let links: StoredLink[] = curated.map((l) => ({ ...l, proposed: false }));
  if (countsPeople) {
    if (!content.systemOne) throw new Error(`${site.brand.name} counts people, so ${file} must include systemOne`);
    links = storedGraph(curated, creditTypes(site), content.systemOne);
  }
  const sources = new Map<string, EntityDetail>();
  const adds: StoredLink[] = [];
  const changes: { link: StoredLink; from: number }[] = [];
  for (const l of links) {
    if (only && !only.has(l.from) && !only.has(l.to)) continue;
    if (!sources.has(l.from)) sources.set(l.from, (await detail(l.from))!);
    const found = sources
      .get(l.from)!
      .relationships.find((r) => r.direction === "outgoing" && r.other.slug === l.to && r.relationship_type === l.type);
    if (!found) adds.push(l);
    else if (countsPeople && Math.abs(Number(found.strength) - l.share) > 0.0005) changes.push({ link: l, from: Number(found.strength) });
  }
  // Lowered strengths first, then new links, then raised strengths: a consequence's credit cap holds at every step.
  const lowered = changes.filter((c) => c.link.share < c.from);
  const raised = changes.filter((c) => c.link.share >= c.from);
  const setStrength = async ({ link, from }: { link: StoredLink; from: number }) => {
    await call("set_relationship_strength", {
      source_slug: link.from,
      target_slug: link.to,
      relationship_type: link.type,
      strength: Math.round(link.share * 10000) / 10000,
    });
    console.log(`strength ${link.from} -> ${link.to}: ${from} -> ${link.share.toFixed(4)}`);
  };
  for (const c of lowered) await setStrength(c);
  for (const l of adds) {
    await call("add_relationship", {
      source_slug: l.from,
      target_slug: l.to,
      relationship_type: l.type,
      description: l.why,
      strength: Math.round(l.share * 10000) / 10000,
    });
    console.log(`link ${l.from} -> ${l.to} (${l.type} ${l.share.toFixed(4)}${l.proposed ? ", proposed" : ""})`);
  }
  for (const c of raised) await setStrength(c);

  await inPool(entities, concurrency, async (e) => {
    const d = (await detail(e.slug))!;
    for (const p of e.periods) {
      const period = d.periods.find((x) => x.label === p.label)!;
      const scored = d.assessments.some((a) => a.period_id === period.id && a.ai_model_used === "@cf/cloudflare/clef");
      if (scored && !rescore) continue;
      const { evidence, source_url } = await wiki.evidence(e, p);
      const result = await call<{ assessment: Record<string, number>; period: { reach_factor: number; persistence_factor: number } }>(
        "score_period",
        { slug: e.slug, period_id: period.id, evidence, source_url },
      );
      const a = result.assessment;
      const benefit = dims.map((k) => Number(a[`${k}_benefit`]));
      const harm = dims.map((k) => Number(a[`${k}_harm`]));
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
  });
}

await main();
