import React from 'react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8">
                <h1 className="text-[12rem] font-black text-slate-100 dark:text-slate-800 leading-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">Oops! Lost in Space?</p>
                </div>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 text-lg">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    leftIcon={<ArrowLeft className="w-5 h-5" />}
                >
                    Go Back
                </Button>
                <Button 
                    size="lg" 
                    onClick={() => navigate('/')}
                    leftIcon={<Home className="w-5 h-5" />}
                >
                    Return Home
                </Button>
            </div>
        </div>
    );
};