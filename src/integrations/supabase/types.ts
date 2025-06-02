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
      business_health: {
        Row: {
          client_id: string
          created_at: string
          id: string
          overview: string | null
          purpose: string | null
          report_id: string | null
          sub_pillars: Json
          tab_id: string
          total_score: number | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          overview?: string | null
          purpose?: string | null
          report_id?: string | null
          sub_pillars?: Json
          tab_id: string
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          overview?: string | null
          purpose?: string | null
          report_id?: string | null
          sub_pillars?: Json
          tab_id?: string
          total_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      exercise_answers: {
        Row: {
          answers: Json
          company_name: string | null
          completed_at: string | null
          created_at: string
          exercise_id: number
          exercise_title: string
          id: string
          progress: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          exercise_id: number
          exercise_title: string
          id?: string
          progress?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          exercise_id?: number
          exercise_title?: string
          id?: string
          progress?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          created_at: string
          documents: Json
          id: string
          package_name: string
          report_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          documents?: Json
          id?: string
          package_name: string
          report_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          documents?: Json
          id?: string
          package_name?: string
          report_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          company_id: string | null
          company_name: string
          completion_date: string | null
          created_at: string
          exercise_id: string
          id: string
          overall_score: number | null
          people_score: number | null
          pitch_deck_url: string | null
          plan_score: number | null
          profits_score: number | null
          purpose_impact_score: number | null
          status: string
          status_type: string
          stress_leadership_score: number | null
          tabs_data: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          company_name: string
          completion_date?: string | null
          created_at?: string
          exercise_id: string
          id?: string
          overall_score?: number | null
          people_score?: number | null
          pitch_deck_url?: string | null
          plan_score?: number | null
          profits_score?: number | null
          purpose_impact_score?: number | null
          status?: string
          status_type?: string
          stress_leadership_score?: number | null
          tabs_data?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          company_name?: string
          completion_date?: string | null
          created_at?: string
          exercise_id?: string
          id?: string
          overall_score?: number | null
          people_score?: number | null
          pitch_deck_url?: string | null
          plan_score?: number | null
          profits_score?: number | null
          purpose_impact_score?: number | null
          status?: string
          status_type?: string
          stress_leadership_score?: number | null
          tabs_data?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
