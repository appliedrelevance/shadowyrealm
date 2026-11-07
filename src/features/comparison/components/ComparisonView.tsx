import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { MagnitudeBadge } from "@/components/MagnitudeBadge";
import { useOperator } from "@/features/entities/hooks/useEntityMutations";
import { profileQuery, useRealm, type EntityProfile } from "@/features/realm/api";
import { AXIS_TEXT, bucketUnit, formatMagnitude, GRID, LineKey, TimeAxis, useWidth } from "@/features/realm/chart";
import { DIMENSION_LABELS } from "@/features/realm/ProfileCharts";
import { DIMENSIONS } from "@/lib/atis-calculator";
import { seriesColor } from "@/lib/chart-colors";
import { COPY } from "@/lib/copy";
import { BUCKET_COUNT } from "@/lib/timeline";
import { usePageTitle } from "@/lib/usePageTitle";

const MAX_SELECTED = 5;
const OPENING = ["jesus", "muhammad", "the-buddha"];

export function ComparisonView() {
  usePageTitle(COPY.nav.compare);
  const { data: realm } = useRealm();
  const { data: operator } = useOperator();
  const [chosen, setChosen] = useState<string[] | null>(null);
  const [query, setQuery] = useState("");

  const known = useMemo(() => new Map((realm?.entities ?? []).map((e) => [e.slug, e])), [realm]);
  const selected = chosen ?? OPENING.filter((s) => known.has(s));
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || !realm) return [];
    return realm.entities.filter((e) => e.name.toLowerCase().includes(q) && !selected.includes(e.slug)).slice(0, 6);
  }, [query, realm, selected]);

  const profiles = useQueries({ queries: selected.map((slug) => profileQuery(slug, !!operator)) });
  const loaded = profiles.map((p) => p.data).filter((p): p is EntityProfile => !!p);
  const ready = loaded.length === selected.length && selected.length > 0;

  const add = (slug: string) => {
    if (selected.length < MAX_SELECTED) setChosen([...selected, slug]);
    setQuery("");
  };
  const remove = (slug: string) => setChosen(selected.filter((s) => s !== slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-ink">Compare</h1>
      <p className="mt-2 text-ink-muted">
        Set up to {MAX_SELECTED} entities side by side: their total influence over time and their ten-number profiles.
      </p>

      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selected.length >= MAX_SELECTED ? "Remove one to add another" : "Add an entity…"}
          disabled={selected.length >= MAX_SELECTED}
          aria-label="Search entities to compare"
          className="w-full rounded border border-line bg-surface-1 py-2 pl-9 pr-3 text-sm text-ink-2 focus:border-action focus:outline-none disabled:opacity-50"
        />
        {matches.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded border border-line bg-surface-1 shadow-lg">
            {matches.map((e) => (
              <li key={e.slug}>
                <button
                  onClick={() => add(e.slug)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink-2 hover:bg-surface-2"
                >
                  {e.name}
                  <span className="text-xs capitalize text-ink-muted">{e.entity_type}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {selected.map((slug, i) => (
            <li key={slug} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 py-1 pl-3 pr-2 text-sm text-ink-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: seriesColor(i) }} aria-hidden="true" />
              {known.get(slug)?.name ?? slug}
              <button onClick={() => remove(slug)} aria-label={`Remove ${known.get(slug)?.name ?? slug}`} className="text-ink-muted hover:text-ink">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed border-line bg-surface-1/50 p-6 text-center text-ink-muted">
          Search above to add entities.
        </p>
      )}
      {selected.length > 0 && !ready && <div className="mt-8 h-80 animate-pulse rounded-lg bg-surface-1" />}
      {ready && (
        <>
          <section className="mt-8 rounded-lg border border-line bg-surface-1 p-4">
            <h2 className="font-display text-lg font-semibold text-ink">Total influence over time</h2>
            <p className="mb-3 mt-1 text-sm text-ink-muted">
              Own plus credited influence per year: benefit above the line, harm below it.
            </p>
            <CompareCurves profiles={loaded} />
          </section>
          <CompareTable profiles={loaded} />
        </>
      )}
    </div>
  );
}

function CompareCurves({ profiles }: { profiles: EntityProfile[] }) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const W = Math.max(width, 300);
  const H = 320;
  const M = { top: 14, right: 10, bottom: 28, left: 10 };
  const asOf = profiles[0].as_of_year;

  const series = profiles.map((p) => {
    const { from, own, credited } = p.curves;
    return {
      p,
      from,
      benefit: own.benefit.map((v, k) => v + credited.benefit[k]),
      harm: own.harm.map((v, k) => v + credited.harm[k]),
    };
  });
  const first = Math.min(...series.map((s) => s.from));
  const last = Math.max(...series.map((s) => s.from + s.benefit.length));
  const fromUnit = first / BUCKET_COUNT;
  const toUnit = last / BUCKET_COUNT;
  const x = (u: number) => M.left + ((u - fromUnit) / (toUnit - fromUnit || 1)) * (W - M.left - M.right);
  const max = Math.max(1e-9, ...series.flatMap((s) => [...s.benefit, ...s.harm]));
  const half = (H - M.top - M.bottom) / 2;
  const mid = M.top + half;

  const line = (s: (typeof series)[number], values: number[], sign: 1 | -1) => {
    let d = "";
    for (let i = first; i < last; i++) {
      const k = i - s.from;
      const v = k >= 0 && k < values.length ? values[k] : 0;
      d += `${d ? "L" : "M"}${x(bucketUnit(i)).toFixed(1)},${(mid - sign * (v / max) * half).toFixed(1)}`;
    }
    return d;
  };

  return (
    <figure className="m-0">
      <div ref={ref} className="w-full">
        <svg width={W} height={H} role="img" aria-label="Total influence over time for the selected entities">
          <TimeAxis asOfYear={asOf} x={x} fromUnit={fromUnit} toUnit={toUnit} top={M.top} bottom={H - M.bottom} />
          <line x1={M.left} x2={W - M.right} y1={mid} y2={mid} stroke={GRID} />
          {series.map((s, i) => (
            <g key={s.p.entity.slug} fill="none" stroke={seriesColor(i)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
              <path d={line(s, s.benefit, 1)} />
              <path d={line(s, s.harm, -1)} />
            </g>
          ))}
          <text x={M.left + 4} y={M.top + 12} fontSize={11} fill={AXIS_TEXT}>
            Benefit ↑
          </text>
          <text x={M.left + 4} y={H - M.bottom - 6} fontSize={11} fill={AXIS_TEXT}>
            Harm ↓
          </text>
        </svg>
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
        {series.map((s, i) => (
          <span key={s.p.entity.slug} className="flex items-center gap-1.5">
            <LineKey color={seriesColor(i)} />
            {s.p.entity.name}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

function CompareTable({ profiles }: { profiles: EntityProfile[] }) {
  const rows: { label: string; values: number[]; strong?: boolean }[] = [
    { label: "Total influence", values: profiles.map((p) => p.score.total_magnitude), strong: true },
    { label: "Own", values: profiles.map((p) => p.score.own_magnitude) },
    { label: "Credited", values: profiles.map((p) => p.score.credited_magnitude) },
    { label: "Benefit", values: profiles.map((p) => p.score.benefit_total) },
    { label: "Harm", values: profiles.map((p) => p.score.harm_total) },
    ...DIMENSIONS.flatMap((d) => [
      { label: `${DIMENSION_LABELS[d]} benefit`, values: profiles.map((p) => p.score.profile.total.benefit[d]) },
      { label: `${DIMENSION_LABELS[d]} harm`, values: profiles.map((p) => p.score.profile.total.harm[d]) },
    ]),
  ];
  return (
    <section className="mt-6 overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[560px] text-sm">
        <thead className="bg-surface-1 text-left">
          <tr>
            <th scope="col" className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
              In influence-centuries
            </th>
            {profiles.map((p, i) => (
              <th key={p.entity.slug} scope="col" className="px-3 py-2 text-right font-medium text-ink">
                <Link to="/entity/$slug" params={{ slug: p.entity.slug }} className="inline-flex items-center gap-1.5 hover:text-action-ink">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: seriesColor(i) }} aria-hidden="true" />
                  {p.entity.name}
                </Link>
                <div className="mt-1">
                  <MagnitudeBadge tier={p.score.tier} magnitude={p.score.total_magnitude} showMagnitude={false} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line">
              <th scope="row" className={`px-3 py-1.5 text-left font-normal ${r.strong ? "text-ink" : "text-ink-muted"}`}>
                {r.label}
              </th>
              {r.values.map((v, i) => (
                <td key={i} className={`px-3 py-1.5 text-right font-mono tabular-nums ${r.strong ? "text-ink" : "text-ink-2"}`}>
                  {formatMagnitude(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
