import React from 'react';
import { Skeleton } from '../Skeleton';

export const VehicleCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
            <Skeleton className="w-full aspect-[4/3] rounded-none" />
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
            </div>
        </div>
    );
};