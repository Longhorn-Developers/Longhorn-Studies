import { View } from "react-native";

import { useOnboardingAnswers, isValidUsername, YEARS } from "@/components/onboarding/answers";
import { StepScreen } from "@/components/onboarding/step-screen";
import { PhotoPicker, pickPhoto, SelectionChip, Text, TextField, TextLink } from "@/components/ui";

export default function ProfileStep() {
  const { answers, update } = useOnboardingAnswers();

  const choosePhoto = async () => {
    const uri = await pickPhoto();
    if (uri) update({ photoUri: uri });
  };

  return (
    <StepScreen step={1} title="Let's set up your profile" subtitle="This is how classmates see you in study groups.">
      <View className="flex-row items-center gap-5">
        <PhotoPicker uri={answers.photoUri} onPress={choosePhoto} />
        <View className="flex-1 gap-1">
          <Text variant="body-lg-strong">Profile photo</Text>
          <Text variant="body-md" color="secondary">
            Optional · helps classmates find you
          </Text>
          <TextLink label={answers.photoUri ? "Change photo" : "Upload photo"} onPress={choosePhoto} />
        </View>
      </View>

      <View className="flex-row gap-5">
        <TextField
          className="flex-1"
          label="First name"
          placeholder="First Name"
          textContentType="givenName"
          autoComplete="given-name"
          value={answers.firstName}
          onChangeText={(firstName) => update({ firstName })}
        />
        <TextField
          className="flex-1"
          label="Last name"
          placeholder="Last Name"
          textContentType="familyName"
          autoComplete="family-name"
          value={answers.lastName}
          onChangeText={(lastName) => update({ lastName })}
        />
      </View>

      <TextField
        label="Username"
        prefix="@"
        placeholder="username-example"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="username"
        value={answers.username}
        // The "@" is fixed in front, so drop any the user types or pastes.
        onChangeText={(text) => update({ username: text.replace(/[@\s]/g, "") })}
        valid={isValidUsername(answers.username)}
      />

      <View className="gap-3">
        <Text variant="body-md-strong" color="secondary">
          Year
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {YEARS.map((year) => (
            <SelectionChip
              key={year}
              size="sm"
              label={year}
              selected={answers.year === year}
              // Tapping the selected year again clears it.
              onPress={() => update({ year: answers.year === year ? null : year })}
            />
          ))}
        </View>
      </View>

      <TextField
        label="Major(s)"
        placeholder="Type in your major(s)"
        value={answers.majors}
        onChangeText={(majors) => update({ majors })}
      />
    </StepScreen>
  );
}
