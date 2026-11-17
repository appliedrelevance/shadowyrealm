/**
 * Prior Art coverage, 2026-11-16: entries for the gaps a comparison with Wikipedia's Timeline of historic
 * inventions found (Landru work/shadowyrealm/prior-art-coverage.md), in eight batches drafted in parallel,
 * plus the hand-built aviation chain, and, from 2026-11-17, two batches of the creators of those entries.
 * Each batch's links stay inside it or reach existing entries; the links between batches are joined
 * here, each pair once.
 */
import type { InventionsContent, InventionsLink } from "../types";
import { coverageA1, crossLinksA1 } from "./coverage-a1";
import { coverageA2, crossLinksA2 } from "./coverage-a2";
import { coverageB, crossLinksB } from "./coverage-b";
import { coverageC, crossLinksC } from "./coverage-c";
import { coverageD, crossLinksD } from "./coverage-d";
import { coverageE1, crossLinksE1 } from "./coverage-e1";
import { coverageE2, crossLinksE2 } from "./coverage-e2";
import { coverageF, crossLinksF } from "./coverage-f";
import { coverageOriginatorsA } from "./coverage-originators-a";
import { coverageOriginatorsB } from "./coverage-originators-b";

const batches = [
  coverageA1,
  coverageA2,
  coverageB,
  coverageC,
  coverageD,
  coverageE1,
  coverageE2,
  coverageF,
  coverageOriginatorsA,
  coverageOriginatorsB,
];

/** A link between two batches, once: two batches may both name the same pair and type. */
function once(links: InventionsLink[]): InventionsLink[] {
  const seen = new Set<string>();
  return links.filter((l) => {
    const key = `${[l.from, l.to].sort().join("|")}|${l.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const coverage: InventionsContent = {
  entities: batches.flatMap((b) => b.entities),
  links: [
    ...batches.flatMap((b) => b.links),
    ...once([
      ...crossLinksA1,
      ...crossLinksA2,
      ...crossLinksB,
      ...crossLinksC,
      ...crossLinksD,
      ...crossLinksE1,
      ...crossLinksE2,
      ...crossLinksF,
    ]),
  ],
};
