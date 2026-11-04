import { Stack } from "expo-router";

import { OnboardingAnswersProvider } from "@/components/onboarding/answers";

/** Onboarding stack. Step order lives in components/onboarding/steps.ts. */
export default function OnboardingLayout() {
  return (
    <OnboardingAnswersProvider>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: false,
          // Welcome → profile slides in. Later steps switch instantly, so the
          // header (same on every step) doesn't appear to move.
          animation: route.name === "index" || route.name === "profile" ? "default" : "none",
        })}
      />
    </OnboardingAnswersProvider>
  );
}
