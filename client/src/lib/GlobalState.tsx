import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadComponentsFromStorage } from './componentData';

// Create a context for global state
type GlobalContextType = {
  lastUpdateTime: number;
  refreshComponents: () => void;
};

const GlobalContext = createContext<GlobalContextType>({
  lastUpdateTime: Date.now(),
  refreshComponents: () => {}
});

// Custom hook to use the global state
export const useGlobalState = () => useContext(GlobalContext);

// Provider component to wrap the application
export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Function to refresh components from storage
  const refreshComponents = () => {
    // Load any saved components from localStorage
    loadComponentsFromStorage();
    
    // Update the timestamp to trigger re-renders in components using this context
    setLastUpdateTime(Date.now());
    
    // Only log in development mode to improve performance
    if (process.env.NODE_ENV !== 'production') {
      console.log('Global component refresh triggered:', new Date().toLocaleTimeString());
    }
  };

  // Set up a timer to periodically check for updates
  useEffect(() => {
    // Check if user has custom components before clearing anything
    const hasCustom = localStorage.getItem('rigfreaks-has-custom-components') === 'true';
    const isDev = process.env.NODE_ENV !== 'production';
    
    if (!hasCustom) {
      if (isDev) {
        console.log('No custom components detected, initializing with defaults');
      }
      // Only clear sessionStorage (temporary), not localStorage (persistent)
      sessionStorage.removeItem('rigfreaks-components');
    } else {
      if (isDev) {
        console.log('Custom components detected, preserving data');
      }
    }
    
    // Initial load - this will either load from localStorage or initialize defaults
    refreshComponents();
    
    // Listen for storage events (changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rigfreaks-components' || e.key === 'rigfreaks-components-timestamp') {
        if (isDev) {
          console.log('Storage changed in another tab, refreshing components');
        }
        refreshComponents();
      }
    };
    
    // Listen for custom events (changes in same tab)
    const handleComponentsUpdated = (e: CustomEvent) => {
      if (isDev) {
        console.log('Components updated in same tab, refreshing components');
      }
      refreshComponents();
    };
    
    // Listen specifically for price updates
    const handlePriceUpdated = (e: CustomEvent) => {
      if (isDev) {
        const { componentId, newPrice, timestamp } = e.detail;
        console.log(`Price update detected for ${componentId}: £${newPrice} at ${new Date(timestamp).toLocaleTimeString()}`);
      }
      refreshComponents();
    };
    
    // Set up a much less frequent backup refresh (once per minute) instead of every 3 seconds
    // This dramatically reduces unnecessary refreshes while ensuring data stays current
    const intervalId = setInterval(() => {
      // Check if data needs refreshing by comparing timestamps
      const storedTimestamp = localStorage.getItem('rigfreaks-components-timestamp');
      const currentCacheTimestamp = window.__rigfreaksComponentsTimestamp || 0;
      
      // Only refresh if the stored timestamp is newer than our current data
      // or if it's been more than 60 seconds since our last refresh
      if (!storedTimestamp || 
          parseInt(storedTimestamp) > currentCacheTimestamp ||
          Date.now() - lastUpdateTime > 60000) {
        // Only log in development mode
        if (process.env.NODE_ENV !== 'production') {
          console.log('Performing scheduled refresh (once per minute)');
        }
        refreshComponents();
      }
    }, 60000); // Changed from 3000ms (3s) to 60000ms (1 minute)
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rigfreaks-components-updated', handleComponentsUpdated as EventListener);
    window.addEventListener('component-price-updated', handlePriceUpdated as EventListener);
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rigfreaks-components-updated', handleComponentsUpdated as EventListener);
      window.removeEventListener('component-price-updated', handlePriceUpdated as EventListener);
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ lastUpdateTime, refreshComponents }}>
      {children}
    </GlobalContext.Provider>
  );
};