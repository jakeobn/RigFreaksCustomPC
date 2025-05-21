import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Layers, 
  MemoryStick, 
  CreditCard,
  Monitor, 
  Zap,
  Fan,
  Box
} from 'lucide-react';

// Define Build Step Interface
export interface BuildStep {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isRequired: boolean;
}

// Define BUILD_STEPS
export const BUILD_STEPS: BuildStep[] = [
  {
    id: 'cpu',
    name: 'Processor (CPU)',
    icon: React.createElement(Cpu),
    description: 'The brain of your computer that processes instructions.',
    isRequired: true
  },
  {
    id: 'motherboard',
    name: 'Motherboard',
    icon: React.createElement(Layers),
    description: 'Circuit board that connects all components together.',
    isRequired: true
  },
  {
    id: 'memory',
    name: 'Memory (RAM)',
    icon: React.createElement(MemoryStick),
    description: 'Temporary storage for data that your CPU needs to access quickly.',
    isRequired: true
  },
  {
    id: 'gpu',
    name: 'Graphics Card',
    icon: React.createElement(Monitor),
    description: 'Dedicated hardware for rendering graphics and video processing.',
    isRequired: true
  },
  {
    id: 'power',
    name: 'Power Supply',
    icon: React.createElement(Zap),
    description: 'Provides the electricity needed to run all your components.',
    isRequired: true
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: React.createElement(HardDrive),
    description: 'Long-term storage for your operating system, applications, and files.',
    isRequired: true
  },
  {
    id: 'case',
    name: 'PC Case',
    icon: React.createElement(Box),
    description: 'Houses and protects all of your computer components.',
    isRequired: true
  },
  {
    id: 'review',
    name: 'Review',
    icon: null,
    description: 'Review your build configuration.',
    isRequired: false
  }
];

// Define inventory status type
export type InventoryStatus = 'in-stock' | 'out-of-stock' | 'pre-order';

// Extend Window interface to add our custom properties
declare global {
  interface Window {
    __rigfreaksComponents?: any;
    __rigfreaksComponentsTimestamp?: number;
    __rigfreaksHasLoaded?: boolean;
  }
}

// Define component interface
export interface PCComponentData {
  id: string;
  name: string;
  brand: string;
  price: number;
  description?: string;
  image?: string;
  imageUrl?: string; // Added imageUrl to support both naming conventions
  images?: string[];
  imagesGallery?: string[];
  category: string;
  inStock: boolean;
  inventoryStatus?: InventoryStatus;
  specs?: Record<string, string | number | boolean>;
  specifications?: Record<string, string | number | boolean>;
  specsHtml?: string; // HTML formatted specifications
  compatibility?: string[];
}

// Initialize allComponents
export const allComponents: Record<string, PCComponentData[]> = {
  gpu: [],
  cpu: [],
  motherboard: [],
  memory: [],
  case: [],
  storage: [],
  power: [],
  cooling: [],
  os: []
};

// Function to check if user has created custom components
const hasCustomComponents = (): boolean => {
  try {
    const flag = localStorage.getItem('rigfreaks-has-custom-components');
    return flag === 'true';
  } catch {
    return false;
  }
};

// Function to mark that custom components have been created
export const markCustomComponentsCreated = (): void => {
  try {
    localStorage.setItem('rigfreaks-has-custom-components', 'true');
  } catch (error) {
    console.error('Error marking custom components:', error);
  }
};

// Function to save components to storage with backup
// Trigger a server-side backup of components to CSV
export const backupComponentsToCsv = async () => {
  try {
    const response = await fetch('/api/components/backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ components: allComponents }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Components backed up to server CSV:', result.backupPath);
      return true;
    } else {
      console.error('Failed to backup components to server:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error during component CSV backup:', error);
    return false;
  }
};

export const saveComponentsToStorage = () => {
  try {
    // Add a timestamp to track when the data was last updated
    const timestamp = Date.now();
    const dataWithTimestamp = {
      components: allComponents,
      lastUpdated: timestamp
    };
    
    // Save data with timestamp
    const componentsData = JSON.stringify(dataWithTimestamp);
    
    // Save to localStorage for persistence
    localStorage.setItem('rigfreaks-components', componentsData);
    
    // Create a backup at the same time
    localStorage.setItem('rigfreaks-components-backup', componentsData);
    
    // Also store in sessionStorage for current session
    sessionStorage.setItem('rigfreaks-components', componentsData);
    
    // Save motherboard data separately to prevent duplication issues
    if (allComponents.motherboard && allComponents.motherboard.length > 0) {
      const motherboardData = JSON.stringify(allComponents.motherboard);
      localStorage.setItem('motherboard_data_persistent', motherboardData);
    }
    
    // Save the timestamp separately for easy access
    localStorage.setItem('rigfreaks-components-timestamp', timestamp.toString());
    
    // Additionally store in a global variable that can be accessed
    if (typeof window !== 'undefined') {
      window.__rigfreaksComponents = allComponents;
      window.__rigfreaksComponentsTimestamp = timestamp;
      
      console.log(`Component data saved with backup at: ${new Date(timestamp).toLocaleTimeString()}`);
      
      // Dispatch a custom event to notify other components in the same tab
      const updateEvent = new CustomEvent('rigfreaks-components-updated', { 
        detail: { timestamp: timestamp } 
      });
      window.dispatchEvent(updateEvent);
      
      // Mark that we have custom components
      localStorage.setItem('rigfreaks-has-custom-components', 'true');
      
      // Also trigger a server-side backup to CSV
      backupComponentsToCsv().then(success => {
        if (success) {
          console.log('Components successfully backed up to CSV file');
        }
      });
    }
  } catch (error) {
    console.error('Error saving components to storage:', error);
  }
};

// Cache to prevent unnecessary reloading
let componentLoadCache = {
  lastLoaded: 0,
  data: null as any,
  timestamp: null as number | null
};

// Function to load components from storage sources
export const loadComponentsFromStorage = (forceReload = false): any => {
  try {
    // Performance optimization: Don't reload if we've already loaded within last 10 seconds
    // This prevents constant reloading that hurts performance
    const now = Date.now();
    if (!forceReload && 
        componentLoadCache.data && 
        componentLoadCache.lastLoaded > 0 && 
        now - componentLoadCache.lastLoaded < 10000) {
      // Use cached data instead of reloading from localStorage
      return componentLoadCache.data;
    }
    
    // Create a backup of component data if it exists but hasn't been backed up yet
    const localData = localStorage.getItem('rigfreaks-components');
    const backupData = localStorage.getItem('rigfreaks-components-backup');
    
    // If we have component data but no backup, create one
    if (localData && !backupData) {
      localStorage.setItem('rigfreaks-components-backup', localData);
      console.log('Created component data backup for safety');
    }
    
    // Now try to load the data, with fallback to backup if main data is missing or corrupted
    const dataToUse = localData || backupData;
    
    // In production, we'll minimize logging for better performance
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      console.log('Loading components from storage:', dataToUse ? 'Data found' : 'No data');
    }
    
    let timestamp: number | null = null;
    
    if (dataToUse) {
      try {
        const parsedData = JSON.parse(dataToUse);
        
        // Check if we're using the new format with timestamp
        let componentsData = parsedData;
        
        // Handle both formats - the new format with timestamp and the old format
        if (parsedData.components && parsedData.lastUpdated) {
          componentsData = parsedData.components;
          timestamp = parsedData.lastUpdated;
          if (isDev) {
            console.log('Using timestamped data from:', timestamp ? new Date(timestamp).toLocaleString() : 'unknown date');
          }
        }
        
        // Clear existing data
        Object.keys(allComponents).forEach(key => {
          allComponents[key] = [];
        });
        
        // Load data from storage
        Object.keys(componentsData).forEach(key => {
          if (Array.isArray(componentsData[key])) {
            allComponents[key] = componentsData[key];
          }
        });
        
        // Restore main storage from backup if it was missing
        if (!localData && backupData) {
          localStorage.setItem('rigfreaks-components', backupData);
          console.log('Restored component data from backup');
        }
        
        // Set flag indicating we have custom components to preserve
        localStorage.setItem('rigfreaks-has-custom-components', 'true');
        
        // Log the first component from each category only in development mode
        if (isDev) {
          const sampleData: Record<string, { id: string, price: number } | string> = {};
          Object.keys(allComponents).forEach(key => {
            if (allComponents[key] && allComponents[key].length > 0) {
              const sample = allComponents[key][0];
              sampleData[key] = sample ? { id: sample.id, price: sample.price } : 'No components';
            }
          });
          console.log('Loaded component samples:', sampleData);
        }
        
        // Update cache with the loaded data to prevent unnecessary future loads
        componentLoadCache.data = {...allComponents};
        componentLoadCache.lastLoaded = now;
        componentLoadCache.timestamp = timestamp;
        
      } catch (parseError) {
        console.error('Error parsing component data, reverting to defaults:', parseError);
        // If parsing fails, clear the corrupted data but keep the backup
        if (localData) {
          localStorage.removeItem('rigfreaks-components');
        }
        // Try to load from backup if available
        if (backupData) {
          try {
            JSON.parse(backupData); // Just to validate it can be parsed
            localStorage.setItem('rigfreaks-components', backupData);
            console.log('Recovered from backup after data corruption');
            // Reload recursively, but only once (to avoid infinite loop)
            return loadComponentsFromStorage(true); // Force reload with backup
          } catch (backupError) {
            console.error('Backup also corrupted, using defaults:', backupError);
          }
        }
      }
    } else {
      // No data in storage
      console.log('No data in storage - loading default components');
      
      // Check if user has created custom components before
      const customComponentsExist = hasCustomComponents();
      
      if (customComponentsExist) {
        console.warn('Custom components flag exists but no data found - possible data loss');
        // In this case we should not overwrite with defaults - load minimal defaults instead
      }
      
      // Always save the component data to ensure there's something in storage
      saveComponentsToStorage();
      
      // Set flag to indicate we've loaded once
      if (typeof window !== 'undefined') {
        window.__rigfreaksHasLoaded = true;
      }
    }
    
    // Update the global variable
    if (typeof window !== 'undefined') {
      window.__rigfreaksComponents = allComponents;
      if (timestamp) {
        window.__rigfreaksComponentsTimestamp = timestamp;
      }
    }
    
    // Return the data for functional use
    return allComponents;
  } catch (error) {
    console.error('Error loading components from storage:', error);
  }
};

// Function to add a component to the appropriate category and save to database
export async function addComponent(component: PCComponentData): Promise<boolean> {
  try {
    const { category } = component;
    
    // Create the category array if it doesn't exist
    if (!allComponents[category]) {
      allComponents[category] = [];
    }
    
    // Check if component with same ID already exists
    const existingIndex = allComponents[category].findIndex(comp => comp.id === component.id);
    
    if (existingIndex >= 0) {
      // Replace existing component
      allComponents[category][existingIndex] = { ...component };
      console.log(`Updated component ${component.id} price to ${component.price}`);
    } else {
      // Add new component
      allComponents[category].push(component);
      console.log(`Added new component: ${component.id} (${component.name})`);
    }
    
    // Mark that we have custom components
    markCustomComponentsCreated();
    
    // Save to localStorage with a fresh timestamp
    saveComponentsToStorage();
    
    // Save to database API - convert to database format
    try {
      // Extract numeric ID from component.id if it starts with category-
      const idParts = component.id.split('-');
      const numericId = idParts.length > 1 ? parseInt(idParts[1]) : undefined;
      
      // Prepare component data for API
      const apiComponent = {
        id: numericId, // Include ID only if it's a number
        name: component.name,
        type: category,
        specs: component.specs || {},
        specsHtml: component.specsHtml || '',
        price: component.price.toString(),
        imageUrl: component.image || '',
        imagesGallery: component.imagesGallery || [],
        inStock: component.inStock,
        inventoryStatus: component.inventoryStatus || 'in-stock',
        brand: component.brand || ''
      };
      
      // Handle ID for new components
      if (apiComponent.id === undefined) {
        delete apiComponent.id; // Remove id property for new components
      }
      
      console.log('Saving component to database API:', apiComponent);
      
      // Send to regular API endpoint
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiComponent),
      });
      
      // Component saved to local storage
      console.log('Successfully saved component');
      
      if (!response.ok) {
        console.error('Failed to save component to database:', await response.text());
      } else {
        const savedComponent = await response.json();
        console.log('Component saved to database successfully:', savedComponent);
      }
    } catch (apiError) {
      console.error('Error saving component to database API:', apiError);
      // Continue even if API save fails - we still have it in localStorage
    }
    
    return true;
  } catch (error) {
    console.error('Error adding component:', error);
    return false;
  }
}

// Function to update a component's price
export function updateComponentPrice(componentId: string, newPrice: number): boolean {
  try {
    // Find the component in all categories
    for (const category in allComponents) {
      const index = allComponents[category].findIndex(comp => comp.id === componentId);
      
      if (index >= 0) {
        // Create a completely new object to ensure React detects the change
        allComponents[category][index] = {
          ...allComponents[category][index],
          price: newPrice
        };
        
        console.log(`Updated component ${componentId} price to ${newPrice}`);
        
        // Mark that custom components have been modified
        markCustomComponentsCreated();
        
        // Save to localStorage with a fresh timestamp
        saveComponentsToStorage();
        
        // Dispatch a custom event to notify other components in the same tab
        if (typeof window !== 'undefined') {
          const updateEvent = new CustomEvent('component-price-updated', { 
            detail: { componentId, newPrice, timestamp: Date.now() } 
          });
          window.dispatchEvent(updateEvent);
        }
        
        return true;
      }
    }
    
    console.error(`Component ${componentId} not found for price update`);
    return false;
  } catch (error) {
    console.error('Error updating component price:', error);
    return false;
  }
}

// Function to update a component's stock status
export function updateComponentStock(componentId: string, quantity: number): boolean {
  try {
    // Find the component in all categories
    for (const category in allComponents) {
      const index = allComponents[category].findIndex(comp => comp.id === componentId);
      
      if (index >= 0) {
        const component = allComponents[category][index];
        
        // Create a completely new object to ensure React detects the change
        const updatedComponent = {
          ...component,
          // Update inventory status based on quantity parameter
          // If quantity > 0, we're purchasing items so mark as out of stock
          inStock: quantity > 0 ? false : component.inStock,
          inventoryStatus: quantity > 0 ? 'out-of-stock' as InventoryStatus : (component.inStock ? 'in-stock' as InventoryStatus : 'out-of-stock' as InventoryStatus)
        };
        
        // Update the component in local storage
        allComponents[category][index] = updatedComponent;
        
        console.log(`Updated component ${componentId} stock status to ${updatedComponent.inStock ? 'in-stock' : 'out-of-stock'}`);
        
        // Mark that custom components have been modified
        markCustomComponentsCreated();
        
        // Save to localStorage with a fresh timestamp
        saveComponentsToStorage();
        
        // Also persist to database if component has a numeric ID
        try {
          // Extract numeric ID from component.id if it has the format category-number
          const idParts = componentId.split('-');
          const numericId = idParts.length > 1 ? parseInt(idParts[1]) : undefined;
          
          if (numericId && !isNaN(numericId)) {
            console.log(`Updating component stock in database: ID ${numericId}`);
            
            // Send PATCH request to update the component
            fetch(`/api/components/${numericId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                inStock: updatedComponent.inStock
              })
            })
            .then(response => {
              if (!response.ok) {
                console.warn(`Failed to update component ${componentId} stock in database (status: ${response.status})`);
              } else {
                console.log(`Successfully updated component ${componentId} stock in database`);
              }
            })
            .catch(error => {
              console.error('Error updating component stock in database:', error);
            });
          }
        } catch (dbError) {
          console.error('Error updating component stock in database:', dbError);
          // Continue even if database update fails - at least it's in local storage
        }
        
        return true;
      }
    }
    
    console.error(`Component ${componentId} not found for stock update`);
    return false;
  } catch (error) {
    console.error('Error updating component stock:', error);
    return false;
  }
}

// Function to remove a component from the appropriate category
export async function removeComponent(componentId: string): Promise<boolean> {
  try {
    // Find the component in all categories
    for (const category in allComponents) {
      const index = allComponents[category].findIndex(comp => comp.id === componentId);
      
      if (index >= 0) {
        // Store the component for database deletion
        const component = allComponents[category][index];
        
        // Remove the component from local storage
        allComponents[category].splice(index, 1);
        console.log(`Removed component: ${componentId}`);
        
        // Mark that custom components have been modified
        markCustomComponentsCreated();
        
        // Save to localStorage with a fresh timestamp
        saveComponentsToStorage();
        
        // Also delete from database
        try {
          // Extract numeric ID from component.id if it has the format category-number
          const idParts = componentId.split('-');
          const numericId = idParts.length > 1 ? parseInt(idParts[1]) : undefined;
          
          if (numericId && !isNaN(numericId)) {
            console.log(`Deleting component from database: ID ${numericId}`);
            
            // Send delete request to API
            const response = await fetch(`/api/components/${numericId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            if (!response.ok) {
              console.warn(`Failed to delete component ${componentId} from database (status: ${response.status})`);
            } else {
              console.log(`Successfully deleted component ${componentId} from database`);
            }
            
            // Component deleted from local storage
            console.log(`Successfully deleted component ${componentId}`);
          } else {
            console.warn(`Cannot delete component ${componentId} from database (invalid ID format)`);
          }
        } catch (dbError) {
          console.error('Error deleting component from database:', dbError);
          // Continue even if database deletion fails - at least it's gone from local storage
        }
        
        return true;
      }
    }
    
    console.error(`Component ${componentId} not found for removal`);
    return false;
  } catch (error) {
    console.error('Error removing component:', error);
    return false;
  }
}

// Create an array of all components for search/filter
export const componentsArray: PCComponentData[] = Object.values(allComponents)
  .flat()
  .filter(Boolean);

// Function to check compatibility between components
export const checkComponentCompatibility = (
  component: PCComponentData,
  selectedComponents: Record<string, PCComponentData | null>
): { compatible: boolean; reason?: string } => {
  // Skip compatibility checks for empty configurations
  if (!component || Object.keys(selectedComponents).length === 0) {
    return { compatible: true };
  }
  
  // CPU + Motherboard compatibility check
  if (component.category === 'cpu' && selectedComponents.motherboard) {
    const motherboard = selectedComponents.motherboard;
    
    // Check socket compatibility
    if (component.specs?.socket && motherboard.specs?.socket) {
      const cpuSocket = String(component.specs.socket).toLowerCase();
      const moboSocket = String(motherboard.specs.socket).toLowerCase();
      
      if (cpuSocket !== moboSocket) {
        return { 
          compatible: false, 
          reason: `CPU socket ${component.specs.socket} is not compatible with motherboard socket ${motherboard.specs.socket}` 
        };
      }
    }
  }
  
  // Motherboard + CPU compatibility check
  if (component.category === 'motherboard' && selectedComponents.cpu) {
    const cpu = selectedComponents.cpu;
    
    // Check socket compatibility
    if (component.specs?.socket && cpu.specs?.socket) {
      const moboSocket = String(component.specs.socket).toLowerCase();
      const cpuSocket = String(cpu.specs.socket).toLowerCase();
      
      if (moboSocket !== cpuSocket) {
        return { 
          compatible: false, 
          reason: `Motherboard socket ${component.specs.socket} is not compatible with CPU socket ${cpu.specs.socket}` 
        };
      }
    }
  }
  
  // RAM + Motherboard compatibility check
  if (component.category === 'memory' && selectedComponents.motherboard) {
    const motherboard = selectedComponents.motherboard;
    
    // Check memory type compatibility (e.g., DDR4, DDR5)
    if (component.specs?.type && motherboard.specs?.memoryType) {
      const ramType = String(component.specs.type).toLowerCase();
      const moboType = String(motherboard.specs.memoryType).toLowerCase();
      
      // If neither type contains the other, they're incompatible
      if (!ramType.includes(moboType) && !moboType.includes(ramType)) {
        return { 
          compatible: false, 
          reason: `RAM type ${component.specs.type} is not compatible with motherboard memory type ${motherboard.specs.memoryType}` 
        };
      }
    }
  }
  
  // Motherboard + RAM compatibility check
  if (component.category === 'motherboard' && selectedComponents.memory) {
    const ram = selectedComponents.memory;
    
    // Check memory type compatibility
    if (component.specs?.memoryType && ram.specs?.type) {
      const moboType = String(component.specs.memoryType).toLowerCase();
      const ramType = String(ram.specs.type).toLowerCase();
      
      // If neither type contains the other, they're incompatible
      if (!moboType.includes(ramType) && !ramType.includes(moboType)) {
        return { 
          compatible: false, 
          reason: `Motherboard memory type ${component.specs.memoryType} is not compatible with RAM type ${ram.specs.type}` 
        };
      }
    }
  }
  
  // Cooling + CPU compatibility check
  if (component.category === 'cooling' && selectedComponents.cpu) {
    const cpu = selectedComponents.cpu;
    
    // Check socket compatibility
    if (component.specs?.compatibleSockets && cpu.specs?.socket) {
      const compatibleSockets = String(component.specs.compatibleSockets).toLowerCase();
      const cpuSocket = String(cpu.specs.socket).toLowerCase();
      
      // If compatible sockets doesn't include the CPU socket
      if (!compatibleSockets.includes(cpuSocket)) {
        return { 
          compatible: false, 
          reason: `CPU cooler is not compatible with CPU socket ${cpu.specs.socket}` 
        };
      }
    }
  }
  
  // Case + Motherboard compatibility check
  if (component.category === 'case' && selectedComponents.motherboard) {
    const motherboard = selectedComponents.motherboard;
    
    // Check form factor compatibility
    if (component.specs?.formFactor && motherboard.specs?.formFactor) {
      const caseFormFactors = String(component.specs.formFactor).toLowerCase();
      const moboFormFactor = String(motherboard.specs.formFactor).toLowerCase();
      
      // If case doesn't support the motherboard form factor
      if (!caseFormFactors.includes(moboFormFactor)) {
        return { 
          compatible: false, 
          reason: `Case does not support ${motherboard.specs.formFactor} motherboards` 
        };
      }
    }
  }
  
  // Motherboard + Case compatibility check
  if (component.category === 'motherboard' && selectedComponents.case) {
    const pcCase = selectedComponents.case;
    
    // Check form factor compatibility
    if (component.specs?.formFactor && pcCase.specs?.formFactor) {
      const moboFormFactor = String(component.specs.formFactor).toLowerCase();
      const caseFormFactors = String(pcCase.specs.formFactor).toLowerCase();
      
      // If case doesn't support the motherboard form factor
      if (!caseFormFactors.includes(moboFormFactor)) {
        return { 
          compatible: false, 
          reason: `Motherboard form factor ${component.specs.formFactor} is not supported by the selected case` 
        };
      }
    }
  }
  
  // Power supply wattage check
  if (component.category === 'power') {
    const systemComponents = Object.values(selectedComponents).filter(Boolean);
    let totalTDP = 0;
    
    // Calculate estimated power requirements
    systemComponents.forEach(comp => {
      if (comp?.specs?.tdp) {
        const tdp = parseInt(String(comp.specs.tdp)) || 0;
        totalTDP += tdp;
      }
    });
    
    // Add 100W buffer for other components
    totalTDP += 100;
    
    // Check if PSU has enough wattage
    if (component.specs?.wattage) {
      const psuWattage = parseInt(String(component.specs.wattage)) || 0;
      
      if (psuWattage < totalTDP) {
        return { 
          compatible: false, 
          reason: `Power supply (${psuWattage}W) may not provide enough power for your system (estimated ${totalTDP}W needed)` 
        };
      }
    }
  }
  
  // All compatibility checks passed
  return { compatible: true };
};

// Function to get component recommendations based on selected components
export const getRecommendedComponents = (
  category: string,
  selectedComponents: Record<string, PCComponentData | null>
): PCComponentData[] => {
  // For now, returning all components in the category
  return allComponents[category] || [];
};

// Function to load components from the database API
export const loadComponentsFromAPI = async (): Promise<boolean> => {
  try {
    console.log('Loading components from database API...');
    const response = await fetch('/api/components');
    
    if (!response.ok) {
      console.error('Failed to load components from API:', await response.text());
      return false;
    }
    
    const componentsData = await response.json();
    
    if (!componentsData || componentsData.length === 0) {
      console.log('No components found in database');
      return false;
    }
    
    console.log(`Loaded ${componentsData.length} components from database`);
    
    // Group components by type
    const groupedComponents: Record<string, PCComponentData[]> = {};
    
    componentsData.forEach((component: any) => {
      const type = component.type || 'other';
      
      // Convert DB component to our PCComponentData format
      const convertedComponent: PCComponentData = {
        id: `${component.type}-${component.id}`, // Create a consistent ID format
        name: component.name,
        category: component.type,
        price: parseFloat(component.price),
        brand: component.brand || '',
        specs: component.specs || {},
        specsHtml: component.specsHtml || '',
        image: component.imageUrl || '',
        inStock: component.inStock,
        inventoryStatus: component.inStock ? 'in-stock' : 'out-of-stock'
      };
      
      if (!groupedComponents[type]) {
        groupedComponents[type] = [];
      }
      
      groupedComponents[type].push(convertedComponent);
    });
    
    // Add components to allComponents, preserving any existing customizations
    Object.keys(groupedComponents).forEach(type => {
      // Only replace components if we don't have any in this category yet
      if (!allComponents[type] || allComponents[type].length === 0) {
        allComponents[type] = groupedComponents[type];
      } else {
        console.log(`Keeping existing ${type} components from local storage`);
      }
    });
    
    // Save the updated components back to localStorage
    saveComponentsToStorage();
    
    return true;
  } catch (error) {
    console.error('Error loading components from API:', error);
    return false;
  }
};

// Load components when the module is first imported
if (typeof window !== 'undefined') {
  // Check if the loading has already been done
  if (!window.__rigfreaksHasLoaded) {
    setTimeout(async () => {
      // First try to load from database API
      const apiLoaded = await loadComponentsFromAPI();
      
      // If API loading fails or returns no components, fall back to localStorage
      if (!apiLoaded) {
        console.log('Falling back to localStorage components');
        loadComponentsFromStorage();
      }
    }, 200);
  }
}
