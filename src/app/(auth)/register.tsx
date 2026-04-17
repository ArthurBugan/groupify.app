import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegister } from '../../hooks';

export default function RegisterScreen() {
  const router = useRouter();
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
      Alert.alert('Registration Failed', 'Unable to create account');
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
      <Text className="text-base text-gray-500 mb-8">Join us today</Text>

      <View className="gap-4">
        <TextInput
          className="bg-gray-100 rounded-lg p-4 text-base text-gray-900"
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          className="bg-gray-100 rounded-lg p-4 text-base text-gray-900"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          className="bg-gray-100 rounded-lg p-4 text-base text-gray-900"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 items-center"
          onPress={handleRegister}
          disabled={register.isPending}
        >
          <Text className="text-white text-base font-semibold">
            {register.isPending ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-500 text-sm">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text className="text-blue-500 text-sm font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}