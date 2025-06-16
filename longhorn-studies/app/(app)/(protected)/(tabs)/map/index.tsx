import { AppleMaps, GoogleMaps } from 'expo-maps';
import { AppleMapsMarker } from 'expo-maps/build/apple/AppleMaps.types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import SpotCard from '~/components/SpotCard';
import { useSpotsStore } from '~/store/SpotsStore';
import { PublicSpotsWithDetailsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';

export default function Map() {
  const { spots, fetchSpots } = useSpotsStore();
  const [selectedSpot, setSelectedSpot] = useState<PublicSpotsWithDetailsRowSchema | null>(null);

  // Animation values
  const translateY = useSharedValue(300);

  // Fetch spots from Supabase whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSpots();
    }, [])
  );

  const handleMarkerClick = (marker: AppleMapsMarker) => {
    const spot = spots?.find((s) => s.id === marker.id);
    if (spot) {
      setSelectedSpot(spot);
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
    }
  };

  const handleMapClick = () => {
    // Clear selectedspot
    translateY.value = withTiming(300, { duration: 250 });
  };

  useEffect(() => {
    if (!selectedSpot) {
      translateY.value = 300;
    }
  }, [selectedSpot]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          style={{ flex: 1 }}
          cameraPosition={{ coordinates: { latitude: 30.285, longitude: -97.739 }, zoom: 14.5 }}
          markers={
            spots
              ? spots.map<AppleMapsMarker>((spot) => ({
                  id: spot.id ?? '',
                  title: spot.title ?? '',
                  tintColor: '#ff7603',
                  systemImage: 'bookmark.fill',
                  coordinates: {
                    latitude: spot.latitude ?? undefined,
                    longitude: spot.longitude ?? undefined,
                  },
                }))
              : undefined
          }
          onMarkerClick={handleMarkerClick}
          onMapClick={handleMapClick}
        />
      ) : (
        <GoogleMaps.View style={{ flex: 1 }} />
      )}

      {/* Animated Spot Card Overlay */}
      {selectedSpot && (
        <Animated.View className="absolute bottom-2 left-8 right-8 shadow-lg" style={animatedStyle}>
          <SpotCard spot={selectedSpot} favorited={false} />
        </Animated.View>
      )}
    </View>
  );
}
