import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogin } from '@/hooks';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await login.mutateAsync({ email, password });
      router.replace('/(app)');
    } catch {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };
  
  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-foreground mb-2">Welcome Back</Text>
      <Text className="text-base text-foreground mb-8">Sign in to continue</Text>

      <View className="gap-4">
        <TextInput
          className="bg-secondary rounded-lg p-4 text-base text-foreground"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          className="bg-secondary rounded-lg p-4 text-base text-foreground"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center"
          onPress={handleLogin}
          disabled={login.isPending}
        >
          <Text className="text-foreground text-base font-semibold">
            {login.isPending ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-6">
        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <Text className="text-foreground text-sm font-semibold">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-6">
        <Text className="text-foreground text-sm">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text className="text-foreground text-sm font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}