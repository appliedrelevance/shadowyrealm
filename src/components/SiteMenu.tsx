import { Menu } from "@base-ui/react/menu";
import { Check, ChevronDown } from "lucide-react";
import { SITE } from "@/lib/site";
import { SITES } from "@/sites";

/**
 * The sites menu every site shares: each site on the engine, from SITES, with its mark, name and what it
 * holds. Nothing in it is written for one site; a new site appears here when its config is registered.
 */
export function SiteMenu() {
  const sites = Object.values(SITES);
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Switch site"
        className="flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-surface-2 hover:text-ink data-popup-open:bg-surface-2 data-popup-open:text-ink"
      >
        <ChevronDown className="h-4 w-4" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="start" className="z-50 outline-hidden">
          <Menu.Popup className="w-72 rounded-lg border border-line bg-surface-1 p-1 shadow-lg shadow-surface outline-hidden">
            <p className="px-3 pb-1 pt-2 text-xs uppercase tracking-wider text-ink-muted">Sites</p>
            {sites.map((s) => {
              const current = s.key === SITE.key;
              return (
                <Menu.LinkItem
                  key={s.key}
                  href={current ? "/" : s.brand.origin}
                  aria-current={current ? "page" : undefined}
                  className="flex items-center gap-3 rounded px-3 py-2 text-sm text-ink-2 outline-hidden data-highlighted:bg-surface-2 data-highlighted:text-ink"
                >
                  <img src={`${s.brand.origin}/favicon.svg`} alt="" className="h-6 w-6 shrink-0 rounded" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{s.brand.name}</span>
                    <span className="block truncate text-xs text-ink-muted">{s.brand.holds}</span>
                  </span>
                  {current && <Check className="h-4 w-4 shrink-0 text-action-ink" aria-hidden="true" />}
                </Menu.LinkItem>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
