import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicles } from '../../hooks/useVehicles';
import { useURLState } from '../../hooks/useURLState';
import { useCompareStore } from '../../store/compareStore';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SEOHead } from '../../components/shared/SEOHead';
import { formatCurrency } from '../../utils/formatters';
import { Battery, Zap, Shield, ArrowLeft, Download, Scale } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const VehicleDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { vehicles, loading, error } = useVehicles();
    const [activeTab, setActiveTab] = useURLState('tab', 'specs');
    
    const { addVehicle, isComparing } = useCompareStore();

    const vehicle = vehicles.find(v => v.slug === slug);

    // Safely parse specs
    let specs = {};
    if (vehicle) {
        try {
            if (typeof vehicle.specs_json === 'string') {
                specs = JSON.parse(vehicle.specs_json);
            } else if (typeof vehicle.specs_json === 'object') {
                specs = vehicle.specs_json;
            }
        } catch (e) {
            console.warn(`Failed to parse specs for ${vehicle?.name}`);
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-8">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 w-1/4 rounded"></div>
                <div className="h-96 bg-slate-200 dark:bg-slate-700 w-full rounded-2xl"></div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20">
                <ErrorState 
                    title={error ? "Error loading vehicle" : "Vehicle not found"}
                    message={error || "The vehicle you are looking for does not exist or has been removed."}
                    onRetry={() => navigate('/vehicles')}
                />
            </div>
        );
    }

    const isCurrentlyComparing = isComparing(vehicle.slug);

    const handleCompare = () => {
        addVehicle(vehicle.slug);
    };

    return (
        <div className="w-full bg-surface-light dark:bg-surface-dark pb-20">
            <SEOHead title={vehicle.name} description={`Discover the ${vehicle.name} electric scooter. Range: ${vehicle.range_km}km. Price: ${formatCurrency(vehicle.price)}.`} />
            
            <div className="bg-slate-900 text-white pt-12 pb-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <button 
                        onClick={() => navigate('/vehicles')}
                        className="flex items-center text-slate-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Fleet
                    </button>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <Badge variant={vehicle.tier === 'premium' ? 'warning' : 'primary'} className="uppercase">
                                {vehicle.tier} Tier
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                                {vehicle.name}
                            </h1>
                            <p className="text-xl text-slate-300">
                                Starting at <span className="font-bold text-white">{formatCurrency(vehicle.price)}</span>
                            </p>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button 
                                    size="lg" 
                                    className="bg-primary-600 hover:bg-primary-700"
                                    onClick={() => navigate(`/booking?vehicle=${vehicle.name}&service=Test+Drive`)}
                                >
                                    Book Test Drive
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="border-slate-600 text-white hover:bg-slate-800"
                                    onClick={handleCompare}
                                    disabled={isCurrentlyComparing}
                                    leftIcon={<Scale className="w-5 h-5" />}
                                >
                                    {isCurrentlyComparing ? 'Added to Compare' : 'Compare'}
                                </Button>
                            </div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800 border border-slate-700 shadow-2xl"
                        >
                            {vehicle.image ? (
                                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600">No Image</div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-slate-100 dark:border-slate-700 pb-8 mb-8">
                        <div className="flex flex-col items-center text-center">
                            <Battery className="w-8 h-8 text-primary-500 mb-2" />
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{vehicle.range_km || 'TBA'} <span className="text-sm font-normal text-slate-500">km</span></span>
                            <span className="text-sm font-medium text-slate-500">True Range</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Zap className="w-8 h-8 text-amber-500 mb-2" />
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{specs.top_speed || 'TBA'}</span>
                            <span className="text-sm font-medium text-slate-500">Top Speed</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Shield className="w-8 h-8 text-green-500 mb-2" />
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{specs.warranty_years || '3'} <span className="text-sm font-normal text-slate-500">Years</span></span>
                            <span className="text-sm font-medium text-slate-500">Warranty</span>
                        </div>
                        <div className="flex flex-col items-center text-center justify-center">
                            {vehicle.catalogue_pdf ? (
                                <Button variant="outline" onClick={() => window.open(vehicle.catalogue_pdf, '_blank')} leftIcon={<Download className="w-4 h-4"/>}>
                                    Brochure
                                </Button>
                            ) : (
                                <span className="text-sm text-slate-400">Brochure unavailable</span>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-6 border-b border-slate-100 dark:border-slate-700 mb-6 overflow-x-auto scrollbar-hide">
                        {['specs', 'warranty', 'emi'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`pb-3 text-sm font-semibold capitalize whitespace-nowrap transition-colors border-b-2 ${
                                    activeTab === t 
                                        ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {t === 'specs' ? 'Specifications' : t}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[300px]">
                        {activeTab === 'specs' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                                {Object.entries(specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-700/50">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span className="text-slate-900 dark:text-white font-semibold text-right">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'warranty' && (
                            <div className="prose dark:prose-invert max-w-none">
                                <p>This vehicle is covered under Ampere's standard comprehensive warranty.</p>
                                <ul>
                                    <li>Battery: 3 Years / 30,000 km (whichever is earlier)</li>
                                    <li>Motor: 3 Years / 30,000 km</li>
                                    <li>Controller: 1 Year</li>
                                </ul>
                                <Button onClick={() => navigate(`/warranty?model=${vehicle.slug}`)}>Check Specific Warranty</Button>
                            </div>
                        )}
                        {activeTab === 'emi' && (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-bold mb-4">Easy EMI Options Available</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate your monthly installments and check eligibility.</p>
                                <Button onClick={() => navigate(`/emi?price=${vehicle.price}`)}>Open EMI Calculator</Button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};