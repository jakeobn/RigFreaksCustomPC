/**
 * Environment configuration for the frontend
 * Determines the API URL based on the current environment
 */

export const API_URL = (() => {
  // When running in Vercel production, use the specified backend URL or fallback
  if (process.env.NODE_ENV === 'production') {
    return import.meta.env.VITE_API_BASE_URL || 'https://rigfreaks-api.your-domain.com';
  }
  
  // In development, use local API
  return '';
})();

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';