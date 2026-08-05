import type { Database } from "@/lib/database.types";

export type Entity = Database["shadowyrealm"]["Tables"]["entities"]["Row"];
export type EntityInsert = Database["shadowyrealm"]["Tables"]["entities"]["Insert"];
export type EntityUpdate = Database["shadowyrealm"]["Tables"]["entities"]["Update"];

export type EntityType = Database["shadowyrealm"]["Enums"]["entity_type"];
export type PublicationStatus = Database["shadowyrealm"]["Enums"]["publication_status"];

export interface PersonMetadata {
  birth_date?: string;
  death_date?: string;
  nationality?: string;
  gender?: string;
  wikipedia_url?: string;
}

export interface OrganizationMetadata {
  founded_date?: string;
  dissolved_date?: string;
  headquarters?: string;
  organization_type?: "corporation" | "ngo" | "government" | "institution" | "military";
  wikipedia_url?: string;
}

export interface EventMetadata {
  start_date?: string;
  end_date?: string;
  location?: string;
  event_type?: "war" | "discovery" | "movement" | "disaster" | "treaty" | "revolution";
  wikipedia_url?: string;
}

export type EntityMetadata = PersonMetadata | OrganizationMetadata | EventMetadata;

export type EntitySort = "newest" | "oldest" | "name_asc" | "name_desc";

export interface EntityFilters {
  entityType?: EntityType;
  status?: PublicationStatus;
  search?: string;
  sort?: EntitySort;
  page: number;
  perPage: number;
}
