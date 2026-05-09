import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCenter } from '../shared/NotificationCenter';
import { GlobalSearch } from '../shared/GlobalSearch';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';
import { Badge } from '../ui/Badge';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    
    const cartItemsCount = useCartStore((state) => state.getItemCount());
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Vehicles', path: '/vehicles' },
        { name: 'Store', path: '/store' },
        { name: 'Service', path: '/booking' },
        { name: 'Offers', path: '/offers' },
        { name: 'More', isDropdown: true, children: [
            { name: 'Compare', path: '/compare' },
            { name: 'Inventory Tracker', path: '/inventory' },
            { name: 'Service History', path: '/service-history' },
            { name: 'EMI Calculator', path: '/emi' },
            { name: 'Warranty Check', path: '/warranty' },
            { name: 'Price List', path: '/prices' },
            { name: 'FAQ', path: '/faq' },
            { name: 'Contact', path: '/contact' }
        ]}
    ];

    const DesktopDropdown = ({ item }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div 
                className="relative"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <button className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 flex items-center">
                    {item.name}
                    <svg className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                        >
                            {item.children.map(child => (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    className={({ isActive }) => 
                                        `block px-4 py-2 text-sm ${isActive ? 'bg-primary-50 text-primary-600 font-medium dark:bg-primary-900/20 dark:text-primary-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`
                                    }
                                >
                                    {child.name}
                                </NavLink>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <nav 
            className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 print-hide ${
                isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo Area */}
                    <div className={`flex items-center shrink-0 ${searchExpanded ? 'hidden md:flex' : 'flex'}`}>
                        <NavLink to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-primary-700 transition-colors shadow-inner">
                                JM
                            </div>
                            <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block tracking-tight">
                                Jai Mata Di <span className="text-primary-600 dark:text-primary-400">Auto Care</span>
                            </span>
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1 px-8">
                        {!searchExpanded && (
                            <div className="flex space-x-1">
                                {navLinks.map((link) => (
                                    link.isDropdown ? (
                                        <DesktopDropdown key={link.name} item={link} />
                                    ) : (
                                        <NavLink
                                            key={link.name}
                                            to={link.path}
                                            className={({ isActive }) => 
                                                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isActive 
                                                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Action Icons */}
                    <div className={`flex items-center gap-1 sm:gap-2 ${searchExpanded ? 'w-full md:w-auto ml-0 md:ml-auto' : 'ml-auto'}`}>
                        <div className={`flex-1 flex justify-end ${searchExpanded ? 'w-full' : ''}`}>
                            <GlobalSearch isExpanded={searchExpanded} setIsExpanded={setSearchExpanded} />
                        </div>

                        {!searchExpanded && (
                            <>
                                <button 
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                <NotificationCenter />

                                <button 
                                    onClick={() => navigate('/store?cart=open')}
                                    className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    aria-label="Cart"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <AnimatePresence>
                                        {cartItemsCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute top-0 right-0 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white dark:border-slate-900"
                                            >
                                                {cartItemsCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>

                                {/* Mobile menu button */}
                                <div className="md:hidden flex items-center">
                                    <button
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        aria-expanded={mobileMenuOpen}
                                    >
                                        <span className="sr-only">Open main menu</span>
                                        {mobileMenuOpen ? <X className="block w-6 h-6" /> : <Menu className="block w-6 h-6" />}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1 h-[80vh] overflow-y-auto">
                            {navLinks.map((link) => (
                                link.isDropdown ? (
                                    <div key={link.name} className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 mt-4">
                                        <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            {link.name}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {link.children.map(child => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    className={({ isActive }) => 
                                                        `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                                                            isActive 
                                                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                                                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                                                        }`
                                                    }
                                                >
                                                    {child.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <NavLink
                                        key={link.name}
                                        to={link.path}
                                        className={({ isActive }) => 
                                            `block px-3 py-3 rounded-lg text-base font-medium ${
                                                isActive 
                                                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                                                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                                            }`
                                        }
                                    >
                                        {link.name}
                                    </NavLink>
                                )
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};