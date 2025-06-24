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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          water?: number | null
          weight?: number | null
          workout_completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_progress_user_id_fkey"
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          created_at: string | null
          email: string | null
          goal: string | null
          height: number | null
          id: string
          intermittent_fasting: boolean | null
          lactose_intolerant: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          created_at?: string | null
          email?: string | null
          goal?: string | null
          height?: number | null
          id: string
          intermittent_fasting?: boolean | null
          lactose_intolerant?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          created_at?: string | null
          email?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          intermittent_fasting?: boolean | null
          lactose_intolerant?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      seasonal_recommendations: {
        Row: {
          calories_range: unknown | null
          created_at: string | null
          description: string | null
          id: string
          meal_type: string
          recommended_foods: string[]
          season: string
          time_of_day: string
        }
        Insert: {
          calories_range?: unknown | null
          created_at?: string | null
          description?: string | null
          id?: string
          meal_type: string
          recommended_foods: string[]
          season: string
          time_of_day: string
        }
        Update: {
          calories_range?: unknown | null
          created_at?: string | null
          description?: string | null
          id?: string
          meal_type?: string
          recommended_foods?: string[]
          season?: string
          time_of_day?: string
        }
        Relationships: []
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
        Relationships: []
      }
      weekly_progress: {
        Row: {
          created_at: string | null
          date: string
          id: string
          user_id: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_entries: {
        Row: {
          created_at: string | null
          date: string
          id: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_personalized_recommendations: {
        Args: {
          p_user_id: string
          p_current_time?: string
          p_current_season?: string
        }
        Returns: {
          meal_type: string
          recommended_foods: string[]
          calories: number
          protein: number
          carbs: number
          fat: number
          description: string
        }[]
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

export interface UserProfile {
  id: string;
  name: string;
  age: number | null;
  height: number | null;
  currentWeight: number | null;
  startWeight: number | null;
  targetWeight: number | null;
  activityLevel: string;
  goal: string;
  intermittentFasting: boolean;
  lactoseIntolerant: boolean;
  targetCalories: number | null;
  targetWater: number | null;
  created_at: string;
}

export interface DailyProgress {
  date: string;
  water: number;
  calories: number;
  weight?: number;
  workoutCompleted: boolean;
  supplementsTaken: number;
  shotsConsumed: string[];
}

export interface PendingData {
  id: string;
  type: 'profile' | 'progress';
  data: any;
  timestamp: number;
  attempts: number;
}
