import { StarHalfIcon } from "phosphor-react-native/src/icons/StarHalf";
import { StarIcon } from "phosphor-react-native/src/icons/Star";

import { tokens } from "@/theme/tokens";

export type StarFill = "full" | "half" | "empty";

export type StarProps = {
  fill: StarFill;
  size?: number;
};

/** One star: Full / Half / Empty. Filled in rating/fill, empty outline in rating/empty. */
export function Star({ fill, size = 24 }: StarProps) {
  if (fill === "full") return <StarIcon size={size} weight="fill" color={tokens.rating.fill} />;
  if (fill === "half") return <StarHalfIcon size={size} weight="fill" color={tokens.rating.fill} />;
  return <StarIcon size={size} weight="regular" color={tokens.rating.empty} />;
}
