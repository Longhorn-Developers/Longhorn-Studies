import { createWithEqualityFn } from 'zustand/traditional';

import {
  PublicSpotsRowSchema,
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

  // Actions
  addSpot: (spot: PublicSpotsRowSchema) => void;
  fetchSpot: (id: string) => Promise<void>;
  fetchSpots: () => Promise<void>;
  fetchFavorites: (user_id: string) => Promise<void>;
};

export const useSpotsStore = createWithEqualityFn<SpotsState>((set, get) => ({
  spot: null,
  spotLoading: false,

  spots: [],
  spotsLoading: false,

  favorites: [],
  favoritesLoading: false,

  addSpot: (spot: PublicSpotsRowSchema) => {
    // const { selectedTags } = get();
    // set({ selectedTags: [...selectedTags, tag] });
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
      console.log('Spots fetched');
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
        .eq('user_id', user_id); // Ensure to filter by the current user

      if (favorites_error) {
        console.error('Error fetching favorites:', favorites_error);
        return;
      }

      set({ favorites: favorites_data });
      console.log('Favorites fetched');
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
    } finally {
      set({ favoritesLoading: false });
    }
  },
}));
