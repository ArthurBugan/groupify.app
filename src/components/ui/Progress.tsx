import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className = '' }: ProgressProps) {
  const { isDark } = useTheme();
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <View className={`h-2 w-full rounded-full overflow-hidden ${className}`} style={{ backgroundColor: getThemeColor('default', isDark) }}>
      <View
        className="h-full rounded-full"
        style={{ width: `${percentage}%`, backgroundColor: getThemeColor('accent', isDark) }}
      />
    </View>
  );
}

export default Progress;
