import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores';

const menuItems = [
  { label: 'Websites', path: '/websites', icon: '🌐' },
  { label: 'Share Links', path: '/share-links', icon: '🔗' },
  { label: 'My Shelf', path: '/groupshelf', icon: '📚' },
  { label: 'Blog', path: '/blog', icon: '📝' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

export default function MoreScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-3xl font-bold text-gray-900 mb-6">More</Text>

      <View className="bg-white rounded-xl overflow-hidden">
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            className="flex-row items-center p-4 border-b border-gray-200"
            onPress={() => router.push(item.path)}
          >
            <Text className="text-xl mr-3">{item.icon}</Text>
            <Text className="text-base text-gray-900">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity className="mt-6 bg-red-100 p-4 rounded-xl items-center" onPress={handleLogout}>
        <Text className="text-red-600 font-semibold text-base">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}