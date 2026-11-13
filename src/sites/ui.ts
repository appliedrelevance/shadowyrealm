/**
 * The browser-only half of the registry: each site's logo, hero, icons and
 * methodology prose, picked by the site this SPA was built for.
 */
import { SITE } from "@/lib/site";
import { ui as inventions } from "./inventions/ui";
import { ui as shadowyrealm } from "./shadowyrealm/ui";
import type { SiteUi } from "./ui-types";

const UIS: Readonly<Record<string, SiteUi>> = { shadowyrealm, inventions };

function uiFor(key: string): SiteUi {
  const found = UIS[key];
  if (!found) throw new Error(`No UI for site "${key}"; add one in src/sites/${key}/ui.tsx`);
  return found;
}

export const SITE_UI: SiteUi = uiFor(SITE.key);
