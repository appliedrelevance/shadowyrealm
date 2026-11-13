export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  shadowyrealm: {
    Tables: {
      assessment_periods: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_year: number
          entity_id: number
          geographic_scope: string
          id: number
          label: string
          persistence_factor: number
          reach_factor: number
          start_year: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_year: number
          entity_id: number
          geographic_scope?: string
          id?: never
          label: string
          persistence_factor?: number
          reach_factor?: number
          start_year: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_year?: number
          entity_id?: number
          geographic_scope?: string
          id?: never
          label?: string
          persistence_factor?: number
          reach_factor?: number
          start_year?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_periods_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          ai_model_used: string | null
          ai_suggested: boolean
          bias_warnings: string[] | null
          confidence_level: number | null
          controversy_level: number | null
          created_at: string
          created_by: string
          cultural_justification: string
          cultural_benefit: number
          cultural_harm: number
          economic_justification: string
          economic_benefit: number
          economic_harm: number
          entity_id: number
          health_justification: string
          health_benefit: number
          health_harm: number
          human_rights_justification: string
          human_rights_benefit: number
          human_rights_harm: number
          id: number
          period_id: number | null
          scientific_justification: string
          scientific_benefit: number
          scientific_harm: number
          sources: string[] | null
          updated_at: string
        }
        Insert: {
          ai_model_used?: string | null
          ai_suggested?: boolean
          bias_warnings?: string[] | null
          confidence_level?: number | null
          controversy_level?: number | null
          created_at?: string
          created_by: string
          cultural_justification: string
          cultural_benefit: number
          cultural_harm: number
          economic_justification: string
          economic_benefit: number
          economic_harm: number
          entity_id: number
          health_justification: string
          health_benefit: number
          health_harm: number
          human_rights_justification: string
          human_rights_benefit: number
          human_rights_harm: number
          id?: never
          period_id?: number | null
          scientific_justification: string
          scientific_benefit: number
          scientific_harm: number
          sources?: string[] | null
          updated_at?: string
        }
        Update: {
          ai_model_used?: string | null
          ai_suggested?: boolean
          bias_warnings?: string[] | null
          confidence_level?: number | null
          controversy_level?: number | null
          created_at?: string
          created_by?: string
          cultural_justification?: string
          cultural_benefit?: number
          cultural_harm?: number
          economic_justification?: string
          economic_benefit?: number
          economic_harm?: number
          entity_id?: number
          health_justification?: string
          health_benefit?: number
          health_harm?: number
          human_rights_justification?: string
          human_rights_benefit?: number
          human_rights_harm?: number
          id?: never
          period_id?: number | null
          scientific_justification?: string
          scientific_benefit?: number
          scientific_harm?: number
          sources?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "assessment_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          ai_generated_content: boolean
          biography: string | null
          created_at: string
          created_by: string
          description: string
          entity_type: Database["shadowyrealm"]["Enums"]["entity_type"]
          id: number
          image_url: string | null
          metadata: Json | null
          name: string
          slug: string
          status: Database["shadowyrealm"]["Enums"]["publication_status"]
          updated_at: string
        }
        Insert: {
          ai_generated_content?: boolean
          biography?: string | null
          created_at?: string
          created_by: string
          description: string
          entity_type: Database["shadowyrealm"]["Enums"]["entity_type"]
          id?: never
          image_url?: string | null
          metadata?: Json | null
          name: string
          slug: string
          status?: Database["shadowyrealm"]["Enums"]["publication_status"]
          updated_at?: string
        }
        Update: {
          ai_generated_content?: boolean
          biography?: string | null
          created_at?: string
          created_by?: string
          description?: string
          entity_type?: Database["shadowyrealm"]["Enums"]["entity_type"]
          id?: never
          image_url?: string | null
          metadata?: Json | null
          name?: string
          slug?: string
          status?: Database["shadowyrealm"]["Enums"]["publication_status"]
          updated_at?: string
        }
        Relationships: []
      }
      entity_audit_log: {
        Row: {
          action: string
          entity_id: number
          id: number
          new_value: Json | null
          old_value: Json | null
          performed_at: string
          performed_by: string
        }
        Insert: {
          action: string
          entity_id: number
          id?: never
          new_value?: Json | null
          old_value?: Json | null
          performed_at?: string
          performed_by: string
        }
        Update: {
          action?: string
          entity_id?: number
          id?: never
          new_value?: Json | null
          old_value?: Json | null
          performed_at?: string
          performed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_audit_log_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      relationships: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: number
          relationship_type: Database["shadowyrealm"]["Enums"]["relationship_type"]
          source_entity_id: number
          strength: number
          target_entity_id: number
          temporal_overlap: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: never
          relationship_type: Database["shadowyrealm"]["Enums"]["relationship_type"]
          source_entity_id: number
          strength?: number
          target_entity_id: number
          temporal_overlap?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: never
          relationship_type?: Database["shadowyrealm"]["Enums"]["relationship_type"]
          source_entity_id?: number
          strength?: number
          target_entity_id?: number
          temporal_overlap?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "relationships_source_entity_id_fkey"
            columns: ["source_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_target_entity_id_fkey"
            columns: ["target_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_shares: {
        Args: { published_only?: boolean }
        Returns: {
          ancestor_id: number
          descendant_id: number
          share: number
        }[]
      }
    }
    Enums: {
      entity_type: "person" | "organization" | "event"
      publication_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "published"
        | "archived"
      relationship_type:
        | "influence"
        | "mentorship"
        | "collaboration"
        | "opposition"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  inventions: {
    Tables: {
      assessment_periods: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_year: number
          entity_id: number
          geographic_scope: string
          id: number
          label: string
          persistence_factor: number
          reach_factor: number
          start_year: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_year: number
          entity_id: number
          geographic_scope?: string
          id?: never
          label: string
          persistence_factor?: number
          reach_factor?: number
          start_year: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_year?: number
          entity_id?: number
          geographic_scope?: string
          id?: never
          label?: string
          persistence_factor?: number
          reach_factor?: number
          start_year?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_periods_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          ai_model_used: string | null
          ai_suggested: boolean
          bias_warnings: string[] | null
          confidence_level: number | null
          controversy_level: number | null
          created_at: string
          created_by: string
          entity_id: number
          environment_benefit: number
          environment_harm: number
          environment_justification: string
          freedom_benefit: number
          freedom_harm: number
          freedom_justification: string
          health_benefit: number
          health_harm: number
          health_justification: string
          id: number
          knowledge_benefit: number
          knowledge_harm: number
          knowledge_justification: string
          period_id: number | null
          prosperity_benefit: number
          prosperity_harm: number
          prosperity_justification: string
          sources: string[] | null
          updated_at: string
        }
        Insert: {
          ai_model_used?: string | null
          ai_suggested?: boolean
          bias_warnings?: string[] | null
          confidence_level?: number | null
          controversy_level?: number | null
          created_at?: string
          created_by: string
          entity_id: number
          environment_benefit: number
          environment_harm: number
          environment_justification: string
          freedom_benefit: number
          freedom_harm: number
          freedom_justification: string
          health_benefit: number
          health_harm: number
          health_justification: string
          id?: never
          knowledge_benefit: number
          knowledge_harm: number
          knowledge_justification: string
          period_id?: number | null
          prosperity_benefit: number
          prosperity_harm: number
          prosperity_justification: string
          sources?: string[] | null
          updated_at?: string
        }
        Update: {
          ai_model_used?: string | null
          ai_suggested?: boolean
          bias_warnings?: string[] | null
          confidence_level?: number | null
          controversy_level?: number | null
          created_at?: string
          created_by?: string
          entity_id?: number
          environment_benefit?: number
          environment_harm?: number
          environment_justification?: string
          freedom_benefit?: number
          freedom_harm?: number
          freedom_justification?: string
          health_benefit?: number
          health_harm?: number
          health_justification?: string
          id?: never
          knowledge_benefit?: number
          knowledge_harm?: number
          knowledge_justification?: string
          period_id?: number | null
          prosperity_benefit?: number
          prosperity_harm?: number
          prosperity_justification?: string
          sources?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "assessment_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          ai_generated_content: boolean
          biography: string | null
          created_at: string
          created_by: string
          description: string
          entity_type: Database["inventions"]["Enums"]["entity_type"]
          id: number
          image_url: string | null
          metadata: Json | null
          name: string
          slug: string
          status: Database["inventions"]["Enums"]["publication_status"]
          updated_at: string
        }
        Insert: {
          ai_generated_content?: boolean
          biography?: string | null
          created_at?: string
          created_by: string
          description: string
          entity_type: Database["inventions"]["Enums"]["entity_type"]
          id?: never
          image_url?: string | null
          metadata?: Json | null
          name: string
          slug: string
          status?: Database["inventions"]["Enums"]["publication_status"]
          updated_at?: string
        }
        Update: {
          ai_generated_content?: boolean
          biography?: string | null
          created_at?: string
          created_by?: string
          description?: string
          entity_type?: Database["inventions"]["Enums"]["entity_type"]
          id?: never
          image_url?: string | null
          metadata?: Json | null
          name?: string
          slug?: string
          status?: Database["inventions"]["Enums"]["publication_status"]
          updated_at?: string
        }
        Relationships: []
      }
      entity_audit_log: {
        Row: {
          action: string
          entity_id: number
          id: number
          new_value: Json | null
          old_value: Json | null
          performed_at: string
          performed_by: string
        }
        Insert: {
          action: string
          entity_id: number
          id?: never
          new_value?: Json | null
          old_value?: Json | null
          performed_at?: string
          performed_by: string
        }
        Update: {
          action?: string
          entity_id?: number
          id?: never
          new_value?: Json | null
          old_value?: Json | null
          performed_at?: string
          performed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_audit_log_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      relationships: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: number
          relationship_type: Database["inventions"]["Enums"]["relationship_type"]
          source_entity_id: number
          strength: number
          target_entity_id: number
          temporal_overlap: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: never
          relationship_type: Database["inventions"]["Enums"]["relationship_type"]
          source_entity_id: number
          strength?: number
          target_entity_id: number
          temporal_overlap?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: never
          relationship_type?: Database["inventions"]["Enums"]["relationship_type"]
          source_entity_id?: number
          strength?: number
          target_entity_id?: number
          temporal_overlap?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "relationships_source_entity_id_fkey"
            columns: ["source_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_target_entity_id_fkey"
            columns: ["target_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_shares: {
        Args: { published_only?: boolean }
        Returns: {
          ancestor_id: number
          descendant_id: number
          share: number
        }[]
      }
    }
    Enums: {
      entity_type:
        | "person"
        | "organization"
        | "project"
        | "invention"
        | "product"
        | "discovery"
      publication_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "published"
        | "archived"
      relationship_type:
        | "originated"
        | "builds_on"
        | "embodies"
        | "made"
        | "led"
        | "mentorship"
        | "collaboration"
        | "rivalry"
        | "supersedes"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
  shadowyrealm: {
    Enums: {
      entity_type: ["person", "organization", "event"],
      publication_status: [
        "draft",
        "submitted",
        "under_review",
        "published",
        "archived",
      ],
      relationship_type: [
        "influence",
        "mentorship",
        "collaboration",
        "opposition",
      ],
    },
  },
  inventions: {
    Enums: {
      entity_type: [
        "person",
        "organization",
        "project",
        "invention",
        "product",
        "discovery",
      ],
      publication_status: [
        "draft",
        "submitted",
        "under_review",
        "published",
        "archived",
      ],
      relationship_type: [
        "originated",
        "builds_on",
        "embodies",
        "made",
        "led",
        "mentorship",
        "collaboration",
        "rivalry",
        "supersedes",
      ],
    },
  },
} as const

