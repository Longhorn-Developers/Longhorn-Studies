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
    <Stack
      screenOptions={{
        headerTintColor: '#d97706',
        headerTitleStyle: { color: 'black' },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Stacks */}
      <Stack.Screen
        name="favorites"
        options={{ headerTitle: 'Favorites', headerBackTitle: 'Explore' }}
      />
      {/* Modals */}
      <Stack.Screen
        name="create-spot"
        options={{ presentation: 'modal', headerTitle: 'Create Spot', headerShown: false }}
      />
    </Stack>
  );
}
