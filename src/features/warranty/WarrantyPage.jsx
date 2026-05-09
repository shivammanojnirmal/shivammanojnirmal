import React, { useState, useEffect } from 'react';
import { useURLState } from '../../hooks/useURLState';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { ErrorState } from '../../components/ui/ErrorState';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { formatDate } from '../../utils/formatters';
import { Search, ShieldCheck, ShieldAlert, Calendar, CheckCircle, Info, Printer } from 'lucide-react';
import { usePrint } from '../../hooks/usePrint';
import { PrintWrapper } from '../../components/ui/PrintWrapper';

export const WarrantyPage = () => {
    const [model, setModel] = useURLState('model', '');
    const [purchaseDate, setPurchaseDate] = useURLState('date', '');
    const [result, setResult] = useState(null);
    const { print } = usePrint();

    const checkWarranty = (e) => {
        if (e) e.preventDefault();
        
        if (!model || !purchaseDate) return;

        const purchase = new Date(purchaseDate);
        const today = new Date();
        const diffYears = (today - purchase) / (1000 * 60 * 60 * 24 * 365.25);
        
        // Mock logic: 3 years warranty for all Ampere models
        const isEligible = diffYears <= 3;
        const expiryDate = new Date(purchase);
        expiryDate.setFullYear(purchase.getFullYear() + 3);

        setResult({
            isEligible,
            expiryDate: expiryDate.toISOString(),
            yearsLeft: Math.max(0, (3 - diffYears).toFixed(1))
        });
    };

    // Auto-check if params exist
    useEffect(() => {
        if (model && purchaseDate) checkWarranty();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <SEOHead title="Warranty Check" description="Verify your Ampere electric vehicle warranty status online." />
            
            <div className="print-hide">
                <SectionHeader 
                    title="Warranty Check" 
                    subtitle="Verify if your vehicle is still under authorized warranty coverage."
                    centered
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                <Card className="print-hide">
                    <CardBody className="p-8">
                        <form onSubmit={checkWarranty} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Vehicle Model</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Magnus EX"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Purchase Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="date"
                                        value={purchaseDate}
                                        onChange={(e) => setPurchaseDate(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 font-medium outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={!model || !purchaseDate}>
                                Check Status
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                <div className="space-y-6">
                    {result ? (
                        <PrintWrapper>
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <Card className={`border-none overflow-hidden text-white shadow-xl ${result.isEligible ? 'bg-green-600' : 'bg-red-600'}`}>
                                    <CardBody className="p-10 text-center">
                                        {result.isEligible ? (
                                            <ShieldCheck className="w-20 h-20 mx-auto mb-6 opacity-20 absolute -right-4 -top-4 scale-150 rotate-12" />
                                        ) : (
                                            <ShieldAlert className="w-20 h-20 mx-auto mb-6 opacity-20 absolute -right-4 -top-4 scale-150 rotate-12" />
                                        )}
                                        <h3 className="text-xl font-bold uppercase tracking-widest mb-1 opacity-80">Warranty Status</h3>
                                        <h2 className="text-4xl font-black mb-6">
                                            {result.isEligible ? 'COVERED' : 'EXPIRED'}
                                        </h2>
                                        
                                        <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-xl text-sm font-bold backdrop-blur-sm">
                                            {result.isEligible ? (
                                                <>Expires on: {formatDate(result.expiryDate)}</>
                                            ) : (
                                                <>Expired on: {formatDate(result.expiryDate)}</>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>

                                <Card className="print-show">
                                    <CardBody className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-700/50">
                                                <span className="text-slate-500 font-medium uppercase text-xs">Model</span>
                                                <span className="font-bold">{model}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-700/50">
                                                <span className="text-slate-500 font-medium uppercase text-xs">Purchased</span>
                                                <span className="font-bold">{formatDate(purchaseDate)}</span>
                                            </div>
                                            {result.isEligible && (
                                                <div className="flex justify-between py-2">
                                                    <span className="text-slate-500 font-medium uppercase text-xs">Remaining</span>
                                                    <span className="font-bold text-green-600">{result.yearsLeft} Years</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="flex gap-3 print-hide">
                                    <Button variant="outline" className="flex-1" onClick={print} leftIcon={<Printer className="w-4 h-4"/>}>Print Result</Button>
                                    {result.isEligible ? (
                                        <Button className="flex-1" onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER}?text=${encodeURIComponent(`I have a ${model} under warranty. Can you help me book a service?`)}`, '_blank')}>Book Service</Button>
                                    ) : (
                                        <Button className="flex-1" variant="secondary" onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER}?text=${encodeURIComponent(`My ${model} warranty has expired. I want to inquire about paid AMC/Renewal plans.`)}`, '_blank')}>AMC Renewal</Button>
                                    )}
                                </div>
                            </motion.div>
                        </PrintWrapper>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center opacity-50">
                            <ShieldCheck className="w-16 h-16 text-slate-300 mb-4" />
                            <p className="text-sm font-medium text-slate-500">Enter your details to view warranty status.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};