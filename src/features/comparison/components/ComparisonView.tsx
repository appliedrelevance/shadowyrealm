import { useState, useMemo } from "react";
import { X, Search, User, Building2, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { ImpactRadarChart } from "@/components/ImpactRadarChart";
import { MagnitudeBadge } from "@/components/MagnitudeBadge";
import {
  calculateATIS,
  computeConsensusScores,
  type DimensionalScores,
} from "@/lib/atis-calculator";
import { buildATISInputs } from "@/lib/atis-inputs";
import { seriesColor } from "@/lib/chart-colors";

const typeIcons: Record<string, typeof User> = {
  person: User,
  organization: Building2,
  event: Zap,
};

function useEntityWithScores(entityId: number) {
  return useQuery({
    queryKey: ["entity-comparison", entityId],
    queryFn: async () => {
      const [entityRes, assessRes, periodRes, relRes] = await Promise.all([
        supabase.schema("shadowyrealm").from("entities").select("*").eq("id", entityId).single(),
        supabase.schema("shadowyrealm").from("assessments").select("*").eq("entity_id", entityId),
        supabase.schema("shadowyrealm").from("assessment_periods").select("*").eq("entity_id", entityId),
        supabase
          .schema("shadowyrealm")
          .from("relationships")
          .select("*")
          .or(`source_entity_id.eq.${entityId},target_entity_id.eq.${entityId}`),
      ]);
      if (entityRes.error) throw entityRes.error;
      if (assessRes.error) throw assessRes.error;
      if (periodRes.error) throw periodRes.error;
      if (relRes.error) throw relRes.error;
      return {
        entity: entityRes.data,
        assessments: assessRes.data,
        periods: periodRes.data,
        relationships: relRes.data,
      };
    },
  });
}

function useSearchEntities(query: string) {
  return useQuery({
    queryKey: ["entity-search", query],
    enabled: query.length >= 2,
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("shadowyrealm")
        .from("entities")
        .select("id, name, entity_type")
        .eq("status", "published")
        .ilike("name", `%${query}%`)
        .limit(5);
      if (error) throw error;
      return data;
    },
  });
}

const DIMENSIONS: (keyof DimensionalScores)[] = [
  "scientific",
  "economic",
  "human_rights",
  "health",
  "cultural",
];

export function ComparisonView() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults } = useSearchEntities(searchQuery);

  const addEntity = (id: number) => {
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
    setSearchQuery("");
  };

  const removeEntity = (id: number) => {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-ink">
        Comparative Analysis
      </h1>
      <p className="mt-2 text-ink-muted">
        Select entities to compare side-by-side.
      </p>

      {/* Search and add */}
      <div className="relative mt-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entities to compare..."
              className="w-full rounded border border-line bg-surface-1 py-2 pl-9 pr-3 text-sm text-ink-2 focus:border-action focus:outline-none"
            />
          </div>
        </div>
        {searchResults && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded border border-line bg-surface-1 shadow-lg">
            {searchResults.map((e) => {
              const TypeIcon = typeIcons[e.entity_type] ?? User;
              return (
                <button
                  key={e.id}
                  onClick={() => addEntity(e.id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-2 hover:bg-surface-2"
                >
                  <TypeIcon className="h-4 w-4 text-ink-muted" />
                  <span className="flex-1 text-left">{e.name}</span>
                  <span className="text-xs text-ink-muted capitalize">
                    {e.entity_type}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected entities */}
      {selectedIds.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedIds.map((id, idx) => (
            <EntityTag key={id} entityId={id} color={seriesColor(idx)} onRemove={() => removeEntity(id)} />
          ))}
        </div>
      )}

      {/* Comparison charts */}
      {selectedIds.length >= 2 && (
        <ComparisonCharts entityIds={selectedIds} />
      )}

      {selectedIds.length < 2 && (
        <div className="mt-8 rounded-lg border border-dashed border-line bg-surface-1/50 p-6 text-center">
          <p className="text-ink-muted">
            Search for figures above and add at least two to compare their impact side by side.
          </p>
        </div>
      )}
    </div>
  );
}

function EntityTag({ entityId, color, onRemove }: { entityId: number; color: string; onRemove: () => void }) {
  const { data } = useEntityWithScores(entityId);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
      style={{ borderColor: color, color }}
    >
      {data?.entity.name ?? `Entity ${entityId}`}
      <button onClick={onRemove} className="hover:opacity-70">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function ComparisonCharts({ entityIds }: { entityIds: number[] }) {
  const entityData = entityIds.map((id) => useEntityWithScores(id));
  const allLoaded = entityData.every((d) => d.data);

  const chartData = useMemo(() => {
    if (!allLoaded) return null;

    return entityData.map((d, idx) => {
      const assessments = d.data!.assessments;
      const scores = computeConsensusScores(
        assessments.map((a) => ({
          scores: {
            scientific: a.scientific_score,
            economic: a.economic_score,
            human_rights: a.human_rights_score,
            health: a.health_score,
            cultural: a.cultural_score,
          },
        })),
      );

      const inputs = buildATISInputs(assessments, d.data!.periods, d.data!.relationships);
      const atis = calculateATIS(inputs.assessments, inputs.periods, inputs.relationships);

      return {
        entity: d.data!.entity,
        scores,
        atis,
        color: seriesColor(idx),
      };
    });
  }, [allLoaded, entityData]);

  if (!allLoaded || !chartData) {
    return <p className="mt-8 text-ink-muted">Loading comparison data...</p>;
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Radar overlay */}
      <div className="rounded-lg border border-line bg-surface-1 p-4">
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">
          Dimensional Comparison
        </h3>
        <ImpactRadarChart
          series={chartData.map((d) => ({
            label: d.entity.name,
            scores: d.scores,
            color: d.color,
          }))}
        />
      </div>

      {/* ATIS tiers */}
      <div className="flex flex-wrap gap-4">
        {chartData.map((d) => (
          <div key={d.entity.id} className="flex items-center gap-2">
            <Link to="/entity/$slug" params={{ slug: d.entity.slug }} className="text-sm font-medium text-ink-2 hover:text-action-ink">
              {d.entity.name}
            </Link>
            <MagnitudeBadge tier={d.atis.impact_class.tier} magnitude={d.atis.magnitude} />
          </div>
        ))}
      </div>

      {/* Dimensional differences */}
      <div className="rounded-lg border border-line bg-surface-1 p-4">
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">
          Dimensional Differences
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-ink-muted">
              <th className="pb-2 pr-4 font-medium">Dimension</th>
              {chartData.map((d) => (
                <th key={d.entity.id} className="pb-2 pr-4 font-medium" style={{ color: d.color }}>
                  {d.entity.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((dim) => (
              <tr key={dim} className="border-b border-line/50">
                <td className="py-2 pr-4 capitalize text-ink-muted">
                  {dim.replace("_", " ")}
                </td>
                {chartData.map((d) => {
                  const val = d.scores[dim];
                  return (
                    <td
                      key={d.entity.id}
                      className={`py-2 pr-4 font-mono ${val > 0 ? "text-ok" : val < 0 ? "text-crit" : "text-ink-muted"}`}
                    >
                      {val > 0 ? "+" : ""}
                      {val.toFixed(1)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
