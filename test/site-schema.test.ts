import { describe, expect, test } from "bun:test";
import { Constants } from "../src/lib/database.types";
import { SITES } from "../src/sites";
import { siteSchemaDdl } from "../tools/site-schema";

/** Each site's config agrees with its generated schema (site-platform Requirement 5). */
for (const site of Object.values(SITES)) {
  describe(site.key, () => {
    const enums = (Constants as Record<string, { Enums: Record<string, readonly string[]> }>)[site.schema]?.Enums;

    test("has its schema in the generated database types", () => {
      expect(enums).toBeDefined();
    });

    test("names the same entity types and link types as its schema's enums", () => {
      expect([...enums.entity_type]).toEqual(site.entityTypes.map((t) => t.key));
      expect([...enums.relationship_type]).toEqual(site.linkTypes.map((t) => t.key));
    });

    test("generates DDL with its dimension columns and its credit link types", () => {
      const ddl = siteSchemaDdl(site);
      for (const d of site.scoring.dimensions) {
        expect(ddl).toContain(`${d.key}_benefit numeric(4,2) not null`);
        expect(ddl).toContain(`${d.key}_harm numeric(4,2) not null`);
        expect(ddl).toContain(`${d.key}_justification text not null`);
      }
      const credit = site.linkTypes.filter((t) => t.credit).map((t) => `'${t.key}'`).join(", ");
      expect(ddl).toContain(`where r.relationship_type in (${credit})`);
    });
  });
}
