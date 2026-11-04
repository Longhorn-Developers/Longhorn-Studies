import { View } from "react-native";

import { cn } from "../lib/cn";
import { Text } from "../text";
import { Star } from "./star";

export type RatingProps = {
  /** e.g. 4.2 — shown with one decimal. */
  value: number;
  /** Number of reviews, shown as "(128)". Optional. */
  count?: number;
  className?: string;
};

/** Compact rating for cards: star + decimal, count optional. */
export function Rating({ value, count, className }: RatingProps) {
  const label = value.toFixed(1);
  return (
    <View
      accessible
      accessibilityLabel={`Rated ${label} out of 5${count !== undefined ? `, ${count} reviews` : ""}`}
      className={cn("flex-row items-center gap-1", className)}
    >
      <Star fill="full" size={16} />
      <Text variant="body-sm-heavy">
        {label}
        {count !== undefined && (
          <Text variant="body-sm" color="secondary">
            {` (${count})`}
          </Text>
        )}
      </Text>
    </View>
  );
}
