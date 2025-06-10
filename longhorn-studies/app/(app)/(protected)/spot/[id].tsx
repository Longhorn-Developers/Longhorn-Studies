import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '~/components/Button';

import Carousel from '~/components/Carousel';
import { Container } from '~/components/Container';
import {
  PublicSpotsWithDetailsRowSchema,
  PublicTagsRowSchema,
} from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const Spot = () => {
  const { id } = useLocalSearchParams();

  const [spot, setSpot] = useState<PublicSpotsWithDetailsRowSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSpot() {
      setIsLoading(true);
      try {
        // Fetch the spot details from the database
        const { data, error } = await supabase
          .from('spots_with_details')
          .select()
          .eq('id', id as string)
          .single();

        if (error) {
          console.error('Error fetching spot:', error);
          return;
        }

        setSpot(data);
        console.log('Fetched spot');
      } catch (error) {
        console.error('Error in fetchSpot:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpot();
  }, [id]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!spot) {
    return <Text>Spot not found</Text>;
  }

  return (
    <>
      <View>
        {/* Carousel */}
        <Carousel spot={spot} />

        <View className="absolute bottom-4 left-2 p-4">
          {/* Title */}
          <Text className="text-4xl font-bold text-white">{spot.title}</Text>

          {/* Tags */}
          {spot.tags && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {(spot.tags as PublicTagsRowSchema[]).map((tag) => (
                <View key={tag.id} className="rounded-full bg-amber-600 px-3 py-1">
                  <Text className="text-xs font-medium text-white">{tag.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <Container className="justify-between">
        {/* Main body of items */}
        <View className="gap-8">
          {/* Description */}
          <View>
            <Text className="text-lg font-semibold text-gray-800">Description</Text>
            <Text className="text-sm font-medium text-gray-400">
              {spot.body ? (
                spot.body
              ) : (
                <Text className="italic text-gray-500">No description provided</Text>
              )}
            </Text>
          </View>

          {/* Spot Location */}
          <View>
            <Text className="text-lg font-semibold text-gray-800">Location</Text>
            <Text className="mb-2 text-sm font-medium text-gray-400">Press to get directions</Text>
            <View className="flex h-64 items-center justify-center rounded-xl">
              {Platform.OS === 'ios' ? (
                <AppleMaps.View
                  style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 16 }]}
                  cameraPosition={{
                    // Default coordinates for UT
                    coordinates: {
                      latitude: spot.latitude!,
                      longitude: spot.longitude!,
                    },
                    zoom: 18,
                  }}
                  uiSettings={{
                    myLocationButtonEnabled: false,
                    compassEnabled: false,
                    scaleBarEnabled: false,
                    togglePitchEnabled: false,
                  }}
                />
              ) : (
                <GoogleMaps.View style={{ flex: 1 }} />
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons at bottom */}
        <Button title="Get Directions" />
      </Container>
    </>
  );
};

export default Spot;
