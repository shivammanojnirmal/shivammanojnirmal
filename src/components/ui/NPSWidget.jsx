import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const NPSWidget = ({ onSubmit, defaultScore = null, className = '' }) => {
    const [selectedScore, setSelectedScore] = useState(defaultScore);
    const [hoveredScore, setHoveredScore] = useState(null);

    const scores = Array.from({ length: 11 }, (_, i) => i);

    const handleSelect = (score) => {
        setSelectedScore(score);
        if (onSubmit) onSubmit(score);
    };

    const getScoreColor = (score) => {
        if (score <= 6) return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
        if (score <= 8) return 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
        return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    };

    const getActiveColor = (score) => {
        if (score <= 6) return 'bg-red-500 text-white border-red-600 shadow-md';
        if (score <= 8) return 'bg-amber-500 text-white border-amber-600 shadow-md';
        return 'bg-green-500 text-white border-green-600 shadow-md';
    };

    return (
        <div className={`w-full max-w-2xl mx-auto ${className}`}>
            {/* Desktop View */}
            <div className="hidden sm:flex justify-between items-center gap-2 mb-2">
                {scores.map((score) => (
                    <button
                        key={score}
                        onClick={() => handleSelect(score)}
                        onMouseEnter={() => setHoveredScore(score)}
                        onMouseLeave={() => setHoveredScore(null)}
                        className={`
                            w-10 h-10 sm:w-12 sm:h-12 rounded-lg font-bold text-lg transition-all duration-200 border
                            ${selectedScore === score ? getActiveColor(score) : getScoreColor(score)}
                            ${hoveredScore === score && selectedScore !== score ? 'scale-110' : ''}
                            ${selectedScore === score ? 'scale-110 ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-slate-900' : ''}
                        `}
                        aria-label={`Score ${score} out of 10`}
                        aria-pressed={selectedScore === score}
                    >
                        {score}
                    </button>
                ))}
            </div>

            {/* Mobile View (2 rows to fit) */}
            <div className="flex sm:hidden flex-col gap-3 mb-2">
                <div className="flex justify-between items-center gap-1">
                    {scores.slice(0, 6).map((score) => (
                        <button
                            key={score}
                            onClick={() => handleSelect(score)}
                            className={`
                                flex-1 aspect-square rounded-lg font-bold text-base transition-all border
                                ${selectedScore === score ? getActiveColor(score) : getScoreColor(score)}
                                ${selectedScore === score ? 'scale-105 shadow-md' : ''}
                            `}
                            aria-label={`Score ${score} out of 10`}
                        >
                            {score}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between items-center gap-1">
                    {scores.slice(6, 11).map((score) => (
                        <button
                            key={score}
                            onClick={() => handleSelect(score)}
                            className={`
                                flex-1 aspect-square rounded-lg font-bold text-base transition-all border
                                ${selectedScore === score ? getActiveColor(score) : getScoreColor(score)}
                                ${selectedScore === score ? 'scale-105 shadow-md' : ''}
                            `}
                            aria-label={`Score ${score} out of 10`}
                        >
                            {score}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
                <span>Not at all likely</span>
                <span>Extremely likely</span>
            </div>
        </div>
    );
};