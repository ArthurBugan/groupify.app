import { Switch, View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function SwitchToggle({ value, onValueChange, label, disabled = false }: SwitchProps) {
  const { isDark } = useTheme();
  const primaryColor = getThemeColor('accent', isDark);
  const trackOffColor = getThemeColor('default', isDark);

  return (
    <View className="flex-row items-center justify-between">
      {label && (
        <Text className="text-base text-foreground">{label}</Text>
      )}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: trackOffColor, true: primaryColor }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={trackOffColor}
      />
    </View>
  );
}

export default SwitchToggle;
