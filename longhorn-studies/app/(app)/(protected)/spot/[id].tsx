import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

import { Container } from '~/components/Container';
import {
  PublicMediaRowSchema,
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
    <Container>
      {/* Title */}
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{spot.title}</Text>

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
      {/* Description */}
      <Text style={{ marginVertical: 10 }}>{spot.body}</Text>

      {/* Other info */}
      <Text>Latitude: {spot.latitude}</Text>
      <Text>Longitude: {spot.longitude}</Text>
      <Text>Created at: {new Date(spot.created_at!).toLocaleDateString()}</Text>
      <Text>Updated at: {new Date(spot.updated_at!).toLocaleDateString()}</Text>
      <Text>
        Media:{' '}
        {spot.media
          ? (spot.media as PublicMediaRowSchema[]).map((m) => m.storage_key).join(', ')
          : 'No media'}
      </Text>
    </Container>
  );
};

export default Spot;
