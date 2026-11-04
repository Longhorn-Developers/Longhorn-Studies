import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { ImageIcon } from "phosphor-react-native/src/icons/Image";
import { PlusIcon } from "phosphor-react-native/src/icons/Plus";
import { Pressable, View } from "react-native";

import { tokens } from "@/theme/tokens";

import { cn } from "../lib/cn";

/**
 * Opens the photo library with a square crop. Resolves to the picked photo's
 * local URI, or null if the user cancels.
 */
export async function pickPhoto(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  return result.canceled ? null : result.assets[0].uri;
}

export type PhotoPickerProps = {
  /** Picked photo URI. Empty shows the dashed placeholder. */
  uri?: string | null;
  /** Usually `async () => setUri(await pickPhoto())`. */
  onPress: () => void;
  onLongPress?: () => void;
  /** Circle diameter in px. */
  size?: number;
  className?: string;
};

/**
 * Round photo slot with a + badge. Empty: dashed border/default on bg/subtle
 * with a 28px image icon. Filled: the photo fills the circle.
 */
export function PhotoPicker({ uri, onPress, onLongPress, size = 96, className }: PhotoPickerProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={uri ? "Change photo" : "Add photo"}
      className={cn("self-start", className)}
      style={{ width: size, height: size }}
    >
      <View
        className={cn(
          "flex-1 items-center justify-center overflow-hidden rounded-full",
          !uri && "border border-dashed border-default bg-subtle"
        )}
      >
        {uri ? (
          <Image source={uri} style={{ width: size, height: size }} />
        ) : (
          <ImageIcon size={28} color={tokens.icon.secondary} />
        )}
      </View>
      {/* 26px badge: action/primary fill with a 2px surface ring. */}
      <View className="absolute bottom-0 right-0 h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-surface bg-action-primary">
        <PlusIcon size={14} weight="bold" color={tokens.text["on-brand"]} />
      </View>
    </Pressable>
  );
}
