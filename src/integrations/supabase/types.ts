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
      attack_simulations: {
        Row: {
          description: string | null
          id: string
          result: string | null
          status: string | null
          target: string | null
          timestamp: string | null
          type: string
        }
        Insert: {
          description?: string | null
          id?: string
          result?: string | null
          status?: string | null
          target?: string | null
          timestamp?: string | null
          type: string
        }
        Update: {
          description?: string | null
          id?: string
          result?: string | null
          status?: string | null
          target?: string | null
          timestamp?: string | null
          type?: string
        }
        Relationships: []
      }
      devices: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          firmware: string | null
          first_seen: string | null
          id: string
          ip: string | null
          last_active: string | null
          mac: string | null
          name: string
          port: string | null
          status: string | null
          type: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          firmware?: string | null
          first_seen?: string | null
          id?: string
          ip?: string | null
          last_active?: string | null
          mac?: string | null
          name: string
          port?: string | null
          status?: string | null
          type: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          firmware?: string | null
          first_seen?: string | null
          id?: string
          ip?: string | null
          last_active?: string | null
          mac?: string | null
          name?: string
          port?: string | null
          status?: string | null
          type?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          description: string | null
          id: string
          status: string | null
          target: string | null
          timestamp: string | null
          title: string
          type: string
        }
        Insert: {
          description?: string | null
          id?: string
          status?: string | null
          target?: string | null
          timestamp?: string | null
          title: string
          type: string
        }
        Update: {
          description?: string | null
          id?: string
          status?: string | null
          target?: string | null
          timestamp?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      network_devices: {
        Row: {
          device_name: string | null
          first_seen: string | null
          id: string
          ip_address: string | null
          is_authorized: boolean | null
          mac_address: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          device_name?: string | null
          first_seen?: string | null
          id?: string
          ip_address?: string | null
          is_authorized?: boolean | null
          mac_address?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          device_name?: string | null
          first_seen?: string | null
          id?: string
          ip_address?: string | null
          is_authorized?: boolean | null
          mac_address?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      network_scans: {
        Row: {
          completed: boolean | null
          devices_found: number | null
          id: string
          new_devices: number | null
          scan_date: string | null
        }
        Insert: {
          completed?: boolean | null
          devices_found?: number | null
          id?: string
          new_devices?: number | null
          scan_date?: string | null
        }
        Update: {
          completed?: boolean | null
          devices_found?: number | null
          id?: string
          new_devices?: number | null
          scan_date?: string | null
        }
        Relationships: []
      }
      security_analyses: {
        Row: {
          confidence: number | null
          content: string
          created_at: string | null
          id: string
          is_malicious: boolean | null
          reason: string | null
          type: string
        }
        Insert: {
          confidence?: number | null
          content: string
          created_at?: string | null
          id?: string
          is_malicious?: boolean | null
          reason?: string | null
          type: string
        }
        Update: {
          confidence?: number | null
          content?: string
          created_at?: string | null
          id?: string
          is_malicious?: boolean | null
          reason?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_phishing: {
        Args: { email_content: string }
        Returns: {
          is_phishing: boolean
          confidence: number
          reasons: string[]
        }[]
      }
      analyze_url: {
        Args: { url_to_analyze: string }
        Returns: {
          is_malicious: boolean
          confidence: number
          reason: string
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
