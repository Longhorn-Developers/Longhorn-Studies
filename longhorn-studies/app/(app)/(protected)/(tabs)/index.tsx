import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import { Container } from '~/components/Container';
import {
  PublicMediaRowSchema,
  PublicSpotsRowSchema,
  PublicTagsRowSchema,
} from '~/types/schemas_infer';
import { supabase } from '~/utils/supabase';

// Add tags and media to the spot schema
type Spot = PublicSpotsRowSchema & {
  tags: PublicTagsRowSchema[];
  media: PublicMediaRowSchema[];
};

const SpotCard = ({ spot }: { spot: Spot }) => {
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
              <View key={tag.id} className="rounded-full bg-amber-600 px-3 py-1">
                <Text className="text-xs font-medium text-white">{tag.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSpots() {
    setLoading(true);
    try {
      // Fetch spots with their tags and media
      const { data, error } = await supabase
        .from('spots')
        .select(
          `
          *,
          tags:spot_tags(
            tag:tags(*)
          ),
          media:media(*)
        `
        )
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching spots:', error);
        return;
      }

      // Transform the data to match our Spot type
      const spotsWithTags = data.map((spot) => {
        return {
          ...spot,
          tags: spot.tags ? spot.tags.map((st: any) => st.tag).filter(Boolean) : [],
          media: spot.media ? spot.media.filter(Boolean) : [],
        };
      });

      console.log('Fetched spots:', JSON.stringify(spotsWithTags, null, 2));

      setSpots(spotsWithTags);
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
      <View className="flex-1">
        <Text className="text-2xl font-bold text-gray-800">Study Spots</Text>

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={!loading}
          shimmerStyle={{ borderRadius: 10 }}
          contentStyle={{ width: '100%', height: '100%' }}>
          <FlashList
            data={spots}
            renderItem={({ item }: any) => <SpotCard spot={item} />}
            estimatedItemSize={50}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            onRefresh={() => {
              fetchSpots();
            }}
            refreshing={loading}
          />
        </ShimmerPlaceHolder>
      </View>
    </Container>
  );
}
