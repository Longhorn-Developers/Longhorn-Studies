import React, { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
// Import your icons (you can swap these with the ones you have)
// import { ChevronDownIcon, CloseIcon, CheckIcon } from "../icons";
import { CaretRightIcon } from "../icons";
type FilterTagProps = {
  label: string;
  options: string[];
  onApply: (selectedOptions: string[]) => void;
}

export default function FilterTag({ label, options, onApply }: FilterTagProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // What is actually applied and filtering the list
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  
  // What the user is checking/unchecking while the modal is open
  const [tempSelections, setTempSelections] = useState<string[]>([]);

  // Open modal and copy applied filters into temporary state
  const handleOpen = () => {
    setTempSelections([...appliedFilters]);
    setIsOpen(true);
  };

  const toggleSelection = (option: string) => {
    if (tempSelections.includes(option)) {
      setTempSelections(tempSelections.filter((item) => item !== option));
    } else {
      setTempSelections([...tempSelections, option]);
    }
  };

  const handleApply = () => {
    setAppliedFilters(tempSelections);
    onApply(tempSelections);
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. THE FILTER PILL BUTTON */}
      <Pressable
        onPress={handleOpen}
        className={`flex flex-row items-center border rounded-full px-4 py-2 gap-2 w-fit ${
          appliedFilters.length > 0
            ? "border-orange-600 bg-orange-50" // Highlight if active
            : "border-gray-300 bg-white"
        }`}
      >
        <Text className={appliedFilters.length > 0 ? "text-orange-700 font-medium" : "text-gray-700"}>
          {label} {appliedFilters.length > 0 && `(${appliedFilters.length})`}
        </Text>
        {/* Replace with your ChevronDownIcon */}
        <CaretRightIcon size={12} className='text-black rotate-90'/>
      </Pressable>

      {/* 2. THE BOTTOM SHEET MODAL */}
      <Modal visible={isOpen} transparent animationType="slide">
        {/* Dark overlay backdrop */}
        <View className="flex-1 justify-end bg-black/40">
          
          {/* Modal Content */}
          <View className="bg-white rounded-t-3xl p-6 pt-4 w-full max-h-[80%]">
            
            {/* Header */}
            <View className="flex flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-900">{label}</Text>
              <Pressable onPress={() => setIsOpen(false)} className="p-2">
                 {/* Replace with your CloseIcon */}
                <Text className="text-gray-400 text-lg">✕</Text>
              </Pressable>
            </View>

            {/* Options List */}
            <ScrollView className="mb-6">
              {options.map((option) => {
                const isSelected = tempSelections.includes(option);
                return (
                  <Pressable
                    key={option}
                    onPress={() => toggleSelection(option)}
                    className="flex flex-row items-center justify-between py-4 border-b border-gray-100"
                  >
                    <Text className="text-base text-slate-800">{option}</Text>
                    
                    {/* Custom Checkbox */}
                    <View
                      className={`w-6 h-6 rounded flex items-center justify-center border ${
                        isSelected ? "bg-[#C25E03] border-[#C25E03]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                         // Replace with your Checkmark SVG
                        <Text className="text-white text-xs leading-none">✓</Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Apply Button */}
            <Pressable
              onPress={handleApply}
              className="bg-[#D97706] rounded-xl py-4 items-center"
            >
              <Text className="text-white font-semibold text-lg">Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}