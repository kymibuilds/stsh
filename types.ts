export type Snippet = {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  code: string;
  language: string;
  tags?: string[] | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
};
