import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

const menuItems = [
  { label: 'Websites', path: '/websites', icon: 'lucide:globe' },
  { label: 'Share Links', path: '/share-links', icon: 'lucide:link-2' },
  { label: 'My Shelf', path: '/groupshelf', icon: 'lucide:shelf' },
  { label: 'Blog', path: '/blog', icon: 'lucide:newspaper' },
  { label: 'Settings', path: '/settings', icon: 'lucide:settings' },
];

export default function MoreScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View
      className="flex-1 bg-background px-4"
    >
      <SafeAreaView edges={['top']}>
        <Text className="text-3xl font-bold text-foreground mb-6">More</Text>

        <View className="bg-card rounded-xl overflow-hidden">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path)}
              className={`flex-row items-center p-4 ${index < menuItems.length - 1 ? 'border-b border-border' : ''}`}
            >
              <IconifyIcon name={item.icon} size={24} className="mr-2" color="#9CA3AF" />
              <Text className="flex-1 text-foreground">{item.label}</Text>
              <IconifyIcon name="lucide:chevron-right" size={16} className="text-muted-foreground" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="bg-destructive/10 mt-6 p-4 rounded-xl items-center" onPress={handleLogout}>
          <Text className="text-destructive font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}