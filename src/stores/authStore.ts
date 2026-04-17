import { create } from 'zustand';
import type { User } from '../types';
import apiClient from '../api/client';
import storage from '../services/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await storage.getToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      await apiClient.loadAuthToken();
      set({ isAuthenticated: true, isLoading: false });
    } catch {
      await storage.removeToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  logout: async () => {
    await apiClient.removeAuthToken();
    await storage.removeToken();
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;