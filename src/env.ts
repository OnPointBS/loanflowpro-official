export const env = {
  CONVEX_URL: import.meta.env.VITE_CONVEX_URL || '',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  STORAGE_ACCESS_KEY: import.meta.env.VITE_STORAGE_ACCESS_KEY || '',
  STORAGE_SECRET_KEY: import.meta.env.VITE_STORAGE_SECRET_KEY || '',
  STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET || '',
  STORAGE_REGION: import.meta.env.VITE_STORAGE_REGION || '',
  STORAGE_ENDPOINT: import.meta.env.VITE_STORAGE_ENDPOINT || '',
} as const;
