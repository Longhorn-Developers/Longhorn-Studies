import { Slot } from 'expo-router';

import { AuthProvider } from '~/store/AuthProvider';
import '../global.css';

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
