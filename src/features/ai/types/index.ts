import type { EntityType } from "@/features/entities/types";

export interface AIWikipediaData {
  title: string;
  extract: string;
  thumbnail?: string;
  categories: string[];
  page_url: string;
}

export interface AIMetadata {
  birth_date?: string;
  death_date?: string;
  nationality?: string;
  founded_date?: string;
  headquarters?: string;
  organization_type?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  event_type?: string;
}

export interface AIScores {
  scientific: number;
  economic: number;
  human_rights: number;
  health: number;
  cultural: number;
}

export interface AIJustifications {
  scientific: string;
  economic: string;
  human_rights: string;
  health: string;
  cultural: string;
}

export interface AIProfile {
  detected_type: EntityType;
  description: string;
  biography: string;
  impact_summary: string;
  key_achievements: string[];
  metadata: AIMetadata;
  suggested_scores: AIScores;
  suggested_justifications: AIJustifications;
  confidence_level: number;
  analysis_reasoning: string;
  potential_biases: string[];
}

export interface AIResearchResponse {
  wikipedia: AIWikipediaData | null;
  ai_profile: AIProfile | null;
  bias_warnings: string[];
  model_used: string;
}

/** Flattened AI data ready to populate the entity form */
export interface AIEntityData {
  name: string;
  entity_type: EntityType;
  description: string;
  biography: string;
  metadata: AIMetadata;
  scores: AIScores;
  justifications: AIJustifications;
  confidence_level: number;
  model_used: string;
}
