import React from 'react';
import { useCompareStore } from '../../store/compareStore';
import { useVehicles } from '../../hooks/useVehicles';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { X, Plus, Battery, Zap, Shield, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const ComparePage = () => {
    const { vehicles: selectedSlugs, removeVehicle, clearCompare } = useCompareStore();
    const { vehicles: allVehicles, loading } = useVehicles();
    const navigate = useNavigate();

    const compareList = selectedSlugs.map(slug => allVehicles.find(v => v.slug === slug)).filter(Boolean);

    const specs_to_compare = [
        { label: 'Showroom Price', key: 'price', format: (v) => formatCurrency(v) },
        { label: 'True Range', key: 'range_km', format: (v) => `${v} km` },
        { label: 'Top Speed', specKey: 'top_speed' },
        { label: 'Battery Type', specKey: 'battery_type' },
        { label: 'Charging Time', specKey: 'charging_time' },
        { label: 'Motor Power', specKey: 'motor_power' },
        { label: 'Warranty', specKey: 'warranty_years', format: (v) => `${v} Years` },
    ];

    const getSpecValue = (vehicle, item) => {
        let val;
        if (item.key) {
            val = vehicle[item.key];
        } else if (item.specKey) {
            try {
                const specs = typeof vehicle.specs_json === 'string' ? JSON.parse(vehicle.specs_json) : vehicle.specs_json;
                val = specs?.[item.specKey];
            } catch (e) {
                val = '-';
            }
        }
        
        if (!val || val === 'undefined') return '-';
        return item.format ? item.format(val) : val;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <SEOHead title="Compare Vehicles" description="Compare Ampere electric scooters side-by-side to find your perfect match." />
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <SectionHeader 
                    title="Compare Models" 
                    subtitle="Analyze technical specifications and pricing side-by-side."
                    className="mb-0"
                />
                {compareList.length > 0 && (
                    <Button variant="ghost" onClick={clearCompare} className="text-red-500 hover:bg-red-50" leftIcon={<Trash2 className="w-4 h-4"/>}>
                        Clear All
                    </Button>
                )}
            </div>

            {compareList.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mx-auto mb-6">
                        <Plus className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your comparison list is empty</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                        Add up to 3 vehicles from our fleet to see how they stack up against each other.
                    </p>
                    <Button size="lg" onClick={() => navigate('/vehicles')}>
                        Browse Vehicles
                    </Button>
                </div>
            ) : (
                <div className="overflow-x-auto pb-8 custom-scrollbar">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-4 gap-6">
                            {/* Empty corner cell */}
                            <div className="p-4"></div>

                            {/* Vehicle Headers */}
                            {compareList.map(vehicle => (
                                <div key={vehicle.slug} className="relative group">
                                    <button 
                                        onClick={() => removeVehicle(vehicle.slug)}
                                        className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 transition-all z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <Card className="overflow-hidden border-primary-100 dark:border-primary-900/30">
                                        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900">
                                            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                                        </div>
                                        <CardBody className="p-4 text-center">
                                            <h4 className="font-bold text-lg">{vehicle.name}</h4>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{vehicle.tier}</p>
                                        </CardBody>
                                    </Card>
                                </div>
                            ))}

                            {/* Placeholder for more */}
                            {compareList.length < 3 && (
                                <button 
                                    onClick={() => navigate('/vehicles')}
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <Plus className="w-8 h-8 text-slate-300 mb-2" />
                                    <span className="text-xs font-bold text-slate-400 uppercase">Add Vehicle</span>
                                </button>
                            )}
                        </div>

                        {/* Specs Table */}
                        <div className="mt-12 space-y-2">
                            {specs_to_compare.map((item, i) => (
                                <div key={i} className="grid grid-cols-4 gap-6 items-center py-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">{item.label}</div>
                                    {compareList.map(vehicle => (
                                        <div key={vehicle.slug} className="text-center font-bold text-slate-900 dark:text-white">
                                            {getSpecValue(vehicle, item)}
                                        </div>
                                    ))}
                                    {/* Fill empty slots */}
                                    {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                                        <div key={idx} className="text-center text-slate-300">-</div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="grid grid-cols-4 gap-6 mt-12">
                            <div />
                            {compareList.map(vehicle => (
                                <div key={vehicle.slug} className="space-y-3">
                                    <Button className="w-full" onClick={() => navigate(`/booking?vehicle=${vehicle.name}`)}>Book Now</Button>
                                    <Button variant="outline" className="w-full" onClick={() => navigate(`/vehicles/${vehicle.slug}`)}>Details</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-20 bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-600 rounded-full blur-[120px] opacity-20" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center md:text-left">
                        <h3 className="text-3xl font-bold mb-4">Still confused?</h3>
                        <p className="text-slate-400 text-lg">Our EV experts can help you pick the right model based on your daily usage and terrain.</p>
                    </div>
                    <Button size="lg" className="bg-[#25D366] border-none text-white px-10 hover:bg-[#20bd5a]" onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER}?text=Hi, I am confused between models. Can you help me choose?`, '_blank')}>
                        Consult on WhatsApp
                    </Button>
                </div>
            </div>
        </div>
    );
};