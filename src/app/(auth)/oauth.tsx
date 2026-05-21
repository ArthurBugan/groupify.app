import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useHandleOAuthCallback } from '@/hooks';
import * as WebBrowser from 'expo-web-browser';

export default function OAuthCallback() {
  const { token } = useGlobalSearchParams();

  const router = useRouter();
  const { handleCallback } = useHandleOAuthCallback();

  useEffect(() => {
    const processCallback = async () => {
      console.log('OAuth Callback - Search Params received:', token);
      
      try {
        await WebBrowser.dismissBrowser();
      } catch (error) {
        console.error('Error dismissing browser:', error);
      }

      const result = await handleCallback(token as string);
      if (result.success) {
        console.log('OAuth Callback - Success, navigating to app...');
        await new Promise(r => setTimeout(r, 1000));
        router.replace('/(app)');
      } else {
        console.log('OAuth Callback - Failed, navigating to login...');
        router.replace('/(auth)/login?error=oauth_failed');
      }
    }


    processCallback();
  }, [token]);

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <ActivityIndicator size="large" className="text-primary mb-4" />
      <Text className="text-foreground text-lg font-medium">
        Completing login...
      </Text>
    </View>
  );
}