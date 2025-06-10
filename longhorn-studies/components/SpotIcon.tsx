import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import {
  PublicMediaRowSchema,
  PublicSpotsWithDetailsRowSchema,
} from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const SpotIcon = ({ spot }: { spot: PublicSpotsWithDetailsRowSchema }) => {
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
    <Link
      href={{
        pathname: '/spot/[id]',
        params: { id: spot.id as string },
      }}
      className="mr-4 rounded-xl">
      {/* Spot Image Preview */}
      {isLoading ? (
        // Loading shimmer placeholder
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{ height: 70, width: 70, borderRadius: 12 }}
        />
      ) : (
        // Display the image with gradient overlay and title
        <View className="relative overflow-hidden rounded-xl">
          <ImageBackground
            style={{ height: 70, width: 70 }}
            source={{ uri: image ? image : undefined }}
            imageStyle={{ borderRadius: 12 }}>
            {/* Gradient overlay */}
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={{ height: 70 }} />
            {/* Spot title */}
            <Text className="absolute bottom-0 px-2 pb-1 font-bold text-white" numberOfLines={1}>
              {spot.title}
            </Text>
          </ImageBackground>
        </View>
      )}
    </Link>
  );
};

export default SpotIcon;
