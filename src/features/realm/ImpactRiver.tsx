/**
 * The impact river: every entity's own influence across five thousand years.
 * Benefit stacks above the axis and harm below it, one band per entity, oldest
 * nearest the axis. Only own influence is drawn, so nothing is counted twice:
 * credit is a share of a band already on the chart.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BUCKET_COUNT, formatSpan, formatYear, unitToYear } from "@/lib/timeline";
import type { Realm, RealmEntity } from "./api";
import {
  AXIS_TEXT,
  BENEFIT,
  bucketUnit,
  formatMagnitude,
  GRID,
  HARM,
  SURFACE,
  TimeAxis,
  Tooltip,
  useWidth,
} from "./chart";

interface Layer {
  entity: RealmEntity;
  /** First and last bucket drawn, including one empty bucket either side. */
  start: number;
  end: number;
  b0: number[];
  b1: number[];
  h0: number[];
  h1: number[];
}

const MIN_WIDTH = 680;
const LABEL_LAYERS = 18;

export function ImpactRiver({ realm }: { realm: Realm }) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const navigate = useNavigate();
  const [hover, setHover] = useState<{ slug: string; px: number; py: number } | null>(null);

  const W = Math.max(width, MIN_WIDTH);
  const H = W < 900 ? 380 : 480;
  const M = { top: 18, right: 14, bottom: 30, left: 14 };
  const innerW = W - M.left - M.right;
  const half = (H - M.top - M.bottom) / 2;
  const mid = M.top + half;
  const x = (u: number) => M.left + u * innerW;

  const { layers, max } = useMemo(() => {
    const ordered = realm.entities
      .filter((e) => e.curve.benefit.length > 0)
      .sort((a, b) => (a.first_year ?? 0) - (b.first_year ?? 0) || a.name.localeCompare(b.name));
    const benefitBase = Array.from({ length: BUCKET_COUNT }, () => 0);
    const harmBase = Array.from({ length: BUCKET_COUNT }, () => 0);
    const built: Layer[] = ordered.map((entity) => {
      const { from, benefit, harm } = entity.curve;
      const start = Math.max(0, from - 1);
      const end = Math.min(BUCKET_COUNT - 1, from + benefit.length);
      const layer: Layer = { entity, start, end, b0: [], b1: [], h0: [], h1: [] };
      for (let i = start; i <= end; i++) {
        const k = i - from;
        const b = k >= 0 && k < benefit.length ? benefit[k] : 0;
        const h = k >= 0 && k < harm.length ? harm[k] : 0;
        layer.b0.push(benefitBase[i]);
        layer.h0.push(harmBase[i]);
        benefitBase[i] += b;
        harmBase[i] += h;
        layer.b1.push(benefitBase[i]);
        layer.h1.push(harmBase[i]);
      }
      return layer;
    });
    return { layers: built, max: Math.max(1, ...benefitBase, ...harmBase) };
  }, [realm]);

  // Square-root height keeps the ancient world visible beside the twentieth century.
  const yUp = (v: number) => mid - Math.sqrt(v / max) * half;
  const yDown = (v: number) => mid + Math.sqrt(v / max) * half;

  const band = (layer: Layer, lo: number[], hi: number[], y: (v: number) => number) => {
    let top = "";
    let bottom = "";
    for (let k = 0; k < hi.length; k++) {
      const px = x(bucketUnit(layer.start + k)).toFixed(1);
      top += `${k === 0 ? "M" : "L"}${px},${y(hi[k]).toFixed(1)}`;
    }
    for (let k = lo.length - 1; k >= 0; k--) {
      const px = x(bucketUnit(layer.start + k)).toFixed(1);
      bottom += `L${px},${y(lo[k]).toFixed(1)}`;
    }
    return `${top}${bottom}Z`;
  };

  // Label the largest bands where they enter the river, so the names read as a timeline.
  const labels = useMemo(() => {
    const placed: { slug: string; name: string; px: number; py: number; w: number }[] = [];
    const biggest = [...layers].sort((a, b) => b.entity.own_magnitude - a.entity.own_magnitude).slice(0, LABEL_LAYERS);
    for (const layer of biggest) {
      const thickness = (k: number, side: "benefit" | "harm") =>
        side === "benefit" ? yUp(layer.b0[k]) - yUp(layer.b1[k]) : yDown(layer.h1[k]) - yDown(layer.h0[k]);
      let peak = { t: 0, side: "benefit" as "benefit" | "harm" };
      for (let k = 0; k < layer.b1.length; k++) {
        for (const side of ["benefit", "harm"] as const) {
          const t = thickness(k, side);
          if (t > peak.t) peak = { t, side };
        }
      }
      if (peak.t < 12) continue;
      let k = 0;
      while (k < layer.b1.length - 1 && thickness(k, peak.side) < Math.max(12, peak.t * 0.7)) k++;
      const w = layer.entity.name.length * 6.6;
      const px = x(bucketUnit(layer.start + k)) + 4;
      const py =
        peak.side === "benefit"
          ? (yUp(layer.b0[k]) + yUp(layer.b1[k])) / 2
          : (yDown(layer.h0[k]) + yDown(layer.h1[k])) / 2;
      const clash = placed.some((p) => px < p.px + p.w + 8 && p.px < px + w + 8 && Math.abs(p.py - py) < 14);
      if (clash || px + w > W - M.right) continue;
      placed.push({ slug: layer.entity.slug, name: layer.entity.name, px, py, w });
    }
    return placed;
  }, [layers, W, H, max]);

  const hovered = hover ? layers.find((l) => l.entity.slug === hover.slug) : undefined;
  const hoverYear = hover ? unitToYear((hover.px - M.left) / innerW, realm.as_of_year) : 0;
  const hoverBucket = hover ? Math.min(BUCKET_COUNT - 1, Math.max(0, Math.floor(((hover.px - M.left) / innerW) * BUCKET_COUNT))) : 0;
  const levelAt = (layer: Layer | undefined, side: "benefit" | "harm") => {
    if (!layer) return 0;
    const k = layer.entity.curve.from;
    const values = layer.entity.curve[side];
    const i = hoverBucket - k;
    return i >= 0 && i < values.length ? values[i] : 0;
  };

  const open = (slug: string) => navigate({ to: "/entity/$slug", params: { slug } });

  return (
    <figure className="m-0">
      <div ref={ref} className="relative w-full overflow-x-auto">
        <div className="relative" style={{ width: W }}>
          <svg
            width={W}
            height={H}
            role="img"
            aria-label={`Impact river: the own influence of ${layers.length} entities from ${formatYear(-3200)} to ${realm.as_of_year}, benefit above the axis and harm below`}
            onPointerLeave={() => setHover(null)}
          >
            <TimeAxis asOfYear={realm.as_of_year} x={x} top={M.top} bottom={H - M.bottom} />
            {layers.map((layer) => {
              const dim = hover && hover.slug !== layer.entity.slug;
              const handlers = {
                onPointerMove: (e: React.PointerEvent) => {
                  const box = (e.currentTarget as SVGPathElement).ownerSVGElement!.getBoundingClientRect();
                  setHover({ slug: layer.entity.slug, px: e.clientX - box.left, py: e.clientY - box.top });
                },
                onClick: () => open(layer.entity.slug),
                style: { cursor: "pointer", transition: "opacity 120ms" },
                opacity: dim ? 0.3 : 0.92,
                stroke: SURFACE,
                strokeWidth: 0.6,
              };
              return (
                <g key={layer.entity.slug}>
                  <path d={band(layer, layer.b0, layer.b1, yUp)} fill={BENEFIT} {...handlers} />
                  <path d={band(layer, layer.h0, layer.h1, yDown)} fill={HARM} {...handlers} />
                </g>
              );
            })}
            <line x1={M.left} x2={W - M.right} y1={mid} y2={mid} stroke={GRID} strokeWidth={1} />
            <text x={M.left + 4} y={M.top + 12} fontSize={11} fill={AXIS_TEXT}>
              Benefit ↑
            </text>
            <text x={M.left + 4} y={H - M.bottom - 6} fontSize={11} fill={AXIS_TEXT}>
              Harm ↓
            </text>
            <g pointerEvents="none">
              {labels.map((l) => (
                <text
                  key={l.slug}
                  x={l.px}
                  y={l.py + 4}
                  fontSize={12}
                  fontWeight={600}
                  fill={SURFACE}
                  opacity={hover && hover.slug !== l.slug ? 0.35 : 1}
                >
                  {l.name}
                </text>
              ))}
            </g>
          </svg>
          {hover && hovered && (
            <Tooltip x={hover.px} y={hover.py} width={W} height={H}>
              <p className="font-semibold text-ink">{hovered.entity.name}</p>
              <p className="text-ink-muted">
                <span className="capitalize">{hovered.entity.entity_type}</span>
                {hovered.entity.first_year !== null &&
                  ` · ${formatSpan(hovered.entity.first_year, hovered.entity.last_year!, realm.as_of_year)}`}
              </p>
              <p className="mt-1.5 text-ink-muted">Around {formatYear(hoverYear)}, per year</p>
              <p className="flex justify-between">
                <span>Benefit</span>
                <span className="font-mono text-ink">{formatMagnitude(levelAt(hovered, "benefit"))}</span>
              </p>
              <p className="flex justify-between">
                <span>Harm</span>
                <span className="font-mono text-ink">{formatMagnitude(levelAt(hovered, "harm"))}</span>
              </p>
              <p className="mt-1.5 flex justify-between border-t border-line pt-1.5">
                <span>Total influence</span>
                <span className="font-mono text-ink">{formatMagnitude(hovered.entity.total_magnitude)}</span>
              </p>
            </Tooltip>
          )}
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-benefit" aria-hidden="true" />
          Benefit
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-harm" aria-hidden="true" />
          Harm
        </span>
        <span>
          One band per entity: its own influence each year. Height is on a square-root scale, time on a
          logarithmic one. Hover to identify, click to open.
        </span>
      </figcaption>
    </figure>
  );
}
