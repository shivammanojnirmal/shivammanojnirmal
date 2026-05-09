import { useState, useCallback } from 'react';
import { fetchSheetData } from '../services/sheets';
import { couponEngine } from '../utils/couponEngine';

/**
 * Hook to validate and manage offer codes
 */
export const useOffers = () => {
    const [isValidating, setIsValidating] = useState(false);

    const validate = useCallback(async (code, total, items) => {
        setIsValidating(true);
        try {
            const offers = await fetchSheetData('offers');
            const result = couponEngine.validateCoupon(code, total, items, offers);
            return result;
        } finally {
            setIsValidating(false);
        }
    }, []);

    return { validate, isValidating };
};