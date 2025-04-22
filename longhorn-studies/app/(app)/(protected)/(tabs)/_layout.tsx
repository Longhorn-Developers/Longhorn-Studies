import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, Tabs } from 'expo-router';

import { Button } from '~/components/Button';

export default function AppLayout() {
  // This layout can be deferred because it's not the root layout.
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
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
