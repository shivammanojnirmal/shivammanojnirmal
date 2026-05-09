import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { 
    LayoutDashboard, 
    Calendar, 
    Package, 
    MessageSquare, 
    Settings, 
    BarChart3, 
    LogOut, 
    Menu, 
    X,
    ChevronRight,
    Tag,
    ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { logout, user, isAuthenticated } = useAdminStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    const navItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard />, end: true },
        { name: 'Bookings', path: '/admin/bookings', icon: <Calendar /> },
        { name: 'Inventory', path: '/admin/inventory', icon: <Package /> },
        { name: 'Claims', path: '/admin/claims', icon: <ClipboardCheck /> },
        { name: 'Offers', path: '/admin/offers', icon: <Tag /> },
        { name: 'Feedback', path: '/admin/feedback', icon: <MessageSquare /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings /> },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden">
            
            {/* Sidebar Mobile Overlay */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside 
                className={`fixed md:relative z-30 flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}
            >
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-700 shrink-0">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'md:hidden'}`}>
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">J</div>
                        <span className="font-bold text-slate-900 dark:text-white truncate uppercase tracking-wider text-sm">JMD Admin</span>
                    </div>
                    <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                    {!isSidebarOpen && (
                        <div className="hidden md:flex w-full justify-center">
                             <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">J</div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => 
                                `flex items-center px-3 py-2.5 rounded-xl transition-all group ${
                                    isActive 
                                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' 
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`
                            }
                        >
                            <span className={`shrink-0 ${isSidebarOpen ? 'mr-3' : 'md:mx-auto'}`}>
                                {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                            </span>
                            {isSidebarOpen && (
                                <span className="text-sm font-medium">{item.name}</span>
                            )}
                            {isActive && isSidebarOpen && (
                                <motion.div layoutId="activeNav" className="ml-auto">
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                </motion.div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                    <button 
                        onClick={handleLogout}
                        className={`flex items-center w-full px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all ${!isSidebarOpen && 'md:justify-center'}`}
                    >
                        <LogOut className={`w-5 h-5 ${isSidebarOpen && 'mr-3'}`} />
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.username}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Administrator</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-primary-600 font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Viewport */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <Outlet />
                    {/* If we are exactly at /admin/dashboard, we might want to render Overview here if not using Outlet */}
                    {location.pathname === '/admin/dashboard' && <AdminOverview />}
                </div>
            </main>
        </div>
    );
};

// Placeholder for Overview within the same file to ensure stability
const AdminOverview = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Bookings', value: '124', trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'NPS Score', value: '78', trend: '+5', color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'Active Offers', value: '4', trend: '0', color: 'text-orange-600', bg: 'bg-orange-100' },
                    { label: 'Low Stock Items', value: '12', trend: '-2', color: 'text-red-600', bg: 'bg-red-100' },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardBody className="p-6">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold">Recent Bookings</h3>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500">
                                <tr>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Vehicle</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                                        <td className="p-4 font-medium">Customer {i}</td>
                                        <td className="p-4">Magnus EX</td>
                                        <td className="p-4 text-xs">Regular Service</td>
                                        <td className="p-4 text-right">
                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">Pending</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
                
                <Card>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold">Inventory Health</h3>
                    </div>
                    <CardBody>
                        <div className="space-y-6">
                            {[
                                { model: 'Magnus EX', health: 85, color: 'bg-green-500' },
                                { model: 'Primus', health: 42, color: 'bg-amber-500' },
                                { model: 'Rio', health: 92, color: 'bg-green-500' },
                                { model: 'NXG', health: 15, color: 'bg-red-500' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{item.model}</span>
                                        <span className="text-slate-500">{item.health}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.health}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};