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

const INSTRUCTIONS = `ShadowyRealm is a historical impact index. An entity is a person, organization or event. \
Each assessment scores an entity on five dimensions (scientific, economic, human_rights, health, cultural) from -10 \
(devastating) to +10 (transformative), with a written justification for each. Assessment periods carry reach and \
persistence (1-10 each). Relationships link entities. Only entities with status "published" are public.

Read freely: list_entities, get_entity, research_entity. Confirm with the user before set_entity_status to \
"published" or "archived" (both change what the public sees) and before delete_entity (irreversible). \
research_entity only drafts — review it with the user before turning it into create_entity and add_assessment calls.`;

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
        "Fetch one entity by slug with everything attached: its assessments (five signed -10..+10 scores with " +
        "justifications, confidence, provenance), assessment periods (reach and persistence 1-10), relationships " +
        "in both directions (each with the other entity's slug and name), and the 50 most recent audit-log entries. " +
        "Errors if the slug does not exist or is shared by more than one entity.",
      inputSchema: schemas.getEntityInput,
      annotations: READ,
    },
    async (args) => guard(() => service.getEntity(env, args)),
  );

  server.registerTool(
    "research_entity",
    {
      description:
        "Look a person, organization or event up on Wikipedia and ask an LLM for a structured draft: detected type, " +
        "description, biography, metadata, suggested -10..+10 scores with justifications, confidence and bias " +
        "warnings. Writes nothing — review the draft, then use create_entity and add_assessment. Calls Wikipedia and " +
        "an LLM through the AI Gateway, so it spends tokens and takes around 30 seconds.",
      inputSchema: schemas.researchEntityInput,
      annotations: READ,
    },
    async (args) => guard(() => research(env, args)),
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
        "Add an impact assessment to an entity: five integer scores from -10 to +10 (scientific, economic, " +
        "human_rights, health, cultural), each with a non-empty justification. confidence_level (0-1) defaults to " +
        "0.5. period_id optionally ties it to an assessment period of the same entity (ids come from get_entity). " +
        "Set ai_suggested and ai_model_used when the scores came from research_entity. Records an audit-log " +
        "entry. Returns the created row.",
      inputSchema: schemas.addAssessmentInput,
      annotations: WRITE,
    },
    async (args) => guard(() => service.addAssessment(env, args)),
  );

  server.registerTool(
    "add_period",
    {
      description:
        "Add an assessment period to an entity: a labelled span of years (negative for BCE; end_year >= " +
        "start_year) with reach_factor and persistence_factor, each an integer 1-10. Returns the created row " +
        "including its id, which add_assessment accepts as period_id.",
      inputSchema: schemas.addPeriodInput,
      annotations: WRITE,
    },
    async (args) => guard(() => service.addPeriod(env, args)),
  );

  server.registerTool(
    "add_relationship",
    {
      description:
        "Link two entities by slug: source -> target with a type (influence, mentorship, collaboration or " +
        "opposition), a description, and strength and temporal_overlap (0-1, default 0.5). The same source, " +
        "target and type can only be linked once; an entity cannot link to itself. Returns the created row.",
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
