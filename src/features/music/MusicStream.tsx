/**
 * The music stream: Wikipedia's vital articles in music, scored offline by Clef and frozen in
 * public/shadowyrealm/data/music-vital.json (tools/music-snapshot.ts). One band per entity, its own
 * influence, centred on the axis with no meaning above or below it. Hue is the genre family and
 * shade the list's section within it. The outline is the square root of each moment's total, as on
 * the impact river, and inside a moment each band keeps its true share. Families stack in the
 * palette's slot order, sections in the list's order and entries by start year, so each section
 * reads as one block, named where it is thick enough.
 */
import { memo, useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FAMILY_COLORS } from "@/lib/chart-colors";
import { formatSpan, formatYear, unitToYear } from "@/lib/timeline";
import type { Timeline } from "@/sites/types";
import { formatMagnitude, TimeAxis, Tooltip, useWidth } from "@/features/realm/chart";

export interface MusicEntity {
  name: string;
  type: string;
  /** Index into the snapshot's families. */
  family: number;
  /** Index into that family's shades. */
  shade: number;
  first_year: number;
  last_year: number;
  own_magnitude: number;
  /** English Wikipedia title of the article Clef read. */
  wiki: string;
  /** First bucket of the curve. */
  from: number;
  values: number[];
}

export interface MusicSnapshot {
  as_of_year: number;
  timeline: Timeline;
  dimensions: string[];
  families: { name: string; shades: string[] }[];
  entities: MusicEntity[];
}

const SNAPSHOT_PATH = "/data/music-vital.json";

export function useMusicSnapshot() {
  return useQuery({
    queryKey: ["music-snapshot"],
    queryFn: async () => {
      const response = await fetch(SNAPSHOT_PATH);
      if (!response.ok) throw new Error(`GET ${SNAPSHOT_PATH} failed: HTTP ${response.status}`);
      return (await response.json()) as MusicSnapshot;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function familyColor(family: number): string {
  const color = FAMILY_COLORS[family];
  if (!color) throw new Error(`No palette slot for family ${family}; the palette has ${FAMILY_COLORS.length}`);
  return color;
}

/** A section's shade: its family's hue mixed toward the chart ground (first) or ink (last), in even steps. */
export function shadeColor(family: number, shade: number, shades: number): string {
  const t = shades === 1 ? 0 : -0.32 + (0.64 * shade) / (shades - 1);
  const percent = Math.round(Math.abs(t) * 100);
  if (percent === 0) return familyColor(family);
  const toward = t < 0 ? "var(--color-surface-1)" : "var(--color-ink)";
  return `color-mix(in srgb, ${familyColor(family)}, ${toward} ${percent}%)`;
}

export function wikipediaUrl(title: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_")).replace(/%2F/g, "/")}`;
}

const valueAt = (e: MusicEntity, bucket: number) => {
  const k = bucket - e.from;
  return k >= 0 && k < e.values.length ? e.values[k] : 0;
};

/** Each entity's whole drawn area: the sum of its curve. */
export const drawnArea = (e: MusicEntity) => e.values.reduce((s, v) => s + v, 0);

const MIN_WIDTH = 680;
const LABEL_MIN_THICKNESS = 13;

interface Layer {
  index: number;
  /** First bucket drawn, one empty bucket before the curve. */
  start: number;
  lo: number[];
  hi: number[];
}

interface Block {
  family: number;
  shade: number;
  top: number[];
  bottom: number[];
}

export function MusicStream({ data }: { data: MusicSnapshot }) {
  const { ref, width } = useWidth<HTMLDivElement>(1200);
  const [hover, setHover] = useState<{ index: number; px: number; py: number } | null>(null);

  const N = data.timeline.buckets;
  const W = Math.max(width, MIN_WIDTH);
  const H = W < 900 ? 440 : Math.min(660, Math.round(W * 0.5));
  const M = { top: 16, right: 14, bottom: 30, left: 14 };
  const innerW = W - M.left - M.right;
  const innerH = H - M.top - M.bottom;
  const mid = M.top + innerH / 2;
  const xUnit = (u: number) => M.left + u * innerW;
  const xBucket = (i: number) => xUnit((i + 0.5) / N);

  // Stacking is in score units and independent of the size.
  const stack = useMemo(() => {
    const order = data.entities
      .map((_, i) => i)
      .sort((a, b) => {
        const p = data.entities[a];
        const q = data.entities[b];
        return p.family - q.family || p.shade - q.shade || p.first_year - q.first_year || p.name.localeCompare(q.name);
      });
    const total = Array.from({ length: N }, () => 0);
    for (const e of data.entities) for (let k = 0; k < e.values.length; k++) total[e.from + k] += e.values[k];
    const cum = Array.from({ length: N }, () => 0);
    const layers: Layer[] = [];
    const blocks: Block[] = [];
    for (const index of order) {
      const e = data.entities[index];
      let block = blocks[blocks.length - 1];
      if (!block || block.family !== e.family || block.shade !== e.shade) {
        block = { family: e.family, shade: e.shade, top: [...cum], bottom: [] };
        blocks.push(block);
      }
      const start = Math.max(0, e.from - 1);
      const end = Math.min(N - 1, e.from + e.values.length);
      const lo: number[] = [];
      const hi: number[] = [];
      for (let b = start; b <= end; b++) {
        lo.push(cum[b]);
        cum[b] += valueAt(e, b);
        hi.push(cum[b]);
      }
      layers.push({ index, start, lo, hi });
      block.bottom = [...cum];
    }
    return { layers, blocks, total, max: Math.max(...total) };
  }, [data, N]);

  // Square-root outline; inside a column every band keeps its true share.
  const column = useMemo(() => {
    const px = stack.total.map((t) => Math.sqrt(t / stack.max) * innerH);
    return { px, scale: stack.total.map((t, i) => (t > 0 ? px[i] / t : 0)) };
  }, [stack, innerH]);
  const y = (c: number, b: number) => mid - column.px[b] / 2 + c * column.scale[b];

  const paths = useMemo(
    () =>
      stack.layers.map((layer) => {
        const e = data.entities[layer.index];
        const family = data.families[e.family];
        let d = "";
        for (let k = 0; k < layer.hi.length; k++) d += `${k ? "L" : "M"}${xBucket(layer.start + k).toFixed(1)},${y(layer.lo[k], layer.start + k).toFixed(1)}`;
        for (let k = layer.hi.length - 1; k >= 0; k--) d += `L${xBucket(layer.start + k).toFixed(1)},${y(layer.hi[k], layer.start + k).toFixed(1)}`;
        return { index: layer.index, d: `${d}Z`, fill: shadeColor(e.family, e.shade, family.shades.length), href: wikipediaUrl(e.wiki) };
      }),
    [stack, column, W, H],
  );

  // Name each section's block at its thickest column, if it is thick enough and clear of the others.
  const labels = useMemo(() => {
    const placed: { key: string; name: string; px: number; py: number; w: number }[] = [];
    const candidates = stack.blocks.map((block) => {
      let best = 0;
      let thickest = 0;
      for (let b = 0; b < N; b++) {
        const t = (block.bottom[b] - block.top[b]) * column.scale[b];
        if (t > thickest) {
          thickest = t;
          best = b;
        }
      }
      return { block, bucket: best, thickness: thickest, py: (y(block.top[best], best) + y(block.bottom[best], best)) / 2 };
    });
    for (const c of candidates.sort((p, q) => q.thickness - p.thickness)) {
      if (c.thickness < LABEL_MIN_THICKNESS) continue;
      const name = data.families[c.block.family].shades[c.block.shade];
      const w = name.length * 6.4;
      const px = Math.max(M.left + 4, Math.min(W - M.right - w - 4, xBucket(c.bucket) - w / 2));
      if (placed.some((p) => px < p.px + p.w + 8 && p.px < px + w + 8 && Math.abs(p.py - c.py) < 14)) continue;
      placed.push({ key: `${c.block.family}-${c.block.shade}`, name, px, py: c.py, w });
    }
    return placed;
  }, [stack, column, W, H]);

  const onBandMove = useCallback((index: number, e: React.PointerEvent) => {
    const box = (e.currentTarget as SVGElement).ownerSVGElement!.getBoundingClientRect();
    setHover({ index, px: e.clientX - box.left, py: e.clientY - box.top });
  }, []);

  const hovered = hover ? data.entities[hover.index] : undefined;
  const hoverUnit = hover ? (hover.px - M.left) / innerW : 0;
  const hoverBucket = Math.min(N - 1, Math.max(0, Math.floor(hoverUnit * N)));

  return (
    <figure className="m-0">
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-2">
        {data.families.map((f, i) => (
          <span key={f.name} className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: familyColor(i) }} aria-hidden="true" />
            {f.name}
            <span className="text-ink-muted">{data.entities.filter((e) => e.family === i).length}</span>
          </span>
        ))}
      </div>
      <div ref={ref} className="relative w-full overflow-x-auto rounded-lg border border-line bg-surface-1">
        <div className="relative" style={{ width: W }}>
          <svg
            width={W}
            height={H}
            role="img"
            aria-label={`Centred stream of ${data.entities.length.toLocaleString("en-US")} music entities by genre family and section, from ${formatYear(data.timeline.start)} to ${data.as_of_year}`}
            onPointerLeave={() => setHover(null)}
          >
            <TimeAxis asOfYear={data.as_of_year} x={xUnit} top={M.top} bottom={H - M.bottom} timeline={data.timeline} />
            <Bands paths={paths} hovered={hover?.index ?? null} onMove={onBandMove} />
            <g pointerEvents="none" opacity={hover ? 0.35 : 1}>
              {labels.map((l) => (
                <text
                  key={l.key}
                  x={l.px}
                  y={l.py + 4}
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--color-ink)"
                  stroke="var(--color-surface-1)"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  {l.name}
                </text>
              ))}
            </g>
          </svg>
          {hover && hovered && (
            <Tooltip x={hover.px} y={hover.py} width={W} height={H}>
              <p className="font-semibold text-ink">{hovered.name}</p>
              <p className="text-ink-muted">
                <span className="capitalize">{hovered.type}</span>
                {` · ${formatSpan(hovered.first_year, hovered.last_year, data.as_of_year)}`}
              </p>
              <p className="mt-1 flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: shadeColor(hovered.family, hovered.shade, data.families[hovered.family].shades.length) }}
                  aria-hidden="true"
                />
                {data.families[hovered.family].name} · {data.families[hovered.family].shades[hovered.shade]}
              </p>
              <p className="mt-1.5 flex justify-between">
                <span>Around {formatYear(unitToYear(hoverUnit, data.as_of_year, data.timeline))}, per year</span>
                <span className="font-mono text-ink">{formatMagnitude(valueAt(hovered, hoverBucket))}</span>
              </p>
              <p className="mt-1.5 flex justify-between border-t border-line pt-1.5">
                <span>Own influence</span>
                <span className="font-mono text-ink">{formatMagnitude(hovered.own_magnitude)}</span>
              </p>
            </Tooltip>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-ink-muted">
        One band per entity: its own influence each year. Height is on a square-root scale, time on a logarithmic one.
        Hover to identify, click to read the article Clef scored.
      </figcaption>
    </figure>
  );
}

/** Every band, re-rendered only when the hovered band changes, not on every pointer move. */
const Bands = memo(function Bands({
  paths,
  hovered,
  onMove,
}: {
  paths: { index: number; d: string; fill: string; href: string }[];
  hovered: number | null;
  onMove: (index: number, e: React.PointerEvent) => void;
}) {
  return (
    <g>
      {paths.map((p) => (
        <a key={p.index} href={p.href} target="_blank" rel="noreferrer" onPointerMove={(e) => onMove(p.index, e)}>
          <path
            d={p.d}
            style={{ fill: p.fill }}
            opacity={hovered !== null && hovered !== p.index ? 0.35 : 1}
            stroke={hovered === p.index ? "var(--color-ink)" : "none"}
            strokeWidth={1.5}
          />
        </a>
      ))}
    </g>
  );
});

/** Each family's count, its share of the stream overall and since 1950 and 2000, its sections and its largest bands. */
export function FamilyTable({ data }: { data: MusicSnapshot }) {
  const rows = useMemo(() => {
    const N = data.timeline.buckets;
    const years = Array.from({ length: N }, (_, i) => unitToYear((i + 0.5) / N, data.as_of_year, data.timeline));
    const sums = (from: number) => {
      const byFamily = Array.from({ length: data.families.length }, () => 0);
      for (const e of data.entities) {
        for (let k = 0; k < e.values.length; k++) if (years[e.from + k] >= from) byFamily[e.family] += e.values[k];
      }
      const all = byFamily.reduce((s, v) => s + v, 0);
      return byFamily.map((v) => (all > 0 ? v / all : 0));
    };
    const [ever, since1950, since2000] = [sums(Number.NEGATIVE_INFINITY), sums(1950), sums(2000)];
    return data.families.map((f, i) => {
      const members = data.entities.filter((e) => e.family === i);
      return {
        name: f.name,
        count: members.length,
        ever: ever[i],
        since1950: since1950[i],
        since2000: since2000[i],
        shades: f.shades.map((name, k) => ({ name, k, count: members.filter((e) => e.shade === k).length })).filter((s) => s.count > 0),
        largest: [...members].sort((a, b) => drawnArea(b) - drawnArea(a)).slice(0, 4),
      };
    });
  }, [data]);

  const pct = (v: number) => (v >= 0.005 ? `${(100 * v).toFixed(0)}%` : v > 0 ? "<1%" : "0%");

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink-muted">
            <th className="px-3 py-2 font-semibold">Family</th>
            <th className="px-3 py-2 text-right font-semibold">Entities</th>
            <th className="px-3 py-2 text-right font-semibold">Share of the stream</th>
            <th className="px-3 py-2 text-right font-semibold">Since 1950</th>
            <th className="px-3 py-2 text-right font-semibold">Since 2000</th>
            <th className="px-3 py-2 font-semibold">Sections, and its largest bands</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.name} className="border-b border-line align-top">
              <td className="whitespace-nowrap px-3 py-2 text-ink">
                <span className="mr-2 inline-block h-3 w-3 rounded-sm align-[-1px]" style={{ background: familyColor(i) }} aria-hidden="true" />
                {r.name}
              </td>
              <td className="px-3 py-2 text-right font-mono">{r.count.toLocaleString("en-US")}</td>
              <td className="px-3 py-2 text-right font-mono">{pct(r.ever)}</td>
              <td className="px-3 py-2 text-right font-mono">{pct(r.since1950)}</td>
              <td className="px-3 py-2 text-right font-mono">{pct(r.since2000)}</td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-x-3.5 gap-y-1">
                  {r.shades.map((s) => (
                    <span key={s.name} className="flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        className="inline-block h-3 w-3 rounded-sm"
                        style={{ background: shadeColor(i, s.k, data.families[i].shades.length) }}
                        aria-hidden="true"
                      />
                      {s.name}
                      <span className="text-ink-muted">{s.count}</span>
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-ink-muted">
                  {r.largest.map((e, k) => (
                    <span key={e.wiki}>
                      {k > 0 && ", "}
                      <a href={wikipediaUrl(e.wiki)} target="_blank" rel="noreferrer" className="hover:text-ink">
                        {e.name}
                      </a>
                    </span>
                  ))}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
