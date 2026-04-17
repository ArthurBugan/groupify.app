import { View, Text } from 'react-native';

interface SeparatorProps {
  label?: string;
}

export function Separator({ label }: SeparatorProps) {
  if (label) {
    return (
      <View className="flex-row items-center">
        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <Text className="px-3 text-gray-500 text-sm">{label}</Text>
        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </View>
    );
  }

  return <View className="h-px bg-gray-200 dark:bg-gray-700" />;
}

export default Separator;