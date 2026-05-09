import { useState, useCallback } from 'react';
import { submitToSheet } from '../services/sheets';
import { npsEngine } from '../utils/npsEngine';
import toast from 'react-hot-toast';

/**
 * Hook to handle NPS survey submissions
 */
export const useNPS = (pagePath) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitFeedback = useCallback(async (score, comment = '', phone = '') => {
        setIsSubmitting(true);
        try {
            const category = npsEngine.categorize(score);
            await submitToSheet('feedback', {
                id: crypto.randomUUID(),
                nps_score: score,
                category,
                comment,
                phone,
                page: pagePath || window.location.pathname,
                date_submitted: new Date().toISOString()
            });
            toast.success('Feedback submitted. Thank you!');
            return true;
        } catch (err) {
            toast.error('Submission failed.');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [pagePath]);

    return { submitFeedback, isSubmitting };
};