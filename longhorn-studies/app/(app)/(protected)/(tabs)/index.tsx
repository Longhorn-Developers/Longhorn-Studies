import { Entypo } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Pressable, Image } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import {
  PublicSpotsWithDetailsRowSchema,
  PublicTagsRowSchema,
  PublicMediaRowSchema,
} from '~/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const SpotCard = ({ spot }: { spot: PublicSpotsWithDetailsRowSchema }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the spot has media and if so, fetch the first image
  useEffect(() => {
    const fetchImage = async () => {
      // Cast Json[] to PublicMediaRowSchema[]
      let media;
      try {
        media = spot.media as PublicMediaRowSchema[];
      } catch (error) {
        console.error('Error casting media:', error);
        setIsLoading(false);
        return;
      }

      // Check if media is empty
      if (!media || media.length === 0) {
        setIsLoading(false);
        return;
      }

      // Get the media with position 0 or the first media item
      const mediaItem = media.find((m) => m && m && m.position === 0) || media[0];

      supabase.storage
        .from('media')
        .download(mediaItem.storage_key)
        .then(({ data }) => {
          const fr = new FileReader();
          fr.readAsText(data!);
          fr.onload = () => {
            const result = `data:${data?.type};base64,${fr.result as string}`;
            setImage(result);
            setIsLoading(false);
          };
          fr.onerror = (error) => {
            console.error('Error reading file:', error);
            setIsLoading(false);
          };
        });
    };

    fetchImage();
  }, []);

  // Check if the spot has tags
  let tags;
  try {
    tags = spot.tags as PublicTagsRowSchema[];
  } catch (error) {
    console.error('Error casting tags:', error);
    return;
  }

  return (
    <Pressable className="my-2 flex-row items-center gap-4 rounded-xl border border-gray-200 px-5 py-3">
      <View>
        {spot.media ? (
          <View>
            {/* Loading shimmer placeholder */}
            {isLoading ? (
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={{ height: 80, width: 80, borderRadius: 12 }}
              />
            ) : // Display the image if available
            image ? (
              <Image
                style={{ height: 80, width: 80 }}
                source={{ uri: image }}
                className="rounded-xl"
              />
            ) : (
              <View
                style={{ height: 80, width: 80 }}
                className="items-center justify-center rounded-xl bg-gray-200">
                <Entypo name="image" size={18} />
              </View>
            )}
          </View>
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-xl bg-gray-200" />
        )}
      </View>

      <View>
        <Text className="text-lg font-bold text-gray-900">{spot.title}</Text>

        {spot.body && (
          <Text className="mt-1 text-gray-600" numberOfLines={2}>
            {spot.body}
          </Text>
        )}

        {tags && tags.length > 0 && (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {tags.map((tag) => (
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

export default function Explore() {
  const [spots, setSpots] = useState<PublicSpotsWithDetailsRowSchema[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSpots() {
    setLoading(true);
    try {
      // Fetch spots with their tags and media
      const { data, error } = await supabase
        .from('spots_with_details')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching spots:', error);
        return;
      }

      setSpots(data);
      console.log('Explore fetched spots');
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
