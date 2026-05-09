import React from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { VehicleCardSkeleton } from '../../components/ui/skeletons/VehicleCardSkeleton';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { VehicleCard } from '../vehicles/VehicleCard';
import { motion } from 'framer-motion';

export const VehiclePreview = () => {
    const { vehicles, loading } = useVehicles();
    
    // Show top 3 vehicles
    const previewVehicles = vehicles.slice(0, 3);

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="Engineered for Excellence" 
                    subtitle="Discover our most popular electric scooters, designed for Indian roads and varied commuting needs."
                    centered
                />

                <SkeletonTransition 
                    loading={loading} 
                    skeleton={
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <VehicleCardSkeleton /><VehicleCardSkeleton /><VehicleCardSkeleton />
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {previewVehicles.map((v, i) => (
                            <motion.div
                                key={v.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <VehicleCard vehicle={v} />
                            </motion.div>
                        ))}
                    </div>
                </SkeletonTransition>
            </div>
        </section>
    );
};