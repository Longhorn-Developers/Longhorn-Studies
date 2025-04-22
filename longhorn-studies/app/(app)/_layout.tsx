import '~/global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Modals */}
      <Stack.Screen name="login/index" options={{ presentation: 'modal', headerTitle: 'Login' }} />
      <Stack.Screen
        name="signup/index"
        options={{ presentation: 'modal', headerTitle: 'Sign Up' }}
      />
      <Stack.Screen
        name="create-spot/index"
        options={{ presentation: 'modal', headerTitle: 'Create Spot' }}
      />
    </Stack>
  );
}
