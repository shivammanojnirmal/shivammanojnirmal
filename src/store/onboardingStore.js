import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOnboardingStore = create(
    persist(
        (set) => ({
            completed: false,
            currentStep: 1, // 1 to 4
            userType: null, // 'buyer', 'owner', 'exploring'
            preferredVehicle: null,

            nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
            prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
            setUserType: (userType) => set({ userType }),
            setPreferredVehicle: (preferredVehicle) => set({ preferredVehicle }),
            
            complete: () => set({ completed: true }),
            
            // For testing/admin
            reset: () => set({
                completed: false,
                currentStep: 1,
                userType: null,
                preferredVehicle: null
            })
        }),
        {
            name: 'jmd-onboarding'
        }
    )
);