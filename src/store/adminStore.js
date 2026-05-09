import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            sessionExpiry: null,

            login: (username) => {
                // 12 hour session
                const expiry = Date.now() + (12 * 60 * 60 * 1000);
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
                const { sessionExpiry, isAuthenticated, logout } = get();
                if (isAuthenticated && sessionExpiry && Date.now() > sessionExpiry) {
                    logout();
                    return false;
                }
                return isAuthenticated;
            }
        }),
        {
            name: 'jmd-admin-session',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                sessionExpiry: state.sessionExpiry
            })
        }
    )
);