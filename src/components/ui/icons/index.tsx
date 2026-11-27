import { SvgProps } from "react-native-svg";

import BookmarkIcon from "./bookmark";
import CaretRightIcon from "./caret-right";
import ClockIcon from "./clock";
import SparkleIcon from "./sparkle";
import StarFullIcon from "./star-full";
import WalkingIcon from "./walking";
export interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

export { BookmarkIcon, CaretRightIcon, ClockIcon, SparkleIcon, StarFullIcon, WalkingIcon };

