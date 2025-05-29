import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';

import { Container } from '~/components/Container';
import SpotCard from '~/components/SpotCard';
import { useAuth } from '~/store/AuthProvider';
import {
  PublicSpotsWithDetailsRowSchema,
  PublicSpotFavoritesRowSchema,
} from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const Favorites = () => {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<PublicSpotFavoritesRowSchema[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  async function fetchFavorites() {
    // Fetch favorites from the database
    setFavoritesLoading(true);
    try {
      // Fetch favorites for the current user
      const { data: favorites_data, error: favorites_error } = await supabase
        .from('spot_favorites')
        .select()
        .eq('user_id', user!.id); // Ensure to filter by the current user

      if (favorites_error) {
        console.error('Error fetching favorites:', favorites_error);
        return;
      }

      setFavorites(favorites_data);
      console.log('Explore fetched favorites');
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <Container>
      {/* Favorite Spots List */}
      <FlashList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={favorites}
        estimatedItemSize={10}
        renderItem={({ item }: { item: PublicSpotsWithDetailsRowSchema }) => {
          return <SpotCard favorited spot={item} />;
        }}
        onRefresh={fetchFavorites}
        refreshing={favoritesLoading}
      />
    </Container>
  );
};

export default Favorites;
