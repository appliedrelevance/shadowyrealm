/**
 * Inventions content: the benchmark chains, the launch set and the coverage entries. Load with
 * tools/realm-load.ts and check first with tools/content-check.ts.
 *
 * A link's share is the part of the consequence credited to the cause, smaller
 * for each rival claimant who came close; a consequence's incoming shares total
 * at most 1.00, and whatever it keeps is its own originality.
 */
import type { InventionsContent } from "../types";
import { benchmark } from "./benchmark";
import { coverage } from "./coverage";
import { crossEra } from "./cross-era";
import { launchAncient } from "./launch-ancient";
import { launchIndustrial } from "./launch-industrial";
import { launchModern } from "./launch-modern";
import { originators } from "./originators";

/** The site this content belongs to (src/sites). */
export const site = "inventions";

const parts: InventionsContent[] = [benchmark, launchAncient, launchIndustrial, launchModern, crossEra, originators, coverage];

const content: InventionsContent = {
  entities: parts.flatMap((p) => p.entities),
  links: parts.flatMap((p) => p.links),
};

export default content;
