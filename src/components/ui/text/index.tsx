import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { cn } from "../lib/cn";

// Literal class strings so Tailwind can find them at build time.
const VARIANT = {
  "heading-lg": "text-heading-lg",
  "heading-md": "text-heading-md",
  "heading-sm": "text-heading-sm",
  "body-lg": "text-body-lg",
  "body-lg-strong": "text-body-lg-strong",
  "body-lg-heavy": "text-body-lg-heavy",
  "body-md": "text-body-md",
  "body-md-strong": "text-body-md-strong",
  "body-md-heavy": "text-body-md-heavy",
  "body-sm": "text-body-sm",
  "body-sm-strong": "text-body-sm-strong",
  "body-sm-heavy": "text-body-sm-heavy",
} as const;

const COLOR = {
  primary: "text-primary",
  secondary: "text-secondary",
  disabled: "text-disabled",
  brand: "text-brand",
  "brand-strong": "text-brand-strong",
  "on-brand": "text-on-brand",
} as const;

export type TextVariant = keyof typeof VARIANT;
export type TextColor = keyof typeof COLOR;

export type TextProps = RNTextProps & {
  /** Typography token. Defaults to body-md. */
  variant?: TextVariant;
  /**
   * Text color token. Defaults to primary. Pass `null` to leave color to
   * `className` (e.g. status colors). Don't set a text color in `className`
   * while this is set — with no class merging, the winner isn't predictable.
   */
  color?: TextColor | null;
};

export function Text({ variant = "body-md", color = "primary", className, ...props }: TextProps) {
  return <RNText className={cn(VARIANT[variant], color && COLOR[color], className)} {...props} />;
}
