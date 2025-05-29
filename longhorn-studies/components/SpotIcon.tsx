import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Pressable, Image, Text, ImageBackground } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import {
  PublicMediaRowSchema,
  PublicSpotFavoritesRowSchema,
} from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const SpotIcon = ({ spot }: { spot: PublicSpotFavoritesRowSchema }) => {
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

  return (
    <Pressable className="mr-4 rounded-xl">
      {/* Spot Image Preview */}
      {spot.media ? (
        <View>
          {isLoading ? (
            // Loading shimmer placeholder
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ height: 70, width: 70, borderRadius: 12 }}
            />
          ) : image ? (
            // Display the image with gradient overlay and title
            <View className="relative overflow-hidden rounded-xl">
              <ImageBackground
                style={{ height: 70, width: 70 }}
                source={{ uri: image }}
                imageStyle={{ borderRadius: 12 }}>
                {/* Gradient overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 35,
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}
                />
                {/* Spot title */}
                <Text
                  className="absolute bottom-0 px-2 pb-1 font-bold text-white"
                  numberOfLines={1}>
                  {spot.title}
                </Text>
              </ImageBackground>
            </View>
          ) : (
            //  Fallback icon if no image is available
            <View
              style={{ height: 70, width: 70 }}
              className="items-center justify-center rounded-xl bg-gray-200">
              {/* Gradient overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 35,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              />

              <Text
                className="absolute bottom-0 left-2 pb-1 font-bold text-white"
                numberOfLines={1}>
                {spot.title}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View className="h-20 w-20 items-center justify-center rounded-xl bg-gray-200">
          <Text className="mt-1 px-2 text-center text-xs" numberOfLines={1}>
            {spot.title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default SpotIcon;
