import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Details() {
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <Container>
        <ScreenContent title="Login" />
      </Container>
    </>
  );
}
