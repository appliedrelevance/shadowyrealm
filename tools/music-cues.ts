/**
 * Print a film's cue times as JSON, from the same clock and eras the film draws with
 * (video/assets/river.js), so a score written against them lands on the picture: the sweep, the
 * moment the front enters each era, the all-time callouts, the dim and the end card.
 *
 *   bun tools/music-cues.ts short   # the 60-second cut (and the vertical Short, same clock)
 *   bun tools/music-cues.ts race    # the race
 *   bun tools/music-cues.ts countdown   # the countdown: its cards, each on a beat, and the outro
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

// A countdown's cues are its cards, each on a beat of its own 4/4 grid, and the outro.
interface Placed {
  beat: number;
  bar: number;
  beatInBar: number;
  at: number;
}
const countdownPlan = (g.River as { countdownPlan?: (realm: unknown, film: unknown) => unknown }).countdownPlan;
if ((film as { ranking?: string }).ranking && countdownPlan) {
  const plan = countdownPlan(g.REALM, film) as {
    bar: number;
    beat: number;
    outro: Placed;
    loopBeat: number;
    entries: (Placed & { rank: number; name: string; beats: number; until: number })[];
  };
  const cue = (p: Placed) => ({ bar: p.bar, beat: p.beatInBar, at: round(p.at) });
  console.log(
    JSON.stringify(
      {
        film: key,
        duration: film.duration,
        bpm: (film as { bpm?: number }).bpm,
        bar: round(plan.bar),
        hook: { bar: 1, beat: 1, at: 0 },
        cards: [...plan.entries].reverse().map((e) => ({ rank: e.rank, name: e.name, ...cue(e), beats: e.beats, until: round(e.until) })),
        outro: cue(plan.outro),
        loop: { bar: plan.loopBeat / 4 + 1, beat: 1, at: round(plan.loopBeat * plan.beat) },
      },
      null,
      2,
    ),
  );
  process.exit(0);
}
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
