import { View, Text, TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <View>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">{title}</Text>
        {description && (
          <Text className="text-gray-500 dark:text-gray-400 mt-1">{description}</Text>
        )}
      </View>
      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          className="bg-accent px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default DashboardHeader;