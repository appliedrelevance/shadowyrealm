/**
 * Print the river race's YouTube description: its chapters, from the same eras and
 * clock the film draws with (video/assets/river.js), and the credits for the Wikimedia pictures it
 * shows, from the snapshot (tools/video-snapshot.ts), so the description never disagrees with the
 * video.
 *
 *   bun tools/video-description.ts            # the description, within YouTube's 5,000 characters
 *   bun tools/video-description.ts --credits  # every picture: file, author, licence and page
 */
import { readFileSync } from "node:fs";

// river.js and the snapshot are browser scripts that hang themselves on `window`.
const g = globalThis as Record<string, unknown>;
g.window = g;
for (const file of ["realm-data.js", "river.js"]) {
  (0, eval)(readFileSync(new URL(`../video/assets/${file}`, import.meta.url), "utf8"));
}

interface Credit {
  file: string;
  artist: string | null;
  source: string | null;
  license: string | null;
  page: string;
}
const realm = g.REALM as {
  source: string;
  entities: { slug: string; name: string }[];
  links: unknown[];
  media: Record<string, { image: string | null; credit: Credit | null; withheld?: string }>;
};
const River = g.River as {
  FILMS: { race: Record<string, unknown> };
  ERAS: { year: number; name: string }[];
  axis: (realm: unknown) => { yearToUnit: (year: number) => number };
  clock: (film: unknown) => { timeAtFront: (u: number) => number };
};
const film = River.FILMS.race;
const ax = River.axis(realm);
const { timeAtFront } = River.clock(film);
const nameOf = new Map(realm.entities.map((e) => [e.slug, e.name]));
const pictures = Object.entries(realm.media)
  .filter(([, m]) => m.credit)
  .map(([slug, m]) => ({ name: nameOf.get(slug)!, ...m.credit! }))
  .sort((a, b) => a.name.localeCompare(b.name));

if (process.argv.includes("--credits")) {
  for (const p of pictures) {
    console.log(`${p.name}: ${p.file}. ${p.artist ?? p.source ?? "No author recorded"}. ${p.license}. ${p.page}`);
  }
  process.exit(0);
}

// The film opens on the first era's title, so that chapter starts at 0:00; the last era runs to the
// end card.
const chapters = River.ERAS.map((era, i) => ({
  at: i === 0 ? 0 : timeAtFront(ax.yearToUnit(era.year)),
  name: era.name,
}));

const stamp = (seconds: number) => {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const lines: string[] = [];
chapters.forEach((c, i) => {
  const next = chapters[i + 1];
  if (next && next.at - c.at < 10) throw new Error(`"${c.name}" runs ${(next.at - c.at).toFixed(1)} s; YouTube needs 10 s`);
  lines.push(`${stamp(c.at)} ${c.name}`);
});

// Pictures whose licence asks for attribution (CC BY, GFDL) are credited by name; public-domain and
// CC0 files are not. A licence outside these is a new case to decide, not one to guess.
const attributes = (license: string | null) => /^(CC BY|GFDL)/.test(license ?? "");
const attributed = pictures.filter((p) => attributes(p.license));
const unclaimed = pictures.filter((p) => !attributes(p.license) && !/^(Public domain|CC0)$/.test(p.license ?? ""));
if (unclaimed.length > 0) throw new Error(`Licences to decide: ${unclaimed.map((p) => `${p.file} (${p.license})`).join("; ")}`);
const count = (n: number) => n.toLocaleString("en-US");
lines.push(
  "",
  `All ${count(realm.entities.length)} entries and the ${count(realm.links.length)} links of influence between them, with every source and score: ${new URL(realm.source).origin}`,
  "",
  "Pictures from Wikimedia Commons:",
);
// A file that names no author is credited to its page on Commons, which carries its source.
for (const p of attributed) lines.push(`${p.name}: ${p.artist ?? p.page}, ${p.license}`);

const description = lines.join("\n");
if (description.length > 5000) throw new Error(`The description runs ${description.length} characters; YouTube allows 5,000`);
console.log(description);
