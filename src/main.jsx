import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalErrorBoundary } from './errors/GlobalErrorBoundary';
import './styles/index.css';
import { Toaster } from 'react-hot-toast';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
            updateSW(true);
        }
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalErrorBoundary>
            <BrowserRouter>
                <App />
                <Toaster 
                    position="bottom-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#334155',
                            color: '#fff',
                            borderRadius: '0.75rem',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </BrowserRouter>
        </GlobalErrorBoundary>
    </React.StrictMode>
);