import '~/global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login/index" options={{ presentation: 'modal', headerTitle: 'Login' }} />
    </Stack>
  );
}
