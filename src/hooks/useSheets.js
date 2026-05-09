import { useState, useEffect, useCallback } from 'react';
import { fetchSheetData, submitToSheet } from '../services/sheets';

/**
 * Generic hook for interacting with Google Sheets data
 */
export const useSheets = (sheetName) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetchSheetData(sheetName, true);
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [sheetName]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addRow = async (row) => {
        return await submitToSheet(sheetName, row);
    };

    return { data, loading, error, refresh, addRow };
};