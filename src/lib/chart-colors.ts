/**
 * The bridge from CSS design tokens to chart props.
 *
 * Recharts needs colour *values* in JS, which is how this file previously came
 * to hold a hand-copied hex duplicate of the palette — a second source of truth
 * that would drift the moment a token changed. Every value here is now a
 * `var()` reference to the real token in `src/styles/global.css`, so there is
 * exactly one palette.
 *
 * These are consumed as inline styles and SVG presentation attributes, both of
 * which resolve `var()` natively. Do not use them anywhere that does colour
 * maths (gradient interpolation, opacity mixing) — resolve the computed value
 * first if that is ever needed.
 *
 * Canon: appliedrelevance/.kiro/steering/design-stack.md
 */

export const CHART_COLORS = {
  grid: "var(--color-line)",
  axisText: "var(--color-ink-muted)",
  axisNumbers: "var(--color-tier-minimal)",
  tooltipBg: "var(--color-surface-1)",
  tooltipBorder: "var(--color-line)",
  tooltipText: "var(--color-ink-2)",
  positiveFill: "var(--color-action)",
  negativeFill: "var(--color-crit)",
} as const;

/**
 * Categorical ramp for telling one compared entity from another. Identity, not
 * judgement — deliberately not the status palette.
 */
export const SERIES_COLORS = [
  "var(--color-series-1)",
  "var(--color-series-2)",
  "var(--color-series-3)",
  "var(--color-series-4)",
  "var(--color-series-5)",
] as const;

/** Pick a series colour by index, wrapping past the end of the ramp. */
export function seriesColor(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length];
}
