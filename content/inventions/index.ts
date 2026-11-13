/**
 * Prior Art content: the benchmark chains and the launch set. Load with
 * tools/realm-load.ts and check first with tools/content-check.ts.
 *
 * A link's share is the part of the consequence credited to the cause, smaller
 * for each rival claimant who came close; a consequence's incoming shares total
 * at most 1.00, and whatever it keeps is its own originality.
 */
import type { InventionsContent } from "../types";
import { benchmark } from "./benchmark";

/** The site this content belongs to (src/sites). */
export const site = "inventions";

const parts: InventionsContent[] = [benchmark];

const content: InventionsContent = {
  entities: parts.flatMap((p) => p.entities),
  links: parts.flatMap((p) => p.links),
};

export default content;
