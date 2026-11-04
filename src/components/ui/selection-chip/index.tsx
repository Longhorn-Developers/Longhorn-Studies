import type { Icon } from "phosphor-react-native";
import { CheckIcon } from "phosphor-react-native/src/icons/Check";
import { Pressable } from "react-native";

import { tokens } from "@/theme/tokens";

import { cn } from "../lib/cn";
import { Text } from "../text";

const SIZE = {
  md: { icon: 20, check: 16, text: "body-lg" },
  sm: { icon: 16, check: 14, text: "body-md" },
} as const;

export type SelectionChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Any Phosphor icon, shown before the label. Optional. */
  icon?: Icon;
  size?: keyof typeof SIZE;
  className?: string;
};

/** Pick-one / pick-many choice (onboarding, Profile). Selected adds a check. */
export function SelectionChip({
  label,
  selected,
  onPress,
  icon: IconComponent,
  size = "md",
  className,
}: SelectionChipProps) {
  const s = SIZE[size];
  const color = selected ? tokens.filter["active-text"] : tokens.text.primary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        "self-start flex-row items-center gap-3 rounded-full border-[1.5px] px-4 py-3",
        selected ? "bg-filter-active border-filter-active" : "bg-surface border-strong",
        className
      )}
    >
      {IconComponent && <IconComponent size={s.icon} color={color} />}
      <Text variant={s.text} color={null} className={selected ? "text-filter-active" : "text-primary"}>
        {label}
      </Text>
      {selected && <CheckIcon size={s.check} color={color} />}
    </Pressable>
  );
}
