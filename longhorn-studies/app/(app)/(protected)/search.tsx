import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import Searchbox from '~/components/Searchbox';
import TagSelector from '~/components/TagSelector';

const Search = () => {
  return (
    <Container>
      <View className="gap-4">
        <Searchbox sharedTag="explore-search" />
        {/* Trending Tags */}
        <View className="flex">
          <View className="mb-2 flex-row items-center gap-2">
            <Ionicons name="trending-up" size={20} color="gray" />
            <Text className="text-lg font-semibold">Trending Tags</Text>
          </View>
          <TagSelector />
        </View>

        {/* Trending Posts */}
        <View className="flex">
          <View className="mb-2 flex-row items-center gap-2">
            <Ionicons name="stats-chart" size={20} color="gray" />
            <Text className="text-lg font-semibold">Popular Spots</Text>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default Search;
