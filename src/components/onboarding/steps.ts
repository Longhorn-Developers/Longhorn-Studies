import { router, type Href } from "expo-router";

import { completeOnboarding } from "@/lib/onboarding";

import type { OnboardingAnswers } from "./answers";

type Step = {
  route: Href;
  /** Fields that must be filled (and valid) before Continue is enabled. Empty = all optional. */
  required: readonly (keyof OnboardingAnswers)[];
  /** Show Skip in the header. Steps with required fields shouldn't be skippable. */
  skippable: boolean;
};

/** The steps after sign-up, in order. The progress bar has one segment per step. */
export const STEPS: readonly Step[] = [
  // Photo stays optional; the screen labels it "Optional".
  {
    route: "/onboarding/profile",
    required: ["firstName", "lastName", "username", "year", "majors"],
    skippable: false,
  },
  { route: "/onboarding/location", required: [], skippable: true },
  { route: "/onboarding/preferences", required: [], skippable: true },
];

/** Go to the step after `step` (1-based); after the last one, finish onboarding. */
export function goToNextStep(step: number) {
  const next = STEPS[step];
  if (next) router.push(next.route);
  else completeOnboarding();
}
