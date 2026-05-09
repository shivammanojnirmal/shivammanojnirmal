import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema } from '../../schemas/reviewSchema';
import { submitToSheet } from '../../services/sheets';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const ReviewFormPage = () => {
    const [rating, setRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(reviewSchema)
    });

    const onSubmit = async (data) => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitToSheet('reviews', {
                ...data,
                id: crypto.randomUUID(),
                rating,
                approved: 'false',
                date_submitted: new Date().toISOString()
            });
            setIsSubmitted(true);
            toast.success('Review submitted for moderation!');
        } catch (e) {
            toast.error('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Review Submitted!</h2>
                <p className="text-slate-500 mb-8">Thank you for sharing your experience. Your review will be visible once approved by our team.</p>
                <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <SEOHead title="Write a Review" />
            <SectionHeader title="Share Your Experience" subtitle="Your feedback helps fellow riders and helps us improve." centered />

            <Card>
                <CardBody className="p-8 sm:p-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col items-center gap-4">
                            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">Overall Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => { setRating(star); setValue('rating', star); }}
                                        className={`p-2 transition-transform hover:scale-125 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                                    >
                                        <Star className={`w-10 h-10 ${rating >= star ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>
                            {errors.rating && <p className="text-red-500 text-xs">{errors.rating.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Name</label>
                                <input {...register('name')} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Vehicle Model</label>
                                <input placeholder="e.g. Magnus EX" {...register('vehicle')} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Your Message</label>
                            <textarea rows={5} {...register('message')} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 resize-none" />
                            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                        </div>

                        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>Submit Review</Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};