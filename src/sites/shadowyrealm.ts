/**
 * ShadowyRealm: people, institutions and events ranked by their influence
 * across five thousand years. Every value here reproduces the constants the
 * site ran on before the platform, so its scores and Clef requests are unchanged.
 */
import { HISTORICAL_RUBRICS } from "./rubrics";
import type { SiteConfig } from "./types";

const PEOPLE = "the people it affected";
const DEPTH = "Rate how deeply those people were affected, not how many; breadth is judged separately.";
const ownActivity = (name: string) => `${name}'s own direct activity`;

export const shadowyrealm: SiteConfig = {
  key: "shadowyrealm",
  schema: "shadowyrealm",
  brand: {
    name: "ShadowyRealm",
    origin: "https://shadowyrealm.com",
    title: "ShadowyRealm — Impact Assessment Through the Ages",
    description:
      "Research, assess, and compare the historical impact of people, organizations, and events across five dimensions.",
    ogImage: "https://shadowyrealm.com/og.jpg",
    ogImageAlt: "The ShadowyRealm gate mark beside a stone beast's head carved into a jungle cliff",
    themeColor: "#181822",
    fontsHref:
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap",
    userAgent: "ShadowyRealm/1.0 (https://shadowyrealm.com)",
  },
  scoring: {
    dimensions: [
      {
        key: "scientific",
        label: "Scientific",
        meaning: "Knowledge, research and technology",
        weight: 1.0,
        clef: { area: "advancing knowledge, research and technology", affected: PEOPLE, depth: DEPTH },
      },
      {
        key: "economic",
        label: "Economic",
        meaning: "Prosperity, livelihoods and opportunity",
        weight: 1.0,
        clef: { area: "prosperity, livelihoods, wealth and economic opportunity", affected: PEOPLE, depth: DEPTH },
      },
      {
        key: "human_rights",
        label: "Human rights",
        meaning: "Freedom, dignity, safety and equal treatment",
        weight: 1.2,
        clef: { area: "freedom, dignity, safety and equal treatment of people", affected: PEOPLE, depth: DEPTH },
      },
      {
        key: "health",
        label: "Health",
        meaning: "Physical and mental health, and survival",
        weight: 1.1,
        clef: { area: "physical and mental health and survival of people", affected: PEOPLE, depth: DEPTH },
      },
      {
        key: "cultural",
        label: "Cultural",
        meaning: "Art, education, shared culture and cohesion",
        weight: 0.9,
        clef: { area: "art, education, shared culture and social cohesion", affected: PEOPLE, depth: DEPTH },
      },
    ],
    rubrics: HISTORICAL_RUBRICS,
    unit: { years: 100, name: "influence-centuries" },
    /**
     * In influence-centuries of total magnitude: the round values nearest the
     * 20th, 50th, 80th and 95th percentiles of the 2026-11-07 run over 114
     * entities. The keys name the colour tokens; the labels are what readers see.
     */
    tiers: [
      { tier: "minimal", min: 0, label: "Notable", descriptor: "Influence concentrated in one era or field" },
      { tier: "moderate", min: 100, label: "Major", descriptor: "Wide influence across a nation or a field" },
      { tier: "significant", min: 200, label: "Great", descriptor: "Influence across nations and generations" },
      { tier: "transformational", min: 500, label: "Epochal", descriptor: "Defined an epoch for much of humanity" },
      { tier: "legendary", min: 2000, label: "Legendary", descriptor: "Shaped civilisations for millennia" },
    ],
  },
  entityTypes: [
    {
      key: "person",
      label: "Person",
      plural: "People",
      clefSubject: ownActivity,
      metadataKeys: "birth_date, death_date, nationality, gender, wikipedia_url",
    },
    {
      key: "organization",
      label: "Organization",
      plural: "Organizations",
      clefSubject: ownActivity,
      metadataKeys:
        "founded_date, dissolved_date, headquarters, organization_type (corporation|ngo|government|institution|military), wikipedia_url",
    },
    {
      key: "event",
      label: "Event",
      plural: "Events",
      clefSubject: ownActivity,
      metadataKeys:
        "start_date, end_date, location, event_type (war|discovery|movement|disaster|treaty|revolution), wikipedia_url",
    },
  ],
  linkTypes: [
    {
      key: "influence",
      credit: true,
      from: "any",
      to: "any",
      labels: { cause: "Influenced", consequence: "Influenced by" },
      meaning: "the cause shaped the consequence; a reaction is recorded as influence from whatever provoked it",
    },
    {
      key: "mentorship",
      credit: true,
      from: ["person"],
      to: ["person"],
      labels: { cause: "Mentored", consequence: "Mentored by" },
      meaning: "a teacher formed a student",
    },
    {
      key: "collaboration",
      credit: false,
      from: "any",
      to: "any",
      labels: { cause: "Worked with", consequence: "Worked with" },
      meaning: "the two worked together",
    },
    {
      key: "opposition",
      credit: false,
      from: "any",
      to: "any",
      labels: { cause: "Opposed", consequence: "Opposed by" },
      meaning: "the cause opposed the consequence",
    },
  ],
  timeline: {
    /** The first cities and the invention of writing. */
    start: -3500,
    ticks: [-3000, -2000, -1000, -500, 1, 500, 1000, 1500, 1700, 1800, 1900, 1950, 2000],
    near: 40,
    buckets: 200,
  },
  copy: {
    nav: {
      index: "Index",
      lineage: "Lineage",
      compare: "Compare",
      howItWorks: "How It Works",
      signOut: "Sign Out",
    },
    home: {
      heading: "Who shaped the world — for better and for worse?",
      lede:
        "ShadowyRealm scores people, institutions and events by their influence across five thousand years. " +
        "Benefit and harm are kept apart, never netted, and every consequence passes a share of its weight back to its causes.",
      toLineage: "Trace the lineage",
      toMethod: "How the score works",
      story: { label: "How it was built", url: "https://ciqsi.net/blog/vibe-coding-history" },
      riverHeading: "The river of influence",
      riverSubtitle:
        "Every entity's own influence, year by year. Benefit rises above the line and harm falls below it.",
      indexHeading: "The Index",
      indexSubtitle: "Ranked by total influence: own impact plus the share credited from everything it caused.",
      heroAlt:
        "A stone beast's head carved into a jungle cliff, its open mouth glowing red above a flight of steps",
      empty: "No entries yet",
      loading: "Loading...",
    },
    entity: {
      notFound: "Not found",
      notFoundDescription: "This entity does not exist.",
      returnToIndex: "Return to Index",
    },
    methodology: { heading: "How It Works" },
    compare: { opening: ["jesus", "muhammad", "the-buddha"] },
    lineage: {
      heading: "Lineage",
      lede:
        "Every entity sits at the year it began. Arrows run from cause to consequence, and each consequence passes a " +
        "share of its influence back up the chain: the Crusades to the Church, the Church to Jesus.",
    },
    auth: { signInHeading: "Sign In", signingIn: "Signing in..." },
    footer: { tagline: "ShadowyRealm — Historical Impact Assessment" },
  },
  mcp: {
    serverName: "shadowyrealm",
    about:
      "ShadowyRealm is a historical impact index that measures influence, not net good. An entity is a person, " +
      "organization or event; whether it really existed does not matter.",
    linkExamples: "Jesus -> Catholic Church, Catholic Church -> First Crusade",
  },
};
