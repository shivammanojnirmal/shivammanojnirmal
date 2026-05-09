import { useAdminStore } from '../store/adminStore';

/**
 * Authentication and authorization utilities
 */
export const auth = {
    /**
     * Check if user is logged in and session is valid
     */
    isAuthenticated: () => {
        const store = useAdminStore.getState();
        return store.checkSession();
    },

    /**
     * Get current user metadata
     */
    getUser: () => {
        const store = useAdminStore.getState();
        return store.user;
    },

    /**
     * Secure session logout
     */
    logout: () => {
        const store = useAdminStore.getState();
        store.logout();
    }
};