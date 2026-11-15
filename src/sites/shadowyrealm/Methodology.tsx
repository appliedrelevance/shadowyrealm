import { Link } from "@tanstack/react-router";
import {
  CreditFormula,
  DimensionTable,
  IntensityTable,
  LevelFormula,
  PersistenceTable,
  TierTable,
} from "@/features/methodology/tables";

/** ShadowyRealm's account of its method; the tables come from the site config. */
export function Methodology() {
  return (
    <>
      <p className="mt-4 text-lg text-ink-2">
        ShadowyRealm measures influence, not virtue. A figure who transformed science while causing mass death is
        not average: they are enormous in both directions, and the score keeps both.
      </p>

      <div className="prose prose-invert mt-8 max-w-none">
        <h2 className="font-display text-ink">Ten numbers, never netted</h2>
        <p>
          Every entity carries a profile of ten numbers: a <strong>benefit</strong> and a <strong>harm</strong> for
          each of five dimensions. Benefit and harm are never subtracted from each other, and the profile is never
          collapsed into a direction. Their sum, <em>magnitude</em>, is used only to rank entities and assign tiers.
        </p>
        <DimensionTable />
        <p>
          Whether an entity really existed plays no part. Santa Claus, Harry Potter and Sherlock Holmes are scored on
          what the idea of them did, like the Catholic Church or the Cold War.
        </p>

        <h2 className="font-display text-ink">Periods and the influence curve</h2>
        <p>
          An entity's direct activity is divided into periods: a ministry, a reign, a war, a company's platform era.
          Within a period each of the ten numbers has a level per year:
        </p>
        <LevelFormula />
        <p>
          Depth is how deeply each person was affected, and people is how many were, counted absolutely. Laid end to
          end, the periods form an influence curve, and each number's score is the area under its curve up to today,
          in <strong>influence-centuries</strong> (level × years ÷ 100). Periods that overlap add; years between
          periods add nothing.
        </p>

        <h2 className="font-display text-ink">Scoring each period with Clef and Clairic</h2>
        <p>
          Each period is scored by two of Cloudflare's System One models, which read the same evidence: the period's
          description and the whole Wikipedia article about it, stored with the score.
        </p>
        <p>
          <strong>Clef</strong>, a decision model, rates the <em>depth</em> of each benefit and harm for the people
          affected, on the ten levels below, and how long the effects lasted. Depth is Clef's probability on each
          level above an even spread of 10%, weighted by the level and scaled to 0–10, so a confident answer counts
          for more than a hesitant one.
        </p>
        <p>
          <strong>Clairic</strong>, an estimation model, counts the living people the entity's own activity benefited
          and harmed in a typical year of the period, in each area, from one to ten billion.
        </p>
        <p>
          Both are told to judge only from the evidence, to score only the entity's own direct activity in that
          period, and to leave out consequences that are entities of their own.
        </p>
        <IntensityTable />

        <h2 className="font-display text-ink">Persistence and the fading tail</h2>
        <p>
          When an entity's last period ends, its influence fades exponentially at a rate set by the period's
          persistence: the number of years for its level to fall to 37% (1/e) of where it was. A legacy is held to
          what the years since have shown: one that ended 17 years ago fades within a generation at the slowest,
          whatever the evidence claims, because lasting for centuries cannot be seen until the centuries have passed.
        </p>
        <PersistenceTable />
        <p>
          The part of a legacy that its consequences carry comes back as credit instead, so the tail{" "}
          <strong>shrinks by the credit an entity passes on</strong>. A founder who passes 80% to a church keeps a
          fifth of the tail, and the rest reaches the founder as credit from the church, rather than being counted
          twice. An entity that passes on all of itself keeps no tail.
        </p>

        <h2 className="font-display text-ink">Credit flows from consequence to cause</h2>
        <p>
          Links run from cause to consequence: Jesus → Catholic Church → First Crusade. A link's strength is the share
          of the consequence credited to the cause. Beside the links chosen by hand, Clef proposed the causes they
          missed and Clairic sized each one.
        </p>
        <p>
          Clairic also judged how much of each consequence it owes to all its causes together. That is the most a
          consequence gives away: when its links add up to more, they are all scaled down to it, because the rest was
          new with it.
        </p>
        <p>
          An ancestor's share of a descendant is the chance that a walk back through history from the descendant,
          taking each cause with its link's strength, reaches the ancestor. Every route counts. A chain at 0.8 and
          then 0.5 gives 0.8 × 0.5 = 40%, and a second route adds its own product. Intent doesn't matter: harm done in
          a figure's name reaches the figure, and a reaction is credited to whatever provoked it.
        </p>
        <CreditFormula />
        <p>
          Only descendants' <em>own</em> profiles are credited, never what they in turn received, so no chain is
          counted twice. Influence and mentorship links carry credit; collaboration and opposition only describe.
        </p>

        <h2 className="font-display text-ink">Tiers</h2>
        <p>
          Tiers are set from the spread of the index itself: their boundaries are the round numbers nearest the
          20th, 50th, 80th and 95th percentiles of total influence.
        </p>
        <TierTable />

        <h2 className="font-display text-ink">Under the hood</h2>
        <p>
          The curves, the areas and the credit shares are computed by a small TypeScript calculator in a Cloudflare
          Worker, which serves one set of scores to every page here and to the MCP tools that maintain the index. The
          walk is iterated for each ancestor until no share moves by a billionth.
        </p>
        <p>
          <Link to="/realm">See the lineage</Link> or <Link to="/">return to the index</Link>.
        </p>
      </div>
    </>
  );
}
