import { AppleMaps, GoogleMaps } from 'expo-maps';
import { AppleMapsMarker } from 'expo-maps/build/apple/AppleMaps.types';
import { useState, useEffect } from 'react';
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
  const { spotsInRegion, spotsInRegionLoading, fetchSpotsInRegion } = useSpotsStore();
  const [selectedSpot, setSelectedSpot] = useState<PublicSpotsWithDetailsRowSchema | null>(null);
  const [currentRegion, setCurrentRegion] = useState({
    // Default region centered on UT Austin
    latitude: 30.285,
    longitude: -97.739,
    zoom: 14.5,
  });

  // Animation values
  const translateY = useSharedValue(300);

  const handleCameraMove = (event: any) => {
    setCurrentRegion({
      latitude: event.coordinates.latitude,
      longitude: event.coordinates.longitude,
      zoom: event.zoom,
    });
  };

  // Convert current region to bounding box and fetch spots
  useEffect(() => {
    // Calculate bounding box based on current region and zoom
    const { latitude, longitude, zoom } = currentRegion;

    // Approximate meters per degree at different zoom levels
    const metersPerPixel =
      (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
    const mapWidthInMeters = 375 * metersPerPixel; // Assuming ~375px map width
    const mapHeightInMeters = 667 * metersPerPixel; // Assuming ~667px map height

    // Convert to lat/lng degrees (rough approximation)
    const latDelta = mapHeightInMeters / 111320; // 1 degree lat ≈ 111,320 meters
    const lngDelta = mapWidthInMeters / (111320 * Math.cos((latitude * Math.PI) / 180));

    const bounds = {
      north: latitude + latDelta / 2,
      south: latitude - latDelta / 2,
      east: longitude + lngDelta / 2,
      west: longitude - lngDelta / 2,
    };

    fetchSpotsInRegion(bounds);
  }, [currentRegion]);

  const handleMarkerClick = (marker: AppleMapsMarker) => {
    const spot = spotsInRegion?.find((s) => s.id === marker.id);
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
          cameraPosition={{
            coordinates: {
              latitude: currentRegion.latitude,
              longitude: currentRegion.longitude,
            },
            zoom: currentRegion.zoom,
          }}
          markers={
            spotsInRegion && !spotsInRegionLoading
              ? spotsInRegion.map<AppleMapsMarker>((spot) => ({
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
          onCameraMove={handleCameraMove}
        />
      ) : (
        <GoogleMaps.View style={{ flex: 1 }} />
      )}

      {/* Animated Spot Card Overlay */}
      {selectedSpot && (
        <Animated.View className="absolute bottom-2 left-8 right-8 shadow-lg" style={animatedStyle}>
          <SpotCard spot={selectedSpot} />
        </Animated.View>
      )}
    </View>
  );
}
