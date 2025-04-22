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
      router.replace('/home');
    } catch (error) {
      // Handle login error
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <View className="h-full justify-between">
        <View className="gap-3">
          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  className="rounded-full border border-gray-300 bg-white p-3"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {errors.email && <Text className="mt-1 text-red-500">{errors.email.message}</Text>}
              </View>
            )}
          />

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  className="rounded-full border border-gray-300 bg-white p-3"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Password"
                  secureTextEntry
                  autoComplete="password"
                />
                {errors.password && (
                  <Text className="mt-1 text-red-500">{errors.password.message}</Text>
                )}
              </View>
            )}
          />

          {/* Login Error Box onSubmit */}
          {loginError && (
            <View className="mb-4 rounded border border-red-400 bg-red-100 p-3">
              <Text className="text-red-700">{loginError}</Text>
            </View>
          )}
        </View>

        <Button
          icon={isLoading && <ActivityIndicator />}
          title="Log In"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </View>
    </Container>
  );
}
