/**
 * Print the five-minute river race's YouTube chapters, from the same eras and clock the film
 * draws with (video/assets/river.js), so the description can never disagree with the video.
 *
 *   bun tools/video-chapters.ts
 */
import { readFileSync } from "node:fs";

// river.js and the snapshot are browser scripts that hang themselves on `window`.
const g = globalThis as Record<string, unknown>;
g.window = g;
for (const file of ["realm-data.js", "river.js"]) {
  (0, eval)(readFileSync(new URL(`../video/assets/${file}`, import.meta.url), "utf8"));
}

interface Era {
  year: number;
  name: string;
}
const River = g.River as {
  FILMS: { race: { ranksAt: number[] } & Record<string, unknown> };
  ERAS: Era[];
  axis: (realm: unknown) => { yearToUnit: (year: number) => number };
  clock: (film: unknown) => { timeAtFront: (u: number) => number };
};
const film = River.FILMS.race;
const ax = River.axis(g.REALM);
const { timeAtFront } = River.clock(film);

// The film opens on the first era's title, so that chapter starts at 0:00.
const chapters = River.ERAS.map((era, i) => ({
  at: i === 0 ? 0 : timeAtFront(ax.yearToUnit(era.year)),
  name: era.name,
}));
chapters.push({ at: film.ranksAt[0], name: "The top three of all time" });

const stamp = (seconds: number) => {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
chapters.forEach((c, i) => {
  const next = chapters[i + 1];
  if (next && next.at - c.at < 10) throw new Error(`"${c.name}" runs ${(next.at - c.at).toFixed(1)} s; YouTube needs 10 s`);
  console.log(`${stamp(c.at)} ${c.name}`);
});
