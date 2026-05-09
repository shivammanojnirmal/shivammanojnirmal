import React from 'react';
import { Skeleton } from '../Skeleton';

export const PartCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col h-full">
            <Skeleton className="w-full aspect-square rounded-none" />
            <div className="p-4 flex flex-col flex-grow space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export const PartGridSkeleton = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PartCardSkeleton key={i} />
            ))}
        </div>
    );
};