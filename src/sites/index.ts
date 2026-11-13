/**
 * The site registry. The Worker picks a site by its SITE variable on every
 * request; the SPA is built for one site by its Vite mode.
 */
import { inventions } from "./inventions";
import { shadowyrealm } from "./shadowyrealm";
import type { DimensionDef, EntityTypeDef, LinkLabels, LinkTypeDef, SiteConfig } from "./types";

export type { SiteConfig } from "./types";

export const SITES: Readonly<Record<string, SiteConfig>> = { shadowyrealm, inventions };

export function siteFor(key: string | undefined): SiteConfig {
  const site = key ? SITES[key] : undefined;
  if (!site) {
    throw new Error(
      `${key ? `No site "${key}"` : "No site named"}: SITE must be one of ${Object.keys(SITES).join(", ")}`,
    );
  }
  return site;
}

export function dimensionKeys(site: Pick<SiteConfig, "scoring">): string[] {
  return site.scoring.dimensions.map((d) => d.key);
}

export function dimensionOf(site: SiteConfig, key: string): DimensionDef {
  const found = site.scoring.dimensions.find((d) => d.key === key);
  if (!found) throw new Error(`${site.brand.name} has no dimension "${key}"`);
  return found;
}

export function entityTypeOf(site: SiteConfig, key: string): EntityTypeDef {
  const found = site.entityTypes.find((t) => t.key === key);
  if (!found) throw new Error(`${site.brand.name} has no entity type "${key}"`);
  return found;
}

export function linkTypeOf(site: SiteConfig, key: string): LinkTypeDef {
  const found = site.linkTypes.find((t) => t.key === key);
  if (!found) throw new Error(`${site.brand.name} has no link type "${key}"`);
  return found;
}

/** The link types whose strength is a share of credit. */
export function creditTypes(site: SiteConfig): Set<string> {
  return new Set(site.linkTypes.filter((t) => t.credit).map((t) => t.key));
}

/** The labels for one link, which may depend on the consequence's type. */
export function linkLabels(site: SiteConfig, linkKey: string, targetType: string): LinkLabels {
  const def = linkTypeOf(site, linkKey);
  return def.labelsByTarget?.[targetType] ?? def.labels;
}

/** Whether a link type allows these entity types at its two ends. */
export function allowsEnds(def: LinkTypeDef, sourceType: string, targetType: string): boolean {
  const ok = (ends: LinkTypeDef["from"], t: string) => ends === "any" || ends.includes(t);
  return ok(def.from, sourceType) && ok(def.to, targetType);
}

export function describeEnds(ends: LinkTypeDef["from"]): string {
  return ends === "any" ? "any type" : ends.join(", ");
}
