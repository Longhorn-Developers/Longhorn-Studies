import { Stack } from 'expo-router';

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      {/* Modals */}
      <Stack.Screen name="login" options={{ presentation: 'modal', headerTitle: 'Login' }} />
      <Stack.Screen name="signup" options={{ presentation: 'modal', headerTitle: 'Sign Up' }} />
    </Stack>
  );
};

export default RootLayout;
