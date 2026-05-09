import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PageWrapper } from './components/layout/PageWrapper';
import { PageErrorBoundary } from './errors/PageErrorBoundary';
import { Spinner } from './components/ui/Spinner';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { useThemeStore } from './store/themeStore';
import { CompareBar } from './components/shared/CompareBar';
import { InstallPrompt } from './components/ui/InstallPrompt';

// Lazy loaded feature modules
const HomePage = lazy(() => import('./features/home/HomePage').then(module => ({ default: module.HomePage })));
const OffersPage = lazy(() => import('./features/offers/OffersPage').then(module => ({ default: module.OffersPage })));
const FeedbackPage = lazy(() => import('./features/feedback/FeedbackPage').then(module => ({ default: module.FeedbackPage })));
const StorePage = lazy(() => import('./features/store/StorePage').then(module => ({ default: module.StorePage })));
const VehiclesPage = lazy(() => import('./features/vehicles/VehiclesPage').then(module => ({ default: module.VehiclesPage })));
const VehicleDetailPage = lazy(() => import('./features/vehicles/VehicleDetailPage').then(module => ({ default: module.VehicleDetailPage })));
const ComparePage = lazy(() => import('./features/compare/ComparePage').then(module => ({ default: module.ComparePage })));
const BookingPage = lazy(() => import('./features/booking/BookingPage').then(module => ({ default: module.BookingPage })));
const ServiceHistoryPage = lazy(() => import('./features/service-history/ServiceHistoryPage').then(module => ({ default: module.ServiceHistoryPage })));
const InventoryPage = lazy(() => import('./features/inventory/InventoryPage').then(module => ({ default: module.InventoryPage })));
const EMICalculatorPage = lazy(() => import('./features/emi/EMICalculatorPage').then(module => ({ default: module.EMICalculatorPage })));
const FAQPage = lazy(() => import('./features/faq/FAQPage').then(module => ({ default: module.FAQPage })));
const PriceListPage = lazy(() => import('./features/pricelist/PriceListPage').then(module => ({ default: module.PriceListPage })));
const WarrantyPage = lazy(() => import('./features/warranty/WarrantyPage').then(module => ({ default: module.WarrantyPage })));
const ContactPage = lazy(() => import('./features/contact/ContactPage').then(module => ({ default: module.ContactPage })));
const LoyaltyPage = lazy(() => import('./features/loyalty/LoyaltyPage').then(module => ({ default: module.LoyaltyPage })));
const CataloguePage = lazy(() => import('./features/catalogue/CataloguePage').then(module => ({ default: module.CataloguePage })));
const ReviewFormPage = lazy(() => import('./features/reviews/ReviewFormPage').then(module => ({ default: module.ReviewFormPage })));
const NotFoundPage = lazy(() => import('./features/home/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Admin
const AdminLoginPage = lazy(() => import('./features/admin/AdminLoginPage').then(module => ({ default: module.AdminLoginPage })));
const AdminDashboard = lazy(() => import('./features/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminBookings = lazy(() => import('./features/admin/AdminBookings').then(module => ({ default: module.AdminBookings })));
const AdminAnalytics = lazy(() => import('./features/admin/AdminAnalytics').then(module => ({ default: module.AdminAnalytics })));
const AdminInventory = lazy(() => import('./features/admin/AdminInventory').then(module => ({ default: module.AdminInventory })));
const AdminOffers = lazy(() => import('./features/admin/AdminOffers').then(module => ({ default: module.AdminOffers })));
const AdminFeedback = lazy(() => import('./features/admin/AdminFeedback').then(module => ({ default: module.AdminFeedback })));
const AdminClaims = lazy(() => import('./features/admin/AdminClaims').then(module => ({ default: module.AdminClaims })));
const AdminReviews = lazy(() => import('./features/admin/AdminReviews').then(module => ({ default: module.AdminReviews })));
const AdminSettings = lazy(() => import('./features/admin/AdminSettings').then(module => ({ default: module.AdminSettings })));
const AdminPartsUpload = lazy(() => import('./features/admin/AdminPartsUpload').then(module => ({ default: module.AdminPartsUpload })));

const PageLoader = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
    </div>
);

function App() {
    const { theme } = useThemeStore();
    const location = useLocation();

    // Handle Theme class on document body
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    return (
        <PageWrapper>
            <OnboardingFlow />
            <CompareBar />
            <InstallPrompt />
            <PageErrorBoundary key={location.pathname}>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/offers" element={<OffersPage />} />
                        <Route path="/feedback" element={<FeedbackPage />} />
                        <Route path="/catalogue" element={<CataloguePage />} />
                        <Route path="/compare" element={<ComparePage />} />
                        
                        <Route path="/vehicles" element={<VehiclesPage />} />
                        <Route path="/vehicles/:slug" element={<VehicleDetailPage />} />
                        <Route path="/store" element={<StorePage />} />
                        <Route path="/booking" element={<BookingPage />} />
                        <Route path="/service-history" element={<ServiceHistoryPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/emi" element={<EMICalculatorPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/prices" element={<PriceListPage />} />
                        <Route path="/warranty" element={<WarrantyPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/loyalty" element={<LoyaltyPage />} />
                        <Route path="/reviews" element={<ReviewFormPage />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLoginPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />}>
                            <Route path="bookings" element={<AdminBookings />} />
                            <Route path="analytics" element={<AdminAnalytics />} />
                            <Route path="inventory" element={<AdminInventory />} />
                            <Route path="offers" element={<AdminOffers />} />
                            <Route path="feedback" element={<AdminFeedback />} />
                            <Route path="claims" element={<AdminClaims />} />
                            <Route path="reviews" element={<AdminReviews />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="parts-upload" element={<AdminPartsUpload />} />
                        </Route>
                        
                        {/* Catch all */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </PageErrorBoundary>
        </PageWrapper>
    );
}

export default App;