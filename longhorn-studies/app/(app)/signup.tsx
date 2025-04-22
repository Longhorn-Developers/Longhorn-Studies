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
const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email').nonempty('Email is required'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .nonempty('Password is required'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .nonempty('Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Create type from schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setSignUpError(null);

    try {
      await signUp(data.email, data.password);
      // If we get here, sign up was successful
      router.replace('/(app)/(protected)/(tabs)');
    } catch (error) {
      // Handle signup error
      setSignUpError(error instanceof Error ? error.message : 'Sign up failed');
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

          {/* Confirm Password Input */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  className="rounded-full border border-gray-300 bg-white p-3"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Confirm Password"
                  secureTextEntry
                  autoComplete="password"
                />
                {errors.confirmPassword && (
                  <Text className="mt-1 text-red-500">{errors.confirmPassword.message}</Text>
                )}
              </View>
            )}
          />

          {/* SignUp Error Box onSubmit */}
          {signUpError && (
            <View className="mb-4 rounded border border-red-400 bg-red-100 p-3">
              <Text className="text-red-700">{signUpError}</Text>
            </View>
          )}
        </View>

        <Button
          icon={isLoading && <ActivityIndicator />}
          title="Sign Up"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </View>
    </Container>
  );
}
