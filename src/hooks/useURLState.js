import { useState, useEffect } from 'react';

/**
 * Hook to synchronize state with URL query parameters bidirectionally
 * 
 * @param {string} key - The query parameter key
 * @param {any} defaultValue - Default value if key is not in URL
 * @param {Object} options - { serialize, deserialize, replace }
 */
export const useURLState = (key, defaultValue, options = {}) => {
    const {
        serialize = JSON.stringify,
        deserialize = JSON.parse,
        replace = false
    } = options;

    const [value, setValue] = useState(() => {
        if (typeof window === 'undefined') return defaultValue;
        const searchParams = new URLSearchParams(window.location.search);
        const param = searchParams.get(key);
        if (param !== null) {
            try {
                // If the parameter is just a string (not JSON formatted), 
                // trying to JSON.parse it will throw. We handle basic strings gracefully.
                if (typeof defaultValue === 'string' && !param.startsWith('"') && !param.startsWith('{') && !param.startsWith('[')) {
                    return param;
                }
                return deserialize(param);
            } catch {
                return param; // Fallback to raw string if parse fails
            }
        }
        return defaultValue;
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        let stringValue = '';
        
        if (typeof value === 'string') {
            stringValue = value;
        } else if (value !== null && value !== undefined) {
            stringValue = serialize(value);
        }

        if (stringValue === '' || value === defaultValue || (Array.isArray(value) && value.length === 0)) {
            searchParams.delete(key);
        } else {
            searchParams.set(key, stringValue);
        }

        const newUrl = `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        // Prevent unnecessary history stack entries if URL hasn't changed
        if (newUrl !== window.location.pathname + window.location.search) {
            if (replace) {
                window.history.replaceState({}, '', newUrl);
            } else {
                window.history.pushState({}, '', newUrl);
            }
        }
    }, [key, value, serialize, replace, defaultValue]);

    return [value, setValue];
};