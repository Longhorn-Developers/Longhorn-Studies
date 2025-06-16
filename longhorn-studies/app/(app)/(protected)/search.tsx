import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import SpotCard from '~/components/SpotCard';
import TagSearch from '~/components/TagSearch';
import { useSpotsStore } from '~/store/SpotsStore';
import { useTagStore } from '~/store/TagStore';

const Search = () => {
  const router = useRouter();
  const { searchQuery, searchLoading, searchResults, searchSpot } = useSpotsStore();
  const { selectedTags, resetTags } = useTagStore();

  // Debounce the search query to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length <= 0 && selectedTags.length <= 0) {
        return;
      }
      searchSpot(selectedTags);
    }, 300); // Adjust the debounce time as needed

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags]);

  useEffect(() => {
    return () => resetTags();
  }, []);

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
            data={searchResults}
            renderItem={({ item }: any) => <SpotCard spot={item} favorited={false} />}
            estimatedItemSize={10}
            showsVerticalScrollIndicator={false}
            refreshing={searchLoading}
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
