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
  const { spots } = useSpotsStore();
  const [selectedSpot, setSelectedSpot] = useState<PublicSpotsWithDetailsRowSchema | null>(null);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 30.285,
    longitude: -97.739,
    zoom: 14.5,
  });

  // Animation values
  const translateY = useSharedValue(300);

  const fetchSpotsInRegion = async (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    // min_longitude, min_latitude, max_longitude, max_latitude

    // min_longitude: The westernmost longitude of your bounding box.
    // min_latitude: The southernmost latitude of your bounding box.
    // max_longitude: The easternmost longitude of your bounding box.
    // max_latitude: The northernmost latitude of your bounding box.

    // gis.ST_Point(min_long, min_lat), gis.ST_Point(max_long, max_lat)
    console.log(
      `gis.ST_Point(${bounds.west}, ${bounds.south}), gis.ST_Point(${bounds.east}, ${bounds.north})`
    );
  };

  const fetchSpotsInCurrentRegion = () => {
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
  };

  const handleCameraMove = (event: any) => {
    setCurrentRegion({
      latitude: event.coordinates.latitude,
      longitude: event.coordinates.longitude,
      zoom: event.zoom || currentRegion.zoom,
    });
    fetchSpotsInCurrentRegion();
  };

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
          cameraPosition={{
            coordinates: {
              latitude: currentRegion.latitude,
              longitude: currentRegion.longitude,
            },
            zoom: currentRegion.zoom,
          }}
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
