import { router } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SpotCardsArt } from "@/components/onboarding/spot-cards-art";
import { Button, Carousel, Text, TextLink } from "@/components/ui";

type Slide = { art: ReactNode; title: string; body: string };

// Only slide 1 has a mockup; 2 and 3 reuse its art with placeholder copy.
const SLIDES: Slide[] = [
  {
    art: <SpotCardsArt />,
    title: "Find your next study spot",
    body: "Browse spots across campus with photos, hours and what floor to head to.",
  },
  {
    art: <SpotCardsArt />,
    title: "Filter by what you need",
    body: "Quiet, outlets, whiteboards: show only the spots that fit.",
  },
  {
    art: <SpotCardsArt />,
    title: "Save your favorites",
    body: "Bookmark the spots you like so they're one tap away.",
  },
];

export default function WelcomeScreen() {
  // Sign-up and log-in aren't wired up yet; both go to the next step.
  const next = () => router.push("/onboarding/profile");

  return (
    <SafeAreaView className="flex-1 bg-page">
      <View className="flex-1 justify-center">
        <Carousel
          data={SLIDES}
          keyExtractor={(s) => s.title}
          renderItem={(s) => (
            <View className="items-center gap-8">
              {s.art}
              <View className="gap-3">
                <Text variant="heading-lg" className="text-center">
                  {s.title}
                </Text>
                <Text variant="body-lg" color="secondary" className="text-center">
                  {s.body}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      <View className="items-center gap-5 px-6 pb-8">
        <Button label="Sign up with Google" size="lg" fullWidth onPress={next} />
        <Text variant="body-md" color="secondary">
          Already have an account? <TextLink label="Log in" onPress={next} />
        </Text>
      </View>
    </SafeAreaView>
  );
}
