import { cn } from "@/lib/utils";
import { tierLabel, type ATISTier } from "@/lib/atis-calculator";

const tierStyles: Record<ATISTier, string> = {
  minimal: "border-tier-minimal bg-tier-minimal/20 text-ink-2",
  moderate: "border-tier-moderate bg-tier-moderate/20 text-ink-2",
  significant: "border-tier-significant bg-tier-significant/20 text-ink-2",
  transformational: "border-tier-transformational bg-tier-transformational/20 text-ink-2",
  legendary: "border-tier-legendary bg-tier-legendary/20 text-ink shadow-lg shadow-tier-legendary/30",
};

interface MagnitudeBadgeProps {
  tier: ATISTier;
  magnitude: number;
  showMagnitude?: boolean;
  className?: string;
}

/** The tier as a labelled pill; the tier colour is identity only, so the text stays in ink. */
export function MagnitudeBadge({ tier, magnitude, showMagnitude = true, className }: MagnitudeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-display text-xs font-semibold uppercase tracking-wider",
        tierStyles[tier],
        className,
      )}
    >
      <span>{tierLabel(tier)}</span>
      {showMagnitude && <span className="font-mono opacity-75">{Math.round(magnitude).toLocaleString("en-US")}</span>}
    </span>
  );
}
