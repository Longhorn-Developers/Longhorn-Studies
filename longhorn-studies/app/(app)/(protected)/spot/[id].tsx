import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text } from 'react-native';

import { PublicSpotsWithDetailsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';
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

  return <Text>{spot.id}</Text>;
};

export default Spot;
