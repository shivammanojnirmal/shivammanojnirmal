import { config } from './config';

/**
 * Centralized analytics logging service
 */
export const analytics = {
    /**
     * Log standard GA4 event
     */
    logEvent: (name, params = {}) => {
        if (window.gtag) {
            window.gtag('event', name, {
                ...params,
                timestamp: new Date().toISOString()
            });
        }
    },

    /**
     * Log custom business event
     */
    logBusinessAction: (action, meta = {}) => {
        analytics.logEvent('business_action', {
            action,
            ...meta
        });
    }
};