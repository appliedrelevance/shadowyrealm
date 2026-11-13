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
import { SITES } from "../src/sites";

const AS_OF = 2026;

function period(id: number, start: number, end: number, reach = 5, persistence = 5): PeriodInput {
  return { id, label: `p${id}`, start_year: start, end_year: end, reach_factor: reach, persistence_factor: persistence };
}

/** The calculator's properties hold for every site's dimensions, weights and unit. */
for (const site of Object.values(SITES)) {
  const scoring = site.scoring;
  const keys = scoring.dimensions.map((d) => d.key);
  const weight = (k: string) => scoring.dimensions.find((d) => d.key === k)!.weight;
  const unitYears = scoring.unit.years;
  const [d0, d1, d2, d3, d4] = [0, 1, 2, 3, 4].map((i) => keys[i % keys.length]);

  const dims = (values: Partial<Dimensions>): Dimensions => ({ ...emptyDimensions(keys), ...values });
  const assessment = (period_id: number | null, benefit: Partial<Dimensions>, harm: Partial<Dimensions> = {}): AssessmentInput => ({
    period_id,
    benefit: dims(benefit),
    harm: dims(harm),
  });

  describe(`${site.key}: calculateImpact`, () => {
    test("a period's area is weight × value × reach × years / unit", () => {
      const r = calculateImpact(scoring, [assessment(1, { [d0]: 8 })], [period(1, 1900, 1999)], {
        creditPassedOn: 1,
        asOfYear: AS_OF,
      });
      // reach 5 multiplies by 3; the period runs 100 years.
      const expected = (weight(d0) * 8 * 3 * 100) / unitYears;
      expect(r.profile.benefit[d0]).toBeCloseTo(expected, 10);
      expect(r.magnitude).toBeCloseTo(expected, 10);
      expect(r.tail).toBeNull();
    });

    test("harm never cancels benefit", () => {
      const r = calculateImpact(
        scoring,
        [assessment(1, { [d4]: 8 }, { [d2]: 9, [d3]: 9 })],
        [period(1, 1900, 1999)],
        { creditPassedOn: 1, asOfYear: AS_OF },
      );
      expect(r.benefit_total).toBeGreaterThan(0);
      expect(r.harm_total).toBeGreaterThan(0);
      expect(r.magnitude).toBeCloseTo(r.benefit_total + r.harm_total, 10);
    });

    test("magnitude is exactly the sum of the profile's areas", () => {
      const r = calculateImpact(
        scoring,
        [
          assessment(1, { [d0]: 3, [d1]: 5, [d4]: 2 }, { [d3]: 4 }),
          assessment(1, { [d0]: 7 }, { [d2]: 6 }),
          assessment(2, { [d1]: 9 }, { [d1]: 2 }),
        ],
        [period(1, -500, -400, 7, 9), period(2, 100, 300, 4, 3)],
        { creditPassedOn: 0, asOfYear: AS_OF },
      );
      expect(r.magnitude).toBeCloseTo(profileMagnitude(r.profile), 10);
      expect(r.magnitude).toBeCloseTo(sumDimensions(r.profile.benefit) + sumDimensions(r.profile.harm), 10);
      expect(Object.keys(r.profile.benefit)).toEqual(keys);
    });

    test("several assessments of one period are averaged, not added", () => {
      const one = calculateImpact(scoring, [assessment(1, { [d3]: 6 })], [period(1, 1950, 1959)], {
        creditPassedOn: 1,
        asOfYear: AS_OF,
      });
      const two = calculateImpact(
        scoring,
        [assessment(1, { [d3]: 4 }), assessment(1, { [d3]: 8 })],
        [period(1, 1950, 1959)],
        { creditPassedOn: 1, asOfYear: AS_OF },
      );
      expect(two.magnitude).toBeCloseTo(one.magnitude, 10);
    });

    test("the tail shrinks by the credit passed on, and goes when all of it is", () => {
      const run = (creditPassedOn: number) =>
        calculateImpact(scoring, [assessment(1, { [d4]: 5 })], [period(1, 1600, 1610, 5, 9)], {
          creditPassedOn,
          asOfYear: AS_OF,
        });
      const alone = run(0);
      const partly = run(0.7);
      const carried = run(1);
      expect(alone.tail!.from_year).toBe(1611);
      expect(partly.tail!.kept).toBeCloseTo(0.3, 10);
      expect(profileMagnitude(partly.tail!.area)).toBeCloseTo(0.3 * profileMagnitude(alone.tail!.area), 10);
      expect(carried.tail).toBeNull();
      expect(run(1.4).tail).toBeNull();
      const whole = curveAreaBetween(partly.curve, -20000, 3000);
      expect((whole.benefit + whole.harm) / unitYears).toBeCloseTo(partly.magnitude, 6);
    });

    test("a permanent legacy keeps its level to the as-of year", () => {
      const r = calculateImpact(scoring, [assessment(1, { [d0]: 5 })], [period(1, 1900, 1925, 5, 10)], {
        creditPassedOn: 0,
        asOfYear: AS_OF,
      });
      const level = weight(d0) * 5 * 3;
      expect(r.tail!.area.benefit[d0]).toBeCloseTo((level * (AS_OF - 1925)) / unitYears, 10);
    });

    test("assessments without a known period are counted as unplaced and add nothing", () => {
      const r = calculateImpact(
        scoring,
        [assessment(null, { [d3]: 10 }), assessment(99, { [d3]: 10 })],
        [period(1, 1, 2)],
        { creditPassedOn: 0, asOfYear: AS_OF },
      );
      expect(r.unplaced_assessments).toBe(2);
      expect(r.magnitude).toBe(0);
    });

    test("a period that has not started adds nothing; one that is under way counts to the as-of year", () => {
      const r = calculateImpact(
        scoring,
        [assessment(1, { [d1]: 5 }), assessment(2, { [d1]: 5 })],
        [period(1, 2000, 2050), period(2, 2030, 2040)],
        { creditPassedOn: 0, asOfYear: AS_OF },
      );
      expect(r.breakdown).toHaveLength(1);
      expect(r.breakdown[0].years).toBe(27);
      expect(r.tail).toBeNull();
    });

    test("a profile missing one of the site's dimensions is an error, never a zero", () => {
      const partial = { period_id: 1, benefit: { [d0]: 5 }, harm: { [d0]: 1 } } as AssessmentInput;
      expect(() => calculateImpact(scoring, [partial], [period(1, 1900, 1910)], { creditPassedOn: 0, asOfYear: AS_OF })).toThrow(
        /no value for dimension/,
      );
    });
  });

  describe(`${site.key}: the curve`, () => {
    test("the area under the whole curve equals magnitude", () => {
      const r = calculateImpact(
        scoring,
        [assessment(1, { [d0]: 6 }, { [d3]: 3 }), assessment(2, { [d4]: 4 }, { [d1]: 1 })],
        [period(1, -300, -200, 6, 7), period(2, -250, 50, 3, 8)],
        { creditPassedOn: 0, asOfYear: AS_OF },
      );
      const whole = curveAreaBetween(r.curve, -20000, 3000);
      expect((whole.benefit + whole.harm) / unitYears).toBeCloseTo(r.magnitude, 6);
    });

    test("bucket means keep the area of an event shorter than its bucket", () => {
      const r = calculateImpact(scoring, [assessment(1, { [d2]: 7 })], [period(1, 1096, 1099)], {
        creditPassedOn: 1,
        asOfYear: AS_OF,
      });
      const edges = [1000, 1050, 1100, 1150];
      const s = sampleCurve(r.curve, edges);
      expect(s.benefit[0]).toBe(0);
      expect(s.benefit[1] * 50).toBeCloseTo(r.magnitude * unitYears, 6);
      expect(s.benefit[2]).toBe(0);
    });
  });

  describe(`${site.key}: tiers`, () => {
    test("tiers follow the thresholds, or are null until calibrated", () => {
      const low = classifyMagnitude(scoring.tiers, 0);
      const high = classifyMagnitude(scoring.tiers, 1e9);
      if (!scoring.tiers) {
        expect(low).toBeNull();
        expect(high).toBeNull();
      } else {
        expect(low!.tier).toBe(scoring.tiers[0].tier);
        expect(high!.tier).toBe(scoring.tiers[scoring.tiers.length - 1].tier);
      }
    });
  });
}

describe("helpers", () => {
  test("reach 5 multiplies by 3 and reach 10 by 3 × 2^1.8", () => {
    expect(reachMultiplier(5)).toBeCloseTo(3, 10);
    expect(reachMultiplier(10)).toBeCloseTo(3 * Math.pow(2, 1.8), 10);
  });
});
