// @/types/index.ts (or wherever your types are defined)

export interface Snippet {
  id: string | number;  // Can be either string (UUID) or number
  title: string;
  content: string;
  language: string;
  description?: string | null;
  tags?: string[] | null;  // Add this - text array from Supabase
  created_at: string;
  user_id?: string;
  is_pinned?: boolean;  // Add this for pin functionality
}