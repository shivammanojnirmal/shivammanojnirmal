import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            sessionExpiry: null,

            login: (username) => {
                const expiry = Date.now() + 3600000; // 1 hour
                set({
                    isAuthenticated: true,
                    user: { username },
                    sessionExpiry: expiry
                });
            },

            logout: () => {
                set({
                    isAuthenticated: false,
                    user: null,
                    sessionExpiry: null
                });
            },

            checkSession: () => {
                const { sessionExpiry, logout } = get();
                if (sessionExpiry && Date.now() > sessionExpiry) {
                    logout();
                    return false;
                }
                return get().isAuthenticated;
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                sessionExpiry: state.sessionExpiry
            })
        }
    )
);
