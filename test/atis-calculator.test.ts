import { describe, expect, test } from "bun:test";
import {
  calculateImpact,
  classifyMagnitude,
  curveAreaBetween,
  emptyDimensions,
  persistenceTimeConstant,
  profileMagnitude,
  reachMultiplier,
  reachOfShare,
  sampleCurve,
  sumDimensions,
  type AssessmentInput,
  type Dimensions,
  type PeriodInput,
} from "../src/lib/atis-calculator";
import { SITES } from "../src/sites";
import { meanWorldPopulation } from "../src/lib/world-population";

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
  // In people mode every assessment reaches everyone alive in each area unless a test says otherwise
  // (ten billion is more people than have ever been alive at once), so a level is weight × value ×
  // the multiplier of reach 10 there, and weight × value × the multiplier of the period's reach, 5
  // unless a test says otherwise, elsewhere.
  const countsPeople = scoring.breadth === "people";
  const counts = (n: number) => dims(Object.fromEntries(keys.map((k) => [k, n])));
  const everyone = () => ({ benefit: counts(10_000_000_000), harm: counts(10_000_000_000) });
  const breadth = countsPeople ? reachMultiplier(10) : 3;
  const assessment = (period_id: number | null, benefit: Partial<Dimensions>, harm: Partial<Dimensions> = {}): AssessmentInput => ({
    period_id,
    benefit: dims(benefit),
    harm: dims(harm),
    ...(countsPeople ? { people: everyone() } : {}),
  });

  describe(`${site.key}: calculateImpact`, () => {
    test("a period's area is weight × value × breadth × years / unit", () => {
      const r = calculateImpact(scoring, [assessment(1, { [d0]: 8 })], [period(1, 1900, 1999)], {
        creditPassedOn: 1,
        asOfYear: AS_OF,
      });
      // reach 5 multiplies by 3, and everyone alive (reach 10) by 3 × 2^1.8; the period runs 100 years.
      const expected = (weight(d0) * 8 * breadth * 100) / unitYears;
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

    test("a permanent legacy keeps its level once no finite persistence covers the years since", () => {
      const r = calculateImpact(scoring, [assessment(1, { [d0]: 5 })], [period(1, -100, -50, 5, 10)], {
        creditPassedOn: 0,
        asOfYear: AS_OF,
      });
      const level = weight(d0) * 5 * breadth;
      expect(r.tail!.area.benefit[d0]).toBeCloseTo((level * (AS_OF + 50)) / unitYears, 10);
    });

    test("a claim of permanence is held to what the years since have shown", () => {
      // Ended 101 years before the as-of year: fades over 150 years, the first level to cover 101.
      const r = calculateImpact(scoring, [assessment(1, { [d0]: 5 })], [period(1, 1900, 1925, 5, 10)], {
        creditPassedOn: 0,
        asOfYear: AS_OF,
      });
      const level = weight(d0) * 5 * breadth;
      const years = AS_OF - 1925;
      expect(r.tail!.area.benefit[d0]).toBeCloseTo((level * 150 * (1 - Math.exp(-years / 150))) / unitYears, 10);
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
      const partial = {
        period_id: 1,
        benefit: { [d0]: 5 },
        harm: { [d0]: 1 },
        ...(countsPeople ? { people: everyone() } : {}),
      } as AssessmentInput;
      expect(() => calculateImpact(scoring, [partial], [period(1, 1900, 1910)], { creditPassedOn: 0, asOfYear: AS_OF })).toThrow(
        /no value for dimension/,
      );
    });
  });

  if (countsPeople) {
    describe(`${site.key}: people`, () => {
      test("a level is weight × depth × the multiplier of each head-count's reach, not the period's", () => {
        const alive = meanWorldPopulation(1900, 1909);
        const people = everyone();
        people.benefit[d0] = alive / 1000;
        people.harm[d1] = alive / 100_000;
        const r = calculateImpact(
          scoring,
          [{ ...assessment(1, { [d0]: 4 }, { [d1]: 7 }), people }],
          [period(1, 1900, 1909, 2)],
          { creditPassedOn: 1, asOfYear: AS_OF },
        );
        const row = r.breakdown[0];
        expect(row.reach_multiplier).toBe(1);
        expect(row.world_population).toBe(alive);
        // A thousandth of everyone alive is reach 7, and a hundred-thousandth reach 5.
        expect(row.reach!.benefit[d0]).toBeCloseTo(7, 10);
        expect(row.reach!.harm[d1]).toBeCloseTo(5, 10);
        expect(row.level.benefit[d0]).toBeCloseTo(weight(d0) * 4 * reachMultiplier(7), 10);
        expect(row.level.harm[d1]).toBeCloseTo(weight(d1) * 7 * 3, 10);
        expect(r.profile.benefit[d0]).toBeCloseTo((weight(d0) * 4 * reachMultiplier(7) * 10) / unitYears, 10);
      });

      test("the same share of the world counts the same in any era", () => {
        const share = (start: number, end: number) => {
          const people = everyone();
          people.benefit[d0] = meanWorldPopulation(start, end) / 50;
          return people;
        };
        const r = calculateImpact(
          scoring,
          [
            { ...assessment(1, { [d0]: 6 }), people: share(-2000, -1901) },
            { ...assessment(2, { [d0]: 6 }), people: share(1900, 1999) },
          ],
          [period(1, -2000, -1901), period(2, 1900, 1999)],
          { creditPassedOn: 1, asOfYear: AS_OF },
        );
        expect(r.breakdown[0].world_population!).toBeLessThan(r.breakdown[1].world_population! / 10);
        expect(r.breakdown[0].level.benefit[d0]).toBeCloseTo(r.breakdown[1].level.benefit[d0], 10);
      });

      test("an assessment with no head-counts is unplaced and adds nothing", () => {
        const r = calculateImpact(
          scoring,
          [{ ...assessment(1, { [d0]: 9 }), people: null }],
          [period(1, 1900, 1909)],
          { creditPassedOn: 0, asOfYear: AS_OF },
        );
        expect(r.unplaced_assessments).toBe(1);
        expect(r.magnitude).toBe(0);
      });
    });
  }

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

  test("a head-count's reach is one level per factor of ten below everyone alive", () => {
    expect(reachOfShare(8_000_000, 8_000_000)).toBe(10);
    expect(reachOfShare(800_000, 8_000_000)).toBeCloseTo(9, 10);
    expect(reachOfShare(80, 8_000_000_000)).toBeCloseTo(2, 10);
    // More people than are alive reach everyone; nobody, or one in ten billion or fewer, reaches nothing.
    expect(reachOfShare(9_000_000_000, 8_000_000_000)).toBe(10);
    expect(reachOfShare(0, 8_000_000_000)).toBe(0);
    expect(reachOfShare(1, 20_000_000_000)).toBe(0);
    expect(() => reachOfShare(5, 0)).toThrow(/population above zero/);
  });

  test("a legacy fades no slower than the years since it ended have shown", () => {
    const constants = [1, 3, 10, 25, 70, 150, 300, 700, 2000, Infinity];
    // Claimed "several centuries" (300 years), ended 17 years ago: held to within a generation.
    expect(persistenceTimeConstant(7, constants, 17)).toBe(25);
    // Claimed "within a decade", ended 500 years ago: the claim is the lower, so it stands.
    expect(persistenceTimeConstant(3, constants, 500)).toBe(10);
    // Ended exactly a generation ago: a generation covers it.
    expect(persistenceTimeConstant(9, constants, 25)).toBe(25);
    // "Permanent" is kept only once no finite level covers the years passed.
    expect(persistenceTimeConstant(10, constants, 3000)).toBe(Infinity);
    expect(persistenceTimeConstant(7, constants)).toBe(300);
  });
});
