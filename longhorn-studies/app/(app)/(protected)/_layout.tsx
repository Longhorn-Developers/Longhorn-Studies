import '~/global.css';

import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';

import { useAuth } from '~/store/AuthProvider';

export const unstable_settings = {
  initialRouteName: '(tabs)', // anchor
};

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-spot"
        options={{ presentation: 'modal', headerTitle: 'Create Spot', headerShown: false }}
      />
    </Stack>
  );
}
