import React from 'react';
import { ArrowRight, Battery, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { LazyImage } from '../../components/ui/LazyImage';

export const VehicleCard = ({ vehicle }) => {
    const navigate = useNavigate();

    // Safely parse specs
    let specs = {};
    try {
        if (typeof vehicle.specs_json === 'string') {
            specs = JSON.parse(vehicle.specs_json);
        } else if (typeof vehicle.specs_json === 'object') {
            specs = vehicle.specs_json;
        }
    } catch (e) {
        console.warn(`Failed to parse specs for ${vehicle.name}`);
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col h-full hover:shadow-lg transition-all group">
            
            <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-900 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/vehicles/${vehicle.slug}`)}>
                {vehicle.image ? (
                    <LazyImage 
                        src={vehicle.image} 
                        alt={vehicle.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600">
                        No Image
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge variant={vehicle.tier === 'premium' ? 'warning' : 'primary'} className="shadow-sm capitalize">
                        {vehicle.tier}
                    </Badge>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <h3 
                        className="text-xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        onClick={() => navigate(`/vehicles/${vehicle.slug}`)}
                    >
                        {vehicle.name}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center mb-1">
                            <Battery className="w-3.5 h-3.5 mr-1" /> True Range
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {vehicle.range_km ? `${vehicle.range_km} km` : 'TBA'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center mb-1">
                            <Zap className="w-3.5 h-3.5 mr-1" /> Top Speed
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {specs.top_speed || 'TBA'}
                        </span>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Starting from</span>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                            {formatCurrency(vehicle.price)}
                        </span>
                    </div>
                    <Button 
                        onClick={() => navigate(`/vehicles/${vehicle.slug}`)}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                        Explore
                    </Button>
                </div>
            </div>
        </div>
    );
};