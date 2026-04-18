import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForgotPassword } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const forgotPassword = useForgotPassword();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    try {
      await forgotPassword.mutateAsync({
        email,
        encrypted_password: email,
      });
      router.replace({
        pathname: '/(auth)/forgot-password-success',
        params: { email },
      });
    } catch {
      Alert.alert('Error', 'Unable to process request');
    }
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-foreground mb-2">Reset Password</Text>
      <Text className="text-base text-muted-foreground mb-8">Enter your email to receive reset instructions</Text>

      <View className="gap-4">
        <TextInput
          className="bg-secondary rounded-lg p-4 text-base text-foreground"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
        />

        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center"
          onPress={handleSubmit}
          disabled={forgotPassword.isPending}
        >
          <Text className="text-primary-foreground text-base font-semibold">
            {forgotPassword.isPending ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-6">
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text className="text-primary text-sm font-semibold">Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}