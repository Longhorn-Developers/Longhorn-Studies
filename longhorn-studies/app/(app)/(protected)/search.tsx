import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import Searchbox from '~/components/Searchbox';
import SpotCard from '~/components/SpotCard';
import TagSelector from '~/components/TagSelector';
import { PublicSpotsWithDetailsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';
const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [spots, setSpots] = useState<PublicSpotsWithDetailsRowSchema[]>();
  const [spotsLoading, setSpotsLoading] = useState(true);

  async function fetchSpots() {
    // Fetch spots from the database
    setSpotsLoading(true);
    try {
      // Fetch spots with their tags and media
      const { data: spots_data, error: spots_error } = await supabase
        .from('spots_with_details')
        .select()
        .or(`title.ilike.%${searchQuery}%, body.ilike.%${searchQuery}%`)
        .limit(10);

      if (spots_error) {
        console.error('Error fetching spots:', spots_error);
        return;
      }

      setSpots(spots_data);
      console.log('Search query fetched spots');
    } catch (error) {
      console.error('Error in fetchSpots:', error);
    } finally {
      setSpotsLoading(false);
    }
  }

  // Debounce the search query to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length <= 0) {
        return;
      }
      fetchSpots();
    }, 300); // Adjust the debounce time as needed

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Container>
      <View className="flex gap-4">
        <Searchbox
          placeholder="Search for spots, tags, or location..."
          sharedTag="explore-search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        {/* Trending Tags */}
        <View>
          <View className="mb-2 flex-row items-center gap-2">
            <Ionicons name="trending-up" size={20} color="gray" />
            <Text className="text-lg font-semibold">Trending Tags</Text>
          </View>
          <TagSelector />
        </View>

        {/* Spots Lists */}
        <View className="flex h-full">
          {searchQuery.length <= 0 ? (
            // Popular Spots
            <View className="mb-2 flex-row items-center gap-2">
              <Ionicons name="stats-chart" size={20} color="gray" />
              <Text className="text-lg font-semibold">Popular Spots</Text>
            </View>
          ) : (
            // Search Query Spot Results
            <FlashList
              data={spots}
              renderItem={({ item }: any) => <SpotCard spot={item} favorited={false} />}
              estimatedItemSize={10}
              showsVerticalScrollIndicator={false}
              className="mt-2"
              refreshing={spotsLoading}
              ListEmptyComponent={
                <View className="mt-5 items-center justify-center">
                  <Text className="text-gray-500">No spots found</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Container>
  );
};

export default Search;
