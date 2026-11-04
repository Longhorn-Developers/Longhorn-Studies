import { View } from "react-native";

import { cn } from "../lib/cn";
import { Text } from "../text";

export type TagProps = {
  label: string;
  className?: string;
};

/** Read-only brand-outlined label (border/brand, text/brand). */
export function Tag({ label, className }: TagProps) {
  return (
    <View className={cn("self-start border border-brand rounded-full py-2 px-3", className)}>
      <Text variant="body-sm" color="brand">
        {label}
      </Text>
    </View>
  );
}
