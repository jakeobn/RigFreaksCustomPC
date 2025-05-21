import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  Cpu, 
  CircuitBoard, 
  MemoryStick, 
  HardDrive, 
  Battery, 
  Package, 
  Wind,
  Loader2,
  Monitor,
  Info
} from "lucide-react";
import { allComponents, PCComponentData, checkComponentCompatibility } from "@/lib/componentData";

interface ComponentSelectorProps {
  categories: {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    isRequired: boolean;
  }[];
  selectedComponents: Record<string, PCComponentData | null>;
  onSelect: (type: string, component: PCComponentData) => void;
  compatibility: { compatible: boolean; issues: string[] };
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  categories,
  selectedComponents,
  onSelect,
  compatibility
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string>("cpu");
  const [, navigate] = useLocation();
  
  // Get components for a given type
  const getComponentsForType = (type: string): PCComponentData[] => {
    if (!type || type.trim() === "") {
      console.warn("Empty component type provided to getComponentsForType");
      return [];
    }
    
    console.log(`Getting components for type: ${type}`);
    
    // Get all components for the category
    const components = allComponents[type] || [];
    if (components.length === 0) {
      return [];
    }
    
    // Filter for compatibility with current selections
    if (Object.keys(selectedComponents).length > 0) {
      return components.filter(component => 
        checkComponentCompatibility(component, selectedComponents)
      );
    }
    
    return components;
  };

  // Only get component options if there's a valid expanded category
  const componentOptions = expandedCategory ? getComponentsForType(expandedCategory) : [];

  const getCompatibilityStatus = (type: string) => {
    if (selectedComponents[type]) {
      return compatibility.compatible 
        ? { icon: <CheckCircle className="h-4 w-4" />, text: "Compatible", color: "text-green-500" }
        : { icon: <XCircle className="h-4 w-4" />, text: "Not Compatible", color: "text-red-500" };
    }
    
    if (type === "memory" || type === "storage") {
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

      case 'memory':
        return <MemoryStick className="h-6 w-6 text-accent" />;
      case 'motherboard':
        return <CircuitBoard className="h-6 w-6 text-accent" />;
      case 'storage':
        return <HardDrive className="h-6 w-6 text-accent" />;
      case 'power':
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
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-accent">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
          SELECT YOUR COMPONENTS
        </h3>
        
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className={`mb-6 border ${expandedCategory === category.id ? 'border-gray-600' : 'border-gray-700'} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="bg-accent text-dark-base rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <h4 className="text-lg font-semibold">{category.name}</h4>
              </div>
              {getCompatibilityStatus(category.id) && (
                <span className={`flex items-center text-sm ${getCompatibilityStatus(category.id)?.color}`}>
                  {getCompatibilityStatus(category.id)?.icon}
                  <span className="ml-1">{getCompatibilityStatus(category.id)?.text}</span>
                </span>
              )}
            </div>
            
            {expandedCategory === category.id ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {componentOptions.length === 0 ? (
                    <div className="col-span-3 p-6 text-center">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h5 className="text-lg font-semibold mb-2">No Compatible Components</h5>
                      <p className="text-muted-foreground">
                        Unable to find compatible {category.name} components with your current selections.
                      </p>
                    </div>
                  ) : (
                    componentOptions.map((component: PCComponentData) => {
                      // Extract key specs to highlight for each component type
                      const getHighlightedSpecs = () => {
                        if (!component.specs) return [];
                        
                        switch (category.id) {
                          case 'cpu':
                            return [
                              { label: 'Cores', value: component.specs.cores || 'N/A' },
                              { label: 'Frequency', value: component.specs.boostClock || 'N/A' },
                              { label: 'Socket', value: component.specs.socket || 'N/A' }
                            ];

                          case 'memory':
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
                          case 'power':
                            return [
                              { label: 'Wattage', value: component.specs.wattage || 'N/A' },
                              { label: 'Efficiency', value: component.specs.efficiency || 'N/A' },
                              { label: 'Modularity', value: component.specs.modularity || 'N/A' }
                            ];
                          case 'case':
                            return [
                              { label: 'Form Factor', value: component.specs.formFactor || 'N/A' },
                              { label: 'Internal Height', value: component.specs.internalHeight || 'N/A' },
                              { label: 'CPU Clearance', value: component.specs.cpuCoolerClearance || 'N/A' }
                            ];
                          case 'cooling':
                            return [
                              { label: 'Type', value: component.specs.type || 'N/A' },
                              { label: 'TDP', value: component.specs.tdp || 'N/A' }
                            ];
                          case 'os':
                            return [
                              { label: 'Type', value: component.specs.type || 'N/A' },
                              { label: 'License', value: component.specs.licenseType || 'N/A' }
                            ];
                          default:
                            return Object.entries(component.specs || {}).slice(0, 3).map(([key, value]) => ({
                              label: key,
                              value: String(value)
                            }));
                        }
                      };
                      
                      const highlightedSpecs = getHighlightedSpecs();
                      
                      // Add brand badge and compatibility indicator
                      const isCompatible = checkComponentCompatibility(component, selectedComponents);
                      
                      return (
                        <div 
                          key={component.id}
                          className={`border ${selectedComponents[category.id]?.id === component.id 
                            ? 'border-accent' 
                            : isCompatible ? 'border-gray-700' : 'border-red-600/50'} 
                            bg-dark-card rounded-lg p-4 cursor-pointer 
                            hover:border-primary hover:shadow-md transition-all duration-200 relative`}
                          onClick={() => onSelect(category.id, component)}
                        >
                          {/* Selected indicator */}
                          {selectedComponents[category.id]?.id === component.id && (
                            <div className="absolute top-3 right-3 text-green-500">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                          )}
                          
                          {/* Brand badge */}
                          {component.brand && (
                            <div className="absolute top-3 right-3">
                              {selectedComponents[category.id]?.id !== component.id && (
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
                          
                          {/* Price with in-stock indicator and details link */}
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-primary">${component.price}</p>
                            <div className="flex items-center gap-2">
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
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 rounded-full hover:bg-accent/20"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent triggering the parent onClick
                                  navigate(`/component/${category.id}/${component.id}`);
                                }}
                                title="View component details"
                              >
                                <Info className="h-4 w-4 text-accent" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <Button 
                  variant="link" 
                  className="text-accent hover:text-primary transition-colors duration-200 text-sm font-medium p-0 h-auto"
                  onClick={() => toggleCategory('')}
                >
                  Collapse <ChevronRight className="h-3 w-3 ml-1 rotate-90" />
                </Button>
              </>
            ) : (
              <div>
                {selectedComponents[category.id] ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center mr-3">
                        {getComponentIcon(category.id)}
                      </div>
                      <div>
                        <p className="font-medium">{selectedComponents[category.id]?.name}</p>
                        <p className="text-sm text-muted-foreground">${selectedComponents[category.id]?.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.id);
                      }}
                    >
                      Change <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      {category.isRequired ? "Required - Not Selected" : "Optional - Not Selected"}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.id);
                      }}
                    >
                      Select <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComponentSelector;