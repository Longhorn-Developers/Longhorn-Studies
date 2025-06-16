import { Entypo, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Pressable, Image } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import { useAuth } from '~/store/AuthProvider';
import { useSpotsStore } from '~/store/SpotsStore';
import {
  PublicSpotsWithDetailsRowSchema,
  PublicTagsRowSchema,
  PublicMediaRowSchema,
} from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const SpotCard = ({ spot }: { spot: PublicSpotsWithDetailsRowSchema }) => {
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite, fetchFavorites } = useSpotsStore();

  const [image, setImage] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the spot has media and if so, fetch the first image
  useEffect(() => {
    const fetchImage = async () => {
      // Cast Json[] to PublicMediaRowSchema[]
      let media;
      try {
        media = spot.media as PublicMediaRowSchema[];
      } catch (error) {
        console.error('Error casting media type:', error);
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

  useEffect(() => {
    setIsFavorited(favorites.some((favs) => favs.id === spot.id));
  }, [favorites]);

  const toggleFavorited = async () => {
    if (!spot.id) return;

    if (!isFavorited) {
      // From unfavorited to favorite
      await addFavorite(spot.id);
    } else {
      // From favorite to unfavorited
      await removeFavorite(spot.id);
    }

    setIsFavorited(!isFavorited);
    fetchFavorites(user!.id);
  };

  // Check if the spot has tags
  let tags;
  try {
    tags = spot.tags as PublicTagsRowSchema[];
  } catch (error) {
    console.error('Error casting tags:', error);
    return;
  }

  return (
    <Link
      href={{
        pathname: '/spot/[id]',
        params: { id: spot.id as string },
      }}
      className="mb-4">
      <View className="my-2 flex-row items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3">
        {/* Favorite Button */}
        <Pressable onPress={toggleFavorited} className="absolute right-4 top-4">
          <FontAwesome
            name={isFavorited ? 'star' : 'star-o'}
            size={22}
            color={isFavorited ? '#d97706' : '#6b7280'}
          />
        </Pressable>

        {/* Spot Image Preview */}
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

        {/* Spot Details */}
        <View className="flex-1">
          {/* Title row with favorite button */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">{spot.title}</Text>
          </View>

          {/* Spot Body */}
          {spot.body && (
            <Text className="mt-1 text-gray-600" numberOfLines={2}>
              {spot.body}
            </Text>
          )}

          {/* Tags */}
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
      </View>
    </Link>
  );
};

export default SpotCard;
