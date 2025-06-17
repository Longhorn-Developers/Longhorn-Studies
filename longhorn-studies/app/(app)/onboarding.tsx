import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { useAuth } from '~/store/AuthProvider';

export default function Onboarding() {
  const { signInWithGoogle } = useAuth();

  return (
    <Container>
      <ScreenContent title="Longhorn Studies" />
      <View className="gap-3">
        <Link href="/signup" asChild>
          <Button title="Sign Up" />
        </Link>
        <Button
          icon={<AntDesign name="google" size={24} color="#d97706" />}
          variant="secondary"
          title="Sign In with Google"
          onPress={async () => {
            try {
              await signInWithGoogle();
              // If we get here, sign up was successful
              router.replace('/(app)/(protected)/(tabs)');
            } catch (error) {
              console.error(error);
            }
          }}
        />
        <Link href="/login" asChild>
          <Button variant="link" title="Log In" />
        </Link>
      </View>
    </Container>
  );
}
