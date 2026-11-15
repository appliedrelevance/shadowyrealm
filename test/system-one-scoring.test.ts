import { describe, expect, test } from "bun:test";
import { buildClairicRequest, CLAIRIC_MODEL, readClairicAnswers } from "../src/lib/clairic";
import { walkShares } from "../src/lib/credit";
import { buildClefRequest, CLEF_MODEL, depthOf, readClefAnswers } from "../src/lib/clef";
import { inventions } from "../src/sites/inventions";
import { shadowyrealm } from "../src/sites/shadowyrealm";
import { keyOf } from "../src/lib/system-one";
import recorded from "./fixtures/system-one-shadowyrealm.json";

describe("ShadowyRealm's System One requests", () => {
  // The fixture is one period of the 2026-11-15 pilot over whole Wikipedia articles, which froze the
  // scoring; the keys are the System One cache's keys of the requests that pilot sent, the Clef one as
  // re-asked the same day with benefit questions on the benefit-worded levels. The key is the one
  // score_period computes, so the cache's answers are the Worker's.
  test("are byte for byte the ones the frozen scoring was measured with", () => {
    expect(keyOf(CLEF_MODEL, buildClefRequest(shadowyrealm, recorded.input))).toBe(recorded.clef_key);
    expect(keyOf(CLAIRIC_MODEL, buildClairicRequest(shadowyrealm, recorded.input))).toBe(recorded.clairic_key);
  });

  test("ask Clairic for every dimension's benefit and harm, in people a year", () => {
    const r = buildClairicRequest(shadowyrealm, recorded.input);
    const fields = r.fields as Record<string, { type: string; min: number; max: number; scale: string; instructions: string }>;
    expect(Object.keys(fields)).toEqual(shadowyrealm.scoring.dimensions.flatMap((d) => [`${d.key}_benefit`, `${d.key}_harm`]));
    for (const f of Object.values(fields)) {
      expect(f).toMatchObject({ type: "estimate", min: 1, max: 10_000_000_000, scale: "log" });
      expect(f.instructions).toContain("how many living people");
    }
    expect(r.state).toContain(recorded.input.evidence);
  });
});

describe("depth", () => {
  test("is 0 for a flat answer, 10 for certainty on the top level and 0 for certainty on the bottom", () => {
    expect(depthOf(Array(10).fill(0.1))).toBeCloseTo(0, 10);
    expect(depthOf([0, 0, 0, 0, 0, 0, 0, 0, 0, 1])).toBeCloseTo(10, 10);
    expect(depthOf([1, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBeCloseTo(0, 10);
  });

  test("counts a confident answer for more than a spread one with the same expected value", () => {
    const sure = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
    const spread = [0, 0, 0, 0.25, 0.25, 0, 0.25, 0.25, 0, 0];
    expect(depthOf(sure)).toBeGreaterThan(depthOf(spread));
  });

  test("is what ShadowyRealm reads from Clef, and Prior Art still reads the expected value", () => {
    const response = { answers: recorded.clef_answers };
    const people = readClefAnswers(shadowyrealm.scoring, response);
    for (const d of shadowyrealm.scoring.dimensions) {
      const p = (recorded.clef_answers as Record<string, { probabilities: Record<string, number> }>)[`${d.key}_benefit`].probabilities;
      const expected = Math.round(depthOf(Array.from({ length: 10 }, (_, k) => p[String(k)])) * 100) / 100;
      expect(people.benefit[d.key]).toBe(expected);
    }
    const reachMode = readClefAnswers({ ...shadowyrealm.scoring, breadth: "reach" }, response);
    const score = (recorded.clef_answers as Record<string, { score: number }>)[`${shadowyrealm.scoring.dimensions[0].key}_benefit`].score;
    expect(reachMode.benefit[shadowyrealm.scoring.dimensions[0].key]).toBe(Math.round(((score * 10) / 9) * 100) / 100);
    expect(inventions.scoring.breadth).toBe("reach");
  });

  test("an answer without probabilities is an error naming the question", () => {
    const answers = structuredClone(recorded.clef_answers) as Record<string, { probabilities?: unknown }>;
    delete answers.health_harm.probabilities;
    expect(() => readClefAnswers(shadowyrealm.scoring, { answers })).toThrow(/"health_harm" has no probabilities/);
  });
});

describe("Clairic's head-counts", () => {
  test("are each field's median", () => {
    const people = readClairicAnswers(shadowyrealm.scoring, { answers: recorded.clairic_answers });
    for (const d of shadowyrealm.scoring.dimensions) {
      const a = recorded.clairic_answers as Record<string, { median: number }>;
      expect(people.benefit[d.key]).toBe(a[`${d.key}_benefit`].median);
      expect(people.harm[d.key]).toBe(a[`${d.key}_harm`].median);
    }
  });

  test("a field without a usable median is an error naming it", () => {
    const answers = structuredClone(recorded.clairic_answers) as Record<string, { median?: unknown }>;
    answers.economic_benefit = {};
    expect(() => readClairicAnswers(shadowyrealm.scoring, { answers })).toThrow(/"economic_benefit" has no usable median/);
  });
});

describe("credit by walks", () => {
  const link = (s: number, t: number, strength: number, relationship_type = "influence") => ({
    source_entity_id: s,
    target_entity_id: t,
    relationship_type,
    strength,
  });
  const credit = new Set(["influence", "mentorship"]);
  const share = (rows: { ancestor_id: number; descendant_id: number; share: number | string }[], a: number, d: number) =>
    Number(rows.find((r) => r.ancestor_id === a && r.descendant_id === d)?.share ?? 0);

  test("adds up every route, not only the strongest", () => {
    const rows = walkShares([link(1, 2, 0.5), link(2, 3, 0.4), link(1, 3, 0.1)], credit);
    expect(share(rows, 1, 2)).toBeCloseTo(0.5, 12);
    expect(share(rows, 2, 3)).toBeCloseTo(0.4, 12);
    expect(share(rows, 1, 3)).toBeCloseTo(0.1 + 0.5 * 0.4, 12);
  });

  test("stops at the ancestor, so a cycle never credits more than all of a consequence", () => {
    const rows = walkShares([link(1, 2, 0.9), link(2, 1, 0.9), link(2, 3, 0.9)], credit);
    expect(share(rows, 1, 2)).toBeCloseTo(0.9, 12);
    expect(share(rows, 1, 3)).toBeCloseTo(0.81, 12);
    for (const r of rows) expect(Number(r.share)).toBeLessThanOrEqual(1);
  });

  test("drops shares under 0.001 and links that carry no credit", () => {
    const rows = walkShares([link(1, 2, 0.03), link(2, 3, 0.03), link(3, 4, 0.9, "opposition")], credit);
    expect(share(rows, 1, 3)).toBe(0);
    expect(share(rows, 3, 4)).toBe(0);
    expect(share(rows, 1, 2)).toBeCloseTo(0.03, 12);
  });
});
