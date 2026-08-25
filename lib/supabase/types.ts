import type { ResourceCategory } from "@/lib/types";

/**
 * Hand-written database types for the Supabase client. Kept in sync with
 * supabase/schema.sql. These MUST be `type` aliases (not `interface`) so they
 * satisfy the client's internal `Record<string, unknown>` constraint —
 * otherwise every query result degrades to `never`.
 */

export type ProfileRow = {
  id: string;
  full_name: string | null;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type ResourceRow = {
  id: string;
  author_id: string | null;
  author_name: string;
  category: ResourceCategory;
  year: number;
  department: string;
  title: string;
  description: string;
  tags: string[];
  external_url: string | null;
  reused_count: number;
  created_at: string;
  updated_at: string;
};

export type ResourceFileRow = {
  id: string;
  resource_id: string;
  storage_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
};

export type SaveRow = {
  user_id: string;
  resource_id: string;
  created_at: string;
};

export type ReuseRow = {
  id: string;
  resource_id: string;
  user_id: string;
  note: string | null;
  created_at: string;
};

type Insert<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Insert<
          ProfileRow,
          "created_at" | "full_name" | "department" | "avatar_url"
        >;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      resources: {
        Row: ResourceRow;
        Insert: Insert<
          ResourceRow,
          | "id"
          | "reused_count"
          | "created_at"
          | "updated_at"
          | "external_url"
          | "author_id"
          | "description"
          | "tags"
        >;
        Update: Partial<ResourceRow>;
        Relationships: [];
      };
      resource_files: {
        Row: ResourceFileRow;
        Insert: Insert<
          ResourceFileRow,
          "id" | "created_at" | "file_size" | "mime_type"
        >;
        Update: Partial<ResourceFileRow>;
        Relationships: [];
      };
      saves: {
        Row: SaveRow;
        Insert: Insert<SaveRow, "created_at">;
        Update: Partial<SaveRow>;
        Relationships: [];
      };
      reuses: {
        Row: ReuseRow;
        Insert: Insert<ReuseRow, "id" | "created_at" | "note">;
        Update: Partial<ReuseRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      resource_category: ResourceCategory;
    };
    CompositeTypes: Record<string, never>;
  };
};
