import { cssInterop } from "nativewind";
import { TextInput } from "react-native";

// Lets TextInput take `placeholderClassName="text-secondary"` (a token class)
// instead of a hex placeholderTextColor. Import this module from any
// component that uses placeholderClassName.
cssInterop(TextInput, {
  className: { target: "style" },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
});

/** Shared input text style: body.large size + Regular face, no lineHeight (it misaligns single-line inputs on iOS). */
export const INPUT_TEXT = "flex-1 p-0 text-[16px] font-figtree text-primary";
