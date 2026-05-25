import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';

interface SeparatorProps {
  label?: string;
}

export function Separator({ label }: SeparatorProps) {
  const { isDark } = useTheme();
  const lineColor = getThemeColor('border', isDark);
  const textColor = getThemeColor('muted', isDark);

  if (label) {
    return (
      <View className="flex-row items-center my-2">
        <View className="flex-1 h-px" style={{ backgroundColor: lineColor }} />
        <Text className="px-3 text-xs font-medium" style={{ color: textColor }}>{label}</Text>
        <View className="flex-1 h-px" style={{ backgroundColor: lineColor }} />
      </View>
    );
  }

  return <View className="h-px my-1" style={{ backgroundColor: lineColor }} />;
}

export default Separator;
