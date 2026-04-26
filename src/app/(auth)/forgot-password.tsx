import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForgotPassword } from '../../hooks';

export default function ForgotPasswordScreen() {
  const router = useRouter();
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
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold text-gray-900 mb-2">Reset Password</Text>
      <Text className="text-base text-gray-500 mb-8">Enter your email to receive reset instructions</Text>

      <View className="gap-4">
        <TextInput
          className="bg-gray-100 rounded-lg p-4 text-base text-gray-900"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center"
          onPress={handleSubmit}
          disabled={forgotPassword.isPending}
        >
          <Text className="text-white text-base font-semibold">
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