import React, { useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Gift, Share2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReferralCard = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
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
                                value={code} 
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
    );
};