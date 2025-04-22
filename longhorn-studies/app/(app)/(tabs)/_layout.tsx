import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';

import { Button } from '~/components/Button';
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
    <Tabs>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          headerRight: () => (
            <Link href="/create-spot" asChild>
              <Button
                size="small"
                icon={<AntDesign name="plus" color="white" />}
                title="New Spot"
              />
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="groups/index" options={{ title: 'Groups' }} />
      <Tabs.Screen name="map/index" options={{ title: 'Map' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
