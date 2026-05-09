import { useState, useEffect, useCallback } from 'react';
import { fetchServiceHistory } from '../services/sheets';
import { useServiceHistoryStore } from '../store/serviceHistoryStore';

/**
 * Hook to manage customer service history lookup
 */
export const useServiceHistory = () => {
    const { phone, records, setRecords, setPhone, clear } = useServiceHistoryStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const lookup = useCallback(async (searchPhone) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchServiceHistory(searchPhone);
            setRecords(data);
            setPhone(searchPhone);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setRecords, setPhone]);

    return { phone, records, loading, error, lookup, clear };
};