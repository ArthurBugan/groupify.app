import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity onPress={onChange} className="flex-row items-center" activeOpacity={0.7}>
      <View
        className="w-5 h-5 rounded border-2 flex items-center justify-center mr-3"
        style={{
          backgroundColor: checked ? getThemeColor('accent', isDark) : 'transparent',
          borderColor: checked ? getThemeColor('accent', isDark) : getThemeColor('border', isDark),
        }}
      >
        {checked && <Text className="text-white text-xs font-bold">✓</Text>}
      </View>
      {label && <Text className="text-foreground text-sm">{label}</Text>}
    </TouchableOpacity>
  );
}

export default Checkbox;
