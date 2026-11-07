/**
 * The profile page's two charts: one entity's influence curve over time, and
 * its ten-number profile. Both split own impact (solid) from impact credited
 * from its consequences (hatched).
 */
import { useId, useMemo, useState } from "react";
import { area, curveMonotoneX } from "d3-shape";
import { DIMENSIONS, type Dimension } from "@/lib/atis-calculator";
import { BUCKET_COUNT, formatYear, unitToYear } from "@/lib/timeline";
import type { EntityProfile } from "./api";
import {
  AXIS_TEXT,
  BENEFIT,
  bucketUnit,
  formatMagnitude,
  GRID,
  HARM,
  HatchDefs,
  LineKey,
  TimeAxis,
  Tooltip,
  useWidth,
} from "./chart";

export const DIMENSION_LABELS: Record<Dimension, string> = {
  scientific: "Scientific",
  economic: "Economic",
  human_rights: "Human rights",
  health: "Health",
  cultural: "Cultural",
};

function Legend() {
  const swatch = (color: string, hatched: boolean) => (
    <span
      className="inline-block h-2.5 w-4 rounded-sm"
      aria-hidden="true"
      style={{
        background: hatched ? `repeating-linear-gradient(45deg, ${color} 0 2px, transparent 2px 5px)` : color,
        boxShadow: hatched ? `inset 0 0 0 1px ${color}` : undefined,
      }}
    />
  );
  return (
    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
      <span className="flex items-center gap-1.5">{swatch(BENEFIT, false)}Own benefit</span>
      <span className="flex items-center gap-1.5">{swatch(BENEFIT, true)}Credited benefit</span>
      <span className="flex items-center gap-1.5">{swatch(HARM, false)}Own harm</span>
      <span className="flex items-center gap-1.5">{swatch(HARM, true)}Credited harm</span>
    </p>
  );
}

export function InfluenceCurve({ profile }: { profile: EntityProfile }) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const hatch = useId().replace(/:/g, "");
  const [hover, setHover] = useState<{ k: number; px: number; py: number } | null>(null);
  const { from, own, credited } = profile.curves;
  const len = own.benefit.length;

  const W = Math.max(width, 300);
  const H = 300;
  const M = { top: 14, right: 10, bottom: 28, left: 10 };
  const fromUnit = from / BUCKET_COUNT;
  const toUnit = (from + len) / BUCKET_COUNT;
  const x = (u: number) => M.left + ((u - fromUnit) / (toUnit - fromUnit || 1)) * (W - M.left - M.right);
  const half = (H - M.top - M.bottom) / 2;
  const mid = M.top + half;

  const rows = useMemo(
    () =>
      Array.from({ length: len }, (_, k) => ({
        k,
        ob: own.benefit[k],
        cb: credited.benefit[k],
        oh: own.harm[k],
        ch: credited.harm[k],
      })),
    [own, credited, len],
  );
  const max = Math.max(1e-9, ...rows.map((r) => Math.max(r.ob + r.cb, r.oh + r.ch)));
  const y = (v: number) => mid - (v / max) * half;
  const px = (k: number) => x(bucketUnit(from + k));

  const shape = (lo: (r: (typeof rows)[number]) => number, hi: (r: (typeof rows)[number]) => number) =>
    area<(typeof rows)[number]>()
      .x((r) => px(r.k))
      .y0((r) => y(lo(r)))
      .y1((r) => y(hi(r)))
      .curve(curveMonotoneX)(rows) ?? "";

  if (len === 0) return <p className="text-sm text-ink-muted">No scored periods yet.</p>;

  const row = hover ? rows[hover.k] : null;
  const yearOf = (k: number) => unitToYear(bucketUnit(from + k), profile.as_of_year);

  return (
    <figure className="m-0">
      <div ref={ref} className="relative w-full">
        <svg
          width={W}
          height={H}
          role="img"
          aria-label={`${profile.entity.name}'s influence over time: own and credited benefit above the axis, harm below`}
          onPointerMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const mx = e.clientX - box.left;
            let best = 0;
            for (let k = 1; k < len; k++) if (Math.abs(px(k) - mx) < Math.abs(px(best) - mx)) best = k;
            setHover({ k: best, px: px(best), py: e.clientY - box.top });
          }}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <HatchDefs id={`${hatch}-b`} color={BENEFIT} />
            <HatchDefs id={`${hatch}-h`} color={HARM} />
          </defs>
          <TimeAxis
            asOfYear={profile.as_of_year}
            x={x}
            fromUnit={fromUnit}
            toUnit={toUnit}
            top={M.top}
            bottom={H - M.bottom}
          />
          <path d={shape(() => 0, (r) => r.ob)} fill={BENEFIT} />
          <path d={shape((r) => r.ob, (r) => r.ob + r.cb)} fill={`url(#${hatch}-b)`} />
          <path d={shape(() => 0, (r) => -r.oh)} fill={HARM} />
          <path d={shape((r) => -r.oh, (r) => -(r.oh + r.ch))} fill={`url(#${hatch}-h)`} />
          <line x1={M.left} x2={W - M.right} y1={mid} y2={mid} stroke={GRID} />
          <text x={M.left + 4} y={M.top + 12} fontSize={11} fill={AXIS_TEXT}>
            Benefit ↑
          </text>
          <text x={M.left + 4} y={H - M.bottom - 6} fontSize={11} fill={AXIS_TEXT}>
            Harm ↓
          </text>
          {hover && <line x1={hover.px} x2={hover.px} y1={M.top} y2={H - M.bottom} stroke="var(--color-ink-muted)" />}
        </svg>
        {hover && row && (
          <Tooltip x={hover.px} y={hover.py} width={W} height={H}>
            <p className="mb-1 text-ink-muted">Around {formatYear(yearOf(hover.k))}, per year</p>
            {[
              { label: "Own benefit", value: row.ob, color: BENEFIT, dashed: false },
              { label: "Credited benefit", value: row.cb, color: BENEFIT, dashed: true },
              { label: "Own harm", value: row.oh, color: HARM, dashed: false },
              { label: "Credited harm", value: row.ch, color: HARM, dashed: true },
            ].map((r) => (
              <p key={r.label} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <LineKey color={r.color} dashed={r.dashed} />
                  {r.label}
                </span>
                <span className="font-mono text-ink">{formatMagnitude(r.value)}</span>
              </p>
            ))}
          </Tooltip>
        )}
      </div>
      <Legend />
    </figure>
  );
}

export function ProfileBars({ profile }: { profile: EntityProfile }) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const hatch = useId().replace(/:/g, "");
  const { own, credited } = profile.score.profile;
  const W = Math.max(width, 300);
  const labelW = 96;
  const valueW = 52;
  const rowH = 36;
  const bar = 16;
  const H = DIMENSIONS.length * rowH + 8;
  const center = labelW + (W - labelW) / 2;
  const reachPx = (W - labelW) / 2 - valueW;
  const max = Math.max(
    1e-9,
    ...DIMENSIONS.flatMap((d) => [own.benefit[d] + credited.benefit[d], own.harm[d] + credited.harm[d]]),
  );
  const len = (v: number) => (v / max) * reachPx;

  return (
    <figure className="m-0">
      <div ref={ref} className="w-full">
        <svg width={W} height={H} role="img" aria-label={`${profile.entity.name}'s ten-number impact profile`}>
          <defs>
            <HatchDefs id={`${hatch}-b`} color={BENEFIT} />
            <HatchDefs id={`${hatch}-h`} color={HARM} />
          </defs>
          <line x1={center} x2={center} y1={0} y2={H} stroke={GRID} />
          {DIMENSIONS.map((d, i) => {
            const cy = 4 + i * rowH + rowH / 2;
            const ob = len(own.benefit[d]);
            const cb = len(credited.benefit[d]);
            const oh = len(own.harm[d]);
            const ch = len(credited.harm[d]);
            const benefitTotal = own.benefit[d] + credited.benefit[d];
            const harmTotal = own.harm[d] + credited.harm[d];
            return (
              <g key={d}>
                <title>
                  {`${DIMENSION_LABELS[d]}: benefit ${formatMagnitude(benefitTotal)} (own ${formatMagnitude(own.benefit[d])}), harm ${formatMagnitude(harmTotal)} (own ${formatMagnitude(own.harm[d])})`}
                </title>
                <text x={0} y={cy + 4} fontSize={12} fill="var(--color-ink-2)">
                  {DIMENSION_LABELS[d]}
                </text>
                <rect x={center + 1} y={cy - bar / 2} width={ob} height={bar} fill={BENEFIT} />
                <rect x={center + 1 + ob} y={cy - bar / 2} width={cb} height={bar} fill={`url(#${hatch}-b)`} rx={0} />
                <rect x={center - 1 - oh} y={cy - bar / 2} width={oh} height={bar} fill={HARM} />
                <rect x={center - 1 - oh - ch} y={cy - bar / 2} width={ch} height={bar} fill={`url(#${hatch}-h)`} />
                <text x={center + 6 + ob + cb} y={cy + 4} fontSize={11} fill="var(--color-ink-2)" className="font-mono">
                  {formatMagnitude(benefitTotal)}
                </text>
                <text x={center - 6 - oh - ch} y={cy + 4} fontSize={11} fill="var(--color-ink-2)" textAnchor="end" className="font-mono">
                  {formatMagnitude(harmTotal)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 flex justify-between text-xs text-ink-muted" style={{ paddingLeft: labelW }}>
        <span>← Harm</span>
        <span>Benefit →</span>
      </p>
      <Legend />
    </figure>
  );
}
