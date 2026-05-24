import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

const menuItems = [
  { label: 'Account', path: '/settings/account', icon: '👤' },
  { label: 'Appearance', path: '/settings/appearance', icon: '🎨' },
  { label: 'Billing', path: '/settings/billing', icon: '💳' },
  { label: 'Groups', path: '/settings/groups', icon: '👥' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>

        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-accent">← Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-foreground mb-6">Settings</Text>

        <Card>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path)}
            >
              <CardContent className="flex-row items-center">
                <Text className="text-xl mr-3">{item.icon}</Text>
                <Text className="flex-1 text-foreground">{item.label}</Text>
                <Text className="text-muted">›</Text>
              </CardContent>
              {index < menuItems.length - 1 && (
                <View className="h-px border-border mx-4" />
              )}
            </TouchableOpacity>
          ))}
        </Card>
      </SafeAreaView>
    </ScrollView>
  );
}