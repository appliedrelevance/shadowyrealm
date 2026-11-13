/**
 * Compile-time checks, run by `tsc` in every build (site-platform Requirement 5.5):
 * every generated site schema fits the service layer's shared SiteTables shape,
 * and its assessment columns are exactly its config's dimension keys with the
 * three suffixes. test/site-schema.test.ts checks the enums against the configs.
 */
import type { Database } from "./database.types";
import type { SiteSchema } from "./site-tables";

type Assert<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Fits<A, B> = A extends B ? true : false;

type Tables<S extends keyof Database> = Database[S] extends { Tables: infer T } ? T : never;
type Row<S extends keyof Database, T extends string> = T extends keyof Tables<S>
  ? Tables<S>[T] extends { Row: infer R }
    ? R
    : never
  : never;

type DimensionColumns<K extends string> = `${K}_${"benefit" | "harm" | "justification"}`;
type AssessmentDimensionColumns<S extends keyof Database> = Extract<
  keyof Row<S, "assessments">,
  `${string}_${"benefit" | "harm" | "justification"}`
>;

type SiteRow<T extends keyof SiteSchema["Tables"]> = SiteSchema["Tables"][T]["Row"];

/** true only when every table of schema S fits the shared shape; a union with false otherwise. */
type FitsEverywhere<S extends keyof Database> =
  | Fits<Row<S, "entities">, SiteRow<"entities">>
  | Fits<Row<S, "assessment_periods">, SiteRow<"assessment_periods">>
  | Fits<Row<S, "relationships">, SiteRow<"relationships">>
  | Fits<Row<S, "entity_audit_log">, SiteRow<"entity_audit_log">>
  | Fits<Row<S, "assessments">, SiteRow<"assessments">>;

export type ShadowyRealmChecks = [
  Assert<Equal<FitsEverywhere<"shadowyrealm">, true>>,
  Assert<
    Equal<
      AssessmentDimensionColumns<"shadowyrealm">,
      DimensionColumns<"scientific" | "economic" | "human_rights" | "health" | "cultural">
    >
  >,
];

export type InventionsChecks = [
  Assert<Equal<FitsEverywhere<"inventions">, true>>,
  Assert<
    Equal<
      AssessmentDimensionColumns<"inventions">,
      DimensionColumns<"prosperity" | "health" | "knowledge" | "freedom" | "environment">
    >
  >,
];
