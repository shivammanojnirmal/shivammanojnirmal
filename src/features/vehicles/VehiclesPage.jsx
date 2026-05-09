import React, { useMemo } from 'react';
import { useVehicles } from '../../hooks/useVehicles';
import { useURLState } from '../../hooks/useURLState';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { VehicleCardSkeleton } from '../../components/ui/skeletons/VehicleCardSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { SectionErrorBoundary } from '../../errors/SectionErrorBoundary';
import { VehicleCard } from './VehicleCard';
import { SEOHead } from '../../components/shared/SEOHead';
import { Car } from 'lucide-react';

export const VehiclesPage = () => {
    const { vehicles, loading, error } = useVehicles();
    const [tier, setTier] = useURLState('tier', 'all');

    const filteredVehicles = useMemo(() => {
        if (tier === 'all') return vehicles;
        return vehicles.filter(v => v.tier?.toLowerCase() === tier.toLowerCase());
    }, [vehicles, tier]);

    const tabs = [
        { id: 'all', label: 'All Models' },
        { id: 'budget', label: 'Budget' },
        { id: 'mid', label: 'Mid-Range' },
        { id: 'premium', label: 'Premium' }
    ];

    return (
        <div className="w-full bg-surface-light dark:bg-surface-dark min-h-screen pb-20">
            <SEOHead title="Electric Vehicles" description="Explore our range of authorized Ampere electric scooters." />
            
            {/* Hero / Header */}
            <div className="bg-slate-900 text-white pt-20 pb-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    The Ampere Fleet
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                    Discover the perfect electric scooter for your daily commute. High performance, zero emissions, zero compromise.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTier(t.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 min-w-[100px] ${
                                tier === t.id 
                                    ? 'bg-primary-600 text-white shadow-md' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <SectionErrorBoundary>
                    <SkeletonTransition 
                        loading={loading} 
                        skeleton={
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                <VehicleCardSkeleton /><VehicleCardSkeleton /><VehicleCardSkeleton />
                            </div>
                        }
                    >
                        {error ? (
                            <ErrorState message="Failed to load vehicles." onRetry={() => window.location.reload()} />
                        ) : filteredVehicles.length === 0 ? (
                            <EmptyState 
                                icon={<Car className="w-12 h-12" />}
                                title="No vehicles found"
                                description={`We don't have any ${tier !== 'all' ? tier : ''} vehicles available right now.`}
                                actionLabel="View All Models"
                                onAction={() => setTier('all')}
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredVehicles.map(vehicle => (
                                    <VehicleCard key={vehicle.slug} vehicle={vehicle} />
                                ))}
                            </div>
                        )}
                    </SkeletonTransition>
                </SectionErrorBoundary>
            </main>
        </div>
    );
};