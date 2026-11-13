import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/** The browser-only pieces of a site: its marks, its icons and its method page. */
export interface SiteUi {
  Logo: ComponentType<{ className?: string }>;
  /** The home page's illustration, shown beside the heading. */
  Hero: ComponentType<{ className?: string; alt: string }>;
  /** One icon per entity type key. */
  typeIcons: Readonly<Record<string, LucideIcon>>;
  /** The methodology page's prose, around the shared tables. */
  Methodology: ComponentType;
}
