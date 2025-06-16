import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';

import { Container } from '~/components/Container';
import SpotCard from '~/components/SpotCard';
import { useAuth } from '~/store/AuthProvider';
import { useSpotsStore } from '~/store/SpotsStore';
import { PublicSpotsWithDetailsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, fetchFavorites, favoritesLoading } = useSpotsStore();

  useEffect(() => {
    fetchFavorites(user!.id);
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
        onRefresh={() => fetchFavorites(user!.id)}
        refreshing={favoritesLoading}
      />
    </Container>
  );
};

export default Favorites;
