import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Tag, AlertTriangle, Info, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/notificationStore';
import { formatRelativeTime } from '../../utils/formatters';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { Button } from '../ui/Button';

const getIconForType = (type) => {
    switch (type) {
        case 'booking_confirmed': return <Check className="w-4 h-4 text-green-500" />;
        case 'offer': return <Tag className="w-4 h-4 text-orange-500" />;
        case 'warranty_expiring': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
        case 'system': default: return <Info className="w-4 h-4 text-blue-500" />;
    }
};

const getBgForType = (type) => {
    switch (type) {
        case 'booking_confirmed': return 'bg-green-100 dark:bg-green-900/30';
        case 'offer': return 'bg-orange-100 dark:bg-orange-900/30';
        case 'warranty_expiring': return 'bg-amber-100 dark:bg-amber-900/30';
        case 'system': default: return 'bg-blue-100 dark:bg-blue-900/30';
    }
};

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    const { notifications, unreadCount, markRead, markAllRead, removeNotification, clearAll } = useNotificationStore();
    const { permission, isSubscribed, subscribe, unsubscribe, isProcessing } = usePushNotifications();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleNotificationClick = (notification) => {
        markRead(notification.id);
        if (notification.url) {
            setIsOpen(false);
            if (notification.url.startsWith('http')) {
                window.location.href = notification.url;
            } else {
                navigate(notification.url);
            }
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-slate-600 hover:text-primary-600 hover:bg-primary-50 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"
                        />
                    )}
                </AnimatePresence>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 flex flex-col"
                        style={{ maxHeight: 'calc(100vh - 100px)' }}
                        role="region" 
                        aria-label="Notifications Panel"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="overflow-y-auto flex-1 max-h-96">
                            {notifications.length === 0 ? (
                                <div className="py-12 px-4 text-center">
                                    <Bell className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">No notifications yet.</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {notifications.map(n => (
                                        <motion.div
                                            key={n.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className={`relative group flex gap-3 p-4 border-b border-slate-50 dark:border-slate-700/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!n.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                                            onClick={() => handleNotificationClick(n)}
                                        >
                                            {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                                            <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getBgForType(n.type)}`}>
                                                {getIconForType(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-6">
                                                <p className={`text-sm truncate ${!n.read ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                    {n.body}
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
                                                    {formatRelativeTime(n.created_at)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                                                className="absolute right-2 top-2 p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                                                aria-label="Remove notification"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 flex flex-col gap-2">
                            {('serviceWorker' in navigator) && ('PushManager' in window) && (
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs text-slate-600 dark:text-slate-400">Push Notifications</span>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-[10px] py-1 px-2 h-auto"
                                        isLoading={isProcessing}
                                        onClick={isSubscribed ? unsubscribe : subscribe}
                                    >
                                        {isSubscribed ? 'Disable' : 'Enable'}
                                    </Button>
                                </div>
                            )}
                            {notifications.length > 0 && (
                                <button 
                                    onClick={clearAll}
                                    className="text-xs font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 w-full text-center py-1 mt-1"
                                >
                                    Clear all notifications
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};