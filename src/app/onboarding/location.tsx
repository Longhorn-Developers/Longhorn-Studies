import { Image } from "expo-image";
import * as Location from "expo-location";

import { StepScreen } from "@/components/onboarding/step-screen";
import { goToNextStep } from "@/components/onboarding/steps";
import { Button } from "@/components/ui";

const ART = require("@/assets/images/onboarding/onboarding-location.png");
// The exported image is 1252×880.
const ART_RATIO = 1252 / 880;

export default function LocationStep() {
  const next = () => goToNextStep(2);

  // Shows the system prompt, then moves on whether or not they allow it.
  // If they already answered before, the OS returns that answer without asking again.
  const allowLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
    } finally {
      next();
    }
  };

  return (
    <StepScreen
      step={2}
      centered
      art={<Image source={ART} style={{ width: "100%", aspectRatio: ART_RATIO }} contentFit="contain" />}
      title="See spots near you"
      subtitle="Turn on location to sort spots by distance and see walking time."
      footer={
        <>
          <Button label="Allow location" size="lg" fullWidth onPress={allowLocation} />
          <Button label="Not now" variant="tertiary" size="lg" fullWidth onPress={next} />
        </>
      }
    />
  );
}
