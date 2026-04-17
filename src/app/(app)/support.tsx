import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SupportScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-4">Support</Text>

      <Text className="text-gray-700 leading-6 mb-4">
        Need help? Contact us at support@groupify.app
      </Text>

      <Text className="text-gray-700 leading-6">
        We typically respond within 24-48 hours.
      </Text>

      <Text className="text-gray-700 leading-6 mt-4">
        You can also visit our FAQ page for common questions.
      </Text>
    </ScrollView>
  );
}