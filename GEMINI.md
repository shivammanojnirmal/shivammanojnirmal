# JMD Auto Care - Project Instructions

This document provides essential context and instructions for working on the JMD Auto Care digital platform.

## Project Overview
JMD Auto Care is a specialized dealer management system and customer portal for an authorized Ampere EV dealership. It is a modern, responsive **React 18** application built with **Vite**, featuring Progressive Web App (PWA) capabilities and a serverless-style backend using **Google Sheets**.

### Core Technology Stack
- **Frontend:** React 18, React Router v6, Tailwind CSS, Framer Motion.
- **State Management:** Zustand (with persistence for cart, theme, and auth).
- **Backend/Data:** Google Sheets via Google Apps Script (REST API).
- **Tooling:** Vite, Zod (Schema validation), Lucide React (Icons), jsPDF (Reporting).
- **PWA:** `vite-plugin-pwa` for offline support and service worker management.

## Project Structure
- `src/features/`: Domain-driven feature modules (Admin, Booking, Store, Catalogue, etc.).
- `src/store/`: Zustand stores for global application state.
- `src/hooks/`: Custom React hooks for data fetching and business logic.
- `src/services/`: API communication layers (Apps Script, CSV parsing).
- `src/utils/`: Shared utilities, calculation engines (EMI, Coupons), and constants.
- `src/components/ui/`: Reusable, atomic UI components.

## Building and Running
### Environment Setup
Ensure a `.env` file exists with the following variables:
```env
VITE_SHEETS_BASE_URL=...
VITE_APPS_SCRIPT_URL=...
VITE_WA_NUMBER=...
VITE_ADMIN_ID=...
VITE_ADMIN_PASS=...
VITE_VAPID_PUBLIC_KEY=...
VITE_SITE_URL=...
```

### Commands
- **Development:** `npm run dev` (Starts the Vite development server)
- **Production Build:** `npm run build` (Generates optimized assets in `dist/`)
- **Build Analysis:** `npm run analyze` (Visualizes bundle size)
- **Linting:** `npm run lint` (Runs ESLint on source files)
- **Preview Build:** `npm run preview` (Serves the production build locally)

## Development Conventions
- **Feature Isolation:** New business logic should be placed in `src/features/` under the relevant domain.
- **UI Components:** Use the atomic components in `src/components/ui/` for consistency. Follow the existing Tailwind patterns (e.g., using `sky-500` for brand colors).
- **Data Fetching:** Use custom hooks in `src/hooks/` that wrap services to maintain a clean separation between UI and data layers.
- **Error Handling:** Wrap new pages or major sections in `PageErrorBoundary` or `SectionErrorBoundary`.
- **Integrations:** 
    - **WhatsApp:** Use `whatsappBuilder` in `src/utils/` for generating pre-filled messages.
    - **Forms:** Use `react-hook-form` with `zod` schemas located in `src/schemas/`.
- **Performance:** Use `lazy` and `Suspense` for all top-level routes to ensure small initial bundle sizes.

## PWA & Deployment
- The app is pre-configured for **Netlify** deployment via `netlify.toml`.
- PWA manifest and service worker configuration are managed in `vite.config.js`.
- For Web Push notifications, VAPID keys must be generated and added to the environment configuration as described in the README.
