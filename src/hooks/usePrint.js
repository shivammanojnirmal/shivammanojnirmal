import { useState, useCallback, useEffect } from 'react';
import { injectPrintStyles, removePrintStyles } from '../utils/printStyles';

/**
 * Hook to manage print state and trigger browser print API
 */
export const usePrint = () => {
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        const handleBeforePrint = () => setIsPrinting(true);
        const handleAfterPrint = () => {
            setIsPrinting(false);
            removePrintStyles();
        };

        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
            removePrintStyles();
        };
    }, []);

    const print = useCallback(() => {
        injectPrintStyles();
        // Small timeout to allow React to render print-specific UI if any
        setTimeout(() => {
            window.print();
        }, 100);
    }, []);

    return { isPrinting, print };
};