import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View, ActivityIndicator } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { useAuth } from '~/store/AuthProvider';

// Define the form schema using Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email').nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .nonempty('Password is required'),
});

// Create type from schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await signIn(data.email, data.password);
      // If we get here, login was successful
      router.replace('/(app)/(root)');
    } catch (error) {
      // Handle login error
      console.error(error);
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <View className="w-full max-w-md px-4 py-8">
          {loginError && (
            <View className="mb-4 rounded border border-red-400 bg-red-100 p-3">
              <Text className="text-red-700">{loginError}</Text>
            </View>
          )}

          <View className="h-full justify-around">
            <View className="gap-3">
              <Text className="mb-6 text-center text-2xl font-bold">Log In</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      className="rounded-md border border-gray-300 bg-white p-3"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <Text className="mt-1 text-red-500">{errors.email.message}</Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      className="rounded-md border border-gray-300 bg-white p-3"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your password"
                      secureTextEntry
                      autoComplete="password"
                    />
                    {errors.password && (
                      <Text className="mt-1 text-red-500">{errors.password.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            <Button title="Log In" onPress={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading && <ActivityIndicator color="white" />}
            </Button>
          </View>
        </View>
      </Container>
    </>
  );
}
