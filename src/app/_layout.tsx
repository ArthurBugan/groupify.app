import '../../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, Stack } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/stores';
import { Uniwind } from 'uniwind'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});


export default function RootLayout() {
  Uniwind.setTheme('dark')

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
          <Slot />
      </QueryClientProvider>
    </ThemeProvider>
  );
}