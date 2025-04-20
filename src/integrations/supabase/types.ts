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
      appointments: {
        Row: {
          appointment_date: string
          consultation_type: string
          created_at: string | null
          doctor_id: string
          fee: number
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          consultation_type: string
          created_at?: string | null
          doctor_id: string
          fee: number
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          consultation_type?: string
          created_at?: string | null
          doctor_id?: string
          fee?: number
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          available_today: boolean | null
          created_at: string | null
          experience: string | null
          features: string[] | null
          id: string
          image: string | null
          location: string | null
          name: string
          price: number | null
          rating: number | null
          review_count: number | null
          specialty: string
          updated_at: string | null
        }
        Insert: {
          available_today?: boolean | null
          created_at?: string | null
          experience?: string | null
          features?: string[] | null
          id?: string
          image?: string | null
          location?: string | null
          name: string
          price?: number | null
          rating?: number | null
          review_count?: number | null
          specialty: string
          updated_at?: string | null
        }
        Update: {
          available_today?: boolean | null
          created_at?: string | null
          experience?: string | null
          features?: string[] | null
          id?: string
          image?: string | null
          location?: string | null
          name?: string
          price?: number | null
          rating?: number | null
          review_count?: number | null
          specialty?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          created_at: string | null
          departments: string[] | null
          features: string[] | null
          id: string
          image: string | null
          location: string
          name: string
          phone: string | null
          rating: number | null
          review_count: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          departments?: string[] | null
          features?: string[] | null
          id?: string
          image?: string | null
          location: string
          name: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          departments?: string[] | null
          features?: string[] | null
          id?: string
          image?: string | null
          location?: string
          name?: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          content_type: string
          file_path: string
          id: string
          name: string
          size: number
          uploaded_at: string
          user_id: string
        }
        Insert: {
          content_type: string
          file_path: string
          id?: string
          name: string
          size: number
          uploaded_at?: string
          user_id: string
        }
        Update: {
          content_type?: string
          file_path?: string
          id?: string
          name?: string
          size?: number
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medicines: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          in_stock: boolean | null
          manufacturer: string
          name: string
          prescription_required: boolean | null
          price: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          manufacturer: string
          name: string
          prescription_required?: boolean | null
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          manufacturer?: string
          name?: string
          prescription_required?: boolean | null
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          appointment_id: string
          created_at: string
          doctor_id: string
          dosage: string
          id: string
          instructions: string
          medication: string
          patient_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          doctor_id: string
          dosage: string
          id?: string
          instructions: string
          medication: string
          patient_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          doctor_id?: string
          dosage?: string
          id?: string
          instructions?: string
          medication?: string
          patient_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          created_at: string | null
          id: string
          medicine_id: string
          medicine_name: string
          price: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          medicine_id: string
          medicine_name: string
          price: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          medicine_id?: string
          medicine_name?: string
          price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      specialists: {
        Row: {
          available_today: boolean | null
          created_at: string | null
          experience: string | null
          features: string[] | null
          id: string
          image: string | null
          location: string | null
          name: string
          price: number | null
          rating: number | null
          review_count: number | null
          specialty: string
          updated_at: string | null
        }
        Insert: {
          available_today?: boolean | null
          created_at?: string | null
          experience?: string | null
          features?: string[] | null
          id?: string
          image?: string | null
          location?: string | null
          name: string
          price?: number | null
          rating?: number | null
          review_count?: number | null
          specialty: string
          updated_at?: string | null
        }
        Update: {
          available_today?: boolean | null
          created_at?: string | null
          experience?: string | null
          features?: string[] | null
          id?: string
          image?: string | null
          location?: string | null
          name?: string
          price?: number | null
          rating?: number | null
          review_count?: number | null
          specialty?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
