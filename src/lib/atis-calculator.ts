/**
 * ATIS (Advanced Temporal Impact Scoring) Calculator
 *
 * Ported from NefariousMeter, then reworked so that time is a curve rather
 * than a decay. Pure functions with zero dependencies. Runs entirely in the
 * browser.
 *
 * Every assessment belongs to one period: a window of years with its own
 * impact level.
 *
 *   level = I_base(dimensions, reach) × C_consensus × N_network × U_uncertainty
 *
 * The periods, laid end to end, are the influence curve. A figure whose legacy
 * grows after death simply has later periods with a higher level. The score is
 * the area under that curve up to the as-of year, in influence-centuries
 * (level × years / 100). It is unbounded: it grows with duration.
 *
 * Decay survives in one place only. When the last period ends before the as-of
 * year, its level fades exponentially, at a rate set by that period's
 * persistence factor. Years before the first period and years between periods
 * contribute nothing. Periods that overlap add.
 */

// ---------- Types ----------

export interface ATISConfig {
  /**
   * Years for a fading legacy to fall to 1/e of its level, indexed by
   * persistence factor − 1. Infinity never fades. The values follow the
   * wording of the persistence rubric: 1 faded within a year … 10 permanent.
   */
  persistenceTimeConstants: number[];
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
  /** The period this assessment describes. An assessment without one cannot be placed on the curve. */
  period_id?: number | null;
}

export interface PeriodInput {
  id: number;
  label: string;
  start_year: number;
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
  start_year: number;
  end_year: number;
  /** Years of this window that fall on or before the as-of year. */
  years: number;
  assessments: number;
  baseImpact: number;
  consensusWeight: number;
  networkAmplification: number;
  uncertaintyFactor: number;
  /** Impact per year while the period lasts (mean of its assessments). */
  level: number;
  /** level × years / 100, in influence-centuries. */
  area: number;
  dominant_factors: string[];
}

export interface LegacyTail {
  from_year: number;
  years: number;
  /** In influence-centuries. */
  area: number;
  level_at_as_of: number;
}

export interface ATISResult {
  /** Area under the influence curve, in influence-centuries. */
  overall_score: number;
  magnitude: number;
  impact_class: ImpactClassification;
  breakdown: PeriodBreakdown[];
  tail: LegacyTail | null;
  /** The level of greatest magnitude the curve reaches, with its sign. */
  peak_level: number;
  /** The level of the curve in the as-of year. */
  current_level: number;
  as_of_year: number;
  /** Assessments with no period, or a period that is not in the list. They contribute nothing. */
  unplaced_assessments: number;
  uncertainty_range: [number, number];
  algorithm_version: string;
}

// ---------- Constants ----------

export const DEFAULT_ATIS_CONFIG: ATISConfig = {
  persistenceTimeConstants: [1, 3, 10, 25, 70, 150, 300, 700, 2000, Infinity],
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

/** Tier thresholds, in influence-centuries. Not yet re-anchored to the curve model. */
export const TIER_THRESHOLDS: { tier: ATISTier; min: number; max: number }[] = [
  { tier: "minimal", min: 0, max: 10 },
  { tier: "moderate", min: 10, max: 50 },
  { tier: "significant", min: 50, max: 200 },
  { tier: "transformational", min: 200, max: 500 },
  { tier: "legendary", min: 500, max: Infinity },
];

/** Years per unit of area. */
const YEARS_PER_UNIT = 100;

// ---------- Core Algorithm ----------

export function calculateUnboundedBaseImpact(
  scores: DimensionalScores,
  reachFactor = 5,
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

  // Power scaling for reach. Persistence is no longer a multiplier here: how
  // long an impact lasts is what the curve itself records.
  const reachMultiplier = Math.pow(reachFactor / 5.0, 1.8) * 3.0;

  return weightedScore * reachMultiplier;
}

/** Years for a fading legacy to fall to 1/e of its level. */
export function persistenceTimeConstant(
  persistenceFactor: number,
  config: ATISConfig = DEFAULT_ATIS_CONFIG,
): number {
  const constants = config.persistenceTimeConstants;
  const index = Math.min(Math.max(Math.round(persistenceFactor), 1), constants.length) - 1;
  return constants[index];
}

/** Area (level × years, not yet divided into centuries) under an exponentially fading level. */
export function calculateTailArea(
  level: number,
  timeConstant: number,
  years: number,
): number {
  if (years <= 0) return 0;
  if (!Number.isFinite(timeConstant)) return level * years;
  return level * timeConstant * (1 - Math.exp(-years / timeConstant));
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

function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Years of a period that fall on or before the as-of year. Years are plain integers; BCE is negative. */
function activeYears(period: PeriodInput, asOfYear: number): number {
  return Math.max(0, Math.min(period.end_year, asOfYear) - period.start_year + 1);
}

export function calculateATIS(
  assessments: AssessmentInput[],
  periods: PeriodInput[],
  relationships: RelationshipInput[] = [],
  config: ATISConfig = DEFAULT_ATIS_CONFIG,
  asOfYear: number = new Date().getFullYear(),
): ATISResult {
  const periodById = new Map(periods.map((p) => [p.id, p]));
  const assessmentsByPeriod = new Map<number, AssessmentInput[]>();
  let unplaced = 0;
  for (const assessment of assessments) {
    const period =
      assessment.period_id == null ? undefined : periodById.get(assessment.period_id);
    if (!period) {
      unplaced += 1;
      continue;
    }
    const list = assessmentsByPeriod.get(period.id) ?? [];
    list.push(assessment);
    assessmentsByPeriod.set(period.id, list);
  }

  const placed = periods
    .filter((p) => assessmentsByPeriod.has(p.id))
    .sort((a, b) => a.start_year - b.start_year || a.end_year - b.end_year);

  if (placed.length === 0) {
    return {
      overall_score: 0,
      magnitude: 0,
      impact_class: classifyMagnitude(0),
      breakdown: [],
      tail: null,
      peak_level: 0,
      current_level: 0,
      as_of_year: asOfYear,
      unplaced_assessments: unplaced,
      uncertainty_range: [0, 0],
      algorithm_version: "3.0.0-atis",
    };
  }

  const networkAmplification = calculateNetworkAmplification(relationships, config);

  const breakdown: PeriodBreakdown[] = [];
  const levels = new Map<number, number>();
  let totalArea = 0;

  for (const period of placed) {
    const group = assessmentsByPeriod.get(period.id)!;
    const baseImpacts = group.map((a) => calculateUnboundedBaseImpact(a.scores, period.reach_factor));
    const consensusWeights = group.map((a) =>
      calculateConsensusWeight(a.controversy_level, a.consensus_score, config),
    );
    const uncertaintyFactors = group.map((a) =>
      calculateUncertaintyFactor(a.confidence_level, 0.8, config),
    );

    // Several assessments of one period are competing opinions of the same
    // thing, so they are averaged, not added.
    const level =
      mean(group.map((_, i) => baseImpacts[i] * consensusWeights[i] * uncertaintyFactors[i])) *
      networkAmplification;
    const years = activeYears(period, asOfYear);
    const area = (level * years) / YEARS_PER_UNIT;

    levels.set(period.id, level);
    totalArea += area;

    const baseImpact = mean(baseImpacts);
    const consensusWeight = mean(consensusWeights);
    const uncertaintyFactor = mean(uncertaintyFactors);
    breakdown.push({
      period: period.label,
      start_year: period.start_year,
      end_year: period.end_year,
      years,
      assessments: group.length,
      baseImpact,
      consensusWeight,
      networkAmplification,
      uncertaintyFactor,
      level,
      area,
      dominant_factors: identifyDominantFactors({
        baseImpact,
        consensusWeight,
        networkAmplification,
        uncertaintyFactor,
      }),
    });
  }

  // The curve only runs up to the as-of year; a period that has not started yet does nothing.
  const live = placed.filter((p) => p.start_year <= asOfYear);

  // Legacy tail: only the periods that end last carry on, fading from their level.
  let tail: LegacyTail | null = null;
  let tailLevelAtAsOf = 0;
  if (live.length > 0) {
    const latestEnd = Math.max(...live.map((p) => p.end_year));
    if (latestEnd < asOfYear) {
      const yearsAfter = asOfYear - latestEnd;
      let tailArea = 0;
      for (const period of live.filter((p) => p.end_year === latestEnd)) {
        const level = levels.get(period.id)!;
        const timeConstant = persistenceTimeConstant(period.persistence_factor, config);
        tailArea += calculateTailArea(level, timeConstant, yearsAfter);
        tailLevelAtAsOf += Number.isFinite(timeConstant)
          ? level * Math.exp(-yearsAfter / timeConstant)
          : level;
      }
      tail = {
        from_year: latestEnd + 1,
        years: yearsAfter,
        area: tailArea / YEARS_PER_UNIT,
        level_at_as_of: tailLevelAtAsOf,
      };
      totalArea += tail.area;
    }
  }

  // The curve is piecewise constant, changing only where a period starts or
  // just after one ends, so its extremes are at those years.
  const levelAt = (year: number) =>
    live.reduce(
      (sum, p) => (p.start_year <= year && year <= p.end_year ? sum + levels.get(p.id)! : sum),
      0,
    );
  const breakpoints = new Set<number>();
  for (const p of live) {
    breakpoints.add(p.start_year);
    if (p.end_year + 1 <= asOfYear) breakpoints.add(p.end_year + 1);
  }
  let peakLevel = 0;
  for (const year of breakpoints) {
    const value = levelAt(year);
    if (Math.abs(value) > Math.abs(peakLevel)) peakLevel = value;
  }
  const currentLevel = levelAt(asOfYear) + tailLevelAtAsOf;

  const placedAssessments = [...assessmentsByPeriod.values()].flat();
  const avgConfidence = mean(placedAssessments.map((a) => a.confidence_level));
  const uncertaintyWidth = totalArea * (1 - avgConfidence);
  const magnitude = Math.abs(totalArea);

  return {
    overall_score: totalArea,
    magnitude,
    impact_class: classifyMagnitude(magnitude),
    breakdown,
    tail,
    peak_level: peakLevel,
    current_level: currentLevel,
    as_of_year: asOfYear,
    unplaced_assessments: unplaced,
    uncertainty_range: [totalArea - uncertaintyWidth, totalArea + uncertaintyWidth],
    algorithm_version: "3.0.0-atis",
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
  consensusWeight: number;
  networkAmplification: number;
  uncertaintyFactor: number;
}): string[] {
  const dominant: string[] = [];
  if (Math.abs(factors.baseImpact) > 50) dominant.push("base_impact");
  if (factors.consensusWeight < 0.9) dominant.push("controversy");
  if (factors.networkAmplification > 1.5) dominant.push("network_effects");
  if (factors.uncertaintyFactor < 0.8) dominant.push("uncertainty");
  return dominant.length > 0 ? dominant : ["base_impact"];
}
