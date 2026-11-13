import { Link } from "@tanstack/react-router";
import {
  CreditFormula,
  DimensionTable,
  IntensityTable,
  LevelFormula,
  PersistenceTable,
  ReachTable,
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
          The reach multiplier is (reach ÷ 5)<sup>1.8</sup> × 3, so a nation-wide period weighs about ten times a
          town-wide one. Laid end to end, the periods form an influence curve, and each number's score is the area
          under its curve up to today, in <strong>influence-centuries</strong> (level × years ÷ 100). Periods that
          overlap add; years between periods add nothing.
        </p>

        <h2 className="font-display text-ink">Scoring each period with Clef</h2>
        <p>
          Each period is scored by Clef, Cloudflare's decision model, in a single request. The state is evidence text
          about that period, taken from Wikipedia and stored with the score. Twelve questions are asked: benefit and
          harm for each dimension, plus the period's reach and persistence. Each question has ten levels, and Clef's
          probability-weighted answer gives a continuous value rather than a rounded one.
        </p>
        <p>
          Benefit and harm rate <em>intensity</em> for the people affected, not breadth, which is the reach question's
          job, so nothing is counted twice. Clef is told to judge only from the evidence, to score only the entity's
          own direct activity in that period, and to leave out consequences that are entities of their own.
        </p>
        <IntensityTable />
        <ReachTable />

        <h2 className="font-display text-ink">Persistence and the fading tail</h2>
        <p>
          When an entity's last period ends, its influence fades exponentially at a rate set by the period's
          persistence: the number of years for its level to fall to 37% (1/e) of where it was.
        </p>
        <PersistenceTable />
        <p>
          The part of a legacy that its consequences carry comes back as credit instead, so the tail{" "}
          <strong>shrinks by the credit an entity passes on</strong>. Jesus passes 80% to the Church, so a fifth of
          his ministry's tail remains and the rest reaches him as credit from the Church, rather than being counted
          twice. An entity that passes on all of itself keeps no tail.
        </p>

        <h2 className="font-display text-ink">Credit flows from consequence to cause</h2>
        <p>
          Links run from cause to consequence: Jesus → Catholic Church → First Crusade. A link's strength is the share
          of the consequence credited to the cause. Credit travels any number of hops, by the strongest chain, so with
          Jesus → Church at 0.8 and Church → First Crusade at 0.5, Jesus is credited with 0.8 × 0.5 = 40% of the
          First Crusade. Intent doesn't matter: harm done in a figure's name reaches the figure, and a reaction is
          credited to whatever provoked it.
        </p>
        <CreditFormula />
        <p>
          Only descendants' <em>own</em> profiles are credited, never what they in turn received, so no chain is
          counted twice. A consequence can give away at most 100% of itself across all its causes. Influence and
          mentorship links carry credit; collaboration and opposition only describe.
        </p>

        <h2 className="font-display text-ink">Tiers</h2>
        <p>
          Tiers are set from the spread of the index itself: their boundaries are the round numbers nearest the
          20th, 50th, 80th and 95th percentiles of total influence.
        </p>
        <TierTable />

        <h2 className="font-display text-ink">Under the hood</h2>
        <p>
          The credit shares are computed inside Postgres by a recursive query that walks every chain of links, stops
          at cycles, and keeps each pair's strongest chain. The same shares were cross-checked against pgRouting's
          all-pairs shortest-path algorithm, with each link costed at −ln(strength), and the two agree. The curves and
          areas are computed by a small TypeScript calculator in a Cloudflare Worker, which serves one set of scores to
          every page here and to the MCP tools that maintain the index.
        </p>
        <p>
          <Link to="/realm">See the lineage</Link> or <Link to="/">return to the index</Link>.
        </p>
      </div>
    </>
  );
}
