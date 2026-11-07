import { createFileRoute } from "@tanstack/react-router";
import { useRealm } from "@/features/realm/api";
import { LineageGraph } from "@/features/realm/LineageGraph";
import { COPY } from "@/lib/copy";
import { usePageTitle } from "@/lib/usePageTitle";

export const Route = createFileRoute("/realm")({
  component: LineagePage,
});

function LineagePage() {
  usePageTitle(COPY.lineage.heading);
  const { data: realm, isLoading, error } = useRealm();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-ink">{COPY.lineage.heading}</h1>
      <p className="mt-2 max-w-3xl text-ink-2">{COPY.lineage.lede}</p>
      <div className="mt-6">
        {error && <p className="text-crit">Failed to load: {error.message}</p>}
        {isLoading && <div className="h-[640px] animate-pulse rounded-lg bg-surface-1" />}
        {realm && <LineageGraph realm={realm} />}
      </div>
    </div>
  );
}
