import { describe, expect, test } from "bun:test";
import { SITES, siteFor } from "../src/sites";

/** Every registered site config meets site-platform Requirement 2. */
for (const site of Object.values(SITES)) {
  describe(site.key, () => {
    const typeKeys = new Set(site.entityTypes.map((t) => t.key));
    const linkKeys = new Set(site.linkTypes.map((t) => t.key));

    test("has 1 to 31 dimensions with unique lowercase SQL identifiers that fit Postgres", () => {
      const keys = site.scoring.dimensions.map((d) => d.key);
      expect(keys.length).toBeGreaterThanOrEqual(1);
      expect(keys.length).toBeLessThanOrEqual(31);
      expect(new Set(keys).size).toBe(keys.length);
      for (const k of keys) {
        expect(k).toMatch(/^[a-z][a-z0-9_]*$/);
        expect(`${k}_justification`.length).toBeLessThanOrEqual(63);
      }
    });

    test("has ten levels in every rubric and a time constant per persistence level", () => {
      const r = site.scoring.rubrics;
      expect(r.intensity).toHaveLength(10);
      expect(r.reach).toHaveLength(10);
      expect(r.persistence).toHaveLength(10);
      expect(r.persistenceTimeConstants).toHaveLength(10);
    });

    test("links name only its own entity types, and required links are its own link types", () => {
      for (const l of site.linkTypes) {
        for (const ends of [l.from, l.to]) if (ends !== "any") for (const t of ends) expect(typeKeys.has(t)).toBe(true);
        for (const t of Object.keys(l.labelsByTarget ?? {})) expect(typeKeys.has(t)).toBe(true);
      }
      for (const t of site.entityTypes) if (t.requiresOutgoing) expect(linkKeys.has(t.requiresOutgoing)).toBe(true);
      expect(site.linkTypes.some((l) => l.credit)).toBe(true);
    });

    test("puts every tick inside its timeline", () => {
      for (const tick of site.timeline.ticks) expect(tick).toBeGreaterThanOrEqual(site.timeline.start);
    });

    test("names its schema as an SQL identifier", () => {
      expect(site.schema).toMatch(/^[a-z][a-z0-9_]*$/);
    });

    test("has tiers in rising order, or none until calibrated", () => {
      const tiers = site.scoring.tiers;
      if (tiers) for (let i = 1; i < tiers.length; i++) expect(tiers[i].min).toBeGreaterThan(tiers[i - 1].min);
    });
  });
}

describe("the registry", () => {
  test("refuses an unknown or missing site, naming the ones it holds", () => {
    expect(() => siteFor("nope")).toThrow(/shadowyrealm, inventions/);
    expect(() => siteFor(undefined)).toThrow(/SITE must be one of/);
  });
});
