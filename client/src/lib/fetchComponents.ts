/**
 * Component fetching utility
 * Makes direct API calls to load components for the PC Builder interface
 */

import { PCComponentData } from './componentData';

// Helper function to map backend component to frontend format
export function mapComponentToFrontend(component: any): PCComponentData {
  // Extract the component ID from the database
  const id = `${component.type}-${component.id}`;
  
  // Map component fields to frontend format
  return {
    id,
    name: component.name,
    brand: component.brand || '',
    price: parseFloat(component.price) || 0,
    description: component.description || '',
    image: component.imageUrl || '',
    imageUrl: component.imageUrl || '',
    images: component.imagesGallery ? JSON.parse(component.imagesGallery) : [],
    imagesGallery: component.imagesGallery ? JSON.parse(component.imagesGallery) : [],
    category: component.type, // Backend uses 'type', frontend uses 'category'
    inStock: component.inStock === 1 || component.inStock === true,
    inventoryStatus: component.stockStatus ? mapInventoryStatus(component.stockStatus) : 'in-stock',
    specs: component.specs ? parseSpecs(component.specs) : {},
    specsHtml: component.specs || '',
  };
}

// Map inventory status strings to the frontend format
function mapInventoryStatus(status: string): 'in-stock' | 'out-of-stock' | 'pre-order' {
  if (status.toLowerCase().includes('pre') || status.toLowerCase().includes('order')) {
    return 'pre-order';
  } else if (status.toLowerCase().includes('out') || status.toLowerCase().includes('unavailable')) {
    return 'out-of-stock';
  }
  return 'in-stock';
}

// Parse specs - handle both JSON and String formats
function parseSpecs(specs: any): Record<string, any> {
  if (typeof specs === 'object' && specs !== null) {
    return specs;
  }
  
  if (typeof specs === 'string') {
    try {
      // Try to parse as JSON
      if (specs.startsWith('{') && specs.endsWith('}')) {
        return JSON.parse(specs);
      }
      
      // Otherwise, create a simple spec object
      return { description: specs };
    } catch (error) {
      return { description: specs };
    }
  }
  
  return {};
}

// Fetch all components
export async function fetchAllComponents(): Promise<Record<string, PCComponentData[]>> {
  try {
    const response = await fetch('/api/components');
    if (!response.ok) {
      throw new Error(`Failed to fetch components: ${response.status} ${response.statusText}`);
    }
    
    const components = await response.json();
    const componentsByType: Record<string, PCComponentData[]> = {};
    
    // Process and organize components by type
    components.forEach((component: any) => {
      try {
        const mappedComponent = mapComponentToFrontend(component);
        
        // Create the array for this type if it doesn't exist
        const category = mappedComponent.category;
        if (!componentsByType[category]) {
          componentsByType[category] = [];
        }
        
        // Add the component to the appropriate category
        componentsByType[category].push(mappedComponent);
      } catch (error) {
        console.error('Error processing component:', component, error);
      }
    });
    
    // Make sure all category arrays exist even if empty
    const expectedCategories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'power', 'case', 'cooling', 'memory'];
    expectedCategories.forEach(category => {
      if (!componentsByType[category]) {
        componentsByType[category] = [];
      }
      
      // Handle 'ram' and 'memory' as the same category
      if (category === 'memory' && componentsByType['ram'] && componentsByType['ram'].length > 0) {
        componentsByType[category] = [...componentsByType['ram']];
      }
      
      if (category === 'ram' && componentsByType['memory'] && componentsByType['memory'].length > 0) {
        componentsByType[category] = [...componentsByType['memory']];
      }
      
      // Handle 'psu' and 'power' as the same category
      if (category === 'power' && componentsByType['psu'] && componentsByType['psu'].length > 0) {
        componentsByType[category] = [...componentsByType['psu']];
      }
      
      if (category === 'psu' && componentsByType['power'] && componentsByType['power'].length > 0) {
        componentsByType[category] = [...componentsByType['power']];
      }
    });
    
    console.log('Fetched components by type:', componentsByType);
    return componentsByType;
  } catch (error) {
    console.error('Error fetching components:', error);
    return {
      cpu: [],
      gpu: [],
      motherboard: [],
      memory: [],
      ram: [],
      storage: [],
      power: [],
      psu: [],
      case: [],
      cooling: []
    };
  }
}

// Fetch components by type
export async function fetchComponentsByType(type: string): Promise<PCComponentData[]> {
  try {
    const response = await fetch(`/api/components/type/${type}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} components: ${response.status} ${response.statusText}`);
    }
    
    const components = await response.json();
    return components.map(mapComponentToFrontend);
  } catch (error) {
    console.error(`Error fetching ${type} components:`, error);
    return [];
  }
}

// Get a component by ID
export async function getComponentById(id: string): Promise<PCComponentData | null> {
  try {
    // Parse the ID to get the type and numeric ID
    const [type, numericId] = id.split('-');
    if (!type || !numericId) {
      throw new Error(`Invalid component ID format: ${id}`);
    }
    
    const response = await fetch(`/api/components/${type}/${numericId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch component: ${response.status} ${response.statusText}`);
    }
    
    const component = await response.json();
    return mapComponentToFrontend(component);
  } catch (error) {
    console.error(`Error fetching component by ID ${id}:`, error);
    return null;
  }
}