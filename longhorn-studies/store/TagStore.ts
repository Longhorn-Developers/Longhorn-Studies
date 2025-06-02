import { create } from 'zustand';

import { PublicTagsInsertSchema, PublicTagsRowSchema } from '~/types/schemas_infer';
import { supabase } from '~/utils/supabase';

type TagState = {
  searchQuery: string;
  isSearching: boolean;
  searchResults: PublicTagsRowSchema[];
  selectedTags: PublicTagsRowSchema[];

  // Actions
  setSearchQuery: (query: string) => void;
  searchTags: () => Promise<void>;
  addTag: (tag: PublicTagsInsertSchema) => void;
  removeTag: (tag: PublicTagsRowSchema) => void;
  toggleTag: (tag: PublicTagsRowSchema) => void;
  resetTags: () => void;
};

export const useTagStore = create<TagState>((set, get) => ({
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

  addTag: (tag: PublicTagsInsertSchema) => {
    const { selectedTags } = get();
    if (!selectedTags.some((t) => t.label.toLowerCase() === tag.label.toLowerCase())) {
      // Ensure the tag has all required properties for PublicTagsRowSchema
      const newTag: PublicTagsRowSchema = {
        id: 'id' in tag ? tag.id! : 0,
        label: tag.label,
        slug: tag.slug,
        created_by: tag.created_by ?? null,
        is_system: tag.is_system ?? null,
      };
      set({ selectedTags: [...selectedTags, newTag] });
    }
  },

  removeTag: (tag: PublicTagsRowSchema) => {
    const { selectedTags } = get();
    set({
      selectedTags: selectedTags.filter((t) =>
        t.id ? t.id !== tag.id : t.label.toLowerCase() !== tag.label.toLowerCase()
      ),
    });
  },

  toggleTag: (tag: PublicTagsRowSchema) => {
    const { selectedTags } = get();
    const isSelected = selectedTags.some((t) =>
      t.id ? t.id === tag.id : t.label.toLowerCase() === tag.label?.toLowerCase()
    );

    if (isSelected) {
      get().removeTag(tag);
    } else {
      // Convert to PublicTagsInsertSchema compatible object
      const insertTag: PublicTagsInsertSchema = {
        label: tag.label,
        slug: tag.slug,
        created_by: tag.created_by,
        is_system: tag.is_system,
      };
      get().addTag(insertTag);
    }
  },

  resetTags: () => set({ selectedTags: [], searchQuery: '', searchResults: [] }),
}));
