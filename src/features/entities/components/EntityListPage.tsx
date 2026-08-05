import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { useEntities } from "../hooks/useEntities";
import { EntityCard } from "./EntityCard";
import { EntityCardSkeleton } from "@/components/Skeleton";
import { RefreshCw } from "lucide-react";
import type { EntitySort, EntityType, PublicationStatus } from "../types";

const PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;

const sortOptions: { value: EntitySort; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
];

const entityTypes: { value: EntityType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "person", label: "Persons" },
  { value: "organization", label: "Organizations" },
  { value: "event", label: "Events" },
];

const statuses: { value: PublicationStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "archived", label: "Archived" },
];

export function EntityListPage() {
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState<EntityType | "">("");
  const [statusFilter, setStatusFilter] = useState<PublicationStatus | "">("");
  const [sort, setSort] = useState<EntitySort>("newest");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search input so we don't query on every keystroke
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data, isLoading, error } = useEntities({
    entityType: typeFilter || undefined,
    status: statusFilter || undefined,
    search: search || undefined,
    sort,
    page,
    perPage: PER_PAGE,
  });

  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-bright">
            {COPY.home.heading}
          </h1>
          <p className="mt-1 text-text-muted">
            {COPY.home.subtitle}
          </p>
        </div>
        {user && (
          <Link
            to="/entity/new"
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-text-bright hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            {COPY.home.addFigure}
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={COPY.home.searchPlaceholder}
            aria-label={COPY.home.searchPlaceholder}
            className="w-full rounded border border-realm-border bg-realm-surface py-2 pl-9 pr-8 text-sm text-text placeholder:text-text-muted focus:border-arcane-purple focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as EntityType | "");
            setPage(1);
          }}
          className="rounded border border-realm-border bg-realm-surface px-3 py-2 text-sm text-text focus:border-arcane-purple focus:outline-none"
        >
          {entityTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as PublicationStatus | "");
            setPage(1);
          }}
          className="rounded border border-realm-border bg-realm-surface px-3 py-2 text-sm text-text focus:border-arcane-purple focus:outline-none"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as EntitySort);
            setPage(1);
          }}
          aria-label="Sort entities"
          className="rounded border border-realm-border bg-realm-surface px-3 py-2 text-sm text-text focus:border-arcane-purple focus:outline-none"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {error && (
        <div className="mt-8 text-center">
          <p className="text-destructive">
            Failed to load entities: {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex items-center gap-1 rounded border border-realm-border px-3 py-1.5 text-sm text-text-muted hover:border-arcane-purple hover:text-text"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EntityCardSkeleton key={i} />
          ))}
        </div>
      )}

      {data && data.entities.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-text-muted">
            {search
              ? `${COPY.home.noResults} "${search}"`
              : COPY.home.empty}
          </p>
          {user && !search && (
            <Link
              to="/entity/new"
              className="mt-3 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-text-bright hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
              Create the first entry
            </Link>
          )}
        </div>
      )}

      {data && data.entities.length > 0 && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.entities.map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  "flex items-center gap-1 rounded border border-realm-border px-3 py-1.5 text-sm",
                  page === 1
                    ? "cursor-not-allowed text-text-muted opacity-50"
                    : "text-text hover:border-arcane-purple",
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={cn(
                  "flex items-center gap-1 rounded border border-realm-border px-3 py-1.5 text-sm",
                  page === totalPages
                    ? "cursor-not-allowed text-text-muted opacity-50"
                    : "text-text hover:border-arcane-purple",
                )}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
