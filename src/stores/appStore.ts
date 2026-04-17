import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (value) => set({ isDarkMode: value }),
}));

export default useAppStore;