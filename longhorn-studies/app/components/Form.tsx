import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// TypeScript type for the form data
type LoginFormData = z.infer<typeof loginSchema>;

// Props for the LoginForm component
interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
  buttonText?: string;
  forgotPasswordText?: string;
  onForgotPassword?: () => void;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  // Custom styling props
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  buttonText = 'Sign In',
  forgotPasswordText = 'Forgot Password?',
  onForgotPassword,
  emailPlaceholder = 'Email',
  passwordPlaceholder = 'Password',
  containerClassName = '',
  inputClassName = '',
  buttonClassName = '',
  errorClassName = '',
  labelClassName = '',
}) => {
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

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View className={`h-full w-full justify-between px-8 ${containerClassName}`}>
      <View className="gap-5">
        {/* Email Input */}
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`w-full rounded-lg border-gray-300 bg-white p-3 ${inputClassName}`}
                placeholder={emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!loading}
              />
            )}
          />
          {errors.email && (
            <Text className={`mt-1 text-sm text-red-500 ${errorClassName}`}>
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password Input */}
        <View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`w-full rounded-lg border-gray-300 bg-white p-3 ${inputClassName}`}
                placeholder={passwordPlaceholder}
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!loading}
              />
            )}
          />
          {errors.password && (
            <Text className={`mt-1 text-sm text-red-500 ${errorClassName}`}>
              {errors.password.message}
            </Text>
          )}
        </View>
      </View>

      {/* Forgot Password */}
      {onForgotPassword && (
        <Button
          className="mb-4 self-end"
          onPress={onForgotPassword}
          disabled={loading}
          title={forgotPasswordText}
        />
      )}

      {/* Submit Button */}
      <Button
        title={buttonText}
        className={` ${loading ? 'opacity-70' : ''} ${buttonClassName}`}
        onPress={handleSubmit(handleFormSubmit)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-base font-semibold text-white">{buttonText}</Text>
        )}
      </Button>
    </View>
  );
};

export default LoginForm;
