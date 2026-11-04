import { Text as RNText, type TextProps } from "react-native";

import { cn } from "../lib/cn";

const VARIANT = {
  /** Log in, Upload photo. */
  brand: "text-body-md-strong text-brand-strong",
  /** Skip in the top bar. */
  neutral: "text-body-md text-secondary",
} as const;

export type TextLinkProps = Omit<TextProps, "children"> & {
  label: string;
  variant?: keyof typeof VARIANT;
  onPress: () => void;
};

/** Inline tappable text. Works on its own or nested inside a <Text>. */
export function TextLink({ label, variant = "brand", className, ...props }: TextLinkProps) {
  return (
    <RNText accessibilityRole="link" className={cn(VARIANT[variant], className)} {...props}>
      {label}
    </RNText>
  );
}
