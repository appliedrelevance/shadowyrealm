/**
 * The shape of a site: everything specific to one field lives in its config.
 * The calculator, the credit composer, Clef, the service layer, the Worker and
 * every screen read these values and declare none of their own.
 */
import type { ATISTier } from "../lib/atis-calculator";

export interface DimensionDef {
  /** Column prefix: {key}_benefit, {key}_harm, {key}_justification. A lowercase SQL identifier. */
  key: string;
  label: string;
  /** What the dimension covers, for the methodology page. */
  meaning: string;
  weight: number;
  clef: {
    /** Completes "...in the area of {area}". */
    area: string;
    /** Completes "...caused to {affected}". */
    affected: string;
    /** The sentence that tells Clef to rate depth, not breadth. */
    depth: string;
  };
}

export interface EntityTypeDef {
  key: string;
  label: string;
  /** For the index filter. */
  plural: string;
  /** How Clef's questions name the thing being scored. */
  clefSubject: (name: string) => string;
  /** The conventional metadata keys, for the create_entity description. */
  metadataKeys: string;
  /** A link type key: the loader rejects an entity of this type without one outgoing link of that type. */
  requiresOutgoing?: string;
}

export interface LinkLabels {
  /** Shown on the cause's profile, before the consequence's name. */
  cause: string;
  /** Shown on the consequence's profile, before the cause's name. */
  consequence: string;
}

export interface LinkTypeDef {
  key: string;
  credit: boolean;
  from: readonly string[] | "any";
  to: readonly string[] | "any";
  labels: LinkLabels;
  /** Labels that depend on the consequence's entity type. */
  labelsByTarget?: Readonly<Record<string, LinkLabels>>;
  /** One clause for the MCP tool description. */
  meaning: string;
}

export interface Rubrics {
  /** Ten levels each, lowest first. */
  intensity: readonly string[];
  reach: readonly string[];
  persistence: readonly string[];
  /** Years for a fading legacy to fall to 1/e, one per persistence level. Infinity never fades. */
  persistenceTimeConstants: readonly number[];
}

export interface TierDef {
  tier: ATISTier;
  min: number;
  label: string;
  descriptor: string;
}

export interface ScoringConfig {
  dimensions: readonly DimensionDef[];
  rubrics: Rubrics;
  /** Areas are level × years / unit.years, named unit.name. */
  unit: { years: number; name: string };
  /** null until the site's first full run is calibrated; publishing is refused meanwhile. */
  tiers: readonly TierDef[] | null;
}

/** Years throughout; negative for BCE. */
export interface Timeline {
  start: number;
  ticks: readonly number[];
  /** Years of offset that keep the present from sitting at infinity on the log axis. */
  near: number;
  buckets: number;
}

export interface SiteBrand {
  name: string;
  origin: string;
  title: string;
  description: string;
  ogImage: string;
  ogImageAlt: string;
  /** The browser chrome colour; a literal because it is read before any CSS. */
  themeColor: string;
  /** The Google Fonts stylesheet for the brand's faces. */
  fontsHref: string;
  /** Wikimedia rejects requests without one. */
  userAgent: string;
}

export interface SiteCopy {
  nav: { index: string; lineage: string; compare: string; howItWorks: string; signOut: string };
  home: {
    heading: string;
    lede: string;
    toLineage: string;
    toMethod: string;
    /** A post about how the site was built, when there is one. */
    story: { label: string; url: string } | null;
    riverHeading: string;
    riverSubtitle: string;
    indexHeading: string;
    indexSubtitle: string;
    heroAlt: string;
    empty: string;
    loading: string;
  };
  entity: { notFound: string; notFoundDescription: string; returnToIndex: string };
  methodology: { heading: string };
  /** Slugs the comparison opens with. */
  compare: { opening: readonly string[] };
  lineage: { heading: string; lede: string };
  auth: { signInHeading: string; signingIn: string };
  footer: { tagline: string };
}

export interface SiteMcp {
  serverName: string;
  /** What the index is, for the server instructions' first paragraph. */
  about: string;
  /** Example links, cause first, for the add_relationship description. */
  linkExamples: string;
}

export interface SiteConfig {
  key: string;
  /** The Postgres schema in the shared Supabase project. */
  schema: string;
  brand: SiteBrand;
  scoring: ScoringConfig;
  entityTypes: readonly EntityTypeDef[];
  linkTypes: readonly LinkTypeDef[];
  timeline: Timeline;
  copy: SiteCopy;
  mcp: SiteMcp;
}
