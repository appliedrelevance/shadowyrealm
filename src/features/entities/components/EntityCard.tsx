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
  draft: "bg-tier-minimal text-text-bright",
  submitted: "bg-arcane-blue text-text-bright",
  under_review: "bg-shadow-gold text-realm-bg",
  published: "bg-spectral-green text-realm-bg",
  archived: "bg-realm-border text-text-muted",
};

export function EntityCard({ entity }: { entity: Entity }) {
  const Icon = typeIcons[entity.entity_type];

  return (
    <Link
      to="/entity/$slug"
      params={{ slug: entity.slug }}
      className="group block rounded-lg border border-realm-border bg-realm-surface p-4 transition hover:border-arcane-purple/50 hover:shadow-lg hover:shadow-arcane-purple/10"
    >
      <div className="flex gap-4">
        {entity.image_url ? (
          <img
            src={entity.image_url}
            alt={entity.name}
            className="h-20 w-20 shrink-0 rounded border border-realm-border object-cover shadow-md shadow-arcane-purple/10"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded border border-realm-border bg-realm-surface-raised">
            <Icon className="h-8 w-8 text-text-muted" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-semibold text-text-bright group-hover:text-arcane-purple-light">
              {entity.name}
            </h3>
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-xs font-medium",
                statusColors[entity.status],
              )}
            >
              {entity.status}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-text-muted">
            <Icon className="h-3.5 w-3.5" />
            <span className="capitalize">{entity.entity_type}</span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-text-muted">
            {entity.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
