import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { useTagStore, PublicTagsRow } from '~/store/TagStore';

interface TagSelectorProps {
  tags: PublicTagsRow[];
  onPress?: () => void;
  scrollable?: boolean;
  maxLines?: number;
}

const TagSelector = ({ tags, onPress, scrollable = false, maxLines }: TagSelectorProps) => {
  const { selectedTags, toggleTag } = useTagStore();

  const handleTagPress = (tag: PublicTagsRow) => {
    toggleTag(tag);

    if (onPress) onPress();
  };

  const renderTags = () => {
    return tags.map((tag) => {
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
    });
  };

  const containerStyle = `flex-row flex-wrap gap-2 ${maxLines ? `max-h-[${maxLines * 40}px] overflow-hidden` : ''}`;

  return (
    <>
      {tags && tags.length > 0 && (
        <>
          {scrollable ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}>
              {renderTags()}
            </ScrollView>
          ) : (
            <View className={containerStyle}>{renderTags()}</View>
          )}
        </>
      )}
    </>
  );
};

export default TagSelector;
