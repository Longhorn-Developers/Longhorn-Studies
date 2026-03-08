import { View, ScrollView } from "react-native";
import SearchBar from "./search-bar";

import FilterTag from "./filter-tag";

export function Search({}) {
  return (
    <View>
      <SearchBar />
      <ScrollView contentContainerClassName="flex flex-row gap-1 pt-3" horizontal showsHorizontalScrollIndicator={false}>
        <FilterTag
          label="Area Type"
          options={[
            "Open Area",
            "Lounge",
            "Cubicles",
            "Closed Room",
            "Outdoor",
          ]}
          onApply={(selected) => console.log("Filtering by:", selected)}
        />
        <FilterTag
          label="Noise Level"
          options={[
            "Silent",
            "Low",
            "Moderate",
            "High",
          ]}
          onApply={(selected) => console.log("Filtering by:", selected)}
        />
        <FilterTag
          label="Amenities"
          options={[
            "Reservable",
            "Near Food & Cafes",
            "Outlets",
            "Whiteboards",
            "TV/Projectors",
          ]}
          onApply={(selected) => console.log("Filtering by:", selected)}
        />
      </ScrollView>
    </View>
  );
}
