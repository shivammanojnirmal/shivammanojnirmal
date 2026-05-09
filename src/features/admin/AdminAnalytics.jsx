import React, { useState, useEffect, useMemo } from 'react';
import { useURLState } from '../../hooks/useURLState';
import { fetchSheetData } from '../../services/sheets';
import { SkeletonTransition } from '../../components/ui/SkeletonTransition';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { npsEngine } from '../../utils/npsEngine';
import { 
    TrendingUp, 
    Users, 
    CheckCircle, 
    AlertTriangle, 
    RefreshCcw,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminAnalytics = () => {
    const [data, setData] = useState({ 
        events: [], 
        feedback: [], 
        subs: [], 
        bookings: [],
        offers: [],
        inventory: [] 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [range, setRange] = useURLState('range', '30d');

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [events, feedback, subs, bookings, offers, inventory] = await Promise.all([
                fetchSheetData('analytics'),
                fetchSheetData('feedback'),
                fetchSheetData('push_subscriptions'),
                fetchSheetData('bookings'),
                fetchSheetData('offers'),
                fetchSheetData('inventory')
            ]);
            setData({ events, feedback, subs, bookings, offers, inventory });
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
        const interval = setInterval(loadAllData, 5 * 60 * 1000); // Auto-refresh 5 mins
        return () => clearInterval(interval);
    }, []);

    // Derived Metrics
    const npsSummary = npsEngine.scoreSummary(data.feedback);
    const totalBookings = data.bookings.length;
    const completedBookings = data.bookings.filter(b => b.status === 'completed').length;
    const bookingRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;
    const couponUsageRate = data.offers.length > 0 ? 
        (data.offers.reduce((acc, o) => acc + (Number(o.times_used) || 0), 0) / 
        data.offers.reduce((acc, o) => acc + (Number(o.usage_limit) || 100), 0) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8 pb-20">
            
            {/* Control Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Business Intelligence</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Last synced: {lastUpdated.toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        {['7d', '30d', '90d', 'all'].map(r => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-all ${range === r ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <button onClick={loadAllData} className="p-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <SkeletonTransition loading={loading} skeleton={<div className="grid grid-cols-1 md:grid-cols-4 gap-6">{Array.from({length: 4}).map((_,i) => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}</div>}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard label="NPS Score" value={npsSummary.nps} subtext="Customer Loyalty" icon={<TrendingUp />} color="text-green-600" bg="bg-green-50" trend="+4%" />
                    <MetricCard label="Booking Rate" value={`${bookingRate}%`} subtext="Lead Conversion" icon={<Calendar />} color="text-primary-600" bg="bg-primary-50" trend="+12%" />
                    <MetricCard label="Push Subs" value={data.subs.length} subtext="Digital Reach" icon={<Zap />} color="text-amber-600" bg="bg-amber-50" trend="+8%" />
                    <MetricCard label="Coupon ROI" value={`${couponUsageRate}%`} subtext="Offer Uptake" icon={<ShoppingBag />} color="text-purple-600" bg="bg-purple-50" trend="-2%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chart 1: NPS Trend */}
                    <ChartCard title="NPS Trend Over Time">
                        <LineChart data={data.feedback} />
                    </ChartCard>

                    {/* Chart 2: Offer Performance */}
                    <ChartCard title="Offer Performance (Usage)">
                        <HorizontalBarChart data={data.offers} />
                    </ChartCard>

                    {/* Chart 3: Service Type Distribution */}
                    <ChartCard title="Service Composition">
                        <DonutChart data={data.bookings} />
                    </ChartCard>

                    {/* Chart 4: Inventory Health */}
                    <ChartCard title="Inventory Health by Model">
                        <StackedBarChart data={data.inventory} />
                    </ChartCard>

                    {/* Chart 5: Daily Bookings Volume */}
                    <ChartCard title="Daily Booking Velocity">
                        <AreaChart data={data.bookings} />
                    </ChartCard>

                    {/* Chart 6: Lead Source Funnel */}
                    <ChartCard title="Inquiry Conversion Funnel">
                        <FunnelChart data={data.events} />
                    </ChartCard>

                    {/* Chart 7: Customer Engagement Gauge */}
                    <ChartCard title="User Retention Health">
                        <GaugeChart value={72} />
                    </ChartCard>

                    {/* Chart 8: Revenue Velocity Projection */}
                    <ChartCard title="Projected Revenue Trend">
                        <ProjectionChart data={data.bookings} />
                    </ChartCard>
                </div>
            </SkeletonTransition>
        </div>
    );
};

// --- Sub Components ---

const MetricCard = ({ label, value, subtext, icon, color, bg, trend }) => (
    <Card className="border-none shadow-sm">
        <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
                    {React.cloneElement(icon, { className: 'w-6 h-6' })}
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend}
                </span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
        </CardBody>
    </Card>
);

const ChartCard = ({ title, children }) => (
    <Card>
        <CardHeader className="border-none pb-0">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">{title}</CardTitle>
        </CardHeader>
        <CardBody className="h-72 relative">
            {children}
        </CardBody>
    </Card>
);

// --- SVG Charts ---

const LineChart = ({ data }) => {
    // Mock points for a line
    const points = "0,80 40,60 80,90 120,40 160,70 200,30 240,50 280,20";
    return (
        <svg viewBox="0 0 300 100" className="w-full h-full preserve-3d">
            <polyline
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeLinecap="round"
                points={points}
                style={{ filter: 'drop-shadow(0 4px 6px rgba(14,165,233,0.3))' }}
            />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#cbd5e1" strokeDasharray="4" />
        </svg>
    );
};

const HorizontalBarChart = ({ data }) => {
    const topOffers = [...data].sort((a,b) => Number(b.times_used) - Number(a.times_used)).slice(0, 5);
    return (
        <div className="flex flex-col justify-center h-full gap-4">
            {topOffers.map((o, i) => (
                <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                        <span>{o.code}</span>
                        <span>{o.times_used}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (Number(o.times_used)/20)*100)}%` }}
                            className="h-full bg-primary-500"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const DonutChart = ({ data }) => {
    const total = data.length || 1;
    const regular = data.filter(b => b.service_type === 'Regular Service').length;
    const perc = (regular / total) * 100;
    const dash = (perc * 251.2) / 100;

    return (
        <div className="flex items-center justify-center h-full">
            <svg viewBox="0 0 100 100" className="w-48 h-48 -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                <motion.circle 
                    cx="50" cy="50" r="40" stroke="#0ea5e9" strokeWidth="10" fill="none"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - dash }}
                    transition={{ duration: 1 }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black">{Math.round(perc)}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Regular</span>
            </div>
        </div>
    );
};

const StackedBarChart = ({ data }) => {
    const models = ['Magnus', 'Nexus', 'Primus'];
    return (
        <div className="flex items-end justify-between h-full pt-10 gap-6">
            {models.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col-reverse rounded-lg overflow-hidden h-40">
                        <div className="bg-red-500 h-1/4" />
                        <div className="bg-amber-500 h-1/4" />
                        <div className="bg-green-500 h-1/2" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{m}</span>
                </div>
            ))}
        </div>
    );
};

const AreaChart = () => (
    <svg viewBox="0 0 300 100" className="w-full h-full">
        <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </linearGradient>
        </defs>
        <path fill="url(#areaGradient)" d="M0,100 L0,50 L50,30 L100,70 L150,20 L200,60 L250,40 L300,80 L300,100 Z" />
        <path fill="none" stroke="#0ea5e9" strokeWidth="2" d="M0,50 L50,30 L100,70 L150,20 L200,60 L250,40 L300,80" />
    </svg>
);

const FunnelChart = () => (
    <div className="flex flex-col items-center justify-center h-full gap-2">
        <div className="w-full bg-primary-600 h-12 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">100% Views</div>
        <div className="w-4/5 bg-primary-500 h-12 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">64% Inquiries</div>
        <div className="w-2/5 bg-primary-400 h-12 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">18% Bookings</div>
    </div>
);

const GaugeChart = ({ value }) => {
    const dash = (value / 100) * 125.6;
    return (
        <div className="flex items-center justify-center h-full">
            <svg viewBox="0 0 100 50" className="w-48 h-24">
                <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                <motion.path 
                    d="M10,50 A40,40 0 0,1 90,50" 
                    fill="none" 
                    stroke="#0ea5e9" 
                    strokeWidth="10" 
                    strokeLinecap="round"
                    strokeDasharray="125.6"
                    initial={{ strokeDashoffset: 125.6 }}
                    animate={{ strokeDashoffset: 125.6 - dash }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute mt-6 text-xl font-black">{value}%</div>
        </div>
    );
};

const ProjectionChart = () => (
    <div className="flex items-end justify-between h-full gap-2 pt-10">
        {[40, 55, 45, 60, 80, 75, 95].map((h, i) => (
            <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className={`flex-1 rounded-t-md ${i > 4 ? 'bg-primary-300 border-2 border-dashed border-primary-500' : 'bg-primary-500'}`}
            />
        ))}
    </div>
);