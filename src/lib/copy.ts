/** The SPA's copy: the active site's, plus its brand name and title. */
import { SITE } from "./site";

export const COPY = {
  site: { title: SITE.brand.title },
  nav: { brand: SITE.brand.name, ...SITE.copy.nav },
  home: SITE.copy.home,
  entity: SITE.copy.entity,
  methodology: SITE.copy.methodology,
  compare: SITE.copy.compare,
  lineage: SITE.copy.lineage,
  auth: SITE.copy.auth,
  footer: SITE.copy.footer,
} as const;
