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
  return <Tabs screenOptions={{ headerShown: false }} />;
}
