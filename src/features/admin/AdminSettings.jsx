import React, { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/shared/SEOHead';
import { Bell, Shield, Lock, MapPin, Globe, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettings = () => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Settings saved successfully');
        }, 1000);
    };

    return (
        <div className="max-w-4xl space-y-8 pb-20">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Site Settings</h1>

            <div className="grid grid-cols-1 gap-8">
                
                {/* General Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-primary-500" />
                            General Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">WhatsApp Business Number</label>
                                <input type="text" defaultValue="919890202091" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Showroom Name</label>
                                <input type="text" defaultValue="Jai Mata Di Auto Care" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Official Address</label>
                            <textarea rows={2} defaultValue="Loni Kh., Maharashtra, India" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </CardBody>
                </Card>

                {/* Notifications & Push */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-orange-500" />
                            Notification System
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-sm">Enable Web Push Notifications</h4>
                                <p className="text-xs text-slate-500">Broadcast offers to subscribed customers</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-primary-600 transition-colors cursor-pointer relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform checked:after:translate-x-5" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-sm">Automated Service Reminders</h4>
                                <p className="text-xs text-slate-500">Send WhatsApp alerts when service is due</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-primary-600 transition-colors cursor-pointer relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform checked:after:translate-x-5" />
                        </div>
                    </CardBody>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-green-500" />
                            Access Control
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
                            <strong>Note:</strong> Admin credentials are managed via environment variables (VITE_ADMIN_ID / VITE_ADMIN_PASS) in the hosting provider (Netlify).
                        </p>
                        <div className="flex gap-4">
                            <Button variant="outline" size="sm" leftIcon={<Lock className="w-4 h-4"/>}>Rotate Session Keys</Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50">Log out all devices</Button>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button size="lg" className="px-12" isLoading={isSaving} onClick={handleSave}>
                        Save All Changes
                    </Button>
                </div>

            </div>
        </div>
    );
};