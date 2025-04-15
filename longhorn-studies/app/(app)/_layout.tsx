import '~/global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Onboarding', headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login', presentation: 'modal' }} />
    </Stack>
  );
}
