import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForgotPassword } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
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
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerClassName="flex-grow p-6" 
        keyboardShouldPersistTaps="handled"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2 -ml-2">
            <IconifyIcon name="lucide:arrow-left" size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Reset Password</Text>
        </View>

        <View className="flex-1">
          <Text className="text-base text-muted-foreground mb-8">
            Enter your email to receive reset instructions
          </Text>

          <View className="gap-4">
            <TextInput
              className="bg-card rounded-xl p-4 text-base text-foreground border border-border"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
            />

            <TouchableOpacity
              className="bg-primary rounded-xl p-4 items-center mt-2"
              onPress={handleSubmit}
              disabled={forgotPassword.isPending}
            >
              <Text className="text-primary-foreground text-base font-semibold">
                {forgotPassword.isPending ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-center mt-8 pb-8">
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <View className="flex-row items-center gap-2">
              <IconifyIcon name="lucide:chevron-left" size={16} className="text-primary" />
              <Text className="text-primary text-sm font-medium">Back to Sign In</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
