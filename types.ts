export interface Snippet {
  id: number;
  title: string;
  content: string;
  language: string;
  created_at: string;
  description?: string;  // Add this
  tags?: string[];       // Add this
}