import { Image } from "expo-image";
import { Platform, StyleSheet, View, Text, ScrollView } from "react-native";

import SearchBar from "@/components/ui/search/search-bar";
import StudySpotCard from "@/components/ui/study-spot-card";
import FilterTag from "@/components/ui/search/filter-tag";

import { Search } from "@/components/ui/search";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 16,
        paddingRight: insets.right + 16,
      }}
      className="flex gap-4 bg-white h-full"
    >
      <Search />
      <View>
        {/** TODO: CONVERT TO A FLAT LIST */}
        <ScrollView
          contentContainerClassName="flex flex-col gap-3"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-heading font-bold pb-1">
            Recommended for You
          </Text>
          <StudySpotCard
            abbreviation="Union"
            study_spot_name="Ballroom"
            location="Ballroom"
            hours={["5:00am", "5:00pm"]}
            tags={["Lounge", "Low Noise", "Outlets", "Printer"]}
          />
          <StudySpotCard
            abbreviation="Union"
            study_spot_name="Ballroom"
            location="Ballroom"
            hours={["5:00am", "5:00pm"]}
            tags={["Lounge", "Low Noise", "Outlets", "Printer"]}
          />
          <StudySpotCard
            abbreviation="Union"
            study_spot_name="Ballroom"
            location="Ballroom"
            hours={["5:00am", "5:00pm"]}
            tags={["Lounge", "Low Noise", "Outlets", "Printer"]}
          />
          <StudySpotCard
            abbreviation="Union"
            study_spot_name="Ballroom"
            location="Ballroom"
            hours={["5:00am", "5:00pm"]}
            tags={["Lounge", "Low Noise", "Outlets", "Printer"]}
          />
          <StudySpotCard
            abbreviation="Union"
            study_spot_name="Ballroom"
            location="Ballroom"
            hours={["5:00am", "5:00pm"]}
            tags={["Lounge", "Low Noise", "Outlets", "Printer"]}
          />
          <StudySpotCard
            image="https://picsum.photos/200"
            abbreviation="EER"
            study_spot_name="Floor"
            location="Floor"
            hours={["5:00am", "5:00pm"]}
            tags={["Lounge", "Low Noise", "Outlets", "Printer"]}
          />
          <StudySpotCard
            image="https://picsum.photos/200"
            abbreviation="Union"
            study_spot_name="Ballroom"
            location="Ballroom"
            hours={["5:00am", "5:00pm"]}
            tags={["Lounge", "Low Noise", "Outlets", "Printer"]}
          />
        </ScrollView>
      </View>
    </View>
  );
}
