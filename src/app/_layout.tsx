import '../../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { Uniwind } from 'uniwind';
import { useHandleOAuthCallback } from '@/hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});

function AppContent() {
  const url = Linking.useURL();
  const { handleCallback } = useHandleOAuthCallback();
  const initialUrlHandled = useRef(false);

  useEffect(() => {
    const handleInitialUrl = async () => {
      if (initialUrlHandled.current) return;
      
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && initialUrl.includes('oauth/callback')) {
        initialUrlHandled.current = true;
        const result = await handleCallback(initialUrl);
        if (result.success) {
          router.replace('/(app)');
        }
      }
    };
    
    handleInitialUrl();
  }, []);

  useEffect(() => {
    const subscription = Linking.addEventListener('url', async (event) => {
      if (event.url.includes('oauth/callback')) {
        const result = await handleCallback(event.url);
        if (result.success) {
          router.replace('/(app)');
        }
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const handleUrlCallback = async () => {
      if (url && url.includes('oauth/callback')) {
        const result = await handleCallback(url);
        if (result.success) {
          router.replace('/(app)');
        }
      }
    };
    handleUrlCallback();
  }, [url]);

  return <Slot />;
}

export default function RootLayout() {
  Uniwind.setTheme('dark')

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}