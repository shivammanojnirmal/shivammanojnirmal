import React, { useState, useEffect } from 'react';
import { useURLState } from '../../hooks/useURLState';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card, CardBody } from '../../components/ui/Card';
import { SEOHead } from '../../components/shared/SEOHead';
import { formatCurrency } from '../../utils/formatters';
import { Search, Calculator, Calendar, Percent, Info, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const EMICalculatorPage = () => {
    // Input States
    const [price, setPrice] = useURLState('price', 100000);
    const [downPayment, setDownPayment] = useState(20000);
    const [tenure, setTenure] = useURLState('tenure', 36); // months
    const [interestRate, setInterestRate] = useState(10.5); // % p.a.

    // Derived
    const loanAmount = Math.max(0, price - downPayment);
    
    const calculateEMI = () => {
        if (loanAmount <= 0) return 0;
        const r = interestRate / (12 * 100); // monthly interest rate
        const n = tenure;
        const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return Math.round(emi);
    };

    const emi = calculateEMI();
    const totalPayable = emi * tenure;
    const totalInterest = totalPayable - loanAmount;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <SEOHead title="EMI Calculator" description="Calculate monthly installments for your new Ampere electric scooter." />
            
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    EMI Calculator
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Plan your purchase with easy monthly installments.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Inputs */}
                <Card>
                    <CardBody className="p-8 space-y-8">
                        {/* Vehicle Price */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Vehicle Price</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(price)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="50000" 
                                max="200000" 
                                step="1000"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                        </div>

                        {/* Down Payment */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Down Payment</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(downPayment)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="5000" 
                                max={price - 10000} 
                                step="1000"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Tenure */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Tenure (Months)</label>
                                <select 
                                    value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                                >
                                    {[12, 18, 24, 30, 36, 48, 60].map(m => (
                                        <option key={m} value={m}>{m} Months</option>
                                    ))}
                                </select>
                            </div>

                            {/* Interest Rate */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Interest Rate (% p.a)</label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        step="0.1"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(Number(e.target.value))}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Results */}
                <div className="space-y-6">
                    <Card className="bg-primary-600 border-none text-white shadow-xl shadow-primary-600/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        <CardBody className="p-10 text-center relative z-10">
                            <p className="text-primary-100 text-sm font-bold uppercase tracking-[0.2em] mb-2">Estimated Monthly EMI</p>
                            <h2 className="text-5xl sm:text-6xl font-black mb-4">
                                {formatCurrency(emi)}
                            </h2>
                            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                                <Calendar className="w-3.5 h-3.5 mr-1.5" /> For {tenure} months
                            </div>
                        </CardBody>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-50 dark:bg-slate-800/50 border-none">
                            <CardBody className="p-6">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Loan Amount</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(loanAmount)}</p>
                            </CardBody>
                        </Card>
                        <Card className="bg-slate-50 dark:bg-slate-800/50 border-none">
                            <CardBody className="p-6">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Interest</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(totalInterest)}</p>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex gap-4">
                        <Info className="w-6 h-6 text-amber-600 shrink-0" />
                        <div className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                            <p className="font-bold mb-1 uppercase tracking-wider">Disclaimer</p>
                            This is an approximate calculation. Actual EMI and interest rates depend on the chosen financing partner (Greaves Finance, etc.), your credit score, and current schemes. Visit our showroom for a finalized quote.
                        </div>
                    </div>

                    <Button 
                        size="lg" 
                        className="w-full"
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                        onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER}?text=${encodeURIComponent(`Hi, I checked the EMI for a vehicle priced at ${formatCurrency(price)}. Can you share the latest financing schemes?`)}`, '_blank')}
                    >
                        Check Finance Eligibility
                    </Button>
                </div>

            </div>
        </div>
    );
};