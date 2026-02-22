import { Image } from "expo-image";

import { View, Text } from "react-native";

import OpenStatus from "../open-status";
import { Tag } from "../tags";

import { BookmarkIcon, CaretRightIcon } from "../icons";

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


type StudySpotCardType = {
  locationName: string;
  buildingName: string;
  location: string; // TODO: get proper type
  hours: string[];
  tags: string;
};
export default function StudySpotCard({
  locationName,
  buildingName,
  hours,
  tags,
}: StudySpotCardType) {
  return (
    <View className="flex flex-row gap-2 border p-2 rounded-lg border-card-border">
      <View className="w-[78px] aspect-square p-1">
        <Image
          className="w-[78px] aspect-square bg-blue-500 rounded-[4px] absolute flex-1"
          source="https://picsum.photos/seed/696/3000/2000"
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <View className="bg-saved-bg rounded-full self-start p-1">
          <BookmarkIcon size={16} className="text-white" />
        </View>
      </View>
      <View className="flex justify-between">
        <View>
          <View className="flex flex-row">
            <Text className="text-spot-name text-burnt-orange font-bold">
              {buildingName}
            </Text>
            <Text className="text-spot-name font-bold"> {locationName}</Text>
          </View>
          <View className="flex flex-row items-center gap-3">
            <Text className="text-gray-text text-status">0.1 mi</Text>
            <OpenStatus openStatus="open" hours={["5:00am", "5:00pm"]} />
          </View>
        </View>
        <View className="flex flex-row gap-1">
          <Tag tag="Lounge" />
          <Tag tag="Low Noise" />
          <Tag tag="Near Food & Cafe" />
        </View>
      </View>
      <View className="flex justify-center ml-auto">
        <CaretRightIcon size={12} className="text-gray-400" />
      </View>
    </View>
  );
}
