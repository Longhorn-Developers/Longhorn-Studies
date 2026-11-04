import { View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import { tokens } from "@/theme/tokens";

// Spacing scale: 3 = 8px, 7 = 24px. Set in style (not className) because they animate.
const DOT = 8;
const DOT_ACTIVE = 24;

type PageDotsProps = {
  count: number;
  /** Scroll position in pages: 0 = first page, 1.5 = halfway between the 2nd and 3rd. */
  progress: SharedValue<number>;
};

/** Page dots: 8px circles, the current page stretches to a 24px pill. Follows the swipe. */
export function PageDots({ count, progress }: PageDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-3">
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} index={i} progress={progress} />
      ))}
    </View>
  );
}

function Dot({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    // 1 when this page is fully in view, 0 once it's a full page away.
    const active = Math.max(0, 1 - Math.abs(progress.value - index));
    return {
      width: DOT + (DOT_ACTIVE - DOT) * active,
      backgroundColor: interpolateColor(active, [0, 1], [tokens.indicator.inactive, tokens.indicator.active]),
    };
  });

  return <Animated.View style={[{ height: DOT, borderRadius: DOT / 2 }, style]} />;
}
