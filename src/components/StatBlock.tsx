import { cn } from "@/lib/utils";
import type { DimensionalScores } from "@/lib/atis-calculator";

const DIMENSIONS: { key: keyof DimensionalScores; label: string }[] = [
  { key: "scientific", label: "SCI" },
  { key: "economic", label: "ECO" },
  { key: "human_rights", label: "HUM" },
  { key: "health", label: "HLT" },
  { key: "cultural", label: "CUL" },
];

export function StatBlock({ scores }: { scores: DimensionalScores }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {DIMENSIONS.map((dim) => {
        const value = scores[dim.key];
        const rounded = Math.round(value * 10) / 10;
        return (
          <div
            key={dim.key}
            className="flex flex-col items-center rounded border border-realm-border bg-realm-surface-raised p-2"
          >
            <span className="text-xs font-medium text-text-muted">
              {dim.label}
            </span>
            <span
              className={cn(
                "mt-1 font-mono text-xl font-bold",
                rounded > 0
                  ? "text-spectral-green"
                  : rounded < 0
                    ? "text-blood-red"
                    : "text-text-muted",
              )}
            >
              {rounded > 0 ? "+" : ""}
              {rounded}
            </span>
          </div>
        );
      })}
    </div>
  );
}
