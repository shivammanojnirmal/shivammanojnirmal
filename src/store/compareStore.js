import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCompareStore = create(
    persist(
        (set, get) => ({
            vehicles: [], // max 3 vehicle slugs
            
            addVehicle: (slug) => {
                const { vehicles } = get();
                if (vehicles.includes(slug)) {
                    toast.error('Vehicle already in compare list');
                    return;
                }
                if (vehicles.length >= 3) {
                    toast.error('You can only compare up to 3 vehicles');
                    return;
                }
                set({ vehicles: [...vehicles, slug] });
                toast.success('Added to comparison');
            },
            
            removeVehicle: (slug) => {
                set({ vehicles: get().vehicles.filter(v => v !== slug) });
            },
            
            clearCompare: () => {
                set({ vehicles: [] });
            },
            
            isComparing: (slug) => {
                return get().vehicles.includes(slug);
            }
        }),
        {
            name: 'jmd-compare-storage'
        }
    )
);