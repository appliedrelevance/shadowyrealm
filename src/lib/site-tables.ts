/**
 * One row shape for every site's schema.
 *
 * Each site's schema is generated from its config (tools/site-schema.ts) as a
 * structural copy of shadowyrealm, differing only in its enum values and its
 * dimension columns. The service layer reads and writes every site through
 * this shape, built from shadowyrealm's generated types with those
 * differences widened. test/site-tables.typetest.ts checks that every
 * generated schema fits it.
 */
import type { Database } from "./database.types";

type SR = Database["shadowyrealm"];
type SRTables = SR["Tables"];

/** ShadowyRealm's own dimension columns, which other sites replace with theirs. */
type SRDimensionColumn = `${"scientific" | "economic" | "human_rights" | "health" | "cultural"}_${
  | "benefit"
  | "harm"
  | "justification"}`;

type Widen<T> = {
  [K in keyof T]: K extends "entity_type" | "relationship_type" ? (undefined extends T[K] ? string | undefined : string) : T[K];
};

type DimensionLevels = Record<`${string}_${"benefit" | "harm"}`, number>;
type DimensionJustifications = Record<`${string}_justification`, string>;

type Table<T extends { Row: unknown; Insert: unknown; Update: unknown; Relationships: unknown }> = {
  Row: Widen<T["Row"]>;
  Insert: Widen<T["Insert"]>;
  Update: Widen<T["Update"]>;
  Relationships: T["Relationships"];
};

type AssessmentTable = {
  Row: Omit<SRTables["assessments"]["Row"], SRDimensionColumn> & DimensionLevels & DimensionJustifications;
  Insert: Omit<SRTables["assessments"]["Insert"], SRDimensionColumn> &
    Partial<DimensionLevels> &
    Partial<DimensionJustifications>;
  Update: Omit<SRTables["assessments"]["Update"], SRDimensionColumn> &
    Partial<DimensionLevels> &
    Partial<DimensionJustifications>;
  Relationships: SRTables["assessments"]["Relationships"];
};

export type SiteSchema = {
  Tables: {
    entities: Table<SRTables["entities"]>;
    assessment_periods: Table<SRTables["assessment_periods"]>;
    relationships: Table<SRTables["relationships"]>;
    entity_audit_log: Table<SRTables["entity_audit_log"]>;
    assessments: AssessmentTable;
  };
  Views: SR["Views"];
  Functions: SR["Functions"];
  Enums: {
    entity_type: string;
    publication_status: SR["Enums"]["publication_status"];
    relationship_type: string;
  };
  CompositeTypes: SR["CompositeTypes"];
};

/** The type the service's Supabase client is created with; the runtime schema name comes from the site. */
export type SiteDatabase = { site: SiteSchema };

export type SiteTables = SiteSchema["Tables"];
export type EntityRow = SiteTables["entities"]["Row"];
export type EntityUpdate = SiteTables["entities"]["Update"];
export type PublicationStatus = SiteSchema["Enums"]["publication_status"];
