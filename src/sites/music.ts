/**
 * Music: the musicians, groups, genres and traditions, instruments and works on English Wikipedia's
 * Vital Articles list, scored only for what they gave people. The dimensions, the reach rubric and the
 * questions are the ones the 2,093 entries were first scored with (Landru work/shadowyrealm/music-vital/
 * score.ts), so the answers already paid for are read from the System One cache.
 */
import { method } from "./music/method";
import { HISTORICAL_RUBRICS } from "./rubrics";
import type { SiteConfig, TierDef } from "./types";

/** What each tier means on Music. */
export const MUSIC_TIER_DESCRIPTORS: Record<TierDef["tier"], string> = {
  minimal: "Loved in one place or one scene",
  moderate: "Heard across a nation or a whole genre",
  significant: "Heard across nations and generations",
  transformational: "Defined an era of music for much of the world",
  legendary: "Has moved people everywhere, for centuries",
};

/** A subdomain of ShadowyRealm: Music is one of its indexes. */
const ORIGIN = "https://music.shadowyrealm.com";

const AFFECTED = "the people who heard or played it";
const DEPTH = "Rate how deeply those people were affected, not how widely; how far it travelled is judged separately.";
const ownActivity = (name: string) => `${name}'s own direct activity`;
const PLAYERS = ["person", "group"];

/** How far it travelled, from one household to everywhere on earth. */
const MUSIC_REACH = [
  "A single household or ensemble",
  "A village or a small circle of listeners",
  "A town or one local scene",
  "A city",
  "A province or a region",
  "A nation",
  "Several nations",
  "A continent or a whole civilization",
  "Most of the world",
  "Everywhere on earth",
];

export const music: SiteConfig = {
  key: "music",
  schema: "music",
  brand: {
    name: "Music",
    origin: ORIGIN,
    title: "Music — Ranked by What It Gave",
    description:
      "The musicians, composers, genres, traditions, instruments and works that matter most, ranked by what they gave people: feeling, devotion, gathering and memory.",
    ogImage: `${ORIGIN}/og-image.png`,
    ogImageAlt: "The Music stream: one band for each musician, work and tradition, coloured by its family",
    themeColor: "#181822",
    fontsHref:
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap",
    userAgent: `ShadowyRealm-Music/1.0 (${ORIGIN})`,
    holds: "Musicians, works, genres and instruments",
    hero: "/hero.jpg",
  },
  scoring: {
    sides: ["benefit"],
    breadth: "reach",
    dimensions: [
      {
        key: "feeling",
        label: "Feeling",
        meaning: "Joy, consolation, awe and catharsis",
        weight: 1,
        clef: { area: "people's emotional and inner lives: joy, consolation, awe and catharsis", affected: AFFECTED, depth: DEPTH },
      },
      {
        key: "devotion",
        label: "Devotion",
        meaning: "Worship, prayer and ritual",
        weight: 1,
        clef: { area: "worship, prayer and ritual", affected: AFFECTED, depth: DEPTH },
      },
      {
        key: "gathering",
        label: "Gathering",
        meaning: "Dance, celebration and coming together",
        weight: 1,
        clef: { area: "dancing, celebration and people coming together", affected: AFFECTED, depth: DEPTH },
      },
      {
        key: "memory",
        label: "Memory",
        meaning: "Stories, history and shared memory carried on",
        weight: 1,
        clef: {
          area: "carrying stories, history and shared memory from one generation to the next",
          affected: AFFECTED,
          depth: DEPTH,
        },
      },
    ],
    rubrics: {
      ...HISTORICAL_RUBRICS,
      reach: MUSIC_REACH,
      reachQuestion: (subject, when) =>
        `How far did ${subject} during ${when} travel while it lasted: across how much of the world was it heard or played?`,
    },
    unit: { years: 100, name: "influence-centuries" },
    /**
     * In influence-centuries of total magnitude: the 1-2-5 values nearest the 20th, 50th, 80th and 95th
     * percentiles over the 2,093 entries scored on 2026-11-24 (35.7, 61.9, 138.2, 910.6). The 20th and
     * 50th both lie nearest 50, so the four are the distinct rising values nearest the four together.
     */
    tiers: [
      { tier: "minimal", min: 0, label: "Notable", descriptor: MUSIC_TIER_DESCRIPTORS.minimal },
      { tier: "moderate", min: 20, label: "Major", descriptor: MUSIC_TIER_DESCRIPTORS.moderate },
      { tier: "significant", min: 50, label: "Great", descriptor: MUSIC_TIER_DESCRIPTORS.significant },
      { tier: "transformational", min: 100, label: "Epochal", descriptor: MUSIC_TIER_DESCRIPTORS.transformational },
      { tier: "legendary", min: 1000, label: "Legendary", descriptor: MUSIC_TIER_DESCRIPTORS.legendary },
    ],
  },
  entityTypes: [
    {
      key: "person",
      label: "Musician",
      plural: "Musicians",
      icon: "mic-vocal",
      clefSubject: ownActivity,
      metadataKeys: "family, shade, section, birth_date, death_date, wikidata_id, wikipedia_url",
    },
    {
      key: "group",
      label: "Group",
      plural: "Groups",
      icon: "users",
      clefSubject: ownActivity,
      metadataKeys: "family, shade, section, founded_date, dissolved_date, wikidata_id, wikipedia_url",
    },
    {
      key: "style",
      label: "Genre or tradition",
      plural: "Genres and traditions",
      icon: "layers",
      clefSubject: (name) => `the spread and practice of ${name}`,
      metadataKeys: "family, shade, section, origin_date, wikidata_id, wikipedia_url",
    },
    {
      key: "work",
      label: "Work",
      plural: "Works",
      icon: "music",
      clefSubject: (name) => `the performance and hearing of ${name}`,
      metadataKeys: "family, shade, section, first_performed_date, wikidata_id, wikipedia_url",
    },
    {
      key: "instrument",
      label: "Instrument",
      plural: "Instruments",
      icon: "guitar",
      clefSubject: (name) => `the making and playing of ${name}`,
      metadataKeys: "family, shade, section, invented_date, wikidata_id, wikipedia_url",
    },
  ],
  linkTypes: [
    {
      key: "genre",
      credit: true,
      from: ["style"],
      to: [...PLAYERS, "work"],
      labels: { cause: "Played by", consequence: "Genre" },
      labelsByTarget: { work: { cause: "Heard in", consequence: "Genre" } },
      meaning: "the musician, group or work belongs to the genre or tradition",
    },
    {
      key: "gave_rise",
      credit: true,
      from: ["style"],
      to: ["style"],
      labels: { cause: "Gave rise to", consequence: "Grew from" },
      meaning: "the consequence grew out of the cause",
    },
    {
      key: "member",
      credit: true,
      from: ["person"],
      to: ["group"],
      labels: { cause: "Member of", consequence: "Member" },
      meaning: "the musician played in the group",
    },
    {
      key: "made",
      credit: true,
      from: PLAYERS,
      to: ["work"],
      labels: { cause: "Made", consequence: "By" },
      meaning: "the musician or group composed, wrote or first performed the work",
    },
    {
      key: "influence",
      credit: true,
      from: "any",
      to: "any",
      labels: { cause: "Influenced", consequence: "Influenced by" },
      meaning: "the consequence drew on the cause: a musician on another musician, a style, an instrument or a work",
    },
  ],
  timeline: {
    start: -1400,
    ticks: [-1400, -500, 1, 500, 1000, 1500, 1700, 1800, 1900, 1950, 2000],
    near: 10,
    buckets: 200,
  },
  /**
   * Families in the palette's slot order (the order the eight hues pass the dataviz checks in, on
   * surface-1), shaded by the Vital Articles list's sections: Classical by era, the world's music by region.
   */
  picture: {
    kind: "stream",
    grouping: {
      key: "family",
      shadeKey: "shade",
      labels: { group: "Family", groups: "Families", shades: "Sections" },
      groups: [
        { name: "Classical", shades: ["Ancient", "Medieval & Renaissance", "Baroque", "Classical era", "Romantic", "Modern", "Screen", "Anthems"] },
        { name: "Blues & Jazz", shades: ["Blues", "Early jazz", "Swing", "Modern jazz", "Free & fusion", "Vocal jazz", "Jazz beyond the US"] },
        { name: "R&B & Hip-hop", shades: ["Gospel", "Soul & R&B", "Funk & disco", "Hip-hop"] },
        { name: "Rock, Folk & Country", shades: ["Folk", "Country", "Rock and roll", "Rock", "Metal & hard rock", "Punk", "Alternative"] },
        { name: "Pop & Electronic", shades: ["Pop", "Stage & screen", "Electronic"] },
        { name: "World popular music", shades: ["Latin America & Iberia", "Caribbean", "Africa", "Europe", "Middle East & Central Asia", "South Asia", "East & Southeast Asia"] },
        { name: "Traditions & world", shades: ["Europe", "Middle East & Central Asia", "South Asia", "East & Southeast Asia", "Africa", "Americas", "Oceania", "Traditional songs"] },
        { name: "Instruments", shades: ["String instruments", "Wind instruments", "Percussion instruments", "Keyboard instruments", "Electronic instruments"] },
      ],
    },
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
      heading: "Which music has given the most?",
      lede:
        "The musicians, composers, genres, traditions, instruments and works that matter most, chosen to span every era " +
        "and every part of the world, and weighed by what each gave people: joy, consolation and awe; worship and ritual; " +
        "dancing and celebration; stories and history. Every musician and work passes a share of its weight back to the " +
        "styles and people it drew on.",
      toLineage: "Trace the lineage",
      toMethod: "How the score works",
      story: null,
      riverHeading: "The stream of music",
      riverSubtitle:
        "Each band is what one entry gave people that year; the further it travelled, the thicker it is. Colour is the family, shade the branch.",
      indexHeading: "The Index",
      indexSubtitle: "Ranked by total influence: what it gave, plus the share credited from everything that drew on it.",
      heroAlt:
        "An 18th-century portrait of a woman in a white gown and rose sash, her cheek against the neck of a tall walnut lyre as she plays",
      empty: "No entries yet",
      loading: "Loading...",
    },
    entity: {
      notFound: "Not found",
      notFoundDescription: "This entry does not exist.",
      returnToIndex: "Return to Index",
    },
    methodology: method,
    compare: { opening: ["the-beatles", "johann-sebastian-bach", "jazz"] },
    lineage: {
      heading: "Lineage",
      lede:
        "Every entry sits at the year it began. Arrows run from cause to consequence, and each consequence passes a " +
        "share of its influence back up the chain: Songs in the Key of Life to Stevie Wonder, Stevie Wonder to soul, " +
        "soul to rhythm and blues.",
    },
    auth: { signInHeading: "Sign In", signingIn: "Signing in..." },
    footer: { tagline: "Music — a ShadowyRealm index" },
  },
  mcp: {
    serverName: "music",
    about:
      "Music is a ShadowyRealm index of musicians, groups, genres and traditions, instruments and works. It weighs only " +
      "what each gave people, so it has no harm side. An entity is a musician, group, genre or tradition, work or instrument.",
    linkExamples: "Soul music -> Stevie Wonder, Rhythm and blues -> Soul music, Stevie Wonder -> Songs in the Key of Life",
  },
};
