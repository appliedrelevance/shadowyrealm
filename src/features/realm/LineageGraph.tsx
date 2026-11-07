/**
 * The lineage graph: every entity at the year it began, sized by total
 * influence, with credit links drawn from cause to consequence. Selecting an
 * entity lights up the chain it draws credit from (its consequences, to the
 * right) and the chain it passes credit to (its causes, to the left).
 */
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { arc } from "d3-shape";
import { ArrowRight } from "lucide-react";
import { formatSpan, yearToUnit } from "@/lib/timeline";
import { MagnitudeBadge } from "@/components/MagnitudeBadge";
import { useEntityProfile, type Realm, type RealmEntity } from "./api";
import { AXIS_TEXT, BENEFIT, formatMagnitude, HARM, SURFACE, TimeAxis, useWidth } from "./chart";

const CREDIT_TYPES = new Set(["influence", "mentorship"]);
const MIN_WIDTH = 980;
const LANE = 34;

interface Node {
  entity: RealmEntity;
  x: number;
  y: number;
  r: number;
}

const sliceArc = arc<{ start: number; end: number; r: number }>()
  .innerRadius(0)
  .outerRadius((d) => d.r)
  .startAngle((d) => d.start)
  .endAngle((d) => d.end);

function reach(start: string, next: Map<string, string[]>): Set<string> {
  const seen = new Set<string>();
  const stack = [start];
  while (stack.length > 0) {
    const s = stack.pop()!;
    for (const n of next.get(s) ?? []) {
      if (!seen.has(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  return seen;
}

export function LineageGraph({ realm }: { realm: Realm }) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const W = Math.max(width, MIN_WIDTH);
  const H = 640;
  const M = { top: 24, right: 150, bottom: 30, left: 24 };
  const innerW = W - M.left - M.right;
  const lanes = Math.floor((H - M.top - M.bottom) / LANE);
  const x = (u: number) => M.left + u * innerW;

  const credit = useMemo(() => realm.links.filter((l) => CREDIT_TYPES.has(l.relationship_type)), [realm]);

  const nodes = useMemo(() => {
    const max = Math.max(1, ...realm.entities.map((e) => e.total_magnitude));
    const dated = realm.entities
      .filter((e) => e.first_year !== null)
      .map((entity) => ({
        entity,
        x: x(yearToUnit(entity.first_year!, realm.as_of_year)),
        y: 0,
        r: 4 + 20 * Math.sqrt(entity.total_magnitude / max),
      }))
      .sort((a, b) => a.x - b.x);

    const causes = new Map<string, { slug: string; share: number }[]>();
    for (const l of credit) causes.set(l.target, [...(causes.get(l.target) ?? []), { slug: l.source, share: l.strength }]);

    // Lanes fill from the middle out; a consequence sits in its strongest cause's lane when it can.
    const order = Array.from({ length: lanes }, (_, i) => Math.floor(lanes / 2) + (i % 2 === 0 ? i / 2 : -(i + 1) / 2));
    const laneOf = new Map<string, number>();
    const occupied: Node[][] = Array.from({ length: lanes }, () => []);
    for (const node of dated) {
      const parent = (causes.get(node.entity.slug) ?? [])
        .filter((c) => laneOf.has(c.slug))
        .sort((a, b) => b.share - a.share)[0];
      const preferred = parent ? laneOf.get(parent.slug)! : order[0];
      const clear = (lane: number) =>
        occupied[lane].every((o) => Math.abs(o.x - node.x) > o.r + node.r + 70);
      const candidates = [...Array(lanes).keys()].sort(
        (a, b) => Math.abs(a - preferred) - Math.abs(b - preferred) || order.indexOf(a) - order.indexOf(b),
      );
      const lane =
        candidates.find(clear) ??
        candidates.reduce((best, l) => {
          const gap = (k: number) => Math.min(Infinity, ...occupied[k].map((o) => Math.abs(o.x - node.x)));
          return gap(l) > gap(best) ? l : best;
        }, candidates[0]);
      laneOf.set(node.entity.slug, lane);
      node.y = M.top + LANE / 2 + lane * LANE;
      occupied[lane].push(node);
    }
    return dated;
    // Layout depends on the data and the drawing width only.
  }, [realm, credit, W]);

  const bySlug = useMemo(() => new Map(nodes.map((n) => [n.entity.slug, n])), [nodes]);
  const defaultFocus = useMemo(
    () => realm.entities.find((e) => credit.some((l) => l.source === e.slug || l.target === e.slug))?.slug ?? null,
    [realm, credit],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const focus = hovered ?? selected ?? defaultFocus;

  const { upstream, downstream } = useMemo(() => {
    if (!focus) return { upstream: new Set<string>(), downstream: new Set<string>() };
    const forward = new Map<string, string[]>();
    const backward = new Map<string, string[]>();
    for (const l of credit) {
      forward.set(l.source, [...(forward.get(l.source) ?? []), l.target]);
      backward.set(l.target, [...(backward.get(l.target) ?? []), l.source]);
    }
    return { upstream: reach(focus, backward), downstream: reach(focus, forward) };
  }, [focus, credit]);

  const inUp = (slug: string) => slug === focus || upstream.has(slug);
  const inDown = (slug: string) => slug === focus || downstream.has(slug);
  const lit = (slug: string) => !focus || inUp(slug) || inDown(slug);
  const edgeLit = (s: string, t: string) => !!focus && ((inUp(s) && inUp(t)) || (inDown(s) && inDown(t)));

  const labelled = useMemo(() => {
    const boxes: { x0: number; x1: number; y: number }[] = [];
    const out = new Set<string>();
    const ranked = [...nodes].sort((a, b) => {
      const pa = a.entity.slug === focus ? 2 : lit(a.entity.slug) && focus ? 1 : 0;
      const pb = b.entity.slug === focus ? 2 : lit(b.entity.slug) && focus ? 1 : 0;
      return pb - pa || b.r - a.r;
    });
    for (const n of ranked) {
      const w = n.entity.name.length * 6.2;
      const box = { x0: n.x + n.r + 4, x1: n.x + n.r + 6 + w, y: n.y };
      if (boxes.some((b) => Math.abs(b.y - box.y) < 13 && box.x0 < b.x1 && b.x0 < box.x1)) continue;
      if (n.r < 8 && !(focus && lit(n.entity.slug))) continue;
      boxes.push(box);
      out.add(n.entity.slug);
    }
    return out;
    // Recomputed when the focus or layout changes.
  }, [nodes, focus, upstream, downstream]);

  const focusNode = focus ? bySlug.get(focus) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <figure className="m-0 min-w-0">
        <div ref={ref} className="w-full overflow-x-auto rounded-lg border border-line bg-surface-1">
          <svg
            width={W}
            height={H}
            role="img"
            aria-label={`Lineage graph of ${nodes.length} entities and ${credit.length} credit links, placed by the year each began`}
            onPointerLeave={() => setHovered(null)}
          >
            <defs>
              <marker id="lineage-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={AXIS_TEXT} />
              </marker>
            </defs>
            <TimeAxis asOfYear={realm.as_of_year} x={x} top={M.top - 8} bottom={H - M.bottom} />
            <g fill="none">
              {credit.map((l) => {
                const s = bySlug.get(l.source);
                const t = bySlug.get(l.target);
                if (!s || !t) return null;
                const on = edgeLit(l.source, l.target);
                const dx = Math.max(Math.abs(t.x - s.x) / 2, 30);
                const angle = Math.atan2(t.y - s.y, t.x - s.x);
                const tx = t.x - Math.cos(angle) * (t.r + 2);
                const ty = t.y - Math.sin(angle) * (t.r + 2);
                return (
                  <path
                    key={`${l.source}-${l.target}`}
                    d={`M${s.x},${s.y} C${s.x + dx},${s.y} ${tx - dx},${ty} ${tx},${ty}`}
                    stroke={on ? "var(--color-ink-2)" : AXIS_TEXT}
                    strokeWidth={0.8 + l.strength * 3}
                    opacity={focus ? (on ? 0.9 : 0.12) : 0.45}
                    markerEnd="url(#lineage-arrow)"
                  >
                    <title>{`${s.entity.name} → ${t.entity.name}: ${Math.round(l.strength * 100)}% credited`}</title>
                  </path>
                );
              })}
            </g>
            {nodes.map((n) => {
              const share = n.entity.total_magnitude > 0 ? n.entity.benefit_total / n.entity.total_magnitude : 0.5;
              const on = lit(n.entity.slug);
              return (
                <g
                  key={n.entity.slug}
                  transform={`translate(${n.x},${n.y})`}
                  opacity={on ? 1 : 0.22}
                  style={{ cursor: "pointer", transition: "opacity 120ms" }}
                  onPointerEnter={() => setHovered(n.entity.slug)}
                  onClick={() => setSelected(n.entity.slug)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.entity.name}, total influence ${formatMagnitude(n.entity.total_magnitude)}`}
                  onFocus={() => setHovered(n.entity.slug)}
                  onBlur={() => setHovered(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelected(n.entity.slug);
                  }}
                >
                  <circle r={Math.max(n.r + 6, 12)} fill="transparent" />
                  <path d={sliceArc({ start: 0, end: share * 2 * Math.PI, r: n.r })!} fill={BENEFIT} />
                  <path d={sliceArc({ start: share * 2 * Math.PI, end: 2 * Math.PI, r: n.r })!} fill={HARM} />
                  <circle
                    r={n.r}
                    fill="none"
                    stroke={n.entity.slug === focus ? "var(--color-ink)" : SURFACE}
                    strokeWidth={n.entity.slug === focus ? 2 : 1.5}
                  />
                  {labelled.has(n.entity.slug) && (
                    <text x={n.r + 4} y={4} fontSize={11} fill="var(--color-ink-2)" fontWeight={n.entity.slug === focus ? 700 : 400}>
                      {n.entity.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-benefit" aria-hidden="true" />
            Benefit share
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-harm" aria-hidden="true" />
            Harm share
          </span>
          <span>
            Each circle is an entity at the year it began, sized by total influence. Arrows run from cause to
            consequence, thicker for a larger credited share. Select one to trace its lineage.
          </span>
        </figcaption>
      </figure>
      {focusNode && (
        <FocusPanel
          entity={focusNode.entity}
          asOfYear={realm.as_of_year}
          upstream={upstream.size}
          downstream={downstream.size}
        />
      )}
    </div>
  );
}

function FocusPanel({
  entity,
  asOfYear,
  upstream,
  downstream,
}: {
  entity: RealmEntity;
  asOfYear: number;
  upstream: number;
  downstream: number;
}) {
  const { data: profile } = useEntityProfile(entity.slug);
  return (
    <aside className="rounded-lg border border-line bg-surface-1 p-4 lg:sticky lg:top-4 lg:self-start" aria-live="polite">
      <p className="text-xs uppercase tracking-wider text-ink-muted">
        <span className="capitalize">{entity.entity_type}</span>
        {entity.first_year !== null && ` · ${formatSpan(entity.first_year, entity.last_year!, asOfYear)}`}
      </p>
      <h2 className="mt-1 font-display text-xl font-bold text-ink">{entity.name}</h2>
      <p className="mt-2 text-sm text-ink-muted">{entity.description}</p>
      <div className="mt-4 flex items-center gap-3">
        <MagnitudeBadge tier={entity.tier} magnitude={entity.total_magnitude} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-ink-muted">Own</dt>
        <dd className="text-right font-mono text-ink">{formatMagnitude(entity.own_magnitude)}</dd>
        <dt className="text-ink-muted">Credited</dt>
        <dd className="text-right font-mono text-ink">{formatMagnitude(entity.credited_magnitude)}</dd>
        <dt className="text-ink-muted">Benefit</dt>
        <dd className="text-right font-mono text-ink">{formatMagnitude(entity.benefit_total)}</dd>
        <dt className="text-ink-muted">Harm</dt>
        <dd className="text-right font-mono text-ink">{formatMagnitude(entity.harm_total)}</dd>
      </dl>
      <p className="mt-4 text-xs text-ink-muted">
        Draws credit from {downstream} {downstream === 1 ? "consequence" : "consequences"} · passes credit to {upstream}{" "}
        {upstream === 1 ? "cause" : "causes"}
      </p>
      {profile && profile.contributors.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Largest credit</h3>
          <ul className="mt-1.5 space-y-1 text-sm">
            {profile.contributors.slice(0, 5).map((c) => (
              <li key={c.slug} className="flex justify-between gap-2">
                <span className="truncate text-ink-2">
                  {c.name} <span className="text-ink-muted">{Math.round(c.share * 100)}%</span>
                </span>
                <span className="font-mono text-ink">{formatMagnitude(c.magnitude)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link
        to="/entity/$slug"
        params={{ slug: entity.slug }}
        className="mt-4 inline-flex items-center gap-1 text-sm text-action-ink hover:underline"
      >
        Open profile <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}
