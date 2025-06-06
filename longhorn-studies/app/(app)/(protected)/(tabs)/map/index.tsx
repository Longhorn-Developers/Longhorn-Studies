import { AppleMaps, GoogleMaps } from 'expo-maps';
import { AppleMapsMarker } from 'expo-maps/build/apple/AppleMaps.types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';

import SpotCard from '~/components/SpotCard';
import { PublicSpotsWithDetailsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';
import { supabase } from '~/utils/supabase';

export default function Home() {
  const [spots, setSpots] = useState<PublicSpotsWithDetailsRowSchema[] | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<PublicSpotsWithDetailsRowSchema | null>(null);

  // Fetch spots from Supabase whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchSpots = async () => {
        const { data, error } = await supabase.from('spots_with_details').select();

        if (error) {
          console.error('Error fetching spots:', error);
          return;
        }

        if (data) {
          console.log('Map fetched spots');
          setSpots(data);
        }
      };

      fetchSpots();
    }, [])
  );

  const handleMarkerClick = (marker: AppleMapsMarker) => {
    const spot = spots?.find((s) => s.id === marker.id);
    if (spot) {
      setSelectedSpot(spot);
    }
  };

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
          onMapClick={() => setSelectedSpot(null)}
        />
      ) : (
        <GoogleMaps.View style={{ flex: 1 }} />
      )}

      {/* Spot Card Overlay */}
      {selectedSpot && (
        <View className="absolute bottom-2 left-8 right-8 shadow-lg">
          <SpotCard spot={selectedSpot} favorited={false} />
        </View>
      )}
    </View>
  );
}
