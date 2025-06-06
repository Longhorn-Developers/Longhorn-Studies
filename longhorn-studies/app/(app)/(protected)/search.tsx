import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import SpotCard from '~/components/SpotCard';
import TagSearch from '~/components/TagSearch';
import { useTagStore } from '~/store/TagStore';
import { PublicSpotsWithDetailsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const Search = () => {
  const router = useRouter();
  const { searchQuery, selectedTags } = useTagStore();

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
        .contains('tags', JSON.stringify(selectedTags))
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
      if (searchQuery.length <= 0 && selectedTags.length <= 0) {
        return;
      }
      fetchSpots();
    }, 300); // Adjust the debounce time as needed

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags]);

  return (
    <Container>
      <View className="flex h-full">
        <TagSearch
          leftIcon={
            <Ionicons
              className="pl-3"
              name="arrow-back"
              size={20}
              color="gray"
              onPress={router.back}
            />
          }
          placeholder="Search for spots, tags, or location..."
          addTagEnabled={false}
          showTrendingTags={selectedTags.length <= 0 && searchQuery.length <= 0}
          autoFocus
        />

        {/* Spots Lists */}
        {searchQuery.length <= 0 && selectedTags.length <= 0 ? (
          // Popular Spots
          <View className="mb-2 mt-4 flex-row items-center gap-2">
            <Ionicons name="stats-chart" size={16} color="gray" />
            <Text className="text-sm font-bold">Popular Spots</Text>
          </View>
        ) : (
          // Search Query Spot Results
          <FlashList
            data={spots}
            renderItem={({ item }: any) => <SpotCard spot={item} favorited={false} />}
            estimatedItemSize={10}
            showsVerticalScrollIndicator={false}
            refreshing={spotsLoading}
            ListEmptyComponent={
              <View className="items-center justify-center">
                <Text className="text-gray-500">No spots found</Text>
              </View>
            }
          />
        )}
      </View>
    </Container>
  );
};

export default Search;
