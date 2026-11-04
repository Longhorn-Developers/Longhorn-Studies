import { View, Text } from "react-native";
import { ClockIcon } from "./icons";

type OpenStatusType = {
  openStatus: "open" | "closing" | "closed";
  hours?: string[];
};

// Full class names as literals so Tailwind/NativeWind can find them at build time.
const STATUS = {
  open: { label: "Open", text: "text-status-open", icon: "text-status-open-icon" },
  closing: { label: "Closing", text: "text-status-closing", icon: "text-status-closing-icon" },
  closed: { label: "Closed", text: "text-status-closed", icon: "text-status-closed-icon" },
} as const;

export default function OpenStatus({ openStatus, hours }: OpenStatusType) {
  const status = STATUS[openStatus];
  return (
    <View className="flex flex-row items-center gap-2">
      <ClockIcon size={16} className={status.icon} />
      <Text className={`${status.text} text-body-sm-strong`}>{status.label}</Text>
      {hours && openStatus !== "closed" && <Text className="text-body-sm text-secondary">until {hours[1]}</Text>}
      {hours && openStatus === "closed" && <Text className="text-body-sm text-secondary">until {hours[0]}</Text>}
    </View>
  );
}
