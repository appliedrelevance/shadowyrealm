/**
 * Freezes the music benchmark's scores for ShadowyRealm's /music page. Reads a scored results.json
 * (Landru/work/shadowyrealm/music-vital/, written by its score.ts) and writes only what the page
 * draws: each entity's family and shade as indexes into the family list, its span, its own
 * influence, its Wikipedia title and its curve to three significant figures.
 *
 * Families are listed in the palette's slot order: family i is drawn in --color-family-{i+1}.
 *
 * Usage: bun tools/music-snapshot.ts <results.json>
 */
import { resolve } from "node:path";

const source = process.argv[2];
if (!source) throw new Error("usage: bun tools/music-snapshot.ts <results.json>");
const out = resolve(import.meta.dir, "../public/shadowyrealm/data/music-vital.json");

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

interface Scored {
  name: string;
  type: string;
  family: string;
  shade: string;
  first_year: number;
  last_year: number;
  own_magnitude: number;
  periods: { source: string }[];
  curve: { from: number; values: number[] };
}

const data = await Bun.file(source).json();
const shades: Record<string, string[]> = data.shades;
const missing = FAMILIES.filter((f) => !shades[f]);
if (missing.length) throw new Error(`results.json has no shades for ${missing.join(", ")}`);
const extra = Object.keys(shades).filter((f) => !FAMILIES.includes(f));
if (extra.length) throw new Error(`results.json has families the palette does not list: ${extra.join(", ")}`);

const sig = (v: number) => Number(v.toPrecision(3));
const entities = (data.entities as Scored[])
  .filter((e) => e.curve.values.length > 0)
  .map((e) => {
    const family = FAMILIES.indexOf(e.family);
    const shade = shades[e.family].indexOf(e.shade);
    if (shade < 0) throw new Error(`${e.name}: shade "${e.shade}" is not one of ${e.family}'s`);
    const wiki = e.periods[0]?.source.split("@")[0];
    if (!wiki) throw new Error(`${e.name}: no source article`);
    return {
      name: e.name,
      type: e.type,
      family,
      shade,
      first_year: e.first_year,
      last_year: e.last_year,
      own_magnitude: Math.round(e.own_magnitude),
      wiki,
      from: e.curve.from,
      values: e.curve.values.map(sig),
    };
  });

const snapshot = {
  as_of_year: data.as_of_year,
  timeline: data.timeline,
  dimensions: data.scoring.dimensions,
  families: FAMILIES.map((name) => ({ name, shades: shades[name] })),
  entities,
};
await Bun.write(out, JSON.stringify(snapshot));
console.log(`wrote ${out}: ${entities.length} entities, ${(Bun.file(out).size / 1e6).toFixed(2)} MB`);
