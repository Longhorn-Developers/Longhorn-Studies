import { createWithEqualityFn } from 'zustand/traditional';

import { PublicTagsRow } from './TagStore';

import {
  PublicSpotsWithDetailsRowSchema,
  PublicSpotFavoritesRowSchema,
} from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

type SpotsState = {
  spot: PublicSpotsWithDetailsRowSchema | null;
  spotLoading: boolean;

  spots: PublicSpotsWithDetailsRowSchema[];
  spotsLoading: boolean;

  favorites: PublicSpotFavoritesRowSchema[];
  favoritesLoading: boolean;

  searchQuery: string;
  searchResults: PublicSpotsWithDetailsRowSchema[];
  searchLoading: boolean;

  spotsInRegion: PublicSpotsWithDetailsRowSchema[] | null;
  spotsInRegionLoading: boolean;

  // Actions
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;

  searchSpot: (selectedTags: PublicTagsRow[]) => Promise<void>;
  setSearchQuery: (query: string) => void;

  fetchSpot: (id: string) => Promise<void>;
  fetchSpots: () => Promise<void>;
  fetchFavorites: (user_id: string) => Promise<void>;
  fetchSpotsInRegion: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => Promise<void>;
};

export const useSpotsStore = createWithEqualityFn<SpotsState>((set, get) => ({
  spot: null,
  spotLoading: false,

  spots: [],
  spotsLoading: false,

  favorites: [],
  favoritesLoading: false,

  searchQuery: '',
  searchResults: [],
  searchLoading: false,

  spotsInRegion: null,
  spotsInRegionLoading: false,

  addFavorite: async (id: string) => {
    // Add spot to favorites table
    const { data, error } = await supabase
      .from('favorites')
      .insert({ spot_id: id })
      .select()
      .single();

    if (error) {
      console.error('Error adding to favorites:', error);
    } else {
      console.log('Added spot to favorites:', data?.spot_id);
    }
  },

  removeFavorite: async (id: string) => {
    // Remove spot from favorites table
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('spot_id', id)
      .select()
      .single();

    if (error) {
      console.error('Error removing from favorites:', error);
    } else {
      console.log('Removed spot from favorites:', data?.spot_id);
    }
  },

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  searchSpot: async (selectedTags: PublicTagsRow[]) => {
    const { searchQuery } = get();

    // Fetch spots from the database
    set({ searchLoading: true });
    try {
      // Fetch spots with their tags and media
      const { data: spots_data, error: spots_error } = await supabase
        .from('spots_with_details')
        .select()
        .contains('tags', JSON.stringify(selectedTags))
        .or(`title.ilike.%${searchQuery}%, body.ilike.%${searchQuery}%`)
        .limit(10);

      if (spots_error) {
        console.error('Error searching spots:', spots_error);
        return;
      }

      console.log('Fetched search query spots');
      set({ searchResults: spots_data });
    } catch (error) {
      console.error('Error in searchSpot:', error);
    } finally {
      set({ searchLoading: false });
    }
  },

  fetchSpot: async (id: string) => {
    set({ spotLoading: true });
    try {
      // Fetch the spot details from the database
      const { data: spot, error } = await supabase
        .from('spots_with_details')
        .select()
        .eq('id', id as string)
        .single();

      // If Supabase returns an error or no data, throw an error
      if (error || !spot) {
        const errorMessage = error ? error.message : `Spot with id ${id} not found.`;
        console.error('Error fetching spot:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`Fetched spot ${id}`);
      set({ spot: spot as PublicSpotsWithDetailsRowSchema });
    } catch (error) {
      console.error('Error in fetchSpot:', error);
      set({ spot: null });
      throw error;
    } finally {
      set({ spotLoading: false });
    }
  },

  fetchSpots: async () => {
    // Fetch spots from the database
    set({ spotsLoading: true });
    try {
      // Fetch spots with their tags and media
      const { data: spots_data, error } = await supabase
        .from('spots_with_details')
        .select()
        .limit(20)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching spots:', error);
        return;
      }

      set({ spots: spots_data });
      console.log('Fetched popular spots');
    } catch (error) {
      console.error('Error in fetchSpots:', error);
    } finally {
      set({ spotsLoading: false });
    }
  },

  fetchFavorites: async (user_id: string) => {
    // Fetch favorites from the database
    set({ favoritesLoading: true });
    try {
      // Fetch favorites for the current user
      const { data: favorites_data, error: favorites_error } = await supabase
        .from('spot_favorites')
        .select()
        .eq('favorited_by_user_id', user_id); // Ensure to filter by the current user

      if (favorites_error) {
        console.error('Error fetching favorites:', favorites_error);
        return;
      }

      set({ favorites: favorites_data });
      console.log('Fetched favorites');
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
    } finally {
      set({ favoritesLoading: false });
    }
  },

  fetchSpotsInRegion: async (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    set({ spotsInRegionLoading: true });
    try {
      const { data: spotsData, error } = await supabase.rpc('spots_in_view', {
        min_lat: bounds.south,
        max_lat: bounds.north,
        min_long: bounds.west,
        max_long: bounds.east,
      });

      if (error) {
        console.error('Error fetching spots in region:', error);
        return;
      }

      set({ spotsInRegion: spotsData });
      console.log('Fetched spots in region');
    } catch (error) {
      console.error('Error in fetchSpotsInRegion:', error);
    } finally {
      set({ spotsInRegionLoading: false });
    }
  },
}));
