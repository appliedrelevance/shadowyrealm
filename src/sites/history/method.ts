/** History's How It Works page: its account of its method, around the tables its config draws. */
import type { SiteMethod } from "../types";

export const method: SiteMethod = {
  heading: "How It Works",
  lede:
    "ShadowyRealm measures influence, not virtue. A figure who transformed science while causing mass death is not " +
    "average: they are enormous in both directions, and the score keeps both.",
  blocks: [
    `## Ten numbers, never netted

Every entity carries a profile of ten numbers: a **benefit** and a **harm** for each of five dimensions. Benefit and harm are never subtracted from each other, and the profile is never collapsed into a direction. Their sum, *magnitude*, is used only to rank entities and assign tiers.`,
    { table: "dimensions" },
    `Whether an entity really existed plays no part. Santa Claus, Harry Potter and Sherlock Holmes are scored on what the idea of them did, like the Catholic Church or the Cold War.

## Periods and the influence curve

An entity's direct activity is divided into periods: a ministry, a reign, a war, a company's platform era. Within a period each of the ten numbers has a level per year:`,
    { table: "level" },
    `Depth is how deeply each person was affected. Reach is how many were, as a share of everyone alive at the time: 10 is all of humanity, and each level below it a tenth as many, so 9 is a tenth of the world and 5 one person in a hundred thousand. A dynasty that ruled a third of the world in 500 BCE reaches as far as an empire that rules a third of it today, though the world it ruled was a fiftieth the size.

The multiplier lets breadth matter without drowning depth: everyone alive counts 63 times one person in a billion, not a billion times. The world's population in each year is Our World in Data's long-run series, built from HYDE, Gapminder and the UN.

Laid end to end, the periods form an influence curve, and each number's score is the area under its curve up to today, in **influence-centuries** (level × years ÷ 100). Periods that overlap add; years between periods add nothing.

## Scoring each period with Clef and Clairic

Each period is scored by two of Cloudflare's System One models, which read the same evidence: the period's description and the whole Wikipedia article about it, stored with the score.

**Clef**, a decision model, rates the *depth* of each benefit and harm for the people affected, on the ten levels below, and how long the effects lasted. Depth is Clef's probability on each level above an even spread of 10%, weighted by the level and scaled to 0–10, so a confident answer counts for more than a hesitant one.

**Clairic**, an estimation model, counts the living people the entity's own activity benefited and harmed in a typical year of the period, in each area, from one to ten billion.

Both are told to judge only from the evidence, to score only the entity's own direct activity in that period, and to leave out consequences that are entities of their own.

Benefit and harm share the ten levels of depth, and the top three are worded for each side. Under one wording for both, Clef read the top level, "the most intense effect on people in history", as fitting the benefit of a genocide: asked about the Holocaust's benefit to health, with no evidence at all, it put 70% on the top two levels.`,
    { table: "intensity" },
    `## Persistence and the fading tail

When an entity's last period ends, its influence fades exponentially at a rate set by the period's persistence: the number of years for its level to fall to 37% (1/e) of where it was. A legacy is held to what the years since have shown: one that ended 17 years ago fades within a generation at the slowest, whatever the evidence claims, because lasting for centuries cannot be seen until the centuries have passed.`,
    { table: "persistence" },
    `The part of a legacy that its consequences carry comes back as credit instead, so the tail **shrinks by the credit an entity passes on**. A founder who passes 80% to a church keeps a fifth of the tail, and the rest reaches the founder as credit from the church, rather than being counted twice. An entity that passes on all of itself keeps no tail.

## Credit flows from consequence to cause

Links run from cause to consequence: Jesus → Catholic Church → First Crusade. A link's strength is the share of the consequence credited to the cause. Beside the links chosen by hand, Clef proposed the causes they missed and Clairic sized each one.

Clairic also judged how much of each consequence it owes to all its causes together. That is the most a consequence gives away: when its links add up to more, they are all scaled down to it, because the rest was new with it.

An ancestor's share of a descendant is the chance that a walk back through history from the descendant, taking each cause with its link's strength, reaches the ancestor. Every route counts. A chain at 0.8 and then 0.5 gives 0.8 × 0.5 = 40%, and a second route adds its own product. Intent doesn't matter: harm done in a figure's name reaches the figure, and a reaction is credited to whatever provoked it.`,
    { table: "credit" },
    `Only descendants' *own* profiles are credited, never what they in turn received, so no chain is counted twice. Influence and mentorship links carry credit; collaboration and opposition only describe.

## Tiers

Tiers are set from the spread of the index itself: their boundaries are the round numbers nearest the 20th, 50th, 80th and 95th percentiles of total influence.`,
    { table: "tiers" },
    `## Under the hood

The curves, the areas and the credit shares are computed by a small TypeScript calculator in a Cloudflare Worker, which serves one set of scores to every page here and to the MCP tools that maintain the index. The walk is iterated for each ancestor until no share moves by a billionth.

[See the lineage](/realm) or [return to the index](/).`,
  ],
};
