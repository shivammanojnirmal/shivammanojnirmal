import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceHistorySchema } from '../../schemas/serviceHistorySchema';
import { useServiceHistoryStore } from '../../store/serviceHistoryStore';
import { fetchServiceHistory } from '../../services/sheets';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { ServiceHistorySkeleton } from '../../components/ui/skeletons/ServiceHistorySkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatDate, maskPhone } from '../../utils/formatters';
import { usePrint } from '../../hooks/usePrint';
import { PrintWrapper } from '../../components/ui/PrintWrapper';
import { Search, Printer, Wrench, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'completed') return <Badge variant="success" className="print-show">Completed</Badge>;
    if (normalized === 'pending') return <Badge variant="warning" className="print-show">Pending</Badge>;
    if (normalized === 'cancelled') return <Badge variant="danger" className="print-show">Cancelled</Badge>;
    return <Badge className="print-show">{status}</Badge>;
};

export const ServiceHistoryPage = () => {
    const { phone, records, setPhone, setRecords, clear } = useServiceHistoryStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(!!phone);
    const { print } = usePrint();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(serviceHistorySchema),
        defaultValues: { phone: phone || '' }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        try {
            const history = await fetchServiceHistory(data.phone);
            setRecords(history);
            setPhone(data.phone); // Persist phone on success
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        clear();
        setHasSearched(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <SEOHead title="Service History" description="Check your vehicle service records." />
            
            <div className="print-hide">
                <SectionHeader 
                    title="Service History" 
                    subtitle="Track maintenance, repairs, and upcoming service schedules for your vehicle."
                    centered
                />
            </div>

            <AnimatePresence mode="wait">
                {!hasSearched ? (
                    <motion.div 
                        key="search"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-md mx-auto"
                    >
                        <Card>
                            <CardBody className="p-8">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Look Up Records</h3>
                                        <p className="text-sm text-slate-500">Enter your registered mobile number to view service history securely.</p>
                                    </div>
                                    
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="10-digit mobile number"
                                            className={`w-full rounded-xl border ${errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-slate-50 dark:bg-slate-900 px-4 py-3 text-lg text-center font-medium tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`}
                                            {...register('phone')}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-2 text-center">{errors.phone.message}</p>}
                                    </div>
                                    
                                    <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                                        View History
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 print-hide bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-slate-600 dark:text-slate-300 font-medium flex items-center">
                                <span className="mr-2">Records for:</span>
                                <span className="font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-sm">{maskPhone(phone)}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleClear}>Lookup Another</Button>
                                <Button variant="secondary" size="sm" onClick={print} leftIcon={<Printer className="w-4 h-4"/>}>Print</Button>
                            </div>
                        </div>

                        <PrintWrapper>
                            <SkeletonTransition 
                                loading={loading} 
                                skeleton={<ServiceHistorySkeleton />}
                            >
                                {error ? (
                                    <ErrorState message="Failed to fetch service records." onRetry={() => onSubmit({phone})} />
                                ) : records.length === 0 ? (
                                    <EmptyState 
                                        icon={<FileText className="w-12 h-12" />}
                                        title="No records found"
                                        description="We couldn't find any service history for this number. If you've serviced with us recently, it may take 24 hours to reflect."
                                    />
                                ) : (
                                    <div className="relative pl-4 sm:pl-32 py-6">
                                        <div className="hidden sm:block absolute left-24 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 print-show border-l border-slate-300"></div>
                                        
                                        <div className="space-y-8">
                                            {records.map((record, index) => (
                                                <div key={record.id || index} className="relative group">
                                                    {/* Timeline Dot */}
                                                    <div className="hidden sm:block absolute -left-10 top-6 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-white dark:ring-slate-900 print-show border border-black z-10"></div>
                                                    
                                                    {/* Desktop Date */}
                                                    <div className="hidden sm:block absolute -left-32 top-5 w-20 text-right">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white print-show">
                                                            {formatDate(record.service_date).split(' ').slice(0,2).join(' ')}
                                                        </span>
                                                        <div className="text-xs text-slate-500">{formatDate(record.service_date).split(' ')[2]}</div>
                                                    </div>

                                                    {/* Mobile Date */}
                                                    <div className="sm:hidden mb-2 flex items-center text-sm font-bold text-slate-900 dark:text-white">
                                                        <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                                                        {formatDate(record.service_date)}
                                                    </div>

                                                    {/* Card */}
                                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:border-primary-200 transition-colors print-show">
                                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                            <div>
                                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{record.vehicle}</h4>
                                                                <span className="text-sm text-slate-500 flex items-center mt-1">
                                                                    <Wrench className="w-3.5 h-3.5 mr-1" /> {record.service_type}
                                                                </span>
                                                            </div>
                                                            <StatusBadge status={record.status} />
                                                        </div>

                                                        {record.notes && (
                                                            <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mb-4 print-show">
                                                                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Service Notes:</span>
                                                                {record.notes}
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
                                                            <span>Technician: <span className="font-medium text-slate-700 dark:text-slate-300">{record.technician || 'Assigned Staff'}</span></span>
                                                            {record.next_service_date && (
                                                                <span className="flex items-center text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                                                                    <Clock className="w-3.5 h-3.5 mr-1" /> Next due: {formatDate(record.next_service_date)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </SkeletonTransition>
                        </PrintWrapper>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};