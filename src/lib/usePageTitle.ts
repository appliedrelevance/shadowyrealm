import { useEffect } from "react";
import { COPY } from "./copy";

/** Sets the tab title to "<page> — ShadowyRealm", or the site title when no page is named. */
export function usePageTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} — ${COPY.nav.brand}` : COPY.site.title;
  }, [page]);
}
