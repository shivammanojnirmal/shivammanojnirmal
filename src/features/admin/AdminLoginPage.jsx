import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema } from '../../schemas/adminLoginSchema';
import { useAdminStore } from '../../store/adminStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { config } from '../../utils/config';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { SEOHead } from '../../components/shared/SEOHead';
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const login = useAdminStore((state) => state.login);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Redirect path after login
    const from = location.state?.from?.pathname || "/admin/dashboard";

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: zodResolver(adminLoginSchema)
    });

    const onSubmit = (data) => {
        // Since this is a client-side only app without a traditional backend,
        // we validate against configured environment variables.
        if (data.username === config.adminId && data.password === config.adminPass) {
            login(data.username);
            toast.success('Welcome back, Admin!');
            navigate(from, { replace: true });
        } else {
            setError('root', { message: 'Invalid credentials. Access denied.' });
            toast.error('Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <SEOHead title="Admin Login" />
            
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white font-bold text-2xl mb-4 shadow-lg">
                        JM
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Management Portal</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Authorized access only</p>
                </div>

                <Card>
                    <CardBody className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {errors.root && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                                    {errors.root.message}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Admin ID</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="Enter ID"
                                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.username ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`}
                                        {...register('username')}
                                    />
                                </div>
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-900 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`}
                                        {...register('password')}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                                Log In
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-sm text-slate-500 hover:text-primary-600 transition-colors"
                    >
                        &larr; Back to Public Website
                    </button>
                </div>
            </div>
        </div>
    );
};