/**
 * The rubrics Clef scores against, for sites whose influence plays out over
 * years to millennia. ShadowyRealm and Prior Art both use them.
 */
import type { Rubrics } from "./types";

export const HISTORICAL_RUBRICS: Rubrics = {
  /** Intensity for the people affected; breadth is the reach question's job. */
  intensity: [
    "No effect on this dimension",
    "Trivial, barely noticeable",
    "Slight, limited to a few people",
    "Minor but real",
    "Moderate",
    "Substantial",
    "Major",
    "Severe",
    "Extreme, life-altering for those affected",
    "Catastrophic or transformative, the most intense effect on people in history",
  ],
  /** Read as reach factor 1–10. */
  reach: [
    "A handful of people",
    "A village or a small group",
    "A town or a single community",
    "A city or a single profession",
    "A province or a region",
    "A nation",
    "Several nations",
    "A continent or a whole civilization",
    "Most of the world",
    "Nearly everyone alive",
  ],
  /** Read as persistence factor 1–10. */
  persistence: [
    "Faded within a year",
    "Faded within a few years",
    "Faded within a decade",
    "Faded within a generation",
    "Lasted about a lifetime",
    "Lasted a century or two",
    "Lasted several centuries",
    "Lasted most of a millennium",
    "Lasted for millennia",
    "Permanent, with no sign of fading",
  ],
  /** Follows the wording of the persistence levels: 1 faded within a year … 10 permanent. */
  persistenceTimeConstants: [1, 3, 10, 25, 70, 150, 300, 700, 2000, Infinity],
};
