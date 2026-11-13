/**
 * Freeze a site's realm for the video project: fetch `/api/realm` once and write
 * it, with the site's time axis, as `video/assets/realm-data.js`.
 *
 * A HyperFrames render seeks frame by frame and must not fetch anything, so the
 * composition reads this file through a <script> tag. Committing the file makes
 * each video a record of one known state of the data; re-run this to refresh it.
 *
 *   bun tools/video-snapshot.ts               # shadowyrealm
 *   bun tools/video-snapshot.ts inventions    # Prior Art
 */
import { writeFileSync } from "node:fs";
import { siteFor } from "../src/sites";

interface RealmEntity {
  slug: string;
  name: string;
  entity_type: string;
  first_year: number | null;
  last_year: number | null;
  own_magnitude: number;
  credited_magnitude: number;
  total_magnitude: number;
  tier: string;
  curve: { from: number; benefit: number[]; harm: number[] };
}

interface Realm {
  as_of_year: number;
  entities: RealmEntity[];
  links: { source: string; target: string; relationship_type: string; strength: number }[];
}

const key = process.argv[2] ?? "shadowyrealm";
const site = siteFor(key);
const url = `${site.brand.origin}/api/realm`;

const response = await fetch(url);
if (!response.ok) throw new Error(`${url} answered ${response.status}: ${await response.text()}`);
const realm = (await response.json()) as Realm;
if (!Array.isArray(realm.entities) || realm.entities.length === 0) throw new Error(`${url} returned no entities`);

const snapshot = {
  site: key,
  source: url,
  taken: new Date().toISOString(),
  as_of_year: realm.as_of_year,
  timeline: site.timeline,
  entities: realm.entities.map((e) => ({
    slug: e.slug,
    name: e.name,
    entity_type: e.entity_type,
    first_year: e.first_year,
    last_year: e.last_year,
    own_magnitude: e.own_magnitude,
    credited_magnitude: e.credited_magnitude,
    total_magnitude: e.total_magnitude,
    tier: e.tier,
    curve: e.curve,
  })),
  links: realm.links.map((l) => ({
    source: l.source,
    target: l.target,
    relationship_type: l.relationship_type,
    strength: l.strength,
  })),
};

const out = new URL("../video/assets/realm-data.js", import.meta.url);
writeFileSync(out, `// Written by tools/video-snapshot.ts from ${url}. Do not edit.\nwindow.REALM = ${JSON.stringify(snapshot)};\n`);
console.log(`${snapshot.entities.length} entities, ${snapshot.links.length} links, as of ${snapshot.as_of_year} → ${out.pathname}`);
