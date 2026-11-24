/** Inventions' How It Works page: its account of its method, around the tables its config draws. */
import type { SiteMethod } from "../types";

export const method: SiteMethod = {
  heading: "How It Works",
  lede:
    "This index measures what inventions did to the world, not how clever they were. Fritz Haber's ammonia process " +
    "feeds billions, and Haber also ran Germany's chlorine gas programme. Thomas Midgley gave the world leaded petrol " +
    "and CFCs. The score keeps both sides of each.",
  blocks: [
    `## Ten numbers, never netted

Every entry carries a profile of ten numbers: a **benefit** and a **harm** for each of five dimensions. Benefit and harm are never subtracted from each other. Their sum, *magnitude*, is used only to rank entries and assign tiers.`,
    { table: "dimensions" },
    `No dimension measures technology itself. What an invention made possible reaches it as credit from the things built on it: the transistor is credited with a share of the integrated circuit, the microprocessor and the iPhone. Scoring "advanced technology" as a dimension as well would count those descendants twice.

## Inventions, products and the people behind them

An *invention* is a technique, device, material or process, such as the transistor or the Haber process. A *product* is one thing made and sold under one name, such as the Model T or the Walkman. Products embody inventions, so the graph can say which inventions a phone is made of. People, organizations and projects originate inventions and make products; a *discovery* about nature enters the index only when an invention here builds on it.`,
    { table: "linkTypes" },
    `## Periods and the influence curve

Each entry's direct activity is divided into periods: an invention's first working form, its commercialization, its mass adoption and its decline; a product's generations; an inventor's working life. Within a period each of the ten numbers has a level per year:`,
    { table: "level" },
    `Depth is how deeply each person was affected. Reach is how many were, as a share of everyone alive at the time: 10 is all of humanity, and each level below it a tenth as many, so 9 is a tenth of the world and 5 one person in a hundred thousand. An invention used by a tenth of the world in 1500 reaches as far as one used by a tenth of it today, though the world was far smaller then.

The multiplier lets breadth matter without drowning depth: everyone alive counts 63 times one person in a billion, not a billion times. The world's population in each year is Our World in Data's long-run series, built from HYDE, Gapminder and the UN.

Laid end to end, the periods form an influence curve, and each number's score is the area under it up to today, in **influence-centuries** (level × years ÷ 100). Periods that overlap add; years between periods add nothing.

## Scoring each period with Clef and Clairic

Each period is scored by two of Cloudflare's System One models, which read the same evidence: the period's description and the whole Wikipedia article about it, stored with the score.

**Clef**, a decision model, rates the *depth* of each benefit and harm for the people affected, on the ten levels below, and how long the effects lasted. Depth is Clef's probability on each level above an even spread of 10%, weighted by the level and scaled to 0–10, so a confident answer counts for more than a hesitant one.

**Clairic**, an estimation model, counts the living people the entry benefited and harmed in a typical year of the period, in each area, from one to ten billion.

Both are told to judge only from the evidence, to rate an inventor on their own work and an invention on its making and use, and to leave out the consequences that have entries of their own. Environment is judged by the effect on the natural world as well as on people.

Benefit and harm share the ten levels of depth, and the top three are worded for each side. Under one wording for both, Clef read the top level, "the most intense effect on people in history", as fitting the benefit of a catastrophe.`,
    { table: "intensity" },
    `## Persistence and the fading tail

When an entry's last period ends, its influence fades at a rate set by that period's persistence: the years for its level to fall to 37% (1/e). A product replaced within a decade fades fast; the plough never does. A legacy is held to what the years since have shown: one that ended 17 years ago fades within a generation at the slowest, because lasting for centuries cannot be seen until the centuries have passed.`,
    { table: "persistence" },
    `The part of a legacy that later inventions carry comes back as credit instead, so the tail shrinks by the credit an entry passes on.

## Share is originality

Links run from cause to consequence, and a link's strength is the share of the consequence credited to the cause. Credit travels any number of hops, so Bell Labs is credited, through the transistor, the integrated circuit and the microprocessor, with a share of the iPhone. Beside the links chosen by hand, Clef proposed the causes they missed, from the articles that name them, and Clairic sized each one.

Clairic also judged how much of each consequence it owes to all its causes together. That is the most a consequence gives away: when its links add up to more, they are all scaled down to it. What it keeps is its own originality: the iPhone credits parts of itself to the inventions inside it and to Apple, and keeps the rest for what was new in putting them together. An inventor's share of an invention is smaller for each rival who came close: Jack Kilby and Robert Noyce built integrated circuits months apart, so each shares the credit.

An ancestor's share of a descendant is the chance that a walk back from the descendant, taking each cause with its link's strength, reaches the ancestor. Every route counts. A chain at 0.8 and then 0.5 gives 0.8 × 0.5 = 40%, and a second route adds its own product: Michael Faraday is credited with the electric generator directly and again through electromagnetic induction.`,
    { table: "credit" },
    `Only descendants' *own* profiles are credited, never what they in turn received, so no chain is counted twice.

## Tiers

Tiers are set from the spread of the index itself: their boundaries are the round numbers nearest the 20th, 50th, 80th and 95th percentiles of total influence.`,
    { table: "tiers" },
    `## One of the ShadowyRealm indexes

Inventions runs on the same engine as History, the ShadowyRealm index of people, institutions and events, and Music. Each credit share adds up every route through the links, and the same calculator turns periods into curves and areas for every page and for the MCP tools that maintain the index.

[See the lineage](/realm) or [return to the index](/).`,
  ],
};
