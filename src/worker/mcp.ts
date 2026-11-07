/**
 * ShadowyRealm MCP server — the primary control surface.
 *
 * Stateless: a fresh McpServer per request (createMcpHandler calls the factory).
 * Tools are one-line wrappers over src/lib/sr-service.ts; all logic lives there.
 */
import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { research } from "../lib/research";
import * as schemas from "../lib/sr-schemas";
import * as service from "../lib/sr-service";
import type { Env, ExecutionContext } from "./env";

const SERVER_INFO = { name: "shadowyrealm", version: "1.0.0" };

const INSTRUCTIONS = `ShadowyRealm is a historical impact index that measures influence, not net good. An entity is \
a person, organization or event; whether it really existed does not matter. Each entity has periods (spans of years \
with reach and persistence, 1-10), and each period has assessments that rate a BENEFIT and a HARM from 0 to 10 for \
five dimensions (scientific, economic, human_rights, health, cultural). The score is a ten-number profile; benefit \
and harm are never netted. Magnitude, the sum of the ten, ranks entities.

Links point from cause to consequence. influence and mentorship links carry credit: strength is the share of the \
consequence credited to the cause, and credit flows up any number of hops by the strongest chain. A reaction is \
recorded as influence from whatever provoked it.

The usual flow: research_entity for the Wikipedia summary, create_entity, add_period for each phase of its activity, \
add_relationship for its causes and consequences, then score_period for each period with evidence text. \
Read freely: list_entities, get_entity, research_entity, get_scores. Confirm with the user before set_entity_status \
to "published" or "archived" (both change what the public sees) and before delete_entity (irreversible).`;

/** Safe to call without side effects. */
const READ = { readOnlyHint: true, openWorldHint: false } as const;

/** Mutates state inside the system, no real-world side effect. */
const WRITE = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: false,
} as const;

/** Irreversible state change on existing data. */
const DESTRUCTIVE = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: false,
  openWorldHint: false,
} as const;

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function fail(message: string) {
  return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
}

async function guard(fn: () => Promise<unknown>) {
  try {
    return ok(await fn());
  } catch (err) {
    return fail(err instanceof Error ? err.message : String(err));
  }
}

export function buildMcpServer(env: Env): McpServer {
  const server = new McpServer(SERVER_INFO, { instructions: INSTRUCTIONS });

  server.registerTool(
    "list_entities",
    {
      description:
        "List entities in the Impact Index, newest first. Returns id, slug, name, type, status, description and " +
        "timestamps, plus the total match count for paging. Includes every status from draft to archived — this " +
        "is the operator view, not the public one. Use get_entity for full detail.",
      inputSchema: schemas.listEntitiesInput,
      annotations: READ,
    },
    async (args) => guard(() => service.listEntities(env, args)),
  );

  server.registerTool(
    "get_entity",
    {
      description:
        "Fetch one entity by slug with everything attached: its assessments (benefit and harm 0-10 for each " +
        "dimension, justifications cut to 300 characters, confidence, provenance), assessment periods (reach and " +
        "persistence 1-10), relationships in both directions (each with the other entity's slug and name), and the " +
        "50 most recent audit-log entries. Errors if the slug does not exist or is shared by more than one entity.",
      inputSchema: schemas.getEntityInput,
      annotations: READ,
    },
    async (args) => guard(() => service.getEntity(env, args)),
  );

  server.registerTool(
    "research_entity",
    {
      description:
        "Look an article up on Wikipedia: its title, summary extract, thumbnail, categories and page URL. Writes " +
        "nothing and calls no model. Use it to draft create_entity, and gather score_period evidence from the article.",
      inputSchema: schemas.researchEntityInput,
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async (args) => guard(() => research(args)),
  );

  server.registerTool(
    "create_entity",
    {
      description:
        "Create an entity in 'draft' status. The slug defaults to the slugified name and the call fails if another " +
        "entity already uses it. metadata is free-form; the conventional keys are — person: birth_date, death_date, " +
        "nationality, gender, wikipedia_url. organization: founded_date, dissolved_date, headquarters, " +
        "organization_type (corporation|ngo|government|institution|military), wikipedia_url. event: start_date, " +
        "end_date, location, event_type (war|discovery|movement|disaster|treaty|revolution), wikipedia_url. " +
        "Returns the created row.",
      inputSchema: schemas.createEntityInput,
      annotations: WRITE,
    },
    async (args) => guard(() => service.createEntity(env, args)),
  );

  server.registerTool(
    "update_entity",
    {
      description:
        "Partially update an entity's name, description, biography, image_url or metadata. Only the fields you " +
        "pass change; metadata replaces the whole object; null clears biography, image_url or metadata. The slug " +
        "and type cannot be changed. Errors if no field is given. Returns the updated row.",
      inputSchema: schemas.updateEntityInput,
      annotations: WRITE,
    },
    async (args) => guard(() => service.updateEntity(env, args)),
  );

  server.registerTool(
    "set_entity_status",
    {
      description:
        "Move an entity to any publication status: draft, submitted, under_review, published or archived. Only " +
        "'published' entities are visible to the public, so publishing and un-publishing take effect immediately. " +
        "Records an audit-log entry. Errors if the entity already has that status, or if publishing would " +
        "duplicate the slug of another published entity.",
      inputSchema: schemas.setEntityStatusInput,
      annotations: WRITE,
    },
    async (args) => guard(() => service.setEntityStatus(env, args)),
  );

  server.registerTool(
    "delete_entity",
    {
      description:
        "Permanently delete a DRAFT entity together with its assessments, periods, relationships and audit trail. " +
        "This cannot be undone. Only drafts can be deleted; to retire anything else, archive it with " +
        "set_entity_status.",
      inputSchema: schemas.deleteEntityInput,
      annotations: DESTRUCTIVE,
    },
    async (args) => guard(() => service.deleteEntity(env, args)),
  );

  server.registerTool(
    "add_assessment",
    {
      description:
        "Add a hand-made assessment to one period of an entity: a benefit and a harm level from 0 to 10 for each " +
        "dimension (scientific, economic, human_rights, health, cultural) and a non-empty justification per " +
        "dimension. Benefit and harm rate intensity for the people affected; breadth belongs to the period's reach. " +
        "Several assessments of one period are averaged. confidence_level (0-1) defaults to 0.5. Prefer " +
        "score_period, which has Clef do the rating. Records an audit-log entry. Returns the created row.",
      inputSchema: schemas.addAssessmentInput,
      annotations: WRITE,
    },
    async (args) => guard(() => service.addAssessment(env, args)),
  );

  server.registerTool(
    "score_period",
    {
      description:
        "Score one period of an entity with Clef (@cf/cloudflare/clef) from the evidence you supply, 200 to 8,000 " +
        "characters about that period, typically from Wikipedia. One Clef request asks twelve questions: benefit and " +
        "harm for each dimension, plus the period's reach and persistence. Stores the period's reach and " +
        "persistence factors and one assessment (ai_suggested, the evidence as each justification, the source URL " +
        "if given), replacing any earlier Clef assessment of the same period. Writes nothing if Clef's answers are " +
        "unusable. Link the entity's consequences first: their effects are left out of this period's score.",
      inputSchema: schemas.scorePeriodInput,
      annotations: { ...WRITE, openWorldHint: true },
    },
    async (args) => guard(() => service.scorePeriod(env, args)),
  );

  server.registerTool(
    "get_scores",
    {
      description:
        "Every entity's score, largest first: total magnitude and tier; own magnitude (its own periods) and " +
        "credited magnitude (shares of its descendants); the ten-number profile split into own, credited and " +
        "total; benefit and harm totals; and the five largest credit contributors. Published entities only " +
        "unless include_drafts is true, which scores every status and labels each entity's status.",
      inputSchema: schemas.getScoresInput,
      annotations: READ,
    },
    async (args) => guard(() => service.getScores(env, args)),
  );

  server.registerTool(
    "add_period",
    {
      description:
        "Add an assessment period to an entity: a labelled span of years of its own direct activity (negative " +
        "for BCE; end_year >= start_year) with reach_factor and persistence_factor, each an integer 1-10 " +
        "(score_period replaces both with Clef's). Returns the created row including its id, which score_period " +
        "and add_assessment take as period_id.",
      inputSchema: schemas.addPeriodInput,
      annotations: WRITE,
    },
    async (args) => guard(() => service.addPeriod(env, args)),
  );

  server.registerTool(
    "add_relationship",
    {
      description:
        "Link two entities by slug, from cause (source) to consequence (target): Jesus -> Catholic Church, " +
        "Catholic Church -> First Crusade. A reaction is recorded as influence from whatever provoked it. " +
        "influence and mentorship carry credit, and strength (0-1) is the share of the consequence credited to " +
        "the cause; collaboration and opposition only describe. A consequence's credit-bearing incoming strengths " +
        "may total at most 1.00, and the call is rejected with the current total if it would exceed that. The same " +
        "source, target and type can only be linked once; an entity cannot link to itself. Returns the created row.",
      inputSchema: schemas.addRelationshipInput,
      annotations: WRITE,
    },
    async (args) => guard(() => service.addRelationship(env, args)),
  );

  return server;
}

function requireMcpAuth(request: Request, env: Env): Response | null {
  const expected = env.MCP_API_KEY;
  if (!expected) {
    return Response.json({ error: "MCP endpoint not configured (MCP_API_KEY unset)" }, { status: 503 });
  }
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== expected) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export function handleMcpRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> | Response {
  const denied = requireMcpAuth(request, env);
  if (denied) return denied;
  return createMcpHandler(() => buildMcpServer(env), { route: "/mcp" })(request, env, ctx);
}
