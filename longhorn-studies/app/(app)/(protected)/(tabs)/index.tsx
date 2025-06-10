import { Entypo, Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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

  const [spotsLoading, setSpotsLoading] = useState(true);
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

  async function fetchSpots() {
    // Fetch spots from the database
    setSpotsLoading(true);
    try {
      // Fetch spots with their tags and media
      const { data: spots_data, error: spots_error } = await supabase
        .from('spots_with_details')
        .select()
        .limit(20)
        .order('created_at', { ascending: true });

      if (spots_error) {
        console.error('Error fetching spots:', spots_error);
        return;
      }

      setSpots(spots_data);
      console.log('Explore fetched spots');
    } catch (error) {
      console.error('Error in fetchSpots:', error);
    } finally {
      setSpotsLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
    fetchSpots();
  }, []);

  return (
    <Container>
      {/* Spot Explorer */}
      <View className="flex-1 gap-4">
        {/* Search box placeholder transition */}
        <Link href="/search" asChild>
          <Pressable>
            <View
              // sharedTransitionTag="explore-search"
              className="flex-row items-center rounded-xl border border-gray-300 px-3">
              <Ionicons name="search" size={20} color="gray" />
              <Text className="flex-1 p-4 text-gray-300">Explore study spots</Text>
            </View>
          </Pressable>
        </Link>

        {/* Favorites List */}
        <View>
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-800">Your Favorites</Text>
            <Link href="/favorites" asChild>
              <Text className="font-bold text-amber-600">see all</Text>
            </Link>
          </View>

          {/* Favorites Horizontal List */}
          <View className="mt-4">
            <FlashList
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={[{ id: 'add-button' }, ...favorites]}
              estimatedItemSize={10}
              renderItem={({ item }: { item: any }) => {
                if (item.id === 'add-button') {
                  return (
                    <Link href="/search" asChild>
                      <Pressable className="mr-4 h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
                        <Entypo name="plus" size={24} color="gray" />
                      </Pressable>
                    </Link>
                  );
                }

                return <SpotIcon spot={item as PublicSpotsWithDetailsRowSchema} />;
              }}
              onRefresh={fetchFavorites}
              refreshing={favoritesLoading}
            />
          </View>
        </View>

        {/* Spots List */}
        <View className="flex-1">
          {/* Header */}
          <Text className="text-2xl font-bold text-gray-800">Spots For You</Text>
          {/* Spots List */}
          <FlashList
            data={spots}
            renderItem={({ item }: any) => (
              <SpotCard spot={item} favorited={favorites.some((fav) => fav.id === item.id)} />
            )}
            estimatedItemSize={20}
            showsVerticalScrollIndicator={false}
            className="mt-2"
            // TODO: Fix bottom pad with useBottomTabBarHeight when using with shimmer placeholder
            // not supported in expo??? https://github.com/expo/expo/discussions/26714
            // contentContainerStyle={{ paddingBottom: 200 }}
            onRefresh={fetchSpots}
            refreshing={spotsLoading}
            ListEmptyComponent={
              <View className="mt-5 items-center justify-center">
                <Text className="text-gray-500">No spots found</Text>
              </View>
            }
          />
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
