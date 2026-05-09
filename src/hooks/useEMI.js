import { useMemo } from 'react';
import { emiEngine } from '../utils/emiEngine';

/**
 * Hook for EMI logic within components
 */
export const useEMI = (price, downPayment, tenure, rate) => {
    return useMemo(() => {
        return emiEngine.getSummary(price - downPayment, rate, tenure);
    }, [price, downPayment, tenure, rate]);
};