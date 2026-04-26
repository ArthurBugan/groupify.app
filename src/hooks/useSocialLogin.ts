import * as Linking from 'expo-linking';
import { useCallback, useState } from 'react';
import { useAuthStore } from '@/stores';
import apiClient from '@/api/client';
import storage from '@/services/storage';

const API_URL = process.env.EXPO_PUBLIC_GROUPIFY_API_URL || '';
const APP_SCHEME = 'groupify';

export const oauthCallbackUrl = (provider: string) => 
  `${APP_SCHEME}://oauth?provider=${provider}`;

export const useOAuthLoading = () => useAuthStore((s) => s.setOAuthLoading);
export const useIsOAuthLoading = () => useAuthStore((s) => s.isOAuthLoading);

export function useGoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const setOAuthLoading = useAuthStore((s) => s.setOAuthLoading);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setOAuthLoading(true);
    try {
      const redirectUrl = oauthCallbackUrl('google');
      const authUrl = `${API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;
      await Linking.openURL(authUrl);
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
      setOAuthLoading(false);
    }
  }, []);

  return { signIn, isLoading };
}

export function useDiscordLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const setOAuthLoading = useAuthStore((s) => s.setOAuthLoading);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setOAuthLoading(true);
    try {
      const redirectUrl = oauthCallbackUrl('discord');
      const authUrl = `${API_URL}/auth/discord?redirect_uri=${encodeURIComponent(redirectUrl)}&origin=app`;
      await Linking.openURL(authUrl);
    } catch (error) {
      console.error('Discord login error:', error);
      setIsLoading(false);
      setOAuthLoading(false);
    }
  }, []);

  return { signIn, isLoading };
}

export function useHandleOAuthCallback() {
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setOAuthLoading = useAuthStore((s) => s.setOAuthLoading);

  const handleCallback = useCallback(async (url: string) => {
    try {
      const parsedUrl = Linking.parse(url);
      const token = parsedUrl.queryParams?.token as string | undefined;
      const error = parsedUrl.queryParams?.error as string | undefined;
      
      if (token) {
        await storage.setToken(token);
        await apiClient.setAuthToken(token);
        setAuthenticated(true);
        setOAuthLoading(false);
        return { success: true };
      } else if (error) {
        setOAuthLoading(false);
        return { success: false, error };
      }
      setOAuthLoading(false);
      return { success: false, error: 'No token received' };
    } catch (error) {
      console.error('handleCallback error:', error);
      setOAuthLoading(false);
      return { success: false, error: 'Failed to parse callback' };
    }
  }, [setAuthenticated, setUser, setOAuthLoading]);

  return { handleCallback };
}