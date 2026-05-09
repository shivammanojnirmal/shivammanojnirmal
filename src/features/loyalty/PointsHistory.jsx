import React from 'react';
import { Card } from '../../components/ui/Card';
import { History } from 'lucide-react';

export const PointsHistory = ({ logs }) => {
    return (
        <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <History className="w-6 h-6 mr-3 text-slate-400" />
                Points History
            </h3>
            <Card>
                <div className="p-0 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                            <tr>
                                <th className="p-4">Activity</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {logs.map((log, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-900 dark:text-white">{log.activity}</td>
                                    <td className="p-4 text-slate-500">{log.date}</td>
                                    <td className={`p-4 text-right font-bold ${log.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                                        {log.points}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};