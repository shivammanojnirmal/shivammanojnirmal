import { config } from '../utils/config';

export const pushService = {
    /**
     * Request permission and subscribe to web push
     * @returns {Promise<PushSubscription|null>}
     */
    subscribePush: async () => {
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                throw new Error('Push notifications are not supported by this browser.');
            }

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('Notification permission denied');
            }

            const registration = await navigator.serviceWorker.ready;
            
            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                return subscription; // Already subscribed
            }

            // Subscribe
            const applicationServerKey = pushService.urlB64ToUint8Array(config.vapidPublicKey);
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey
            });

            // Write subscription to sheets backend
            await pushService.saveSubscriptionToBackend(subscription);

            return subscription;
        } catch (error) {
            console.error('Error subscribing to push:', error);
            throw error;
        }
    },

    /**
     * Unsubscribe from web push
     */
    unsubscribePush: async () => {
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                await subscription.unsubscribe();
                // Optionally call backend to remove subscription
                // await pushService.removeSubscriptionFromBackend(subscription.endpoint);
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
        }
    },

    /**
     * Check if currently subscribed
     * @returns {Promise<boolean>}
     */
    isSubscribed: async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            return !!subscription;
        } catch {
            return false;
        }
    },

    /**
     * Internal: Save to Apps Script backend
     */
    saveSubscriptionToBackend: async (subscription) => {
        if (!config.appsScriptUrl) return;
        
        try {
            const subJson = subscription.toJSON();
            const payload = {
                sheet: 'push_subscriptions',
                row: {
                    endpoint: subJson.endpoint,
                    keys_json: JSON.stringify(subJson.keys),
                    date_subscribed: new Date().toISOString(),
                    active: 'true'
                }
            };

            await fetch(config.appsScriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Failed to save subscription to backend:', error);
            // Don't throw, we still successfully subscribed locally
        }
    },

    /**
     * Utility to convert VAPID key
     */
    urlB64ToUint8Array: (base64String) => {
        if (!base64String) return null;
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\\-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
};