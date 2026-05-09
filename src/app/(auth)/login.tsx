import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogin, useGoogleLogin, useDiscordLogin, useAppleLogin, useIsOAuthLoading } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import { IconifyIcon } from '@huymobile/react-native-iconify';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function LoginScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const googleLogin = useGoogleLogin();
  const discordLogin = useDiscordLogin();
  const appleLogin = useAppleLogin();
  const isOAuthLoading = useIsOAuthLoading();

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

  const handleGoogleLogin = async () => {
    try {
      await googleLogin.signIn();
    } catch (error) {
      Alert.alert('Google Login Failed', 'Unable to sign in with Google');
    }
  };

  const handleDiscordLogin = async () => {
    try {
      await discordLogin.signIn();
    } catch (error) {
      Alert.alert('Discord Login Failed', 'Unable to sign in with Discord');
    }
  };

  const handleAppleLogin = async () => {
    try {
      await appleLogin.signIn();
    } catch (error) {
      Alert.alert('Apple Login Failed', 'Unable to sign in with Apple');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerClassName="flex-grow justify-between p-6 pt-20 pb-10" keyboardShouldPersistTaps="handled">
        <View>
          <Text className="text-3xl font-bold text-foreground mb-2">Welcome Back</Text>
          <Text className="text-base text-muted-foreground mb-8">Sign in to continue</Text>

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
            <View className="relative">
              <TextInput
                className="bg-secondary rounded-lg p-4 pr-12 text-base text-foreground"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
              />
              <TouchableOpacity
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
                onPress={() => setShowPassword(!showPassword)}
              >
                <IconifyIcon
                  name={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
                  size={24}
                  color={isDark ? '#94a3b8' : '#6B7280'}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-primary rounded-lg p-4 items-center"
              onPress={handleLogin}
              disabled={login.isPending}
            >
              <Text className="text-primary-foreground text-base font-semibold">
                {login.isPending ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6">
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text className="text-primary text-sm font-semibold">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted-foreground text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary text-sm font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted-foreground text-sm mx-3">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <View className="gap-3">
            <TouchableOpacity
              className="bg-secondary flex-row justify-center gap-2 border border-input rounded-lg p-4 items-center"
              onPress={handleGoogleLogin}
              disabled={googleLogin.isLoading || isOAuthLoading}
            >
              <IconifyIcon name="mdi:google" size={24} />
              <Text className="text-foreground font-medium">
                {googleLogin.isLoading || isOAuthLoading ? 'Connecting...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-secondary flex-row justify-center gap-2 border border-input rounded-lg p-4 items-center"
              onPress={handleDiscordLogin}
              disabled={discordLogin.isLoading || isOAuthLoading}
            >
              <IconifyIcon name="mdi:discord" size={24} />
              <Text className="text-foreground font-medium">
                {discordLogin.isLoading || isOAuthLoading ? 'Connecting...' : 'Continue with Discord'}
              </Text>
            </TouchableOpacity>

            <AppleAuthentication.AppleAuthenticationButton
              className="bg-secondary flex-row justify-center gap-2 border border-input rounded-lg p-4 items-center"
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={5}
              onPress={handleAppleLogin}
            >
              <IconifyIcon name="mdi:apple" size={24} />
              <Text className="text-foreground font-medium">
                {appleLogin.isLoading || isOAuthLoading ? 'Connecting...' : 'Continue with Apple'}
              </Text>
            </AppleAuthentication.AppleAuthenticationButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
