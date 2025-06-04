import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import TagSelector from './TagSelector';

import { useTagStore } from '~/store/TagStore';
import { PublicTagsRowSchema } from '~/supabase/functions/new-spot/types/schemas_infer';
import { Ionicons } from '@expo/vector-icons';

type TagSearchProps = {
  onTagsChange?: (tags: PublicTagsRowSchema[]) => void;
};

const TagSearch: React.FC<TagSearchProps> = ({ onTagsChange }) => {
  const {
    searchQuery,
    isSearching,
    searchResults,
    selectedTags,
    setSearchQuery,
    searchTags,
    addTag,
    removeTag,
    fetchCommonTags,
  } = useTagStore();

  useEffect(() => {
    // Fetch common tags when the component mounts
    fetchCommonTags();
  }, []);

  // Notify parent component when tags change
  useEffect(() => {
    if (onTagsChange) {
      onTagsChange(selectedTags);
    }
  }, [selectedTags, onTagsChange]);

  // Debounced search
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchTags();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // Handle creating a new tag
  const handleCreateTag = () => {
    if (searchQuery.trim()) {
      addTag({
        label: searchQuery.trim(),
        slug: '',
      });
      setSearchQuery('');
    }
  };

  return (
    <View>
      {/* Tag Input */}
      <TextInput
        className="mb-2 rounded-xl border border-gray-300 bg-white p-4"
        placeholder="Search or add tags (e.g., 'quiet', 'coffee')"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Search Results */}
      {isSearching && (
        <View className="items-center py-2">
          <ActivityIndicator size="small" color="#d97706" />
        </View>
      )}

      {searchResults.length > 0 && (
        <View className="mb-3 max-h-40 rounded-xl border border-gray-200 bg-white">
          <ScrollView nestedScrollEnabled>
            {searchResults.map((tag) => (
              <TouchableOpacity
                key={tag.id || tag.label}
                className="border-b border-gray-100 p-3"
                onPress={() => {
                  const { id, ...tagWithoutId } = tag;
                  addTag(tagWithoutId);
                  setSearchQuery('');
                }}>
                <Text>{tag.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Create New Tag */}
      {searchQuery.trim().length > 0 && searchResults.length === 0 && !isSearching && (
        <TouchableOpacity
          className="mb-3 flex-row items-center rounded-xl bg-gray-100 p-3"
          onPress={handleCreateTag}>
          <Text>Add tag: "{searchQuery.trim()}"</Text>
        </TouchableOpacity>
      )}

      {/* Selected Tags */}
      <View className="mb-1 flex-row flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <TouchableOpacity
            key={tag.id || tag.label}
            className="flex-row items-center rounded-full bg-amber-600 px-4 py-2"
            onPress={() => removeTag(tag)}>
            <Text className="font-medium text-white">{tag.label}</Text>
            <Text className="ml-2 font-bold text-white">×</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Common Tags */}
      <View className="mb-2 flex-row items-center gap-2">
        <Ionicons name="trending-up" size={16} color="gray" />
        <Text className="text-sm">Trending Tags</Text>
      </View>

      <TagSelector />
    </View>
  );
};

export default TagSearch;
