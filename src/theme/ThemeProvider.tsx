import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../stores';

const THEME_KEY = 'theme_mode';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setDarkMode } = useAppStore();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setThemeState(saved);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    loadTheme();
  }, []);

  // Determine if dark mode is active
  const isDark = theme === 'system' 
    ? systemColorScheme === 'dark'
    : theme === 'dark';

  // Sync with app store
  useEffect(() => {
    if (isDark !== isDarkMode) {
      setDarkMode(isDark);
    }
  }, [isDark]);

  // Save theme when changed
  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;