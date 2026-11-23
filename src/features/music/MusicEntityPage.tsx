/**
 * One music entity's page, /music/$slug: the shape of the impact profile page (header, score,
 * influence over time, profile by dimension, connections, periods and evidence) for a field with
 * one side and no credit. Its data is frozen in public/history/data/music/<slug>.json by
 * tools/music-snapshot.ts.
 */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { area, curveMonotoneX } from "d3-shape";
import { ArrowLeft, ArrowRight, Disc3, ExternalLink, Guitar, Music, RefreshCw, User, Users, type LucideIcon } from "lucide-react";
import { formatMagnitude, TimeAxis, Tooltip, useWidth } from "@/features/realm/chart";
import { formatSpan, formatYear, unitToYear } from "@/lib/timeline";
import { usePageTitle } from "@/lib/usePageTitle";
import type { Timeline } from "@/sites/types";
import { shadeColor, wikipediaUrl } from "./MusicStream";

type Relation = "grew_from" | "genre" | "by" | "members" | "member_of" | "gave_rise" | "works" | "in_genre";

export interface MusicEntityPageData {
  slug: string;
  name: string;
  type: string;
  description: string;
  /** English Wikipedia title of the article it was scored from. */
  wiki: string;
  family: number;
  shade: number;
  first_year: number;
  last_year: number;
  as_of_year: number;
  timeline: Timeline;
  families: { name: string; shades: string[] }[];
  dimensions: { key: string; label: string; meaning: string }[];
  /** The reach and persistence rubrics, lowest first: factor n reads level n − 1. */
  reach_levels: string[];
  persistence_levels: string[];
  magnitude: number;
  rank: number;
  of: number;
  family_rank: { rank: number; of: number };
  /** Influence-centuries per dimension. */
  profile: Record<string, number>;
  legacy: { from_year: number; magnitude: number } | null;
  curve: { from: number; values: number[] };
  periods: {
    label: string;
    start_year: number;
    end_year: number;
    description: string;
    /** 0–10 per dimension. */
    levels: Record<string, number>;
    reach_factor: number;
    persistence_factor: number;
    magnitude: number;
    evidence: string;
    source_url: string;
  }[];
  connections: { relation: Relation; slug: string; name: string; type: string; family: number; shade: number; magnitude: number }[];
}

const SLUG = /^[a-z0-9-]+$/;

/** The entity's page data; null when no entity has that slug. */
export function useMusicEntity(slug: string) {
  return useQuery({
    queryKey: ["music-entity", slug],
    queryFn: async () => {
      if (!SLUG.test(slug)) return null;
      const path = `/data/music/${slug}.json`;
      const response = await fetch(path);
      // An unknown path is answered with the app itself (single-page fallback), not JSON.
      if (response.status === 404 || !response.headers.get("content-type")?.includes("json")) return null;
      if (!response.ok) throw new Error(`GET ${path} failed: HTTP ${response.status}`);
      return (await response.json()) as MusicEntityPageData;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}

const TYPES: Record<string, { label: string; Icon: LucideIcon }> = {
  person: { label: "Person", Icon: User },
  group: { label: "Group", Icon: Users },
  style: { label: "Style", Icon: Music },
  work: { label: "Work", Icon: Disc3 },
  instrument: { label: "Instrument", Icon: Guitar },
};

function typeOf(type: string) {
  const t = TYPES[type];
  if (!t) throw new Error(`No label for music entity type "${type}"`);
  return t;
}

/** Each kind of connection, named from this entity's side, in reading order: where it came from, then what came of it. */
const RELATIONS: { key: Relation; title: string; blurb: string }[] = [
  { key: "grew_from", title: "Grew out of", blurb: "The older styles it came from. It is scored on its own, and left out of theirs." },
  { key: "genre", title: "Its styles", blurb: "The styles it belongs to. It is scored on its own, and left out of theirs." },
  { key: "by", title: "Performed or composed by", blurb: "The musicians behind it. It is scored on its own, and left out of theirs." },
  { key: "members", title: "Members", blurb: "Musicians who belonged to it. It is scored on its own, and left out of theirs." },
  { key: "member_of", title: "Member of", blurb: "The groups it belonged to, each scored on its own and left out of this score." },
  { key: "gave_rise", title: "Gave rise to", blurb: "The styles that grew out of it, each scored on its own and left out of this score." },
  { key: "works", title: "Performed or composed", blurb: "Its works in the stream, each scored on its own and left out of this score." },
  { key: "in_genre", title: "Musicians and works in it", blurb: "Those who belong to this style, each scored on its own and left out of this score." },
];

const ordinal = (n: number) => {
  const tens = n % 100;
  const suffix = tens >= 11 && tens <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n.toLocaleString("en-US")}${suffix}`;
};

export function MusicEntityPage({ slug }: { slug: string }) {
  const { data, isLoading, error } = useMusicEntity(slug);
  usePageTitle(data ? data.name : isLoading ? undefined : "Not found");

  if (isLoading) return <div className="mx-auto h-[640px] max-w-5xl animate-pulse px-4 py-8" aria-busy="true" />;

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-crit">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 inline-flex items-center gap-1 rounded border border-line px-3 py-1.5 text-sm text-ink-muted hover:border-action hover:text-ink-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-ink">Not found</h1>
        <p className="mt-4 text-ink-muted">Nothing in the music stream has that name.</p>
        <Link to="/music" className="mt-4 inline-block text-action-ink hover:underline">
          Back to the music stream
        </Link>
      </div>
    );
  }

  const { label: typeLabel, Icon } = typeOf(data.type);
  const family = data.families[data.family];
  const color = shadeColor(data.family, data.shade, family.shades.length);
  const during = data.periods.reduce((s, p) => s + p.magnitude, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/music" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink-2">
        <ArrowLeft className="h-4 w-4" /> Back to the music stream
      </Link>

      <header className="mt-4 flex flex-col gap-6 border-b border-line pb-8 sm:flex-row">
        <div className="shrink-0">
          <div
            className="flex h-36 w-36 items-center justify-center rounded-lg border-2 border-line bg-surface-2"
            style={{ boxShadow: `0 10px 24px -8px ${color}` }}
          >
            <Icon className="h-14 w-14 text-ink-muted" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold text-ink">{data.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <Icon className="h-4 w-4" />
            <span>{typeLabel}</span>
            <span>· {formatSpan(data.first_year, data.last_year, data.as_of_year)}</span>
            <span className="flex items-center gap-1.5">
              ·
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: color }} aria-hidden="true" />
              {family.name} · {family.shades[data.shade]}
            </span>
          </p>
          <p className="mt-4 text-ink-2">{data.description}</p>
          <a
            href={wikipediaUrl(data.wiki)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-action-ink hover:underline"
          >
            Wikipedia <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <Score data={data} during={during} />

      <section className="mt-6 rounded-lg border border-line bg-surface-1 p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Influence over time</h2>
        <p className="mb-3 mt-1 text-sm text-ink-muted">
          {data.legacy
            ? `What it gave each year while it was active, then its legacy, fading from ${formatYear(data.legacy.from_year)} as its persistence allows.`
            : "What it gave each year while it was active."}
        </p>
        <InfluenceCurve data={data} color={color} />
      </section>

      <section className="mt-6 rounded-lg border border-line bg-surface-1 p-4">
        <h2 className="font-display text-lg font-semibold text-ink">What it gave</h2>
        <p className="mb-3 mt-1 text-sm text-ink-muted">
          Its influence in each dimension, in influence-centuries. Music has no harm side, so nothing is netted against
          it.
        </p>
        <ProfileBars data={data} color={color} />
      </section>

      <Connections data={data} />
      <Periods data={data} />
    </div>
  );
}

function Score({ data, during }: { data: MusicEntityPageData; during: number }) {
  const family = data.families[data.family];
  const period = data.periods[0];
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Score">
      <div className="rounded-lg border border-line bg-surface-1 p-4 sm:col-span-2">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Total influence</p>
        <p className="mt-1 text-5xl font-semibold text-ink">{formatMagnitude(data.magnitude)}</p>
        <p className="mt-2 text-sm text-ink-2">
          {ordinal(data.rank)} of {data.of.toLocaleString("en-US")} in music · {ordinal(data.family_rank.rank)} of{" "}
          {data.family_rank.of.toLocaleString("en-US")} in {family.name}
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          {formatMagnitude(during)} while active
          {data.legacy && ` · ${formatMagnitude(data.legacy.magnitude)} as its legacy`} · in influence-centuries
        </p>
      </div>
      {period && (
        <>
          <Factor
            label="How far it travelled"
            factor={period.reach_factor}
            text={data.reach_levels[period.reach_factor - 1]}
          />
          <Factor
            label="How long it lasted"
            factor={period.persistence_factor}
            text={data.persistence_levels[period.persistence_factor - 1]}
          />
        </>
      )}
    </section>
  );
}

function Factor({ label, factor, text }: { label: string; factor: number; text: string | undefined }) {
  if (text === undefined) throw new Error(`${label}: no rubric level for factor ${factor}`);
  return (
    <div className="rounded-lg border border-line bg-surface-1 p-4">
      <p className="text-xs uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-ink">
        {factor}
        <span className="text-base font-normal text-ink-muted"> of 10</span>
      </p>
      <p className="mt-2 text-sm text-ink-2">{text}</p>
    </div>
  );
}

/** Its influence each year, on the stream's axis, from the year it starts to the present. */
function InfluenceCurve({ data, color }: { data: MusicEntityPageData; color: string }) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<{ k: number; px: number; py: number } | null>(null);
  const { from, values } = data.curve;
  const N = data.timeline.buckets;
  const len = values.length;

  const W = Math.max(width, 300);
  const H = 260;
  const M = { top: 14, right: 10, bottom: 28, left: 10 };
  const fromUnit = from / N;
  const toUnit = (from + len) / N;
  const x = (u: number) => M.left + ((u - fromUnit) / (toUnit - fromUnit || 1)) * (W - M.left - M.right);
  const base = H - M.bottom;
  const max = Math.max(1e-9, ...values);
  const y = (v: number) => base - (v / max) * (base - M.top);
  const px = (k: number) => x((from + k + 0.5) / N);

  const d = useMemo(
    () =>
      area<number>()
        .x((_, k) => px(k))
        .y0(base)
        .y1((v) => y(v))
        .curve(curveMonotoneX)(values) ?? "",
    [values, W],
  );

  const yearOf = (k: number) => unitToYear((from + k + 0.5) / N, data.as_of_year, data.timeline);

  return (
    <figure className="m-0">
      {/* Clipped, so the first paint at the default width cannot widen a phone's page before it is measured. */}
      <div ref={ref} className="relative w-full overflow-hidden">
        <svg
          width={W}
          height={H}
          role="img"
          aria-label={`${data.name}'s influence each year, from ${formatYear(yearOf(0))} to ${data.as_of_year}`}
          onPointerMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const mx = e.clientX - box.left;
            let best = 0;
            for (let k = 1; k < len; k++) if (Math.abs(px(k) - mx) < Math.abs(px(best) - mx)) best = k;
            setHover({ k: best, px: px(best), py: e.clientY - box.top });
          }}
          onPointerLeave={() => setHover(null)}
        >
          <TimeAxis
            asOfYear={data.as_of_year}
            x={x}
            fromUnit={fromUnit}
            toUnit={toUnit}
            top={M.top}
            bottom={base}
            timeline={data.timeline}
          />
          <path d={d} style={{ fill: color }} />
          <line x1={M.left} x2={W - M.right} y1={base} y2={base} stroke="var(--color-line-strong)" />
          {hover && <line x1={hover.px} x2={hover.px} y1={M.top} y2={base} stroke="var(--color-ink-muted)" />}
        </svg>
        {hover && (
          <Tooltip x={hover.px} y={hover.py} width={W} height={H}>
            <p className="flex justify-between gap-2">
              <span className="text-ink-muted">Around {formatYear(yearOf(hover.k))}, per year</span>
              <span className="font-mono text-ink">{formatMagnitude(values[hover.k])}</span>
            </p>
          </Tooltip>
        )}
      </div>
    </figure>
  );
}

/** One bar per dimension, longest at full width, each with what the dimension covers. */
function ProfileBars({ data, color }: { data: MusicEntityPageData; color: string }) {
  const max = Math.max(1e-9, ...data.dimensions.map((d) => data.profile[d.key]));
  return (
    <ul className="space-y-3" aria-label={`${data.name}'s influence by dimension`}>
      {data.dimensions.map((d) => {
        const value = data.profile[d.key];
        return (
          <li key={d.key} className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 sm:grid-cols-[15rem_1fr_4rem]">
            <span className="min-w-0">
              <span className="block text-sm text-ink">{d.label}</span>
              <span className="block text-xs text-ink-muted">{d.meaning}</span>
            </span>
            <span className="h-4 rounded-r bg-surface-2">
              <span className="block h-full rounded-r" style={{ width: `${(value / max) * 100}%`, background: color }} />
            </span>
            <span className="text-right font-mono text-sm text-ink-2">{formatMagnitude(value)}</span>
          </li>
        );
      })}
    </ul>
  );
}

const SHOWN = 10;

function Connections({ data }: { data: MusicEntityPageData }) {
  const groups = RELATIONS.map((r) => ({ ...r, rows: data.connections.filter((c) => c.relation === r.key) })).filter(
    (g) => g.rows.length > 0,
  );
  if (groups.length === 0) return null;
  return (
    <section className="mt-6 grid gap-6 md:grid-cols-2" aria-label="Connections">
      {groups.map((g) => (
        <ConnectionList key={g.key} title={g.title} blurb={g.blurb} rows={g.rows} families={data.families} />
      ))}
    </section>
  );
}

function ConnectionList({
  title,
  blurb,
  rows,
  families,
}: {
  title: string;
  blurb: string;
  rows: MusicEntityPageData["connections"];
  families: MusicEntityPageData["families"];
}) {
  const [all, setAll] = useState(false);
  const shown = all ? rows : rows.slice(0, SHOWN);
  return (
    <div className="min-w-0 rounded-lg border border-line bg-surface-1 p-4">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <p className="mb-3 mt-1 text-sm text-ink-muted">{blurb}</p>
      <ul className="divide-y divide-line text-sm">
        {shown.map((r) => (
          <li key={r.slug} className="flex items-center justify-between gap-3 py-1.5">
            <Link
              to="/music/$slug"
              params={{ slug: r.slug }}
              className="flex min-w-0 items-center gap-1.5 text-ink-2 hover:text-action-ink"
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: shadeColor(r.family, r.shade, families[r.family].shades.length) }}
                aria-hidden="true"
              />
              <span className="truncate">{r.name}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
            </Link>
            <span className="shrink-0 font-mono tabular-nums text-ink">{formatMagnitude(r.magnitude)}</span>
          </li>
        ))}
      </ul>
      {rows.length > SHOWN && (
        <button onClick={() => setAll((v) => !v)} className="mt-2 text-xs text-action-ink hover:underline">
          {all ? "Show fewer" : `Show all ${rows.length.toLocaleString("en-US")}`}
        </button>
      )}
    </div>
  );
}

function Periods({ data }: { data: MusicEntityPageData }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <section className="mt-6 rounded-lg border border-line bg-surface-1 p-4">
      <h2 className="font-display text-lg font-semibold text-ink">Periods and evidence</h2>
      <p className="mb-3 mt-1 text-sm text-ink-muted">
        Each period of its activity, scored from the evidence shown: how deeply it touched the people who heard or
        played it in each dimension, how far it travelled and how long its effects lasted.
      </p>
      <div className="space-y-3">
        {data.periods.map((p, i) => (
          <article key={p.label} className="rounded border border-line bg-surface-2 p-3 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-ink">{p.label}</h3>
              <span className="text-ink-muted">
                {formatSpan(p.start_year, p.end_year, data.as_of_year)} · reach {p.reach_factor}/10 · persistence{" "}
                {p.persistence_factor}/10 · <span className="font-mono text-ink">{formatMagnitude(p.magnitude)}</span>
              </span>
            </div>
            <p className="mt-1 text-ink-2">{p.description}</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
              {data.dimensions.map((d) => (
                <li key={d.key}>
                  {d.label} <span className="font-mono text-ink">{p.levels[d.key].toFixed(1)}</span>/10
                </li>
              ))}
            </ul>
            <button
              onClick={() => toggle(i)}
              aria-expanded={open.has(i)}
              className="mt-2 text-xs text-action-ink hover:underline"
            >
              {open.has(i) ? "Hide" : "Show"} evidence
            </button>
            <div className="collapsible" data-open={open.has(i)}>
              <div>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-ink-muted">{p.evidence}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  Text from{" "}
                  <a href={p.source_url} target="_blank" rel="noreferrer" className="text-action-ink hover:underline">
                    Wikipedia
                  </a>
                  , as it stood when scored,{" "}
                  <a
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                    target="_blank"
                    rel="noreferrer license"
                    className="text-action-ink hover:underline"
                  >
                    CC BY-SA 4.0
                  </a>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
