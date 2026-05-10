import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function ForgotPasswordSuccessScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <View 
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 p-6">
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2 -ml-2">
            <IconifyIcon name="lucide:arrow-left" size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Check Your Email</Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-6">
            <IconifyIcon name="lucide:mail-check" size={40} className="text-primary" />
          </View>
          
          <Text className="text-xl font-bold text-foreground mb-4 text-center">
            Check Your Email
          </Text>
          
          <Text className="text-base text-muted-foreground mb-2 text-center">
            We've sent reset instructions to
          </Text>
          <Text className="text-primary font-semibold mb-8">{email}</Text>
          
          <Text className="text-sm text-muted-foreground text-center mb-8">
            Check your inbox and follow the instructions to reset your password
          </Text>
        </View>

        <TouchableOpacity 
          className="bg-primary rounded-xl p-4 items-center mb-4" 
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text className="text-primary-foreground text-base font-semibold">
            Back to Sign In
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-sm text-muted-foreground">Didn't receive the email? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-sm text-primary font-medium">Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
