import { describe, expect, test } from "bun:test";
import { buildClefRequest, CLEF_MAX_QUESTIONS } from "../src/lib/clef";
import { SITES } from "../src/sites";
import { inventions } from "../src/sites/inventions";
import { shadowyrealm } from "../src/sites/shadowyrealm";
import fixtures from "./fixtures/clef-shadowyrealm.json";

describe("ShadowyRealm's Clef requests", () => {
  // The fixtures are the requests built before the platform (site-platform 6.5), with two changes since:
  // an entity with no linked consequences counts the effects that followed from it (2026-11-14), and
  // benefit questions are scored on the benefit-worded levels (2026-11-15).
  test("are byte for byte the recorded requests", () => {
    for (const f of fixtures) {
      const built = buildClefRequest(shadowyrealm, { ...f.input, entity_type: f.entity_type });
      expect(JSON.stringify(built)).toBe(JSON.stringify(f.request));
    }
  });
});

describe("every site's intensity questions", () => {
  test("score a benefit on the benefit-worded levels and a harm on the harm-worded ones", () => {
    for (const site of Object.values(SITES)) {
      const r = buildClefRequest(site, {
        entity: "X",
        entity_type: site.entityTypes[0].key,
        period: "p",
        start_year: 1900,
        end_year: 1901,
        excluded: [],
        evidence: "e",
      });
      const q = r.questions as Record<string, { criteria: readonly string[] }>;
      for (const d of site.scoring.dimensions) {
        expect(q[`${d.key}_benefit`].criteria).toEqual(site.scoring.rubrics.intensity.benefit);
        expect(q[`${d.key}_harm`].criteria).toEqual(site.scoring.rubrics.intensity.harm);
      }
    }
  });

  test("never describe a benefit as a catastrophe", () => {
    for (const site of Object.values(SITES)) {
      for (const label of site.scoring.rubrics.intensity.benefit) expect(label).not.toMatch(/catastroph|severe|extreme/i);
    }
  });
});

describe("Inventions' Clef requests", () => {
  const period = {
    entity: "Transistor",
    entity_type: "invention",
    period: "Mass adoption",
    start_year: 1960,
    end_year: 2026,
    excluded: ["Integrated circuit"],
    evidence: "Transistors replaced vacuum tubes in radios, computers and every electronic device.",
  };

  test("name an invention by its making and use", () => {
    const r = buildClefRequest(inventions, period);
    const q = r.questions as Record<string, { instructions: string }>;
    expect(q.prosperity_benefit.instructions).toContain("the making and use of Transistor during");
    expect(q.reach.instructions).toContain("How many people did the making and use of Transistor during");
  });

  test("judge Environment by the natural world too, and the rest by people", () => {
    const q = buildClefRequest(inventions, period).questions as Record<string, { instructions: string }>;
    expect(q.environment_harm.instructions).toContain("caused to the people and the natural world it affected");
    expect(q.environment_harm.instructions).toContain("not how widely");
    expect(q.health_harm.instructions).toContain("caused to the people it affected");
  });

  test("name a person by their own work and a discovery by its spread and use", () => {
    const person = buildClefRequest(inventions, { ...period, entity: "Jack Kilby", entity_type: "person" });
    const discovery = buildClefRequest(inventions, { ...period, entity: "Electromagnetic induction", entity_type: "discovery" });
    expect(JSON.stringify(person)).toContain("Jack Kilby's own direct activity");
    expect(JSON.stringify(discovery)).toContain("the spread and use of Electromagnetic induction");
  });
});

describe("every site", () => {
  test("asks no more questions than Clef answers", () => {
    for (const site of Object.values(SITES)) {
      const r = buildClefRequest(site, {
        entity: "X",
        entity_type: site.entityTypes[0].key,
        period: "p",
        start_year: 1900,
        end_year: 1901,
        excluded: [],
        evidence: "e",
      });
      expect(Object.keys(r.questions).length).toBe(site.scoring.dimensions.length * 2 + 2);
      expect(Object.keys(r.questions).length).toBeLessThanOrEqual(CLEF_MAX_QUESTIONS);
    }
  });
});
