import { Send, CheckCircle, Archive, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { useUpdateEntityStatus } from "../hooks/useEntityMutations";
import type { Entity, PublicationStatus } from "../types";

interface StatusTransition {
  from: PublicationStatus;
  to: PublicationStatus;
  label: string;
  icon: typeof Send;
  className: string;
}

const transitions: StatusTransition[] = [
  {
    from: "draft",
    to: "submitted",
    label: "Submit for Review",
    icon: Send,
    className: "bg-info hover:bg-info/80",
  },
  {
    from: "submitted",
    to: "under_review",
    label: "Begin Review",
    icon: CheckCircle,
    className: "bg-gold text-surface hover:bg-gold-light",
  },
  {
    from: "under_review",
    to: "published",
    label: "Publish",
    icon: CheckCircle,
    className: "bg-ok text-surface hover:bg-ok/80",
  },
  {
    from: "published",
    to: "archived",
    label: "Archive",
    icon: Archive,
    className: "bg-line hover:bg-line/80",
  },
];

export function StatusWorkflow({ entity }: { entity: Entity }) {
  const mutation = useUpdateEntityStatus();
  const { toast } = useToast();

  const available = transitions.filter((t) => t.from === entity.status);

  if (available.length === 0) return null;

  return (
    <div className="flex gap-2">
      {available.map((transition) => {
        const Icon = transition.icon;
        const isLoading =
          mutation.isPending &&
          mutation.variables?.newStatus === transition.to;

        return (
          <button
            key={transition.to}
            onClick={() =>
              mutation.mutate(
                {
                  entityId: entity.id,
                  slug: entity.slug,
                  oldStatus: entity.status,
                  newStatus: transition.to,
                },
                {
                  onSuccess: () => toast(`Status updated to ${transition.to.replace("_", " ")}`),
                },
              )
            }
            disabled={mutation.isPending}
            className={cn(
              "flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium text-ink disabled:opacity-50",
              transition.className,
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
            {transition.label}
          </button>
        );
      })}
      {mutation.isError && (
        <p className="text-sm text-crit">
          {mutation.error.message}
        </p>
      )}
    </div>
  );
}
