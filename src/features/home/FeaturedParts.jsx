import React, { useState, useEffect } from 'react';
import { useParts } from '../../hooks/useParts';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { PartGridSkeleton } from '../../components/ui/skeletons/PartCardSkeleton';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { PartCard } from '../store/PartCard';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const FeaturedParts = () => {
    const { parts, loading } = useParts();
    const navigate = useNavigate();
    
    const featured = parts.filter(p => String(p.featured).toLowerCase() === 'true').slice(0, 4);

    if (!loading && featured.length === 0) return null;

    return (
        <section className="py-24 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <SectionHeader 
                        title="Genuine Spare Parts" 
                        subtitle="Maintain peak performance with 100% original Ampere authorized components and accessories."
                        className="mb-0"
                    />
                    <Button variant="outline" onClick={() => navigate('/store')} rightIcon={<ArrowRight className="w-4 h-4"/>}>
                        View Full Store
                    </Button>
                </div>

                <SkeletonTransition loading={loading} skeleton={<PartGridSkeleton count={4} />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featured.map(part => (
                            <PartCard key={part.id} part={part} />
                        ))}
                    </div>
                </SkeletonTransition>
                
                <div className="mt-16 bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Looking for something specific?</h4>
                            <p className="text-slate-500">Search our entire inventory of thousands of parts by code or name.</p>
                        </div>
                    </div>
                    <Button size="lg" className="px-10" onClick={() => navigate('/store')}>Search Inventory</Button>
                </div>
            </div>
        </section>
    );
};