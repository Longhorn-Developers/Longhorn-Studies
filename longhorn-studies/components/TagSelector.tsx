import { View, Text, TouchableOpacity } from 'react-native';

import { useTagStore, PublicTagsRow } from '~/store/TagStore';

const TagSelector = ({ tags, onPress }: { tags: PublicTagsRow[]; onPress?: () => void }) => {
  const { selectedTags, toggleTag } = useTagStore();

  const handleTagPress = (tag: PublicTagsRow) => {
    toggleTag(tag);

    if (onPress) onPress();
  };

  return (
    <>
      {/* Common Tags */}
      {tags && tags.length > 0 && (
        <>
          <View className="flex-row flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTags.some((t) =>
                t.id ? t.id === tag.id : t.label.toLowerCase() === tag.label.toLowerCase()
              );
              return (
                <TouchableOpacity
                  key={tag.id || tag.label}
                  className={`rounded-full border ${isSelected ? 'border-white bg-amber-600' : 'border-gray-200 bg-white'} px-4 py-2`}
                  onPress={() => handleTagPress(tag)}>
                  <Text className={`font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
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
