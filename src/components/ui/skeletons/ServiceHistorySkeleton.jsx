import React from 'react';
import { Skeleton } from '../Skeleton';

export const ServiceHistorySkeleton = ({ count = 3 }) => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="relative pl-4 sm:pl-32 py-6">
                <div className="hidden sm:block absolute left-24 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="space-y-8">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="relative">
                            <div className="hidden sm:block absolute -left-10 top-6 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900"></div>
                            <div className="sm:hidden mb-2">
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="hidden sm:block absolute -left-32 top-5 w-20 text-right">
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-3">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                    <Skeleton className="h-6 w-28 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};