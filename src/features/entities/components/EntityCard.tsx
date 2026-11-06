import { Link } from "@tanstack/react-router";
import { User, Building2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Entity, EntityType, PublicationStatus } from "../types";

const typeIcons: Record<EntityType, typeof User> = {
  person: User,
  organization: Building2,
  event: Zap,
};

const statusColors: Record<PublicationStatus, string> = {
  draft: "bg-tier-minimal text-ink",
  submitted: "bg-info text-ink",
  under_review: "bg-gold text-surface",
  published: "bg-ok text-surface",
  archived: "bg-line text-ink-muted",
};

/** `showStatus` is for the owner; visitors only ever see published entities. */
export function EntityCard({ entity, showStatus }: { entity: Entity; showStatus: boolean }) {
  const Icon = typeIcons[entity.entity_type];

  return (
    <Link
      to="/entity/$slug"
      params={{ slug: entity.slug }}
      className="group block rounded-lg border border-line bg-surface-1 p-4 transition-all duration-200 hover:border-action/50 hover:shadow-lg hover:shadow-action/10"
    >
      <div className="flex gap-4">
        {entity.image_url ? (
          <img
            src={entity.image_url}
            alt={entity.name}
            className="h-20 w-20 shrink-0 rounded border border-line object-cover shadow-md shadow-action/10"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded border border-line bg-surface-2">
            <Icon className="h-8 w-8 text-ink-muted" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-semibold text-ink group-hover:text-action-ink">
              {entity.name}
            </h3>
            {showStatus && (
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-xs font-medium",
                  statusColors[entity.status],
                )}
              >
                {entity.status}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
            <Icon className="h-3.5 w-3.5" />
            <span className="capitalize">{entity.entity_type}</span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
            {entity.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
