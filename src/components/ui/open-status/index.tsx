import { ClockIcon } from "phosphor-react-native";
import { View } from "react-native";

import { tokens } from "@/theme/tokens";
import { cn } from "../lib/cn";
import { Text } from "../text";

export type Status = "open" | "closing" | "closed";

const STATUS = {
  open: { label: "Open", text: "text-status-open", icon: tokens.status["open-icon"] },
  closing: { label: "Closing", text: "text-status-closing", icon: tokens.status["closing-icon"] },
  closed: { label: "Closed", text: "text-status-closed", icon: tokens.status["closed-icon"] },
} as const;

export type OpenStatusProps = {
  status: Status;
  /** Shown as "until …", e.g. "5:00 PM". */
  until?: string;
  className?: string;
};

/** Inline clock icon + status label + optional "until" time. */
export function OpenStatus({ status, until, className }: OpenStatusProps) {
  const s = STATUS[status];
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <ClockIcon size={16} color={s.icon} />
      <Text variant="body-sm-strong" color={null} className={s.text}>
        {s.label}
      </Text>
      {until && (
        <Text variant="body-sm" color="secondary">
          until {until}
        </Text>
      )}
    </View>
  );
}
