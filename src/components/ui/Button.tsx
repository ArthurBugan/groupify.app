import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { ReactNode } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import * as Haptics from 'expo-haptics';
import { getThemeColor } from '@/theme/themeColors';

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'flat' | 'light';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
  isIconOnly?: boolean;
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
  isIconOnly = false,
}: ButtonProps) {
  const { isDark } = useTheme();
  
  const baseStyles = 'flex-row items-center justify-center rounded-lg transition-opacity';
  
  const variantStyles: Record<string, string> = {
    primary: 'bg-accent',
    secondary: 'bg-default',
    outline: 'border border-border bg-transparent',
    ghost: 'bg-transparent',
    danger: 'bg-danger',
    flat: 'bg-default',
    light: 'bg-transparent',
  };

  const textVariantStyles: Record<string, string> = {
    primary: 'text-accent-foreground',
    secondary: 'text-default-foreground',
    outline: 'text-foreground',
    ghost: 'text-foreground',
    danger: 'text-danger-foreground',
    flat: 'text-foreground',
    light: 'text-foreground',
  };

  const sizeStyles = {
    sm: isIconOnly ? 'w-8 h-8 p-0' : 'px-3 py-1.5 text-sm',
    md: isIconOnly ? 'w-10 h-10 p-0' : 'px-4 py-2.5 text-base',
    lg: isIconOnly ? 'w-12 h-12 p-0' : 'px-6 py-3 text-lg',
  };

  const disabledStyles = disabled || loading ? 'opacity-50' : '';

  const handlePress = () => {
    if (onPress && !disabled && !loading) {
      Haptics.selectionAsync();
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' || variant === 'danger' ? '#fff' : getThemeColor('accent', isDark)} />
      ) : (
        <Text className={`${textVariantStyles[variant]} ${variant === 'outline' || variant === 'ghost' || variant === 'flat' || variant === 'light' ? 'font-medium' : 'font-semibold'}`}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default Button;
