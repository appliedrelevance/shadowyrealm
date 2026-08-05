import { describe, expect, it } from "vitest";
import {
  DEFAULT_ATIS_CONFIG,
  DIMENSION_WEIGHTS,
  calculateATIS,
  calculateConsensusWeight,
  calculateNetworkAmplification,
  calculateTemporalDecay,
  calculateUnboundedBaseImpact,
  calculateUncertaintyFactor,
  classifyMagnitude,
  computeConsensusScores,
  getAchievements,
  type AssessmentInput,
  type DimensionalScores,
  type PeriodInput,
  type RelationshipInput,
} from "./atis-calculator";

const zeroScores: DimensionalScores = {
  scientific: 0,
  economic: 0,
  human_rights: 0,
  health: 0,
  cultural: 0,
};

function uniformScores(value: number): DimensionalScores {
  return {
    scientific: value,
    economic: value,
    human_rights: value,
    health: value,
    cultural: value,
  };
}

function makeAssessment(overrides: Partial<AssessmentInput> = {}): AssessmentInput {
  return {
    scores: uniformScores(5),
    confidence_level: 0.9,
    controversy_level: 0.2,
    consensus_score: 0.5,
    ...overrides,
  };
}

describe("calculateUnboundedBaseImpact", () => {
  it("returns 0 for all-zero scores", () => {
    expect(calculateUnboundedBaseImpact(zeroScores)).toBe(0);
  });

  it("applies dimension weights and default reach/persistence multipliers", () => {
    // Uniform score s → weighted mean = s × (sum of weights) / 5.
    // Default reach/persistence of 5 → (5/5)^1.8 × 3 = 3 each.
    const weightSum =
      DIMENSION_WEIGHTS.scientific +
      DIMENSION_WEIGHTS.economic +
      DIMENSION_WEIGHTS.human_rights +
      DIMENSION_WEIGHTS.health +
      DIMENSION_WEIGHTS.cultural;
    const expected = ((5 * weightSum) / 5) * 9;
    expect(calculateUnboundedBaseImpact(uniformScores(5))).toBeCloseTo(expected, 10);
  });

  it("preserves sign for negative (harmful) scores", () => {
    const positive = calculateUnboundedBaseImpact(uniformScores(5));
    const negative = calculateUnboundedBaseImpact(uniformScores(-5));
    expect(negative).toBeCloseTo(-positive, 10);
  });

  it("amplifies extraordinary scores superlinearly", () => {
    // |weighted| > 10 triggers the extraordinary bonus, so a 10→ratio
    // of inputs should produce more than a 10→ratio of outputs.
    const ordinary = calculateUnboundedBaseImpact(uniformScores(1));
    const extraordinary = calculateUnboundedBaseImpact(uniformScores(10));
    expect(extraordinary).toBeGreaterThan(ordinary * 10);
  });

  it("scales with reach and persistence factors", () => {
    const base = calculateUnboundedBaseImpact(uniformScores(5), 5, 5);
    const wide = calculateUnboundedBaseImpact(uniformScores(5), 10, 5);
    const narrow = calculateUnboundedBaseImpact(uniformScores(5), 1, 5);
    expect(wide).toBeGreaterThan(base);
    expect(narrow).toBeLessThan(base);
    expect(narrow).toBeGreaterThan(0);
  });
});

describe("calculateTemporalDecay", () => {
  it("returns 1.0 for the present and future", () => {
    expect(calculateTemporalDecay(0)).toBe(1.0);
    expect(calculateTemporalDecay(-5)).toBe(1.0);
  });

  it("decreases monotonically with elapsed years", () => {
    const decades = [10, 50, 100, 500, 2000].map((y) => calculateTemporalDecay(y));
    for (let i = 1; i < decades.length; i++) {
      expect(decades[i]).toBeLessThan(decades[i - 1]);
    }
  });

  it("logarithmic decay (default) floors at 0.3", () => {
    expect(calculateTemporalDecay(100000)).toBeGreaterThanOrEqual(0.3);
  });

  it("linear decay floors at 0.11", () => {
    const config = { ...DEFAULT_ATIS_CONFIG, temporalDecayShape: "linear" as const };
    expect(calculateTemporalDecay(1000, config)).toBeCloseTo(0.11, 10);
  });

  it("exponential decay follows e^(-rate × years)", () => {
    const config = {
      ...DEFAULT_ATIS_CONFIG,
      temporalDecayShape: "exponential" as const,
    };
    expect(calculateTemporalDecay(10, config)).toBeCloseTo(
      Math.exp(-config.temporalDecayRate * 10),
      10,
    );
  });
});

describe("calculateNetworkAmplification", () => {
  const rel = (
    type: RelationshipInput["relationship_type"],
    strength = 1,
    overlap = 1,
  ): RelationshipInput => ({
    relationship_type: type,
    strength,
    temporal_overlap: overlap,
  });

  it("returns 1.0 with no relationships", () => {
    expect(calculateNetworkAmplification()).toBe(1.0);
    expect(calculateNetworkAmplification([])).toBe(1.0);
  });

  it("amplifies more for mentorship than opposition", () => {
    const mentorship = calculateNetworkAmplification([rel("mentorship")]);
    const opposition = calculateNetworkAmplification([rel("opposition")]);
    expect(mentorship).toBeGreaterThan(opposition);
  });

  it("compounds multiple relationships multiplicatively", () => {
    const one = calculateNetworkAmplification([rel("influence", 0.5, 0.5)]);
    const two = calculateNetworkAmplification([
      rel("influence", 0.5, 0.5),
      rel("influence", 0.5, 0.5),
    ]);
    expect(two).toBeCloseTo(one * one, 10);
  });

  it("caps at maxNetworkAmplification", () => {
    const many = Array.from({ length: 50 }, () => rel("mentorship"));
    expect(calculateNetworkAmplification(many)).toBe(
      DEFAULT_ATIS_CONFIG.maxNetworkAmplification,
    );
  });
});

describe("calculateConsensusWeight", () => {
  it("penalizes high controversy", () => {
    expect(calculateConsensusWeight(0.8, 0.5)).toBe(
      DEFAULT_ATIS_CONFIG.controversyPenalty,
    );
  });

  it("rewards strong consensus when controversy is low", () => {
    expect(calculateConsensusWeight(0.1, 0.9)).toBe(
      DEFAULT_ATIS_CONFIG.consensusBonus,
    );
  });

  it("controversy penalty takes precedence over consensus bonus", () => {
    expect(calculateConsensusWeight(0.9, 0.9)).toBe(
      DEFAULT_ATIS_CONFIG.controversyPenalty,
    );
  });

  it("is neutral in the middle band", () => {
    expect(calculateConsensusWeight(0.5, 0.5)).toBe(1.0);
  });
});

describe("calculateUncertaintyFactor", () => {
  it("never drops below the uncertainty penalty floor", () => {
    expect(calculateUncertaintyFactor(0, 0)).toBe(
      DEFAULT_ATIS_CONFIG.uncertaintyPenalty,
    );
  });

  it("caps at 1.0 for full confidence and completeness", () => {
    expect(calculateUncertaintyFactor(1.0, 1.0)).toBeLessThanOrEqual(1.0);
  });

  it("higher confidence yields a higher factor", () => {
    const low = calculateUncertaintyFactor(0.75);
    const high = calculateUncertaintyFactor(0.95);
    expect(high).toBeGreaterThan(low);
  });
});

describe("classifyMagnitude", () => {
  it.each([
    [0, "minimal"],
    [9.99, "minimal"],
    [10, "moderate"],
    [49.99, "moderate"],
    [50, "significant"],
    [199.99, "significant"],
    [200, "transformational"],
    [499.99, "transformational"],
    [500, "legendary"],
    [10000, "legendary"],
  ] as const)("classifies magnitude %f as %s", (magnitude, tier) => {
    expect(classifyMagnitude(magnitude).tier).toBe(tier);
  });
});

describe("computeConsensusScores", () => {
  it("returns zeros for no assessments", () => {
    expect(computeConsensusScores([])).toEqual(zeroScores);
  });

  it("averages scores across assessments", () => {
    const result = computeConsensusScores([
      { scores: uniformScores(2) },
      { scores: uniformScores(6) },
    ]);
    expect(result).toEqual(uniformScores(4));
  });
});

describe("getAchievements", () => {
  it("returns nothing for moderate scores", () => {
    expect(getAchievements(uniformScores(7))).toEqual([]);
    expect(getAchievements(uniformScores(-7))).toEqual([]);
  });

  it("labels extreme positive and negative scores", () => {
    expect(getAchievements({ ...zeroScores, scientific: 8 })).toEqual([
      "Scientific Pioneer",
    ]);
    expect(getAchievements({ ...zeroScores, human_rights: -8 })).toEqual([
      "Rights Violator",
    ]);
  });

  it("can mix positive and negative achievements", () => {
    const result = getAchievements({
      ...zeroScores,
      scientific: 9,
      human_rights: -9,
    });
    expect(result).toContain("Scientific Pioneer");
    expect(result).toContain("Rights Violator");
  });
});

describe("calculateATIS", () => {
  const currentYear = new Date().getFullYear();

  const recentPeriod: PeriodInput = {
    label: "Career",
    end_year: currentYear,
    reach_factor: 5,
    persistence_factor: 5,
  };

  it("returns a zeroed result for no assessments", () => {
    const result = calculateATIS([], []);
    expect(result.overall_score).toBe(0);
    expect(result.magnitude).toBe(0);
    expect(result.impact_class.tier).toBe("minimal");
    expect(result.breakdown).toEqual([]);
    expect(result.uncertainty_range).toEqual([0, 0]);
  });

  it("composes the final score as the product of all factors", () => {
    const assessment = makeAssessment();
    const result = calculateATIS([assessment], [recentPeriod]);
    const [breakdown] = result.breakdown;

    expect(breakdown.finalImpact).toBeCloseTo(
      breakdown.baseImpact *
        breakdown.temporalDecay *
        breakdown.consensusWeight *
        breakdown.networkAmplification *
        breakdown.uncertaintyFactor,
      10,
    );
    expect(result.overall_score).toBeCloseTo(breakdown.finalImpact, 10);
    expect(result.magnitude).toBeCloseTo(Math.abs(result.overall_score), 10);
  });

  it("uses a default period when none are provided", () => {
    const result = calculateATIS([makeAssessment()], []);
    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0].period).toBe("Overall");
    expect(result.breakdown[0].temporalDecay).toBe(1.0);
  });

  it("sums impact across multiple assessed periods", () => {
    const older: PeriodInput = {
      label: "Early",
      end_year: currentYear - 100,
      reach_factor: 5,
      persistence_factor: 5,
    };
    const single = calculateATIS([makeAssessment()], [recentPeriod]);
    const double = calculateATIS(
      [makeAssessment(), makeAssessment()],
      [recentPeriod, older],
    );
    expect(double.breakdown).toHaveLength(2);
    expect(double.overall_score).toBeGreaterThan(single.overall_score);
    // The older period decays, so it contributes less than the recent one
    expect(double.breakdown[1].finalImpact).toBeLessThan(
      double.breakdown[0].finalImpact,
    );
  });

  it("produces negative overall scores for harmful figures", () => {
    const harmful = makeAssessment({ scores: uniformScores(-6) });
    const result = calculateATIS([harmful], [recentPeriod]);
    expect(result.overall_score).toBeLessThan(0);
    expect(result.magnitude).toBeGreaterThan(0);
    expect(result.impact_class.tier).not.toBe("minimal");
  });

  it("widens the uncertainty range for low-confidence assessments", () => {
    const confident = calculateATIS(
      [makeAssessment({ confidence_level: 0.95 })],
      [recentPeriod],
    );
    const uncertain = calculateATIS(
      [makeAssessment({ confidence_level: 0.4 })],
      [recentPeriod],
    );
    const width = (r: typeof confident) =>
      Math.abs(r.uncertainty_range[1] - r.uncertainty_range[0]);
    expect(width(uncertain) / Math.abs(uncertain.overall_score)).toBeGreaterThan(
      width(confident) / Math.abs(confident.overall_score),
    );
  });

  it("network relationships amplify the final score", () => {
    const alone = calculateATIS([makeAssessment()], [recentPeriod]);
    const connected = calculateATIS(
      [makeAssessment()],
      [recentPeriod],
      [{ relationship_type: "mentorship", strength: 1, temporal_overlap: 1 }],
    );
    expect(connected.overall_score).toBeGreaterThan(alone.overall_score);
  });
});
