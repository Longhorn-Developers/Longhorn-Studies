import type { Icon } from "phosphor-react-native";
import { Pressable, View } from "react-native";

import { tokens } from "@/theme/tokens";

import { cn } from "../lib/cn";
import { Text, type TextVariant } from "../text";

const SIZE = {
  // Selected has a 2px border, so its padding is 1px smaller to keep the size steady.
  sm: { icon: 14, text: "body-sm", pad: "py-1 px-3", padSelected: "py-[1px] px-[7px]" },
  md: { icon: 16, text: "body-md", pad: "py-2 px-3", padSelected: "py-[3px] px-[7px]" },
} as const satisfies Record<string, { icon: number; text: TextVariant; pad: string; padSelected: string }>;

const VARIANT = {
  /** Unselected chip: border/strong, text/primary. */
  neutral: { box: "border bg-surface border-strong", text: "text-primary", icon: tokens.icon.primary },
  /** Chosen preference: filter/active-*. */
  selected: { box: "border-2 bg-filter-active border-filter-active", text: "text-filter-active", icon: tokens.filter["active-text"] },
  /** Brand outline: border/brand, text/brand. */
  brand: { box: "border bg-surface border-brand", text: "text-brand", icon: tokens.text.brand },
} as const;

export type AmenityTagProps = {
  label: string;
  /** Any Phosphor icon, e.g. `icon={SpeakerSimpleLowIcon}`. Omit for text only. */
  icon?: Icon;
  size?: keyof typeof SIZE;
  variant?: keyof typeof VARIANT;
  /** Makes the tag tappable (e.g. to toggle a preference). */
  onPress?: () => void;
  className?: string;
};

/** Spot amenity tag. Small on cards, Medium on details. */
export function AmenityTag({
  label,
  icon: IconComponent,
  size = "sm",
  variant = "neutral",
  onPress,
  className,
}: AmenityTagProps) {
  const s = SIZE[size];
  const v = VARIANT[variant];
  const classes = cn(
    "self-start flex-row items-center gap-2 rounded-full",
    v.box,
    variant === "selected" ? s.padSelected : s.pad,
    className
  );
  const content = (
    <>
      {IconComponent && <IconComponent size={s.icon} color={v.icon} />}
      <Text variant={s.text} color={null} className={v.text}>
        {label}
      </Text>
    </>
  );

  if (!onPress) return <View className={classes}>{content}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: variant === "selected" }}
      className={classes}
    >
      {content}
    </Pressable>
  );
}
