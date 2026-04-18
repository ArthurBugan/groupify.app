import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, CardContent } from '@/components/ui';

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
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
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
              className={`flex-row items-center justify-between p-4 border-b border-border ${
                theme === t.value ? 'bg-secondary' : ''
              }`}
            >
              <View>
                <Text className="font-medium text-foreground">
                  {t.label}
                </Text>
                <Text className="text-sm text-muted-foreground">{t.description}</Text>
              </View>
              {theme === t.value && (
                <Text className="text-blue-500 text-xl">✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}