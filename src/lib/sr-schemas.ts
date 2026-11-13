/**
 * Input schemas for the service layer, built for one site.
 *
 * One definition, used by both projections of the service: MCP tool inputs
 * (src/worker/mcp.ts) and the manual-control HTTP handlers (src/worker/api.ts).
 * Entity types, link types, dimension fields and the earliest year come from
 * the site config; ranges mirror the CHECK constraints in every site's schema.
 */
import { z } from "zod";
import { dimensionKeys } from "../sites";
import type { SiteConfig } from "../sites/types";

export const statusSchema = z.enum(["draft", "submitted", "under_review", "published", "archived"]);

const slug = z.string().min(1).describe('The entity slug, e.g. "marie-curie"');
const level = z.number().min(0).max(10);
const justification = z.string().min(1);
const unit = z.number().min(0).max(1);
const metadata = z
  .record(z.string(), z.unknown())
  .describe("Free-form object; see the tool description for the conventional keys");

function keysOf<T extends { key: string }>(items: readonly T[]): [string, ...string[]] {
  const keys = items.map((i) => i.key);
  if (keys.length === 0) throw new Error("A site needs at least one entity type and one link type");
  return keys as [string, ...string[]];
}

function build(site: SiteConfig) {
  const entityType = z.enum(keysOf(site.entityTypes));
  const relationshipType = z.enum(keysOf(site.linkTypes));
  const creditNames = site.linkTypes.filter((t) => t.credit).map((t) => t.key).join(" and ");
  const earliest = site.timeline.start;

  const dimensionFields: Record<string, z.ZodTypeAny> = {};
  for (const d of dimensionKeys(site)) {
    dimensionFields[`${d}_benefit`] = level;
    dimensionFields[`${d}_harm`] = level;
  }
  for (const d of dimensionKeys(site)) dimensionFields[`${d}_justification`] = justification;

  return {
    entityTypeSchema: entityType,
    relationshipTypeSchema: relationshipType,

    listEntitiesInput: z.object({
      entity_type: entityType.optional(),
      status: statusSchema.optional(),
      q: z.string().min(1).optional().describe("Case-insensitive substring of the name"),
      limit: z.number().int().min(1).max(200).default(50),
      offset: z.number().int().min(0).default(0),
    }),

    getEntityInput: z.object({ slug }),

    researchEntityInput: z.object({
      query: z.string().min(1).describe('A Wikipedia article title, e.g. "Marie Curie"'),
    }),

    createEntityInput: z.object({
      name: z.string().min(1),
      entity_type: entityType,
      description: z.string().min(1).describe("One or two sentences"),
      biography: z.string().min(1).optional(),
      image_url: z.string().url().optional(),
      metadata: metadata.optional(),
      slug: slug.optional().describe("Defaults to the slugified name"),
    }),

    updateEntityInput: z.object({
      slug,
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      biography: z.string().min(1).nullable().optional(),
      image_url: z.string().url().nullable().optional(),
      metadata: metadata.nullable().optional(),
    }),

    setEntityStatusInput: z.object({ slug, status: statusSchema }),

    deleteEntityInput: z.object({ slug }),

    addAssessmentInput: z.object({
      slug,
      ...dimensionFields,
      confidence_level: unit.optional().describe("0 to 1; the database default is 0.5"),
      period_id: z.number().int().describe("An assessment period of the same entity (ids are in get_entity)"),
      ai_suggested: z.boolean().optional(),
      ai_model_used: z.string().optional(),
    }),

    scorePeriodInput: z.object({
      slug,
      period_id: z.number().int().describe("An assessment period of the same entity (ids are in get_entity)"),
      evidence: z
        .string()
        .min(200)
        .max(8000)
        .describe("Evidence about this period, from a source such as Wikipedia: 200 to 8,000 characters"),
      source_url: z
        .string()
        .url()
        .optional()
        .describe("Where the evidence came from: for Wikipedia, the permalink of the revision read (index.php?oldid=…)"),
    }),

    getScoresInput: z.object({
      include_drafts: z.boolean().default(false).describe("Score every status, not only published entities"),
    }),

    addPeriodInput: z
      .object({
        slug,
        label: z.string().min(1),
        start_year: z
          .number()
          .int()
          .min(earliest, { message: `start_year must be ${earliest} or later, the start of ${site.brand.name}'s timeline` })
          .max(2100)
          .describe(`Negative for BCE; no earlier than ${earliest}`),
        end_year: z.number().int().min(earliest).max(2100),
        description: z.string().min(1).optional(),
        reach_factor: z.number().int().min(1).max(10),
        persistence_factor: z.number().int().min(1).max(10),
      })
      .refine((d) => d.end_year >= d.start_year, {
        message: "end_year must be >= start_year",
        path: ["end_year"],
      }),

    addRelationshipInput: z.object({
      source_slug: slug.describe("The cause"),
      target_slug: slug.describe("The consequence"),
      relationship_type: relationshipType,
      description: z.string().min(1),
      strength: unit.describe(`For ${creditNames}, the share of the consequence credited to the cause`),
      temporal_overlap: unit.default(0.5),
    }),
  };
}

export type SiteSchemas = ReturnType<typeof build>;

const cache = new Map<string, SiteSchemas>();

export function schemasFor(site: SiteConfig): SiteSchemas {
  let found = cache.get(site.key);
  if (!found) {
    found = build(site);
    cache.set(site.key, found);
  }
  return found;
}

export type ListEntitiesInput = z.infer<SiteSchemas["listEntitiesInput"]>;
export type GetEntityInput = z.infer<SiteSchemas["getEntityInput"]>;
export type ResearchEntityInput = z.infer<SiteSchemas["researchEntityInput"]>;
export type CreateEntityInput = z.infer<SiteSchemas["createEntityInput"]>;
export type UpdateEntityInput = z.infer<SiteSchemas["updateEntityInput"]>;
export type SetEntityStatusInput = z.infer<SiteSchemas["setEntityStatusInput"]>;
export type DeleteEntityInput = z.infer<SiteSchemas["deleteEntityInput"]>;
export type AddAssessmentInput = z.infer<SiteSchemas["addAssessmentInput"]>;
export type ScorePeriodInput = z.infer<SiteSchemas["scorePeriodInput"]>;
export type GetScoresInput = z.infer<SiteSchemas["getScoresInput"]>;
export type AddPeriodInput = z.infer<SiteSchemas["addPeriodInput"]>;
export type AddRelationshipInput = z.infer<SiteSchemas["addRelationshipInput"]>;
