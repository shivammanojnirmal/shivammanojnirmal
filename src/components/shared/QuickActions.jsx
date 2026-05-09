import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Wrench, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = ({ className = '' }) => {
    const navigate = useNavigate();
    
    const actions = [
        { icon: <Zap />, label: 'View Models', path: '/vehicles', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
        { icon: <Wrench />, label: 'Genuine Parts', path: '/store', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
        { icon: <Calendar />, label: 'Book Service', path: '/booking', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
        { icon: <MapPin />, label: 'Track Inventory', path: '/inventory', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    ];

    return (
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
            {actions.map((action, i) => (
                <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${action.color}`}>
                        {action.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                        {action.label}
                    </span>
                </motion.button>
            ))}
        </div>
    );
};