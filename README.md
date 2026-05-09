# JMD Auto Care v5 - Production Management System

Authorized Ampere EV Dealership Digital Platform.

## 🚀 Environment Setup
Create a `.env` file in the root and populate the following:

```env
VITE_SHEETS_BASE_URL=https://docs.google.com/spreadsheets/d/YOUR_ID
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_WA_NUMBER=919890202091
VITE_ADMIN_ID=ShivamNirmal
VITE_ADMIN_PASS=041404
VITE_VAPID_PUBLIC_KEY=YOUR_VAPID_KEY
VITE_SITE_URL=https://jmdautocare.in
```

## 🔔 Web Push Setup
To generate VAPID keys for push notifications:
1. Install web-push globally: `npm install -g web-push`
2. Run: `web-push generate-vapid-keys`
3. Add the public key to `VITE_VAPID_PUBLIC_KEY`.
## 📈 NPS & Feedback Interpretation
The Net Promoter Score is calculated as:
- **Promoters (9-10):** Enthusiastic customers who will refer others.
- **Passives (7-8):** Satisfied but unenthusiastic customers.
- **Detractors (0-6):** Unhappy customers who can damage your brand.
**NPS Calculation:** `% Promoters - % Detractors`.
A score above 50 is considered excellent, and above 70 is world-class.

## 🔔 Web Push Setup
To generate VAPID keys for push notifications:
1. Install web-push globally: `npm install -g web-push`
2. Run: `web-push generate-vapid-keys`
3. Add the public key to `VITE_VAPID_PUBLIC_KEY` and the private key to your server-side environment.
4. The application handles subscription storage automatically in the `push_subscriptions` sheet.

## 📦 Inventory Management Setup
In your Google Sheet `inventory` tab, ensure:
- `reorder_level` is set based on lead times (suggested: 5 for fast-moving items like brake pads, 2 for batteries).
- `stock_qty` updates reflect physical stock. The Admin Dashboard supports inline editing for these fields.

## 📋 PDF Export
The application uses `jsPDF` with the `jspdf-autotable` plugin for professional reporting.
- **Service History:** Masked phone numbers are used for privacy.
- **Price List:** Ex-showroom price focus with standard legal disclaimers.

## 🛠 Features Included
...
- **Commerce:** Virtualized Parts Store, WhatsApp Checkout, Coupon Engine.
- **Admin:** SVG Analytics, Inventory Management, Claim Triage, Review Moderation.
- **Customer Tools:** EMI Amortization, Warranty Verification, Vehicle Comparison.
- **Resilience:** Multi-tier Error Boundaries, Offline PWA Support, Sheet Fallbacks.

## 📦 Deployment
Deploy to Netlify by linking your repository. The `netlify.toml` and `_redirects` files are pre-configured for SPA routing.

---
Built with absolute precision for Jai Mata Di Auto Care.
```