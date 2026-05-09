import { useState, useEffect, useCallback } from 'react';
import { pushService } from '../services/pushService';
import toast from 'react-hot-toast';

export const usePushNotifications = () => {
    const [permission, setPermission] = useState('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            if (!('Notification' in window)) return;
            setPermission(Notification.permission);
            const subscribed = await pushService.isSubscribed();
            setIsSubscribed(subscribed);
        };
        checkStatus();
    }, []);

    const subscribe = useCallback(async () => {
        if (!('Notification' in window)) {
            toast.error('Push notifications are not supported by your browser.');
            return false;
        }

        setIsProcessing(true);
        try {
            await pushService.subscribePush();
            setPermission(Notification.permission);
            setIsSubscribed(true);
            toast.success('Successfully subscribed to notifications!');
            return true;
        } catch (error) {
            console.error(error);
            if (Notification.permission === 'denied') {
                toast.error('Please enable notifications in your browser settings.');
            } else {
                toast.error("Couldn't enable notifications. Check browser permissions.");
            }
            return false;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const unsubscribe = useCallback(async () => {
        setIsProcessing(true);
        try {
            await pushService.unsubscribePush();
            setIsSubscribed(false);
            toast.success('Unsubscribed from notifications.');
            return true;
        } catch (error) {
            toast.error('Failed to unsubscribe.');
            return false;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return {
        permission,
        isSubscribed,
        isProcessing,
        subscribe,
        unsubscribe
    };
};