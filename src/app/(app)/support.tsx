import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupportScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView>


        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-accent">← Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-foreground mb-4">Support</Text>

        <Text className="text-foreground leading-6 mb-4">
          Need help? Contact us at support@nestfeed.app
        </Text>

        <Text className="text-foreground leading-6">
          We typically respond within 24-48 hours.
        </Text>

        <Text className="text-foreground leading-6 mt-4">
          You can also visit our FAQ page for common questions.
        </Text>
      </SafeAreaView>
    </ScrollView>
  );
}