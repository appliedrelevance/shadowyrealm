/**
 * ShadowyRealm content: the 124-entity launch set and the 500-entity second
 * wave, with the periods of their direct activity and the links that pass
 * credit from consequence back to cause.
 *
 * Load with tools/realm-load.ts. A link's share is the part of the
 * consequence credited to the cause; a consequence's incoming shares total at
 * most 1.00. An entity's fading tail shrinks by the credit it passes on, so a
 * figure is linked to the creations that carry their legacy.
 */
import { ancient } from "./ancient";
import { benchmark } from "./benchmark";
import { earlyModern } from "./early-modern";
import { modern } from "./modern";
import secondWave from "./next-500";
import type { RealmContent } from "./types";

const parts = [benchmark, ancient, earlyModern, modern, secondWave];

const content: RealmContent = {
  entities: parts.flatMap((p) => p.entities),
  links: parts.flatMap((p) => p.links),
};

export default content;
