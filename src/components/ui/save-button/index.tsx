import { BookmarkSimpleIcon } from "phosphor-react-native";
import { Pressable, type PressableProps } from "react-native";

import { tokens } from "@/theme/tokens";

import { cn } from "../lib/cn";

export type SaveButtonProps = Omit<PressableProps, "children"> & {
  saved?: boolean;
  size?: number;
  className?: string;
};

/** Bookmark toggle: saved/bg circle with saved/icon. Filled icon when saved. */
export function SaveButton({ saved = false, size = 16, className, ...props }: SaveButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? "Remove from saved" : "Save"}
      accessibilityState={{ selected: saved }}
      hitSlop={15}
      className={cn("self-start rounded-full bg-saved p-2", className)}
      {...props}
    >
      <BookmarkSimpleIcon size={size} weight={saved ? "fill" : "regular"} color={tokens.saved.icon} />
    </Pressable>
  );
}
