import { Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const { isDark } = useTheme();
  
  const variantStyles: Record<string, { bg: string; text: string }> = {
    default: { bg: getThemeColor('default', isDark), text: getThemeColor('default-foreground', isDark) },
    success: { bg: `${getThemeColor('success', isDark)}15`, text: getThemeColor('success', isDark) },
    warning: { bg: `${getThemeColor('warning', isDark)}15`, text: getThemeColor('warning', isDark) },
    error: { bg: `${getThemeColor('danger', isDark)}15`, text: getThemeColor('danger', isDark) },
    outline: { bg: 'transparent', text: getThemeColor('muted', isDark) },
  };

  const style = variantStyles[variant];

  return (
    <View className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${className}`} style={{ backgroundColor: style.bg }}>
      <Text className="text-xs font-medium" style={{ color: style.text }}>{children}</Text>
    </View>
  );
}

export default Badge;
