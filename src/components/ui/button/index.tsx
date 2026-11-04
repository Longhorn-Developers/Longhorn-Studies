import { Pressable, type PressableProps } from "react-native";

import { cn } from "../lib/cn";
import { Text } from "../text";

// Literal class strings so Tailwind can find them. `active:` = while pressed.
const VARIANT = {
  primary: {
    box: "bg-action-primary active:bg-action-primary-pressed",
    disabled: "bg-action-disabled",
    text: "on-brand",
  },
  secondary: {
    box: "border bg-surface border-brand active:bg-action-secondary-pressed active:border-action-primary-pressed",
    disabled: "border bg-surface border-default",
    text: "brand-strong",
  },
  tertiary: {
    box: "active:bg-action-secondary-pressed",
    disabled: "",
    text: "brand-strong",
  },
} as const;

// lg: 46px, the onboarding CTA.
const SIZE = { md: "h-[44px]", lg: "h-[46px]" } as const;

export type ButtonVariant = keyof typeof VARIANT;

export type ButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  variant?: ButtonVariant;
  size?: keyof typeof SIZE;
  /** Stretch to the parent's width (e.g. onboarding CTAs). */
  fullWidth?: boolean;
  className?: string;
};

/** Primary · Secondary · Tertiary, each Default / Pressed / Disabled. */
export function Button({
  label,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const v = VARIANT[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={cn(
        "flex-row items-center justify-center rounded-2 px-5",
        fullWidth ? "self-stretch" : "self-start",
        SIZE[size],
        disabled ? v.disabled : v.box,
        className
      )}
      {...props}
    >
      <Text variant="body-lg-strong" color={disabled ? "disabled" : v.text}>
        {label}
      </Text>
    </Pressable>
  );
}
