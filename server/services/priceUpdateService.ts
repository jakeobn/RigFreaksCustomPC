import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import cron from 'node-cron';

// Mock component database
const components: Record<string, { id: string; name: string; price: number; category: string }> = {
  'cpu-intel-ultra-9-285k': {
    id: 'cpu-intel-ultra-9-285k',
    name: 'Intel Core Ultra 9 285K',
    price: 699.99,
    category: 'cpu'
  },
  'cpu-amd-9950x': {
    id: 'cpu-amd-9950x',
    name: 'AMD Ryzen 9 9950X',
    price: 629.99,
    category: 'cpu'
  },
  'case-msi-mpg-sekira-500x': {
    id: 'case-msi-mpg-sekira-500x',
    name: 'MSI MPG SEKIRA 500X ARGB',
    price: 249.99,
    category: 'case'
  }
};

// Price update history
type PriceUpdate = {
  id: string;
  componentId: string;
  componentName: string;
  category: string;
  oldPrice: number;
  newPrice: number;
  source: string;
  timestamp: string;
  applied: boolean;
};

let priceUpdateHistory: PriceUpdate[] = [];

/**
 * Fetches current prices from CCL Online
 * In a real implementation, this would parse the CCL website or use their API
 */
async function fetchCCLPrices(): Promise<Record<string, number>> {
  console.log('[PriceUpdateService] Fetching current prices from CCL Online...');
  
  // For demo purposes, we're returning hardcoded prices
  // In a real implementation, this would scrape the CCL Online website
  return {
    'cpu-intel-ultra-9-285k': 681.63,
    'cpu-amd-9950x': 660.14,
    'case-msi-mpg-sekira-500x': 262.49
  };
}

/**
 * Updates component prices with data from CCL Online
 */
export async function updatePrices(): Promise<PriceUpdate[]> {
  try {
    console.log('[PriceUpdateService] Starting price update process...');
    
    // Fetch current prices from CCL Online
    const cclPrices = await fetchCCLPrices();
    
    // Track updates
    const updates: PriceUpdate[] = [];
    
    // Update component prices
    for (const [componentId, newPrice] of Object.entries(cclPrices)) {
      const component = components[componentId];
      
      if (component) {
        const oldPrice = component.price;
        
        // Only create an update if the price has changed
        if (oldPrice !== newPrice) {
          const update: PriceUpdate = {
            id: `update-${Date.now()}-${componentId}`,
            componentId,
            componentName: component.name,
            category: component.category,
            oldPrice,
            newPrice,
            source: 'CCL Online',
            timestamp: new Date().toISOString(),
            applied: false
          };
          
          updates.push(update);
          
          // Store update in history
          priceUpdateHistory.push(update);
          
          console.log(`[PriceUpdateService] Price change detected for ${component.name}: £${oldPrice} -> £${newPrice}`);
        }
      }
    }
    
    console.log(`[PriceUpdateService] Found ${updates.length} price updates`);
    return updates;
  } catch (error) {
    console.error('[PriceUpdateService] Error updating prices:', error);
    throw error;
  }
}

/**
 * Applies pending price updates to the component database
 */
export async function applyPriceUpdates(): Promise<void> {
  try {
    console.log('[PriceUpdateService] Applying pending price updates...');
    
    let appliedCount = 0;
    
    // Find all pending updates
    for (const update of priceUpdateHistory) {
      if (!update.applied) {
        // Update the component price
        const component = components[update.componentId];
        if (component) {
          component.price = update.newPrice;
          update.applied = true;
          appliedCount++;
        }
      }
    }
    
    console.log(`[PriceUpdateService] Applied ${appliedCount} price updates`);
  } catch (error) {
    console.error('[PriceUpdateService] Error applying price updates:', error);
    throw error;
  }
}

/**
 * Initialize the price update scheduler
 */
export function initPriceUpdateScheduler(schedule: string = '00 02 * * *'): void {
  // Schedule price updates to run at 2:00 AM by default
  cron.schedule(schedule, async () => {
    console.log('[PriceUpdateService] Running scheduled price update...');
    try {
      const updates = await updatePrices();
      
      // Automatically apply the updates
      await applyPriceUpdates();
      
      console.log(`[PriceUpdateService] Scheduled update complete. Found and applied ${updates.length} price changes.`);
    } catch (error) {
      console.error('[PriceUpdateService] Error in scheduled price update:', error);
    }
  });
  
  console.log(`Price update scheduler initialized with schedule: ${schedule}`);
}