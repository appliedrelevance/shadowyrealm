import { cn } from "@/lib/utils";
import type { ATISTier } from "@/lib/atis-calculator";

const tierStyles: Record<ATISTier, string> = {
  minimal: "border-tier-minimal bg-tier-minimal/20 text-tier-minimal",
  moderate: "border-tier-moderate bg-tier-moderate/20 text-tier-moderate",
  significant: "border-tier-significant bg-tier-significant/20 text-tier-significant",
  transformational: "border-tier-transformational bg-tier-transformational/20 text-tier-transformational",
  legendary: "border-tier-legendary bg-tier-legendary/20 text-tier-legendary shadow-lg shadow-tier-legendary/30",
};

const negativeStyle = "border-crit bg-crit/20 text-crit";

interface MagnitudeBadgeProps {
  tier: ATISTier;
  magnitude: number;
  isNegative?: boolean;
  className?: string;
}

export function MagnitudeBadge({ tier, magnitude, isNegative, className }: MagnitudeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-sm font-semibold uppercase tracking-wider",
        isNegative ? negativeStyle : tierStyles[tier],
        className,
      )}
    >
      <span>{tier}</span>
      <span className="font-mono text-xs opacity-75">
        {magnitude.toFixed(0)}
      </span>
    </span>
  );
}
