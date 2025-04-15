import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';

import { useAuth } from '~/store/AuthProvider';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/(app)" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="groups/index" options={{ title: 'Groups' }} />
      <Tabs.Screen name="map/index" options={{ title: 'Map' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
