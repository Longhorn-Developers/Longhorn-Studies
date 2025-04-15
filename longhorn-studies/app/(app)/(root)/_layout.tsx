import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useAuth } from '~/store/AuthProvider';

export default function AppLayout() {
  const { session, loading } = useAuth();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(app)" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
