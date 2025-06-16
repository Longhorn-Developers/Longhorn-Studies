import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Share,
} from 'react-native';

import Carousel from '~/components/Carousel';
import { useSpotsStore } from '~/store/SpotsStore';
import { PublicTagsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';

const Spot = () => {
  const { id } = useLocalSearchParams();
  const { spot, fetchSpot, spotLoading } = useSpotsStore();

  useEffect(() => {
    fetchSpot(id as string);
  }, [id]);

  const shareSpot = async () => {
    try {
      await Share.share({
        message: Linking.createURL(`/spot/${id}`),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (spotLoading) {
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

        {/* Title and Tags */}
        <View className="absolute bottom-0 left-2 p-4">
          {/* Title */}
          <Text className="text-4xl font-bold text-white">{spot.title}</Text>

          {/* Tags and Action Buttons */}
          <View className="mt-2 w-full flex-row flex-wrap items-center justify-between">
            {/* Tags */}
            {spot.tags && (
              <View className="flex-row flex-wrap gap-2">
                {(spot.tags as PublicTagsRowSchema[]).map((tag) => (
                  <View key={tag.id} className="rounded-full bg-amber-600 px-3 py-1">
                    <Text className="text-xs font-medium text-white">{tag.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            {/* #d97706 #6b7280 */}
            <View className="flex-row items-center gap-2 pr-3">
              {/* Favorite Button */}
              <Pressable>
                <FontAwesome name="star-o" size={24} color="#d97706" />
              </Pressable>

              {/* Share Button */}
              <Pressable onPress={shareSpot}>
                <Ionicons name="share-outline" size={24} color="#d97706" />
              </Pressable>
            </View>
          </View>
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

        {/* Ratings */}
        <View>
          <Text className="text-lg font-semibold text-gray-800">Ratings</Text>
          <Text className="text-sm font-medium text-gray-400">
            <Text className="italic text-gray-500">No ratings yet. Be the first!</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Spot;
