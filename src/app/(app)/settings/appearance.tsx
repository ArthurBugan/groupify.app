import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, CardContent } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

const themes = [
  { value: 'system', label: 'System', description: 'Follow device settings' },
  { value: 'light', label: 'Light', description: 'Always use light mode' },
  { value: 'dark', label: 'Dark', description: 'Always use dark mode' },
] as const;

export default function AppearanceSettingsScreen() {
  const router = useRouter();
  const { theme, setTheme, isDark } = useTheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-accent">← Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-foreground mb-6">
          Appearance
        </Text>

        <Card>
          <CardContent className="p-0">
            {themes.map((t) => (
              <TouchableOpacity
                key={t.value}
                onPress={() => setTheme(t.value)}
                className={`flex-row items-center justify-between p-4 border-b border-border ${theme === t.value ? 'bg-default' : ''
                  }`}
              >
                <View>
                  <Text className="font-medium text-foreground">
                    {t.label}
                  </Text>
                  <Text className="text-sm text-muted">{t.description}</Text>
                </View>
                {theme === t.value && (
                  <Text className="text-accent text-xl">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </CardContent>
        </Card>
      </SafeAreaView>
    </ScrollView>
  );
}