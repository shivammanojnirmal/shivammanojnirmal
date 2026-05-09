import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            addNotification: (notification) => {
                set((state) => {
                    // Deduplicate identical notifications by id or title+body if id missing
                    const isDuplicate = state.notifications.some(n => 
                        (notification.id && n.id === notification.id) || 
                        (n.title === notification.title && n.body === notification.body)
                    );
                    
                    if (isDuplicate) return state;

                    const newNotification = {
                        ...notification,
                        id: notification.id || crypto.randomUUID(),
                        read: false,
                        created_at: notification.created_at || new Date().toISOString()
                    };

                    const updatedList = [newNotification, ...state.notifications].slice(0, 50); // Cap at 50
                    
                    return {
                        notifications: updatedList,
                        unreadCount: updatedList.filter(n => !n.read).length
                    };
                });
            },

            markRead: (id) => {
                set((state) => {
                    const updated = state.notifications.map(n => 
                        n.id === id ? { ...n, read: true } : n
                    );
                    return {
                        notifications: updated,
                        unreadCount: updated.filter(n => !n.read).length
                    };
                });
            },

            markAllRead: () => {
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, read: true })),
                    unreadCount: 0
                }));
            },

            removeNotification: (id) => {
                set((state) => {
                    const updated = state.notifications.filter(n => n.id !== id);
                    return {
                        notifications: updated,
                        unreadCount: updated.filter(n => !n.read).length
                    };
                });
            },

            clearAll: () => {
                set({ notifications: [], unreadCount: 0 });
            }
        }),
        {
            name: 'jmd-notifications'
        }
    )
);