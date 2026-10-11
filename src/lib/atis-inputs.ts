/**
 * Turns database rows into calculator inputs. The profile page and the
 * comparison view both call this, so the same entity cannot score differently
 * on the two screens.
 */
import type {
  AssessmentInput,
  PeriodInput,
  RelationshipInput,
} from "./atis-calculator";

interface AssessmentRow {
  period_id: number | null;
  scientific_score: number;
  economic_score: number;
  human_rights_score: number;
  health_score: number;
  cultural_score: number;
  confidence_level: number | null;
  controversy_level: number | null;
}

interface PeriodRow {
  id: number;
  label: string;
  start_year: number;
  end_year: number;
  reach_factor: number;
  persistence_factor: number;
}

interface RelationshipRow {
  relationship_type: string;
  strength: number | string | null;
  temporal_overlap: number | string | null;
}

export function buildATISInputs(
  assessments: AssessmentRow[],
  periods: PeriodRow[],
  relationships: RelationshipRow[],
): {
  assessments: AssessmentInput[];
  periods: PeriodInput[];
  relationships: RelationshipInput[];
} {
  return {
    assessments: assessments.map((a) => ({
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
      period_id: a.period_id,
    })),
    periods: periods.map((p) => ({
      id: p.id,
      label: p.label,
      start_year: p.start_year,
      end_year: p.end_year,
      reach_factor: p.reach_factor,
      persistence_factor: p.persistence_factor,
    })),
    relationships: relationships.map((r) => ({
      relationship_type: r.relationship_type as RelationshipInput["relationship_type"],
      strength: Number(r.strength) || 0.5,
      temporal_overlap: Number(r.temporal_overlap) || 0.5,
    })),
  };
}
