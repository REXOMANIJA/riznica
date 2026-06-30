export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SizePreset = "small" | "medium" | "wide" | "tall";
export type CoverColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface Database {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string;
          title: string;
          genre: string | null;
          content: string | null;
          cover_image_url: string | null;
          written_date: string | null;
          shelf_order: number;
          is_published: boolean;
          size_preset: SizePreset;
          cover_color: CoverColor;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          genre?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          written_date?: string | null;
          shelf_order?: number;
          is_published?: boolean;
          size_preset?: SizePreset;
          cover_color?: CoverColor;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          genre?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          written_date?: string | null;
          shelf_order?: number;
          is_published?: boolean;
          size_preset?: SizePreset;
          cover_color?: CoverColor;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Story = Database["public"]["Tables"]["stories"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];
