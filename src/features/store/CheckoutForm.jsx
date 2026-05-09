import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '../../schemas/checkoutSchema';
import { Button } from '../../components/ui/Button';

export const CheckoutForm = ({ onSubmit, isSubmitting }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(checkoutSchema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input 
                        {...register('name')}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input 
                        {...register('phone')}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
            </div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Complete Order
            </Button>
        </form>
    );
};