import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = 'flex-row items-center justify-center rounded-lg font-medium transition-colors';
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-white',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#fff' : '#3B82F6'} />
      ) : (
        <Text className={variant === 'outline' || variant === 'ghost' ? 'text-gray-900 dark:text-white' : 'text-white'}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default Button;