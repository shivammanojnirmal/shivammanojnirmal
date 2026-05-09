import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLoyaltyStore = create(
    persist(
        (set) => ({
            referredBy: null,
            setReferredBy: (code) => set({ referredBy: code }),
            clearReferral: () => set({ referredBy: null })
        }),
        {
            name: 'jmd-loyalty-referral'
        }
    )
);