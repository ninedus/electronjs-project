import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      setIsDark: (value) => set({ isDark: value }),
      
      is24Hour: true,
      setIs24Hour: (value) => set({ is24Hour: value }),
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        isDark: state.isDark,
        is24Hour: state.is24Hour,
      }),
    }
  )
);