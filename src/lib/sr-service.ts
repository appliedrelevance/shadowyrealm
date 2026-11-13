/**
 * The service layer — the only code that writes to a site's schema.
 *
 * The MCP tools (src/worker/mcp.ts) and the manual-control HTTP handlers
 * (src/worker/api.ts) are thin wrappers over these functions, so the two
 * surfaces cannot drift apart.
 *
 * Runs in the Worker with the Supabase service-role key, which bypasses RLS:
 * every rule that matters is enforced here. Rows are attributed to
 * OWNER_USER_ID because created_by is a foreign key to auth.users.
 *
 * Every function serves the site named by env.SITE: its schema, dimensions,
 * entity and link types, timeline and tiers all come from that site's config.
 */
import { createClient } from "@supabase/supabase-js";
import { allowsEnds, creditTypes, describeEnds, dimensionKeys, linkTypeOf, siteFor } from "../sites";
import type { SiteConfig } from "../sites/types";
import { sampleCurve, type Profile } from "./atis-calculator";
import { CLEF_MODEL, runClef, type ClefEnv } from "./clef";
import { composeScores, type AssessmentRow, type EntityScore } from "./credit";
import type { Json } from "./database.types";
import type { EntityRow, EntityUpdate, SiteDatabase, SiteTables } from "./site-tables";
import type {
  AddAssessmentInput,
  AddPeriodInput,
  AddRelationshipInput,
  CreateEntityInput,
  DeleteEntityInput,
  GetEntityInput,
  GetScoresInput,
  ListEntitiesInput,
  ScorePeriodInput,
  SetEntityStatusInput,
  UpdateEntityInput,
} from "./sr-schemas";
import { bucketEdges } from "./timeline";
import { slugify } from "./utils";

export interface ServiceEnv {
  /** The site this Worker serves; a key of src/sites. */
  SITE: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  OWNER_USER_ID: string;
}

type Tables = SiteTables;

const REQUIRED_ENV = ["SITE", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OWNER_USER_ID"] as const;

export function siteOf(env: Pick<ServiceEnv, "SITE">): SiteConfig {
  return siteFor(env.SITE);
}

function connect(env: ServiceEnv) {
  for (const key of REQUIRED_ENV) {
    if (!env[key]) throw new Error(`${key} is not set on the Worker`);
  }
  // The client is typed with the shape every site's schema shares; the runtime schema is the site's own.
  return createClient<SiteDatabase, "site">(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: siteOf(env).schema as "site" },
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

  // A Clef assessment stores its evidence in every justification; a short
  // excerpt of each keeps this response readable.
  const excerpt = (text: string) => (text.length > 300 ? `${text.slice(0, 300)}…` : text);
  const keys = dimensionKeys(siteOf(env));

  return {
    entity,
    assessments: assessments.data.map((a) => {
      const out: Record<string, unknown> = { ...a };
      for (const d of keys) out[`${d}_justification`] = excerpt(String(a[`${d}_justification`]));
      return out;
    }),
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
  const site = siteOf(env);
  if (args.status === "published" && !site.scoring.tiers) {
    throw new Error(
      `${site.brand.name}'s tiers are not set yet: calibrate them from the first full scoring run before publishing`,
    );
  }
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

async function periodOf(db: Db, entity: EntityRow, periodId: number) {
  const { data, error } = await db.from("assessment_periods").select("*").eq("id", periodId).limit(1);
  if (error) fail("look up period", error);
  if (data.length === 0) throw new Error(`No assessment period with id ${periodId}`);
  if (data[0].entity_id !== entity.id) {
    throw new Error(`Period ${periodId} belongs to a different entity than "${entity.slug}"`);
  }
  return data[0];
}

export async function addAssessment(env: ServiceEnv, args: AddAssessmentInput) {
  const db = connect(env);
  const entity = await entityBySlug(db, args.slug);
  await periodOf(db, entity, args.period_id);

  const input = args as unknown as Record<string, number | string>;
  const keys = dimensionKeys(siteOf(env));
  const levels = Object.fromEntries(
    keys.flatMap((d) => [
      [`${d}_benefit`, input[`${d}_benefit`]],
      [`${d}_harm`, input[`${d}_harm`]],
    ]),
  ) as Record<string, number>;
  const justifications = Object.fromEntries(
    keys.map((d) => [`${d}_justification`, input[`${d}_justification`]]),
  ) as Record<string, string>;

  const { data, error } = await db
    .from("assessments")
    .insert({
      entity_id: entity.id,
      period_id: args.period_id,
      ...levels,
      ...justifications,
      confidence_level: args.confidence_level,
      ai_suggested: args.ai_suggested,
      ai_model_used: args.ai_model_used ?? null,
      created_by: env.OWNER_USER_ID,
    })
    .select()
    .single();
  if (error) fail("add assessment", error);

  await audit(db, env, entity.id, "score_added", null, { period_id: args.period_id, ...levels });
  return data;
}

/**
 * Score one period with Clef from the evidence supplied, then store the result:
 * the period's reach and persistence factors, and one assessment whose
 * justifications are the evidence. A rerun replaces the period's earlier Clef
 * assessment rather than averaging with it. Nothing is written if Clef fails.
 */
export async function scorePeriod(env: ServiceEnv & ClefEnv, args: ScorePeriodInput) {
  const site = siteOf(env);
  const credit = creditTypes(site);
  const keys = dimensionKeys(site);
  const db = connect(env);
  const entity = await entityBySlug(db, args.slug);
  const period = await periodOf(db, entity, args.period_id);

  const { data: outgoing, error: linkError } = await db
    .from("relationships")
    .select("relationship_type, strength, target:target_entity_id(name)")
    .eq("source_entity_id", entity.id);
  if (linkError) fail("load outgoing links", linkError);
  const excluded = outgoing
    .filter((l) => credit.has(l.relationship_type) && Number(l.strength) > 0)
    .map((l) => (l.target as unknown as { name: string }).name);

  const clef = await runClef(env, site, {
    entity: entity.name,
    entity_type: entity.entity_type,
    period: period.label,
    start_year: period.start_year,
    end_year: period.end_year,
    excluded,
    evidence: args.evidence,
  });

  // The replaced assessment goes into the audit entry below, so every score a
  // period has had stays recoverable with the evidence it was computed from.
  const replaced = await db
    .from("assessments")
    .delete()
    .eq("period_id", period.id)
    .eq("ai_model_used", CLEF_MODEL)
    .select("*");
  if (replaced.error) fail("replace the earlier Clef assessment", replaced.error);
  const history = replaced.data.map((row) => {
    const r = row as unknown as Record<string, unknown>;
    return {
      ...Object.fromEntries(keys.flatMap((d) => [[`${d}_benefit`, r[`${d}_benefit`]], [`${d}_harm`, r[`${d}_harm`]]])),
      confidence_level: r.confidence_level,
      sources: r.sources,
      created_at: r.created_at,
      evidence: r[`${keys[0]}_justification`],
    };
  });

  const updated = await db
    .from("assessment_periods")
    .update({ reach_factor: clef.reach_factor, persistence_factor: clef.persistence_factor })
    .eq("id", period.id)
    .select()
    .single();
  if (updated.error) fail("set the period's reach and persistence", updated.error);

  const levels = Object.fromEntries(
    keys.flatMap((d) => [
      [`${d}_benefit`, clef.benefit[d]],
      [`${d}_harm`, clef.harm[d]],
    ]),
  ) as Record<string, number>;
  const justifications = Object.fromEntries(keys.map((d) => [`${d}_justification`, args.evidence])) as Record<
    string,
    string
  >;

  const { data, error } = await db
    .from("assessments")
    .insert({
      entity_id: entity.id,
      period_id: period.id,
      ...levels,
      ...justifications,
      sources: args.source_url ? [args.source_url] : null,
      confidence_level: Math.round(clef.confidence * 100) / 100,
      ai_suggested: true,
      ai_model_used: CLEF_MODEL,
      created_by: env.OWNER_USER_ID,
    })
    .select(
      "id, entity_id, period_id, scientific_benefit, scientific_harm, economic_benefit, economic_harm, " +
        "human_rights_benefit, human_rights_harm, health_benefit, health_harm, cultural_benefit, cultural_harm, " +
        "sources, confidence_level, ai_suggested, ai_model_used, created_at",
    )
    .single();
  if (error) fail("store the Clef assessment", error);

  await audit(
    db,
    env,
    entity.id,
    "period_scored",
    {
      period_id: period.id,
      reach_factor: period.reach_factor,
      persistence_factor: period.persistence_factor,
      replaced: history,
    },
    {
    period_id: period.id,
    model: CLEF_MODEL,
    reach_factor: clef.reach_factor,
    persistence_factor: clef.persistence_factor,
    ...levels,
    },
  );
  return {
    assessment: data,
    period: updated.data,
    replaced_assessments: replaced.data.length,
    excluded,
    note: "Each justification holds the evidence text, which is omitted here",
  };
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

  const site = siteOf(env);
  const def = linkTypeOf(site, args.relationship_type);
  if (!allowsEnds(def, source.entity_type, target.entity_type)) {
    throw new Error(
      `A ${def.key} link runs from ${describeEnds(def.from)} to ${describeEnds(def.to)}; ` +
        `"${source.slug}" is a ${source.entity_type} and "${target.slug}" is a ${target.entity_type}`,
    );
  }

  // An entity gives away at most all of itself: credit-bearing shares into one target total 1.00 or less.
  const credit = creditTypes(site);
  if (credit.has(args.relationship_type)) {
    const incoming = await db
      .from("relationships")
      .select("relationship_type, strength")
      .eq("target_entity_id", target.id);
    if (incoming.error) fail("load the target's incoming links", incoming.error);
    const current = incoming.data
      .filter((l) => credit.has(l.relationship_type))
      .reduce((sum, l) => sum + Number(l.strength), 0);
    if (current + args.strength > 1.000001) {
      throw new Error(
        `"${target.slug}" already credits ${current.toFixed(2)} of itself to its causes; ` +
          `adding ${args.strength.toFixed(2)} would exceed 1.00`,
      );
    }
  }

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

// ---------- Scores ----------
// One computation serves the MCP tools and every screen of the web UI.

/** Supabase returns at most 1,000 rows per request, so whole-table reads page. */
const PAGE = 1000;

async function every<T>(
  what: string,
  page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) fail(what, error);
    rows.push(...(data ?? []));
    if ((data ?? []).length < PAGE) return rows;
  }
}

const ENTITY_FIELDS = "id, slug, name, entity_type, status, description, image_url, metadata, updated_at";
const PERIOD_FIELDS = "id, entity_id, label, start_year, end_year, reach_factor, persistence_factor, description";
function levelFields(site: SiteConfig): string {
  return ["entity_id", "period_id", ...dimensionKeys(site).flatMap((d) => [`${d}_benefit`, `${d}_harm`])].join(", ");
}

type ScoredEntity = Pick<
  EntityRow,
  "id" | "slug" | "name" | "entity_type" | "status" | "description" | "image_url" | "metadata" | "updated_at"
>;
type PeriodRow = Pick<
  Tables["assessment_periods"]["Row"],
  "id" | "entity_id" | "label" | "start_year" | "end_year" | "reach_factor" | "persistence_factor" | "description"
>;
type LinkRow = Pick<
  Tables["relationships"]["Row"],
  "id" | "source_entity_id" | "target_entity_id" | "relationship_type" | "strength" | "description"
>;

interface Scoring {
  as_of_year: number;
  entities: ScoredEntity[];
  byId: Map<number, ScoredEntity>;
  periods: PeriodRow[];
  links: LinkRow[];
  scores: Map<number, EntityScore>;
  /** Entities by total magnitude, largest first. */
  ranked: ScoredEntity[];
}

async function loadScoring(env: ServiceEnv, includeDrafts: boolean): Promise<Scoring> {
  const site = siteOf(env);
  const db = connect(env);
  const asOfYear = new Date().getUTCFullYear();

  const [entities, periods, assessments, links, shares] = await Promise.all([
    every<ScoredEntity>("load entities", (from, to) => {
      let q = db.from("entities").select(ENTITY_FIELDS);
      if (!includeDrafts) q = q.eq("status", "published");
      return q.order("id").range(from, to);
    }),
    every<PeriodRow>("load periods", (from, to) =>
      db.from("assessment_periods").select(PERIOD_FIELDS).order("id").range(from, to),
    ),
    every<AssessmentRow>("load assessments", (from, to) =>
      db.from("assessments").select(levelFields(site)).order("id").range(from, to).returns<AssessmentRow[]>(),
    ),
    every<LinkRow>("load links", (from, to) =>
      db
        .from("relationships")
        .select("id, source_entity_id, target_entity_id, relationship_type, strength, description")
        .order("id")
        .range(from, to),
    ),
    every("compute credit shares", (from, to) =>
      db
        .rpc("credit_shares", { published_only: !includeDrafts })
        .order("ancestor_id")
        .order("descendant_id")
        .range(from, to),
    ),
  ]);

  const byId = new Map(entities.map((e) => [e.id, e]));
  const inSet = (id: number) => byId.has(id);
  const keptPeriods = periods.filter((p) => inSet(p.entity_id));
  const keptLinks = links.filter((l) => inSet(l.source_entity_id) && inSet(l.target_entity_id));
  const scores = composeScores(
    { scoring: site.scoring, creditTypes: creditTypes(site) },
    entities.map((e) => e.id),
    keptPeriods,
    assessments.filter((a) => inSet(a.entity_id)),
    keptLinks,
    shares,
    asOfYear,
  );
  const ranked = [...entities].sort(
    (a, b) => scores.get(b.id)!.total_magnitude - scores.get(a.id)!.total_magnitude || a.name.localeCompare(b.name),
  );
  return { as_of_year: asOfYear, entities, byId, periods: keptPeriods, links: keptLinks, scores, ranked };
}

function round(n: number, places = 2): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

function roundProfile(p: Profile): Profile {
  const out = { benefit: { ...p.benefit }, harm: { ...p.harm } };
  for (const d of Object.keys(p.benefit)) {
    out.benefit[d] = round(p.benefit[d]);
    out.harm[d] = round(p.harm[d]);
  }
  return out;
}

function summary(scoring: Scoring, entity: ScoredEntity, withStatus: boolean) {
  const score = scoring.scores.get(entity.id)!;
  return {
    slug: entity.slug,
    name: entity.name,
    entity_type: entity.entity_type,
    ...(withStatus ? { status: entity.status } : {}),
    total_magnitude: round(score.total_magnitude),
    tier: score.tier,
    own_magnitude: round(score.own_magnitude),
    credited_magnitude: round(score.credited_magnitude),
    benefit_total: round(score.benefit_total),
    harm_total: round(score.harm_total),
  };
}

function contributorsOf(scoring: Scoring, score: EntityScore, limit?: number) {
  return score.contributors.slice(0, limit).map((c) => {
    const e = scoring.byId.get(c.entity_id)!;
    return { slug: e.slug, name: e.name, share: round(c.share, 3), magnitude: round(c.magnitude) };
  });
}

export async function getScores(env: ServiceEnv, args: GetScoresInput) {
  const scoring = await loadScoring(env, args.include_drafts);
  return {
    as_of_year: scoring.as_of_year,
    entities: scoring.ranked.map((e) => {
      const score = scoring.scores.get(e.id)!;
      return {
        ...summary(scoring, e, args.include_drafts),
        profile: {
          own: roundProfile(score.own.profile),
          credited: roundProfile(score.credited),
          total: roundProfile(score.total),
        },
        top_contributors: contributorsOf(scoring, score, 5),
      };
    }),
  };
}

/** A sampled curve, trimmed to the buckets where it is not zero; `from` is the first bucket's index. */
function trimmed(curve: { benefit: number[]; harm: number[] }) {
  const live = (i: number) => curve.benefit[i] > 0.005 || curve.harm[i] > 0.005;
  let first = 0;
  while (first < curve.benefit.length && !live(first)) first++;
  let last = curve.benefit.length - 1;
  while (last >= first && !live(last)) last--;
  return {
    from: first,
    benefit: curve.benefit.slice(first, last + 1).map((v) => round(v, 1)),
    harm: curve.harm.slice(first, last + 1).map((v) => round(v, 1)),
  };
}

function yearsOf(scoring: Scoring, entityId: number) {
  const own = scoring.periods.filter((p) => p.entity_id === entityId);
  if (own.length === 0) return { first_year: null, last_year: null };
  return {
    first_year: Math.min(...own.map((p) => p.start_year)),
    last_year: Math.max(...own.map((p) => p.end_year)),
  };
}

/** Everything the timeline and the graph draw: every entity's own curve and every link. */
export async function getRealm(env: ServiceEnv, includeDrafts: boolean) {
  const scoring = await loadScoring(env, includeDrafts);
  const edges = bucketEdges(scoring.as_of_year, siteOf(env).timeline);
  return {
    as_of_year: scoring.as_of_year,
    entities: scoring.ranked.map((e) => ({
      ...summary(scoring, e, includeDrafts),
      description: e.description,
      image_url: e.image_url,
      ...yearsOf(scoring, e.id),
      curve: trimmed(sampleCurve(scoring.scores.get(e.id)!.own.curve, edges)),
    })),
    links: scoring.links.map((l) => ({
      source: scoring.byId.get(l.source_entity_id)!.slug,
      target: scoring.byId.get(l.target_entity_id)!.slug,
      relationship_type: l.relationship_type,
      strength: Number(l.strength),
      description: l.description,
    })),
  };
}

/** One entity's profile page: its score, its curves, its periods and evidence, and its lineage. Null when not found. */
export async function getEntityProfile(env: ServiceEnv, slug: string, includeDrafts: boolean) {
  const scoring = await loadScoring(env, includeDrafts);
  const entity = scoring.entities.find((e) => e.slug === slug);
  if (!entity) return null;
  const score = scoring.scores.get(entity.id)!;
  const site = siteOf(env);
  const edges = bucketEdges(scoring.as_of_year, site.timeline);
  const evidenceColumn = `${dimensionKeys(site)[0]}_justification`;

  const own = sampleCurve(score.own.curve, edges);
  const credited = { benefit: own.benefit.map(() => 0), harm: own.harm.map(() => 0) };
  for (const c of score.contributors) {
    const d = sampleCurve(scoring.scores.get(c.entity_id)!.own.curve, edges);
    for (let i = 0; i < credited.benefit.length; i++) {
      credited.benefit[i] += c.share * d.benefit[i];
      credited.harm[i] += c.share * d.harm[i];
    }
  }
  // Trim both curves to the same window so they stack.
  const live = (i: number) =>
    own.benefit[i] + own.harm[i] + credited.benefit[i] + credited.harm[i] > 0.005;
  let first = 0;
  while (first < edges.length - 1 && !live(first)) first++;
  let last = edges.length - 2;
  while (last >= first && !live(last)) last--;
  const cut = (values: number[]) => values.slice(first, last + 1).map((v) => round(v, 1));

  const db = connect(env);
  const { data: evidence, error } = await db
    .from("assessments")
    .select(`id, period_id, ${evidenceColumn}, sources, confidence_level, ai_model_used, created_at`)
    .eq("entity_id", entity.id)
    .order("created_at", { ascending: false })
    .returns<
      ({
        id: number;
        period_id: number | null;
        sources: string[] | null;
        confidence_level: number | null;
        ai_model_used: string | null;
        created_at: string;
      } & Record<string, unknown>)[]
    >();
  if (error) fail("load assessments", error);

  const breakdown = new Map(score.own.breakdown.map((b) => [b.period_id, b]));
  const name = (id: number) => {
    const e = scoring.byId.get(id)!;
    return { slug: e.slug, name: e.name, entity_type: e.entity_type };
  };

  return {
    as_of_year: scoring.as_of_year,
    entity: {
      slug: entity.slug,
      name: entity.name,
      entity_type: entity.entity_type,
      status: entity.status,
      description: entity.description,
      image_url: entity.image_url,
      metadata: entity.metadata,
      updated_at: entity.updated_at,
    },
    score: {
      ...summary(scoring, entity, false),
      descriptor: score.descriptor,
      profile: {
        own: roundProfile(score.own.profile),
        credited: roundProfile(score.credited),
        total: roundProfile(score.total),
      },
      tail: score.own.tail
        ? {
            from_year: score.own.tail.from_year,
            years: score.own.tail.years,
            kept: round(score.own.tail.kept, 3),
            magnitude: round(profileTotal(score.own.tail.area)),
          }
        : null,
      unplaced_assessments: score.own.unplaced_assessments,
      algorithm_version: score.own.algorithm_version,
    },
    curves: {
      from: first,
      own: { benefit: cut(own.benefit), harm: cut(own.harm) },
      credited: { benefit: cut(credited.benefit), harm: cut(credited.harm) },
    },
    periods: scoring.periods
      .filter((p) => p.entity_id === entity.id)
      .sort((a, b) => a.start_year - b.start_year)
      .map((p) => {
        const b = breakdown.get(p.id);
        const scored = evidence.filter((a) => a.period_id === p.id);
        return {
          id: p.id,
          label: p.label,
          start_year: p.start_year,
          end_year: p.end_year,
          description: p.description,
          reach_factor: p.reach_factor,
          persistence_factor: p.persistence_factor,
          magnitude: b ? round(profileTotal(b.area)) : 0,
          level: b ? roundProfile(b.level) : null,
          assessments: scored.map((a) => ({
            evidence: a[evidenceColumn] as string,
            sources: a.sources,
            confidence_level: a.confidence_level,
            model: a.ai_model_used,
            created_at: a.created_at,
          })),
        };
      }),
    contributors: contributorsOf(scoring, score),
    credits: score.credits.map((c) => ({
      ...name(c.entity_id),
      share: round(c.share, 3),
      magnitude: round(c.share * score.own_magnitude),
    })),
    links: scoring.links
      .filter((l) => l.source_entity_id === entity.id || l.target_entity_id === entity.id)
      .map((l) => ({
        direction: l.source_entity_id === entity.id ? ("outgoing" as const) : ("incoming" as const),
        other: name(l.source_entity_id === entity.id ? l.target_entity_id : l.source_entity_id),
        relationship_type: l.relationship_type,
        strength: Number(l.strength),
        description: l.description,
      })),
  };
}

function profileTotal(p: Profile): number {
  return Object.keys(p.benefit).reduce((sum, d) => sum + p.benefit[d] + p.harm[d], 0);
}
