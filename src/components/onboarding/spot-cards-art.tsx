import { Image } from "expo-image";
import { View } from "react-native";

import { AmenityTag, BookmarkButton, Star, Text } from "@/components/ui";

// Sizes measured from the onboarding mockup (393pt-wide screen).
const CARD_WIDTH = 290;
const FRONT_PHOTO = 150;
const BACK_PHOTO = 132;
const BACK_HEIGHT = 233;
// Soft drop shadow under both cards. Not in the token sheet.
const SHADOW = "0px 4px 24px rgba(26, 32, 36, 0.12)";

// Placeholder photos until the real ones are ready.
const FRONT_IMAGE = "https://picsum.photos/seed/szb-lounge/600/320";
const BACK_IMAGE = "https://picsum.photos/seed/pcl-atrium/600/280";

/**
 * Two stacked study spot cards: a front card with details and a back card
 * tilted 5° behind it. Decorative only — not tappable, hidden from screen readers.
 */
export function SpotCardsArt() {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      // Includes room below the front card for its shadow.
      style={{ width: 335, height: 358 }}
    >
      {/* Back card */}
      <View
        className="absolute rounded-3 bg-surface"
        style={{ left: 35, top: 12, width: CARD_WIDTH, height: BACK_HEIGHT, transform: [{ rotate: "5deg" }], boxShadow: SHADOW }}
      >
        <View className="overflow-hidden rounded-t-3">
          <Image source={BACK_IMAGE} style={{ height: BACK_PHOTO }} />
        </View>
        <BookmarkButton size="lg" className="absolute right-4 top-5 bg-surface" />
      </View>

      {/* Front card */}
      <View className="absolute rounded-3 bg-surface" style={{ left: 0, top: 65, width: CARD_WIDTH, boxShadow: SHADOW }}>
        <View className="overflow-hidden rounded-t-3">
          <Image source={FRONT_IMAGE} style={{ height: FRONT_PHOTO }} />
        </View>
        <BookmarkButton size="lg" className="absolute right-4 top-5 bg-surface" />
        <View className="gap-3 px-5 pb-5 pt-4">
          <View className="gap-1">
            <Text variant="body-lg-heavy">SZB Student Lounge</Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Text variant="body-sm-heavy" color="secondary">
                  4.2
                </Text>
                <Star fill="full" size={14} />
              </View>
              <Text variant="body-sm" color="secondary">
                0.2 mi
              </Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <AmenityTag label="Quiet" />
            <AmenityTag label="Outlets" />
            <AmenityTag label="Whiteboards" />
          </View>
        </View>
      </View>
    </View>
  );
}
