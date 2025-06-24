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
      daily_progress: {
        Row: {
          calories: number | null
          created_at: string | null
          date: string
          id: string
          shots_consumed: string[] | null
          supplements_taken: number | null
          updated_at: string | null
          user_id: string
          water: number | null
          weight: number | null
          workout_completed: boolean | null
        }
        Insert: {
          calories?: number | null
          created_at?: string | null
          date: string
          id?: string
          shots_consumed?: string[] | null
          supplements_taken?: number | null
          updated_at?: string | null
          user_id: string
          water?: number | null
          weight?: number | null
          workout_completed?: boolean | null
        }
        Update: {
          calories?: number | null
          created_at?: string | null
          date?: string
          id?: string
          shots_consumed?: string[] | null
          supplements_taken?: number | null
          updated_at?: string | null
          user_id?: string
          water?: number | null
          weight?: number | null
          workout_completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "public_daily_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          calories: number
          carbs: number
          created_at: string | null
          date: string
          eaten: boolean | null
          eaten_at: string | null
          fat: number
          foods: string[]
          id: string
          meal_type: string
          protein: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string | null
          date: string
          eaten?: boolean | null
          eaten_at?: string | null
          fat: number
          foods: string[]
          id?: string
          meal_type: string
          protein: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string | null
          date?: string
          eaten?: boolean | null
          eaten_at?: string | null
          fat?: number
          foods?: string[]
          id?: string
          meal_type?: string
          protein?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          activity_level: string
          age: number | null
          auth_user_id: string | null
          created_at: string | null
          current_weight: number | null
          goal: string
          height: number | null
          id: string
          intermittent_fasting: boolean | null
          lactose_intolerant: boolean | null
          name: string
          start_weight: number | null
          target_calories: number | null
          target_water: number | null
          target_weight: number | null
          updated_at: string | null
        }
        Insert: {
          activity_level?: string
          age?: number | null
          auth_user_id?: string | null
          created_at?: string | null
          current_weight?: number | null
          goal?: string
          height?: number | null
          id?: string
          intermittent_fasting?: boolean | null
          lactose_intolerant?: boolean | null
          name: string
          start_weight?: number | null
          target_calories?: number | null
          target_water?: number | null
          target_weight?: number | null
          updated_at?: string | null
        }
        Update: {
          activity_level?: string
          age?: number | null
          auth_user_id?: string | null
          created_at?: string | null
          current_weight?: number | null
          goal?: string
          height?: number | null
          id?: string
          intermittent_fasting?: boolean | null
          lactose_intolerant?: boolean | null
          name?: string
          start_weight?: number | null
          target_calories?: number | null
          target_water?: number | null
          target_weight?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_profiles_auth_user_id_fkey"
            columns: ["auth_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_progress: {
        Row: {
          created_at: string | null
          date: string
          id: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_weekly_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
