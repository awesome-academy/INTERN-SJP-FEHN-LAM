import { create } from "zustand";
import { persist } from 'zustand/middleware';
interface ThemeState {
    theme: 'light' | 'dark',
    toggleTheme: () => void;
}
export const useThemeStore = create(
    persist<ThemeState>(
        (set) => ({
            theme: 'light',

            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'light' ? 'dark' : 'light',
                })),
        }),
        {
            name: 'theme-storage',
        }
    )
);
