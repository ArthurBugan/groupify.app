import { Switch, View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

export function SwitchToggle({ value, onValueChange, label }: SwitchProps) {
  const { isDark } = useTheme();
  const primaryColor = isDark ? '#fb7185' : '#f43f5e';

  return (
    <View className="flex-row items-center justify-between">
      {label && (
        <Text className="text-gray-700 dark:text-gray-300">{label}</Text>
      )}
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: primaryColor }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default SwitchToggle;