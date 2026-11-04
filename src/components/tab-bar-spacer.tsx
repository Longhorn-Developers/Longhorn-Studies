import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabInset } from "@/constants/theme";

/**
 * Blank space as tall as the bottom tab bar plus the home indicator. Put it last
 * inside a page's ScrollView so the final item can scroll clear of the tab bar.
 * On web the tab bar sits at the top, so this renders 0px tall.
 */
export function TabBarSpacer() {
  const { bottom } = useSafeAreaInsets();
  return <View style={{ height: bottom + BottomTabInset }} />;
}
