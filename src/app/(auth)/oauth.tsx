import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter, useURL } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useHandleOAuthCallback } from '@/hooks';
import * as Linking from 'expo-linking';

export default function OAuthCallback() {
  const url = useURL();
  const router = useRouter();
  const { handleCallback } = useHandleOAuthCallback();

  useEffect(() => {
    const processCallback = async () => {
      if (url && url.includes('token=')) {
        const result = await handleCallback(url);
        if (result.success) {
          await new Promise(r => setTimeout(r, 1000));
          router.replace('/(app)');
        } else {
          router.replace('/(auth)/login?error=oauth_failed');
        }
      }
    };

    processCallback();
  }, [url]);

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <ActivityIndicator size="large" className="text-primary mb-4" />
      <Text className="text-foreground text-lg font-medium">
        Completing login...
      </Text>
    </View>
  );
}