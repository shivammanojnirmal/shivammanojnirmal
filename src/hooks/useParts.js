import { useState, useEffect } from 'react';
import { fetchSheetData } from '../services/sheets';
import { reportError } from '../errors/errorReporter';

export const useParts = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchSheetData('parts');
                if (!cancelled) setParts(data || []);
            } catch (err) {
                if (!cancelled) setError(err.message);
                reportError(err, { component: 'useParts' });
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    return { parts, loading, error };
};