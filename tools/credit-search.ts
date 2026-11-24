/**
 * Builds a site's credit links from evidence with System One, as History's were built on 2026-11-14,
 * and writes the graph tools/credit-graph.ts reads (proposals, and each consequence's inherited share).
 *
 * The pilot asked about every pair in which the cause began before the consequence ended. This asks
 * only about the pairs whose Wikipedia articles link one to the other (tools/wiki-links.ts), in both
 * directions where the dates allow, and reads each entry's whole article as its evidence
 * (tools/wiki-evidence.ts). A pair already linked by a curated credit link is not asked about.
 *
 *   bun tools/credit-search.ts content/inventions/index.ts --out content/inventions/system-one-graph.json \
 *     [--articles <articles.jsonl>] [--pay [--budget <dollars>]] [--concurrency 6]
 *
 * Nothing is paid for twice: every request goes through the System One cache. Without --pay it asks
 * no model: it says what the search would cost, and at most what the shares could cost, and stops.
 * With --pay it asks the search, then the shares and inherited shares its proposals need, and writes
 * --out. --budget caps what the run may spend: before each stage, what it has spent at list prices
 * plus the most the stage could cost must fit, or the run stops there and writes nothing. The
 * Workers AI token is read from the file CF_TOKEN_FILE names.
 *
 * A curated credit link without a share takes Clairic's: it is asked beside the consequence's
 * proposals and written to the graph's `shares`.
 */
import { dirname } from "node:path";
import type { SiteContent, SiteEntity } from "../content/types";
import { creditTypes, siteFor } from "../src/sites";
import { MIN_SHARE, type SystemOneGraph } from "./credit-graph";
import {
  CAUSE_AT_LEAST,
  CLAIRIC_MODEL,
  CLEF_MODEL,
  canHaveShaped,
  inheritedRequest,
  readEstimates,
  readSearchAnswers,
  searchRequests,
  shareRequests,
  startOf,
  type ClairicRequest,
  type Entry,
  type SearchRequest,
} from "./credit-requests";
import { DOLLARS_PER_CHAR_AT_MOST, DOLLARS_PER_INPUT_TOKEN, runModel } from "./workers-ai";
import { SystemOneCache } from "./system-one-cache";
import { wholeArticleEvidence } from "./wiki-evidence";
import { normalizeTitle, WikiStore } from "./wiki-links";

const WORK = "/Volumes/Berthold/Landru/work/shadowyrealm/credit-search";

const args = process.argv.slice(2);
const flag = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const file = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!file) throw new Error("Pass the content file, e.g. content/inventions/index.ts");
const out = flag("--out");
if (!out) throw new Error("Pass --out, the graph file to write (e.g. content/inventions/system-one-graph.json)");
const pay = args.includes("--pay");
const concurrency = Number(flag("--concurrency") ?? 6);
const budget = flag("--budget") === undefined ? Infinity : Number(flag("--budget"));
if (Number.isNaN(budget)) throw new Error("--budget takes a number of dollars");

async function inPool<T>(items: T[], n: number, fn: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.max(1, n) }, async () => {
    while (next < items.length) await fn(items[next++]);
  }));
}

const dollars = (n: number) => `$${n.toFixed(2)}`;
const charsOf = (input: unknown) => JSON.stringify(input).length;

interface Ask<R> {
  request: R;
  model: string;
  /** The entry whose evidence is the state: the cause of a search, the consequence of a share. */
  subject: string;
  /** What the answers are about, in question or field order. */
  about: string[];
}

async function main() {
  const mod = (await import(file!.startsWith("/") ? file! : `${process.cwd()}/${file}`)) as {
    default: SiteContent<string, string>;
    site?: string;
  };
  if (!mod.site) throw new Error(`${file} must export \`site\`, the key of the site it belongs to`);
  const site = siteFor(mod.site);
  const content = mod.default;
  const entities = content.entities;
  const bySlug = new Map(entities.map((e) => [e.slug, e]));
  const order = new Map(entities.map((e, i) => [e.slug, i]));
  const entry = (e: SiteEntity<string>): Entry => ({ slug: e.slug, name: e.name, description: e.description, periods: e.periods });
  const store = new WikiStore(`${WORK}/${site.key}`, site.brand.userAgent, flag("--articles"));
  const cache = new SystemOneCache();

  // Each entry's evidence is its first period's article, whole; its own article names it in others' links.
  const evidenceTitle = (e: SiteEntity<string>) => e.periods[0].wiki ?? e.wiki;
  let read = 0;
  await inPool(entities, 3, async (e) => {
    await store.article(evidenceTitle(e));
    await store.article(e.wiki);
    if (++read % 200 === 0) console.log(`read ${read}/${entities.length} articles`);
  });
  const evidenceArticle = new Map<string, Awaited<ReturnType<WikiStore["article"]>>>();
  const titles = new Map<string, Set<string>>();
  const name = (title: string, slug: string) => {
    const t = normalizeTitle(title);
    titles.set(t, (titles.get(t) ?? new Set()).add(slug));
  };
  for (const e of entities) {
    evidenceArticle.set(e.slug, await store.article(evidenceTitle(e)));
    name((await store.article(e.wiki)).title, e.slug);
  }
  const canonical = [...titles.keys()];
  for (const [title, redirects] of await store.redirectsTo(canonical)) for (const r of redirects) for (const s of titles.get(title)!) name(r, s);

  // Named pairs: one entry's article links to the other's.
  const links = await store.linksOf([...evidenceArticle.values()].map((a) => a.revid));
  const pairs = new Set<string>();
  for (const e of entities) {
    for (const t of links.get(evidenceArticle.get(e.slug)!.revid)!) {
      for (const other of titles.get(t) ?? []) {
        if (other === e.slug) continue;
        const [a, b] = order.get(e.slug)! < order.get(other)! ? [e.slug, other] : [other, e.slug];
        pairs.add(`${a} ${b}`);
      }
    }
  }

  const credit = creditTypes(site);
  const curated = content.links.filter((l) => credit.has(l.type ?? "influence"));
  const curatedPairs = new Set(curated.map((l) => `${l.from} ${l.to}`));
  const unshared = curated.filter((l) => l.share == null);

  const candidates = new Map<string, string[]>();
  for (const pair of pairs) {
    const [a, b] = pair.split(" ");
    for (const [cause, consequence] of [
      [a, b],
      [b, a],
    ]) {
      if (curatedPairs.has(`${cause} ${consequence}`)) continue;
      if (!canHaveShaped(entry(bySlug.get(cause)!), entry(bySlug.get(consequence)!))) continue;
      candidates.set(cause, [...(candidates.get(cause) ?? []), consequence]);
    }
  }
  const byStart = (x: string, y: string) =>
    startOf(entry(bySlug.get(x)!)) - startOf(entry(bySlug.get(y)!)) || order.get(x)! - order.get(y)!;
  for (const list of candidates.values()) list.sort(byStart);
  // Kept beside the Wikipedia stores, so what was asked can be read without the cache.
  await Bun.write(
    `${store.dir}/candidates.json`,
    JSON.stringify(Object.fromEntries(entities.filter((e) => candidates.has(e.slug)).map((e) => [e.slug, candidates.get(e.slug)])), null, 1),
  );

  const evidence = new Map<string, string>();
  const evidenceOf = (slug: string) => {
    if (!evidence.has(slug)) {
      const e = bySlug.get(slug)!;
      evidence.set(slug, wholeArticleEvidence(e.periods[0].description, evidenceArticle.get(slug)!.text));
    }
    return evidence.get(slug)!;
  };

  const searches: Ask<SearchRequest>[] = [];
  for (const e of entities) {
    const list = candidates.get(e.slug);
    if (!list) continue;
    const requests = searchRequests(entry(e), evidenceOf(e.slug), list.map((s) => entry(bySlug.get(s)!)));
    requests.forEach((request, i) => searches.push({ request, model: CLEF_MODEL, subject: e.slug, about: list.slice(i * 64, i * 64 + 64) }));
  }
  const questions = searches.reduce((s, a) => s + a.about.length, 0);

  // Every cause a consequence's shares could ask about, were every candidate a proposal.
  const causesOf = (proposed: Map<string, string[]>) => {
    const out = new Map<string, string[]>();
    for (const [cause, list] of proposed) for (const c of list) out.set(c, [...(out.get(c) ?? []), cause]);
    for (const l of unshared) out.set(l.to, [...(out.get(l.to) ?? []), l.from]);
    for (const list of out.values()) list.sort((x, y) => order.get(x)! - order.get(y)!);
    return out;
  };
  const shareAsks = (proposed: Map<string, string[]>): Ask<ClairicRequest>[] => {
    const asks: Ask<ClairicRequest>[] = [];
    const causes = causesOf(proposed);
    for (const e of entities) {
      const list = causes.get(e.slug);
      if (!list) continue;
      shareRequests(entry(e), evidenceOf(e.slug), list.map((s) => entry(bySlug.get(s)!))).forEach((request, i) =>
        asks.push({ request, model: CLAIRIC_MODEL, subject: e.slug, about: list.slice(i * 64, i * 64 + 64) }),
      );
    }
    return asks;
  };
  const inheritedAsks = (causes: Map<string, string[]>): Ask<ClairicRequest>[] =>
    entities
      .filter((e) => causes.get(e.slug)?.length)
      .map((e) => ({
        request: inheritedRequest(entry(e), evidenceOf(e.slug), causes.get(e.slug)!.map((s) => entry(bySlug.get(s)!))),
        model: CLAIRIC_MODEL,
        subject: e.slug,
        about: causes.get(e.slug)!,
      }));

  // The search reads only each question's yes probability, which a partial answer keeps.
  const unpaid = <R>(asks: Ask<R>[]) =>
    asks.filter((a) => {
      const held = cache.get(a.model, a.request);
      return !held || (held.partial && a.model !== CLEF_MODEL);
    });
  const cost = <R>(asks: Ask<R>[]) => asks.reduce((s, a) => s + charsOf(a.request) * DOLLARS_PER_CHAR_AT_MOST[a.model], 0);

  const searchToAsk = unpaid(searches);
  const everyCandidate = new Map([...candidates].map(([k, v]) => [k, [...v]]));
  const ceilingShares = shareAsks(everyCandidate);
  const ceilingInherited = inheritedAsks(causesOf(everyCandidate));
  console.log(
    `${site.brand.name}: ${entities.length} entries, ${pairs.size} pairs whose articles link one to the other, ` +
      `${questions} questions from ${candidates.size} causes in ${searches.length} Clef requests`,
  );
  console.log(
    `  the search: ${searchToAsk.length} requests not in the System One cache, ${charsOf(searchToAsk.map((a) => a.request)).toLocaleString("en-US")} characters, at most ${dollars(cost(searchToAsk))}`,
  );
  console.log(
    `  the shares, were every candidate a proposal: ${ceilingShares.length + ceilingInherited.length} Clairic requests, at most ${dollars(
      cost(unpaid(ceilingShares)) + cost(unpaid(ceilingInherited)),
    )}`,
  );
  if (!pay) {
    console.log("Nothing was asked. Run again with --pay to ask them.");
    process.exit(searchToAsk.length > 0 ? 2 : 0);
  }

  const tokenFile = process.env.CF_TOKEN_FILE;
  if (!tokenFile) throw new Error("CF_TOKEN_FILE is not set");
  const token = (await Bun.file(tokenFile).text()).trim();
  const spent = { tokens: { [CLEF_MODEL]: 0, [CLAIRIC_MODEL]: 0 } as Record<string, number>, asked: 0 };
  const spentSoFar = () => Object.entries(spent.tokens).reduce((s, [m, t]) => s + t * DOLLARS_PER_INPUT_TOKEN[m], 0);
  const withinBudget = (stage: string, atMost: number) => {
    if (spentSoFar() + atMost <= budget) return;
    console.log(
      `Stopped before ${stage}: ${dollars(spentSoFar())} spent and at most ${dollars(atMost)} more is over the ${dollars(budget)} budget. ` +
        "Nothing was written; the answers so far are in the System One cache.",
    );
    process.exit(3);
  };
  const answer = async <R>(asks: Ask<R>[], label: string) => {
    const outputs = new Map<Ask<R>, unknown>();
    let done = 0;
    let failed = 0;
    await inPool(asks, concurrency, async (a) => {
      try {
        const { output, cached } = await cache.ask(a.model, a.request, (m, input) => runModel(token, m, input), {
          acceptPartial: a.model === CLEF_MODEL,
        });
        if (!cached) {
          spent.asked++;
          spent.tokens[a.model] += Number((output as { usage?: { input_tokens?: number } }).usage?.input_tokens ?? 0);
        }
        outputs.set(a, output);
      } catch (err) {
        failed++;
        console.log(`FAILED ${label} for ${a.subject}: ${(err as Error).message}`);
      }
      if (++done % 100 === 0) console.log(`  ${label}: ${done}/${asks.length}`);
    });
    if (failed > 0) throw new Error(`${failed} ${label} requests failed; run again (answers already held are not asked twice)`);
    return outputs;
  };

  // The search.
  withinBudget("the search", cost(searchToAsk));
  const proposed = new Map<string, string[]>();
  const yes = new Map<string, number>();
  for (const [a, output] of await answer(searches, "search")) {
    readSearchAnswers(a.request, output).forEach((p, i) => {
      yes.set(`${a.subject} ${a.about[i]}`, p);
      if (p >= CAUSE_AT_LEAST) proposed.set(a.subject, [...(proposed.get(a.subject) ?? []), a.about[i]]);
    });
  }
  const proposals = [...proposed.values()].reduce((s, l) => s + l.length, 0);
  console.log(`  ${proposals} proposals: Clef put a yes at ${CAUSE_AT_LEAST} or more; ${dollars(spentSoFar())} spent so far`);

  // The shares.
  const shares = shareAsks(proposed);
  console.log(`  the shares: ${shares.length} Clairic requests, ${unpaid(shares).length} to ask, at most ${dollars(cost(unpaid(shares)))}`);
  withinBudget("the shares", cost(unpaid(shares)));
  const share = new Map<string, number>();
  for (const [a, output] of await answer(shares, "shares")) {
    readEstimates(a.request, output).forEach((m, i) => share.set(`${a.about[i]} ${a.subject}`, m));
  }

  // The inherited shares: every cause the stored graph would credit, curated first.
  const credited = new Map<string, string[]>();
  const credit_ = (from: string, to: string) => credited.set(to, [...(credited.get(to) ?? []), from]);
  for (const l of curated) if ((l.share ?? share.get(`${l.from} ${l.to}`) ?? 0) > 0) credit_(l.from, l.to);
  for (const e of entities) {
    for (const cause of causesOf(proposed).get(e.slug) ?? []) {
      if (curatedPairs.has(`${cause} ${e.slug}`)) continue;
      if ((share.get(`${cause} ${e.slug}`) ?? 0) >= MIN_SHARE) credit_(cause, e.slug);
    }
  }
  const inherited = inheritedAsks(credited);
  console.log(`  the inherited shares: ${inherited.length} Clairic requests, ${unpaid(inherited).length} to ask, at most ${dollars(cost(unpaid(inherited)))}`);
  withinBudget("the inherited shares", cost(unpaid(inherited)));
  const owed: Record<string, number> = {};
  for (const [a, output] of await answer(inherited, "inherited")) owed[a.subject] = readEstimates(a.request, output)[0];

  const graph: SystemOneGraph & { shares?: { from: string; to: string; type: string; share: number }[] } = {
    inherited: Object.fromEntries(entities.filter((e) => e.slug in owed).map((e) => [e.slug, owed[e.slug]])),
    proposals: entities.flatMap((e) =>
      (causesOf(proposed).get(e.slug) ?? [])
        .filter((cause) => yes.has(`${cause} ${e.slug}`))
        .map((cause) => ({ from: cause, to: e.slug, p: yes.get(`${cause} ${e.slug}`)!, share: share.get(`${cause} ${e.slug}`)! })),
    ),
    ...(unshared.length > 0
      ? { shares: unshared.map((l) => ({ from: l.from, to: l.to, type: l.type ?? "influence", share: share.get(`${l.from} ${l.to}`)! })) }
      : {}),
  };
  await Bun.write(out!, `${JSON.stringify(graph, null, 1)}\n`);
  const paid = spentSoFar();
  console.log(
    `wrote ${out}: ${graph.proposals.length} proposals, ${Object.keys(graph.inherited).length} inherited shares` +
      `${graph.shares ? `, ${graph.shares.length} shares for curated links` : ""} (in ${dirname(out!)})`,
  );
  console.log(
    `asked ${spent.asked} requests: Clef ${spent.tokens[CLEF_MODEL].toLocaleString("en-US")} input tokens, ` +
      `Clairic ${spent.tokens[CLAIRIC_MODEL].toLocaleString("en-US")}, ${dollars(paid)} at list prices`,
  );
}

await main();
