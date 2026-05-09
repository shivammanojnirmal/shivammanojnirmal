import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema } from '../../schemas/feedbackSchema';
import { submitToSheet } from '../../services/sheets';
import { NPSWidget } from '../../components/ui/NPSWidget';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { SEOHead } from '../../components/shared/SEOHead';
import { useRateLimit } from '../../hooks/useRateLimit';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const FeedbackPage = () => {
    const [score, setScore] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Simple client-side rate limiting (1 submission per 24h per page)
    const { checkLimit, recordAction } = useRateLimit('feedback_submit', 1, 24 * 60 * 60 * 1000);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            page: '/feedback',
            nps_score: 0 // Will be overwritten
        }
    });

    const currentComment = watch('comment') || '';

    const handleScoreChange = (newScore) => {
        setScore(newScore);
        setValue('nps_score', newScore, { shouldValidate: true });
    };

    const getPlaceholder = () => {
        if (score === null) return "Please select a score first...";
        if (score <= 6) return "We're sorry to hear that. What went wrong?";
        if (score <= 8) return "Thanks! What could we do better?";
        return "Amazing! What did we do well?";
    };

    const onSubmit = async (data) => {
        if (score === null) {
            toast.error('Please select a score from 0 to 10');
            return;
        }

        if (!checkLimit()) {
            toast.error("You've already submitted feedback recently. Thank you!");
            setIsSubmitted(true);
            return;
        }

        setIsSubmitting(true);
        try {
            await submitToSheet('feedback', {
                ...data,
                id: crypto.randomUUID()
            });
            
            recordAction();
            setIsSubmitted(true);
            
            // Analytics event
            try {
                if (window.gtag) {
                    window.gtag('event', 'feedback_submitted', { nps_score: score });
                }
            } catch (e) { /* ignore */ }

        } catch (error) {
            toast.error('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <SEOHead title="Thank You | Feedback" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-lg border border-slate-100 dark:border-slate-700"
                >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Thank You for Your Feedback!
                    </h2>
                    
                    {score >= 9 ? (
                        <>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                                We're thrilled you had a great experience. It would mean the world to us if you shared your thoughts on Google.
                            </p>
                            <Button 
                                size="lg" 
                                onClick={() => window.open('https://www.google.com/search?q=Ampere+EV+by+Greaves+-+Jai+Mata+Di+Auto+Reviews', '_blank')}
                            >
                                Leave a Google Review
                            </Button>
                        </>
                    ) : (
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            We appreciate your honesty. Your insights will help us improve our service. We'll use this feedback to make things better.
                        </p>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <SEOHead title="Share Your Feedback" description="Tell us how we are doing. We value your feedback." />
            
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    How are we doing?
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Your honest feedback helps us provide better service to you and our community.
                </p>
            </div>

            <Card className="overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b-0 pb-0">
                    <CardTitle className="text-center text-xl mb-6">
                        How likely are you to recommend Jai Mata Di Auto Care to a friend or colleague?
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* NPS Widget */}
                        <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
                            <NPSWidget onSubmit={handleScoreChange} defaultScore={score} />
                            {errors.nps_score && (
                                <p className="text-red-500 text-sm mt-2 text-center">{errors.nps_score.message}</p>
                            )}
                        </div>

                        <AnimatePresence>
                            {score !== null && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-6 overflow-hidden"
                                >
                                    {/* Comment */}
                                    <div>
                                        <label htmlFor="comment" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Tell us more about your experience (optional)
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                id="comment"
                                                rows={4}
                                                placeholder={getPlaceholder()}
                                                className={`w-full rounded-xl border ${errors.comment ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white shadow-sm focus:border-transparent focus:outline-none focus:ring-2 transition-shadow resize-none`}
                                                {...register('comment')}
                                            />
                                            <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                                                {currentComment.length}/500
                                            </div>
                                        </div>
                                        {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Phone Number (Optional)
                                        </label>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                            Leave your number if you'd like us to follow up regarding your feedback.
                                        </p>
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="10-digit mobile number"
                                            className={`w-full sm:max-w-xs rounded-xl border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white shadow-sm focus:border-transparent focus:outline-none focus:ring-2 transition-shadow`}
                                            {...register('phone')}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-4 flex justify-end">
                                        <Button 
                                            type="submit" 
                                            size="lg" 
                                            isLoading={isSubmitting}
                                            className="w-full sm:w-auto"
                                        >
                                            Submit Feedback
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};