/**
 * Loads a content file into a site through its MCP tools, the same
 * surface any MCP client uses: entities, their periods, their links, then one
 * score_period call per period with evidence gathered from Wikipedia.
 *
 * Re-runnable: entities, periods and links that already exist are left alone,
 * and a period is scored only if it has no Clef assessment yet (--rescore
 * scores every period again, from the evidence it was last scored from;
 * --refresh reads its article from Wikipedia again).
 *
 *   MCP_URL=http://localhost:35421/mcp MCP_API_KEY=… bun tools/realm-load.ts content/realm.ts [--only slug,slug] [--rescore [--refresh]] [--articles <jsonl>] [--pay] [--publish] [--concurrency 4]
 *
 * No model is paid for twice. Every Clef and Clairic answer is kept in the
 * System One cache (system-one-cache.ts), and score_period is given the ones
 * already held, by request key, instead of asking again. A run that would
 * have to ask a model first lists those requests and what they would cost at
 * most, and scores nothing; --pay asks them, and keeps the answers.
 *
 * The content index exports `site`, the key of its site (src/sites): that picks
 * the User-Agent, the dimensions it logs, the default link type and the link
 * each entity type requires. Evidence is cited by the permalink of the
 * Wikipedia revision it was read from, so a score's source can be read again
 * exactly as it stood. Every period is scored from its whole article
 * (wiki-evidence.ts), cut only where it would not fit Clef's context.
 *
 * --articles scores every period from the article revisions stored in that file (tools/wiki-links.ts's
 * store, as the offline run that wrote the content read them) instead of today's Wikipedia.
 *
 * --concurrency creates and scores that many entities at once; links are
 * always added one at a time, so the credit cap is checked in order.
 *
 * A content file that includes System One's graph (tools/credit-search.ts) takes its links from the
 * stored graph (tools/credit-graph.ts): the curated links and System One's proposals, scaled to each
 * consequence's inherited share. A site that counts people (ScoringConfig.breadth) must include it.
 * A link already in the index whose strength differs is set to the stored one, lowered strengths
 * first so the credit cap holds throughout.
 */
import type { SiteContent } from "../content/types";
import { creditTypes, siteFor } from "../src/sites";
import type { SiteConfig } from "../src/sites/types";
import { storedGraph, type StoredLink } from "./credit-graph";
import { keyOf, SystemOneCache } from "./system-one-cache";
import { storedArticles, Wikipedia } from "./wiki-evidence";
import { DOLLARS_PER_CHAR_AT_MOST } from "./workers-ai";

const MCP_URL = process.env.MCP_URL ?? "http://localhost:35421/mcp";
const MCP_API_KEY = process.env.MCP_API_KEY;
if (!MCP_API_KEY) throw new Error("MCP_API_KEY is not set");

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) throw new Error("Pass the content file, e.g. content/realm.ts");
const only = args.includes("--only") ? new Set(args[args.indexOf("--only") + 1].split(",")) : null;
const rescore = args.includes("--rescore");
const refresh = args.includes("--refresh");
const pay = args.includes("--pay");
const publish = args.includes("--publish");
const concurrency = args.includes("--concurrency") ? Number(args[args.indexOf("--concurrency") + 1]) : 1;
const articlesFile = args.includes("--articles") ? args[args.indexOf("--articles") + 1] : undefined;

const cache = new SystemOneCache();

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

interface Unanswered {
  model: string;
  key: string;
  input_chars: number;
}

type ScoreResult =
  | { scored: false; unanswered: Unanswered[] }
  | {
      scored: true;
      assessment: Record<string, number>;
      period: { reach_factor: number; persistence_factor: number };
      asked: { model: string; key: string; input: unknown; output: unknown }[];
    };

interface Job {
  slug: string;
  label: string;
  input: Record<string, unknown>;
  answers: Record<string, unknown>;
  missing: Unanswered[];
}

async function detail(slug: string): Promise<EntityDetail | null> {
  try {
    return await call<EntityDetail>("get_entity", { slug });
  } catch (err) {
    if (String(err).includes("No entity with slug")) return null;
    throw err;
  }
}

/**
 * A score_period that predates answers and pay would drop them and ask the models, paying for
 * answers already held; such a server is refused before anything is sent.
 */
async function checkScorePeriodTakesAnswers() {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MCP_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method: "tools/list", params: {} }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`tools/list: HTTP ${res.status} ${text.slice(0, 300)}`);
  const json = text.startsWith("{")
    ? JSON.parse(text)
    : JSON.parse(text.split("\n").find((l) => l.startsWith("data: "))!.slice(6));
  const tool = (json.result.tools as { name: string; inputSchema: { properties?: Record<string, unknown> } }[]).find(
    (t) => t.name === "score_period",
  );
  const props = tool?.inputSchema.properties ?? {};
  if (!("answers" in props && "pay" in props)) {
    throw new Error(`${MCP_URL}'s score_period takes no answers or pay, so it would pay for answers already held; deploy the Worker first`);
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
  await checkScorePeriodTakesAnswers();
  WIKI_HEADERS = { "User-Agent": site.brand.userAgent };
  wiki = new Wikipedia(site.brand.userAgent, articlesFile ? await storedArticles(articlesFile) : undefined);
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

  const curated = content.links.map((l) => ({ from: l.from, to: l.to, share: l.share, type: linkTypeOf(site, l), why: l.why }));
  if (site.scoring.breadth === "people" && !content.systemOne) {
    throw new Error(`${site.brand.name} counts people, so ${file} must include systemOne`);
  }
  const fromGraph = content.systemOne !== undefined;
  const links: StoredLink[] = content.systemOne
    ? storedGraph(curated, creditTypes(site), content.systemOne)
    : curated.map((l) => {
        if (l.share == null) throw new Error(`The link ${l.from} -> ${l.to} has no share, and ${file} has no systemOne to set it`);
        return { ...l, share: l.share, proposed: false };
      });
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
    else if (fromGraph && Math.abs(Number(found.strength) - l.share) > 0.0005) changes.push({ link: l, from: Number(found.strength) });
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

  // Every request goes through the System One cache: an answer already paid for is passed to
  // score_period by its key and never asked again. First a pass that asks no model and writes nothing
  // finds each period's requests; if any is not in the cache, the run says what asking them would
  // cost at most and stops, unless --pay.
  const jobs: Job[] = [];
  await inPool(entities, concurrency, async (e) => {
    const d = (await detail(e.slug))!;
    for (const p of e.periods) {
      const period = d.periods.find((x) => x.label === p.label)!;
      const scored = d.assessments.some((a) => a.period_id === period.id && a.ai_model_used === "@cf/cloudflare/clef");
      if (scored && !rescore) continue;
      // A re-score asks again from the evidence the period was scored from; --refresh reads the article again.
      const input = { slug: e.slug, period_id: period.id, ...(scored && !refresh ? {} : await wiki.evidence(e, p)) };
      const plan = await call<ScoreResult>("score_period", { ...input, pay: false });
      if (plan.scored) throw new Error(`score_period scored ${e.slug} / ${p.label} with no answers and pay false`);
      const answers: Record<string, unknown> = {};
      const missing: Unanswered[] = [];
      for (const u of plan.unanswered) {
        const held = cache.byKey(u.key);
        if (held && !held.partial) answers[u.key] = held.output;
        else missing.push(u);
      }
      jobs.push({ slug: e.slug, label: p.label, input, answers, missing });
    }
  });
  const missing = jobs.flatMap((j) => j.missing);
  const ceiling = missing.reduce((s, u) => s + u.input_chars * DOLLARS_PER_CHAR_AT_MOST[u.model], 0);
  const cached = jobs.filter((j) => j.missing.length === 0).length;
  console.log(
    `${jobs.length} periods to score: ${cached} answered from the System One cache, ` +
      `${missing.length} requests to ask for ${jobs.length - cached} (at most $${ceiling.toFixed(2)})`,
  );
  if (missing.length > 0 && !pay) {
    for (const j of jobs.filter((j) => j.missing.length > 0)) {
      console.log(`  to ask: ${j.slug} / ${j.label} (${j.missing.map((u) => u.model).join(", ")})`);
    }
    console.log("Nothing was scored. Run again with --pay to ask them.");
    process.exit(2);
  }

  await inPool(jobs, concurrency, async (j) => {
    const result = await call<ScoreResult>("score_period", { ...j.input, answers: j.answers, pay: j.missing.length > 0 });
    if (!result.scored) throw new Error(`score_period left ${j.slug} / ${j.label} unscored`);
    for (const a of result.asked) {
      const key = keyOf(a.model, a.input);
      if (key !== a.key) throw new Error(`${j.slug} / ${j.label}: score_period keys its ${a.model} request ${a.key}, the cache ${key}`);
      cache.put(a.model, a.input, a.output);
    }
    const a = result.assessment;
    const benefit = dims.map((k) => Number(a[`${k}_benefit`]));
    const harm = dims.map((k) => Number(a[`${k}_harm`]));
    console.log(
      `  scored ${j.slug} / ${j.label}: benefit ${benefit.map((v) => v.toFixed(1)).join(" ")} | harm ${harm
        .map((v) => v.toFixed(1))
        .join(" ")} | reach ${result.period.reach_factor} persistence ${result.period.persistence_factor}` +
        (result.asked.length > 0 ? ` (asked ${result.asked.map((x) => x.model).join(", ")})` : ""),
    );
  });

  if (publish) {
    for (const e of entities) {
      const d = (await detail(e.slug))!;
      if (d.entity.status === "published") continue;
      await call("set_entity_status", { slug: e.slug, status: "published" });
      console.log(`  published ${e.slug}`);
    }
  }
}

await main();
