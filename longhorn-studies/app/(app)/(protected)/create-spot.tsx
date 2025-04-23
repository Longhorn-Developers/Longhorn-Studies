import { zodResolver } from '@hookform/resolvers/zod';
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
} from 'react-native';

import { Container } from '~/components/Container';
import ImageUploader from '~/components/ImageUploader';
import TagSelector from '~/components/TagSelector';
import { useTagStore } from '~/store/TagStore';
import { publicSpotsInsertSchemaSchema } from '~/types/schemas';
import { PublicSpotsInsertSchema, PublicTagsRowSchema } from '~/types/schemas_infer';
import { supabase } from '~/utils/supabase';

const CreateSpot = () => {
  const [commonTags, setCommonTags] = useState<PublicTagsRowSchema[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const { selectedTags, resetTags } = useTagStore();

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

  const handleImagesChange = (newImages: any[]) => {
    setImages(newImages);
  };

  const uploadImagesToSupabase = async () => {
    if (images.length <= 0) return null;

    try {
      // Upload the first image as the main spot image (you can modify this to handle multiple images)
      // const mainImage = images[0];
      // const fileName = `spot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      // const filePath = `spots/${fileName}`;
      // const { data: fileData, error: uploadError } = await supabase.storage
      //   .from('study-spots')
      //   .upload(filePath, mainImage.file);
      // if (uploadError) {
      //   console.error('Error uploading image:', uploadError);
      //   return null;
      // }
      // // Get the public URL
      // const { data: publicUrl } = supabase.storage
      //   .from('study-spots')
      //   .getPublicUrl(filePath);
      // return publicUrl.publicUrl;
      console.log('Uploading images to Supabase...', JSON.stringify(images, null, 2));
    } catch (error) {
      console.error('Error in image upload process:', error);
      return null;
    }
  };

  const onSubmit = async (spot_data: PublicSpotsInsertSchema) => {
    try {
      // 1) Upload images if any
      await uploadImagesToSupabase();

      // 2) Insert the spot
      const { data: spot, error: spotError } = await supabase
        .from('spots')
        .insert(spot_data)
        .select()
        .single();

      if (spotError) {
        Alert.alert('Error', 'Failed to insert data. Please try again.');
        console.error('Error inserting data:', spotError);
        return;
      }

      if (selectedTags.length > 0) {
        // 3) Upsert tags the user selected/created
        const userLabels = selectedTags.map((tag) => tag.label);
        const { data: tags, error: tagsError } = await supabase.rpc('upsert_tags', {
          label_list: userLabels,
        });

        if (tagsError) {
          console.error('Error upserting tags:', tagsError);
          // We can still continue since the spot was created
        } else if (tags) {
          // 4) Bridge spot <-> tags
          const { error: linkError } = await supabase
            .from('spot_tags')
            .insert(tags.map((t) => ({ spot_id: spot.id, tag_id: t.id })));

          if (linkError) {
            console.error('Error linking tags to spot:', linkError);
          }
        }
      }

      console.log('Spot Submitted Successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save spot. Please try again.');
      console.error('Error saving spot:', error);
    }
  };

  return (
    <Container>
      <ScrollView className="flex-1 px-4">
        <View className="mb-6 mt-4 flex-row items-center">
          <Text className="text-2xl font-bold text-gray-800">Add New Study Spot</Text>
        </View>

        {/* Create Spot Form */}
        <View className="mb-6 gap-3">
          {/* Upload spot images */}
          <ImageUploader onImagesChange={handleImagesChange} />

          {/* Spot Name */}
          <Text className="mb-2 text-sm font-medium text-gray-700">Spot Name *</Text>
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
        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
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
        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Spot Tags</Text>
          <TagSelector commonTags={commonTags} />
        </View>

        {/* Spot Location */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Location</Text>
          <View className="flex h-40 items-center justify-center rounded-xl bg-gray-200">
            <Text className="text-gray-500">Map Placeholder</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="mb-8 flex-row items-center justify-center rounded-xl bg-amber-600 p-4"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-lg font-bold text-white">Save Spot</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default CreateSpot;
