import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '@/components/ui';

const menuItems = [
  { label: 'Account', path: '/settings/account', icon: '👤' },
  { label: 'Appearance', path: '/settings/appearance', icon: '🎨' },
  { label: 'Billing', path: '/settings/billing', icon: '💳' },
  { label: 'Groups', path: '/settings/groups', icon: '👥' },
];

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-6">Settings</Text>

      <Card>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.path}
            onPress={() => router.push(item.path)}
          >
            <CardContent className="flex-row items-center">
              <Text className="text-xl mr-3">{item.icon}</Text>
              <Text className="flex-1 text-gray-900">{item.label}</Text>
              <Text className="text-gray-400">›</Text>
            </CardContent>
            {index < menuItems.length - 1 && (
              <View className="h-px bg-gray-200 mx-4" />
            )}
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}