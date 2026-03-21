import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { User, Building2, Zap, Edit, Calendar, MapPin, Globe, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  calculateATIS,
  computeConsensusScores,
  getAchievements,
  type AssessmentInput,
  type PeriodInput,
  type RelationshipInput,
} from "@/lib/atis-calculator";
import { useEntity } from "../hooks/useEntities";
import { useAssessments, useAssessmentPeriods, useRelationships } from "@/features/scoring/hooks/useAssessments";
import { StatusWorkflow } from "./StatusWorkflow";
import { ImpactRadarChart } from "@/components/ImpactRadarChart";
import { StatBlock } from "@/components/StatBlock";
import { MagnitudeBadge } from "@/components/MagnitudeBadge";
import { AchievementList } from "@/components/AchievementList";
import { ATISBreakdown } from "@/components/ATISBreakdown";
import { ScoringForm } from "@/features/scoring/components/ScoringForm";
import { PeriodForm } from "@/features/scoring/components/PeriodForm";
import type { EntityType, PublicationStatus } from "../types";

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

function MetadataField({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-text-muted" />
      <span className="text-text-muted">{label}:</span>
      <span className="text-text">{value}</span>
    </div>
  );
}

export function EntityProfilePage({ slug }: { slug: string }) {
  const { user } = useAuth();
  const { data: entity, isLoading, error } = useEntity(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-text-muted">Consulting the archives...</p>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-text-bright">
          Entity Not Found
        </h1>
        <p className="mt-4 text-text-muted">
          This entity does not exist in the archives.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-arcane-purple-light hover:underline"
        >
          Return to Archives
        </Link>
      </div>
    );
  }

  const entityType = entity.entity_type as EntityType;
  const entityStatus = entity.status as PublicationStatus;
  const Icon = typeIcons[entityType];
  const isCreator = user?.id === entity.created_by;
  const metadata = (entity.metadata ?? {}) as Record<string, string>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex gap-6">
        {/* Entity Image with arcane frame */}
        <div className="shrink-0">
          {entity.image_url ? (
            <img
              src={entity.image_url}
              alt={entity.name}
              className="h-40 w-40 rounded-lg border-2 border-realm-border object-cover shadow-lg shadow-arcane-purple/20"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-realm-border bg-realm-surface-raised shadow-lg shadow-arcane-purple/20">
              <Icon className="h-16 w-16 text-text-muted" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-text-bright">
                {entity.name}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm text-text-muted">
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{entityType}</span>
                </span>
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-medium",
                    statusColors[entityStatus],
                  )}
                >
                  {entityStatus}
                </span>
              </div>
            </div>

            {isCreator && (
              <div className="flex items-center gap-2">
                {entityStatus === "draft" && (
                  <Link
                    to="/entity/$slug"
                    params={{ slug: entity.slug }}
                    search={{ edit: true }}
                    className="flex items-center gap-1 rounded border border-realm-border px-3 py-1.5 text-sm text-text-muted hover:border-arcane-purple hover:text-text"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                )}
                <StatusWorkflow entity={entity} />
              </div>
            )}
          </div>

          <p className="mt-4 text-text">{entity.description}</p>
        </div>
      </div>

      {/* Type-specific metadata */}
      {Object.keys(metadata).length > 0 && (
        <div className="mt-8 rounded-lg border border-realm-border bg-realm-surface p-4">
          <h2 className="font-display text-lg font-semibold text-text-bright">
            Details
          </h2>
          <div className="mt-3 space-y-2">
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
        <div className="mt-8 rounded-lg border border-realm-border bg-realm-surface p-4">
          <h2 className="font-display text-lg font-semibold text-text-bright">
            Biography
          </h2>
          <div className="prose mt-3 max-w-none">
            <p>{entity.biography}</p>
          </div>
        </div>
      )}

      {/* Character Sheet - Impact Scores */}
      <CharacterSheet entityId={entity.id} isAuthenticated={!!user} />
    </div>
  );
}

function CharacterSheet({ entityId, isAuthenticated }: { entityId: number; isAuthenticated: boolean }) {
  const { data: assessments } = useAssessments(entityId);
  const { data: periods } = useAssessmentPeriods(entityId);
  const { data: relationships } = useRelationships(entityId);
  const [showScoringForm, setShowScoringForm] = useState(false);
  const [showPeriodForm, setShowPeriodForm] = useState(false);

  const atisResult = useMemo(() => {
    if (!assessments || assessments.length === 0) return null;

    const assessmentInputs: AssessmentInput[] = assessments.map((a) => ({
      scores: {
        scientific: a.scientific_score,
        economic: a.economic_score,
        human_rights: a.human_rights_score,
        health: a.health_score,
        cultural: a.cultural_score,
      },
      confidence_level: Number(a.confidence_level) || 0.5,
      controversy_level: Number(a.controversy_level) || 0,
      consensus_score: 0.5,
    }));

    const periodInputs: PeriodInput[] = (periods ?? []).map((p) => ({
      label: p.label,
      end_year: p.end_year,
      reach_factor: p.reach_factor,
      persistence_factor: p.persistence_factor,
    }));

    const allRels = [
      ...(relationships?.outgoing ?? []),
      ...(relationships?.incoming ?? []),
    ];
    const relInputs: RelationshipInput[] = allRels.map((r) => ({
      relationship_type: r.relationship_type as RelationshipInput["relationship_type"],
      strength: Number(r.strength) || 0.5,
      temporal_overlap: Number(r.temporal_overlap) || 0.5,
    }));

    return calculateATIS(assessmentInputs, periodInputs, relInputs);
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
      <div className="mt-8 space-y-4">
        <div className="rounded-lg border border-dashed border-realm-border bg-realm-surface/50 p-6 text-center">
          <p className="text-text-muted">
            No impact assessments yet. Be the first to score this entity.
          </p>
          {isAuthenticated && (
            <button
              onClick={() => setShowScoringForm(true)}
              className="mt-3 inline-flex items-center gap-1 rounded bg-primary px-4 py-2 text-sm font-semibold text-text-bright hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
              Add Assessment
            </button>
          )}
        </div>
        {showScoringForm && (
          <div className="rounded-lg border border-realm-border bg-realm-surface p-4">
            <h3 className="font-display text-lg font-semibold text-text-bright">
              Impact Assessment
            </h3>
            <div className="mt-4">
              <ScoringForm
                entityId={entityId}
                periods={periods?.map((p) => ({ id: p.id, label: p.label }))}
                onSuccess={() => setShowScoringForm(false)}
              />
            </div>
          </div>
        )}
      </div>
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
            <span className="text-sm text-text-muted">
              {atisResult.impact_class.descriptor}
            </span>
          </div>

          {achievements.length > 0 && <AchievementList achievements={achievements} />}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-realm-border bg-realm-surface p-4">
              <h3 className="mb-3 font-display text-lg font-semibold text-text-bright">
                Dimensional Scores
              </h3>
              <StatBlock scores={consensusScores} />
              {assessments.length > 1 && (
                <p className="mt-2 text-xs text-text-muted">
                  Consensus of {assessments.length} assessments
                </p>
              )}
            </div>

            <div className="rounded-lg border border-realm-border bg-realm-surface p-4">
              <h3 className="mb-3 font-display text-lg font-semibold text-text-bright">
                Impact Profile
              </h3>
              <ImpactRadarChart
                series={[
                  {
                    label: "Consensus",
                    scores: consensusScores,
                    color: "#7c3aed",
                  },
                ]}
              />
            </div>
          </div>

          {/* ATIS Breakdown */}
          <div className="rounded-lg border border-realm-border bg-realm-surface p-4">
            <h3 className="mb-3 font-display text-lg font-semibold text-text-bright">
              ATIS Calculation Breakdown
            </h3>
            <ATISBreakdown breakdown={atisResult.breakdown} />
            <p className="mt-3 text-xs text-text-muted">
              Formula: I_final = I_base × D_temporal × C_consensus × N_network × U_uncertainty
              &nbsp;|&nbsp; Algorithm v{atisResult.algorithm_version}
            </p>
          </div>
        </>
      )}

      {/* Assessment periods */}
      {periods && periods.length > 0 && (
        <div className="rounded-lg border border-realm-border bg-realm-surface p-4">
          <h3 className="mb-3 font-display text-lg font-semibold text-text-bright">
            Assessment Periods
          </h3>
          <div className="space-y-2">
            {periods.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded border border-realm-border/50 bg-realm-surface-raised px-3 py-2 text-sm"
              >
                <span className="font-medium text-text">{p.label}</span>
                <span className="text-text-muted">
                  {p.start_year} – {p.end_year} | Reach: {p.reach_factor} | Persistence: {p.persistence_factor}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score history */}
      <div className="rounded-lg border border-realm-border bg-realm-surface p-4">
        <h3 className="mb-3 font-display text-lg font-semibold text-text-bright">
          Score History
        </h3>
        <div className="space-y-3">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="rounded border border-realm-border/50 bg-realm-surface-raised p-3 text-sm"
            >
              <div className="flex items-center gap-3 font-mono text-text-muted">
                <span>SCI:{a.scientific_score > 0 ? "+" : ""}{a.scientific_score}</span>
                <span>ECO:{a.economic_score > 0 ? "+" : ""}{a.economic_score}</span>
                <span>HUM:{a.human_rights_score > 0 ? "+" : ""}{a.human_rights_score}</span>
                <span>HLT:{a.health_score > 0 ? "+" : ""}{a.health_score}</span>
                <span>CUL:{a.cultural_score > 0 ? "+" : ""}{a.cultural_score}</span>
                <span className="ml-auto text-xs">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-arcane-purple-light">
                  View justifications
                </summary>
                <div className="mt-2 space-y-1 text-xs text-text-muted">
                  <p><strong>Scientific:</strong> {a.scientific_justification}</p>
                  <p><strong>Economic:</strong> {a.economic_justification}</p>
                  <p><strong>Human Rights:</strong> {a.human_rights_justification}</p>
                  <p><strong>Health:</strong> {a.health_justification}</p>
                  <p><strong>Cultural:</strong> {a.cultural_justification}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {isAuthenticated && (
        <div className="flex gap-3">
          <button
            onClick={() => setShowScoringForm(!showScoringForm)}
            className="inline-flex items-center gap-1 rounded bg-primary px-4 py-2 text-sm font-semibold text-text-bright hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Add Assessment
          </button>
          <button
            onClick={() => setShowPeriodForm(!showPeriodForm)}
            className="inline-flex items-center gap-1 rounded border border-realm-border px-4 py-2 text-sm text-text-muted hover:border-arcane-purple hover:text-text"
          >
            <Plus className="h-4 w-4" />
            Add Period
          </button>
        </div>
      )}

      {showScoringForm && (
        <div className="rounded-lg border border-realm-border bg-realm-surface p-4">
          <h3 className="font-display text-lg font-semibold text-text-bright">
            Impact Assessment
          </h3>
          <div className="mt-4">
            <ScoringForm
              entityId={entityId}
              periods={periods?.map((p) => ({ id: p.id, label: p.label }))}
              onSuccess={() => setShowScoringForm(false)}
            />
          </div>
        </div>
      )}

      {showPeriodForm && (
        <div className="rounded-lg border border-realm-border bg-realm-surface p-4">
          <h3 className="font-display text-lg font-semibold text-text-bright">
            New Assessment Period
          </h3>
          <div className="mt-4">
            <PeriodForm
              entityId={entityId}
              onSuccess={() => setShowPeriodForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
