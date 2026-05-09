import React from 'react';
import { Skeleton } from '../Skeleton';

export const AdminTableSkeleton = ({ rows = 5, cols = 4 }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <tbody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <tr key={i} className="border-b border-slate-50 dark:border-slate-700/50">
                                {Array.from({ length: cols }).map((_, j) => (
                                    <td key={j} className="p-4">
                                        <Skeleton className={`h-4 ${j === 0 ? 'w-32' : 'w-20'}`} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};