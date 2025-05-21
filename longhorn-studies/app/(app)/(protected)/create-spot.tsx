import { zodResolver } from '@hookform/resolvers/zod';
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import { AppleMaps, Coordinates, GoogleMaps } from 'expo-maps';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';

import { Container } from '~/components/Container';
import ImageUploader from '~/components/ImageUploader';
import TagSelector from '~/components/TagSelector';
import { useTagStore } from '~/store/TagStore';
import { publicSpotsInsertSchemaSchema } from '~/types/schemas';
import { PublicSpotsInsertSchema, PublicTagsRowSchema } from '~/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const CreateSpot = () => {
  const { selectedTags, resetTags } = useTagStore();
  const [commonTags, setCommonTags] = useState<PublicTagsRowSchema[]>([]);
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const [defaultLocation, setDefaultLocation] = useState<Coordinates>({
    latitude: 30.285,
    longitude: -97.739,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublicSpotsInsertSchema>({
    resolver: zodResolver(publicSpotsInsertSchemaSchema),
  });

  // Fetch common tags on component mount
  useEffect(() => {
    const fetchCommonTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select()
        .order('id', { ascending: true })
        .limit(10);

      if (!error && data) {
        setCommonTags(data);
      }
    };

    fetchCommonTags();

    // Reset tags when component unmounts
    return () => resetTags();
  }, []);

  const handleImagesChange = (newImages: ImagePickerAsset[]) => {
    setImages(newImages);

    // Update selected location based on the first image's EXIF data if present
    if (
      newImages.length > 0 &&
      newImages[0].exif &&
      newImages[0].exif.GPSLatitude &&
      newImages[0].exif.GPSLongitude
    ) {
      // Check if longitude should be negative (western hemisphere)
      // Some cameras store longitude as positive and use GPSLongitudeRef to indicate direction
      let longitude = newImages[0].exif.GPSLongitude;

      // Check for longitude reference or handle specific regions we know should be negative
      if (
        newImages[0].exif.GPSLongitudeRef === 'W' ||
        (longitude > 100 && longitude < 180) // North America western regions
      ) {
        longitude = -Math.abs(longitude);
      }

      setDefaultLocation({
        latitude: newImages[0].exif.GPSLatitude,
        longitude,
      });
    }
  };

  const uploadImagesToSupabase = async (spot_data_id: string) => {
    if (images.length <= 0) return null;

    try {
      // Upload the first image as the main spot image (you can modify this to handle multiple images)
      // Upload each image with its position index
      await Promise.all(
        images.map(async (image, index) => {
          const file_path = `spots/${spot_data_id}/${new Date().getTime()}-${image.fileName}`;
          const base64 = await FileSystem.readAsStringAsync(image.uri, {
            encoding: 'base64',
          });

          const { error } = await supabase.storage
            .from('media')
            .upload(file_path, base64, { contentType: image.mimeType });

          if (error) {
            throw new Error(`Error uploading image: ${error}`);
          }

          await supabase.from('media').insert({
            spot_id: spot_data_id,
            storage_key: file_path,
            position: index,
          });
        })
      );
    } catch (error) {
      console.error('Error in image upload process:', error);
      return null;
    }
  };

  const renderMapUI = () => (
    <View pointerEvents="none">
      {/* Pin Design */}
      <View className="mb-10">
        <View className="items-center">
          {/* Pill text */}
          <View className="items-center justify-center rounded-full bg-white shadow-md">
            <Text className="p-2 text-xs font-semibold">Spot Here</Text>
          </View>

          {/* Pin Pointer */}
          <View className="h-4 w-1 bg-white" style={{ marginTop: -3 }} />
        </View>
      </View>
    </View>
  );

  const onSubmit = async (spot_data: PublicSpotsInsertSchema) => {
    try {
      // Insert the spot
      const { data: spot, error: spotError } = await supabase
        .from('spots')
        .insert({
          ...spot_data,
          // Transform location coordinates to POINT type
          location: `POINT(${spot_data.location.longitude} ${spot_data.location.latitude})`,
        })
        .select()
        .single();

      if (spotError) {
        Alert.alert('Error', 'Failed to save spot. Please try again.');
        console.error('Error inserting data:', spotError);
        return;
      }

      // Spot tag handling
      if (selectedTags.length > 0) {
        // Upsert tags the user selected/created
        const userLabels = selectedTags.map((tag) => tag.label);
        const { data: tags, error: tagsError } = await supabase.rpc('upsert_tags', {
          label_list: userLabels,
        });

        if (tagsError) {
          console.error('Error upserting tags:', tagsError);
          // We can still continue since the spot was created
        } else if (tags) {
          // Bridge spot <-> tags
          const { error: linkError } = await supabase
            .from('spot_tags')
            .insert(tags.map((t) => ({ spot_id: spot.id, tag_id: t.id })));

          if (linkError) {
            console.error('Error linking tags to spot:', linkError);
          }
        } else {
          console.error('No tags returned from upsert unexpectedly');
        }
      }

      // Upload spot images to Supabase
      await uploadImagesToSupabase(spot.id);

      console.log('Spot Submitted Successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save spot. Please try again.');
      console.error('Error saving spot:', error);
    }
  };

  return (
    <Container>
      {/* Create Spot Form */}
      <ScrollView className="flex-1 px-4">
        <Text className="mt-4 text-2xl font-bold text-gray-800">Add New Study Spot</Text>

        {/* Upload spot images */}
        <View className="mt-6">
          <Text className="mb-1 text-sm font-medium text-gray-700">Upload Images</Text>
          <ImageUploader onImagesChange={handleImagesChange} />
        </View>

        {/* Spot Name */}
        <View className="mt-6">
          <Text className="mb-1 text-sm font-medium text-gray-700">Spot Name *</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`rounded-xl border p-4 ${errors.title ? 'border-red-500' : 'border-gray-300'} bg-white`}
                placeholder="Enter spot name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title && <Text className="mt-1 text-red-500">{errors.title.message}</Text>}
        </View>

        {/* Spot Body Description */}
        <View className="mt-6">
          <Text className="mb-1 text-sm font-medium text-gray-700">Description</Text>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="min-h-[120px] rounded-xl border border-gray-300 bg-white p-4"
                placeholder="Describe this study spot (optional)"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ''}
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>

        {/* Spot Tags */}
        <View className="mt-6">
          <Text className="mb-1 text-sm text-gray-800">Spot Tags</Text>
          <TagSelector commonTags={commonTags} />
        </View>

        {/* Spot Location */}
        <View>
          <Text className="text-lg font-semibold text-gray-800">Location</Text>
          <Text className="mb-2 text-sm font-medium text-gray-400">Drag to select a location</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange } }) => (
              <View
                className={`flex h-64 items-center justify-center rounded-xl ${errors.location ? 'border-2 border-red-500' : null}`}>
                {Platform.OS === 'ios' ? (
                  <AppleMaps.View
                    style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 16 }]}
                    cameraPosition={{
                      // Default coordinates for UT
                      coordinates: defaultLocation,
                      zoom: 15.5,
                    }}
                    onCameraMove={(event) => {
                      onChange(event.coordinates);
                    }}
                  />
                ) : (
                  <GoogleMaps.View style={{ flex: 1 }} />
                )}
                {renderMapUI()}
              </View>
            )}
          />
          {errors.location && <Text className="mt-1 text-red-500">{errors.location.message}</Text>}
        </View>

        {/* Submit Button */}
        <View className="mb-8 mt-8">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl bg-amber-600 p-4"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-lg font-bold text-white">Save Spot</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};

export default CreateSpot;
