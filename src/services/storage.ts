import * as SecureStore from 'expo-secure-store';

const KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const;

export const storage = {
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
  },

  async setObject<T>(key: string, value: T): Promise<void> {
    const json = JSON.stringify(value);
    await SecureStore.setItemAsync(key, json);
  },

  async getObject<T>(key: string): Promise<T | null> {
    const json = await SecureStore.getItemAsync(key);
    if (!json) return null;
    return JSON.parse(json) as T;
  },

  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

export default storage;
