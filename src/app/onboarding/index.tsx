import { Image, type ImageSource } from "expo-image";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Carousel, Text, TextLink } from "@/components/ui";

type Slide = { art: ImageSource; title: string; body: string };

const SLIDES: Slide[] = [
  {
    art: require("@/assets/images/onboarding/new-spot-hero.png"),
    title: "Find your next study spot",
    body: "Browse spots across campus with photos, hours and what floor to head to.",
  },
  {
    art: require("@/assets/images/onboarding/preferences-hero.png"),
    title: "Study your way",
    body: "Tell us what helps you focus and we put the best spots first.",
  },
  {
    art: require("@/assets/images/onboarding/map-hero.png"),
    title: "Spot it on the map",
    body: "Browse every study spot on campus with photos, so you know what you're walking into.",
  },
];

// Every slide's art sits in the same box so the text doesn't shift between slides.
// The map and preferences exports are 1412×1488; others are fit inside it.
const ART_RATIO = 1412 / 1488;

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
              <Image
                source={s.art}
                style={{ width: "100%", aspectRatio: ART_RATIO }}
                contentFit="contain"
                accessible={false}
              />
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
