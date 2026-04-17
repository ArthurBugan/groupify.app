import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const;

export const storage = {
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
  },

  async setObject<T>(key: string, value: T): Promise<void> {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  },

  async getObject<T>(key: string): Promise<T | null> {
    const json = await AsyncStorage.getItem(key);
    if (!json) return null;
    return JSON.parse(json) as T;
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

export default storage;