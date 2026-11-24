/** Music's How It Works page: its account of its method, around the tables its config draws. */
import type { SiteMethod } from "../types";

export const method: SiteMethod = {
  heading: "How It Works",
  lede:
    "Music is weighed only for what it gave people: joy, consolation and awe; worship and ritual; dancing and " +
    "celebration; stories and history carried from one generation to the next. Nothing here is scored for harm: " +
    "when music was used to do harm, the harm belongs to whoever used it.",
  blocks: [
    `## Four numbers, one for each gift

Every entry carries four numbers, one for each thing music gives people. Their sum is its influence, which ranks the entries and sets their tiers.`,
    { table: "dimensions" },
    `## Musicians, works, styles and instruments

An entry is a musician, a group, a genre or tradition, a work or an instrument. They are the 2,093 that [English Wikipedia's editors chose to span every era and every part of the world](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles/Level/5), from the oldest melody ever written down to the songs of this year.

Each entry belongs to one of eight families of music, and within its family to a branch: Classical by era, the world's music by region. On the home page the family is the colour of its band and the branch its shade.`,
    { table: "linkTypes" },
    `## Periods and the influence curve

Each entry's activity is a period: a musician's career, a group's years together, a work's life since it was first heard, a tradition's whole history. Within it each of the four numbers has a level per year:`,
    { table: "level" },
    `Reach is how far it travelled while it lasted, from one household to everywhere on earth. The reach multiplier is (reach ÷ 5)^1.8 × 3, so music heard across a continent weighs nearly six times as much as music heard in one town.`,
    { table: "reach" },
    `Laid end to end, the periods form an influence curve, and each number's score is the area under it up to today, in **influence-centuries** (level × years ÷ 100).

## Scoring each period with Clef

Each period is scored by Clef, Cloudflare's decision model, from the whole Wikipedia article about the entry, stored with the score. Clef rates how deeply the people who heard or played it were affected in each of the four areas, on the ten levels below, how far it travelled and how long its effects lasted. It scores an entry's own activity and leaves out what it gave rise to that has an entry of its own, such as a musician's works and groups or a genre's offshoots, because those pass a share back as credit.`,
    { table: "intensity" },
    `## Persistence and the fading tail

When an entry's period ends, its influence fades at a rate set by its persistence: the years for its level to fall to 37% (1/e). A passing fashion fades within a decade; a tradition handed down for centuries fades far more slowly. A legacy is held to what the years since have shown, because lasting for centuries cannot be seen until the centuries have passed.`,
    { table: "persistence" },
    `The part of a legacy that later music carries comes back as credit instead, so the tail shrinks by the credit an entry passes on.

## Credit flows back to what music drew on

Links run from cause to consequence: rhythm and blues → soul → Stevie Wonder → Songs in the Key of Life. A link's strength is the share of the consequence credited to the cause, so a work passes part of what it gave back to the musician who made it, and a musician part of theirs to the styles they played.

Beside the links that record a work's composer, a musician's genre, a group's members and a genre's parent, Clef proposed the influences each article names, and Cloudflare's estimation model, Clairic, sized each link. Clairic also judged how much of each entry it owes to all its causes together. That is the most an entry gives away: when its links add up to more, they are all scaled down to it, because the rest was new with it.

An ancestor's share of a descendant is the chance that a walk back from the descendant, taking each cause with its link's strength, reaches the ancestor. Every route counts. A chain at 0.8 and then 0.5 gives 0.8 × 0.5 = 40%, and a second route adds its own product.`,
    { table: "credit" },
    `Only descendants' *own* influence is credited, never what they in turn received, so no chain is counted twice.

## Tiers

Tiers are set from the spread of the index itself: their boundaries are the round numbers nearest the 20th, 50th, 80th and 95th percentiles of total influence.`,
    { table: "tiers" },
    `## One of the ShadowyRealm indexes

Music runs on the same engine as History, the ShadowyRealm index of people, institutions and events, and Inventions. The same calculator turns periods into curves and areas for every page and for the MCP tools that maintain the index.

[See the lineage](/realm) or [return to the index](/).`,
  ],
};
