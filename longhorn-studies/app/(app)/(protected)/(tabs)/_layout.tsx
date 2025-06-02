import { AntDesign, Entypo } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  // This layout can be deferred because it's not the root layout.
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#d97706' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Entypo name="magnifying-glass" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map/index"
        options={{
          title: 'Map',
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo name="map" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
