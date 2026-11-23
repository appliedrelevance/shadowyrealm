/**
 * Freezes the music benchmark's scores for ShadowyRealm's /music pages. Reads a scored music-vital
 * work directory (Landru/work/shadowyrealm/music-vital/: results.json from its score.ts, the entity
 * and link set music-vital.json, and the articles it read, articles.jsonl) and writes:
 *
 * - public/history/data/music-vital.json, what the stream draws: each entity's slug, family and
 *   shade as indexes into the family list, its span, its influence and its curve to three
 *   significant figures.
 * - public/history/data/music/<slug>.json, what an entity's page shows: its description, rank,
 *   influence by dimension, its period with the levels, reach and persistence it was scored at and
 *   the evidence it was scored from, and its connections to the other entities.
 *
 * Every entity's influence is recomputed from its scores with the site's calculator, and the run
 * stops if it differs from results.json, so a page never shows numbers the stream does not draw.
 *
 * Families are listed in the palette's slot order: family i is drawn in --color-family-{i+1}.
 *
 * Usage: bun tools/music-snapshot.ts <music-vital directory>
 */
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { calculateImpact } from "../src/lib/atis-calculator";
import { HISTORICAL_RUBRICS } from "../src/sites/rubrics";
import type { ScoringConfig } from "../src/sites/types";
import { permalink, wholeArticleEvidence } from "./wiki-evidence";

const dir = process.argv[2];
if (!dir) throw new Error("usage: bun tools/music-snapshot.ts <music-vital directory>");
const dataDir = resolve(import.meta.dir, "../public/history/data");
const streamOut = join(dataDir, "music-vital.json");
const pagesOut = join(dataDir, "music");

/** Slot order: the order the eight hues pass the dataviz palette checks in, on surface-1. */
const FAMILIES = [
  "Classical",
  "Blues & Jazz",
  "R&B & Hip-hop",
  "Rock, Folk & Country",
  "Pop & Electronic",
  "World popular music",
  "Traditions & world",
  "Instruments",
];

/** The four dimensions as music-vital/score.ts asked them; the keys are checked against results.json. */
const AFFECTED = "the people who heard or played it";
const DEPTH = "Rate how deeply those people were affected, not how widely; how far it travelled is judged separately.";
const DIMENSIONS = [
  { key: "feeling", label: "Feeling", meaning: "Joy, consolation, awe and catharsis", weight: 1, clef: { area: "people's emotional and inner lives: joy, consolation, awe and catharsis", affected: AFFECTED, depth: DEPTH } },
  { key: "devotion", label: "Devotion", meaning: "Worship, prayer and ritual", weight: 1, clef: { area: "worship, prayer and ritual", affected: AFFECTED, depth: DEPTH } },
  { key: "gathering", label: "Gathering", meaning: "Dance, celebration and coming together", weight: 1, clef: { area: "dancing, celebration and people coming together", affected: AFFECTED, depth: DEPTH } },
  { key: "memory", label: "Memory", meaning: "Stories, history and shared memory carried on", weight: 1, clef: { area: "carrying stories, history and shared memory from one generation to the next", affected: AFFECTED, depth: DEPTH } },
];

/** Each link reason, named from the cause's side (from) and the consequence's (to). */
const RELATIONS: Record<string, { from: string; to: string }> = {
  "its genre": { from: "in_genre", to: "genre" },
  "parent genre": { from: "gave_rise", to: "grew_from" },
  "member of the group": { from: "member_of", to: "members" },
  "performed or composed it": { from: "works", to: "by" },
};

interface ScoredPeriod {
  label: string;
  start: number;
  end: number;
  levels: Record<string, number>;
  reach: number;
  persistence: number;
  source: string;
}
interface Scored {
  slug: string;
  name: string;
  type: string;
  family: string;
  shade: string;
  first_year: number;
  last_year: number;
  own_magnitude: number;
  periods: ScoredPeriod[];
  curve: { from: number; values: number[] };
}
interface SetEntity {
  slug: string;
  name: string;
  wiki: string;
  periods: { label: string; start: number; end: number; description: string }[];
}

const results = await Bun.file(join(dir, "results.json")).json();
const set: { entities: SetEntity[]; links: { from: string; to: string; why: string }[] } = await Bun.file(
  join(dir, "music-vital.json"),
).json();
const articles = new Map<string, { title: string; text: string; revid: number }>();
for (const line of (await Bun.file(join(dir, "articles.jsonl")).text()).split("\n")) {
  if (!line) continue;
  const row = JSON.parse(line) as { key: string; article: { title: string; text: string; revid: number } };
  articles.set(row.key, row.article);
}

const shades: Record<string, string[]> = results.shades;
const missing = FAMILIES.filter((f) => !shades[f]);
if (missing.length) throw new Error(`results.json has no shades for ${missing.join(", ")}`);
const extra = Object.keys(shades).filter((f) => !FAMILIES.includes(f));
if (extra.length) throw new Error(`results.json has families the palette does not list: ${extra.join(", ")}`);
const keys: string[] = results.scoring.dimensions;
if (keys.join() !== DIMENSIONS.map((d) => d.key).join()) {
  throw new Error(`results.json scored ${keys.join(", ")}, not ${DIMENSIONS.map((d) => d.key).join(", ")}`);
}

const scoring: ScoringConfig = {
  breadth: "reach",
  dimensions: DIMENSIONS,
  rubrics: { ...HISTORICAL_RUBRICS, reach: results.scoring.reach },
  unit: { years: 100, name: "influence-centuries" },
  tiers: null,
};
const asOf: number = results.as_of_year;
const sig = (v: number) => Number(v.toPrecision(3));
const r2 = (v: number) => Math.round(v * 100) / 100;
const sum = (o: Record<string, number>) => Object.values(o).reduce((s, v) => s + v, 0);

const scored = (results.entities as Scored[]).filter((e) => e.curve.values.length > 0);
const bySet = new Map(set.entities.map((e) => [e.slug, e]));
const index = (e: Scored) => {
  const family = FAMILIES.indexOf(e.family);
  const shade = shades[e.family].indexOf(e.shade);
  if (shade < 0) throw new Error(`${e.name}: shade "${e.shade}" is not one of ${e.family}'s`);
  return { family, shade };
};

const entities = scored.map((e) => ({
  slug: e.slug,
  name: e.name,
  type: e.type,
  ...index(e),
  first_year: e.first_year,
  last_year: e.last_year,
  own_magnitude: Math.round(e.own_magnitude),
  from: e.curve.from,
  values: e.curve.values.map(sig),
}));
const byMagnitude = [...scored].sort((a, b) => b.own_magnitude - a.own_magnitude || a.name.localeCompare(b.name));
const rank = new Map(byMagnitude.map((e, i) => [e.slug, i + 1]));
const familyRank = new Map<string, { rank: number; of: number }>();
for (const f of FAMILIES) {
  const members = byMagnitude.filter((e) => e.family === f);
  members.forEach((e, i) => familyRank.set(e.slug, { rank: i + 1, of: members.length }));
}
const stub = new Map(entities.map((e) => [e.slug, e]));

const connections = new Map<string, { relation: string; slug: string }[]>();
for (const l of set.links) {
  const relation = RELATIONS[l.why];
  if (!relation) throw new Error(`link ${l.from} → ${l.to} has a reason no page names: "${l.why}"`);
  if (!stub.has(l.from) || !stub.has(l.to)) throw new Error(`link ${l.from} → ${l.to} names an entity with no curve`);
  connections.set(l.from, [...(connections.get(l.from) ?? []), { relation: relation.from, slug: l.to }]);
  connections.set(l.to, [...(connections.get(l.to) ?? []), { relation: relation.to, slug: l.from }]);
}

/** "Gilles Binchois: Franco-Flemish Renaissance composer (c. 1400–1460)." → its text after the article's name. */
function describe(e: SetEntity): string {
  const text = e.periods[0].description;
  for (const prefix of [`${e.wiki}: `, `${e.name}: `]) {
    if (text.startsWith(prefix)) {
      const rest = text.slice(prefix.length).trim();
      return rest.charAt(0).toUpperCase() + rest.slice(1);
    }
  }
  throw new Error(`${e.name}: description "${text}" does not start with its name`);
}

rmSync(pagesOut, { recursive: true, force: true });
mkdirSync(pagesOut, { recursive: true });
let bytes = 0;
for (const e of scored) {
  if (!/^[a-z0-9-]+$/.test(e.slug)) throw new Error(`${e.name}: slug "${e.slug}" is not a safe file name`);
  const input = bySet.get(e.slug);
  if (!input) throw new Error(`${e.name}: not in music-vital.json`);
  if (input.periods.length !== e.periods.length) throw new Error(`${e.name}: period counts differ`);

  const periods = e.periods.map((p, i) => ({
    id: i + 1,
    label: p.label,
    start_year: p.start,
    end_year: p.end,
    reach_factor: p.reach,
    persistence_factor: p.persistence,
  }));
  const zeros = Object.fromEntries(keys.map((k) => [k, 0]));
  const assessments = e.periods.map((p, i) => ({ period_id: i + 1, benefit: p.levels, harm: zeros }));
  const impact = calculateImpact(scoring, assessments, periods, { creditPassedOn: 0, asOfYear: asOf });
  if (Math.abs(impact.magnitude - e.own_magnitude) > 0.01) {
    throw new Error(`${e.name}: the calculator gives ${impact.magnitude}, results.json ${e.own_magnitude}`);
  }

  const page = {
    slug: e.slug,
    name: e.name,
    type: e.type,
    description: describe(input),
    wiki: e.periods[0].source.split("@")[0],
    ...index(e),
    first_year: e.first_year,
    last_year: e.last_year,
    as_of_year: asOf,
    timeline: results.timeline,
    families: FAMILIES.map((name) => ({ name, shades: shades[name] })),
    dimensions: DIMENSIONS.map(({ key, label, meaning }) => ({ key, label, meaning })),
    reach_levels: results.scoring.reach,
    persistence_levels: HISTORICAL_RUBRICS.persistence,
    magnitude: r2(impact.magnitude),
    rank: rank.get(e.slug)!,
    of: scored.length,
    family_rank: familyRank.get(e.slug)!,
    profile: Object.fromEntries(keys.map((k) => [k, r2(impact.profile.benefit[k])])),
    legacy: impact.tail ? { from_year: impact.tail.from_year, magnitude: r2(sum(impact.tail.area.benefit)) } : null,
    curve: { from: e.curve.from, values: e.curve.values.map(sig) },
    periods: e.periods.map((p, i) => {
      const article = articles.get(input.wiki);
      if (!article) throw new Error(`${e.name}: articles.jsonl does not hold "${input.wiki}"`);
      if (`${article.title}@${article.revid}` !== p.source) {
        throw new Error(`${e.name}: scored from ${p.source}, but articles.jsonl holds ${article.title}@${article.revid}`);
      }
      const breakdown = impact.breakdown.find((b) => b.period_id === i + 1);
      if (!breakdown) throw new Error(`${e.name}: the calculator placed no "${p.label}" period`);
      return {
        label: p.label,
        start_year: p.start,
        end_year: p.end,
        description: input.periods[i].description,
        levels: p.levels,
        reach_factor: p.reach,
        persistence_factor: p.persistence,
        magnitude: r2(sum(breakdown.area.benefit)),
        evidence: wholeArticleEvidence(input.periods[i].description, article.text),
        source_url: permalink(article),
      };
    }),
    connections: (connections.get(e.slug) ?? [])
      .map(({ relation, slug }) => {
        const other = stub.get(slug)!;
        return { relation, slug, name: other.name, type: other.type, family: other.family, shade: other.shade, magnitude: other.own_magnitude };
      })
      .sort((a, b) => b.magnitude - a.magnitude || a.name.localeCompare(b.name)),
  };
  const file = join(pagesOut, `${e.slug}.json`);
  await Bun.write(file, JSON.stringify(page));
  bytes += Bun.file(file).size;
}

const snapshot = {
  as_of_year: asOf,
  timeline: results.timeline,
  dimensions: keys,
  families: FAMILIES.map((name) => ({ name, shades: shades[name] })),
  entities,
};
await Bun.write(streamOut, JSON.stringify(snapshot));
console.log(`wrote ${streamOut}: ${entities.length} entities, ${(Bun.file(streamOut).size / 1e6).toFixed(2)} MB`);
console.log(`wrote ${readdirSync(pagesOut).length} pages in ${pagesOut}: ${(bytes / 1e6).toFixed(1)} MB`);
