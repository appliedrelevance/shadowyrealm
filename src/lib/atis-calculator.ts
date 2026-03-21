/**
 * ATIS (Advanced Temporal Impact Scoring) Calculator
 *
 * Ported from NefariousMeter. Pure functions with zero dependencies.
 * Runs entirely in the browser.
 *
 * Formula: I_final = I_base × D_temporal × C_consensus × N_network × U_uncertainty
 */

// ---------- Types ----------

export interface ATISConfig {
  temporalDecayRate: number;
  temporalDecayShape: "linear" | "exponential" | "logarithmic";
  maxNetworkAmplification: number;
  relationshipDecayDistance: number;
  controversyPenalty: number;
  consensusBonus: number;
  uncertaintyPenalty: number;
  dataCompletenessWeight: number;
}

export interface DimensionalScores {
  scientific: number;
  economic: number;
  human_rights: number;
  health: number;
  cultural: number;
}

export interface DimensionalJustifications {
  scientific: string;
  economic: string;
  human_rights: string;
  health: string;
  cultural: string;
}

export interface AssessmentInput {
  scores: DimensionalScores;
  confidence_level: number;
  controversy_level: number;
  consensus_score: number;
}

export interface PeriodInput {
  label: string;
  end_year: number;
  reach_factor: number;
  persistence_factor: number;
}

export interface RelationshipInput {
  relationship_type: "influence" | "mentorship" | "collaboration" | "opposition";
  strength: number;
  temporal_overlap: number;
}

export type ATISTier =
  | "minimal"
  | "moderate"
  | "significant"
  | "transformational"
  | "legendary";

export interface ImpactClassification {
  tier: ATISTier;
  descriptor: string;
  range: [number, number];
  color_scheme: string;
  interpretation: string;
}

export interface PeriodBreakdown {
  period: string;
  baseImpact: number;
  temporalDecay: number;
  consensusWeight: number;
  networkAmplification: number;
  uncertaintyFactor: number;
  finalImpact: number;
  dominant_factors: string[];
}

export interface ATISResult {
  overall_score: number;
  magnitude: number;
  impact_class: ImpactClassification;
  breakdown: PeriodBreakdown[];
  uncertainty_range: [number, number];
  algorithm_version: string;
}

// ---------- Constants ----------

export const DEFAULT_ATIS_CONFIG: ATISConfig = {
  temporalDecayRate: 0.08,
  temporalDecayShape: "logarithmic",
  maxNetworkAmplification: 5.0,
  relationshipDecayDistance: 0.3,
  controversyPenalty: 0.8,
  consensusBonus: 1.2,
  uncertaintyPenalty: 0.7,
  dataCompletenessWeight: 0.8,
};

export const DIMENSION_WEIGHTS: DimensionalScores = {
  scientific: 1.0,
  economic: 1.0,
  human_rights: 1.2,
  health: 1.1,
  cultural: 0.9,
};

export const TIER_THRESHOLDS: { tier: ATISTier; min: number; max: number }[] = [
  { tier: "minimal", min: 0, max: 10 },
  { tier: "moderate", min: 10, max: 50 },
  { tier: "significant", min: 50, max: 200 },
  { tier: "transformational", min: 200, max: 500 },
  { tier: "legendary", min: 500, max: Infinity },
];

// ---------- Core Algorithm ----------

export function calculateUnboundedBaseImpact(
  scores: DimensionalScores,
  reachFactor = 5,
  persistenceFactor = 5,
): number {
  let weightedScore =
    (scores.scientific * DIMENSION_WEIGHTS.scientific +
      scores.economic * DIMENSION_WEIGHTS.economic +
      scores.human_rights * DIMENSION_WEIGHTS.human_rights +
      scores.health * DIMENSION_WEIGHTS.health +
      scores.cultural * DIMENSION_WEIGHTS.cultural) /
    5.0;

  // Extraordinary achievement bonus
  if (Math.abs(weightedScore) > 10) {
    const extraordinaryFactor = Math.pow(Math.abs(weightedScore) / 10.0, 1.2);
    weightedScore = weightedScore * extraordinaryFactor;
  }

  // Power scaling for reach and persistence
  const reachMultiplier = Math.pow(reachFactor / 5.0, 1.8) * 3.0;
  const persistenceMultiplier = Math.pow(persistenceFactor / 5.0, 1.8) * 3.0;

  return weightedScore * reachMultiplier * persistenceMultiplier;
}

export function calculateTemporalDecay(
  yearsElapsed: number,
  config: ATISConfig = DEFAULT_ATIS_CONFIG,
): number {
  if (yearsElapsed <= 0) return 1.0;

  switch (config.temporalDecayShape) {
    case "linear":
      return Math.max(0.11, 1.0 - yearsElapsed * config.temporalDecayRate);
    case "exponential":
      return Math.exp(-config.temporalDecayRate * yearsElapsed);
    case "logarithmic":
      return Math.max(
        0.3,
        1.0 /
          (1.0 +
            config.temporalDecayRate *
              3.0 *
              Math.log(yearsElapsed + 1)),
      );
    default:
      return Math.exp(-config.temporalDecayRate * yearsElapsed);
  }
}

export function calculateNetworkAmplification(
  relationships: RelationshipInput[] = [],
  config: ATISConfig = DEFAULT_ATIS_CONFIG,
): number {
  if (relationships.length === 0) return 1.0;

  const typeMultipliers: Record<RelationshipInput["relationship_type"], number> =
    {
      mentorship: 1.3,
      opposition: 0.9,
      collaboration: 1.2,
      influence: 1.1,
    };

  let amplification = 1.0;

  for (const rel of relationships) {
    const typeMultiplier = typeMultipliers[rel.relationship_type];
    const relAmplification =
      1.0 + rel.strength * rel.temporal_overlap * typeMultiplier * 0.4;
    amplification *= relAmplification;
  }

  return Math.min(amplification, config.maxNetworkAmplification);
}

export function calculateConsensusWeight(
  controversyLevel: number,
  consensusScore: number,
  config: ATISConfig = DEFAULT_ATIS_CONFIG,
): number {
  let weight = 1.0;
  if (controversyLevel > 0.7) {
    weight *= config.controversyPenalty;
  } else if (consensusScore > 0.8) {
    weight *= config.consensusBonus;
  }
  return weight;
}

export function calculateUncertaintyFactor(
  confidenceLevel: number,
  dataCompleteness = 0.8,
  config: ATISConfig = DEFAULT_ATIS_CONFIG,
): number {
  const confidenceWeight = Math.max(0.3, confidenceLevel);
  const completenessWeight = Math.max(0.5, dataCompleteness);
  const factor =
    (confidenceWeight + completenessWeight * config.dataCompletenessWeight) / 2;

  if (factor < config.uncertaintyPenalty) return config.uncertaintyPenalty;
  return Math.min(1.0, factor);
}

// ---------- Main Calculator ----------

export function calculateATIS(
  assessments: AssessmentInput[],
  periods: PeriodInput[],
  relationships: RelationshipInput[] = [],
  config: ATISConfig = DEFAULT_ATIS_CONFIG,
): ATISResult {
  if (assessments.length === 0) {
    return {
      overall_score: 0,
      magnitude: 0,
      impact_class: classifyMagnitude(0),
      breakdown: [],
      uncertainty_range: [0, 0],
      algorithm_version: "2.0.0-atis",
    };
  }

  const currentYear = new Date().getFullYear();
  const networkAmplification = calculateNetworkAmplification(
    relationships,
    config,
  );

  const breakdowns: PeriodBreakdown[] = [];
  let totalImpact = 0;

  // If no periods, create a default one
  const effectivePeriods =
    periods.length > 0
      ? periods
      : [
          {
            label: "Overall",
            end_year: currentYear,
            reach_factor: 5,
            persistence_factor: 5,
          },
        ];

  for (let i = 0; i < assessments.length; i++) {
    const assessment = assessments[i];
    const period = effectivePeriods[Math.min(i, effectivePeriods.length - 1)];

    const baseImpact = calculateUnboundedBaseImpact(
      assessment.scores,
      period.reach_factor,
      period.persistence_factor,
    );

    const yearsElapsed = Math.max(0, currentYear - period.end_year);
    const temporalDecay = calculateTemporalDecay(yearsElapsed, config);

    const consensusWeight = calculateConsensusWeight(
      assessment.controversy_level,
      assessment.consensus_score,
      config,
    );

    const uncertaintyFactor = calculateUncertaintyFactor(
      assessment.confidence_level,
      0.8,
      config,
    );

    const finalImpact =
      baseImpact *
      temporalDecay *
      consensusWeight *
      networkAmplification *
      uncertaintyFactor;

    totalImpact += finalImpact;

    breakdowns.push({
      period: period.label,
      baseImpact,
      temporalDecay,
      consensusWeight,
      networkAmplification,
      uncertaintyFactor,
      finalImpact,
      dominant_factors: identifyDominantFactors({
        baseImpact,
        temporalDecay,
        consensusWeight,
        networkAmplification,
        uncertaintyFactor,
      }),
    });
  }

  const magnitude = Math.abs(totalImpact);
  const avgUncertainty =
    assessments.reduce((sum, a) => sum + a.confidence_level, 0) /
    assessments.length;
  const uncertaintyWidth = totalImpact * (1 - avgUncertainty);

  return {
    overall_score: totalImpact,
    magnitude,
    impact_class: classifyMagnitude(magnitude),
    breakdown: breakdowns,
    uncertainty_range: [
      totalImpact - uncertaintyWidth,
      totalImpact + uncertaintyWidth,
    ],
    algorithm_version: "2.0.0-atis",
  };
}

// ---------- Classification ----------

export function classifyMagnitude(magnitude: number): ImpactClassification {
  if (magnitude < 10)
    return {
      tier: "minimal",
      descriptor: "Limited local impact",
      range: [0, 10],
      color_scheme: "gray",
      interpretation: "Little lasting effect beyond immediate context",
    };
  if (magnitude < 50)
    return {
      tier: "moderate",
      descriptor: "Regional or specialized impact",
      range: [10, 50],
      color_scheme: "blue",
      interpretation: "Meaningful impact within specific domain or region",
    };
  if (magnitude < 200)
    return {
      tier: "significant",
      descriptor: "National or cross-domain impact",
      range: [50, 200],
      color_scheme: "orange",
      interpretation: "Major impact affecting multiple areas or large populations",
    };
  if (magnitude < 500)
    return {
      tier: "transformational",
      descriptor: "Global or epoch-defining impact",
      range: [200, 500],
      color_scheme: "red",
      interpretation: "Fundamental changes affecting humanity's trajectory",
    };
  return {
    tier: "legendary",
    descriptor: "Civilization-altering impact",
    range: [500, Infinity],
    color_scheme: "purple",
    interpretation: "Rare figures who fundamentally changed the course of history",
  };
}

// ---------- Helpers ----------

/** Compute consensus (mean) scores from multiple assessments */
export function computeConsensusScores(
  assessments: { scores: DimensionalScores }[],
): DimensionalScores {
  if (assessments.length === 0)
    return { scientific: 0, economic: 0, human_rights: 0, health: 0, cultural: 0 };

  const sum = assessments.reduce(
    (acc, a) => ({
      scientific: acc.scientific + a.scores.scientific,
      economic: acc.economic + a.scores.economic,
      human_rights: acc.human_rights + a.scores.human_rights,
      health: acc.health + a.scores.health,
      cultural: acc.cultural + a.scores.cultural,
    }),
    { scientific: 0, economic: 0, human_rights: 0, health: 0, cultural: 0 },
  );

  const n = assessments.length;
  return {
    scientific: sum.scientific / n,
    economic: sum.economic / n,
    human_rights: sum.human_rights / n,
    health: sum.health / n,
    cultural: sum.cultural / n,
  };
}

/** Get achievement labels for extreme scores */
export function getAchievements(scores: DimensionalScores): string[] {
  const achievements: string[] = [];
  const labels: Record<string, { positive: string; negative: string }> = {
    scientific: { positive: "Scientific Pioneer", negative: "Scientific Menace" },
    economic: { positive: "Economic Titan", negative: "Economic Devastator" },
    human_rights: { positive: "Champion of Rights", negative: "Rights Violator" },
    health: { positive: "Health Savior", negative: "Health Menace" },
    cultural: { positive: "Cultural Icon", negative: "Cultural Destroyer" },
  };

  for (const [dim, value] of Object.entries(scores)) {
    const label = labels[dim];
    if (!label) continue;
    if (value >= 8) achievements.push(label.positive);
    if (value <= -8) achievements.push(label.negative);
  }

  return achievements;
}

function identifyDominantFactors(factors: {
  baseImpact: number;
  temporalDecay: number;
  consensusWeight: number;
  networkAmplification: number;
  uncertaintyFactor: number;
}): string[] {
  const dominant: string[] = [];
  if (Math.abs(factors.baseImpact) > 50) dominant.push("base_impact");
  if (factors.temporalDecay < 0.5) dominant.push("temporal_decay");
  if (factors.consensusWeight < 0.9) dominant.push("controversy");
  if (factors.networkAmplification > 1.5) dominant.push("network_effects");
  if (factors.uncertaintyFactor < 0.8) dominant.push("uncertainty");
  return dominant.length > 0 ? dominant : ["base_impact"];
}
