import React, { useState, useEffect } from 'react';
import { useLoyaltyStore } from '../../store/loyaltyStore';
import { fetchSheetData, submitToSheet } from '../../services/sheets';
import { SEOHead } from '../../components/shared/SEOHead';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Gift, Share2, Award, History, Copy, Check, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const LoyaltyPage = () => {
    const { referredBy, setReferredBy } = useLoyaltyStore();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Mock referral code generation
    const myReferralCode = "JMD-SHIV-9198";

    const handleCopy = () => {
        navigator.clipboard.writeText(myReferralCode);
        setCopied(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <SEOHead title="Loyalty Program" description="Join the JMD Rewards program and earn points for every service and referral." />
            
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    JMD Rewards
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Our way of saying thank you for choosing sustainable mobility. Earn points for service visits and referrals.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Profile / Points Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        <CardBody className="p-8 relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
                                    SN
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Shivam Nirmal</h3>
                                    <p className="text-primary-100 text-sm">Platinum Member</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1 mb-8">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-200">Current Balance</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black">2,450</span>
                                    <span className="text-lg font-bold text-primary-200">Points</span>
                                </div>
                            </div>

                            <Button variant="secondary" className="w-full bg-white text-primary-600 hover:bg-primary-50 border-none font-bold">
                                Redeem Rewards
                            </Button>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="p-6">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-primary-500" />
                                Membership Benefits
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    '5% extra discount on genuine parts',
                                    'Priority service booking slots',
                                    'Free 10-point checkup every quarter',
                                    'Birthday special service coupons'
                                ].map((b, i) => (
                                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-3">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                </div>

                {/* Referral & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Referral Section */}
                    <Card className="bg-slate-900 text-white border-none overflow-hidden group">
                        <CardBody className="p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
                            <div className="flex-1 space-y-4 text-center sm:text-left">
                                <Badge variant="warning" className="uppercase font-black tracking-widest text-[10px]">Refer & Earn</Badge>
                                <h3 className="text-3xl font-bold">Invite a Friend</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Gift a friend ₹500 off their first service, and earn <span className="text-white font-bold">250 points</span> when they complete their visit.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value={myReferralCode} 
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 font-mono font-bold text-lg outline-none"
                                        />
                                        <button 
                                            onClick={handleCopy}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
                                        >
                                            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <Button size="lg" leftIcon={<Share2 className="w-5 h-5" />} className="px-8">Share</Button>
                                </div>
                            </div>
                            <div className="shrink-0 relative">
                                <div className="absolute inset-0 bg-primary-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                                <Gift className="w-32 h-32 text-primary-500 relative z-10" />
                            </div>
                        </CardBody>
                    </Card>

                    {/* History Section */}
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
                                        {[
                                            { activity: 'Regular Service - Magnus EX', date: '12 Jan 2024', points: '+150', type: 'earn' },
                                            { activity: 'Referral Bonus: Rahul M.', date: '05 Jan 2024', points: '+250', type: 'earn' },
                                            { activity: 'Genuine Part: Battery', date: '28 Dec 2023', points: '+80', type: 'earn' },
                                            { activity: 'Reward Redemption: Free Oil Change', date: '15 Nov 2023', points: '-500', type: 'redeem' }
                                        ].map((log, i) => (
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
                </div>

            </div>
        </div>
    );
};