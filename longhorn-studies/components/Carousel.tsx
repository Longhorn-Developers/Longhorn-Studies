import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { FlatList, Image, View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import {
  PublicMediaRowSchema,
  PublicSpotsWithDetailsRowSchema,
} from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

interface CarouselProps {
  spot: PublicSpotsWithDetailsRowSchema;
  height?: number;
}

const Carousel = ({ spot, height = 300 }: CarouselProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      // Cast Json[] to PublicMediaRowSchema[]
      let media: PublicMediaRowSchema[];
      try {
        media = (spot.media as PublicMediaRowSchema[]) || [];
      } catch (error) {
        console.error('Error casting media:', error);
        setIsLoading(false);
        return;
      }

      // Filter for image media only and sort by position
      const imageMedia = media.sort((a, b) => (a.position || 0) - (b.position || 0));

      // Check if there are any images
      if (!imageMedia || imageMedia.length === 0) {
        setIsLoading(false);
        return;
      }

      // Download all images
      try {
        //   Use Promise.all to handle multiple downloads concurrently
        const imagePromises = imageMedia.map(async (mediaItem) => {
          const { data, error } = await supabase.storage
            .from('media')
            .download(mediaItem.storage_key);

          if (error) {
            console.error('Error downloading image:', error);
            return null;
          }

          return new Promise<string>((resolve, reject) => {
            const fr = new FileReader();
            fr.readAsText(data);
            fr.onload = () => {
              const result = `data:${data?.type};base64,${fr.result as string}`;
              resolve(result);
            };
            fr.onerror = reject;
          });
        });

        const downloadedImages = await Promise.all(imagePromises);
        const validImages = downloadedImages.filter((img): img is string => img !== null);

        setImages(validImages);
      } catch (error) {
        console.error('Error processing images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [spot.media]);

  const renderImage = ({ item }: { item: string }) => (
    <>
      <Image source={{ uri: item }} style={{ height }} className="w-screen" />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)']}
        style={StyleSheet.absoluteFill}
      />
    </>
  );

  // Render pagination indicators (dots)
  const renderPagination = () => (
    <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
      {images.map((_, index) => (
        <View key={index} className="mx-1 h-2 w-2 rounded-full bg-white/70" />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ height }} className="items-center justify-center bg-gray-200">
        <ActivityIndicator size="large" color="#ff7603" />
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={{ height }} className="items-center justify-center bg-gray-200">
        <Text className="text-gray-500">No images available</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        snapToAlignment="center"
        decelerationRate="fast"
      />
      {images.length > 1 && renderPagination()}
    </View>
  );
};

export default Carousel;
