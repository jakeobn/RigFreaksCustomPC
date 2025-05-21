import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  Cpu, 
  CircuitBoard, 
  Microchip, 
  HardDrive, 
  Battery, 
  Package, 
  Wind,
  Loader2,
  Monitor 
} from "lucide-react";
import { allComponents, PCComponentData, getRecommendedComponents } from "@/lib/componentData";

interface ComponentSelectorProps {
  categories: {
    id: number;
    name: string;
    type: string;
    icon: string;
  }[];
  selectedComponents: Record<string, any>;
  onSelect: (type: string, component: any) => void;
  compatibility: Record<string, boolean>;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  categories,
  selectedComponents,
  onSelect,
  compatibility
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string>("cpu");
  
  // Fetch components from API
  const { data: apiComponents, isLoading: isLoadingComponents } = useQuery({
    queryKey: ['/api/components', expandedCategory],
    queryFn: async () => {
      if (!expandedCategory) return [];
      const response = await fetch(`/api/components/type/${expandedCategory}`);
      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }
      return response.json();
    },
    enabled: !!expandedCategory,
  });

  // Get components for a given type
  const getComponentsForType = (type: string): PCComponentData[] => {
    if (!type || type.trim() === "") {
      console.warn("Empty component type provided to getComponentsForType");
      return [];
    }
    
    console.log(`Getting components for type: ${type}`);
    
    // First check if we should show recommended components based on current selections
    if (Object.keys(selectedComponents).length > 0) {
      // Try to get recommendations from API components first
      if (apiComponents && apiComponents.length > 0) {
        // Logic for API-based recommendations would go here
        // For now, just use the static method
        const recommended = getRecommendedComponents(type, selectedComponents);
        console.log(`Found ${recommended.length} recommended components for ${type}`);
        return recommended;
      } else {
        // Fallback to static recommendations
        const recommended = getRecommendedComponents(type, selectedComponents);
        console.log(`Found ${recommended.length} recommended components for ${type}`);
        return recommended;
      }
    }
    
    // First use API components if available
    if (apiComponents && apiComponents.length > 0) {
      console.log(`Found ${apiComponents.length} API components for ${type}`);
      return apiComponents;
    }
    
    // Otherwise fallback to static data
    const all = allComponents[type] || [];
    console.log(`Found ${all.length} total components for ${type}`);
    return all;
  };

  // Only get component options if there's a valid expanded category
  const componentOptions = expandedCategory ? getComponentsForType(expandedCategory) : [];

  const getCompatibilityStatus = (type: string) => {
    if (selectedComponents[type]) {
      return compatibility[type] 
        ? { icon: <CheckCircle className="h-4 w-4" />, text: "Compatible", color: "text-green-500" }
        : { icon: <XCircle className="h-4 w-4" />, text: "Not Compatible", color: "text-red-500" };
    }
    
    if (type === "ram" || type === "storage") {
      return { icon: <AlertTriangle className="h-4 w-4" />, text: "Select Compatible Option", color: "text-yellow-400" };
    }
    
    return null;
  };

  const toggleCategory = (type: string) => {
    // Don't allow setting the expanded category to an empty string
    if (type === expandedCategory) {
      // Do nothing if clicked on the already expanded category
      return;
    }
    setExpandedCategory(type);
  };

  const getComponentIcon = (iconName: string) => {
    switch(iconName) {
      case 'cpu':
        return <Cpu className="h-6 w-6 text-accent" />;
      case 'gpu':
        return <Microchip className="h-6 w-6 text-accent" />;
      case 'ram':
        return <CircuitBoard className="h-6 w-6 text-accent" />;
      case 'motherboard':
        return <CircuitBoard className="h-6 w-6 text-accent" />;
      case 'storage':
        return <HardDrive className="h-6 w-6 text-accent" />;
      case 'psu':
        return <Battery className="h-6 w-6 text-accent" />;
      case 'case':
        return <Package className="h-6 w-6 text-accent" />;
      case 'cooling':
        return <Wind className="h-6 w-6 text-accent" />;
      case 'os':
        return <Monitor className="h-6 w-6 text-accent" />;
      default:
        return <Cpu className="h-6 w-6 text-accent" />;
    }
  };

  return (
    <Card className="bg-dark-surface rounded-xl border border-gray-800">
      <CardContent className="p-6">
        <h3 className="text-xl font-rajdhani font-bold mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-accent">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
          SELECT YOUR COMPONENTS
        </h3>
        
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className={`mb-6 border ${expandedCategory === category.type ? 'border-gray-600' : 'border-gray-700'} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="bg-accent text-dark-base rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <h4 className="text-lg font-rajdhani font-semibold">{category.name}</h4>
              </div>
              {getCompatibilityStatus(category.type) && (
                <span className={`flex items-center text-sm ${getCompatibilityStatus(category.type)?.color}`}>
                  {getCompatibilityStatus(category.type)?.icon}
                  <span className="ml-1">{getCompatibilityStatus(category.type)?.text}</span>
                </span>
              )}
            </div>
            
            {expandedCategory === category.type ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {isLoadingComponents ? (
                    <div className="col-span-3 p-6 text-center">
                      <Loader2 className="h-12 w-12 text-accent mx-auto mb-4 animate-spin" />
                      <h5 className="text-lg font-semibold mb-2">Loading Components</h5>
                      <p className="text-muted-foreground">
                        Fetching available {category.type} components...
                      </p>
                    </div>
                  ) : componentOptions.length === 0 ? (
                    <div className="col-span-3 p-6 text-center">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h5 className="text-lg font-semibold mb-2">No Components Available</h5>
                      <p className="text-muted-foreground">
                        Unable to find compatible {category.type} components with your current selections.
                      </p>
                    </div>
                  ) : (
                    componentOptions.map((component: any) => {
                      // Extract key specs to highlight for each component type
                      const getHighlightedSpecs = () => {
                        if (!component.specs) return [];
                        
                        switch (category.type) {
                          case 'cpu':
                            return [
                              { label: 'Cores', value: component.specs.cores || 'N/A' },
                              { label: 'Frequency', value: component.specs.frequency || 'N/A' },
                              { label: 'Socket', value: component.specs.socket || 'N/A' }
                            ];
                          case 'gpu':
                            return [
                              { label: 'Memory', value: component.specs.memory || 'N/A' },
                              { label: 'TDP', value: component.specs.tdp || 'N/A' }
                            ];
                          case 'ram':
                            return [
                              { label: 'Capacity', value: component.specs.capacity || 'N/A' },
                              { label: 'Speed', value: component.specs.speed || 'N/A' },
                              { label: 'Type', value: component.specs.type || 'N/A' }
                            ];
                          case 'motherboard':
                            return [
                              { label: 'Socket', value: component.specs.socket || 'N/A' },
                              { label: 'Form Factor', value: component.specs.formFactor || 'N/A' },
                              { label: 'RAM Type', value: component.specs.ramType || 'N/A' }
                            ];
                          case 'storage':
                            return [
                              { label: 'Capacity', value: component.specs.capacity || 'N/A' },
                              { label: 'Type', value: component.specs.type || 'N/A' },
                              { label: 'Read Speed', value: component.specs.readSpeed || 'N/A' }
                            ];
                          case 'psu':
                            return [
                              { label: 'Wattage', value: component.specs.wattage || 'N/A' },
                              { label: 'Efficiency', value: component.specs.efficiency || 'N/A' },
                              { label: 'Modularity', value: component.specs.modularity || 'N/A' }
                            ];
                          case 'case':
                            return [
                              { label: 'Form Factor', value: component.specs.formFactor || 'N/A' },
                              { label: 'Material', value: component.specs.material || 'N/A' },
                              { label: 'Features', value: component.specs.features || 'N/A' }
                            ];
                          case 'cooling':
                            return [
                              { label: 'Type', value: component.specs.type || 'N/A' },
                              { label: 'Size', value: component.specs.size || 'N/A' }
                            ];
                          case 'os':
                            return [
                              { label: 'Architecture', value: component.specs.architecture || 'N/A' },
                              { label: 'License', value: component.specs.licenseType || 'N/A' },
                              { label: 'Description', value: component.specs.description || 'N/A' }
                            ];
                          default:
                            return Object.entries(component.specs || {}).map(([key, value]) => ({
                              label: key,
                              value: String(value)
                            }));
                        }
                      };
                      
                      const highlightedSpecs = getHighlightedSpecs();
                      
                      // Add brand badge and compatibility indicator
                      const isCompatible = !selectedComponents[category.type] || 
                                          compatibility[category.type];
                      
                      return (
                        <div 
                          key={component.id}
                          className={`border ${selectedComponents[category.type]?.id === component.id 
                            ? 'border-accent' 
                            : isCompatible ? 'border-gray-700' : 'border-red-600/50'} 
                            bg-dark-card rounded-lg p-4 cursor-pointer 
                            hover:border-primary hover:shadow-md transition-all duration-200 relative`}
                          onClick={() => onSelect(category.type, component)}
                        >
                          {/* Selected indicator */}
                          {selectedComponents[category.type]?.id === component.id && (
                            <div className="absolute top-3 right-3 text-green-500">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                          )}
                          
                          {/* Brand badge */}
                          {component.brand && (
                            <div className="absolute top-3 right-3">
                              {selectedComponents[category.type]?.id !== component.id && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-dark-base border-gray-700"
                                >
                                  {component.brand}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {/* Component name */}
                          <h5 className="font-medium text-base mb-2 pr-16 text-white">{component.name}</h5>
                          
                          {/* Specs pills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {highlightedSpecs.map((spec, index) => (
                              <Badge 
                                key={index} 
                                variant="outline"
                                className="text-xs font-normal bg-dark-base/50 border-gray-700/50 flex items-center"
                              >
                                <span className="text-muted-foreground mr-1">{spec.label}:</span> {spec.value}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Price with in-stock indicator */}
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-primary">£{component.price}</p>
                            {component.inStock ? (
                              <div className="text-xs flex items-center text-green-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                In Stock
                              </div>
                            ) : (
                              <div className="text-xs flex items-center text-yellow-500">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                                Limited Stock
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <Button 
                  variant="link" 
                  className="text-accent hover:text-primary transition-colors duration-200 text-sm font-medium p-0 h-auto"
                  onClick={() => toggleCategory(category.type)}
                >
                  Hide {category.type.toLowerCase()} options <ChevronRight className="ml-1 h-4 w-4 transform rotate-90" />
                </Button>
              </>
            ) : (
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-dark-card p-2 rounded transition-colors duration-200"
                onClick={() => toggleCategory(category.type)}
              >
                <div className="flex items-center">
                  {getComponentIcon(category.icon)}
                  <div className="ml-2">
                    {selectedComponents[category.type] ? (
                      <p className="font-medium">{selectedComponents[category.type].name}</p>
                    ) : (
                      <p className="text-muted-foreground">Select {category.name}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-accent" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComponentSelector;