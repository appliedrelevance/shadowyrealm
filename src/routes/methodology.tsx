import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DIMENSION_WEIGHTS,
  DIMENSIONS,
  PERSISTENCE_TIME_CONSTANTS,
  TIER_THRESHOLDS,
} from "@/lib/atis-calculator";
import { INTENSITY_LEVELS, PERSISTENCE_LEVELS, REACH_LEVELS } from "@/lib/clef";
import { DIMENSION_LABELS } from "@/features/realm/ProfileCharts";
import { COPY } from "@/lib/copy";
import { usePageTitle } from "@/lib/usePageTitle";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
});

const DIMENSION_MEANING: Record<(typeof DIMENSIONS)[number], string> = {
  scientific: "Knowledge, research and technology",
  economic: "Prosperity, livelihoods and opportunity",
  human_rights: "Freedom, dignity, safety and equal treatment",
  health: "Physical and mental health, and survival",
  cultural: "Art, education, shared culture and cohesion",
};

function MethodologyPage() {
  usePageTitle(COPY.methodology.heading);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-ink">{COPY.methodology.heading}</h1>
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
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>What it covers</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((d) => (
              <tr key={d}>
                <td>{DIMENSION_LABELS[d]}</td>
                <td>{DIMENSION_MEANING[d]}</td>
                <td>{DIMENSION_WEIGHTS[d]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Whether an entity really existed plays no part. Santa Claus, Harry Potter and Sherlock Holmes are scored on
          what the idea of them did, like the Catholic Church or the Cold War.
        </p>

        <h2 className="font-display text-ink">Periods and the influence curve</h2>
        <p>
          An entity's direct activity is divided into periods: a ministry, a reign, a war, a company's platform era.
          Within a period each of the ten numbers has a level per year:
        </p>
        <div className="not-prose rounded-lg border border-line bg-surface-1 p-4 font-mono text-action-ink">
          level = dimension weight × assessed value (0–10) × reach multiplier
        </div>
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
        <RubricTable title="Benefit and harm intensity" levels={INTENSITY_LEVELS} from={0} scale />
        <RubricTable title="Reach" levels={REACH_LEVELS} from={1} />

        <h2 className="font-display text-ink">Persistence and the fading tail</h2>
        <p>
          When an entity's last period ends, its influence fades exponentially at a rate set by the period's
          persistence: the number of years for its level to fall to 37% (1/e) of where it was.
        </p>
        <table>
          <thead>
            <tr>
              <th>Persistence</th>
              <th>Clef's description</th>
              <th>Years to fall to 37%</th>
            </tr>
          </thead>
          <tbody>
            {PERSISTENCE_TIME_CONSTANTS.map((years, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{PERSISTENCE_LEVELS[i]}</td>
                <td>{Number.isFinite(years) ? `${years.toLocaleString("en-US")} years` : "Never fades"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          An entity whose legacy is carried by its consequences gets <strong>no tail</strong>. Jesus's ministry lasted
          three years; his legacy is the Church, and it reaches him as credit rather than as a tail on top of it,
          which would count it twice.
        </p>

        <h2 className="font-display text-ink">Credit flows from consequence to cause</h2>
        <p>
          Links run from cause to consequence: Jesus → Catholic Church → First Crusade. A link's strength is the share
          of the consequence credited to the cause. Credit travels any number of hops, by the strongest chain, so with
          Jesus → Church at 0.8 and Church → First Crusade at 0.5, Jesus is credited with 0.8 × 0.5 = 40% of the
          First Crusade. Intent doesn't matter: harm done in a figure's name reaches the figure, and a reaction is
          credited to whatever provoked it.
        </p>
        <div className="not-prose rounded-lg border border-line bg-surface-1 p-4 font-mono text-action-ink">
          total = own + Σ share × each descendant's own
        </div>
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
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Total influence</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {TIER_THRESHOLDS.map((t, i) => (
              <tr key={t.tier}>
                <td>{t.label}</td>
                <td>
                  {t.min.toLocaleString("en-US")}
                  {i + 1 < TIER_THRESHOLDS.length ? `–${TIER_THRESHOLDS[i + 1].min.toLocaleString("en-US")}` : "+"}
                </td>
                <td>{t.descriptor}</td>
              </tr>
            ))}
          </tbody>
        </table>

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
    </div>
  );
}

function RubricTable({ title, levels, from, scale }: { title: string; levels: string[]; from: number; scale?: boolean }) {
  return (
    <table>
      <thead>
        <tr>
          <th>{title}</th>
          <th>Clef's level</th>
        </tr>
      </thead>
      <tbody>
        {levels.map((label, i) => (
          <tr key={label}>
            <td>{scale ? ((i * 10) / 9).toFixed(1) : i + from}</td>
            <td>{label}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
