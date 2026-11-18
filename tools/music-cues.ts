/**
 * Print a film's cue times as JSON, from the same clock and eras the film draws with
 * (video/assets/river.js), so a score written against them lands on the picture: the sweep, the
 * moment the front enters each era, the all-time callouts, the dim and the end card.
 *
 *   bun tools/music-cues.ts short   # the 60-second cut (and the vertical Short, same clock)
 *   bun tools/music-cues.ts race    # the race
 */
import { readFileSync } from "node:fs";

// river.js and the snapshot are browser scripts that hang themselves on `window`.
const g = globalThis as Record<string, unknown>;
g.window = g;
for (const file of ["realm-data.js", "river.js"]) {
  (0, eval)(readFileSync(new URL(`../video/assets/${file}`, import.meta.url), "utf8"));
}

interface Film {
  duration: number;
  sweep0: number;
  sweep1: number;
  dimAt: number;
  ranksAt?: number[];
  boardEnd?: number;
}
const River = g.River as {
  FILMS: Record<string, Film>;
  ERAS: { year: number; name: string }[];
  axis: (realm: unknown) => { yearToUnit: (year: number) => number };
  clock: (film: Film) => { timeAtFront: (u: number) => number };
};

const key = process.argv[2] ?? "short";
const film = River.FILMS[key];
if (!film) throw new Error(`No film "${key}" in FILMS: ${Object.keys(River.FILMS).join(", ")}`);
const ax = River.axis(g.REALM);
const { timeAtFront } = River.clock(film);

const round = (s: number) => Math.round(s * 1000) / 1000;
console.log(
  JSON.stringify(
    {
      film: key,
      duration: film.duration,
      sweep: [film.sweep0, film.sweep1],
      eras: River.ERAS.map((era, i) => ({
        name: era.name,
        at: round(i === 0 ? film.sweep0 : timeAtFront(ax.yearToUnit(era.year))),
      })),
      ranks: film.ranksAt ?? [],
      boardEnd: film.boardEnd ?? null,
      dim: film.dimAt,
      endCard: film.dimAt,
    },
    null,
    2,
  ),
);
