import { Image } from "expo-image";
import { CaretRightIcon, PersonSimpleWalkIcon } from "phosphor-react-native";
import { View } from "react-native";

import { OpenStatus, SaveButton, Tag, Text } from "@/components/ui";
import { tokens } from "@/theme/tokens";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type StudySpotCardType = {
  locationName: string;
  buildingName: string;
  location: string; // TODO: get proper type
  hours: string[];
  tags: string[];
};

export default function StudySpotCard({ locationName, buildingName, hours, tags }: StudySpotCardType) {
  return (
    <View className="flex-row gap-3 bg-surface border border-default rounded-2 p-3">
      <View className="w-[78px] aspect-square relative bg-subtle rounded-2">
        <Image
          source="https://www.rambleratx.com/wp-content/uploads/2022/06/Texas-Union.jpeg"
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
        />
        <SaveButton
          className="absolute top-2 left-2"
          onPress={() => console.log("Bookmark tapped!")}
        />
      </View>
      <View className="justify-between">
        <View>
          <View className="flex-row">
            <Text variant="body-lg-heavy" color="brand">
              {buildingName}
            </Text>
            <Text variant="body-lg-heavy"> {locationName}</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <View className="flex-row gap-2">
              <PersonSimpleWalkIcon size={14} color={tokens.icon.secondary} />
              <Text variant="body-sm" color="secondary">
                0.1 mi
              </Text>
            </View>
            {/* TODO: derive status from hours */}
            <OpenStatus status="open" until={hours[1]} />
          </View>
        </View>
        <View className="flex-row gap-2">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>
      </View>
      <View className="justify-center ml-auto">
        <CaretRightIcon size={12} color={tokens.icon.secondary} />
      </View>
    </View>
  );
}
