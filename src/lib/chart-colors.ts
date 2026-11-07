/**
 * The bridge from CSS design tokens to chart props.
 *
 * Charts need colour values in JS. Every value here is a `var()` reference to
 * the real token in `src/styles/global.css`, so there is exactly one palette.
 *
 * These are consumed as inline styles and SVG presentation attributes, both of
 * which resolve `var()` natively. Do not use them anywhere that does colour
 * maths (gradient interpolation, opacity mixing) — resolve the computed value
 * first if that is ever needed.
 *
 * Canon: appliedrelevance/.kiro/steering/design-stack.md
 */

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
