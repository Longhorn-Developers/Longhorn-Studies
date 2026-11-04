import { View } from "react-native";

import { cn } from "../lib/cn";

export type ProgressBarProps = {
  /** Number of segments. */
  total: number;
  /** Current step, 1-based. Segments 1 through `current` are filled. */
  current: number;
  className?: string;
};

/** Segmented step bar: 4px tall, equal segments filling the width. */
export function ProgressBar({ total, current, className }: ProgressBarProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current} of ${total}`}
      accessibilityValue={{ min: 0, max: total, now: current }}
      className={cn("flex-row gap-2", className)}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={cn("h-[4px] flex-1 rounded-full", i < current ? "bg-progress-fill" : "bg-progress-track")}
        />
      ))}
    </View>
  );
}
