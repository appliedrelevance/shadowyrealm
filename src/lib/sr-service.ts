/**
 * ShadowyRealm service layer — the only code that writes to the shadowyrealm schema.
 *
 * The MCP tools (src/worker/mcp.ts) and the manual-control HTTP handlers
 * (src/worker/api.ts) are thin wrappers over these functions, so the two
 * surfaces cannot drift apart.
 *
 * Runs in the Worker with the Supabase service-role key, which bypasses RLS:
 * every rule that matters is enforced here. Rows are attributed to
 * OWNER_USER_ID because created_by is a foreign key to auth.users.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "./database.types";
import type {
  AddAssessmentInput,
  AddPeriodInput,
  AddRelationshipInput,
  CreateEntityInput,
  DeleteEntityInput,
  GetEntityInput,
  ListEntitiesInput,
  SetEntityStatusInput,
  UpdateEntityInput,
} from "./sr-schemas";
import { slugify } from "./utils";

export interface ServiceEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  OWNER_USER_ID: string;
}

type Tables = Database["shadowyrealm"]["Tables"];
type EntityRow = Tables["entities"]["Row"];
type EntityUpdate = Tables["entities"]["Update"];

const REQUIRED_ENV = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OWNER_USER_ID"] as const;

function connect(env: ServiceEnv) {
  for (const key of REQUIRED_ENV) {
    if (!env[key]) throw new Error(`${key} is not set on the Worker`);
  }
  return createClient<Database, "shadowyrealm">(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "shadowyrealm" },
  });
}
type Db = ReturnType<typeof connect>;

function fail(what: string, error: { message: string }): never {
  throw new Error(`${what}: ${error.message}`);
}

async function entityBySlug(db: Db, slug: string): Promise<EntityRow> {
  const { data, error } = await db.from("entities").select("*").eq("slug", slug).limit(2);
  if (error) fail(`look up "${slug}"`, error);
  if (data.length === 0) throw new Error(`No entity with slug "${slug}"`);
  if (data.length > 1) throw new Error(`Slug "${slug}" is ambiguous: ${data.length} entities share it`);
  return data[0];
}

async function audit(
  db: Db,
  env: ServiceEnv,
  entityId: number,
  action: string,
  oldValue: Record<string, unknown> | null,
  newValue: Record<string, unknown> | null,
) {
  const { error } = await db.from("entity_audit_log").insert({
    entity_id: entityId,
    action,
    old_value: oldValue as Json | null,
    new_value: newValue as Json | null,
    performed_by: env.OWNER_USER_ID,
  });
  // The primary write has already happened, so say so rather than hide it.
  if (error) fail(`the change was saved but its "${action}" audit entry was not`, error);
}

// ---------- Identity ----------

/**
 * True when accessToken is a valid Supabase session for the owner account.
 * An invalid or expired token is simply "not the operator"; any other failure
 * (auth service unreachable, misconfigured key) throws instead of reading as "no".
 */
export async function isOperator(env: ServiceEnv, accessToken: string): Promise<boolean> {
  const db = connect(env);
  const { data, error } = await db.auth.getUser(accessToken);
  if (error) {
    if (error.status === 400 || error.status === 401 || error.status === 403) return false;
    throw new Error(`verify session: ${error.message}`);
  }
  return data.user.id === env.OWNER_USER_ID;
}

// ---------- Reads ----------

export async function listEntities(env: ServiceEnv, args: ListEntitiesInput) {
  const db = connect(env);
  let query = db
    .from("entities")
    .select("id, slug, name, entity_type, status, description, created_at, updated_at", {
      count: "exact",
    });
  if (args.entity_type) query = query.eq("entity_type", args.entity_type);
  if (args.status) query = query.eq("status", args.status);
  if (args.q) query = query.ilike("name", `%${args.q.replace(/[\\%_]/g, "\\$&")}%`);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(args.offset, args.offset + args.limit - 1);
  if (error) fail("list entities", error);
  return { total: count ?? 0, entities: data };
}

export async function getEntity(env: ServiceEnv, args: GetEntityInput) {
  const db = connect(env);
  const entity = await entityBySlug(db, args.slug);

  const [assessments, periods, outgoing, incoming, auditLog] = await Promise.all([
    db.from("assessments").select("*").eq("entity_id", entity.id).order("created_at", { ascending: false }),
    db.from("assessment_periods").select("*").eq("entity_id", entity.id).order("start_year", { ascending: true }),
    db.from("relationships").select("*").eq("source_entity_id", entity.id),
    db.from("relationships").select("*").eq("target_entity_id", entity.id),
    db
      .from("entity_audit_log")
      .select("*")
      .eq("entity_id", entity.id)
      .order("performed_at", { ascending: false })
      .limit(50),
  ]);
  if (assessments.error) fail("load assessments", assessments.error);
  if (periods.error) fail("load periods", periods.error);
  if (outgoing.error) fail("load outgoing relationships", outgoing.error);
  if (incoming.error) fail("load incoming relationships", incoming.error);
  if (auditLog.error) fail("load audit log", auditLog.error);

  const otherIds = [
    ...new Set([
      ...outgoing.data.map((r) => r.target_entity_id),
      ...incoming.data.map((r) => r.source_entity_id),
    ]),
  ];
  const names = new Map<number, { slug: string; name: string }>();
  if (otherIds.length > 0) {
    const { data, error } = await db.from("entities").select("id, slug, name").in("id", otherIds);
    if (error) fail("load related entities", error);
    for (const row of data) names.set(row.id, { slug: row.slug, name: row.name });
  }
  const other = (id: number) => {
    const found = names.get(id);
    if (!found) throw new Error(`Relationship points at missing entity ${id}`);
    return found;
  };

  return {
    entity,
    assessments: assessments.data,
    periods: periods.data,
    relationships: [
      ...outgoing.data.map((r) => ({ ...r, direction: "outgoing" as const, other: other(r.target_entity_id) })),
      ...incoming.data.map((r) => ({ ...r, direction: "incoming" as const, other: other(r.source_entity_id) })),
    ],
    audit_log: auditLog.data,
  };
}

// ---------- Writes ----------

export async function createEntity(env: ServiceEnv, args: CreateEntityInput) {
  const db = connect(env);
  const slug = args.slug ?? slugify(args.name);
  if (!slug) throw new Error("Cannot derive a slug from that name; pass slug explicitly");

  const taken = await db.from("entities").select("id").eq("slug", slug).limit(1);
  if (taken.error) fail("check slug", taken.error);
  if (taken.data.length > 0) {
    throw new Error(`Slug "${slug}" is already used by another entity; pass a different slug`);
  }

  const { data, error } = await db
    .from("entities")
    .insert({
      slug,
      name: args.name,
      entity_type: args.entity_type,
      description: args.description,
      biography: args.biography ?? null,
      image_url: args.image_url ?? null,
      metadata: (args.metadata ?? null) as Json | null,
      created_by: env.OWNER_USER_ID,
    })
    .select()
    .single();
  if (error) fail("create entity", error);
  return data;
}

export async function updateEntity(env: ServiceEnv, args: UpdateEntityInput) {
  const fields: EntityUpdate = {};
  if (args.name !== undefined) fields.name = args.name;
  if (args.description !== undefined) fields.description = args.description;
  if (args.biography !== undefined) fields.biography = args.biography;
  if (args.image_url !== undefined) fields.image_url = args.image_url;
  if (args.metadata !== undefined) fields.metadata = args.metadata as Json | null;
  if (Object.keys(fields).length === 0) {
    throw new Error("Nothing to update: pass at least one of name, description, biography, image_url, metadata");
  }

  const db = connect(env);
  const entity = await entityBySlug(db, args.slug);
  const { data, error } = await db.from("entities").update(fields).eq("id", entity.id).select().single();
  if (error) fail("update entity", error);
  return data;
}

export async function setEntityStatus(env: ServiceEnv, args: SetEntityStatusInput) {
  const db = connect(env);
  const entity = await entityBySlug(db, args.slug);
  if (entity.status === args.status) {
    throw new Error(`"${args.slug}" is already ${args.status}`);
  }

  const { error } = await db.from("entities").update({ status: args.status }).eq("id", entity.id);
  if (error) fail(`set status to ${args.status}`, error);
  await audit(db, env, entity.id, "status_change", { status: entity.status }, { status: args.status });
  return { slug: entity.slug, from: entity.status, to: args.status };
}

export async function deleteEntity(env: ServiceEnv, args: DeleteEntityInput) {
  const db = connect(env);
  const entity = await entityBySlug(db, args.slug);
  if (entity.status !== "draft") {
    throw new Error(
      `Only drafts can be deleted; "${args.slug}" is ${entity.status}. Archive it with set_entity_status instead.`,
    );
  }
  const { error } = await db.from("entities").delete().eq("id", entity.id).eq("status", "draft");
  if (error) fail("delete entity", error);
  return { deleted: entity.slug };
}

export async function addAssessment(env: ServiceEnv, args: AddAssessmentInput) {
  const db = connect(env);
  const entity = await entityBySlug(db, args.slug);

  if (args.period_id !== undefined) {
    const period = await db.from("assessment_periods").select("entity_id").eq("id", args.period_id).limit(1);
    if (period.error) fail("check period", period.error);
    if (period.data.length === 0) throw new Error(`No assessment period with id ${args.period_id}`);
    if (period.data[0].entity_id !== entity.id) {
      throw new Error(`Period ${args.period_id} belongs to a different entity than "${args.slug}"`);
    }
  }

  const { data, error } = await db
    .from("assessments")
    .insert({
      entity_id: entity.id,
      period_id: args.period_id ?? null,
      scientific_score: args.scientific_score,
      economic_score: args.economic_score,
      human_rights_score: args.human_rights_score,
      health_score: args.health_score,
      cultural_score: args.cultural_score,
      scientific_justification: args.scientific_justification,
      economic_justification: args.economic_justification,
      human_rights_justification: args.human_rights_justification,
      health_justification: args.health_justification,
      cultural_justification: args.cultural_justification,
      confidence_level: args.confidence_level,
      ai_suggested: args.ai_suggested,
      ai_model_used: args.ai_model_used ?? null,
      created_by: env.OWNER_USER_ID,
    })
    .select()
    .single();
  if (error) fail("add assessment", error);

  await audit(db, env, entity.id, "score_added", null, {
    scientific: args.scientific_score,
    economic: args.economic_score,
    human_rights: args.human_rights_score,
    health: args.health_score,
    cultural: args.cultural_score,
  });
  return data;
}

export async function addPeriod(env: ServiceEnv, args: AddPeriodInput) {
  const db = connect(env);
  const entity = await entityBySlug(db, args.slug);
  const { data, error } = await db
    .from("assessment_periods")
    .insert({
      entity_id: entity.id,
      label: args.label,
      start_year: args.start_year,
      end_year: args.end_year,
      description: args.description ?? null,
      reach_factor: args.reach_factor,
      persistence_factor: args.persistence_factor,
      created_by: env.OWNER_USER_ID,
    })
    .select()
    .single();
  if (error) fail("add period", error);
  return data;
}

export async function addRelationship(env: ServiceEnv, args: AddRelationshipInput) {
  const db = connect(env);
  const source = await entityBySlug(db, args.source_slug);
  const target = await entityBySlug(db, args.target_slug);
  if (source.id === target.id) throw new Error("An entity cannot have a relationship with itself");

  const { data, error } = await db
    .from("relationships")
    .insert({
      source_entity_id: source.id,
      target_entity_id: target.id,
      relationship_type: args.relationship_type,
      description: args.description,
      strength: args.strength,
      temporal_overlap: args.temporal_overlap,
      created_by: env.OWNER_USER_ID,
    })
    .select()
    .single();
  if (error) fail("add relationship", error);
  return data;
}
