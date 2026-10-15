export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      app_error_logs: {
        Row: {
          context: Json
          created_at: string
          id: string
          level: string
          message: string
          owner_id: string
          source: string
        }
        Insert: {
          context?: Json
          created_at?: string
          id?: string
          level?: string
          message: string
          owner_id?: string
          source: string
        }
        Update: {
          context?: Json
          created_at?: string
          id?: string
          level?: string
          message?: string
          owner_id?: string
          source?: string
        }
        Relationships: []
      }
      approvals: {
        Row: {
          content_hash: string
          created_at: string
          decided_at: string
          decision: string
          decision_note: string | null
          id: string
          outreach_draft_id: string
          owner_id: string
          reviewer_id: string
        }
        Insert: {
          content_hash: string
          created_at?: string
          decided_at?: string
          decision: string
          decision_note?: string | null
          id?: string
          outreach_draft_id: string
          owner_id?: string
          reviewer_id?: string
        }
        Update: {
          content_hash?: string
          created_at?: string
          decided_at?: string
          decision?: string
          decision_note?: string | null
          id?: string
          outreach_draft_id?: string
          owner_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_outreach_draft_id_fkey"
            columns: ["outreach_draft_id"]
            isOneToOne: false
            referencedRelation: "outreach_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_findings: {
        Row: {
          audit_id: string
          category: string
          company_id: string
          confidence: number | null
          created_at: string
          description: string | null
          estimated_business_impact: string | null
          evidence: string | null
          id: string
          owner_id: string
          review_status: string
          severity: string
          source_url: string | null
          suggested_solution: string | null
          title: string
          verified_at: string | null
        }
        Insert: {
          audit_id: string
          category: string
          company_id: string
          confidence?: number | null
          created_at?: string
          description?: string | null
          estimated_business_impact?: string | null
          evidence?: string | null
          id?: string
          owner_id?: string
          review_status?: string
          severity?: string
          source_url?: string | null
          suggested_solution?: string | null
          title: string
          verified_at?: string | null
        }
        Update: {
          audit_id?: string
          category?: string
          company_id?: string
          confidence?: number | null
          created_at?: string
          description?: string | null
          estimated_business_impact?: string | null
          evidence?: string | null
          id?: string
          owner_id?: string
          review_status?: string
          severity?: string
          source_url?: string | null
          suggested_solution?: string | null
          title?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "digital_audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_runs: {
        Row: {
          attempt_count: number
          completed_at: string | null
          created_at: string
          error_code: string | null
          id: string
          idempotency_key: string | null
          input_summary: Json
          job_type: string
          owner_id: string
          related_entity_id: string | null
          result_summary: Json
          safe_error_message: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          attempt_count?: number
          completed_at?: string | null
          created_at?: string
          error_code?: string | null
          id?: string
          idempotency_key?: string | null
          input_summary?: Json
          job_type: string
          owner_id?: string
          related_entity_id?: string | null
          result_summary?: Json
          safe_error_message?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          attempt_count?: number
          completed_at?: string | null
          created_at?: string
          error_code?: string | null
          id?: string
          idempotency_key?: string | null
          input_summary?: Json
          job_type?: string
          owner_id?: string
          related_entity_id?: string | null
          result_summary?: Json
          safe_error_message?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          analysis_status: string
          archived_at: string | null
          category: string | null
          city: string | null
          commercial_status: string
          country: string
          created_at: string
          first_discovered_at: string
          id: string
          last_verified_at: string | null
          name: string
          niche: string | null
          normalized_name: string
          owner_id: string
          primary_email: string | null
          primary_phone: string | null
          primary_social_url: string | null
          source_status: string
          state: string | null
          subniche: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          analysis_status?: string
          archived_at?: string | null
          category?: string | null
          city?: string | null
          commercial_status?: string
          country?: string
          created_at?: string
          first_discovered_at?: string
          id?: string
          last_verified_at?: string | null
          name: string
          niche?: string | null
          normalized_name: string
          owner_id?: string
          primary_email?: string | null
          primary_phone?: string | null
          primary_social_url?: string | null
          source_status?: string
          state?: string | null
          subniche?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          analysis_status?: string
          archived_at?: string | null
          category?: string | null
          city?: string | null
          commercial_status?: string
          country?: string
          created_at?: string
          first_discovered_at?: string
          id?: string
          last_verified_at?: string | null
          name?: string
          niche?: string | null
          normalized_name?: string
          owner_id?: string
          primary_email?: string | null
          primary_phone?: string | null
          primary_social_url?: string | null
          source_status?: string
          state?: string | null
          subniche?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      company_contacts: {
        Row: {
          company_id: string
          contact_type: string
          created_at: string
          id: string
          normalized_value: string
          owner_id: string
          source_record_id: string | null
          updated_at: string
          value: string
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          company_id: string
          contact_type: string
          created_at?: string
          id?: string
          normalized_value: string
          owner_id?: string
          source_record_id?: string | null
          updated_at?: string
          value: string
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          company_id?: string
          contact_type?: string
          created_at?: string
          id?: string
          normalized_value?: string
          owner_id?: string
          source_record_id?: string | null
          updated_at?: string
          value?: string
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_contacts_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_audits: {
        Row: {
          audit_type: string
          company_id: string
          completed_at: string | null
          confidence_score: number | null
          coverage_summary: Json
          created_at: string
          id: string
          model_name: string | null
          model_provider: string | null
          owner_id: string
          prompt_version: string | null
          started_at: string | null
          status: string
          summary: string | null
          target_url: string | null
        }
        Insert: {
          audit_type: string
          company_id: string
          completed_at?: string | null
          confidence_score?: number | null
          coverage_summary?: Json
          created_at?: string
          id?: string
          model_name?: string | null
          model_provider?: string | null
          owner_id?: string
          prompt_version?: string | null
          started_at?: string | null
          status?: string
          summary?: string | null
          target_url?: string | null
        }
        Update: {
          audit_type?: string
          company_id?: string
          completed_at?: string | null
          confidence_score?: number | null
          coverage_summary?: Json
          created_at?: string
          id?: string
          model_name?: string | null
          model_provider?: string | null
          owner_id?: string
          prompt_version?: string | null
          started_at?: string | null
          status?: string
          summary?: string | null
          target_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_audits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          configuration: Json
          created_at: string
          id: string
          integration_type: string
          last_error_code: string | null
          last_tested_at: string | null
          owner_id: string
          provider: string
          status: string
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          id?: string
          integration_type: string
          last_error_code?: string | null
          last_tested_at?: string | null
          owner_id?: string
          provider: string
          status?: string
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          id?: string
          integration_type?: string
          last_error_code?: string | null
          last_tested_at?: string | null
          owner_id?: string
          provider?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          channel: string
          company_id: string
          content_summary: string | null
          created_at: string
          direction: string
          id: string
          interaction_type: string
          occurred_at: string
          outreach_draft_id: string | null
          owner_id: string
          provider_reference: string | null
          status: string
        }
        Insert: {
          channel: string
          company_id: string
          content_summary?: string | null
          created_at?: string
          direction?: string
          id?: string
          interaction_type: string
          occurred_at?: string
          outreach_draft_id?: string | null
          owner_id?: string
          provider_reference?: string | null
          status?: string
        }
        Update: {
          channel?: string
          company_id?: string
          content_summary?: string | null
          created_at?: string
          direction?: string
          id?: string
          interaction_type?: string
          occurred_at?: string
          outreach_draft_id?: string | null
          owner_id?: string
          provider_reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_outreach_draft_id_fkey"
            columns: ["outreach_draft_id"]
            isOneToOne: false
            referencedRelation: "outreach_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scores: {
        Row: {
          analysis_confidence_score: number
          calculated_at: string
          commercial_potential_score: number
          company_id: string
          created_at: string
          criteria_breakdown: Json
          digital_opportunity_score: number
          evidence_references: Json
          explanation: string | null
          id: string
          missing_criteria: Json
          owner_id: string
          scoring_version: string
        }
        Insert: {
          analysis_confidence_score: number
          calculated_at?: string
          commercial_potential_score: number
          company_id: string
          created_at?: string
          criteria_breakdown?: Json
          digital_opportunity_score: number
          evidence_references?: Json
          explanation?: string | null
          id?: string
          missing_criteria?: Json
          owner_id?: string
          scoring_version: string
        }
        Update: {
          analysis_confidence_score?: number
          calculated_at?: string
          commercial_potential_score?: number
          company_id?: string
          created_at?: string
          criteria_breakdown?: Json
          digital_opportunity_score?: number
          evidence_references?: Json
          explanation?: string | null
          id?: string
          missing_criteria?: Json
          owner_id?: string
          scoring_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          estimated_cost: number | null
          estimated_delivery_days: number | null
          id: string
          name: string
          owner_id: string
          reference_price: number
          scope: Json
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          estimated_delivery_days?: number | null
          id?: string
          name: string
          owner_id?: string
          reference_price?: number
          scope?: Json
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          estimated_delivery_days?: number | null
          id?: string
          name?: string
          owner_id?: string
          reference_price?: number
          scope?: Json
          updated_at?: string
        }
        Relationships: []
      }
      outreach_drafts: {
        Row: {
          channel: string
          company_id: string
          content: string
          created_at: string
          evidence_references: Json
          id: string
          model_name: string | null
          model_provider: string | null
          objective: string | null
          owner_id: string
          prompt_version: string | null
          script_content: string | null
          status: string
          tone: string | null
          updated_at: string
        }
        Insert: {
          channel: string
          company_id: string
          content: string
          created_at?: string
          evidence_references?: Json
          id?: string
          model_name?: string | null
          model_provider?: string | null
          objective?: string | null
          owner_id?: string
          prompt_version?: string | null
          script_content?: string | null
          status?: string
          tone?: string | null
          updated_at?: string
        }
        Update: {
          channel?: string
          company_id?: string
          content?: string
          created_at?: string
          evidence_references?: Json
          id?: string
          model_name?: string | null
          model_provider?: string | null
          objective?: string | null
          owner_id?: string
          prompt_version?: string | null
          script_content?: string | null
          status?: string
          tone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_drafts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_events: {
        Row: {
          company_id: string
          created_at: string
          id: string
          new_status: string
          occurred_at: string
          owner_id: string
          previous_status: string | null
          reason: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          new_status: string
          occurred_at?: string
          owner_id?: string
          previous_status?: string | null
          reason?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          new_status?: string
          occurred_at?: string
          owner_id?: string
          previous_status?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          preferences: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          preferences?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string
          discount: number
          estimated_cost: number | null
          id: string
          items: Json
          owner_id: string
          sent_at: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
          validity_date: string | null
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string
          discount?: number
          estimated_cost?: number | null
          id?: string
          items?: Json
          owner_id?: string
          sent_at?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          validity_date?: string | null
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string
          discount?: number
          estimated_cost?: number | null
          id?: string
          items?: Json
          owner_id?: string
          sent_at?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          validity_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          closed_at: string
          company_id: string
          contracted_amount: number
          created_at: string
          id: string
          owner_id: string
          proposal_id: string | null
          received_amount: number
          recorded_cost: number | null
          status: string
          updated_at: string
        }
        Insert: {
          closed_at?: string
          company_id: string
          contracted_amount?: number
          created_at?: string
          id?: string
          owner_id?: string
          proposal_id?: string | null
          received_amount?: number
          recorded_cost?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          closed_at?: string
          company_id?: string
          contracted_amount?: number
          created_at?: string
          id?: string
          owner_id?: string
          proposal_id?: string | null
          received_amount?: number
          recorded_cost?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      search_jobs: {
        Row: {
          actual_cost: number | null
          city: string | null
          completed_at: string | null
          country: string
          created_at: string
          duplicate_count: number
          estimated_cost: number | null
          failed_count: number
          filters: Json
          id: string
          imported_count: number
          keywords: string[]
          max_results: number
          name: string
          niche: string
          owner_id: string
          providers: Json
          results_count: number
          started_at: string | null
          state: string | null
          status: string
          subniche: string | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          city?: string | null
          completed_at?: string | null
          country?: string
          created_at?: string
          duplicate_count?: number
          estimated_cost?: number | null
          failed_count?: number
          filters?: Json
          id?: string
          imported_count?: number
          keywords?: string[]
          max_results?: number
          name: string
          niche: string
          owner_id?: string
          providers?: Json
          results_count?: number
          started_at?: string | null
          state?: string | null
          status?: string
          subniche?: string | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          city?: string | null
          completed_at?: string | null
          country?: string
          created_at?: string
          duplicate_count?: number
          estimated_cost?: number | null
          failed_count?: number
          filters?: Json
          id?: string
          imported_count?: number
          keywords?: string[]
          max_results?: number
          name?: string
          niche?: string
          owner_id?: string
          providers?: Json
          results_count?: number
          started_at?: string | null
          state?: string | null
          status?: string
          subniche?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      source_records: {
        Row: {
          attribution: string | null
          collected_at: string
          company_id: string | null
          created_at: string
          external_id: string | null
          id: string
          owner_id: string
          payload_summary: Json
          provider: string
          search_job_id: string | null
          source_url: string | null
        }
        Insert: {
          attribution?: string | null
          collected_at?: string
          company_id?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          owner_id?: string
          payload_summary?: Json
          provider: string
          search_job_id?: string | null
          source_url?: string | null
        }
        Update: {
          attribution?: string | null
          collected_at?: string
          company_id?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          owner_id?: string
          payload_summary?: Json
          provider?: string
          search_job_id?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_search_job_id_fkey"
            columns: ["search_job_id"]
            isOneToOne: false
            referencedRelation: "search_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          company_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          owner_id: string
          priority: string
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          owner_id?: string
          priority?: string
          status?: string
          task_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          owner_id?: string
          priority?: string
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
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
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
} as const
