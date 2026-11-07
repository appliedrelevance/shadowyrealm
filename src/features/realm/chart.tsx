/**
 * Pieces every ShadowyRealm chart shares: the time axis, the benefit and harm
 * colours, the hatch that marks credited impact, number formats and a width
 * hook. Colours are token references, resolved by SVG at paint time.
 */
import { useEffect, useRef, useState } from "react";
import { BUCKET_COUNT, formatYear, TIMELINE_TICKS, yearToUnit } from "@/lib/timeline";

export const BENEFIT = "var(--color-benefit)";
export const HARM = "var(--color-harm)";
export const GRID = "var(--color-line)";
export const AXIS_TEXT = "var(--color-ink-muted)";
export const SURFACE = "var(--color-surface)";

/** Centre of bucket i on the 0–1 axis. */
export function bucketUnit(i: number): number {
  return (i + 0.5) / BUCKET_COUNT;
}

/** 1,284 · 12.9K · 3.4M */
export function formatMagnitude(n: number): string {
  const abs = Math.abs(n);
  if (abs < 0.005) return "0";
  if (abs >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e4) return `${(n / 1e3).toFixed(1)}K`;
  if (abs >= 100) return Math.round(n).toLocaleString("en-US");
  if (abs >= 10) return n.toFixed(1);
  return n.toFixed(2);
}

/** Width of an element, kept current as it resizes. */
export function useWidth<T extends HTMLElement>(initial = 800) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(1, Math.round(entry.contentRect.width))));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

/** Diagonal hatch for credited impact: the same hue as the own part, inked at 45°. */
export function HatchDefs({ id, color }: { id: string; color: string }) {
  return (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={color} opacity="0.28" />
      <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="2.5" />
    </pattern>
  );
}

/** Vertical hairlines and year labels for the ticks that fall inside [fromUnit, toUnit]. */
export function TimeAxis({
  asOfYear,
  x,
  fromUnit = 0,
  toUnit = 1,
  top,
  bottom,
  minSpacing = 44,
}: {
  asOfYear: number;
  x: (unit: number) => number;
  fromUnit?: number;
  toUnit?: number;
  top: number;
  bottom: number;
  minSpacing?: number;
}) {
  const ticks: { year: number; px: number }[] = [];
  for (const year of TIMELINE_TICKS) {
    const u = yearToUnit(year, asOfYear);
    if (u < fromUnit || u > toUnit) continue;
    const px = x(u);
    if (ticks.length > 0 && px - ticks[ticks.length - 1].px < minSpacing) continue;
    ticks.push({ year, px });
  }
  return (
    <g aria-hidden="true">
      {ticks.map((t) => (
        <g key={t.year}>
          <line x1={t.px} x2={t.px} y1={top} y2={bottom} stroke={GRID} strokeWidth={1} />
          <text x={t.px} y={bottom + 16} textAnchor="middle" fontSize={11} fill={AXIS_TEXT}>
            {formatYear(t.year)}
          </text>
        </g>
      ))}
    </g>
  );
}

/** A floating readout placed inside its chart's box. */
export function Tooltip({ x, y, width, children }: { x: number; y: number; width: number; children: React.ReactNode }) {
  const left = Math.min(Math.max(x + 14, 4), width - 236);
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 w-56 rounded-md border border-line bg-surface-1 px-3 py-2 text-xs text-ink-2 shadow-lg shadow-surface"
      style={{ left, top: Math.max(y - 12, 0) }}
    >
      {children}
    </div>
  );
}

/** A short coloured stroke keying a tooltip row to its series. */
export function LineKey({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <svg width="14" height="8" aria-hidden="true" className="shrink-0">
      <line x1="1" y1="4" x2="13" y2="4" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? "3 2" : undefined} />
    </svg>
  );
}
