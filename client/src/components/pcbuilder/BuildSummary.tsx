import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ShoppingCart, Save, InfoIcon, Cpu, Monitor, HardDrive, Server, Zap, Box, Fan } from "lucide-react";
import { PCComponentData } from "@/lib/componentData";

interface BuildSummaryProps {
  selectedComponents: Record<string, PCComponentData>;
  hasCompatibilityWarnings: boolean;
}

const BuildSummary: React.FC<BuildSummaryProps> = ({ 
  selectedComponents,
  hasCompatibilityWarnings
}) => {
  // Calculate total
  const calculateSubtotal = () => {
    return Object.values(selectedComponents).reduce((total, component: PCComponentData) => {
      return total + parseFloat(component.price || "0");
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const buildingFee = 99.99;
  const shipping = 0;
  const total = subtotal + buildingFee + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  // Custom memory icon since it's not in lucide-react
  const MemoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M8 19V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v14"></path>
      <path d="M8 12h8"></path>
      <path d="M8 16h8"></path>
    </svg>
  );

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'cpu': return <Cpu className="h-4 w-4" />;
      case 'ram': return <MemoryIcon />;
      case 'storage': return <HardDrive className="h-4 w-4" />;
      case 'motherboard': return <Server className="h-4 w-4" />;
      case 'psu': return <Zap className="h-4 w-4" />;
      case 'case': return <Box className="h-4 w-4" />;
      case 'cooling': return <Fan className="h-4 w-4" />;
      default: return <Box className="h-4 w-4" />;
    }
  };

  // Calculate estimated performance metrics
  const calculatePerformanceScore = () => {
    let score = 0;
    
    if (selectedComponents.cpu) {
      // Base CPU score on price as a simple heuristic
      score += parseFloat(selectedComponents.cpu.price) / 100;
    }
    
    // Add more score for RAM and storage
    if (selectedComponents.ram) {
      score += parseFloat(selectedComponents.ram.price) / 150;
    }
    
    if (selectedComponents.storage) {
      score += parseFloat(selectedComponents.storage.price) / 200;
    }
    
    // Cap score between 0 and 10
    return Math.min(Math.round(score * 10) / 10, 10);
  };

  const getPerformanceRating = () => {
    const score = calculatePerformanceScore();
    if (score >= 8) return "Enthusiast";
    if (score >= 6) return "Gaming";
    if (score >= 4) return "Mainstream";
    if (score >= 2) return "Entry-Level";
    return "Basic";
  };

  const addToCart = () => {
    // Implementation depends on cart functionality
    console.log("Adding build to cart", selectedComponents);
  };

  const saveConfiguration = () => {
    // Implementation depends on save functionality
    console.log("Saving configuration", selectedComponents);
  };

  // Get highlights from the build
  const getBuildHighlights = () => {
    const highlights = [];
    
    if (selectedComponents.cpu) {
      highlights.push(`${selectedComponents.cpu.specs.cores || ''} Processor`);
    }
    
    if (selectedComponents.ram) {
      highlights.push(`${selectedComponents.ram.specs.capacity || ''} Memory`);
    }
    
    if (selectedComponents.storage) {
      highlights.push(`${selectedComponents.storage.specs.capacity || ''} Storage`);
    }
    
    return highlights;
  };

  const componentTypes = [
    { type: 'cpu', name: 'CPU' },
    { type: 'motherboard', name: 'Motherboard' },
    { type: 'ram', name: 'Memory' },
    { type: 'storage', name: 'Storage' },
    { type: 'psu', name: 'Power Supply' },
    { type: 'case', name: 'Case' },
    { type: 'cooling', name: 'Cooling' }
  ];

  const buildHighlights = getBuildHighlights();
  const performanceScore = calculatePerformanceScore();
  const performanceRating = getPerformanceRating();

  return (
    <Card className="bg-dark-surface rounded-xl border border-gray-800 sticky top-24">
      <CardContent className="p-6">
        <h3 className="text-xl font-rajdhani font-bold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          BUILD SUMMARY
        </h3>

        {/* Build Performance Rating */}
        {Object.keys(selectedComponents).length > 0 && (
          <div className="mb-4 p-3 bg-dark-card rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Build Rating</span>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-semibold">
                {performanceRating}
              </Badge>
            </div>
            <div className="w-full bg-dark-base rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-accent h-2 rounded-full" 
                style={{ width: `${(performanceScore / 10) * 100}%` }}
              ></div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {buildHighlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="bg-dark-base text-white text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-3 mb-6">
          {componentTypes.map((component) => (
            <div key={component.type} className="flex justify-between text-sm pb-2 border-b border-gray-700/50">
              <div className="flex items-center">
                {getComponentIcon(component.type)}
                <span className="ml-2 text-muted-foreground">{component.name}</span>
              </div>
              <div className="text-right">
                {selectedComponents[component.type] ? (
                  <>
                    <p className="font-medium text-white">{selectedComponents[component.type].name}</p>
                    <p className="text-primary font-medium">{formatPrice(parseFloat(selectedComponents[component.type].price))}</p>
                  </>
                ) : (
                  <p className="text-yellow-400 italic text-xs">Not selected</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Card className="bg-dark-card rounded-lg mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="flex items-center">
                <span className="text-xs text-muted-foreground ml-1">(Professional assembly)</span>
              </span>
              <span className="font-medium">{formatPrice(buildingFee)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span className="font-medium">{formatPrice(shipping)}</span>
            </div>
            <Separator className="bg-gray-700 my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col space-y-4">
          <Button 
            variant="secondary" 
            className="bg-gray-700 hover:bg-gray-600 text-white font-rajdhani font-semibold"
            onClick={saveConfiguration}
          >
            <Save className="mr-2 h-4 w-4" /> SAVE CONFIGURATION
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-rajdhani font-semibold"
            onClick={addToCart}
            disabled={Object.keys(selectedComponents).length < 3 || hasCompatibilityWarnings}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> ADD TO CART
          </Button>
          {(Object.keys(selectedComponents).length < 3 || hasCompatibilityWarnings) && (
            <div className="text-center text-muted-foreground text-sm">
              <InfoIcon className="inline-block mr-1 h-4 w-4" /> 
              {Object.keys(selectedComponents).length < 3 
                ? "Please select more components" 
                : "Your build has compatibility warnings"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildSummary;
