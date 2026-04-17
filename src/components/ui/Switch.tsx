import { Switch, View, Text } from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

export function SwitchToggle({ value, onValueChange, label }: SwitchProps) {
  return (
    <View className="flex-row items-center justify-between">
      {label && (
        <Text className="text-gray-700 dark:text-gray-300">{label}</Text>
      )}
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default SwitchToggle;