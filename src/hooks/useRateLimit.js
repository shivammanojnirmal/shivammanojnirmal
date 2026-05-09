import { useState, useCallback } from 'react';

/**
 * Basic client-side rate limiter using localStorage
 * Prevent spam submissions for feedback, forms, etc.
 * 
 * @param {string} actionKey - Unique identifier for the action (e.g., 'feedback_submit')
 * @param {number} maxAttempts - Max number of allowed attempts
 * @param {number} timeWindowMs - Time window in milliseconds
 */
export const useRateLimit = (actionKey, maxAttempts = 3, timeWindowMs = 3600000) => {
    // We don't use React state for this to avoid render loops, 
    // we evaluate it synchronously when needed.

    const getStorageKey = () => `jmd_ratelimit_${actionKey}`;

    const checkLimit = useCallback(() => {
        try {
            const key = getStorageKey();
            const stored = localStorage.getItem(key);
            if (!stored) return true;

            const records = JSON.parse(stored);
            const now = Date.now();
            
            // Filter valid records within time window
            const validRecords = records.filter(timestamp => now - timestamp < timeWindowMs);
            
            // Clean up old records
            if (validRecords.length !== records.length) {
                localStorage.setItem(key, JSON.stringify(validRecords));
            }

            return validRecords.length < maxAttempts;
        } catch (e) {
            // Failsafe open
            return true;
        }
    }, [actionKey, maxAttempts, timeWindowMs]);

    const recordAction = useCallback(() => {
        try {
            const key = getStorageKey();
            const stored = localStorage.getItem(key);
            const records = stored ? JSON.parse(stored) : [];
            const now = Date.now();
            
            // Filter valid records
            const validRecords = records.filter(timestamp => now - timestamp < timeWindowMs);
            validRecords.push(now);
            
            localStorage.setItem(key, JSON.stringify(validRecords));
        } catch (e) {
            // Ignore storage errors
        }
    }, [actionKey, timeWindowMs]);

    const getTimeRemaining = useCallback(() => {
        try {
            const key = getStorageKey();
            const stored = localStorage.getItem(key);
            if (!stored) return 0;

            const records = JSON.parse(stored);
            if (records.length === 0) return 0;

            const oldest = Math.min(...records);
            const now = Date.now();
            const elapsed = now - oldest;
            
            return Math.max(0, timeWindowMs - elapsed);
        } catch (e) {
            return 0;
        }
    }, [actionKey, timeWindowMs]);

    return { checkLimit, recordAction, getTimeRemaining };
};