import { View } from "react-native";

import { cn } from "../lib/cn";
import { Star, type StarFill } from "./star";

const STAR_RATING_SIZE = {
  sm: { star: 16, gap: "gap-1" },
  lg: { star: 32, gap: "gap-3" },
} as const;

export type StarRatingProps = {
  /** 0–5. Rounded to the nearest half star. */
  value: number;
  size?: keyof typeof STAR_RATING_SIZE;
  className?: string;
};

/** 5-star scale. */
export function StarRating({ value, size = "sm", className }: StarRatingProps) {
  const s = STAR_RATING_SIZE[size];
  const halves = Math.round(Math.min(5, Math.max(0, value)) * 2);
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${halves / 2} out of 5 stars`}
      className={cn("flex-row items-center", s.gap, className)}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const left = halves - i * 2;
        const fill: StarFill = left >= 2 ? "full" : left === 1 ? "half" : "empty";
        return <Star key={i} fill={fill} size={s.star} />;
      })}
    </View>
  );
}
