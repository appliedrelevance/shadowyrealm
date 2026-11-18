/**
 * The race's leaders and reading plan on the current snapshot, so a card-queue failure is seen
 * before a render and a new `leadHold` is chosen from numbers, not guessed.
 *
 *   bun .claude/skills/river-films/scripts/leaders.ts            # FILMS.race as committed
 *   bun .claude/skills/river-films/scripts/leaders.ts 2.5 5 6    # also try these leadHold values
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

console.log(`snapshot ${realm.site}, taken ${realm.taken}; FILMS.race.leadHold ${film.leadHold}`);

const plan = (leadHold: number) => {
  try {
    return { plan: River.readingPlan(realm, { ...film, leadHold }), error: null };
  } catch (e) {
    return { plan: null, error: (e as Error).message };
  }
};

for (const hold of [film.leadHold, ...process.argv.slice(2).map(Number)]) {
  const leads = River.board(realm, { ...film, leadHold: hold }).firstLeads();
  const { error } = plan(hold);
  console.log(`leadHold ${hold}: ${leads.length} leaders, ${error ? `fails: ${error}` : "the plan fits"}`);
}

const leads = River.board(realm, film).firstLeads();
console.log("\nfirst leaders (lead held until the next first lead):");
leads.forEach((l: { at: number; e: { name: string } }, i: number) => {
  const end = i + 1 < leads.length ? leads[i + 1].at : film.boardEnd;
  console.log(`  ${l.at.toFixed(1).padStart(6)} to ${end.toFixed(1).padStart(6)} s  ${l.e.name}`);
});

const { plan: committed, error } = plan(film.leadHold);
if (committed) {
  console.log("\ncards:");
  for (const c of committed.cards) console.log(`  ${c.at.toFixed(1).padStart(6)} to ${c.until.toFixed(1).padStart(6)} s  ${c.title}`);
  console.log("era names above the river:");
  for (const l of committed.eraLabels) console.log(`  ${l.shown ? `${l.at.toFixed(1).padStart(6)} s` : "panel only"}  ${l.name}`);
} else {
  console.log(`\nthe committed plan fails: ${error}`);
}
