import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Container } from '~/components/Container';
import { publicSpotsInsertSchemaSchema } from '~/types/schemas';
import { PublicSpotsInsertSchema } from '~/types/schemas_infer';

const CreateSpot = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PublicSpotsInsertSchema>({
    resolver: zodResolver(publicSpotsInsertSchemaSchema),
    defaultValues: {
      title: '',
      body: '',
      user_id: '', // This would typically come from auth context
    },
  });

  const onSubmit = (data: PublicSpotsInsertSchema) => {
    console.log('Form submitted:', data);
    // Here you would typically call your API to create the spot
  };

  return (
    <Container>
      <ScrollView className="flex-1 px-4">
        <View className="mb-6 mt-4 flex-row items-center">
          <TouchableOpacity
            className="rounded-full bg-amber-50 p-2"
            onPress={() => console.log('Go back')}>
            {/* <ArrowLeft size={24} color="#B45309" /> */}
          </TouchableOpacity>
          <Text className="ml-4 text-2xl font-bold text-gray-800">Add New Study Spot</Text>
        </View>

        <View className="mb-6">
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

        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Spot Features</Text>

          <View className="mb-4 flex-row flex-wrap gap-2">
            <TouchableOpacity className="rounded-full bg-amber-600 px-4 py-2">
              <Text className="font-medium text-white">Quiet</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-gray-200 px-4 py-2">
              <Text className="font-medium text-gray-800">Coffee</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-gray-200 px-4 py-2">
              <Text className="font-medium text-gray-800">Outlets</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-gray-200 px-4 py-2">
              <Text className="font-medium text-gray-800">Group-friendly</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-gray-200 px-4 py-2">
              <Text className="font-medium text-gray-800">24/7</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-gray-200 px-4 py-2">
              <Text className="font-medium text-gray-800">Outdoor</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Location</Text>
          <View className="flex h-40 items-center justify-center rounded-xl bg-gray-200">
            <Text className="text-gray-500">Map Placeholder</Text>
          </View>
        </View>

        <TouchableOpacity className="mb-8 flex-row items-center justify-center rounded-xl bg-amber-600 p-4">
          {/* <Check size={20} color="white" className="mr-2" /> */}
          <Text className="text-lg font-bold text-white" onPress={handleSubmit(onSubmit)}>
            Save Spot
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default CreateSpot;
