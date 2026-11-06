import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { User, Building2, Zap, Calendar, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { COPY } from "@/lib/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import {
  calculateATIS,
  computeConsensusScores,
  getAchievements,
} from "@/lib/atis-calculator";
import { buildATISInputs } from "@/lib/atis-inputs";
import { useEntity } from "../hooks/useEntities";
import { useAssessments, useAssessmentPeriods, useRelationships } from "@/features/scoring/hooks/useAssessments";
import { useOperator } from "../hooks/useEntityMutations";
import { StatusWorkflow } from "./StatusWorkflow";
import { ImpactRadarChart } from "@/components/ImpactRadarChart";
import { StatBlock } from "@/components/StatBlock";
import { MagnitudeBadge } from "@/components/MagnitudeBadge";
import { AchievementList } from "@/components/AchievementList";
import { ATISBreakdown } from "@/components/ATISBreakdown";
import { EntityProfileSkeleton } from "@/components/Skeleton";
import { RefreshCw } from "lucide-react";
import type { EntityType, PublicationStatus } from "../types";

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

function MetadataField({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-ink-muted" />
      <span className="text-ink-muted">{label}:</span>
      <span className="text-ink-2">{value}</span>
    </div>
  );
}

export function EntityProfilePage({ slug }: { slug: string }) {
  const { data: isOperator } = useOperator();
  const { data: entity, isLoading, error } = useEntity(slug);
  usePageTitle(entity ? entity.name : isLoading ? undefined : COPY.entity.notFound);

  if (isLoading) {
    return <EntityProfileSkeleton />;
  }

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

  if (!entity) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-ink">
          {COPY.entity.notFound}
        </h1>
        <p className="mt-4 text-ink-muted">
          {COPY.entity.notFoundDescription}
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-action-ink hover:underline"
        >
          {COPY.entity.returnToIndex}
        </Link>
      </div>
    );
  }

  const entityType = entity.entity_type as EntityType;
  const entityStatus = entity.status as PublicationStatus;
  const Icon = typeIcons[entityType];
  const metadata = (entity.metadata ?? {}) as Record<string, string>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row">
        {/* Entity Image */}
        <div className="shrink-0">
          {entity.image_url ? (
            <img
              src={entity.image_url}
              alt={entity.name}
              className="h-40 w-40 rounded-lg border-2 border-line object-cover shadow-lg shadow-action/20"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-line bg-surface-2 shadow-lg shadow-action/20">
              <Icon className="h-16 w-16 text-ink-muted" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">
                {entity.name}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm text-ink-muted">
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{entityType}</span>
                </span>
                {isOperator && (
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-medium transition-colors duration-200",
                      statusColors[entityStatus],
                    )}
                  >
                    {entityStatus}
                  </span>
                )}
              </div>
            </div>

            {isOperator && (
              <div className="flex items-center gap-2">
                <StatusWorkflow entity={entity} />
              </div>
            )}
          </div>

          <p className="mt-4 text-ink-2">{entity.description}</p>
        </div>
      </div>

      {/* Type-specific metadata */}
      {Object.keys(metadata).length > 0 && (
        <div className="mt-8 rounded-lg border border-line bg-surface-1 p-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Details
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {metadata.birth_date && (
              <MetadataField icon={Calendar} label="Born" value={metadata.birth_date} />
            )}
            {metadata.death_date && (
              <MetadataField icon={Calendar} label="Died" value={metadata.death_date} />
            )}
            {metadata.nationality && (
              <MetadataField icon={Globe} label="Nationality" value={metadata.nationality} />
            )}
            {metadata.founded_date && (
              <MetadataField icon={Calendar} label="Founded" value={metadata.founded_date} />
            )}
            {metadata.headquarters && (
              <MetadataField icon={MapPin} label="Headquarters" value={metadata.headquarters} />
            )}
            {metadata.organization_type && (
              <MetadataField icon={Building2} label="Type" value={metadata.organization_type} />
            )}
            {metadata.start_date && (
              <MetadataField icon={Calendar} label="Start" value={metadata.start_date} />
            )}
            {metadata.end_date && (
              <MetadataField icon={Calendar} label="End" value={metadata.end_date} />
            )}
            {metadata.location && (
              <MetadataField icon={MapPin} label="Location" value={metadata.location} />
            )}
            {metadata.event_type && (
              <MetadataField icon={Zap} label="Event Type" value={metadata.event_type} />
            )}
          </div>
        </div>
      )}

      {/* Biography */}
      {entity.biography && (
        <div className="mt-8 rounded-lg border border-line bg-surface-1 p-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Biography
          </h2>
          <div className="prose mt-3 max-w-none">
            <p>{entity.biography}</p>
          </div>
        </div>
      )}

      {/* Character Sheet - Impact Scores */}
      <CharacterSheet entityId={entity.id} />
    </div>
  );
}

function CharacterSheet({ entityId }: { entityId: number }) {
  const { data: assessments } = useAssessments(entityId);
  const { data: periods } = useAssessmentPeriods(entityId);
  const { data: relationships } = useRelationships(entityId);
  const [openJustifications, setOpenJustifications] = useState<Set<number>>(new Set());

  const atisResult = useMemo(() => {
    if (!assessments || assessments.length === 0) return null;

    const inputs = buildATISInputs(assessments, periods ?? [], [
      ...(relationships?.outgoing ?? []),
      ...(relationships?.incoming ?? []),
    ]);

    return calculateATIS(inputs.assessments, inputs.periods, inputs.relationships);
  }, [assessments, periods, relationships]);

  const consensusScores = useMemo(() => {
    if (!assessments || assessments.length === 0) return null;
    return computeConsensusScores(
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
  }, [assessments]);

  const achievements = useMemo(() => {
    if (!consensusScores) return [];
    return getAchievements(consensusScores);
  }, [consensusScores]);

  if (!assessments || assessments.length === 0) {
    return (
      <p className="mt-8 rounded-lg border border-dashed border-line bg-surface-1/50 p-6 text-center text-ink-muted">
        No impact assessments yet.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* ATIS Badge + Stat Block + Radar */}
      {atisResult && consensusScores && (
        <>
          <div className="flex items-center gap-4">
            <MagnitudeBadge
              tier={atisResult.impact_class.tier}
              magnitude={atisResult.magnitude}
            />
            <span className="text-sm text-ink-muted">
              {atisResult.impact_class.descriptor}
            </span>
          </div>

          {achievements.length > 0 && <AchievementList achievements={achievements} />}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface-1 p-4">
              <h3 className="mb-3 font-display text-lg font-semibold text-ink">
                Dimensional Scores
              </h3>
              <StatBlock scores={consensusScores} />
              {assessments.length > 1 && (
                <p className="mt-2 text-xs text-ink-muted">
                  Consensus of {assessments.length} assessments
                </p>
              )}
            </div>

            <div className="rounded-lg border border-line bg-surface-1 p-4">
              <h3 className="mb-3 font-display text-lg font-semibold text-ink">
                Impact Profile
              </h3>
              <ImpactRadarChart
                series={[
                  {
                    label: "Consensus",
                    scores: consensusScores,
                    color: "var(--color-action)",
                  },
                ]}
              />
            </div>
          </div>

          {/* ATIS Breakdown */}
          <div className="rounded-lg border border-line bg-surface-1 p-4">
            <h3 className="mb-3 font-display text-lg font-semibold text-ink">
              ATIS Calculation Breakdown
            </h3>
            <ATISBreakdown breakdown={atisResult.breakdown} tail={atisResult.tail} />
            {atisResult.unplaced_assessments > 0 && (
              <p className="mt-3 text-sm text-warn">
                {atisResult.unplaced_assessments} assessment
                {atisResult.unplaced_assessments === 1 ? " is" : "s are"} not attached to a
                period and {atisResult.unplaced_assessments === 1 ? "is" : "are"} not counted.
              </p>
            )}
            <p className="mt-3 text-xs text-ink-muted">
              Score: {atisResult.overall_score.toFixed(1)} influence-centuries up to{" "}
              {atisResult.as_of_year}
              &nbsp;|&nbsp; Peak level {atisResult.peak_level.toFixed(1)}
              &nbsp;|&nbsp; Level now {atisResult.current_level.toFixed(1)}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Level = I_base × C_consensus × N_network × U_uncertainty; score = area under
              the level curve &nbsp;|&nbsp; Algorithm v{atisResult.algorithm_version}
            </p>
          </div>
        </>
      )}

      {/* Assessment periods */}
      {periods && periods.length > 0 && (
        <div className="rounded-lg border border-line bg-surface-1 p-4">
          <h3 className="mb-3 font-display text-lg font-semibold text-ink">
            Assessment Periods
          </h3>
          <div className="space-y-2">
            {periods.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded border border-line/50 bg-surface-2 px-3 py-2 text-sm"
              >
                <span className="font-medium text-ink-2">{p.label}</span>
                <span className="text-ink-muted">
                  {p.start_year} – {p.end_year} | Reach: {p.reach_factor} | Persistence: {p.persistence_factor}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score history */}
      <div className="rounded-lg border border-line bg-surface-1 p-4">
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">
          Score History
        </h3>
        <div className="space-y-3">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="rounded border border-line/50 bg-surface-2 p-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-3 font-mono">
                {[
                  { label: "SCI", value: a.scientific_score },
                  { label: "ECO", value: a.economic_score },
                  { label: "HUM", value: a.human_rights_score },
                  { label: "HLT", value: a.health_score },
                  { label: "CUL", value: a.cultural_score },
                ].map((s) => (
                  <span key={s.label} className={s.value > 0 ? "text-ok" : s.value < 0 ? "text-crit" : "text-ink-muted"}>
                    {s.label}:{s.value > 0 ? "+" : ""}{s.value}
                  </span>
                ))}
                <span className="ml-auto text-xs">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => setOpenJustifications((prev) => {
                  const next = new Set(prev);
                  if (next.has(a.id)) next.delete(a.id);
                  else next.add(a.id);
                  return next;
                })}
                className="mt-2 cursor-pointer text-xs text-action-ink hover:underline"
              >
                {openJustifications.has(a.id) ? "Hide" : "View"} justifications
              </button>
              <div className="collapsible" data-open={openJustifications.has(a.id)}>
                <div>
                  <div className="mt-2 space-y-1 text-xs text-ink-muted">
                    <p><strong>Scientific:</strong> {a.scientific_justification}</p>
                    <p><strong>Economic:</strong> {a.economic_justification}</p>
                    <p><strong>Human Rights:</strong> {a.human_rights_justification}</p>
                    <p><strong>Health:</strong> {a.health_justification}</p>
                    <p><strong>Cultural:</strong> {a.cultural_justification}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
