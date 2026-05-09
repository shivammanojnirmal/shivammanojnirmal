import React, { useState, useEffect } from 'react';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { AdminTableSkeleton } from '../../components/ui/skeletons/AdminTableSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatDate, maskPhone } from '../../utils/formatters';
import { npsEngine } from '../../utils/npsEngine';
import { MessageSquare, Star, User, Phone, Globe } from 'lucide-react';

const ScoreBadge = ({ score }) => {
    const category = npsEngine.categorize(score);
    if (category === 'promoter') return <Badge variant="success" className="font-bold">{score}</Badge>;
    if (category === 'passive') return <Badge variant="warning" className="font-bold">{score}</Badge>;
    return <Badge variant="danger" className="font-bold">{score}</Badge>;
};

export const AdminFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSheetData('feedback');
                // Most recent first
                setFeedback((data || []).sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted)));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary-500" />
                Customer Feedback
            </h1>

            <SkeletonTransition loading={loading} skeleton={<AdminTableSkeleton rows={10} cols={4} />}>
                {error ? (
                    <ErrorState message={error} onRetry={() => window.location.reload()} />
                ) : feedback.length === 0 ? (
                    <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed">
                        <Star className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500">No feedback submissions yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {feedback.map(item => (
                            <Card key={item.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-48 bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 shrink-0">
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">NPS Score</div>
                                        <ScoreBadge score={item.nps_score} />
                                        <div className="mt-4 text-[10px] font-medium text-slate-400">
                                            {formatDate(item.date_submitted)}
                                        </div>
                                    </div>
                                    
                                    <CardBody className="p-6 flex-1 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                                                <div className="flex items-center">
                                                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                                                    {item.phone ? maskPhone(item.phone) : 'Anonymous'}
                                                </div>
                                                <div className="flex items-center uppercase tracking-wider">
                                                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                                                    Source: {item.page || 'Direct'}
                                                </div>
                                            </div>
                                            
                                            <p className="text-slate-700 dark:text-slate-300 italic text-base leading-relaxed">
                                                "{item.comment || 'No qualitative feedback provided.'}"
                                            </p>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            {item.phone && (
                                                <button 
                                                    onClick={() => window.open(`https://wa.me/${item.phone}`, '_blank')}
                                                    className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider"
                                                >
                                                    Follow Up &rarr;
                                                </button>
                                            )}
                                        </div>
                                    </CardBody>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </SkeletonTransition>
        </div>
    );
};