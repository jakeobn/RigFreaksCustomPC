/**
 * Utility for logging Stripe integration events
 */

// Enable or disable Stripe logging
const enableLogging = true;

export const stripeLogger = {
  log: (message: string, data?: any) => {
    if (!enableLogging) return;
    
    console.log(`[Stripe] ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    // Always log errors regardless of enableLogging setting
    console.error(`[Stripe Error] ${message}`, error || '');
  },
  
  warn: (message: string, data?: any) => {
    if (!enableLogging) return;
    
    console.warn(`[Stripe Warning] ${message}`, data || '');
  },
  
  info: (message: string, data?: any) => {
    if (!enableLogging) return;
    
    console.info(`[Stripe Info] ${message}`, data || '');
  }
};