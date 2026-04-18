import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function PrivacyScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-4">Privacy Policy</Text>

      <Text className="text-foreground leading-6">
        Your privacy is important to us. This policy explains how we handle your data.
      </Text>

      <Text className="text-foreground leading-6 mt-4">
        We collect your email and name for account purposes only. We do not share your data with third parties.
      </Text>
      <Text className="text-foreground leading-6 mt-2">
        Your data is stored securely and you can request deletion at any time.
      </Text>
    </ScrollView>
  );
}