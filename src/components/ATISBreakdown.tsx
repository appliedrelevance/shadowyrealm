import type { LegacyTail, PeriodBreakdown } from "@/lib/atis-calculator";

export function ATISBreakdown({
  breakdown,
  tail,
}: {
  breakdown: PeriodBreakdown[];
  tail: LegacyTail | null;
}) {
  if (breakdown.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink-muted">
            <th className="pb-2 pr-4 font-medium">Period</th>
            <th className="pb-2 pr-4 font-medium">Years</th>
            <th className="pb-2 pr-4 font-medium">Base</th>
            <th className="pb-2 pr-4 font-medium">Consensus</th>
            <th className="pb-2 pr-4 font-medium">Network</th>
            <th className="pb-2 pr-4 font-medium">Uncertainty</th>
            <th className="pb-2 pr-4 font-medium">Level</th>
            <th className="pb-2 font-medium">Area</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((row, i) => (
            <tr key={i} className="border-b border-line/50 even:bg-surface-2/50">
              <td className="py-2 pr-4 font-medium text-ink-2">{row.period}</td>
              <td className="py-2 pr-4 font-mono text-ink-muted">{row.years}</td>
              <td className="py-2 pr-4 font-mono text-ink-muted">
                {row.baseImpact.toFixed(1)}
              </td>
              <td className="py-2 pr-4 font-mono text-ink-muted">
                ×{row.consensusWeight.toFixed(2)}
              </td>
              <td className="py-2 pr-4 font-mono text-ink-muted">
                ×{row.networkAmplification.toFixed(2)}
              </td>
              <td className="py-2 pr-4 font-mono text-ink-muted">
                ×{row.uncertaintyFactor.toFixed(2)}
              </td>
              <td className="py-2 pr-4 font-mono text-ink-muted">
                {row.level.toFixed(1)}
              </td>
              <td className="py-2 font-mono font-bold text-ink">
                {row.area.toFixed(1)}
              </td>
            </tr>
          ))}
          {tail && (
            <tr className="border-b border-line/50 even:bg-surface-2/50">
              <td className="py-2 pr-4 font-medium text-ink-2">
                Legacy after {tail.from_year - 1}
              </td>
              <td className="py-2 pr-4 font-mono text-ink-muted">{tail.years}</td>
              <td className="py-2 pr-4" colSpan={4} />
              <td className="py-2 pr-4 font-mono text-ink-muted">
                {tail.level_at_as_of.toFixed(1)}
              </td>
              <td className="py-2 font-mono font-bold text-ink">
                {tail.area.toFixed(1)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
