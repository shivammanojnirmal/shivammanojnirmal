import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import { fetchSheetData } from '../../services/sheets';
import { Button } from '../../components/ui/Button';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { Skeleton } from '../../components/ui/Skeleton';
import { reportError } from '../../errors/errorReporter';
import { ShoppingCart, Wrench, Search, ArrowRight, ChevronRight } from 'lucide-react';

export const OnboardingFlow = () => {
    const navigate = useNavigate();
    const { completed, currentStep, userType, preferredVehicle, nextStep, prevStep, setUserType, setPreferredVehicle, complete } = useOnboardingStore();
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);
    const [direction, setDirection] = useState(1);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 40 : -40,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 40 : -40,
            opacity: 0
        })
    };

    useEffect(() => {
        const isRoot = window.location.pathname === '/';
        const hasParams = window.location.search.length > 0;
        if (!completed && isRoot && !hasParams) {
            setShouldShow(true);
        } else {
            setShouldShow(false);
        }
    }, [completed]);

    useEffect(() => {
        if (currentStep === 3 && vehicles.length === 0) {
            const loadVehicles = async () => {
                setLoadingVehicles(true);
                try {
                    const data = await fetchSheetData('vehicles');
                    setVehicles(data.slice(0, 6)); // max 6
                } catch (err) {
                    reportError(err, { component: 'OnboardingFlow', action: 'fetchVehicles' });
                    nextStep();
                } finally {
                    setLoadingVehicles(false);
                }
            };
            loadVehicles();
        }
    }, [currentStep, vehicles.length, nextStep]);

    if (!shouldShow) return null;

    const handleSkip = () => {
        complete();
    };

    const advance = () => {
        setDirection(1);
        nextStep();
    };

    const goBack = () => {
        setDirection(-1);
        prevStep();
    };

    const renderStep1 = () => (
        <div className="flex flex-col items-center text-center space-y-6 pt-8">
            <div className="w-32 h-32 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome to Jai Mata Di Auto Care</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                Your authorized Ampere EV partner in Loni Kh. We're here to power your journey.
            </p>
            <div className="pt-8 w-full max-w-xs">
                <Button size="lg" className="w-full" onClick={advance} rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Get Started
                </Button>
            </div>
        </div>
    );

    const renderStep2 = () => {
        const options = [
            { id: 'buyer', icon: <ShoppingCart />, label: 'I want to buy an EV' },
            { id: 'owner', icon: <Wrench />, label: 'I own an Ampere EV' },
            { id: 'exploring', icon: <Search />, label: 'Just exploring' }
        ];

        return (
            <div className="flex flex-col items-center space-y-8 w-full max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">What are you looking for today?</h2>
                <div className="grid grid-cols-1 w-full gap-4">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => {
                                setUserType(opt.id);
                                if (opt.id === 'exploring') {
                                    complete();
                                } else {
                                    advance();
                                }
                            }}
                            className={`flex items-center p-6 bg-white dark:bg-slate-800 rounded-xl border-2 transition-all hover:shadow-md group ${userType === opt.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'}`}
                        >
                            <div className={`p-3 rounded-lg mr-4 ${userType === opt.id ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-primary-100 group-hover:text-primary-600 dark:group-hover:bg-slate-600'}`}>
                                {opt.icon}
                            </div>
                            <span className="text-lg font-medium text-slate-900 dark:text-white flex-1 text-left">{opt.label}</span>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderStep3 = () => (
        <div className="flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                {userType === 'buyer' ? 'Which model interests you?' : 'Which Ampere do you own?'}
            </h2>
            
            {loadingVehicles ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="w-full aspect-[4/3] rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {vehicles.map(v => (
                        <button
                            key={v.slug}
                            onClick={() => setPreferredVehicle(v.slug)}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-[4/3] ${preferredVehicle === v.slug ? 'border-primary-600 shadow-md ring-2 ring-primary-600/20 ring-offset-2 dark:ring-offset-slate-900' : 'border-slate-100 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'}`}
                        >
                            <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                                <p className="text-white font-medium text-sm sm:text-base text-left truncate">{v.name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            
            <div className="pt-4 w-full flex gap-4">
                <Button variant="outline" className="flex-1" onClick={goBack}>Back</Button>
                <Button className="flex-1" disabled={!preferredVehicle} onClick={advance}>Continue</Button>
            </div>
        </div>
    );

    const renderStep4 = () => {
        let title = "";
        let message = "";
        let actions = [];

        const selectedV = vehicles.find(v => v.slug === preferredVehicle)?.name || preferredVehicle;

        if (userType === 'buyer' && preferredVehicle) {
            title = "Great choice!";
            message = `Here's everything about the ${selectedV}.`;
            actions = [
                <Button key="1" size="lg" className="w-full sm:w-auto" onClick={() => { complete(); navigate(`/vehicles/${preferredVehicle}`); }}>View {selectedV}</Button>
            ];
        } else if (userType === 'owner' && preferredVehicle) {
            title = `Welcome, ${selectedV} owner!`;
            message = "Book a service or check your warranty status instantly.";
            actions = [
                <Button key="1" size="lg" className="w-full sm:w-auto mb-3 sm:mb-0 sm:mr-3" onClick={() => { complete(); navigate(`/booking?vehicle=${selectedV}`); }}>Book Service</Button>,
                <Button key="2" variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => { complete(); navigate(`/warranty?model=${selectedV}`); }}>Check Warranty</Button>
            ];
        } else {
            title = "Explore our fleet";
            message = "Browse vehicles, genuine parts, and our services at your own pace.";
            actions = [
                <Button key="1" size="lg" className="w-full sm:w-auto" onClick={() => { complete(); navigate('/vehicles'); }}>Browse Vehicles</Button>
            ];
        }

        return (
            <div className="flex flex-col items-center text-center space-y-6 pt-8">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md pb-6">{message}</p>
                <div className="flex flex-col sm:flex-row w-full justify-center">
                    {actions}
                </div>
            </div>
        );
    };

    const steps = {
        1: renderStep1,
        2: renderStep2,
        3: renderStep3,
        4: renderStep4
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900 p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Welcome Onboarding">
            <div className="absolute top-6 right-6">
                <button onClick={handleSkip} className="text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    Skip
                </button>
            </div>
            
            <div className="w-full max-w-3xl flex flex-col items-center justify-center h-full">
                <div className="w-full flex-1 flex flex-col justify-center relative overflow-hidden">
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full"
                        >
                            {steps[currentStep]()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 mb-4 h-8 flex items-center justify-center">
                    <StepIndicator current={currentStep} total={4} />
                </div>
            </div>
        </div>
    );
};