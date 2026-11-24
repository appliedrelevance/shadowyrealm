/**
 * A site's realm as it would be after loading its content, computed offline: every period's Clef
 * (and, where the site counts people, Clairic) request built as score_period would build it once the
 * stored graph is in the index, answered from the System One cache, scored by the site's own code
 * (composeScores, walkShares) and written in /api/realm's shape, for the river to be drawn before
 * anything is loaded or deployed.
 *
 *   bun tools/realm-preview.ts content/inventions/index.ts --out realm.json --evidence cache \
 *     [--published https://inventions.shadowyrealm.com] [--articles <articles.jsonl>] [--pay [--budget <dollars>]]
 *
 * --evidence cache scores each period from the evidence it was last scored from: the evidence of its
 * latest cached Clef request that, rebuilt with the index's current links, is byte for byte the one
 * the cache holds. --evidence articles (the default) reads each period's whole article from the
 * Wikipedia store (tools/wiki-links.ts), as the loader does.
 *
 * Links are ordered as the loader inserts them into an index that already holds the curated ones:
 * curated in file order, then new proposals in graph order, so each leave-out list is the Worker's.
 * --published keeps the entities that site publishes, as its public /api/realm does. --curated-only
 * leaves System One's graph out, which is the index as it stands: the preview of an unchanged config
 * then matches the live site.
 *
 * Without --pay, a request the cache does not hold stops the run with its price; with --pay it is
 * asked and kept. The Workers AI token is read from the file CF_TOKEN_FILE names.
 */
import type { SiteContent } from "../content/types";
import { buildClairicRequest, CLAIRIC_MODEL, readClairicAnswers } from "../src/lib/clairic";
import { buildClefRequest, CLEF_MODEL, readClefAnswers, type PeriodToScore } from "../src/lib/clef";
import { composeScores, walkShares, type AssessmentRow, type LinkRow, type PeriodRow } from "../src/lib/credit";
import { sampleCurve } from "../src/lib/atis-calculator";
import { streamPlace } from "../src/lib/sr-service";
import { keyOf } from "../src/lib/system-one";
import { bucketEdges } from "../src/lib/timeline";
import { creditTypes, siteFor } from "../src/sites";
import { storedGraph, type StoredLink } from "./credit-graph";
import { SystemOneCache } from "./system-one-cache";
import { wholeArticleEvidence } from "./wiki-evidence";
import { WikiStore } from "./wiki-links";
import { DOLLARS_PER_CHAR_AT_MOST, DOLLARS_PER_INPUT_TOKEN, runModel } from "./workers-ai";

const args = process.argv.slice(2);
const flag = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const file = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!file) throw new Error("Pass the content file, e.g. content/inventions/index.ts");
const out = flag("--out");
if (!out) throw new Error("Pass --out, the realm file to write");
const evidenceFrom = flag("--evidence") ?? "articles";
if (evidenceFrom !== "cache" && evidenceFrom !== "articles") throw new Error("--evidence is cache or articles");
const pay = args.includes("--pay");
const budget = flag("--budget") === undefined ? Infinity : Number(flag("--budget"));

const round = (n: number, places = 2) => Math.round(n * 10 ** places) / 10 ** places;

const mod = (await import(file.startsWith("/") ? file : `${process.cwd()}/${file}`)) as { default: SiteContent<string, string>; site?: string };
if (!mod.site) throw new Error(`${file} must export \`site\``);
const site = siteFor(mod.site);
const content = mod.default;
const credit = creditTypes(site);
const cache = new SystemOneCache();
const countsPeople = site.scoring.breadth === "people";

const curated = content.links.map((l) => ({ from: l.from, to: l.to, share: l.share, type: l.type ?? "influence", why: l.why }));
// --curated-only leaves System One's graph out: the index as it stands, to check the preview against live.
const stored: StoredLink[] = content.systemOne && !args.includes("--curated-only")
  ? storedGraph(curated, credit, content.systemOne)
  : curated.map((l) => ({ ...l, share: l.share!, proposed: false }));
const bySlug = new Map(content.entities.map((e) => [e.slug, e]));
const leaveOut = (slug: string, links: { from: string; to: string; type: string; share: number }[]) =>
  links.filter((l) => l.from === slug && credit.has(l.type) && Math.round(l.share * 10000) > 0).map((l) => bySlug.get(l.to)!.name);

const span = (a: number, b: number) => {
  const y = (n: number) => (n < 0 ? `${-n} BCE` : `${n}`);
  return a === b ? y(a) : `${y(a)} to ${y(b)}`;
};

// The cached Clef requests by the period they score, for --evidence cache.
const byPeriod = new Map<string, { key: string; input: { state: string }; at: string }[]>();
if (evidenceFrom === "cache") {
  for (const file of new Bun.Glob("*.jsonl").scanSync(cache.dir)) {
    for (const line of (await Bun.file(`${cache.dir}/${file}`).text()).split("\n")) {
      if (!line.includes('"model":"@cf/cloudflare/clef"') || !line.includes("Period under assessment")) continue;
      const a = JSON.parse(line) as { key: string; input: { state: string }; at: string };
      const head = a.input.state.slice(0, a.input.state.indexOf("\n\nEvidence:\n"));
      byPeriod.set(head, [...(byPeriod.get(head) ?? []), a]);
    }
  }
}

const store = new WikiStore(`/Volumes/Berthold/Landru/work/shadowyrealm/credit-search/${site.key}`, site.brand.userAgent, flag("--articles"));
// Links in the index now: the curated ones at their file shares, which the evidence was last scored with.
const before = curated.map((l) => ({ ...l, share: l.share ?? 0 }));

interface Job {
  slug: string;
  label: string;
  toScore: PeriodToScore;
  requests: { model: string; input: unknown; key: string }[];
}
const jobs: Job[] = [];
const unrecovered: string[] = [];
for (const e of content.entities) {
  for (const p of e.periods) {
    const when = `"${p.label}" (${span(p.start, p.end)})`;
    const base = { entity: e.name, entity_type: e.type, period: p.label, start_year: p.start, end_year: p.end };
    let evidence: string | undefined;
    if (evidenceFrom === "cache") {
      const held = (byPeriod.get(`Subject: ${e.name}\nPeriod under assessment: ${when}`) ?? []).sort((a, b) => (a.at < b.at ? 1 : -1));
      const excluded = leaveOut(e.slug, before);
      for (const a of held) {
        const candidate = a.input.state.slice(a.input.state.indexOf("\n\nEvidence:\n") + "\n\nEvidence:\n".length);
        if (keyOf(CLEF_MODEL, buildClefRequest(site, { ...base, excluded, evidence: candidate })) === a.key) {
          evidence = candidate;
          break;
        }
      }
      if (evidence === undefined) {
        unrecovered.push(`${e.slug} / ${p.label}`);
        continue;
      }
    } else {
      evidence = wholeArticleEvidence(p.description, (await store.article(p.wiki ?? e.wiki)).text);
    }
    const toScore = { ...base, excluded: leaveOut(e.slug, stored), evidence };
    const requests = [
      { model: CLEF_MODEL, input: buildClefRequest(site, toScore) },
      ...(countsPeople ? [{ model: CLAIRIC_MODEL, input: buildClairicRequest(site, toScore) }] : []),
    ].map((r) => ({ ...r, key: keyOf(r.model, r.input) }));
    jobs.push({ slug: e.slug, label: p.label, toScore, requests });
  }
}
if (unrecovered.length > 0) {
  throw new Error(`No cached request in the current wording holds the evidence of ${unrecovered.length} periods: ${unrecovered.slice(0, 8).join("; ")}`);
}

const missing = jobs.flatMap((j) => j.requests.filter((r) => !cache.byKey(r.key) || cache.byKey(r.key)!.partial));
const ceiling = missing.reduce((s, r) => s + JSON.stringify(r.input).length * DOLLARS_PER_CHAR_AT_MOST[r.model], 0);
const count = (m: string) => missing.filter((r) => r.model === m).length;
console.log(
  `${site.brand.name}: ${jobs.length} periods, ${stored.length} links (${stored.filter((l) => l.proposed).length} proposed); ` +
    `${missing.length} requests not in the cache (Clef ${count(CLEF_MODEL)}, Clairic ${count(CLAIRIC_MODEL)}), at most $${ceiling.toFixed(2)}`,
);
if (missing.length > 0) {
  if (!pay) {
    console.log("Nothing was asked. Run again with --pay to ask them.");
    process.exit(2);
  }
  if (ceiling > budget) {
    console.log(`At most $${ceiling.toFixed(2)} is over the $${budget.toFixed(2)} budget; nothing was asked.`);
    process.exit(3);
  }
  const tokenFile = process.env.CF_TOKEN_FILE;
  if (!tokenFile) throw new Error("CF_TOKEN_FILE is not set");
  const token = (await Bun.file(tokenFile).text()).trim();
  const tokens: Record<string, number> = { [CLEF_MODEL]: 0, [CLAIRIC_MODEL]: 0 };
  let next = 0;
  let done = 0;
  const failures: string[] = [];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (next < missing.length) {
        const r = missing[next++];
        try {
          const output = await runModel(token, r.model, r.input);
          cache.put(r.model, r.input, output);
          tokens[r.model] += Number((output as { usage?: { input_tokens?: number } }).usage?.input_tokens ?? 0);
        } catch (err) {
          failures.push((err as Error).message);
        }
        if (++done % 100 === 0) console.log(`  asked ${done}/${missing.length}`);
      }
    }),
  );
  if (failures.length > 0) throw new Error(`${failures.length} requests failed (${failures[0]}); run again`);
  const spent = Object.entries(tokens).reduce((s, [m, t]) => s + t * DOLLARS_PER_INPUT_TOKEN[m], 0);
  console.log(`asked ${missing.length}: Clef ${tokens[CLEF_MODEL].toLocaleString("en-US")} input tokens, Clairic ${tokens[CLAIRIC_MODEL].toLocaleString("en-US")}, $${spent.toFixed(2)} at list prices`);
}

// The index as the Worker would read it.
let published: Set<string> | null = null;
const origin = flag("--published");
if (origin) {
  const live = (await (await fetch(`${origin}/api/realm`)).json()) as { entities: { slug: string }[] };
  published = new Set(live.entities.map((e) => e.slug));
}
const entities = content.entities.filter((e) => !published || published.has(e.slug));
const idOf = new Map(entities.map((e, i) => [e.slug, i + 1]));
const periods: (PeriodRow & { slug: string })[] = [];
const assessments: AssessmentRow[] = [];
for (const j of jobs) {
  const entityId = idOf.get(j.slug);
  if (!entityId) continue;
  const clef = readClefAnswers(site.scoring, cache.byKey(j.requests[0].key)!.output);
  const people = countsPeople ? readClairicAnswers(site.scoring, cache.byKey(j.requests[1].key)!.output) : null;
  const id = periods.length + 1;
  periods.push({
    id,
    entity_id: entityId,
    slug: j.slug,
    label: j.label,
    start_year: j.toScore.start_year,
    end_year: j.toScore.end_year,
    reach_factor: clef.reach_factor,
    persistence_factor: clef.persistence_factor,
  });
  const row: Record<string, number | null> = { entity_id: entityId, period_id: id };
  for (const d of site.scoring.dimensions) {
    row[`${d.key}_benefit`] = clef.benefit[d.key];
    row[`${d.key}_harm`] = clef.harm[d.key];
    if (people) {
      row[`${d.key}_benefit_people`] = people.benefit[d.key];
      row[`${d.key}_harm_people`] = people.harm[d.key];
    }
  }
  assessments.push(row as AssessmentRow);
}
const links: (LinkRow & { id: number; description: string })[] = stored
  .filter((l) => idOf.has(l.from) && idOf.has(l.to))
  .map((l, i) => ({
    id: i + 1,
    source_entity_id: idOf.get(l.from)!,
    target_entity_id: idOf.get(l.to)!,
    relationship_type: l.type,
    strength: Math.round(l.share * 10000) / 10000,
    description: l.why,
  }));

const asOfYear = new Date().getUTCFullYear();
const scores = composeScores(
  { scoring: site.scoring, creditTypes: credit },
  entities.map((e) => idOf.get(e.slug)!),
  periods,
  assessments,
  links,
  walkShares(links, credit),
  asOfYear,
);
const edges = bucketEdges(asOfYear, site.timeline);
const ranked = [...entities].sort(
  (a, b) => scores.get(idOf.get(b.slug)!)!.total_magnitude - scores.get(idOf.get(a.slug)!)!.total_magnitude || a.name.localeCompare(b.name),
);
const trimmed = (curve: { benefit: number[]; harm: number[] }) => {
  const live = (i: number) => curve.benefit[i] > 0.005 || curve.harm[i] > 0.005;
  let first = 0;
  while (first < curve.benefit.length && !live(first)) first++;
  let last = curve.benefit.length - 1;
  while (last >= first && !live(last)) last--;
  return {
    from: first,
    benefit: curve.benefit.slice(first, last + 1).map((v) => round(v, 1)),
    harm: curve.harm.slice(first, last + 1).map((v) => round(v, 1)),
  };
};
const realm = {
  as_of_year: asOfYear,
  entities: ranked.map((e) => {
    const s = scores.get(idOf.get(e.slug)!)!;
    const own = periods.filter((p) => p.slug === e.slug);
    return {
      slug: e.slug,
      name: e.name,
      entity_type: e.type,
      total_magnitude: round(s.total_magnitude),
      tier: s.tier,
      own_magnitude: round(s.own_magnitude),
      credited_magnitude: round(s.credited_magnitude),
      benefit_total: round(s.benefit_total),
      harm_total: round(s.harm_total),
      description: e.description,
      first_year: own.length ? Math.min(...own.map((p) => p.start_year)) : null,
      last_year: own.length ? Math.max(...own.map((p) => p.end_year)) : null,
      stream: streamPlace(site, { name: e.name, metadata: e.metadata ?? null }),
      curve: trimmed(sampleCurve(s.own.curve, edges)),
    };
  }),
  links: links.map((l) => ({
    source: entities[l.source_entity_id - 1].slug,
    target: entities[l.target_entity_id - 1].slug,
    relationship_type: l.relationship_type,
    strength: Number(l.strength),
    description: l.description,
  })),
};
await Bun.write(out, JSON.stringify(realm));
console.log(`wrote ${out}: ${realm.entities.length} entities, ${realm.links.length} links`);
console.log(realm.entities.slice(0, 15).map((e, i) => `${i + 1}. ${e.name} ${e.total_magnitude}`).join("\n"));
