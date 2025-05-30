import { View, Text, TouchableOpacity } from 'react-native';
import { useTagStore } from '~/store/TagStore';

const TagSelector = () => {
  const { commonTags, selectedTags, toggleTag } = useTagStore();
  return (
    <>
      {/* Common Tags */}
      {commonTags && commonTags.length > 0 && (
        <>
          <Text className="mb-2 text-sm font-medium text-gray-700">Common Tags:</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {commonTags.map((tag) => {
              const isSelected = selectedTags.some((t) =>
                t.id ? t.id === tag.id : t.label.toLowerCase() === tag.label.toLowerCase()
              );
              return (
                <TouchableOpacity
                  key={tag.id || tag.label}
                  className={`rounded-full ${isSelected ? 'bg-amber-600' : 'bg-gray-200'} px-4 py-2`}
                  onPress={() => toggleTag(tag)}>
                  <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </>
  );
};

export default TagSelector;
