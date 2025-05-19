import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

interface ImageUploaderProps {
  onImagesChange: (images: ImagePicker.ImagePickerAsset[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ onImagesChange, maxImages = 4 }: ImageUploaderProps) {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [uploading, setUploading] = useState(false);

  // Request permissions if needed
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please grant camera roll permissions to upload images.');
      }
    })();
  }, []);

  const pickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `You can only upload up to ${maxImages} images.`);
      return;
    }
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0,
        allowsMultipleSelection: true,
        selectionLimit: maxImages - images.length,
      });

      if (!result.canceled && result.assets.length > 0) {
        // Add newly picked image
        const updatedImages = [...images, ...result.assets];
        setImages(updatedImages);
        onImagesChange(updatedImages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.uri !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const onDragEnd = ({ data }: { data: ImagePicker.ImagePickerAsset[] }) => {
    setImages(data);
    onImagesChange(data);
  };

  // Image item render
  const renderItem = ({ item, drag, isActive }: RenderItemParams<ImagePicker.ImagePickerAsset>) => {
    return (
      <TouchableOpacity
        onLongPress={drag}
        className={`relative mr-2 h-20 w-20 overflow-hidden rounded-lg ${isActive ? 'border-2 border-amber-500 opacity-80' : ''}`}
        disabled={isActive}>
        <Image source={{ uri: item.uri }} className="h-full w-full" resizeMode="cover" />
        <TouchableOpacity
          onPress={() => removeImage(item.uri)}
          className="absolute right-1 top-1 rounded-full bg-gray-800/70 p-1">
          <Ionicons name="close" size={14} color="white" />
        </TouchableOpacity>

        {/* Show moving/dragging indicator */}
        {isActive ? <View className="bg-amber-500" /> : null}
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-gray-700">Upload Images</Text>
      <View className="rounded-xl border border-gray-300 bg-gray-50 p-4">
        {/* Image carousel header */}
        <View className="mb-3">
          <Text className="text-xs text-gray-500">
            {images.length > 0
              ? 'Long press and drag to reorder • Tap × to remove'
              : 'Add up to 5 images of the study spot'}
          </Text>
        </View>

        {/* Draggable Image carousel */}
        <View className="flex-row items-center">
          <GestureHandlerRootView className="flex-1">
            {/* Flat List of images */}
            <View className="flex-row">
              {images.length > 0 && (
                <DraggableFlatList
                  data={images}
                  onDragEnd={onDragEnd}
                  keyExtractor={(item) => item.uri}
                  renderItem={renderItem}
                  horizontal
                  contentContainerStyle={{ marginRight: 10 }}
                />
              )}

              {/* Add image button */}
              {images.length < maxImages && (
                <TouchableOpacity
                  onPress={pickImage}
                  disabled={uploading}
                  className="h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  {uploading ? (
                    <ShimmerPlaceholder
                      LinearGradient={LinearGradient}
                      width={80}
                      height={80}
                      shimmerStyle={{ borderRadius: 8 }}
                      visible={false}
                      style={{ margin: 0 }}
                    />
                  ) : (
                    <Ionicons name="add" size={24} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </GestureHandlerRootView>
        </View>
      </View>
    </View>
  );
}
