/** The drawing for each icon a site's entity types can name (EntityTypeDef.icon). */
import {
  Building2,
  Guitar,
  Layers,
  Lightbulb,
  type LucideIcon,
  MicVocal,
  Music,
  Package,
  Rocket,
  Telescope,
  User,
  Users,
  Zap,
} from "lucide-react";
import type { EntityIcon } from "@/sites/types";
import { SITE } from "./site";

const ICONS: Readonly<Record<EntityIcon, LucideIcon>> = {
  building: Building2,
  guitar: Guitar,
  layers: Layers,
  lightbulb: Lightbulb,
  "mic-vocal": MicVocal,
  music: Music,
  package: Package,
  rocket: Rocket,
  telescope: Telescope,
  user: User,
  users: Users,
  zap: Zap,
};

/** The site's icon for each of its entity types, by type key. */
export const TYPE_ICONS: Readonly<Record<string, LucideIcon>> = Object.fromEntries(
  SITE.entityTypes.map((t) => [t.key, ICONS[t.icon]]),
);
