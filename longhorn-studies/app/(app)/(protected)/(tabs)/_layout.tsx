<<<<<<< HEAD
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
=======
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';

import { Button } from '~/components/Button';
>>>>>>> main

export default function AppLayout() {
  // This layout can be deferred because it's not the root layout.
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#d97706' }}>
      <Tabs.Screen
        name="index"
        options={{
<<<<<<< HEAD
          title: 'Explore',
          tabBarIcon: ({ color }) => <Entypo name="magnifying-glass" size={24} color={color} />,
=======
          title: 'Home',
          headerRight: () => (
            <Link href="/create-spot" asChild>
              <Button size="small" icon={<Entypo name="plus" color="white" />} title="New Spot" />
            </Link>
          ),
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups/index"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => <MaterialIcons name="group" size={24} color={color} />,
>>>>>>> main
        }}
      />
      <Tabs.Screen
        name="map/index"
        options={{
          title: 'Map',
<<<<<<< HEAD
          headerShown: false,
=======
>>>>>>> main
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
