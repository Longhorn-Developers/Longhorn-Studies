import { View, Text } from "react-native";

type TagProps = {
  tag: string;
};

export function Tag({ tag }: TagProps) {
  return (
    <View className="self-start border border-brand rounded-full py-2 px-3">
      <Text className="text-brand text-body-sm w-fit">{tag}</Text>
    </View>
  );
}
