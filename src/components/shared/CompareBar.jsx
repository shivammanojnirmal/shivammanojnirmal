import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import { useVehicles } from '../../hooks/useVehicles';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CompareBar = () => {
    const { vehicles: slugs, removeVehicle, clearCompare } = useCompareStore();
    const { vehicles: allVehicles } = useVehicles();
    const navigate = useNavigate();
    const location = useLocation();

    // Hide bar on the comparison page itself or admin
    if (location.pathname === '/compare' || location.pathname.startsWith('/admin') || slugs.length === 0) {
        return null;
    }

    const selectedVehicles = slugs.map(s => allVehicles.find(v => v.slug === s)).filter(Boolean);

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 print-hide"
        >
            <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-3 sm:p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 overflow-x-auto scrollbar-hide">
                    <div className="hidden sm:flex items-center gap-2 text-primary-400 shrink-0">
                        <Scale className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Compare</span>
                    </div>
                    
                    <div className="flex gap-2">
                        {selectedVehicles.map(v => (
                            <div key={v.slug} className="flex items-center gap-2 bg-slate-800 rounded-xl pl-2 pr-1 py-1 border border-slate-700 shrink-0">
                                <span className="text-xs font-bold truncate max-w-[80px]">{v.name}</span>
                                <button 
                                    onClick={() => removeVehicle(v.slug)}
                                    className="p-1 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-red-400"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button 
                        size="sm" 
                        onClick={() => navigate('/compare')}
                        className="bg-primary-600 hover:bg-primary-700 text-xs font-bold uppercase tracking-widest px-4"
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                    >
                        Compare Now
                    </Button>
                    <button 
                        onClick={clearCompare}
                        className="p-2 text-slate-500 hover:text-slate-300"
                        title="Clear List"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};