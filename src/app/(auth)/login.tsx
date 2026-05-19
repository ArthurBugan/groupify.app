import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogin, useGoogleLogin, useDiscordLogin, useAppleLogin, useIsOAuthLoading } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import { IconifyIcon } from '@huymobile/react-native-iconify';
import * as AppleAuthentication from 'expo-apple-authentication';
import AdMobManager from '@/components/ui/Admob';

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

  useEffect(() => {
    async function loadAppOpenAd() {
      await AdMobManager.openAppAd();
    }
    loadAppOpenAd();
  }, []);

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

  const isLoading = login.isPending || isOAuthLoading;

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
              disabled={isLoading}
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
              className="bg-white flex-row items-center rounded-lg p-3 border border-gray-200"
              onPress={handleGoogleLogin}
              disabled={googleLogin.isLoading || isOAuthLoading}
              activeOpacity={0.8}
            >
              {googleLogin.isLoading || isOAuthLoading ? (
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <IconifyIcon name="mdi:google" size={24} color="black" className="mr-3" />
              )}
              <Text className="text-gray-700 font-medium text-base flex-1 text-center pr-6">
                Sign in with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#5865F2] flex-row rounded-lg p-3"
              onPress={handleDiscordLogin}
              disabled={discordLogin.isLoading || isOAuthLoading}
              activeOpacity={0.8}
            >
              {discordLogin.isLoading || isOAuthLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <IconifyIcon name="mdi:discord" size={24} color="white" className="mr-3" />
              )}
              <Text className="text-white font-medium text-base flex-1 text-center pr-6">
                Sign in with Discord
              </Text>
            </TouchableOpacity>

            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={8}
              style={{ height: 50 }}
              onPress={handleAppleLogin}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
