import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useServiceHistoryStore = create(
    persist(
        (set) => ({
            phone: null,
            records: [],
            
            setPhone: (phone) => set({ phone }),
            setRecords: (records) => set({ records }),
            clear: () => set({ phone: null, records: [] })
        }),
        {
            name: 'jmd-service-history'
        }
    )
);