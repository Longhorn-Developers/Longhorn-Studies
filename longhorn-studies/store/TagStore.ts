import { createWithEqualityFn } from 'zustand/traditional';

import { PublicTagsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

// optional id type for tags
export type PublicTagsRow = Omit<PublicTagsRowSchema, 'id'> & { id?: PublicTagsRowSchema['id'] };

type TagState = {
  searchQuery: string;
  isSearching: boolean;
  searchResults: PublicTagsRow[];
  selectedTags: PublicTagsRow[];
  commonTags?: PublicTagsRow[];

  // Actions
  setSearchQuery: (query: string) => void;
  searchTags: () => Promise<void>;
  addTag: (tag: PublicTagsRow) => void;
  removeTag: (tag: PublicTagsRow) => void;
  toggleTag: (tag: PublicTagsRow) => void;
  resetTags: () => void;
  fetchCommonTags: () => Promise<void>;
};

export const useTagStore = createWithEqualityFn<TagState>((set, get) => ({
  searchQuery: '',
  isSearching: false,
  searchResults: [],
  selectedTags: [],

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  searchTags: async () => {
    const { searchQuery } = get();

    // Empty Search
    if (searchQuery.trim().length === 0) {
      set({ searchResults: [], isSearching: false });
      return;
    }

    set({ isSearching: true });

    // Fetch tags from Supabase
    try {
      const { data, error } = await supabase
        .from('tags')
        .select()
        .ilike('label', `%${searchQuery}%`)
        .order('label', { ascending: true })
        .limit(5);

      if (error) throw error;

      set({ searchResults: data || [], isSearching: false });
    } catch (error) {
      console.error('Error searching tags:', error);
      set({ searchResults: [], isSearching: false });
    }
  },

  addTag: (tag: PublicTagsRow) => {
    const { selectedTags } = get();
    set({ selectedTags: [...selectedTags, tag] });
  },

  removeTag: (tag: PublicTagsRow) => {
    const { selectedTags } = get();
    set({ selectedTags: selectedTags.filter((t) => t.slug !== tag.slug) });
  },

  toggleTag: (tag: PublicTagsRow) => {
    const { selectedTags } = get();
    const isSelected = selectedTags.some((t) => t.slug === tag.slug);

    if (isSelected) {
      get().removeTag(tag);
    } else {
      get().addTag(tag);
    }
  },

  resetTags: () => set({ selectedTags: [], searchQuery: '', searchResults: [] }),

  fetchCommonTags: async () => {
    const { data, error } = await supabase
      .from('tags')
      .select()
      .order('id', { ascending: true })
      .limit(7);

    if (!error && data) {
      set({ commonTags: data });
      console.log('Fetched common tags');
    }
  },
}));
