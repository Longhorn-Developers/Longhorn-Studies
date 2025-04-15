import { Link } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Onboarding() {
  return (
    <Container>
      <ScreenContent title="Onboarding" />
      <View className="gap-3">
        <Link href={{ pathname: '/login' }} asChild>
          <Button title="Sign Up" />
        </Link>
        <Link href={{ pathname: '/login' }} asChild>
          <Button variant="secondary" title="Sign In with Google" />
        </Link>
        <Link href={{ pathname: '/login' }} asChild>
          <Button variant="link" title="Log In" />
        </Link>
      </View>
    </Container>
  );
}
