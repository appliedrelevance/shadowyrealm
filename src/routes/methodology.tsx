import { createFileRoute } from "@tanstack/react-router";
import { DIMENSION_WEIGHTS, TIER_THRESHOLDS, DEFAULT_ATIS_CONFIG } from "@/lib/atis-calculator";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
});

function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-text-bright">
        Tome of Impact
      </h1>
      <p className="mt-4 text-text-muted">
        The Advanced Temporal Impact Scoring (ATIS) methodology — transparent,
        reproducible, and designed for historical fairness.
      </p>

      <div className="prose prose-invert mt-8 max-w-none">
        <h2 className="font-display text-text-bright">The Formula</h2>
        <div className="rounded-lg border border-realm-border bg-realm-surface p-4 font-mono text-lg text-arcane-purple-light">
          I<sub>final</sub> = I<sub>base</sub> × D<sub>temporal</sub> × C<sub>consensus</sub> × N<sub>network</sub> × U<sub>uncertainty</sub>
        </div>

        <h2 className="font-display text-text-bright">Dimensional Scoring</h2>
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

        <h2 className="font-display text-text-bright">Base Impact (I<sub>base</sub>)</h2>
        <p>
          The weighted dimensional score is multiplied by reach and persistence
          factors (1-10 each), using power scaling to create truly unbounded
          scores for legendary figures.
        </p>
        <p className="text-sm text-text-muted">
          Extraordinary achievement bonus: scores beyond ±10 receive a power-law
          multiplier of (|score|/10)<sup>1.2</sup>.
        </p>

        <h2 className="font-display text-text-bright">Temporal Decay (D<sub>temporal</sub>)</h2>
        <p>
          Impact decays over time using a {DEFAULT_ATIS_CONFIG.temporalDecayShape} curve
          with rate {DEFAULT_ATIS_CONFIG.temporalDecayRate}. Logarithmic decay maintains a
          floor value (~30%) to preserve the lasting significance of historical figures.
        </p>

        <h2 className="font-display text-text-bright">Consensus Weight (C<sub>consensus</sub>)</h2>
        <p>
          High controversy ({">"} 0.7) applies a {DEFAULT_ATIS_CONFIG.controversyPenalty}× penalty.
          High consensus ({">"} 0.8) applies a {DEFAULT_ATIS_CONFIG.consensusBonus}× bonus.
        </p>

        <h2 className="font-display text-text-bright">Network Amplification (N<sub>network</sub>)</h2>
        <p>
          Entity relationships (mentorship, collaboration, influence, opposition)
          amplify or reduce impact. Mentorships amplify at 1.3×, collaborations at
          1.2×, influence at 1.1×, opposition reduces at 0.9×. Capped at {DEFAULT_ATIS_CONFIG.maxNetworkAmplification}×.
        </p>

        <h2 className="font-display text-text-bright">Uncertainty Factor (U<sub>uncertainty</sub>)</h2>
        <p>
          Low confidence or incomplete data reduces the score. Floor value
          of {DEFAULT_ATIS_CONFIG.uncertaintyPenalty} prevents excessive penalization.
        </p>

        <h2 className="font-display text-text-bright">Magnitude Tiers</h2>
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

        <h2 className="font-display text-text-bright">AI Content</h2>
        <p>
          AI-generated content is always marked with a visible badge. AI suggestions
          are editable drafts requiring explicit human confirmation. Bias warnings
          are surfaced for every AI-assisted assessment.
        </p>
      </div>
    </div>
  );
}
