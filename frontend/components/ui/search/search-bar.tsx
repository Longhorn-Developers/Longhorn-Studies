import React from "react";
import { View, TextInput } from "react-native";
import { SearchIcon } from "../icons";

type SearchBarProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onSubmitEditing 
}: SearchBarProps) {
  return (
    <View className="w-full border px-4 py-3 rounded-full flex flex-row items-center gap-2 border-slate-400">
      <SearchIcon className="text-gray-500" />
      <TextInput
        className="flex-1 text-slate-800 p-0" // flex-1 lets it fill the space, p-0 removes Android default padding
        placeholder="Search for a study spot"
        placeholderTextColor="#94a3b8" // This is the hex code for Tailwind's slate-400
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search" // Changes the enter key on the keyboard to a search icon
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}