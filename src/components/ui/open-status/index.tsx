import { ClockIcon } from "phosphor-react-native/src/icons/Clock";
import { View } from "react-native";

import { tokens } from "@/theme/tokens";

import { cn } from "../lib/cn";
import { Text } from "../text";

export type Status = "open" | "closing" | "closed";

const STATUS = {
  open: { label: "Open", detail: "until", text: "text-status-open", icon: tokens.status["open-icon"] },
  closing: { label: "Closing", detail: "at", text: "text-status-closing", icon: tokens.status["closing-icon"] },
  closed: { label: "Closed", detail: "opens", text: "text-status-closed", icon: tokens.status["closed-icon"] },
} as const;

const SIZE = {
  sm: { icon: 16, label: "body-md-strong", detail: "body-md" }, // cards
  lg: { icon: 20, label: "body-lg-strong", detail: "body-lg" }, // details
} as const;

export type OpenStatusProps = {
  status: Status;
  /** e.g. "6:00 PM". Shown as "until …" / "at …" / "opens …". */
  time?: string;
  /** Show the time detail. Defaults to true when `time` is given. */
  showDetail?: boolean;
  size?: keyof typeof SIZE;
  className?: string;
};

/** Open · Closing · Closed, with optional time. */
export function OpenStatus({ status, time, showDetail = true, size = "sm", className }: OpenStatusProps) {
  const s = STATUS[status];
  const z = SIZE[size];
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <ClockIcon size={z.icon} color={s.icon} />
      <Text variant={z.label} color={null} className={s.text}>
        {s.label}
        {showDetail && time && (
          <Text variant={z.detail} color="secondary">
            {` ${s.detail} ${time}`}
          </Text>
        )}
      </Text>
    </View>
  );
}
