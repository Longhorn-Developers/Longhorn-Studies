import { router } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native/src/icons/CaretLeft";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, cn, ProgressBar, Text, TextLink } from "@/components/ui";
import { tokens } from "@/theme/tokens";

import { hasAnswers, useOnboardingAnswers } from "./answers";
import { goToNextStep, STEPS } from "./steps";

/** Back arrow, progress bar and Skip. */
function StepHeader({ step }: { step: number }) {
  const { skippable } = STEPS[step - 1];
  return (
    <View className="flex-row items-center gap-5 px-6 py-4">
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
      >
        <CaretLeftIcon size={24} color={tokens.icon.primary} />
      </Pressable>
      <ProgressBar total={STEPS.length} current={step} className="flex-1" />
      {/* Non-skippable steps keep an invisible Skip so the bar is the same width on every step. */}
      <View
        className={cn(!skippable && "opacity-0")}
        pointerEvents={skippable ? "auto" : "none"}
        accessibilityElementsHidden={!skippable}
        importantForAccessibility={skippable ? "auto" : "no-hide-descendants"}
      >
        <TextLink
          label="Skip"
          variant="neutral"
          onPress={() => goToNextStep(step)}
        />
      </View>
    </View>
  );
}

/** Default footer. Disabled until the step's required fields are filled. */
function ContinueButton({ step }: { step: number }) {
  const { answers } = useOnboardingAnswers();
  const canContinue = hasAnswers(answers, STEPS[step - 1].required);
  return (
    <Button
      label="Continue"
      size="lg"
      fullWidth
      disabled={!canContinue}
      onPress={() => goToNextStep(step)}
    />
  );
}

type StepScreenProps = {
  /** 1-based position in STEPS. */
  step: number;
  title: string;
  subtitle?: string;
  /** Illustration shown above the title. */
  art?: ReactNode;
  /** Center the art and text vertically and horizontally (intro-style steps). */
  centered?: boolean;
  /** Replaces the Continue button, e.g. "Allow location" + "Not now". */
  footer?: ReactNode;
  children?: ReactNode;
};

/**
 * Shell for every onboarding step: header on top, the step's fields scrolling
 * in the middle, Continue pinned to the bottom (above the keyboard).
 */
export function StepScreen({
  step,
  title,
  subtitle,
  art,
  centered = false,
  footer,
  children,
}: StepScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-page">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <StepHeader step={step} />
        <ScrollView
          className="flex-1 bg-page"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName={cn(
            "gap-7 px-6 pb-7 pt-5",
            centered && "flex-grow items-center justify-center",
          )}
        >
          {art}
          <View className="gap-2">
            <Text
              variant="heading-md"
              className={cn(centered && "text-center")}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                variant="body-lg"
                color="secondary"
                className={cn(centered && "text-center")}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {children}
        </ScrollView>
        <View className="gap-3 px-6 pb-5 pt-3">
          {footer ?? <ContinueButton step={step} />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
