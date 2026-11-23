import { describe, expect, test } from "bun:test";
import { Constants } from "../src/lib/database.types";
import { SITES } from "../src/sites";
import { siteSchemaDdl } from "../tools/site-schema";

/** Each site's config agrees with its generated schema (site-platform Requirement 5). */
for (const site of Object.values(SITES)) {
  describe(site.key, () => {
    const enums = (Constants as Record<string, { Enums: Record<string, readonly string[]> }>)[site.schema]?.Enums;
    // A site still being built has no schema until the monorepo creates it from this DDL.
    const awaitingSchema = site.brand.unlisted === true && enums === undefined;

    test.skipIf(awaitingSchema)("has its schema in the generated database types", () => {
      expect(enums).toBeDefined();
    });

    test.skipIf(awaitingSchema)("names the same entity types and link types as its schema's enums", () => {
      expect([...enums.entity_type]).toEqual(site.entityTypes.map((t) => t.key));
      expect([...enums.relationship_type]).toEqual(site.linkTypes.map((t) => t.key));
    });

    test("generates DDL with its dimension columns and no credit function, since the Worker walks credit", () => {
      const ddl = siteSchemaDdl(site);
      for (const d of site.scoring.dimensions) {
        expect(ddl).toContain(`${d.key}_benefit numeric(4,2) not null`);
        expect(ddl).toContain(`${d.key}_harm numeric(4,2) not null`);
        expect(ddl).toContain(`${d.key}_justification text not null`);
      }
      expect(ddl).not.toContain("create function");
      expect(ddl).toContain(`create or replace function ${site.schema}.update_updated_at()`);
    });

    test("counts people only where the site measures breadth in people, and keeps evidence once and four-place strengths everywhere", () => {
      const ddl = siteSchemaDdl(site);
      const people = site.scoring.breadth === "people";
      for (const d of site.scoring.dimensions) {
        expect(ddl.includes(`${d.key}_benefit_people numeric`)).toBe(people);
        expect(ddl.includes(`${d.key}_harm_people numeric`)).toBe(people);
      }
      expect(ddl).toContain("  evidence text");
      expect(ddl).toContain("strength numeric(5,4)");
    });
  });
}
