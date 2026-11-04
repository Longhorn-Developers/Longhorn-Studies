import type { Icon } from "phosphor-react-native";
import { BookIcon } from "phosphor-react-native/src/icons/Book";
import { CoffeeIcon } from "phosphor-react-native/src/icons/Coffee";
import { DesktopIcon } from "phosphor-react-native/src/icons/Desktop";
import { InfoIcon } from "phosphor-react-native/src/icons/Info";
import { MicrophoneSlashIcon } from "phosphor-react-native/src/icons/MicrophoneSlash";
import { PizzaIcon } from "phosphor-react-native/src/icons/Pizza";
import { PlugIcon } from "phosphor-react-native/src/icons/Plug";
import { PresentationIcon } from "phosphor-react-native/src/icons/Presentation";
import { PrinterIcon } from "phosphor-react-native/src/icons/Printer";
import { SunIcon } from "phosphor-react-native/src/icons/Sun";
import { TelevisionIcon } from "phosphor-react-native/src/icons/Television";
import { UsersThreeIcon } from "phosphor-react-native/src/icons/UsersThree";
import { Fragment, type ReactNode } from "react";
import { View } from "react-native";

import {
  AMENITIES,
  AREA_TYPES,
  NOISE_LEVELS,
  useOnboardingAnswers,
  type Amenity,
  type AreaType,
  type NoiseLevel,
} from "@/components/onboarding/answers";
import { StepScreen } from "@/components/onboarding/step-screen";
import { SelectionChip, Text } from "@/components/ui";
import { tokens } from "@/theme/tokens";

const ICONS: Record<NoiseLevel | AreaType | Amenity, Icon> = {
  Quiet: MicrophoneSlashIcon,
  Collaborative: UsersThreeIcon,
  Indoor: BookIcon,
  Outdoor: SunIcon,
  Outlets: PlugIcon,
  Printers: PrinterIcon,
  Computers: DesktopIcon,
  Whiteboards: PresentationIcon,
  "TV/Projector": TelevisionIcon,
  "Near drinks": CoffeeIcon,
  "Near food": PizzaIcon,
};

/** Toggle `item` in a pick-many list. */
function toggle<T>(list: readonly T[], item: T) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export default function PreferencesStep() {
  const { answers, update } = useOnboardingAnswers();

  const sections: { title: string; chips: ReactNode }[] = [
    {
      // Pick one; tapping the selected chip again clears it.
      title: "Noise level",
      chips: NOISE_LEVELS.map((v) => (
        <SelectionChip
          key={v}
          label={v}
          icon={ICONS[v]}
          selected={answers.noiseLevel === v}
          onPress={() => update({ noiseLevel: answers.noiseLevel === v ? null : v })}
        />
      )),
    },
    {
      title: "Type of area",
      chips: AREA_TYPES.map((v) => (
        <SelectionChip
          key={v}
          label={v}
          icon={ICONS[v]}
          selected={answers.areaType === v}
          onPress={() => update({ areaType: answers.areaType === v ? null : v })}
        />
      )),
    },
    {
      // Pick many.
      title: "Amenities",
      chips: AMENITIES.map((v) => (
        <SelectionChip
          key={v}
          label={v}
          icon={ICONS[v]}
          selected={answers.amenities.includes(v)}
          onPress={() => update({ amenities: toggle(answers.amenities, v) })}
        />
      )),
    },
  ];

  return (
    <StepScreen step={3} title="What do you need while studying?">
      <View className="gap-6">
        {sections.map(({ title, chips }, i) => (
          <Fragment key={title}>
            {i > 0 && <View className="border-t border-subtle" />}
            <View className="gap-4">
              <Text variant="heading-sm">{title}</Text>
              <View className="flex-row flex-wrap gap-3">{chips}</View>
            </View>
          </Fragment>
        ))}
      </View>

      <View className="flex-row items-center gap-2">
        <InfoIcon size={16} color={tokens.icon.secondary} />
        <Text variant="body-sm" color="secondary">
          You can change these preferences anytime in your profile
        </Text>
      </View>
    </StepScreen>
  );
}
