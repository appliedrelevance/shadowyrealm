/**
 * ShadowyRealm launch content: entities, the periods of their direct activity,
 * and the links that pass credit from consequence back to cause.
 *
 * Load with tools/realm-load.ts. A link's share is the part of the
 * consequence credited to the cause; a consequence's incoming shares total at
 * most 1.00. An entity with an outgoing credit link gets no fading tail, so a
 * figure is linked only to the creation that carries the main part of their
 * legacy.
 */
import { ancient } from "./ancient";
import { benchmark } from "./benchmark";
import { earlyModern } from "./early-modern";
import { modern } from "./modern";
import type { RealmContent } from "./types";

const parts = [benchmark, ancient, earlyModern, modern];

const content: RealmContent = {
  entities: parts.flatMap((p) => p.entities),
  links: parts.flatMap((p) => p.links),
};

export default content;
