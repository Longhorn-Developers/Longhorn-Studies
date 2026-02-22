import { Image } from "expo-image";
import { Platform, StyleSheet, View, Text } from "react-native";

import StudySpotCard from "@/components/ui/study-spot-card";

export default function HomeScreen() {
  return (
    <View className="p-4">
    <Image
        source="https://picsum.photos/seed/696/3000/2000"
        contentFit="cover"
        transition={1000}
      />
      <View className="h-64" />
      <View className="h-16" />

    </View>
  );
}
