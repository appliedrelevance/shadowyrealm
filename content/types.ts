/**
 * Shape of a content file, which tools/realm-load.ts loads through a site's
 * MCP tools. Typed by site, so an entity type or link type the site lacks
 * fails the typecheck. A content index also exports `site`, the key of the
 * site it belongs to (src/sites).
 */

export interface SitePeriod {
  /** Unique within the entity; the loader matches existing periods by label. */
  label: string;
  /** Negative for BCE. */
  start: number;
  end: number;
  /** One or two sentences on the entity's direct activity in this period; it heads the evidence. */
  description: string;
  /** The Wikipedia article the evidence comes from, when not the entity's own. */
  wiki?: string;
  /** Section headings to take evidence from; by default, the sections that mention the period's years. */
  sections?: string[];
}

export interface SiteEntity<E extends string> {
  slug: string;
  name: string;
  type: E;
  /** The entity's Wikipedia article title. */
  wiki: string;
  description: string;
  metadata?: Record<string, string>;
  periods: SitePeriod[];
  /** Why it belongs in the index. Kept with the content; the loader does not send it. */
  why?: string;
}

export interface SiteLink<L extends string> {
  /** The cause. */
  from: string;
  /** The consequence. */
  to: string;
  /** For a credit-bearing link, the share of the consequence credited to the cause. */
  share: number;
  /** Required unless the site has an "influence" link type, which is the default. */
  type?: L;
  why: string;
}

export interface SiteContent<E extends string, L extends string> {
  entities: SiteEntity<E>[];
  links: SiteLink<L>[];
}

// ---------- ShadowyRealm ----------

export type RealmEntityType = "person" | "organization" | "event";
export type RealmLinkType = "influence" | "mentorship" | "collaboration" | "opposition";
export type RealmPeriod = SitePeriod;
export type RealmEntity = SiteEntity<RealmEntityType>;
export type RealmLink = SiteLink<RealmLinkType>;
export type RealmContent = SiteContent<RealmEntityType, RealmLinkType>;

// ---------- Prior Art ----------

export type InventionsEntityType = "person" | "organization" | "project" | "invention" | "product" | "discovery";
export type InventionsLinkType =
  | "originated"
  | "builds_on"
  | "embodies"
  | "made"
  | "led"
  | "mentorship"
  | "collaboration"
  | "rivalry"
  | "supersedes";
export interface InventionsLink extends SiteLink<InventionsLinkType> {
  /** Prior Art has no default link type. */
  type: InventionsLinkType;
}
export interface InventionsContent {
  entities: SiteEntity<InventionsEntityType>[];
  links: InventionsLink[];
}
