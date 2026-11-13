import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink, RefreshCw } from "lucide-react";
import { MagnitudeBadge } from "@/components/MagnitudeBadge";
import { EntityProfileSkeleton } from "@/components/Skeleton";
import { useEntityProfile, type EntityProfile } from "@/features/realm/api";
import { formatMagnitude } from "@/features/realm/chart";
import { InfluenceCurve, ProfileBars } from "@/features/realm/ProfileCharts";
import { typeIcons } from "@/features/realm/RealmHome";
import { COPY } from "@/lib/copy";
import { dimensionCountWords, SITE } from "@/lib/site";
import { creditTypes, linkLabels } from "@/sites";
import { formatSpan, formatYear } from "@/lib/timeline";
import { usePageTitle } from "@/lib/usePageTitle";
import { useOperator } from "../hooks/useEntityMutations";
import { StatusWorkflow } from "./StatusWorkflow";

export function EntityProfilePage({ slug }: { slug: string }) {
  const { data: isOperator } = useOperator();
  const { data: profile, isLoading, error } = useEntityProfile(slug);
  usePageTitle(profile ? profile.entity.name : isLoading ? undefined : COPY.entity.notFound);

  if (isLoading) return <EntityProfileSkeleton />;

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

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-ink">{COPY.entity.notFound}</h1>
        <p className="mt-4 text-ink-muted">{COPY.entity.notFoundDescription}</p>
        <Link to="/" className="mt-4 inline-block text-action-ink hover:underline">
          {COPY.entity.returnToIndex}
        </Link>
      </div>
    );
  }

  const { entity, score } = profile;
  const Icon = typeIcons[entity.entity_type];
  const metadata = (entity.metadata ?? {}) as Record<string, string>;
  const periods = profile.periods;
  const first = periods[0]?.start_year;
  const last = periods.length > 0 ? Math.max(...periods.map((p) => p.end_year)) : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink-2">
        <ArrowLeft className="h-4 w-4" /> {COPY.entity.returnToIndex}
      </Link>

      <header className="mt-4 flex flex-col gap-6 border-b border-line pb-8 sm:flex-row">
        <div className="shrink-0">
          {entity.image_url ? (
            <img
              src={entity.image_url}
              alt={entity.name}
              className="h-36 w-36 rounded-lg border-2 border-line object-cover shadow-lg shadow-action/20"
            />
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-lg border-2 border-line bg-surface-2">
              <Icon className="h-14 w-14 text-ink-muted" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">{entity.name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                <Icon className="h-4 w-4" />
                <span className="capitalize">{entity.entity_type}</span>
                {first !== undefined && last !== undefined && <span>· {formatSpan(first, last, profile.as_of_year)}</span>}
                {isOperator && <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">{entity.status}</span>}
              </p>
            </div>
            {isOperator && <StatusWorkflow slug={entity.slug} status={entity.status} />}
          </div>
          <p className="mt-4 text-ink-2">{entity.description}</p>
          {metadata.wikipedia_url && (
            <a
              href={metadata.wikipedia_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-action-ink hover:underline"
            >
              Wikipedia <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Score">
        <div className="rounded-lg border border-line bg-surface-1 p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Total influence</p>
          <p className="mt-1 text-5xl font-semibold text-ink">{formatMagnitude(score.total_magnitude)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <MagnitudeBadge tier={score.tier} magnitude={score.total_magnitude} showMagnitude={false} />
            <span className="text-sm text-ink-muted">{score.descriptor}</span>
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            Own {formatMagnitude(score.own_magnitude)} · credited from consequences{" "}
            {formatMagnitude(score.credited_magnitude)} · in {SITE.scoring.unit.name}
          </p>
        </div>
        <Stat label="Benefit" value={score.benefit_total} swatch="bg-benefit" />
        <Stat label="Harm" value={score.harm_total} swatch="bg-harm" />
      </section>

      <section className="mt-6 rounded-lg border border-line bg-surface-1 p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Influence over time</h2>
        <p className="mb-3 mt-1 text-sm text-ink-muted">
          {score.tail
            ? score.tail.kept < 1
              ? `Its own periods, then ${Math.round(score.tail.kept * 100)}% of its legacy fading from ${formatYear(score.tail.from_year)}; its consequences carry the rest as credit.`
              : `Its own periods, then a legacy fading from ${formatYear(score.tail.from_year)}.`
            : score.credited_magnitude > 0
              ? "Its own periods, plus the share of its consequences' influence credited back to it."
              : "Its own periods."}
        </p>
        <InfluenceCurve profile={profile} />
      </section>

      <section className="mt-6 rounded-lg border border-line bg-surface-1 p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Impact profile</h2>
        <p className="mb-3 mt-1 text-sm text-ink-muted">
          Benefit and harm for each of the {dimensionCountWords()} dimensions, in {SITE.scoring.unit.name}. They are never
          netted.
        </p>
        <ProfileBars profile={profile} />
      </section>

      <Lineage profile={profile} />
      <Periods profile={profile} />

      <p className="mt-8 text-xs text-ink-muted">
        Algorithm v{score.algorithm_version} ·{" "}
        <Link to="/methodology" className="text-action-ink hover:underline">
          how the score works
        </Link>
      </p>
    </div>
  );
}

function Stat({ label, value, swatch }: { label: string; value: number; swatch: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-1 p-4">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink-muted">
        <span className={`inline-block h-2.5 w-2.5 rounded-sm ${swatch}`} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold text-ink">{formatMagnitude(value)}</p>
    </div>
  );
}

const CREDIT = creditTypes(SITE);

type ProfileLink = EntityProfile["links"][number];

/** A link's label from this profile's side: the cause's label when it points away, the consequence's when it points here. */
function labelFor(profile: EntityProfile, l: ProfileLink): string {
  const target = l.direction === "outgoing" ? l.other.entity_type : profile.entity.entity_type;
  const labels = linkLabels(SITE, l.relationship_type, target);
  return l.direction === "outgoing" ? labels.cause : labels.consequence;
}

/** The direct credit link to another entity, labelled from this side, when there is one. */
function directLabel(profile: EntityProfile, slug: string, direction: ProfileLink["direction"]): string | undefined {
  const l = profile.links.find((x) => x.other.slug === slug && x.direction === direction && CREDIT.has(x.relationship_type));
  return l ? labelFor(profile, l) : undefined;
}

function Lineage({ profile }: { profile: EntityProfile }) {
  const descriptive = profile.links.filter((l) => !CREDIT.has(l.relationship_type));
  if (profile.contributors.length === 0 && profile.credits.length === 0 && descriptive.length === 0) return null;
  return (
    <section className="mt-6 grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-line bg-surface-1 p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Draws credit from</h2>
        <p className="mb-3 mt-1 text-sm text-ink-muted">Its consequences, and the share of each credited back to it.</p>
        {profile.contributors.length === 0 ? (
          <p className="text-sm text-ink-muted">Nothing in the index is credited to it.</p>
        ) : (
          <LineageList rows={profile.contributors.map((r) => ({ ...r, label: directLabel(profile, r.slug, "outgoing") }))} />
        )}
      </div>
      <div className="rounded-lg border border-line bg-surface-1 p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Passes credit to</h2>
        <p className="mb-3 mt-1 text-sm text-ink-muted">Its causes, and how much of its own influence each receives.</p>
        {profile.credits.length === 0 ? (
          <p className="text-sm text-ink-muted">No cause of it is in the index.</p>
        ) : (
          <LineageList rows={profile.credits.map((r) => ({ ...r, label: directLabel(profile, r.slug, "incoming") }))} />
        )}
      </div>
      {descriptive.length > 0 && (
        <div className="rounded-lg border border-line bg-surface-1 p-4 md:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink">Other links</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {descriptive.map((l) => (
              <li key={`${l.direction}-${l.other.slug}-${l.relationship_type}`}>
                <span className="text-ink-muted">{labelFor(profile, l)}</span>{" "}
                <Link to="/entity/$slug" params={{ slug: l.other.slug }} className="text-action-ink hover:underline">
                  {l.other.name}
                </Link>
                <span className="text-ink-muted"> — {l.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function LineageList({
  rows,
}: {
  rows: { slug: string; name: string; share: number; magnitude: number; label?: string }[];
}) {
  return (
    <ul className="divide-y divide-line text-sm">
      {rows.map((r) => (
        <li key={r.slug} className="flex items-center justify-between gap-3 py-1.5">
          <Link
            to="/entity/$slug"
            params={{ slug: r.slug }}
            className="flex min-w-0 items-center gap-1 truncate text-ink-2 hover:text-action-ink"
          >
            {r.label && <span className="shrink-0 text-ink-muted">{r.label}</span>}
            <span className="truncate">{r.name}</span> <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
          </Link>
          <span className="shrink-0 text-ink-muted">
            {Math.round(r.share * 1000) / 10}% ·{" "}
            <span className="font-mono tabular-nums text-ink">{formatMagnitude(r.magnitude)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Periods({ profile }: { profile: EntityProfile }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  if (profile.periods.length === 0) return null;
  const toggle = (id: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <section className="mt-6 rounded-lg border border-line bg-surface-1 p-4">
      <h2 className="font-display text-lg font-semibold text-ink">Periods and evidence</h2>
      <p className="mb-3 mt-1 text-sm text-ink-muted">
        Each period of its direct activity, scored by Cloudflare's Clef model from the evidence shown.
      </p>
      <div className="space-y-3">
        {profile.periods.map((p) => {
          const a = p.assessments[0];
          return (
            <article key={p.id} className="rounded border border-line bg-surface-2 p-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium text-ink">{p.label}</h3>
                <span className="text-ink-muted">
                  {formatSpan(p.start_year, p.end_year, profile.as_of_year)} · reach {p.reach_factor}/10 · persistence{" "}
                  {p.persistence_factor}/10 · <span className="font-mono text-ink">{formatMagnitude(p.magnitude)}</span>
                </span>
              </div>
              {p.description && <p className="mt-1 text-ink-2">{p.description}</p>}
              {a ? (
                <>
                  <button
                    onClick={() => toggle(p.id)}
                    aria-expanded={open.has(p.id)}
                    className="mt-2 text-xs text-action-ink hover:underline"
                  >
                    {open.has(p.id) ? "Hide" : "Show"} evidence
                  </button>
                  <div className="collapsible" data-open={open.has(p.id)}>
                    <div>
                      <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-ink-muted">{a.evidence}</p>
                      <p className="mt-2 text-xs text-ink-muted">
                        {a.model} · confidence {a.confidence_level ?? "—"}
                        {a.sources?.[0] && (
                          <>
                            {" · text from "}
                            <a href={a.sources[0]} target="_blank" rel="noreferrer" className="text-action-ink hover:underline">
                              Wikipedia
                            </a>
                            {", "}
                            <a
                              href="https://creativecommons.org/licenses/by-sa/4.0/"
                              target="_blank"
                              rel="noreferrer license"
                              className="text-action-ink hover:underline"
                            >
                              CC BY-SA 4.0
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs text-ink-muted">Not scored yet.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
