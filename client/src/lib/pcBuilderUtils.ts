import { PCComponent, CustomBuild } from "@shared/schema";

export interface ComponentCompatibility {
  [key: string]: boolean;
}

export interface ComponentTypes {
  cpu: string;
  ram: string;
  storage: string;
  motherboard: string;
  psu: string;
  case: string;
  cooling: string;
  os: string;
}

export interface CompatibilityRule {
  componentId: number;
  compatibleWith: {
    [componentType: string]: number[];
  };
}

// Check if a specific component is compatible with selected components
export const checkComponentCompatibility = (
  component: PCComponent,
  selectedComponents: Record<string, PCComponent>,
  compatibilityRules: CompatibilityRule[]
): boolean => {
  // If no components selected yet, everything is compatible
  if (Object.keys(selectedComponents).length === 0) {
    return true;
  }

  // Find rules for this component
  const componentRules = compatibilityRules.find(
    rule => rule.componentId === component.id
  );

  // If no rules found, assume it's compatible
  if (!componentRules) {
    return true;
  }

  // Check compatibility with each selected component
  for (const [type, selectedComponent] of Object.entries(selectedComponents)) {
    // Skip if checking compatibility with itself
    if (component.type === type) {
      continue;
    }

    // Check if this component type has compatibility rules
    if (componentRules.compatibleWith[type]) {
      // Check if the selected component is in the compatible list
      const isCompatible = componentRules.compatibleWith[type].includes(selectedComponent.id);
      if (!isCompatible) {
        return false;
      }
    }
    
    // Also check reverse compatibility 
    // (selected component should be compatible with this component)
    const selectedComponentRules = compatibilityRules.find(
      rule => rule.componentId === selectedComponent.id
    );
    
    if (selectedComponentRules && selectedComponentRules.compatibleWith[component.type]) {
      const isReverseCompatible = selectedComponentRules.compatibleWith[component.type].includes(component.id);
      if (!isReverseCompatible) {
        return false;
      }
    }
  }

  return true;
};

// Check if all selected components are compatible with each other
export const checkBuildCompatibility = (
  selectedComponents: Record<string, PCComponent>,
  compatibilityRules: CompatibilityRule[]
): ComponentCompatibility => {
  const compatibility: ComponentCompatibility = {};
  
  // Initialize all component types as compatible
  for (const type of Object.keys(selectedComponents)) {
    compatibility[type] = true;
  }
  
  // Check each component against all others
  for (const [type, component] of Object.entries(selectedComponents)) {
    const tempComponents = { ...selectedComponents };
    delete tempComponents[type]; // Remove current component to check against others
    
    compatibility[type] = checkComponentCompatibility(
      component,
      tempComponents,
      compatibilityRules
    );
  }
  
  return compatibility;
};

// Calculate total price of a build
export const calculateBuildPrice = (
  selectedComponents: Record<string, PCComponent>
): number => {
  return Object.values(selectedComponents).reduce(
    (total, component) => total + parseFloat(component.price.toString()),
    0
  );
};

// Generate a name for a custom build based on core components
export const generateBuildName = (
  selectedComponents: Record<string, PCComponent>
): string => {
  const cpu = selectedComponents.cpu?.name.split(' ').slice(-1)[0] || '';
  
  if (cpu) {
    return `Custom ${cpu} Build`;
  }
  
  return "Custom PC Build";
};

// Get recommended components based on selected components
export const getRecommendedComponents = (
  component: PCComponent,
  allComponents: PCComponent[],
  compatibilityRules: CompatibilityRule[]
): PCComponent[] => {
  // If no component selected, return empty array
  if (!component) {
    return [];
  }
  
  // Find rules for this component
  const componentRules = compatibilityRules.find(
    rule => rule.componentId === component.id
  );
  
  // If no rules, return empty array
  if (!componentRules) {
    return [];
  }
  
  // Get all compatible components for each type
  const recommendedComponents: PCComponent[] = [];
  
  for (const [type, compatibleIds] of Object.entries(componentRules.compatibleWith)) {
    // Get components of this type that are in the compatible list
    const typeComponents = allComponents.filter(
      c => c.type === type && compatibleIds.includes(c.id)
    );
    
    // Add up to 3 recommended components per type
    recommendedComponents.push(...typeComponents.slice(0, 3));
  }
  
  return recommendedComponents;
};

// Verify if a build has all required components
export const isBuildComplete = (
  selectedComponents: Record<string, PCComponent>,
  requiredTypes: string[] = ['cpu', 'ram', 'storage', 'motherboard', 'psu', 'case']
): boolean => {
  return requiredTypes.every(type => selectedComponents[type]);
};

// Verify if all required components plus optional ones like OS are selected
export const isBuildCompleteWithOptionals = (
  selectedComponents: Record<string, PCComponent>,
  requiredTypes: string[] = ['cpu', 'ram', 'storage', 'motherboard', 'psu', 'case'],
  optionalTypes: string[] = ['cooling', 'os']
): { isComplete: boolean; missingRequired: string[]; missingOptional: string[] } => {
  const missingRequired = requiredTypes.filter(type => !selectedComponents[type]);
  const missingOptional = optionalTypes.filter(type => !selectedComponents[type]);
  
  return {
    isComplete: missingRequired.length === 0,
    missingRequired,
    missingOptional
  };
};

// Function to add a Shopify product as a PC component
export const addProductAsComponent = async (productId: number, componentType: string): Promise<PCComponent> => {
  try {
    const response = await fetch('/api/components-from-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        componentType
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add product as component: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding product as component:', error);
    throw error;
  }
};
