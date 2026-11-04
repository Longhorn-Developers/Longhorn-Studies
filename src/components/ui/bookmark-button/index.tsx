import { BookmarkSimpleIcon } from "phosphor-react-native/src/icons/BookmarkSimple";
import { Pressable, type PressableProps } from "react-native";

import { tokens } from "@/theme/tokens";

import { cn } from "../lib/cn";

const SIZE = {
  sm: "p-2", // 28px — card photos
  lg: "p-3", // 36px — details header
} as const;

export type BookmarkButtonProps = Omit<PressableProps, "children"> & {
  saved?: boolean;
  size?: keyof typeof SIZE;
  className?: string;
};

/** Save toggle. Saved: saved/bg circle + saved/icon. Unsaved: icon/primary, no circle. */
export function BookmarkButton({ saved = false, size = "sm", className, ...props }: BookmarkButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? "Remove from saved" : "Save"}
      accessibilityState={{ selected: saved }}
      hitSlop={8}
      className={cn("self-start rounded-full", SIZE[size], saved && "bg-saved", className)}
      {...props}
    >
      <BookmarkSimpleIcon size={20} color={saved ? tokens.saved.icon : tokens.icon.primary} />
    </Pressable>
  );
}
