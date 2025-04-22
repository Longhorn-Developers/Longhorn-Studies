import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  (
    { title, variant = 'primary', size = 'medium', icon, iconPosition = 'left', ...touchableProps },
    ref
  ) => {
    const variantStyles = {
      primary: 'bg-amber-600',
      secondary: 'bg-transparent border-2 border-amber-600',
      danger: 'bg-red-500',
      success: 'bg-green-500',
      link: 'bg-transparent border-0',
    };

    const sizeStyles = {
      small: 'py-2 px-3',
      medium: 'py-3 px-4',
      large: 'py-4 px-5',
    };

    const textVariantStyles = {
      primary: 'text-white',
      secondary: 'text-amber-600',
      danger: 'text-white',
      success: 'text-white',
      link: 'text-amber-600',
    };

    const textSizeStyles = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    const buttonClassName = `items-center rounded-[28px] shadow-md ${variantStyles[variant]} ${sizeStyles[size]} ${touchableProps.disabled ? 'opacity-50' : ''} ${touchableProps.className || ''}`;
    const textClassName = `font-semibold text-center ${textVariantStyles[variant]} ${textSizeStyles[size]}`;

    return (
      <TouchableOpacity ref={ref} {...touchableProps} className={buttonClassName}>
        <View className="flex-row items-center justify-center">
          {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
          <Text className={textClassName}>{title}</Text>
          {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
        </View>
      </TouchableOpacity>
    );
  }
);
