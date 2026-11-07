import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, RefreshCw, Search, User, Zap } from "lucide-react";
import gateOfTheRealm from "@/assets/gate-of-the-realm.jpg";
import { MagnitudeBadge } from "@/components/MagnitudeBadge";
import { useOperator } from "@/features/entities/hooks/useEntityMutations";
import { COPY } from "@/lib/copy";
import { formatSpan } from "@/lib/timeline";
import { usePageTitle } from "@/lib/usePageTitle";
import { cn } from "@/lib/utils";
import { useRealm, type Realm, type RealmEntity } from "./api";
import { formatMagnitude } from "./chart";
import { ImpactRiver } from "./ImpactRiver";

type TypeFilter = "" | RealmEntity["entity_type"];

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "person", label: "People" },
  { value: "organization", label: "Organizations" },
  { value: "event", label: "Events" },
];

export const typeIcons = { person: User, organization: Building2, event: Zap } as const;

export function RealmHome() {
  usePageTitle();
  const { data: realm, isLoading, error } = useRealm();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">{COPY.home.heading}</h1>
          <p className="mt-3 text-ink-2">{COPY.home.lede}</p>
          {realm && (
            <p className="mt-3 text-sm text-ink-muted">
              {realm.entities.length} entities · {realm.links.length} links of cause and consequence · scored to{" "}
              {realm.as_of_year}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link to="/realm" className="inline-flex items-center gap-1 text-action-ink hover:underline">
              {COPY.home.toLineage} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/methodology" className="inline-flex items-center gap-1 text-action-ink hover:underline">
              {COPY.home.toMethod} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <img
          src={gateOfTheRealm}
          alt={COPY.home.heroAlt}
          width={512}
          height={512}
          className="hidden w-56 rounded-lg border border-line shadow-lg shadow-crit/25 md:block"
        />
      </header>

      <section className="mt-8 rounded-lg border border-line bg-surface-1 p-4" aria-labelledby="river-heading">
        <h2 id="river-heading" className="font-display text-lg font-semibold text-ink">
          {COPY.home.riverHeading}
        </h2>
        <p className="mb-3 mt-1 text-sm text-ink-muted">{COPY.home.riverSubtitle}</p>
        {error && <LoadError message={error.message} />}
        {isLoading && <div className="h-[480px] animate-pulse rounded bg-surface-2" />}
        {realm && realm.entities.length > 0 && <ImpactRiver realm={realm} />}
        {realm && realm.entities.length === 0 && <p className="py-12 text-center text-ink-muted">{COPY.home.empty}</p>}
      </section>

      {realm && realm.entities.length > 0 && <IndexTable realm={realm} />}
    </div>
  );
}

function LoadError({ message }: { message: string }) {
  return (
    <div className="py-8 text-center">
      <p className="text-crit">Failed to load: {message}</p>
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

function IndexTable({ realm }: { realm: Realm }) {
  const { data: isOperator } = useOperator();
  const [type, setType] = useState<TypeFilter>("");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return realm.entities
      .map((e, i) => ({ entity: e, rank: i + 1 }))
      .filter(({ entity }) => (!type || entity.entity_type === type) && (!q || entity.name.toLowerCase().includes(q)));
  }, [realm, type, query]);
  const max = Math.max(1, ...realm.entities.map((e) => e.total_magnitude));

  return (
    <section className="mt-10" aria-labelledby="index-heading">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="index-heading" className="font-display text-2xl font-bold text-ink">
            {COPY.home.indexHeading}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{COPY.home.indexSubtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              aria-pressed={type === f.value}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                type === f.value
                  ? "border-action bg-action-soft text-ink"
                  : "border-line text-ink-muted hover:border-line-strong hover:text-ink-2",
              )}
            >
              {f.label}
            </button>
          ))}
          <label className="relative">
            <span className="sr-only">Search by name</span>
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-ink-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-40 rounded-full border border-line bg-surface-1 py-1 pl-8 pr-3 text-sm text-ink-2 focus:border-action focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-1 text-left text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th scope="col" className="w-12 px-3 py-2 text-right font-medium">#</th>
              <th scope="col" className="px-3 py-2 font-medium">Entity</th>
              <th scope="col" className="px-3 py-2 font-medium">When</th>
              <th scope="col" className="w-[30%] px-3 py-2 font-medium">Benefit · Harm</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Influence</th>
              <th scope="col" className="px-3 py-2 font-medium">Tier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ entity: e, rank }) => {
              const Icon = typeIcons[e.entity_type];
              const scale = e.total_magnitude / max;
              const benefitShare = e.total_magnitude > 0 ? e.benefit_total / e.total_magnitude : 0;
              return (
                <tr key={e.slug} className="border-t border-line hover:bg-surface-1">
                  <td className="px-3 py-2 text-right font-mono tabular-nums text-ink-muted">{rank}</td>
                  <td className="px-3 py-2">
                    <Link
                      to="/entity/$slug"
                      params={{ slug: e.slug }}
                      className="flex items-center gap-2 font-medium text-ink hover:text-action-ink"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-ink-muted" aria-label={e.entity_type} />
                      {e.name}
                      {isOperator && "status" in e && e.status !== "published" && (
                        <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs font-normal text-ink-muted">
                          {e.status}
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-ink-muted">
                    {e.first_year !== null ? formatSpan(e.first_year, e.last_year!, realm.as_of_year) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div
                      className="flex h-2.5 gap-[2px]"
                      style={{ width: `${Math.max(scale * 100, 1.5)}%` }}
                      title={`Benefit ${formatMagnitude(e.benefit_total)} · harm ${formatMagnitude(e.harm_total)}`}
                    >
                      <span className="h-full rounded-l-sm bg-benefit" style={{ width: `${benefitShare * 100}%` }} />
                      <span className="h-full flex-1 rounded-r-sm bg-harm" />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums text-ink">
                    {formatMagnitude(e.total_magnitude)}
                  </td>
                  <td className="px-3 py-2">
                    <MagnitudeBadge tier={e.tier} magnitude={e.total_magnitude} showMagnitude={false} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-sm text-ink-muted">No entities match.</p>}
      </div>
    </section>
  );
}
