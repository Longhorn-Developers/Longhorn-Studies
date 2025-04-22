import { View } from 'react-native';

import { Button } from '~/components/Button';
import { useAuth } from '~/store/AuthProvider';

export default function Home() {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Sign Out"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      />
    </View>
  );
}
