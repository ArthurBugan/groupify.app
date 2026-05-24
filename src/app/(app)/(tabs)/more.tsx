import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { getThemeColor } from '@/theme/themeColors';
import { useTheme } from '@/theme/ThemeProvider';

const menuItems = [
  { label: 'Websites', path: '/websites', icon: 'lucide:globe' },
  { label: 'Share Links', path: '/share-links', icon: 'lucide:link-2' },
  { label: 'Groupshelf', path: '/groupshelf', icon: 'lucide:library' },
  { label: 'Blog', path: '/blog', icon: 'lucide:newspaper' },
  { label: 'Settings', path: '/settings', icon: 'lucide:settings' },
];

export default function MoreScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { isDark } = useTheme();

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

        <View className="bg-surface rounded-xl overflow-hidden">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path)}
              className={`flex-row items-center p-4 ${index < menuItems.length - 1 ? 'border-b border-border' : ''}`}
            >
              <IconifyIcon name={item.icon} size={24} color={getThemeColor('muted-foreground', isDark)} />
              <Text className="flex-1 text-foreground ml-2">{item.label}</Text>
              <IconifyIcon name="lucide:chevron-right" size={16} color={getThemeColor('muted', isDark)} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="bg-danger/10 mt-6 p-4 rounded-xl items-center" onPress={handleLogout}>
          <Text className="text-danger font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}