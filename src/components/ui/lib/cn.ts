/** Joins class names, skipping falsy values: cn("a", cond && "b"). */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
