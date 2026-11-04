import type { Icon as PhosphorIcon } from "phosphor-react-native";
import { BookmarkSimpleIcon } from "phosphor-react-native/src/icons/BookmarkSimple";
import { CaretRightIcon } from "phosphor-react-native/src/icons/CaretRight";
import { CheckIcon } from "phosphor-react-native/src/icons/Check";
import { ClockIcon } from "phosphor-react-native/src/icons/Clock";
import { CoffeeIcon } from "phosphor-react-native/src/icons/Coffee";
import { HouseIcon } from "phosphor-react-native/src/icons/House";
import { MagnifyingGlassIcon } from "phosphor-react-native/src/icons/MagnifyingGlass";
import { PersonSimpleWalkIcon } from "phosphor-react-native/src/icons/PersonSimpleWalk";
import { PlugIcon } from "phosphor-react-native/src/icons/Plug";
import { QuestionIcon } from "phosphor-react-native/src/icons/Question";
import { SpeakerSimpleLowIcon } from "phosphor-react-native/src/icons/SpeakerSimpleLow";
import { StarHalfIcon } from "phosphor-react-native/src/icons/StarHalf";
import { StarIcon } from "phosphor-react-native/src/icons/Star";
import { TreeIcon } from "phosphor-react-native/src/icons/Tree";
import { WifiHighIcon } from "phosphor-react-native/src/icons/WifiHigh";
import { XIcon } from "phosphor-react-native/src/icons/X";
import { Image } from "expo-image";
import { type ReactNode, useState } from "react";
import { ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StudySpotCard from "@/components/study-spot-card";
import { TabBarSpacer } from "@/components/tab-bar-spacer";
import {
  AmenityTag,
  BookmarkButton,
  Button,
  Carousel,
  OpenStatus,
  PhotoPicker,
  pickPhoto,
  ProgressBar,
  Rating,
  SearchBar,
  SelectionChip,
  Star,
  StarRating,
  Text,
  type TextColor,
  TextField,
  TextLink,
  type TextVariant,
} from "@/components/ui";
import { resetOnboarding } from "@/lib/onboarding";
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

// Placeholder photos until the onboarding art is ready.
const SLIDES = [
  { image: "https://picsum.photos/seed/lounge/800/600", title: "Find your next study spot", body: "Browse spots across campus with photos, hours and what floor to head to." },
  { image: "https://picsum.photos/seed/library/800/600", title: "Filter by what you need", body: "Quiet, outlets, whiteboards: show only the spots that fit." },
  { image: "https://picsum.photos/seed/campus/800/600", title: "Save your favorites", body: "Bookmark the spots you like so they're one tap away." },
];

const AMENITIES: { label: string; icon: PhosphorIcon }[] = [
  { label: "Low Noise", icon: SpeakerSimpleLowIcon },
  { label: "Wi-Fi", icon: WifiHighIcon },
  { label: "Outlets", icon: PlugIcon },
  { label: "Near Food & Cafe", icon: CoffeeIcon },
];

const AREAS: { label: string; icon: PhosphorIcon }[] = [
  { label: "Indoor", icon: HouseIcon },
  { label: "Outdoor", icon: TreeIcon },
];

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"];

const ICONS = [
  ["Clock", ClockIcon],
  ["BookmarkSimple", BookmarkSimpleIcon],
  ["CaretRight", CaretRightIcon],
  ["PersonSimpleWalk", PersonSimpleWalkIcon],
  ["MagnifyingGlass", MagnifyingGlassIcon],
  ["X", XIcon],
  ["Star", StarIcon],
  ["StarHalf", StarHalfIcon],
  ["Question", QuestionIcon],
  ["Check", CheckIcon],
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
  const [showDetail, setShowDetail] = useState(true);
  const [picked, setPicked] = useState<string[]>(["Outlets"]);
  const [savedSm, setSavedSm] = useState(false);
  const [savedLg, setSavedLg] = useState(false);
  const [username, setUsername] = useState("meggiedo");
  const [linkTaps, setLinkTaps] = useState(0);
  const [area, setArea] = useState("Indoor");
  const [photo, setPhoto] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>(["Junior"]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-page">
      <ScrollView contentContainerClassName="gap-7 px-5 pt-5 pb-8">
        <View className="gap-1">
          <Text variant="heading-lg">Components</Text>
          <Text color="secondary">Every token and UI component in the app.</Text>
        </View>

        {__DEV__ && (
          <Section title="Developer" note="Dev builds only. Clears the saved flag and sends you back to onboarding.">
            <Button label="Replay onboarding" variant="secondary" onPress={resetOnboarding} />
          </Section>
        )}

        {/* ── Components ─────────────────────────── */}
        <Section title="Progress bar" note="Segments 1 through the current step are filled.">
          {[1, 2, 3].map((n) => (
            <ProgressBar key={n} total={3} current={n} />
          ))}
        </Section>

        <Section title="Photo picker" note="Tap to pick from your library. Long-press to clear.">
          <PhotoPicker
            uri={photo}
            onPress={async () => {
              const uri = await pickPhoto();
              if (uri) setPhoto(uri);
            }}
            onLongPress={() => setPhoto(null)}
          />
        </Section>

        <Section title="Carousel" note="Swipe the slides; the dots follow your finger.">
          {/* -mx-5 cancels the page padding so slides span the screen like onboarding. */}
          <Carousel
            className="-mx-5"
            data={SLIDES}
            keyExtractor={(s) => s.title}
            renderItem={(s) => (
              <View className="items-center gap-4">
                <Image source={s.image} style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 16 }} />
                <Text variant="heading-md" className="text-center">{s.title}</Text>
                <Text variant="body-lg" color="secondary" className="text-center">{s.body}</Text>
              </View>
            )}
          />
        </Section>

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

        <Section title="Star · Star rating · Rating" note="5-star scale (Full/Half/Empty). Cards show Rating: star + decimal, count optional.">
          <Label>Star: full · half · empty</Label>
          <View className="flex-row gap-5">
            <Star fill="full" />
            <Star fill="half" />
            <Star fill="empty" />
          </View>
          <Label>Star rating: sm · lg</Label>
          <StarRating value={4.5} size="sm" />
          <StarRating value={4.5} size="lg" />
          <Label>Rating: without · with count</Label>
          <View className="flex-row gap-6">
            <Rating value={4.2} />
            <Rating value={4.2} count={128} />
          </View>
        </Section>

        <Section title="Open status" note="Small on cards, Large on details. Toggle the time detail.">
          <View className="flex-row items-center justify-between">
            <Label>Show detail</Label>
            <Switch value={showDetail} onValueChange={setShowDetail} />
          </View>
          {(["sm", "lg"] as const).map((size) => (
            <View key={size} className="gap-3">
              <Label>{size === "sm" ? "Small" : "Large"}</Label>
              <OpenStatus status="open" time="6:00 PM" size={size} showDetail={showDetail} />
              <OpenStatus status="closing" time="5:00 PM" size={size} showDetail={showDetail} />
              <OpenStatus status="closed" time="8:00 AM" size={size} showDetail={showDetail} />
            </View>
          ))}
        </Section>

        <Section title="Amenity tag" note="Small on cards, Medium on details. Pass any Phosphor icon + label. Tap the bottom row to toggle.">
          <Label>Neutral · Selected · Brand (sm)</Label>
          <View className="flex-row flex-wrap gap-3">
            <AmenityTag icon={QuestionIcon} label="Low Noise" />
            <AmenityTag icon={QuestionIcon} label="Low Noise" variant="selected" />
            <AmenityTag icon={QuestionIcon} label="Low Noise" variant="brand" />
          </View>
          <Label>Neutral · Selected · Brand (md)</Label>
          <View className="flex-row flex-wrap gap-3">
            <AmenityTag icon={QuestionIcon} label="Low Noise" size="md" />
            <AmenityTag icon={QuestionIcon} label="Low Noise" size="md" variant="selected" />
            <AmenityTag icon={QuestionIcon} label="Low Noise" size="md" variant="brand" />
          </View>
          <Label>Custom icons · tappable</Label>
          <View className="flex-row flex-wrap gap-3">
            {[...AMENITIES, { label: "No icon", icon: undefined }].map(({ label, icon }) => (
              <AmenityTag
                key={label}
                icon={icon}
                label={label}
                size="md"
                variant={picked.includes(label) ? "selected" : "neutral"}
                onPress={() =>
                  setPicked((p) => (p.includes(label) ? p.filter((x) => x !== label) : [...p, label]))
                }
              />
            ))}
          </View>
        </Section>

        <Section title="Bookmark button" note="Small on card photos, Large in the details header. Tap to toggle.">
          <View className="flex-row items-center gap-6">
            <BookmarkButton size="sm" saved={savedSm} onPress={() => setSavedSm((v) => !v)} />
            <BookmarkButton size="sm" saved />
            <BookmarkButton size="lg" saved={savedLg} onPress={() => setSavedLg((v) => !v)} />
            <BookmarkButton size="lg" saved />
          </View>
        </Section>

        <Section title="Button" note="Primary, Secondary, Tertiary · Default / Pressed / Disabled. Press and hold to see Pressed.">
          {(["primary", "secondary", "tertiary"] as const).map((variant) => (
            <View key={variant} className="gap-2">
              <Label>{variant}</Label>
              <View className="flex-row flex-wrap gap-4">
                <Button label="Button" variant={variant} onPress={() => {}} />
                <Button label="Button" variant={variant} disabled />
              </View>
            </View>
          ))}
        </Section>

        <Section title="Text field" note="Labeled input for sign-up and profile. Optional fixed prefix (@). Valid shows a check (type 3+ characters).">
          <TextField label="Username" prefix="@" placeholder="username-example" autoCapitalize="none" />
          <TextField
            label="Username"
            prefix="@"
            placeholder="username-example"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            valid={username.length >= 3}
          />
        </Section>

        <Section title="Text link" note="Brand for Log in / Upload photo, Neutral for Skip.">
          <View className="flex-row gap-6">
            <TextLink label="Log in" onPress={() => setLinkTaps((n) => n + 1)} />
            <TextLink label="Skip" variant="neutral" onPress={() => setLinkTaps((n) => n + 1)} />
          </View>
          <Text color="secondary">
            Already have an account? <TextLink label="Log in" onPress={() => setLinkTaps((n) => n + 1)} />
          </Text>
          <Label>Tapped {linkTaps} times</Label>
        </Section>

        <Section title="Selection chip" note="Pick-one (top) or pick-many (bottom). Selected adds a check.">
          <Label>Pick one · md with icon</Label>
          <View className="flex-row flex-wrap gap-3">
            {AREAS.map(({ label, icon }) => (
              <SelectionChip
                key={label}
                label={label}
                icon={icon}
                selected={area === label}
                onPress={() => setArea(label)}
              />
            ))}
          </View>
          <Label>Pick many · sm</Label>
          <View className="flex-row flex-wrap gap-3">
            {YEARS.map((year) => (
              <SelectionChip
                key={year}
                label={year}
                size="sm"
                selected={years.includes(year)}
                onPress={() =>
                  setYears((ys) => (ys.includes(year) ? ys.filter((y) => y !== year) : [...ys, year]))
                }
              />
            ))}
          </View>
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
        <TabBarSpacer />
      </ScrollView>
    </SafeAreaView>
  );
}
