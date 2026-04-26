import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
    <View
      className="flex-1 bg-background p-4"
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
              <Text className="text-xl mr-3">{item.icon}</Text>
              <Text className="flex-1 text-foreground">{item.label}</Text>
              <Text className="text-muted-foreground">›</Text>
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