export const config = {
  sheetsBaseUrl: import.meta.env.VITE_SHEETS_BASE_URL || '',
  appsScriptUrl: import.meta.env.VITE_APPS_SCRIPT_URL || '',
  waNumber: import.meta.env.VITE_WA_NUMBER || '',
  mapsEmbedUrl: import.meta.env.VITE_MAPS_EMBED_URL || '',
  adminId: import.meta.env.VITE_ADMIN_ID || '',
  adminPass: import.meta.env.VITE_ADMIN_PASS || '',
  vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || '',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:3000'
};

const requiredKeys = [
  'VITE_SHEETS_BASE_URL',
  'VITE_APPS_SCRIPT_URL',
  'VITE_WA_NUMBER',
  'VITE_ADMIN_ID',
  'VITE_ADMIN_PASS'
];

export const missingKeys = requiredKeys.filter(key => !import.meta.env[key]);

if (missingKeys.length > 0) {
  const message = `[CONFIG] Missing critical environment variables: ${missingKeys.join(', ')}`;
  console.warn(message);
}