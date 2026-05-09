import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook for automated page view tracking
 */
export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);
};