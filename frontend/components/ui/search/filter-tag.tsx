import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
// import { ChevronDownIcon, CloseIcon, CheckIcon } from "../icons";
import { CaretRightIcon } from "../icons";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

type FilterTagProps = {
  label: string;
  options: string[];
  onApply: (selectedOptions: string[]) => void;
};

export default function FilterTag({ label, options, onApply }: FilterTagProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [tempSelections, setTempSelections] = useState<string[]>([]);

  // 1. Create an animated value starting off-screen at the bottom
  const slideAnim = useRef(new Animated.Value(WINDOW_HEIGHT)).current;

  const openModal = () => {
    setTempSelections([...appliedFilters]);
    setIsOpen(true);
    // Slide the bottom sheet up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    // Slide the bottom sheet back down
    Animated.timing(slideAnim, {
      toValue: WINDOW_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Hide the modal after the animation finishes
      setIsOpen(false);
    });
  };

  const toggleSelection = (option: string) => {
    if (tempSelections.includes(option)) {
      setTempSelections(tempSelections.filter((item) => item !== option));
    } else {
      setTempSelections([...tempSelections, option]);
    }
  };
  const clearSelection = () => {
    console.log(tempSelections !== appliedFilters);
    setTempSelections([]);
  };
  const handleApply = () => {
    console.log(tempSelections);
    console.log(appliedFilters);
    console.log(tempSelections === appliedFilters);
    setAppliedFilters(tempSelections);
    onApply(tempSelections);
    closeModal();
  };

  const hasChanges =
    tempSelections.length !== appliedFilters.length ||
    !tempSelections.every((option) => appliedFilters.includes(option));

  return (
    <>
      {/* 1. THE FILTER PILL BUTTON */}
      <Pressable
        onPress={openModal}
        className={`self-start flex flex-row items-center border rounded-full px-4 py-2 gap-2 ${
          appliedFilters.length > 0
            ? "border-orange-600 bg-orange-50"
            : "border-slate-400 bg-white"
        }`}
      >
        <Text
          className={
            appliedFilters.length > 0
              ? "text-burnt-orange font-medium"
              : "text-ut-black"
          }
        >
          {label} {appliedFilters.length > 1 && `(${appliedFilters.length})`}
        </Text>
        <CaretRightIcon
          size={12}
          className={`${
            appliedFilters.length > 0
              ? "text-burnt-orange"
              : "text-ut-black"
          } rotate-90`}
        />
      </Pressable>

      {/* 2. THE BOTTOM SHEET MODAL */}
      <Modal visible={isOpen} transparent animationType="fade">
        {/* Dark overlay backdrop - closes modal when tapped */}
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={closeModal}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="justify-end"
          >
            <Animated.View
              style={{ transform: [{ translateY: slideAnim }] }}
              className="bg-white rounded-t-3xl p-5 pt-4 w-full max-h-[100%]"
            >
              {/* Header */}
              <View className="flex flex-row justify-between items-center mb-6">
                <Text className="text-filter-header font-bold text-slate-900">
                  {label}
                </Text>
                <Pressable onPress={closeModal} className="p-2">
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
                          isSelected
                            ? "bg-burnt-orange border-burnt-orange"
                            : "border-gray"
                        }`}
                      >
                        {isSelected && (
                          <Text className="text-white text-xs leading-none">
                            ✓
                          </Text>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Apply Button */}
              <View className="flex flex-row w-full gap-[10]">
                <Pressable
                  disabled={!hasChanges && appliedFilters.length === 0}
                  onPress={clearSelection}
                  className={`border-2 ${!hasChanges && appliedFilters.length === 0 ? "border-[#E5E7EB]" : "border-burnt-orange"}   rounded-xl py-4 items-center flex-1 basis-0`}
                >
                  <Text
                    className={`${!hasChanges && appliedFilters.length === 0 ? "text-[#9CADB7]" : "text-burnt-orange"} font-semibold text-lg`}
                  >
                    Clear Filters
                  </Text>
                </Pressable>
                <Pressable
                  disabled={!hasChanges}
                  onPress={handleApply}
                  className={`${!hasChanges ? "bg-[#E5E7EB]" : "bg-burnt-orange"} rounded-xl py-4 items-center flex-1 basis-0`}
                >
                  <Text
                    className={`${!hasChanges ? "text-[#6B7280]" : "text-white"} font-semibold text-lg`}
                  >
                    Apply
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
