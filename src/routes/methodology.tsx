import { createFileRoute } from "@tanstack/react-router";
import { DIMENSION_WEIGHTS, TIER_THRESHOLDS, DEFAULT_ATIS_CONFIG } from "@/lib/atis-calculator";
import { COPY } from "@/lib/copy";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
});

function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-ink">
        {COPY.methodology.heading}
      </h1>
      <p className="mt-4 text-ink-muted">
        The Advanced Temporal Impact Scoring (ATIS) methodology — transparent,
        reproducible, and designed for historical fairness.
      </p>

      <div className="prose prose-invert mt-8 max-w-none">
        <h2 className="font-display text-ink">The Formula</h2>
        <div className="rounded-lg border border-line bg-surface-1 p-4 font-mono text-lg text-action-ink">
          <div>
            Level = I<sub>base</sub> × C<sub>consensus</sub> × N<sub>network</sub> × U<sub>uncertainty</sub>
          </div>
          <div className="mt-2">
            Score = area under the level curve, in influence-centuries
          </div>
        </div>

        <h2 className="font-display text-ink">Dimensional Scoring</h2>
        <p>
          Every entity is scored across five dimensions on a scale of -10 (devastating)
          to +10 (transformative). Each score requires a written justification.
        </p>
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Weight</th>
              <th>Rationale</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Scientific</td><td>{DIMENSION_WEIGHTS.scientific}</td><td>Advances or setbacks in knowledge</td></tr>
            <tr><td>Economic</td><td>{DIMENSION_WEIGHTS.economic}</td><td>Wealth creation or destruction</td></tr>
            <tr><td>Human Rights</td><td>{DIMENSION_WEIGHTS.human_rights}</td><td>Weighted highest — human dignity matters most</td></tr>
            <tr><td>Health</td><td>{DIMENSION_WEIGHTS.health}</td><td>Impact on human health and wellbeing</td></tr>
            <tr><td>Cultural</td><td>{DIMENSION_WEIGHTS.cultural}</td><td>Influence on arts, values, and society</td></tr>
          </tbody>
        </table>

        <h2 className="font-display text-ink">Base Impact (I<sub>base</sub>)</h2>
        <p>
          The weighted dimensional score is multiplied by a reach factor (1-10),
          using power scaling so that figures with global reach stand well apart
          from local ones. How long an impact lasts is not a multiplier: it is
          what the influence curve below records.
        </p>
        <p className="text-sm text-ink-muted">
          Extraordinary achievement bonus: scores beyond ±10 receive a power-law
          multiplier of (|score|/10)<sup>1.2</sup>.
        </p>

        <h2 className="font-display text-ink">The Influence Curve</h2>
        <p>
          Every assessment belongs to one period: a window of years with its own
          reach and its own level of impact. Laid end to end, the periods are the
          curve of an entity's influence over time. A legacy that grows after
          death is simply a run of later periods with a higher level, and a
          legacy that fades is a run with a lower one. The score is the area
          under the curve up to the present, in influence-centuries (level ×
          years ÷ 100). It has no ceiling: it grows with duration.
        </p>
        <p className="text-sm text-ink-muted">
          Several assessments of the same period are averaged, not added.
          Periods that overlap add. Years between periods count for nothing.
          Assessments that are not attached to a period are not counted.
        </p>
        <p>
          When the last period ends before the present, its level fades from
          there. The persistence factor sets how fast, as the time in years for
          the legacy to fall to 1/e of its level:
        </p>
        <table>
          <thead>
            <tr><th>Persistence</th><th>Time constant</th></tr>
          </thead>
          <tbody>
            {DEFAULT_ATIS_CONFIG.persistenceTimeConstants.map((years, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{Number.isFinite(years) ? `${years} years` : "never fades"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="font-display text-ink">Consensus Weight (C<sub>consensus</sub>)</h2>
        <p>
          High controversy ({">"} 0.7) applies a {DEFAULT_ATIS_CONFIG.controversyPenalty}× penalty.
          High consensus ({">"} 0.8) applies a {DEFAULT_ATIS_CONFIG.consensusBonus}× bonus.
        </p>

        <h2 className="font-display text-ink">Network Amplification (N<sub>network</sub>)</h2>
        <p>
          Entity relationships (mentorship, collaboration, influence, opposition)
          amplify or reduce impact. Mentorships amplify at 1.3×, collaborations at
          1.2×, influence at 1.1×, opposition reduces at 0.9×. Capped at {DEFAULT_ATIS_CONFIG.maxNetworkAmplification}×.
        </p>

        <h2 className="font-display text-ink">Uncertainty Factor (U<sub>uncertainty</sub>)</h2>
        <p>
          Low confidence or incomplete data reduces the score. Floor value
          of {DEFAULT_ATIS_CONFIG.uncertaintyPenalty} prevents excessive penalization.
        </p>

        <h2 className="font-display text-ink">Magnitude Tiers</h2>
        <p className="text-sm text-ink-muted">
          Ranges are in influence-centuries. They have not yet been re-anchored
          to the influence-curve score.
        </p>
        <table>
          <thead>
            <tr><th>Tier</th><th>Range</th><th>Description</th></tr>
          </thead>
          <tbody>
            {TIER_THRESHOLDS.map((t) => (
              <tr key={t.tier}>
                <td className="capitalize">{t.tier}</td>
                <td>{t.min} – {t.max === Infinity ? "∞" : t.max}</td>
                <td>
                  {t.tier === "minimal" && "Limited local impact"}
                  {t.tier === "moderate" && "Regional or specialized impact"}
                  {t.tier === "significant" && "National or cross-domain impact"}
                  {t.tier === "transformational" && "Global or epoch-defining impact"}
                  {t.tier === "legendary" && "Civilization-altering impact"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="font-display text-ink">AI Content</h2>
        <p>
          AI-generated content is always marked with a visible badge. AI suggestions
          are editable drafts requiring explicit human confirmation. Bias warnings
          are surfaced for every AI-assisted assessment.
        </p>
      </div>
    </div>
  );
}
