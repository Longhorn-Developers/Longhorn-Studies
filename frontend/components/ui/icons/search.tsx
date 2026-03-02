import React from "react";
import Svg, { Path } from "react-native-svg";

import type { IconProps } from ".";

import { cssInterop } from "nativewind";

// 1. Tell NativeWind to intercept the `className` prop and apply it as a style to the Svg
cssInterop(Svg, {
  className: {
    target: "style",
  },
});

export default function SearchIcon({
  color = "#6B7280",
  size = 16,
  ...props
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        d="M14.5833 14.5834L9.91674 9.91671M11.4722 6.02782C11.4722 9.03471 9.03467 11.4723 6.02778 11.4723C3.0209 11.4723 0.583332 9.03471 0.583332 6.02782C0.583332 3.02094 3.0209 0.583374 6.02778 0.583374C9.03467 0.583374 11.4722 3.02094 11.4722 6.02782Z"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}