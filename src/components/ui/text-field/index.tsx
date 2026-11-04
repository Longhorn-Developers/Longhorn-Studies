import { CheckIcon } from "phosphor-react-native/src/icons/Check";
import { useRef, useState, type Ref } from "react";
import { Pressable, Text as RNText, TextInput, View, type TextInputInstance, type TextInputProps } from "react-native";

import { tokens } from "@/theme/tokens";

import { cn } from "../lib/cn";
import { mergeRefs } from "../lib/merge-refs";
import { INPUT_TEXT } from "../lib/text-input";
import { Text } from "../text";

export type TextFieldProps = Omit<TextInputProps, "className" | "placeholderTextColor"> & {
  label: string;
  /** Shows a green check, e.g. username available. */
  valid?: boolean;
  /** Fixed text before the input that can't be deleted, e.g. "@". */
  prefix?: string;
  className?: string;
  ref?: Ref<TextInputInstance>;
};

/**
 * Labeled input for sign-up and profile. States:
 * - Default: border/strong
 * - Focused: 2px border/brand
 * - Valid: green check on the right
 */
export function TextField({ label, valid = false, prefix, onFocus, onBlur, className, ref, ...props }: TextFieldProps) {
  const inputRef = useRef<TextInputInstance>(null);
  const [focused, setFocused] = useState(false);

  return (
    <View className={cn("gap-3", className)}>
      <Text variant="body-md-strong">{label}</Text>
      <Pressable
        // Tapping anywhere on the box focuses the input.
        onPress={() => inputRef.current?.focus()}
        accessible={false}
        className={cn(
          "flex-row items-center rounded-2 bg-surface",
          // The focused border is 1px thicker, so padding shrinks by 1px to keep the size steady.
          focused ? "border-2 border-brand px-[15px] py-[11px]" : "border border-strong px-5 py-4"
        )}
      >
        {prefix && (
          // Same style as the input text so "@" and the typed name read as one value.
          <RNText className="text-[16px] font-figtree text-primary">{prefix}</RNText>
        )}
        <TextInput
          ref={mergeRefs(inputRef, ref)}
          accessibilityLabel={label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={INPUT_TEXT}
          placeholderClassName="text-secondary"
          {...props}
        />
        {valid && (
          <View accessible accessibilityLabel="Valid" className="ml-3">
            <CheckIcon size={20} color={tokens.status["open-icon"]} />
          </View>
        )}
      </Pressable>
    </View>
  );
}
