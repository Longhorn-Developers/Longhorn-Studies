import { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useTagStore } from '~/store/TagStore';

const TagSelector = () => {
  const { commonTags, selectedTags, toggleTag, fetchCommonTags } = useTagStore();

  useEffect(() => {
    fetchCommonTags();
  }, []);

  return (
    <>
      {/* Common Tags */}
      {commonTags && commonTags.length > 0 && (
        <>
          <View className="flex-row flex-wrap gap-2">
            {commonTags.map((tag) => {
              const isSelected = selectedTags.some((t) =>
                t.id ? t.id === tag.id : t.label.toLowerCase() === tag.label.toLowerCase()
              );
              return (
                <TouchableOpacity
                  key={tag.id || tag.label}
                  className={`rounded-full ${isSelected ? 'bg-amber-600' : 'border border-gray-200 bg-white'} px-4 py-2`}
                  onPress={() => toggleTag(tag)}>
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
