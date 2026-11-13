/**
 * Prior Art: inventions, inventors and products ranked by their influence,
 * from the first farms to the smartphone. Spec: .kiro/specs/inventions-site.
 */
import { HISTORICAL_RUBRICS } from "./rubrics";
import type { SiteConfig, TierDef } from "./types";

const PEOPLE = "the people it affected";
const DEPTH = "Rate how deeply those people were affected, not how many; breadth is judged separately.";
const ownActivity = (name: string) => `${name}'s own direct activity`;
const makingAndUse = (name: string) => `the making and use of ${name}`;

/** A subdomain of ShadowyRealm: Prior Art is one of its indexes. */
const ORIGIN = "https://priorart.shadowyrealm.com";

/** What each tier means on Prior Art (inventions-site Requirement 8.2). */
export const PRIOR_ART_TIER_DESCRIPTORS: Record<TierDef["tier"], string> = {
  minimal: "Changed one industry or one era",
  moderate: "Changed work or life across a nation or a field",
  significant: "Changed daily life across nations and generations",
  transformational: "Defined an epoch for much of humanity",
  legendary: "Changed how humans live, for millennia",
};

const CREATORS = ["person", "organization", "project"];
const THINGS = ["invention", "product"];

export const inventions: SiteConfig = {
  key: "inventions",
  schema: "inventions",
  brand: {
    name: "Prior Art",
    origin: ORIGIN,
    title: "Prior Art — The Influence of Invention",
    description:
      "Prior Art ranks inventions, inventors and products by their influence, from the first farms to the smartphone: what each did to the world, for better and for worse.",
    ogImage: `${ORIGIN}/og-image.png`,
    ogImageAlt: "The Prior Art mark, a patent drawing of meshing gears, on blueprint paper",
    themeColor: "#0e1a2b",
    fontsHref:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap",
    userAgent: `PriorArt/1.0 (${ORIGIN})`,
  },
  scoring: {
    dimensions: [
      {
        key: "prosperity",
        label: "Prosperity",
        meaning: "Work saved, productivity, cheaper goods, new industries and livelihoods",
        weight: 1.0,
        clef: { area: "work, productivity, the cost of goods, livelihoods and wealth", affected: PEOPLE, depth: DEPTH },
      },
      {
        key: "health",
        label: "Health & Safety",
        meaning: "Lives saved or lost, disease, injury and physical danger",
        weight: 1.0,
        clef: { area: "survival, disease, injury and physical danger", affected: PEOPLE, depth: DEPTH },
      },
      {
        key: "knowledge",
        label: "Knowledge & Culture",
        meaning: "Learning, communication, information, art and entertainment",
        weight: 1.0,
        clef: {
          area: "learning, communication, information, art and entertainment",
          affected: PEOPLE,
          depth: DEPTH,
        },
      },
      {
        key: "freedom",
        label: "Freedom & Power",
        meaning: "Independence and choice, and the power some people hold over others",
        weight: 1.0,
        clef: {
          area: "people's independence and choices, and the power some people hold over others",
          affected: PEOPLE,
          depth: DEPTH,
        },
      },
      {
        key: "environment",
        label: "Environment",
        meaning: "Air, water, soil, climate, wildlife and natural resources",
        weight: 1.0,
        clef: {
          area: "air, water, soil, climate, wildlife and natural resources",
          affected: "the people and the natural world it affected",
          depth: "Rate how deeply they were affected, not how widely; breadth is judged separately.",
        },
      },
    ],
    rubrics: HISTORICAL_RUBRICS,
    unit: { years: 100, name: "influence-centuries" },
    /**
     * In influence-centuries of total magnitude: the round values nearest the
     * 20th, 50th, 80th and 95th percentiles of the 2026-11-13 launch run over
     * 150 entities (58.5, 127.7, 319.5, 2,543.4). See
     * .kiro/specs/inventions-site/research.md.
     */
    tiers: [
      { tier: "minimal", min: 0, label: "Notable", descriptor: PRIOR_ART_TIER_DESCRIPTORS.minimal },
      { tier: "moderate", min: 50, label: "Major", descriptor: PRIOR_ART_TIER_DESCRIPTORS.moderate },
      { tier: "significant", min: 100, label: "Great", descriptor: PRIOR_ART_TIER_DESCRIPTORS.significant },
      { tier: "transformational", min: 200, label: "Epochal", descriptor: PRIOR_ART_TIER_DESCRIPTORS.transformational },
      { tier: "legendary", min: 2000, label: "Legendary", descriptor: PRIOR_ART_TIER_DESCRIPTORS.legendary },
    ],
  },
  entityTypes: [
    {
      key: "person",
      label: "Person",
      plural: "People",
      clefSubject: ownActivity,
      metadataKeys: "birth_date, death_date, nationality, field, wikipedia_url",
    },
    {
      key: "organization",
      label: "Organization",
      plural: "Organizations",
      clefSubject: ownActivity,
      metadataKeys:
        "founded_date, dissolved_date, headquarters, organization_type (company|laboratory|university|government), wikipedia_url",
    },
    {
      key: "project",
      label: "Project",
      plural: "Projects",
      clefSubject: ownActivity,
      metadataKeys: "start_date, end_date, sponsor, wikipedia_url",
    },
    {
      key: "invention",
      label: "Invention",
      plural: "Inventions",
      clefSubject: makingAndUse,
      metadataKeys: "invented_date, place, field, wikipedia_url",
    },
    {
      key: "product",
      label: "Product",
      plural: "Products",
      clefSubject: makingAndUse,
      metadataKeys: "introduced_date, discontinued_date, maker, wikipedia_url",
    },
    {
      key: "discovery",
      label: "Discovery",
      plural: "Discoveries",
      clefSubject: (name) => `the spread and use of ${name}`,
      metadataKeys: "discovered_date, field, wikipedia_url",
      requiresOutgoing: "builds_on",
    },
  ],
  linkTypes: [
    {
      key: "originated",
      credit: true,
      from: CREATORS,
      to: ["invention", "discovery", "product"],
      labels: { cause: "Invented", consequence: "Invented by" },
      labelsByTarget: {
        discovery: { cause: "Discovered", consequence: "Discovered by" },
        product: { cause: "Created", consequence: "Created by" },
      },
      meaning:
        "a person, organization or project invented, discovered or designed the consequence; the share is smaller for each rival claimant who came close",
    },
    {
      key: "builds_on",
      credit: true,
      from: ["discovery", ...THINGS],
      to: THINGS,
      labels: { cause: "Led to", consequence: "Builds on" },
      meaning: "the consequence was built on the cause",
    },
    {
      key: "embodies",
      credit: true,
      from: ["invention"],
      to: ["product"],
      labels: { cause: "Used in", consequence: "Embodies" },
      meaning: "the product contains the invention",
    },
    {
      key: "made",
      credit: true,
      from: ["organization"],
      to: ["product"],
      labels: { cause: "Made", consequence: "Made by" },
      meaning: "the organization brought the product to market",
    },
    {
      key: "led",
      credit: true,
      from: ["person"],
      to: ["organization", "project"],
      labels: { cause: "Founded or led", consequence: "Founded or led by" },
      meaning: "the person founded, directed or ran the organization or project",
    },
    {
      key: "mentorship",
      credit: true,
      from: ["person"],
      to: ["person"],
      labels: { cause: "Mentored", consequence: "Mentored by" },
      meaning: "a teacher or employer formed an inventor",
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
      key: "rivalry",
      credit: false,
      from: "any",
      to: "any",
      labels: { cause: "Rival of", consequence: "Rival of" },
      meaning: "the two competed",
    },
    {
      key: "supersedes",
      credit: false,
      from: THINGS,
      to: THINGS,
      labels: { cause: "Replaced by", consequence: "Replaced" },
      meaning: "the consequence replaced the cause (old -> new)",
    },
  ],
  timeline: {
    /** The first farming. */
    start: -10000,
    ticks: [-10000, -5000, -3000, -1000, 1, 1000, 1500, 1700, 1800, 1900, 1950, 2000],
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
      heading: "Which inventions changed how we live — for better and for worse?",
      lede:
        "Prior Art scores inventions, inventors and products by their influence, from the first farms to the smartphone. " +
        "Benefit and harm are kept apart, never netted, and every invention passes a share of its weight back to the people and ideas it was built on.",
      toLineage: "Trace the lineage",
      toMethod: "How the score works",
      story: null,
      riverHeading: "The river of invention",
      riverSubtitle:
        "Every entry's own influence, year by year. Benefit rises above the line and harm falls below it.",
      indexHeading: "The Index",
      indexSubtitle: "Ranked by total influence: own impact plus the share credited from everything built on it.",
      heroAlt: "A patent drawing of meshing gears, a light bulb and a microchip on blueprint paper",
      empty: "No entries yet",
      loading: "Loading...",
    },
    entity: {
      notFound: "Not found",
      notFoundDescription: "This entry does not exist.",
      returnToIndex: "Return to Index",
    },
    methodology: { heading: "How It Works" },
    compare: { opening: ["transistor", "printing-press", "haber-process"] },
    lineage: {
      heading: "Lineage",
      lede:
        "Every entry sits at the year it began. Arrows run from cause to consequence, and each consequence passes a " +
        "share of its influence back up the chain: the iPhone to the microprocessor, the microprocessor to the " +
        "integrated circuit, the integrated circuit to Kilby and Noyce.",
    },
    auth: { signInHeading: "Sign In", signingIn: "Signing in..." },
    footer: { tagline: "Prior Art — a ShadowyRealm index of invention" },
  },
  mcp: {
    serverName: "prior-art",
    about:
      "Prior Art is an index of inventions, inventors and products that measures influence, not net good. An entity " +
      "is a person, organization, project, invention, product or discovery. What an invention made possible reaches " +
      "it as credit from the things built on it, so no dimension measures technology itself.",
    linkExamples:
      "Robert Noyce -> integrated circuit (originated), integrated circuit -> microprocessor (builds_on), " +
      "microprocessor -> iPhone (embodies), Apple Inc. -> iPhone (made)",
  },
};
