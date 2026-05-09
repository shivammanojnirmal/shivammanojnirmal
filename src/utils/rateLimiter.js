/**
 * Business logic for rate limiting actions
 */
export const rateLimiter = {
    /**
     * @param {string} key 
     * @param {number} limit 
     * @param {number} windowMs 
     * @returns {boolean}
     */
    isRateLimited: (key, limit, windowMs) => {
        const now = Date.now();
        const storageKey = `ratelimit_${key}`;
        const stored = localStorage.getItem(storageKey);
        
        let attempts = stored ? JSON.parse(stored) : [];
        attempts = attempts.filter(t => now - t < windowMs);
        
        if (attempts.length >= limit) return true;
        
        attempts.push(now);
        localStorage.setItem(storageKey, JSON.stringify(attempts));
        return false;
    }
};