import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ForgotPasswordSuccessScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-foreground mb-2">Check Your Email</Text>
      <Text className="text-base text-muted-foreground mb-8">
        We've sent reset instructions to {email}
      </Text>

      <TouchableOpacity className="bg-primary rounded-lg p-4 items-center" onPress={() => router.replace('/(auth)/login')}>
        <Text className="text-primary-foreground text-base font-semibold">Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}