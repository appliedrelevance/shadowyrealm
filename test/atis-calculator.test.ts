import { describe, expect, test } from "bun:test";
import {
  calculateImpact,
  classifyMagnitude,
  curveAreaBetween,
  emptyDimensions,
  profileMagnitude,
  reachMultiplier,
  sampleCurve,
  sumDimensions,
  type AssessmentInput,
  type Dimensions,
  type PeriodInput,
} from "../src/lib/atis-calculator";

const AS_OF = 2026;

function dims(values: Partial<Dimensions>): Dimensions {
  return { ...emptyDimensions(), ...values };
}

function period(id: number, start: number, end: number, reach = 5, persistence = 5): PeriodInput {
  return { id, label: `p${id}`, start_year: start, end_year: end, reach_factor: reach, persistence_factor: persistence };
}

function assessment(period_id: number | null, benefit: Partial<Dimensions>, harm: Partial<Dimensions> = {}): AssessmentInput {
  return { period_id, benefit: dims(benefit), harm: dims(harm) };
}

describe("calculateImpact", () => {
  test("a period's area is weight × value × reach × years / 100", () => {
    const r = calculateImpact([assessment(1, { scientific: 8 })], [period(1, 1900, 1999)], {
      hasCreditDescendants: true,
      asOfYear: AS_OF,
    });
    // reach 5 multiplies by 3; scientific weight 1.0; 100 years is one century.
    expect(r.profile.benefit.scientific).toBeCloseTo(8 * 3, 10);
    expect(r.magnitude).toBeCloseTo(24, 10);
    expect(r.tail).toBeNull();
  });

  test("harm never cancels benefit", () => {
    const r = calculateImpact(
      [assessment(1, { cultural: 8 }, { human_rights: 9, health: 9 })],
      [period(1, 1900, 1999)],
      { hasCreditDescendants: true, asOfYear: AS_OF },
    );
    expect(r.benefit_total).toBeGreaterThan(0);
    expect(r.harm_total).toBeGreaterThan(r.benefit_total);
    expect(r.magnitude).toBeCloseTo(r.benefit_total + r.harm_total, 10);
  });

  test("magnitude is exactly the sum of the ten areas", () => {
    const r = calculateImpact(
      [
        assessment(1, { scientific: 3, economic: 5, cultural: 2 }, { health: 4 }),
        assessment(1, { scientific: 7 }, { human_rights: 6 }),
        assessment(2, { economic: 9 }, { economic: 2 }),
      ],
      [period(1, -500, -400, 7, 9), period(2, 100, 300, 4, 3)],
      { hasCreditDescendants: false, asOfYear: AS_OF },
    );
    expect(r.magnitude).toBeCloseTo(profileMagnitude(r.profile), 10);
    expect(r.magnitude).toBeCloseTo(sumDimensions(r.profile.benefit) + sumDimensions(r.profile.harm), 10);
  });

  test("several assessments of one period are averaged, not added", () => {
    const one = calculateImpact([assessment(1, { health: 6 })], [period(1, 1950, 1959)], {
      hasCreditDescendants: true,
      asOfYear: AS_OF,
    });
    const two = calculateImpact(
      [assessment(1, { health: 4 }), assessment(1, { health: 8 })],
      [period(1, 1950, 1959)],
      { hasCreditDescendants: true, asOfYear: AS_OF },
    );
    expect(two.magnitude).toBeCloseTo(one.magnitude, 10);
  });

  test("a tail runs only when no descendant carries the legacy", () => {
    const inputs = [[assessment(1, { cultural: 5 })], [period(1, 1600, 1610, 5, 9)]] as const;
    const alone = calculateImpact([...inputs[0]], [...inputs[1]], { hasCreditDescendants: false, asOfYear: AS_OF });
    const carried = calculateImpact([...inputs[0]], [...inputs[1]], { hasCreditDescendants: true, asOfYear: AS_OF });
    expect(alone.tail).not.toBeNull();
    expect(alone.tail!.from_year).toBe(1611);
    expect(carried.tail).toBeNull();
    expect(alone.magnitude).toBeGreaterThan(carried.magnitude);
  });

  test("a permanent legacy keeps its level to the as-of year", () => {
    const r = calculateImpact([assessment(1, { scientific: 5 })], [period(1, 1900, 1925, 5, 10)], {
      hasCreditDescendants: false,
      asOfYear: AS_OF,
    });
    const level = 5 * 3;
    expect(r.tail!.area.benefit.scientific).toBeCloseTo((level * (AS_OF - 1925)) / 100, 10);
  });

  test("assessments without a known period are counted as unplaced and add nothing", () => {
    const r = calculateImpact([assessment(null, { health: 10 }), assessment(99, { health: 10 })], [period(1, 1, 2)], {
      hasCreditDescendants: false,
      asOfYear: AS_OF,
    });
    expect(r.unplaced_assessments).toBe(2);
    expect(r.magnitude).toBe(0);
  });

  test("a period that has not started adds nothing; one that is under way counts to the as-of year", () => {
    const r = calculateImpact(
      [assessment(1, { economic: 5 }), assessment(2, { economic: 5 })],
      [period(1, 2000, 2050), period(2, 2030, 2040)],
      { hasCreditDescendants: false, asOfYear: AS_OF },
    );
    expect(r.breakdown).toHaveLength(1);
    expect(r.breakdown[0].years).toBe(27);
    expect(r.tail).toBeNull();
  });
});

describe("the curve", () => {
  test("the area under the whole curve equals magnitude", () => {
    const r = calculateImpact(
      [assessment(1, { scientific: 6 }, { health: 3 }), assessment(2, { cultural: 4 }, { economic: 1 })],
      [period(1, -300, -200, 6, 7), period(2, -250, 50, 3, 8)],
      { hasCreditDescendants: false, asOfYear: AS_OF },
    );
    const whole = curveAreaBetween(r.curve, -5000, 3000);
    expect((whole.benefit + whole.harm) / 100).toBeCloseTo(r.magnitude, 6);
  });

  test("bucket means keep the area of an event shorter than its bucket", () => {
    const r = calculateImpact([assessment(1, { human_rights: 7 })], [period(1, 1096, 1099)], {
      hasCreditDescendants: true,
      asOfYear: AS_OF,
    });
    const edges = [1000, 1050, 1100, 1150];
    const s = sampleCurve(r.curve, edges);
    expect(s.benefit[0]).toBe(0);
    expect(s.benefit[1] * 50).toBeCloseTo(r.magnitude * 100, 6);
    expect(s.benefit[2]).toBe(0);
  });
});

describe("helpers", () => {
  test("reach 5 multiplies by 3 and reach 10 by about 10.4", () => {
    expect(reachMultiplier(5)).toBeCloseTo(3, 10);
    expect(reachMultiplier(10)).toBeCloseTo(3 * Math.pow(2, 1.8), 10);
  });

  test("tiers follow the thresholds", () => {
    expect(classifyMagnitude(0).tier).toBe("minimal");
    expect(classifyMagnitude(1e9).tier).toBe("legendary");
  });
});
