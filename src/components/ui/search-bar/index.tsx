import { cssInterop } from "nativewind";
import { MagnifyingGlassIcon, XIcon } from "phosphor-react-native";
import { useRef, useState, type Ref } from "react";
import { Pressable, TextInput, type TextInputInstance, type TextInputProps } from "react-native";

import { tokens } from "@/theme/tokens";

import { cn } from "../lib/cn";

// Lets the placeholder color come from a token class instead of a hex.
cssInterop(TextInput, {
  className: { target: "style" },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
});

export type SearchBarProps = Omit<TextInputProps, "className" | "placeholderTextColor"> & {
  /** Called after the clear (×) button empties the field. */
  onClear?: () => void;
  className?: string;
  ref?: Ref<TextInputInstance>;
};

/**
 * Home search. States:
 * - Default: border/strong
 * - Focused: 2px border/brand
 * - Filled: shows a clear (×) button
 * Works controlled (`value` + `onChangeText`) or uncontrolled (`defaultValue`).
 */
export function SearchBar({
  value,
  defaultValue,
  onChangeText,
  onClear,
  onFocus,
  onBlur,
  placeholder = "Search study spot by name",
  className,
  ref,
  ...props
}: SearchBarProps) {
  const inputRef = useRef<TextInputInstance>(null);
  const [focused, setFocused] = useState(false);
  const [innerValue, setInnerValue] = useState(defaultValue ?? "");
  const text = value ?? innerValue;

  const setRefs = (node: TextInputInstance | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const handleChange = (next: string) => {
    if (value === undefined) setInnerValue(next);
    onChangeText?.(next);
  };

  const clear = () => {
    handleChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <Pressable
      // Tapping anywhere on the pill focuses the input.
      onPress={() => inputRef.current?.focus()}
      accessible={false}
      className={cn(
        "flex-row items-center gap-3 rounded-full bg-surface",
        // The focused border is 1px thicker, so padding shrinks by 1px to keep the size steady.
        focused ? "border-2 border-brand px-[15px] py-[11px]" : "border border-strong px-5 py-4",
        className
      )}
    >
      <MagnifyingGlassIcon size={20} color={tokens.icon.primary} />
      <TextInput
        ref={setRefs}
        value={text}
        onChangeText={handleChange}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholder={placeholder}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        autoCorrect={false}
        // body.large size + Regular face; no lineHeight (it misaligns single-line inputs on iOS).
        className="flex-1 p-0 text-[16px] font-figtree text-primary"
        placeholderClassName="text-disabled"
        {...props}
      />
      {text.length > 0 && (
        <Pressable onPress={clear} hitSlop={12} accessibilityRole="button" accessibilityLabel="Clear search">
          <XIcon size={20} color={tokens.icon.secondary} />
        </Pressable>
      )}
    </Pressable>
  );
}
