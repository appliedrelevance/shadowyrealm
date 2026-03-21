import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useEntities } from "../hooks/useEntities";
import { EntityCard } from "./EntityCard";
import type { EntityType, PublicationStatus } from "../types";

const PER_PAGE = 12;

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
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useEntities({
    entityType: typeFilter || undefined,
    status: statusFilter || undefined,
    page,
    perPage: PER_PAGE,
  });

  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-bright">
            Arcane Archives
          </h1>
          <p className="mt-1 text-text-muted">
            Browse entities across the ages
          </p>
        </div>
        {user && (
          <Link
            to="/entity/new"
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-text-bright hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Summon Entity
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mt-6 flex gap-3">
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
      </div>

      {/* Results */}
      {error && (
        <p className="mt-8 text-destructive">
          Failed to load entities: {error.message}
        </p>
      )}

      {isLoading && (
        <p className="mt-8 text-text-muted">Summoning entities...</p>
      )}

      {data && data.entities.length === 0 && (
        <p className="mt-8 text-text-muted">
          No entities found. The archives are empty.
        </p>
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
