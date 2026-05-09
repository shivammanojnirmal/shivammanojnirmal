import React from 'react';
import { Skeleton } from '../Skeleton';

export const InventorySkeleton = ({ count = 10 }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                        <tr>
                            <th className="p-4 font-medium"><Skeleton className="h-4 w-16" /></th>
                            <th className="p-4 font-medium"><Skeleton className="h-4 w-24" /></th>
                            <th className="p-4 font-medium"><Skeleton className="h-4 w-20" /></th>
                            <th className="p-4 font-medium hidden md:table-cell"><Skeleton className="h-4 w-20" /></th>
                            <th className="p-4 font-medium"><Skeleton className="h-4 w-16" /></th>
                            <th className="p-4 font-medium text-right"><Skeleton className="h-4 w-16 ml-auto" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {Array.from({ length: count }).map((_, i) => (
                            <tr key={i}>
                                <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                                <td className="p-4"><Skeleton className="h-5 w-24 rounded-full" /></td>
                                <td className="p-4 hidden md:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
                                <td className="p-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                                <td className="p-4 text-right"><Skeleton className="h-8 w-24 rounded-lg ml-auto" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};