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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Portal, Host } from 'react-native-portalize';

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
      if (initialUrl && (initialUrl.includes('oauth') || initialUrl.includes('token='))) {
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
      if (event.url.includes('oauth') || event.url.includes('token=')) {
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
      if (url && (url.includes('oauth') || url.includes('token='))) {
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

function AppContentWithTheme() {
  const { isDark } = useTheme();

  useEffect(() => {
    Uniwind.setTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  return <AppContent />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GestureHandlerRootView>
          <Host>
            <QueryClientProvider client={queryClient}>
              <AppContentWithTheme />
            </QueryClientProvider>
          </Host>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}