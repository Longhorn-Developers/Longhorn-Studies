import { Entypo } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import SpotCard from '~/components/SpotCard';
import SpotIcon from '~/components/SpotIcon';
import { useAuth } from '~/store/AuthProvider';
import {
  PublicSpotsWithDetailsRowSchema,
  PublicSpotFavoritesRowSchema,
} from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

export default function Explore() {
  const { user } = useAuth();

  const [spots, setSpots] = useState<PublicSpotsWithDetailsRowSchema[]>([]);
  const [favorites, setFavorites] = useState<PublicSpotFavoritesRowSchema[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSpots() {
    // Fetch spots from the database
    setLoading(true);
    try {
      // Fetch spots with their tags and media
      const { data: spots_data, error: spots_error } = await supabase
        .from('spots_with_details')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (spots_error) {
        console.error('Error fetching spots:', spots_error);
        return;
      }

      // Fetch favorites for the current user
      const { data: favorites_data, error: favorites_error } = await supabase
        .from('spot_favorites')
        .select('*')
        .eq('user_id', user!.id) // Ensure to filter by the current user
        .order('created_at', { ascending: false });

      if (favorites_error) {
        console.error('Error fetching favorites:', favorites_error);
        return;
      }

      setFavorites(favorites_data);
      setSpots(spots_data);
      console.log('Explore fetched spots and favorites');
    } catch (error) {
      console.error('Error in fetchSpots:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSpots();
  }, []);

  return (
    <Container>
      {/* Spot Explorer */}
      <View className="flex-1 gap-8">
        {/* Favorite Spots List */}
        <View>
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-800">Your Favorites</Text>
            {/* <Link href="/favorites" asChild> */}
            <Text className="font-bold text-amber-600">see all</Text>
            {/* </Link> */}
          </View>

          {/* Favorites Horizontal List */}
          <View className="mt-4">
            <FlashList
              data={[{ id: 'add-button' }, ...favorites.slice(0, 4)]}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={10}
              renderItem={({ item }: { item: PublicSpotFavoritesRowSchema }) => {
                if (item.id === 'add-button') {
                  return (
                    // <Link href="/favorites/add" asChild>
                    <View className="mr-4 h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
                      <Entypo name="plus" size={28} color="#9CA3AF" />
                    </View>
                    // </Link>
                  );
                }

                return <SpotIcon spot={item} />;
              }}
            />
          </View>
        </View>

        {/* Study Spots List */}
        <View>
          {/* Header */}
          <Text className="text-2xl font-bold text-gray-800">Spots For You</Text>
          {/* Spots List */}
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            visible={!loading}
            shimmerStyle={{ borderRadius: 10 }}
            contentStyle={{ width: '100%', height: '100%' }}>
            <FlashList
              data={spots}
              renderItem={({ item }: any) => (
                <SpotCard spot={item} favorited={favorites.some((fav) => fav.id === item.id)} />
              )}
              estimatedItemSize={20}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              onRefresh={() => {
                fetchSpots();
              }}
              refreshing={loading}
              ListEmptyComponent={
                <View className="mt-5 items-center justify-center">
                  <Text className="text-gray-500">No spots found</Text>
                </View>
              }
            />
          </ShimmerPlaceHolder>
        </View>
      </View>

      {/* Floating New Spot Button */}
      <Link href="/create-spot" asChild>
        <Button
          title="New Spot"
          icon={<Entypo name="plus" size={18} color="white" />}
          iconPosition="left"
          className="absolute bottom-1 right-1 h-12 w-28 justify-center"
          size="small"
        />
      </Link>
    </Container>
  );
}
