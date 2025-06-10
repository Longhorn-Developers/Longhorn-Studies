import * as Linking from 'expo-linking';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Carousel from '~/components/Carousel';
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
    return (
      <View className="flex-1 justify-center bg-white">
        <ActivityIndicator size="large" color="#ff7603" />
      </View>
    );
  }

  if (!spot) {
    return (
      <View className="flex-1 justify-center bg-white px-8">
        <Text className="text-lg font-semibold text-gray-800">Spot not found</Text>
        <Text className="text-sm font-medium text-gray-400">
          The spot you are looking for does not exist or has been removed.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 20, justifyContent: 'space-between' }}>
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

      {/* Main body of items */}
      <View className="gap-4 p-6">
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
          <Pressable
            onPress={() => {
              // Handle navigation to maps or directions
              Linking.openURL(
                Platform.select({
                  ios: `maps://?q=${spot.latitude},${spot.longitude}`,
                  android: `geo:${spot.latitude},${spot.longitude}?q=${spot.latitude},${spot.longitude}`,
                }) || ''
              );
            }}>
            {/* Uninteractable map */}
            <View className="flex h-64 items-center justify-center rounded-xl" pointerEvents="none">
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
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Spot;
