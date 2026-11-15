/**
 * The methodology tables every site shows, built from its config: the
 * dimensions and weights, the rubrics Clef scores against, the persistence
 * time constants, the link types and the tiers.
 */
import { describeEnds } from "@/sites";
import { formatMagnitude } from "@/features/realm/chart";
import { SITE } from "@/lib/site";

export function DimensionTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Dimension</th>
          <th>What it covers</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {SITE.scoring.dimensions.map((d) => (
          <tr key={d.key}>
            <td>{d.label}</td>
            <td>{d.meaning}</td>
            <td>{d.weight}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function RubricTable({ title, levels, from, scale }: { title: string; levels: readonly string[]; from: number; scale?: boolean }) {
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

export function IntensityTable() {
  return <RubricTable title="Benefit and harm intensity" levels={SITE.scoring.rubrics.intensity} from={0} scale />;
}

export function ReachTable() {
  return <RubricTable title="Reach" levels={SITE.scoring.rubrics.reach} from={1} />;
}

export function PersistenceTable() {
  const { persistence, persistenceTimeConstants } = SITE.scoring.rubrics;
  return (
    <table>
      <thead>
        <tr>
          <th>Persistence</th>
          <th>Clef's description</th>
          <th>Years to fall to 37%</th>
        </tr>
      </thead>
      <tbody>
        {persistenceTimeConstants.map((years, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{persistence[i]}</td>
            <td>{Number.isFinite(years) ? `${years.toLocaleString("en-US")} years` : "Never fades"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function LinkTypeTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Link</th>
          <th>From → to</th>
          <th>Carries credit</th>
        </tr>
      </thead>
      <tbody>
        {SITE.linkTypes.map((t) => (
          <tr key={t.key}>
            <td>{t.labels.consequence}</td>
            <td>
              {describeEnds(t.from)} → {describeEnds(t.to)}
            </td>
            <td>{t.credit ? "Yes" : "No, it only describes"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A tier boundary is a round number, so it is shown without the trailing zeros a score's precision needs. */
const boundary = (n: number) => formatMagnitude(n).replace(/\.0+$/, "");

export function TierTable() {
  const tiers = SITE.scoring.tiers;
  if (!tiers) return <p>Tiers are set from the spread of the first full scoring run, which has not been made yet.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>Tier</th>
          <th>Total influence</th>
          <th>Meaning</th>
        </tr>
      </thead>
      <tbody>
        {tiers.map((t, i) => (
          <tr key={t.tier}>
            <td>{t.label}</td>
            <td>
              {boundary(t.min)}
              {i + 1 < tiers.length ? `–${boundary(tiers[i + 1].min)}` : "+"}
            </td>
            <td>{t.descriptor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function LevelFormula() {
  return (
    <div className="not-prose rounded-lg border border-line bg-surface-1 p-4 font-mono text-action-ink">
      {SITE.scoring.breadth === "people" ? (
        <>
          <div>level = dimension weight × depth (0–10) × 3 × (reach ÷ 5)^1.8</div>
          <div>reach = 10 + log₁₀(people affected ÷ people alive)</div>
        </>
      ) : (
        "level = dimension weight × assessed value (0–10) × reach multiplier"
      )}
    </div>
  );
}

export function CreditFormula() {
  return (
    <div className="not-prose rounded-lg border border-line bg-surface-1 p-4 font-mono text-action-ink">
      total = own + Σ share × each descendant's own
    </div>
  );
}
