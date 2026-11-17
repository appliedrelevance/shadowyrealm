/**
 * Re-time the race's all-time countdown for the current snapshot's top ten: each line holds for
 * its words (River.readTime, at least FILMS.race.calloutHold), 0.4 s apart, No. 10 first at the
 * committed start. Prints the `ranksAt` and `rankHolds` to paste into FILMS.race in
 * video/assets/river.js, and stops if No. 1 would still be up when the river dims.
 *
 *   bun .claude/skills/river-films/scripts/countdown.ts
 *
 * Run from the repo root. Reads video/assets/realm-data.js and video/assets/river.js.
 */
import { readFileSync } from "node:fs";

const g = globalThis as Record<string, unknown>;
g.window = g;
for (const file of ["realm-data.js", "river.js"]) (0, eval)(readFileSync(`video/assets/${file}`, "utf8"));
const River = g.River as any;
const realm = g.REALM as any;
const film = River.FILMS.race;
const ax = River.axis(realm);
const GAP = 0.4;

// The countdown's line, as mount() in river.js builds it.
const labelOf = (e: { entity_type: string; first_year: number | null; last_year: number | null }) => {
  const kind = e.entity_type.charAt(0).toUpperCase() + e.entity_type.slice(1);
  return e.first_year === null ? kind : `${kind} · ${ax.formatSpan(e.first_year, e.last_year ?? e.first_year)}`;
};

const slots = film.ranksAt.length;
const ranked = [...realm.entities].sort((a, b) => b.total_magnitude - a.total_magnitude).slice(0, slots);
const holds = ranked.map((e, i) => {
  const meta = `No. ${i + 1} · ${labelOf(e)}`;
  const read = River.readTime(River.wordsIn(e.name) + River.wordsIn(meta));
  const hold = Math.max(film.calloutHold, Math.ceil(read * 10 - 1e-9) / 10);
  console.log(`No. ${String(i + 1).padStart(2)}  ${e.name} · ${meta}  (read ${read.toFixed(2)} s, hold ${hold} s)`);
  return hold;
});

const at: number[] = new Array(slots);
let t = film.ranksAt[slots - 1];
for (let i = slots - 1; i >= 0; i--) {
  at[i] = Math.round(t * 10) / 10;
  t = at[i] + holds[i] + GAP;
}
const end = at[0] + holds[0];
console.log(`\nranksAt: [${at.map((x) => x.toFixed(1)).join(", ")}],`);
console.log(`rankHolds: [${holds.map((x) => x.toFixed(1)).join(", ")}],`);
console.log(`No. 1 leaves at ${end.toFixed(1)} s; the river dims at ${film.dimAt} s`);
if (end > film.dimAt) throw new Error("The countdown runs into the dim: start No. 10 earlier or move dimAt");
