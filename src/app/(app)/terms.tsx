import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function TermsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-accent">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-4">Terms of Service</Text>

      <Text className="text-foreground leading-6">
        By using Nestfeed, you agree to these terms. Please read them carefully.
      </Text>

      <Text className="text-foreground leading-6 mt-4">
        1. You must be at least 18 years old to use this service.
      </Text>
      <Text className="text-foreground leading-6 mt-2">
        2. You are responsible for maintaining the security of your account.
      </Text>
      <Text className="text-foreground leading-6 mt-2">
        3. You agree not to post illegal or harmful content.
      </Text>
      <Text className="text-foreground leading-6 mt-2">
        4. We reserve the right to terminate accounts that violate these terms.
      </Text>
    </ScrollView>
  );
}