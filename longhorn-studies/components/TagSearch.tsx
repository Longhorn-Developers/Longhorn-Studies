import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import TagSelector from './TagSelector';

import { useSpotsStore } from '~/store/SpotsStore';
import { useTagStore } from '~/store/TagStore';

export interface TagSearchProps extends TextInputProps {
  addTagEnabled?: boolean; // Whether to allow adding new tags
  showTrendingTags?: boolean; // Whether to show trending tags
  leftIcon?: React.ReactNode; // Optional children for custom input components
}

const TagSearch: React.FC<TagSearchProps> = ({
  addTagEnabled = true,
  showTrendingTags = true, // Default to showing trending tags
  leftIcon,
  ...textInputProps
}) => {
  const { searchQuery, setSearchQuery } = useSpotsStore();

  const {
    isSearching,
    searchResults,
    selectedTags,
    commonTags,
    searchTags,
    addTag,
    fetchCommonTags,
  } = useTagStore();

  useEffect(() => {
    // Fetch common tags when the component mounts
    fetchCommonTags();
  }, []);

  // Debounced search
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchTags(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // Handle creating a new tag
  const handleCreateTag = () => {
    if (searchQuery.trim()) {
      addTag({
        label: searchQuery.trim(),
        slug: '',
        is_system: false,
      });
      setSearchQuery('');
    }
  };

  return (
    <View>
      {/* Tag Input */}
      <View className="mb-2 flex-row items-center rounded-xl border border-gray-300">
        {leftIcon}
        <TextInput
          placeholder="Search or add tags (e.g., 'quiet', 'coffee')"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
          className="flex-1 p-4"
          value={searchQuery}
          onChangeText={setSearchQuery}
          {...textInputProps}
        />
      </View>

      {/* Create New Tag */}
      {searchQuery.trim().length > 0 &&
        searchResults.length === 0 &&
        !isSearching &&
        addTagEnabled && (
          <TouchableOpacity
            className="mb-3 flex-row items-center rounded-xl bg-gray-100 p-3"
            onPress={handleCreateTag}>
            <Text>Add tag: "{searchQuery.trim()}"</Text>
          </TouchableOpacity>
        )}

      {/* Search Results and Selected Tags Combined */}
      {(searchResults.length > 0 || selectedTags.length > 0) && (
        <View className="mb-3">
          <TagSelector
            tags={[
              ...selectedTags,
              ...searchResults.filter(
                (result) => !selectedTags.some((selected) => selected.slug === result.slug)
              ),
            ]}
          />
        </View>
      )}

      {/* Trending Tags */}
      {showTrendingTags && (
        <>
          {/* Header */}
          <View className="mb-2 flex-row items-center gap-2">
            <Ionicons name="trending-up" size={16} color="gray" />
            <Text className="text-sm font-bold">Trending Tags</Text>
          </View>

          {/* Trending Tags */}
          <TagSelector tags={commonTags} />
        </>
      )}
    </View>
  );
};

export default TagSearch;
