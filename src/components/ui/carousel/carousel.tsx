import { useRef, useState, type ReactNode } from "react";
import { useWindowDimensions, View, type FlatList } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import { cn } from "../lib/cn";
import { PageDots } from "./page-dots";

export type CarouselProps<T> = {
  data: readonly T[];
  /** What one page shows, e.g. an image with a title and description. */
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  /** Called when a swipe settles on a new page. */
  onIndexChange?: (index: number) => void;
  className?: string;
};

/**
 * Full-width swipe pager with page dots underneath. Each page gets
 * px-6 side padding; the dots sit 24px below the pages.
 */
export function Carousel<T>({ data, renderItem, keyExtractor, onIndexChange, className }: CarouselProps<T>) {
  const window = useWindowDimensions();
  // Pages are as wide as the carousel itself; the window width is the first guess before layout.
  const [width, setWidth] = useState(window.width);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<T>>(null);
  const progress = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    progress.value = e.contentOffset.x / width;
  });

  const goTo = (next: number) => {
    if (next < 0 || next >= data.length) return;
    listRef.current?.scrollToOffset({ offset: next * width, animated: true });
    setIndex(next);
    onIndexChange?.(next);
  };

  return (
    <View className={cn("gap-7", className)} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Animated.FlatList
        ref={listRef}
        data={data}
        keyExtractor={keyExtractor ?? ((_, i) => String(i))}
        renderItem={({ item, index: i }) => (
          <View style={{ width }} className="px-6">
            {renderItem(item, i)}
          </View>
        )}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / width);
          if (next !== index) {
            setIndex(next);
            onIndexChange?.(next);
          }
        }}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />
      {/* Screen readers: swipe up/down on the dots to change page. */}
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Page"
        accessibilityValue={{ text: `${index + 1} of ${data.length}` }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(e) => goTo(e.nativeEvent.actionName === "increment" ? index + 1 : index - 1)}
      >
        <PageDots count={data.length} progress={progress} />
      </View>
    </View>
  );
}
