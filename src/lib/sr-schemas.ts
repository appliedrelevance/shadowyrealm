/**
 * Input schemas for the ShadowyRealm service layer.
 *
 * One definition, used by both projections of the service: MCP tool inputs
 * (src/worker/mcp.ts) and the manual-control HTTP handlers (src/worker/api.ts).
 * Ranges mirror the CHECK constraints in the shadowyrealm schema.
 */
import { z } from "zod";

export const entityTypeSchema = z.enum(["person", "organization", "event"]);
export const statusSchema = z.enum([
  "draft",
  "submitted",
  "under_review",
  "published",
  "archived",
]);
export const relationshipTypeSchema = z.enum([
  "influence",
  "mentorship",
  "collaboration",
  "opposition",
]);

const slug = z.string().min(1).describe('The entity slug, e.g. "marie-curie"');
const level = z.number().min(0).max(10);
const justification = z.string().min(1);
const unit = z.number().min(0).max(1);
const metadata = z
  .record(z.string(), z.unknown())
  .describe("Free-form object; see the tool description for the conventional keys");

export const listEntitiesInput = z.object({
  entity_type: entityTypeSchema.optional(),
  status: statusSchema.optional(),
  q: z.string().min(1).optional().describe("Case-insensitive substring of the name"),
  limit: z.number().int().min(1).max(200).default(50),
  offset: z.number().int().min(0).default(0),
});

export const getEntityInput = z.object({ slug });

export const researchEntityInput = z.object({
  query: z.string().min(1).describe('A Wikipedia article title, e.g. "Marie Curie"'),
});

export const createEntityInput = z.object({
  name: z.string().min(1),
  entity_type: entityTypeSchema,
  description: z.string().min(1).describe("One or two sentences"),
  biography: z.string().min(1).optional(),
  image_url: z.string().url().optional(),
  metadata: metadata.optional(),
  slug: slug.optional().describe("Defaults to the slugified name"),
});

export const updateEntityInput = z.object({
  slug,
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  biography: z.string().min(1).nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  metadata: metadata.nullable().optional(),
});

export const setEntityStatusInput = z.object({ slug, status: statusSchema });

export const deleteEntityInput = z.object({ slug });

export const addAssessmentInput = z.object({
  slug,
  scientific_benefit: level,
  scientific_harm: level,
  economic_benefit: level,
  economic_harm: level,
  human_rights_benefit: level,
  human_rights_harm: level,
  health_benefit: level,
  health_harm: level,
  cultural_benefit: level,
  cultural_harm: level,
  scientific_justification: justification,
  economic_justification: justification,
  human_rights_justification: justification,
  health_justification: justification,
  cultural_justification: justification,
  confidence_level: unit.optional().describe("0 to 1; the database default is 0.5"),
  period_id: z
    .number()
    .int()
    .describe("An assessment period of the same entity (ids are in get_entity)"),
  ai_suggested: z.boolean().optional(),
  ai_model_used: z.string().optional(),
});

export const scorePeriodInput = z.object({
  slug,
  period_id: z.number().int().describe("An assessment period of the same entity (ids are in get_entity)"),
  evidence: z
    .string()
    .min(200)
    .max(8000)
    .describe("Evidence about this period, from a source such as Wikipedia: 200 to 8,000 characters"),
  source_url: z.string().url().optional().describe("Where the evidence came from"),
});

export const getScoresInput = z.object({
  include_drafts: z.boolean().default(false).describe("Score every status, not only published entities"),
});

export const addPeriodInput = z
  .object({
    slug,
    label: z.string().min(1),
    start_year: z.number().int().min(-5000).max(2100).describe("Negative for BCE"),
    end_year: z.number().int().min(-5000).max(2100),
    description: z.string().min(1).optional(),
    reach_factor: z.number().int().min(1).max(10),
    persistence_factor: z.number().int().min(1).max(10),
  })
  .refine((d) => d.end_year >= d.start_year, {
    message: "end_year must be >= start_year",
    path: ["end_year"],
  });

export const addRelationshipInput = z.object({
  source_slug: slug.describe("The cause"),
  target_slug: slug.describe("The consequence"),
  relationship_type: relationshipTypeSchema,
  description: z.string().min(1),
  strength: unit.describe("For influence and mentorship, the share of the consequence credited to the cause"),
  temporal_overlap: unit.default(0.5),
});

export type ListEntitiesInput = z.infer<typeof listEntitiesInput>;
export type GetEntityInput = z.infer<typeof getEntityInput>;
export type ResearchEntityInput = z.infer<typeof researchEntityInput>;
export type CreateEntityInput = z.infer<typeof createEntityInput>;
export type UpdateEntityInput = z.infer<typeof updateEntityInput>;
export type SetEntityStatusInput = z.infer<typeof setEntityStatusInput>;
export type DeleteEntityInput = z.infer<typeof deleteEntityInput>;
export type AddAssessmentInput = z.infer<typeof addAssessmentInput>;
export type ScorePeriodInput = z.infer<typeof scorePeriodInput>;
export type GetScoresInput = z.infer<typeof getScoresInput>;
export type AddPeriodInput = z.infer<typeof addPeriodInput>;
export type AddRelationshipInput = z.infer<typeof addRelationshipInput>;
