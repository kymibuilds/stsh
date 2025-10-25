import { create } from 'zustand';
import { Snippet } from '@/types';
import { createSupabaseClient } from '@/utils/supabase/client';

interface SnippetsState {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;
  setSnippets: (snippets: Snippet[]) => void;
  fetchSnippets: (token: string, userId: string) => Promise<void>;
  addSnippet: (snippet: Snippet) => void;
  updateSnippet: (id: string | number, updates: Partial<Snippet>) => void;
  deleteSnippet: (id: string | number) => void;
  togglePin: (id: string | number) => void;
  clearError: () => void;
}

export const useSnippetsStore = create<SnippetsState>((set, get) => ({
  snippets: [],
  isLoading: false,
  error: null,

  setSnippets: (snippets) => set({ snippets }),

  fetchSnippets: async (token: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createSupabaseClient(token);
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', userId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ snippets: data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch snippets',
        isLoading: false
      });
    }
  },

  addSnippet: (snippet) => {
    const safeSnippet: Snippet = {
      id: snippet.id,
      title: snippet.title,
      content: snippet.content,
      language: snippet.language,
      user_id: snippet.user_id,
      created_at: snippet.created_at,
      is_pinned: snippet.is_pinned ?? false,
      description: snippet.description ?? "",
      tags: snippet.tags ?? [],
    };

    set((state) => {
      const pinned = state.snippets.filter(s => s.is_pinned);
      const unpinned = state.snippets.filter(s => !s.is_pinned);

      if (safeSnippet.is_pinned) pinned.unshift(safeSnippet);
      else unpinned.unshift(safeSnippet);

      return { snippets: [...pinned, ...unpinned] };
    });
  },

  updateSnippet: (id, updates) => {
    set((state) => {
      const updated = state.snippets.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      );

      const sorted = updated.sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return { snippets: sorted };
    });
  },

  deleteSnippet: (id) => {
    set((state) => ({
      snippets: state.snippets.filter((s) => s.id !== id)
    }));
  },

  togglePin: (id) => {
    set((state) => {
      const snippet = state.snippets.find((s) => s.id === id);
      if (!snippet) return state;

      const updated = state.snippets.map((s) =>
        s.id === id ? { ...s, is_pinned: !s.is_pinned } : s
      );

      return {
        snippets: updated.sort((a, b) => {
          if (a.is_pinned === b.is_pinned) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.is_pinned ? -1 : 1;
        })
      };
    });
  },

  clearError: () => set({ error: null }),
}));
