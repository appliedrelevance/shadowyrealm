import type { SiteTables, PublicationStatus } from "@/lib/site-tables";

export type Entity = SiteTables["entities"]["Row"];
export type EntityInsert = SiteTables["entities"]["Insert"];
export type EntityUpdate = SiteTables["entities"]["Update"];

/** A key of the site's entity types (src/sites). */
export type EntityType = string;
export type { PublicationStatus };

export interface EntityFilters {
  entityType?: EntityType;
  status?: PublicationStatus;
  page: number;
  perPage: number;
}
