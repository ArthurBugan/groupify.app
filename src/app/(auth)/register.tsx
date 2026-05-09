import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegister } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';

export default function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useRegister();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await register.mutateAsync({
        name,
        email,
        password,
        encryptedPassword: password,
      });
      router.replace('/(app)');
    } catch (error) {
      console.log('Registration error:', error);
      Alert.alert('Registration Failed', 'Unable to create account');
    }
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-foreground mb-2">Create Account</Text>
      <Text className="text-base text-muted-foreground mb-8">Join us today</Text>

      <View className="gap-4">
        <TextInput
          className="bg-secondary rounded-lg p-4 text-base text-foreground"
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
        />
        <TextInput
          className="bg-secondary rounded-lg p-4 text-base text-foreground"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
        />
        <TextInput
          className="bg-secondary rounded-lg p-4 text-base text-foreground"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
        />

        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center"
          onPress={handleRegister}
          disabled={register.isPending}
        >
          <Text className="text-primary-foreground text-base font-semibold">
            {register.isPending ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-6">
        <Text className="text-muted-foreground text-sm">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text className="text-primary text-sm font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}