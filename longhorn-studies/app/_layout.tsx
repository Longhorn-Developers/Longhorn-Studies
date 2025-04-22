import { Slot } from 'expo-router';
import { StatusBar } from 'react-native';

import { AuthProvider } from '~/store/AuthProvider';

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar />
      <Slot />
    </AuthProvider>
  );
}
