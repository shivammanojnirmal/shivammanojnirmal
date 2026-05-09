import { useCompareStore } from '../store/compareStore';

/**
 * Hook to manage vehicle comparison state
 */
export const useCompare = () => {
    const store = useCompareStore();
    
    return {
        selected: store.vehicles,
        add: store.addVehicle,
        remove: store.removeVehicle,
        clear: store.clearCompare,
        isComparing: store.isComparing
    };
};