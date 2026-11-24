/**
 * The centred stream, a site's home picture when its config asks for one (SitePicture "stream"):
 * every entity's own influence, centred on the axis with no meaning above or below it. Hue is the
 * group the entity's metadata names and shade its place within that group (StreamGrouping). The
 * outline is the square root of each moment's total, as on the impact river, and inside a moment
 * each band keeps its true share. Groups stack in the palette's slot order, shades in the order the
 * config lists them and entities by start year, so each shade reads as one block, named where it is
 * thick enough. A band opens its entity's profile.
 */
import { memo, useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FAMILY_COLORS } from "@/lib/chart-colors";
import { SITE } from "@/lib/site";
import { formatSpan, formatYear, unitToYear } from "@/lib/timeline";
import { entityTypeOf } from "@/sites";
import type { StreamGrouping } from "@/sites/types";
import type { Realm, RealmEntity } from "./api";
import { BUCKET_COUNT, formatMagnitude, TimeAxis, Tooltip, useWidth } from "./chart";

/** The site's grouping; only a stream site draws this picture. */
export function grouping(): StreamGrouping {
  if (SITE.picture.kind !== "stream") throw new Error(`${SITE.brand.name}'s picture is the ${SITE.picture.kind}, not a stream`);
  return SITE.picture.grouping;
}

export function groupColor(group: number): string {
  const color = FAMILY_COLORS[group];
  if (!color) throw new Error(`No palette slot for group ${group}; the palette has ${FAMILY_COLORS.length}`);
  return color;
}

/** A shade: its group's hue mixed toward the chart ground (first) or ink (last), in even steps. */
export function shadeColor(group: number, shade: number, shades: number): string {
  const t = shades === 1 ? 0 : -0.32 + (0.64 * shade) / (shades - 1);
  const percent = Math.round(Math.abs(t) * 100);
  if (percent === 0) return groupColor(group);
  const toward = t < 0 ? "var(--color-surface-1)" : "var(--color-ink)";
  return `color-mix(in srgb, ${groupColor(group)}, ${toward} ${percent}%)`;
}

/** An entity the stream draws: one with a place in the grouping and a curve. */
type Drawn = RealmEntity & { stream: { group: number; shade: number }; first_year: number; last_year: number };

function drawnOf(realm: Realm): Drawn[] {
  return realm.entities.filter(
    (e): e is Drawn => e.stream !== null && e.first_year !== null && e.curve.benefit.length > 0,
  );
}

const valueAt = (e: Drawn, bucket: number) => {
  const k = bucket - e.curve.from;
  return k >= 0 && k < e.curve.benefit.length ? e.curve.benefit[k] : 0;
};

/** Each entity's whole drawn area: the sum of its curve. */
const drawnArea = (e: Drawn) => e.curve.benefit.reduce((s, v) => s + v, 0);

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
  group: number;
  shade: number;
  top: number[];
  bottom: number[];
}

export function Stream({ realm }: { realm: Realm }) {
  const g = grouping();
  const entities = useMemo(() => drawnOf(realm), [realm]);
  const { ref, width } = useWidth<HTMLDivElement>(1200);
  const [hover, setHover] = useState<{ index: number; px: number; py: number } | null>(null);

  const N = BUCKET_COUNT;
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
    const order = entities
      .map((_, i) => i)
      .sort((a, b) => {
        const p = entities[a];
        const q = entities[b];
        return (
          p.stream.group - q.stream.group ||
          p.stream.shade - q.stream.shade ||
          p.first_year - q.first_year ||
          p.name.localeCompare(q.name)
        );
      });
    const total = Array.from({ length: N }, () => 0);
    for (const e of entities) for (let k = 0; k < e.curve.benefit.length; k++) total[e.curve.from + k] += e.curve.benefit[k];
    const cum = Array.from({ length: N }, () => 0);
    const layers: Layer[] = [];
    const blocks: Block[] = [];
    for (const index of order) {
      const e = entities[index];
      let block = blocks[blocks.length - 1];
      if (!block || block.group !== e.stream.group || block.shade !== e.stream.shade) {
        block = { group: e.stream.group, shade: e.stream.shade, top: [...cum], bottom: [] };
        blocks.push(block);
      }
      const start = Math.max(0, e.curve.from - 1);
      const end = Math.min(N - 1, e.curve.from + e.curve.benefit.length);
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
    return { layers, blocks, total, max: Math.max(1e-9, ...total) };
  }, [entities, N]);

  // Square-root outline; inside a column every band keeps its true share.
  const column = useMemo(() => {
    const px = stack.total.map((t) => Math.sqrt(t / stack.max) * innerH);
    return { px, scale: stack.total.map((t, i) => (t > 0 ? px[i] / t : 0)) };
  }, [stack, innerH]);
  const y = (c: number, b: number) => mid - column.px[b] / 2 + c * column.scale[b];

  const paths = useMemo(
    () =>
      stack.layers.map((layer) => {
        const e = entities[layer.index];
        let d = "";
        for (let k = 0; k < layer.hi.length; k++) d += `${k ? "L" : "M"}${xBucket(layer.start + k).toFixed(1)},${y(layer.lo[k], layer.start + k).toFixed(1)}`;
        for (let k = layer.hi.length - 1; k >= 0; k--) d += `L${xBucket(layer.start + k).toFixed(1)},${y(layer.hi[k], layer.start + k).toFixed(1)}`;
        const fill = shadeColor(e.stream.group, e.stream.shade, g.groups[e.stream.group].shades.length);
        return { index: layer.index, d: `${d}Z`, fill, slug: e.slug };
      }),
    [stack, column, W, H],
  );

  // Name each shade's block at its thickest column, if it is thick enough and clear of the others.
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
      const name = g.groups[c.block.group].shades[c.block.shade];
      const w = name.length * 6.4;
      const px = Math.max(M.left + 4, Math.min(W - M.right - w - 4, xBucket(c.bucket) - w / 2));
      if (placed.some((p) => px < p.px + p.w + 8 && p.px < px + w + 8 && Math.abs(p.py - c.py) < 14)) continue;
      placed.push({ key: `${c.block.group}-${c.block.shade}`, name, px, py: c.py, w });
    }
    return placed;
  }, [stack, column, W, H]);

  const onBandMove = useCallback((index: number, e: React.PointerEvent) => {
    const box = (e.currentTarget as SVGElement).ownerSVGElement!.getBoundingClientRect();
    setHover({ index, px: e.clientX - box.left, py: e.clientY - box.top });
  }, []);

  const navigate = useNavigate();
  const onBandOpen = useCallback((slug: string) => navigate({ to: "/entity/$slug", params: { slug } }), [navigate]);

  const hovered = hover ? entities[hover.index] : undefined;
  const hoverUnit = hover ? (hover.px - M.left) / innerW : 0;
  const hoverBucket = Math.min(N - 1, Math.max(0, Math.floor(hoverUnit * N)));

  return (
    <figure className="m-0">
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-2">
        {g.groups.map((group, i) => (
          <span key={group.name} className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: groupColor(i) }} aria-hidden="true" />
            {group.name}
            <span className="text-ink-muted">{entities.filter((e) => e.stream.group === i).length}</span>
          </span>
        ))}
      </div>
      <div ref={ref} className="relative w-full overflow-x-auto">
        <div className="relative" style={{ width: W }}>
          <svg
            width={W}
            height={H}
            role="img"
            aria-label={`Centred stream of ${entities.length.toLocaleString("en-US")} entities by ${g.labels.group.toLowerCase()}, from ${formatYear(SITE.timeline.start)} to ${realm.as_of_year}`}
            onPointerLeave={() => setHover(null)}
          >
            <TimeAxis asOfYear={realm.as_of_year} x={xUnit} top={M.top} bottom={H - M.bottom} />
            <Bands paths={paths} hovered={hover?.index ?? null} onMove={onBandMove} onOpen={onBandOpen} />
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
                {entityTypeOf(SITE, hovered.entity_type).label}
                {` · ${formatSpan(hovered.first_year, hovered.last_year, realm.as_of_year)}`}
              </p>
              <p className="mt-1 flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{
                    background: shadeColor(hovered.stream.group, hovered.stream.shade, g.groups[hovered.stream.group].shades.length),
                  }}
                  aria-hidden="true"
                />
                {g.groups[hovered.stream.group].name} · {g.groups[hovered.stream.group].shades[hovered.stream.shade]}
              </p>
              <p className="mt-1.5 flex justify-between gap-3">
                <span>Around {formatYear(unitToYear(hoverUnit, realm.as_of_year, SITE.timeline))}, per year</span>
                <span className="font-mono text-ink">{formatMagnitude(valueAt(hovered, hoverBucket))}</span>
              </p>
              <p className="mt-1.5 flex justify-between border-t border-line pt-1.5">
                <span>Total influence</span>
                <span className="font-mono text-ink">{formatMagnitude(hovered.total_magnitude)}</span>
              </p>
            </Tooltip>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-ink-muted">
        Time is stretched toward the present, so the crowded last century has room. Within any year the bands share the
        height in true proportion; the stream's overall height is compressed so the early centuries stay visible. Hover
        a band to see what it is; click it for its scores and the evidence behind them.
      </figcaption>
    </figure>
  );
}

/** Every band, re-rendered only when the hovered band changes, not on every pointer move. */
const Bands = memo(function Bands({
  paths,
  hovered,
  onMove,
  onOpen,
}: {
  paths: { index: number; d: string; fill: string; slug: string }[];
  hovered: number | null;
  onMove: (index: number, e: React.PointerEvent) => void;
  onOpen: (slug: string) => void;
}) {
  return (
    <g>
      {paths.map((p) => (
        <a
          key={p.index}
          href={`/entity/${p.slug}`}
          onPointerMove={(e) => onMove(p.index, e)}
          onClick={(e) => {
            // A plain click navigates in the app; a modified one opens the page as the browser would.
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            onOpen(p.slug);
          }}
        >
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

/** Each group's count, its share of the stream overall and since 1950 and 2000, its shades and its largest bands. */
export function GroupTable({ realm }: { realm: Realm }) {
  const g = grouping();
  const rows = useMemo(() => {
    const entities = drawnOf(realm);
    const N = BUCKET_COUNT;
    const years = Array.from({ length: N }, (_, i) => unitToYear((i + 0.5) / N, realm.as_of_year, SITE.timeline));
    const sums = (from: number) => {
      const byGroup = Array.from({ length: g.groups.length }, () => 0);
      for (const e of entities) {
        for (let k = 0; k < e.curve.benefit.length; k++) {
          if (years[e.curve.from + k] >= from) byGroup[e.stream.group] += e.curve.benefit[k];
        }
      }
      const all = byGroup.reduce((s, v) => s + v, 0);
      return byGroup.map((v) => (all > 0 ? v / all : 0));
    };
    const [ever, since1950, since2000] = [sums(Number.NEGATIVE_INFINITY), sums(1950), sums(2000)];
    return g.groups.map((group, i) => {
      const members = entities.filter((e) => e.stream.group === i);
      return {
        name: group.name,
        count: members.length,
        ever: ever[i],
        since1950: since1950[i],
        since2000: since2000[i],
        shades: group.shades
          .map((name, k) => ({ name, k, count: members.filter((e) => e.stream.shade === k).length }))
          .filter((s) => s.count > 0),
        largest: [...members].sort((a, b) => drawnArea(b) - drawnArea(a)).slice(0, 4),
      };
    });
  }, [realm]);

  const pct = (v: number) => (v >= 0.005 ? `${(100 * v).toFixed(0)}%` : v > 0 ? "<1%" : "0%");

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink-muted">
            <th className="px-3 py-2 font-semibold">{g.labels.group}</th>
            <th className="px-3 py-2 text-right font-semibold">Entries</th>
            <th className="px-3 py-2 text-right font-semibold">Share of the stream</th>
            <th className="px-3 py-2 text-right font-semibold">Since 1950</th>
            <th className="px-3 py-2 text-right font-semibold">Since 2000</th>
            <th className="px-3 py-2 font-semibold">{g.labels.shades}, and its largest bands</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.name} className="border-b border-line align-top">
              <td className="whitespace-nowrap px-3 py-2 text-ink">
                <span className="mr-2 inline-block h-3 w-3 rounded-sm align-[-1px]" style={{ background: groupColor(i) }} aria-hidden="true" />
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
                        style={{ background: shadeColor(i, s.k, g.groups[i].shades.length) }}
                        aria-hidden="true"
                      />
                      {s.name}
                      <span className="text-ink-muted">{s.count}</span>
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-ink-muted">
                  {r.largest.map((e, k) => (
                    <span key={e.slug}>
                      {k > 0 && ", "}
                      <Link to="/entity/$slug" params={{ slug: e.slug }} className="hover:text-ink">
                        {e.name}
                      </Link>
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
