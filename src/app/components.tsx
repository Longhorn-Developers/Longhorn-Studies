import {
  BookmarkSimpleIcon,
  CaretRightIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PersonSimpleWalkIcon,
  XIcon,
} from "phosphor-react-native";
import { type ReactNode, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StudySpotCard from "@/components/study-spot-card";
import {
  OpenStatus,
  SaveButton,
  SearchBar,
  Tag,
  Text,
  type TextColor,
  type TextVariant,
} from "@/components/ui";
import { tokens } from "@/theme/tokens";

// Dev showcase of every design token and UI component.
// Class strings are written out in full so Tailwind can find them.

const PRIMITIVES: { name: string; swatches: [string, string][] }[] = [
  { name: "base", swatches: [["white", "bg-white"]] },
  {
    name: "orange",
    swatches: [
      ["50", "bg-orange-50"], ["100", "bg-orange-100"], ["200", "bg-orange-200"], ["300", "bg-orange-300"],
      ["400", "bg-orange-400"], ["500", "bg-orange-500"], ["600", "bg-orange-600"], ["700", "bg-orange-700"],
      ["800", "bg-orange-800"], ["900", "bg-orange-900"],
    ],
  },
  {
    name: "slate",
    swatches: [
      ["50", "bg-slate-50"], ["100", "bg-slate-100"], ["200", "bg-slate-200"], ["300", "bg-slate-300"],
      ["400", "bg-slate-400"], ["500", "bg-slate-500"], ["600", "bg-slate-600"], ["700", "bg-slate-700"],
      ["800", "bg-slate-800"], ["900", "bg-slate-900"],
    ],
  },
  { name: "limestone", swatches: [["100", "bg-limestone-100"], ["200", "bg-limestone-200"], ["300", "bg-limestone-300"]] },
  { name: "green", swatches: [["100", "bg-green-100"], ["500", "bg-green-500"], ["700", "bg-green-700"]] },
  { name: "amber", swatches: [["100", "bg-amber-100"], ["500", "bg-amber-500"], ["700", "bg-amber-700"]] },
  { name: "red", swatches: [["100", "bg-red-100"], ["500", "bg-red-500"], ["700", "bg-red-700"]] },
];

const TYPE: [TextVariant, string][] = [
  ["heading-lg", "Bold · 28/36"],
  ["heading-md", "Bold · 23/28"],
  ["heading-sm", "Bold · 19/24"],
  ["body-lg", "Regular · 16/22"],
  ["body-lg-strong", "SemiBold · 16/22"],
  ["body-lg-heavy", "Bold · 16/22"],
  ["body-md", "Regular · 13/18"],
  ["body-md-strong", "SemiBold · 13/18"],
  ["body-md-heavy", "Bold · 13/18"],
  ["body-sm", "Regular · 12/16"],
  ["body-sm-strong", "SemiBold · 12/16"],
  ["body-sm-heavy", "Bold · 12/16"],
];

const TEXT_COLORS: TextColor[] = ["primary", "secondary", "disabled", "brand", "brand-strong"];

const BG_TOKENS: [string, string][] = [
  ["bg/page", "bg-page"],
  ["bg/surface", "bg-surface"],
  ["bg/subtle", "bg-subtle"],
  ["bg/brand", "bg-brand"],
  ["action/primary", "bg-action-primary"],
  ["action/primary-pressed", "bg-action-primary-pressed"],
  ["action/disabled", "bg-action-disabled"],
  ["filter/active-bg", "bg-filter-active"],
  ["saved/bg", "bg-saved"],
  ["status/open-bg", "bg-status-open"],
  ["status/closing-bg", "bg-status-closing"],
  ["status/closed-bg", "bg-status-closed"],
];

const BORDER_TOKENS: [string, string][] = [
  ["border/default", "border-default"],
  ["border/subtle", "border-subtle"],
  ["border/strong", "border-strong"],
  ["border/brand", "border-brand"],
];

// Widths match the spacing scale: 1=2px … 8=32px.
const SPACING: [string, string, string][] = [
  ["1", "2px", "w-1"], ["2", "4px", "w-2"], ["3", "8px", "w-3"], ["4", "12px", "w-4"],
  ["5", "16px", "w-5"], ["6", "20px", "w-6"], ["7", "24px", "w-7"], ["8", "32px", "w-8"],
];

const RADIUS: [string, string, string][] = [
  ["radius2", "8px", "rounded-2"],
  ["radius3", "16px", "rounded-3"],
  ["radius4", "32px", "rounded-4"],
];

const ICONS = [
  ["Clock", ClockIcon],
  ["BookmarkSimple", BookmarkSimpleIcon],
  ["CaretRight", CaretRightIcon],
  ["PersonSimpleWalk", PersonSimpleWalkIcon],
  ["MagnifyingGlass", MagnifyingGlassIcon],
  ["X", XIcon],
] as const;

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <View className="gap-4 border-t border-subtle pt-6">
      <View className="gap-1">
        <Text variant="heading-sm">{title}</Text>
        {note && <Text color="secondary">{note}</Text>}
      </View>
      {children}
    </View>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <Text variant="body-sm" color="secondary">
      {children}
    </Text>
  );
}

export default function ComponentsScreen() {
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-page">
      <ScrollView contentContainerClassName="gap-7 px-5 pt-5 pb-8">
        <View className="gap-1">
          <Text variant="heading-lg">Components</Text>
          <Text color="secondary">Every token and UI component in the app.</Text>
        </View>

        {/* ── Components ─────────────────────────── */}
        <Section title="Search bar" note="Tap the first one to see Focused; type to see the clear button.">
          <SearchBar value={search} onChangeText={setSearch} />
          <Label>Filled (with clear)</Label>
          <SearchBar defaultValue="Cactus Cafe" />
        </Section>

        <Section title="Study spot card">
          <StudySpotCard
            buildingName="UNB"
            locationName="Texas Union"
            location=""
            hours={["7:00 AM", "5:00 PM"]}
            tags={["Lounge", "Low Noise", "Near Food & Cafe"]}
          />
        </Section>

        <Section title="Open status">
          <OpenStatus status="open" until="5:00 PM" />
          <OpenStatus status="closing" until="5:00 PM" />
          <OpenStatus status="closed" until="7:00 AM" />
        </Section>

        <Section title="Tag">
          <View className="flex-row flex-wrap gap-2">
            <Tag label="Lounge" />
            <Tag label="Low Noise" />
            <Tag label="Near Food & Cafe" />
          </View>
        </Section>

        <Section title="Save button" note={`Tap to toggle (filled when saved) — currently ${saved ? "saved" : "not saved"}.`}>
          <SaveButton saved={saved} onPress={() => setSaved((s) => !s)} />
        </Section>

        <Section title="Icons" note="phosphor-react-native · color from tokens.icon.*">
          <View className="flex-row flex-wrap gap-5">
            {ICONS.map(([name, Icon]) => (
              <View key={name} className="items-center gap-2">
                <Icon size={24} color={tokens.icon.primary} />
                <Label>{name}</Label>
              </View>
            ))}
          </View>
        </Section>

        {/* ── Tokens ─────────────────────────────── */}
        <Section title="Typography" note="Figtree. Size / line height in px.">
          {TYPE.map(([variant, spec]) => (
            <View key={variant} className="gap-1">
              <Text variant={variant}>{variant.replace(/-/g, ".")}</Text>
              <Label>{spec}</Label>
            </View>
          ))}
        </Section>

        <Section title="Text colors">
          {TEXT_COLORS.map((color) => (
            <Text key={color} variant="body-lg-strong" color={color}>
              text/{color}
            </Text>
          ))}
          <View className="self-start rounded-2 bg-brand px-4 py-3">
            <Text variant="body-lg-strong" color="on-brand">
              text/on-brand
            </Text>
          </View>
        </Section>

        <Section title="Background tokens">
          <View className="flex-row flex-wrap gap-4">
            {BG_TOKENS.map(([name, cls]) => (
              <View key={name} className="w-[96px] gap-2">
                <View className={`h-8 rounded-2 border border-subtle ${cls}`} />
                <Label>{name}</Label>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Border tokens">
          <View className="flex-row flex-wrap gap-4">
            {BORDER_TOKENS.map(([name, cls]) => (
              <View key={name} className="w-[96px] gap-2">
                <View className={`h-8 rounded-2 border-2 bg-surface ${cls}`} />
                <Label>{name}</Label>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Primitives">
          {PRIMITIVES.map((group) => (
            <View key={group.name} className="gap-2">
              <Text variant="body-md-strong">{group.name}</Text>
              <View className="flex-row flex-wrap gap-2">
                {group.swatches.map(([shade, cls]) => (
                  <View key={shade} className="items-center gap-1">
                    <View className={`h-8 w-8 rounded-2 border border-subtle ${cls}`} />
                    <Label>{shade}</Label>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Section>

        <Section title="Spacing" note="4px-based scale. Note p-4 = 12px, not Tailwind's 16px.">
          <View className="flex-row items-end gap-4">
            {SPACING.map(([step, px, cls]) => (
              <View key={step} className="items-center gap-1">
                <View className={`h-8 bg-orange-100 ${cls}`} />
                <Text variant="body-sm-strong">{step}</Text>
                <Label>{px}</Label>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Radius">
          <View className="flex-row gap-5">
            {RADIUS.map(([name, px, cls]) => (
              <View key={name} className="items-center gap-2">
                <View className={`h-[64px] w-[64px] border border-brand bg-subtle ${cls}`} />
                <Text variant="body-sm-strong">{name}</Text>
                <Label>{px}</Label>
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
