import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      router.replace('/(auth)/login');
    } catch {
      Alert.alert('Error', 'Unable to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-foreground mb-2">Reset Password</Text>
      <Text className="text-base text-muted-foreground mb-8">Enter your new password</Text>

      <View className="gap-4">
        <TextInput
          className="bg-secondary rounded-lg p-4 text-base text-foreground"
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
        />
        <TextInput
          className="bg-secondary rounded-lg p-4 text-base text-foreground"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
        />

        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center"
          onPress={handleReset}
          disabled={isLoading}
        >
          <Text className="text-primary-foreground text-base font-semibold">
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}