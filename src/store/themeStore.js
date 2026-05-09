import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'system', // 'light', 'dark', 'system'
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => ({ 
                theme: state.theme === 'light' ? 'dark' : 'light' 
            })),
        }),
        {
            name: 'jmd-theme-storage'
        }
    )
);