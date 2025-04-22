import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Pressable } from 'react-native';

import { Container } from '~/components/Container';
import { PublicSpotsRowSchema, PublicTagsRowSchema } from '~/types/schemas_infer';
import { supabase } from '~/utils/supabase';

type SpotWithTags = PublicSpotsRowSchema & {
  tags: PublicTagsRowSchema[];
};

const SpotCard = ({ spot }: { spot: SpotWithTags }) => {
  return (
    <Pressable className="my-2 flex-row items-center gap-4 rounded-xl border border-gray-200 px-5 py-3">
      <View>
        <View className="h-20 w-20 items-center justify-center rounded-xl bg-gray-200" />
      </View>

      <View>
        <Text className="text-lg font-bold text-gray-900">{spot.title}</Text>

        {spot.body && (
          <Text className="mt-1 text-gray-600" numberOfLines={2}>
            {spot.body}
          </Text>
        )}

        {spot.tags && spot.tags.length > 0 && (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {spot.tags.map((tag) => (
              <View key={tag.id} className="rounded-full bg-amber-100 px-3 py-1">
                <Text className="text-xs font-medium text-amber-800">{tag.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default function Home() {
  const [spots, setSpots] = useState<SpotWithTags[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpots() {
      setLoading(true);
      try {
        // Fetch spots with their tags
        const { data, error } = await supabase
          .from('spots')
          .select(
            `
            *,
            tags:spot_tags(
              tag:tags(*)
            )
          `
          )
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching spots:', error);
          return;
        }

        // Transform the data to match our SpotWithTags type
        const spotsWithTags = data.map((spot) => {
          return {
            ...spot,
            tags: spot.tags ? spot.tags.map((st: any) => st.tag).filter(Boolean) : [],
          };
        });

        setSpots(spotsWithTags);
      } catch (error) {
        console.error('Error in fetchSpots:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpots();
  }, []);

  if (loading) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#d97706" />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View className="flex-1">
        <Text className="mb-4 text-2xl font-bold text-gray-800">Study Spots</Text>

        {spots.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No study spots found</Text>
          </View>
        ) : (
          <FlashList
            data={spots}
            renderItem={({ item }: any) => <SpotCard spot={item} />}
            estimatedItemSize={50}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </Container>
  );
}
