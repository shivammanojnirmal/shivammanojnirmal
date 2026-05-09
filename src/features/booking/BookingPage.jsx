import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema } from '../../schemas/bookingSchema';
import { submitToSheet } from '../../services/sheets';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { useVehicles } from '../../hooks/useVehicles';
import { useURLState } from '../../hooks/useURLState';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const BookingPage = () => {
    const { vehicles } = useVehicles();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill from URL
    const [urlVehicle] = useURLState('vehicle', '');
    const [urlService] = useURLState('service', '');

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            vehicle: urlVehicle || '',
            service_type: urlService || ''
        }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await submitToSheet('bookings', {
                ...data,
                id: crypto.randomUUID(),
                status: 'pending',
                date_submitted: new Date().toISOString()
            });
            setIsSubmitted(true);
            toast.success('Service booked successfully!');
            reset(); // Clear form
        } catch (error) {
            toast.error('Failed to book service. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const serviceTypes = [
        'Regular Service',
        'First Free Service',
        'Battery Check',
        'Brake Inspection',
        'General Repair',
        'Other'
    ];

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <SEOHead title="Booking Confirmed" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-lg border border-slate-100 dark:border-slate-700"
                >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Booking Confirmed!
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                        Our service advisor will call you shortly to confirm the exact time slot.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>Book Another Service</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <SEOHead title="Book Service" description="Schedule an authorized service appointment for your Ampere EV." />
            
            <SectionHeader 
                title="Book a Service" 
                subtitle="Expert care for your Ampere EV by authorized technicians."
                centered
            />

            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`}
                                    {...register('name')}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    className={`w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`}
                                    {...register('phone')}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Vehicle */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Vehicle Model <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className={`w-full rounded-lg border ${errors.vehicle ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`}
                                    {...register('vehicle')}
                                >
                                    <option value="">Select a vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v.slug} value={v.name}>{v.name}</option>
                                    ))}
                                    <option value="Other/Older Model">Other/Older Model</option>
                                </select>
                                {errors.vehicle && <p className="text-red-500 text-xs mt-1">{errors.vehicle.message}</p>}
                            </div>

                            {/* Service Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Service Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className={`w-full rounded-lg border ${errors.service_type ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`}
                                    {...register('service_type')}
                                >
                                    <option value="">Select service type</option>
                                    {serviceTypes.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                {errors.service_type && <p className="text-red-500 text-xs mt-1">{errors.service_type.message}</p>}
                            </div>
                        </div>

                        {/* Preferred Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Preferred Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full sm:max-w-xs rounded-lg border ${errors.preferred_date ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`}
                                {...register('preferred_date')}
                            />
                            {errors.preferred_date && <p className="text-red-500 text-xs mt-1">{errors.preferred_date.message}</p>}
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Button 
                                type="submit" 
                                size="lg" 
                                className="w-full sm:w-auto px-10"
                                isLoading={isSubmitting}
                            >
                                Confirm Booking
                            </Button>
                            <p className="text-xs text-slate-500 mt-4">
                                By booking, you agree to receive transactional WhatsApp messages regarding your service.
                            </p>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};