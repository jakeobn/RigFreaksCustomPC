/**
 * Utility for logging PayPal integration events
 */

// Enable or disable PayPal logging
const enableLogging = true;

export const paypalLogger = {
  log: (message: string, data?: any) => {
    if (!enableLogging) return;
    
    console.log(`[PayPal] ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    // Always log errors regardless of enableLogging setting
    console.error(`[PayPal Error] ${message}`, error || '');
  },
  
  warn: (message: string, data?: any) => {
    if (!enableLogging) return;
    
    console.warn(`[PayPal Warning] ${message}`, data || '');
  },
  
  info: (message: string, data?: any) => {
    if (!enableLogging) return;
    
    console.info(`[PayPal Info] ${message}`, data || '');
  }
};