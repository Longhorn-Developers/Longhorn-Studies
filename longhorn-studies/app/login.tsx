import LoginForm from './components/Form';

import { Container } from '~/components/Container';

export default function Login() {
  return (
    <>
      <Container>
        <LoginForm onSubmit={async () => console.log('asdasdasd')} />
      </Container>
    </>
  );
}
