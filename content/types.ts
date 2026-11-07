/**
 * Shape of a ShadowyRealm content file, which tools/realm-load.ts loads
 * through the MCP tools.
 */

export interface RealmPeriod {
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

export interface RealmEntity {
  slug: string;
  name: string;
  type: "person" | "organization" | "event";
  /** The entity's Wikipedia article title. */
  wiki: string;
  description: string;
  metadata?: Record<string, string>;
  periods: RealmPeriod[];
}

export interface RealmLink {
  /** The cause. */
  from: string;
  /** The consequence. */
  to: string;
  /** For influence and mentorship, the share of the consequence credited to the cause. */
  share: number;
  type?: "influence" | "mentorship" | "collaboration" | "opposition";
  why: string;
}

export interface RealmContent {
  entities: RealmEntity[];
  links: RealmLink[];
}
