import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGlobalState } from '@/lib/GlobalState';
import { ImageGallery } from '@/components/ui/image-gallery';
import { 
  Cpu, 
  HardDrive, 
  Fan, 
  Box, 
  Zap, 
  Server, 
  MemoryStick, 
  AlertCircle,
  AlertTriangle,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  ShoppingCart,
  Monitor,
  X,
  XCircle,
  Info,
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  CircleDollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { allComponents, PCComponentData, checkComponentCompatibility, loadComponentsFromStorage } from '@/lib/componentData';
import { fetchAllComponents, fetchComponentsByType } from '@/lib/fetchComponents';
import { processImageUrl, processGalleryUrls } from '@/lib/imageUtils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import PerformanceEstimator from '@/components/performance/PerformanceEstimator';

// Types
// Using PCComponentData from our shared type in componentData.ts
// interface Component {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   brand: string;
//   image?: string;
//   specs: Record<string, string | number>;
//   category: string;
//   compatibility?: string[];
// }

interface BuildStep {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isRequired: boolean;
}

interface PCConfiguration {
  [category: string]: string | null;
}

// Build steps in order
const BUILD_STEPS: BuildStep[] = [
  {
    id: 'case',
    name: 'Case',
    icon: <Box className="h-6 w-6" />,
    description: 'Select a case that fits your style and has enough room for all your components.',
    isRequired: true
  },
  {
    id: 'cpu',
    name: 'CPU',
    icon: <Cpu className="h-6 w-6" />,
    description: 'The brain of your computer that handles all the processing tasks.',
    isRequired: true
  },
  {
    id: 'motherboard',
    name: 'Motherboard',
    icon: <Server className="h-6 w-6" />,
    description: 'The main circuit board that connects all components together.',
    isRequired: true
  },
  {
    id: 'cooling',
    name: 'CPU Cooling',
    icon: <Fan className="h-6 w-6" />,
    description: 'Keeps your CPU cool under heavy workloads.',
    isRequired: true
  },
  {
    id: 'memory',
    name: 'Memory (RAM)',
    icon: <MemoryStick className="h-6 w-6" />,
    description: 'Temporary storage for data that your CPU needs to access quickly.',
    isRequired: true
  },
  {
    id: 'gpu',
    name: 'Graphics Card',
    icon: <Monitor className="h-6 w-6" />,
    description: 'Dedicated hardware for rendering graphics and video processing.',
    isRequired: true
  },
  {
    id: 'power',
    name: 'Power Supply',
    icon: <Zap className="h-6 w-6" />,
    description: 'Provides the electricity needed to run all your components.',
    isRequired: true
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: <HardDrive className="h-6 w-6" />,
    description: 'Long-term storage for your operating system, files, and programs.',
    isRequired: true
  },
  {
    id: 'os',
    name: 'Operating System',
    icon: <Monitor className="h-6 w-6" />,
    description: 'Choose an operating system to run your software and applications.',
    isRequired: true
  },
  {
    id: 'review',
    name: 'Review',
    icon: <Check className="h-6 w-6" />,
    description: 'Review your build and check for any compatibility issues.',
    isRequired: false
  }
];

// Using allComponents from componentData.ts instead of sample components

// Component function
// Create a version tracker for component data
let componentVersionTracker = 0;

export function StepBuilder() {
  // Get toast function
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [configuration, setConfiguration] = useState<PCConfiguration>({});
  // Add state to track component version to force re-render when step changes
  const [componentVersion, setComponentVersion] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState<Record<string, PCComponentData | null>>({});
  const [compatibility, setCompatibility] = useState<{ compatible: boolean; issues: string[] }>({ 
    compatible: true, 
    issues: [] 
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [buildProgress, setBuildProgress] = useState<number>(0);
  
  // Component details popup state
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [detailComponent, setDetailComponent] = useState<PCComponentData | null>(null);
  
  // Enhanced filtering and search state
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('price-asc');

  // Function to refresh components from local storage
  const refreshComponentData = async () => {
    console.log('Loading components from database API...');
    
    try {
      // Load from local API
      const response = await fetch('/api/components');
      
      if (response.ok) {
        const data = await response.json();
        
        // Only update if we got valid data
        if (data && Array.isArray(data) && data.length > 0) {
          // Group components by type
          const componentsByType: Record<string, PCComponentData[]> = {};
          
          data.forEach((component: any) => {
            const type = component.type || 'unknown';
            if (!componentsByType[type]) {
              componentsByType[type] = [];
            }
            
            // Convert to PCComponentData format
            const formattedComponent: PCComponentData = {
              id: component.id.toString(),
              name: component.name,
              price: parseFloat(component.price) || 0,
              description: component.description || '',
              category: component.type,
              // Use either image or imageUrl, with imageUrl taking precedence
              image: component.imageUrl || component.image || '/default-component.jpg',
              // Process gallery images to handle different formats
              imagesGallery: Array.isArray(component.imagesGallery) ? 
                component.imagesGallery.filter(img => img && typeof img === 'string') : [],
              inventoryStatus: component.inventoryStatus || 'in-stock',
              specs: component.specs || {},
              specsHtml: component.specsHtml || '',
              brand: component.brand || '',
              inStock: component.inStock !== undefined ? component.inStock : 
                      (component.inventoryStatus === 'in-stock')
            };
            
            componentsByType[type].push(formattedComponent);
          });
          
          // Update allComponents with the loaded data
          console.log('Loaded ' + data.length + ' components from database');
          
          // Merge with localStorage components to keep custom components
          const storedComponents = loadComponentsFromStorage(false);
          
          // For each category in storedComponents, check if we need to keep those components
          Object.keys(storedComponents).forEach(category => {
            if (!componentsByType[category] || componentsByType[category].length === 0) {
              // If this category is missing from the API data, use localStorage
              componentsByType[category] = storedComponents[category];
              console.log('Keeping existing ' + category + ' components from local storage');
            }
          });
          
          // Update components state
          // Don't assign to imported allComponents
          // Create a new local object to avoid modifying the imported one
          const updatedComponents: Record<string, PCComponentData[]> = {};
          
          Object.keys(componentsByType).forEach(key => {
            if (componentsByType[key] && componentsByType[key].length > 0) {
              updatedComponents[key] = componentsByType[key];
            }
          });
          
          // Use the updated components object for our component data
          setAllComponentsData(updatedComponents);
          
          // Save to localStorage with timestamp
          const timestamp = new Date().toLocaleString();
          localStorage.setItem('components', JSON.stringify({
            data: allComponents,
            timestamp
          }));
          
          console.log('Component data saved with backup at: ' + new Date().toLocaleTimeString());
          
          // Increment version to ensure component data refresh
          componentVersionTracker++;
          setComponentVersion(componentVersionTracker);
          
          // Also trigger a global refresh
          globalRefresh();
          
          return;
        }
      } else {
        console.log('Failed to load components from API:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to load components from API:', error);
    }
    
    // If API failed, fall back to localStorage
    console.log('Falling back to localStorage components');
    loadComponentsFromStorage();
    
    // Increment version to ensure component data refresh
    componentVersionTracker++;
    setComponentVersion(componentVersionTracker);
    
    toast({
      title: "Components Refreshed",
      description: "Component data has been refreshed from storage."
    });
  };

  // Use global state to keep component data in sync
  const { lastUpdateTime, refreshComponents: globalRefresh } = useGlobalState();
  
  // Re-render when global state updates
  useEffect(() => {
    // Force a re-render with updated data by incrementing version
    componentVersionTracker++;
    setComponentVersion(componentVersionTracker);
    
    console.log('StepBuilder updated from global state:', new Date(lastUpdateTime).toLocaleTimeString());
  }, [lastUpdateTime]);
  
  // Initial load
  useEffect(() => {
    refreshComponentData();
  }, []);
  
  // Reload data when current step changes
  useEffect(() => {
    // Reload component data from localStorage
    loadComponentsFromStorage();
    
    // Force a re-render with updated data by incrementing version
    componentVersionTracker++;
    setComponentVersion(componentVersionTracker);
    
    console.log('Current step changed, reloaded component data');
  }, [currentStep]);

  // Calculate build progress
  useEffect(() => {
    const requiredSteps = BUILD_STEPS.filter(step => step.isRequired).length;
    // Count how many components are selected, and also count the GPU as "selected" even if skipped
    let selectedCount = Object.values(configuration).filter(Boolean).length;
    
    // If currentStep is past the GPU step and GPU isn't selected, count it as selected
    const gpuStepIndex = BUILD_STEPS.findIndex(step => step.id === 'gpu');
    if (gpuStepIndex >= 0 && currentStep > gpuStepIndex && !configuration['gpu']) {
      selectedCount++;
    }
    
    const progress = requiredSteps > 0 ? (selectedCount / requiredSteps) * 100 : 0;
    setBuildProgress(progress);
  }, [configuration, currentStep]);

  // Calculate total price - using componentVersion to ensure we recalculate when price changes
  useEffect(() => {
    // Include componentVersion in dependencies to trigger when prices change
    const _ = componentVersion;
    
    // Force reload the latest component data to ensure accurate prices
    loadComponentsFromStorage();
    
    // Calculate price using fresh component data
    const price = Object.values(selectedComponents).reduce((sum, component) => {
      if (!component) return sum;
      
      // Look up the latest price from allComponents
      const category = component.category;
      const latestComponent = allComponents[category]?.find(c => c.id === component.id);
      const latestPrice = latestComponent?.price || component.price;
      
      return sum + latestPrice;
    }, 0);
    
    setTotalPrice(price);
    console.log(`Recalculated total price: £${price.toFixed(2)} (version: ${componentVersion})`);
  }, [selectedComponents, componentVersion]);

  // Advanced compatibility checks
  useEffect(() => {
    const issues: string[] = [];
    
    // 1. Check if CPU and motherboard sockets match
    const cpu = selectedComponents['cpu'];
    const mobo = selectedComponents['motherboard'];
    
    if (cpu && mobo && cpu.specs && mobo.specs) {
      const cpuSocket = cpu.specs.socket?.toString() || '';
      const moboSocket = mobo.specs.socket?.toString() || '';
      
      if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
        issues.push(`CPU socket (${cpuSocket}) is not compatible with motherboard socket (${moboSocket})`);
      }
    }
    
    // 2. Check if memory is compatible with motherboard
    const memory = selectedComponents['memory'];
    if (memory && mobo && memory.specs && mobo.specs) {
      const memoryType = memory.specs.type?.toString() || '';
      const moboMemoryType = mobo.specs.memoryType?.toString() || '';
      
      if (memoryType && moboMemoryType && memoryType !== moboMemoryType) {
        issues.push(`Memory type (${memoryType}) is not compatible with motherboard memory type (${moboMemoryType})`);
      }
    }
    
    // 3. Check if CPU cooler is compatible with CPU socket
    const cooler = selectedComponents['cooler'];
    if (cooler && cpu && cooler.specs && cpu.specs) {
      const coolerSockets = cooler.specs.compatibleSockets?.toString() || '';
      const cpuSocket = cpu.specs.socket?.toString() || '';
      
      // If cooler doesn't support CPU socket
      if (coolerSockets && cpuSocket && !coolerSockets.includes(cpuSocket)) {
        issues.push(`CPU cooler is not compatible with ${cpuSocket} socket`);
      }
    }
    
    // 4. Check if case and motherboard form factors match
    const pcCase = selectedComponents['case'];
    if (pcCase && mobo && pcCase.specs && mobo.specs) {
      const caseFormFactor = pcCase.specs.formFactor?.toString() || '';
      const moboFormFactor = mobo.specs.formFactor?.toString() || '';
      
      // If case doesn't support motherboard form factor
      if (caseFormFactor && moboFormFactor && !caseFormFactor.includes(moboFormFactor)) {
        issues.push(`Case (${caseFormFactor}) may not fit motherboard form factor (${moboFormFactor})`);
      }
    }
    
    // 5. Check if power supply has enough wattage for CPU and other components
    const psu = selectedComponents['power'];
    if (psu && cpu && psu.specs && cpu.specs) {
      const psuWattageStr = psu.specs.wattage?.toString() || '0';
      const cpuTDPStr = cpu.specs.tdp?.toString() || '0';
      const psuWattage = parseInt(psuWattageStr);
      const cpuTDP = parseInt(cpuTDPStr) || 0;
      
      // Estimate system power requirements (simplified)
      const estimatedWattage = cpuTDP + 100; // Base + CPU
      
      if (psuWattage < estimatedWattage) {
        issues.push(`Power supply (${psuWattage}W) may not be sufficient for your system (est. ${estimatedWattage}W)`);
      }
    }
    
    setCompatibility({
      compatible: issues.length === 0,
      issues
    });
  }, [selectedComponents]);
  
  // Search and filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  // Function to check if a component is compatible with the current build
  const isComponentCompatible = (component: PCComponentData): boolean => {
    // If no other components are selected, everything is compatible
    if (Object.keys(selectedComponents).length === 0) return true;
    
    // Ensure component has specs defined
    if (!component.specs) return true;
    
    // CPU and Motherboard compatibility check (socket type)
    if (component.category === 'cpu' && selectedComponents['motherboard']) {
      const mobo = selectedComponents['motherboard'];
      if (!mobo.specs) return true;
      return component.specs.socket === mobo.specs.socket;
    }
    
    if (component.category === 'motherboard' && selectedComponents['cpu']) {
      const cpu = selectedComponents['cpu'];
      if (!cpu.specs) return true;
      return component.specs.socket === cpu.specs.socket;
    }
    
    // Memory and Motherboard compatibility check
    if (component.category === 'memory' && selectedComponents['motherboard']) {
      const mobo = selectedComponents['motherboard'];
      if (!mobo.specs) return true;
      return component.specs.type === mobo.specs.memoryType;
    }
    
    // CPU Cooler and CPU compatibility check
    if (component.category === 'cooler' && selectedComponents['cpu']) {
      const cpu = selectedComponents['cpu'];
      if (!cpu.specs || !component.specs.compatibleSockets) return true;
      const compatibleSockets = component.specs.compatibleSockets.toString();
      return compatibleSockets.includes(cpu.specs.socket?.toString() || '');
    }
    
    // Case and Motherboard compatibility check
    if (component.category === 'case' && selectedComponents['motherboard']) {
      const mobo = selectedComponents['motherboard'];
      if (!mobo.specs || !component.specs.formFactor) return true;
      const caseFormFactor = component.specs.formFactor.toString();
      const moboFormFactor = mobo.specs.formFactor?.toString() || '';
      return caseFormFactor.includes(moboFormFactor);
    }
    
    // Power Supply and CPU compatibility check (wattage)
    if (component.category === 'power' && selectedComponents['cpu']) {
      const cpu = selectedComponents['cpu'];
      if (!cpu.specs || !component.specs.wattage) return true;
      const psuWattage = parseInt(component.specs.wattage.toString());
      const cpuTDP = parseInt(cpu.specs.tdp?.toString() || '0');
      const estimatedWattage = cpuTDP + 100; // Base + CPU
      return psuWattage >= estimatedWattage;
    }
    
    // By default, assume compatible if no specific check is defined
    return true;
  };

  // Select a component
  const selectComponent = (component: PCComponentData) => {
    // First reload latest component data from localStorage
    loadComponentsFromStorage();
    
    // Make sure we're using the latest version of the component data
    const category = component.category;
    const componentId = component.id;
    
    // Find the up-to-date component instance
    const updatedComponent = allComponents[category]?.find(c => c.id === componentId) || component;
    
    // Check if the component is out of stock
    if (updatedComponent.inventoryStatus === 'out-of-stock') {
      toast({
        title: "Component Unavailable",
        description: "This component is currently out of stock and cannot be selected.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Selected component with price:', updatedComponent.price);
    
    setConfiguration(prev => ({
      ...prev,
      [category]: componentId
    }));
    
    setSelectedComponents(prev => ({
      ...prev,
      [category]: updatedComponent
    }));
    
    toast({
      title: "Component Added",
      description: `${updatedComponent.name} has been added to your build.`,
    });
    
    // If not on the review step, move to next step
    if (currentStep < BUILD_STEPS.length - 1) {
      // Reload latest component data again before advancing to next step
      loadComponentsFromStorage();
      
      // Increment component version to ensure fresh data on step change
      componentVersionTracker++;
      setComponentVersion(componentVersionTracker);
      setCurrentStep(currentStep + 1);
    }
  };

  // Remove a component
  const removeComponent = (category: string) => {
    // Increment component version to ensure fresh data
    componentVersionTracker++;
    setComponentVersion(componentVersionTracker);
    
    setConfiguration(prev => ({
      ...prev,
      [category]: null
    }));
    
    setSelectedComponents(prev => ({
      ...prev,
      [category]: null
    }));
    
    toast({
      title: "Component Removed",
      description: `The ${BUILD_STEPS.find(step => step.id === category)?.name || category} has been removed from your build.`,
    });
  };

  // Reset configuration
  const resetConfiguration = () => {
    // Increment component version to ensure fresh data
    componentVersionTracker++;
    setComponentVersion(componentVersionTracker);
    
    setConfiguration({});
    setSelectedComponents({});
    setCurrentStep(0);
    
    toast({
      title: "Build Reset",
      description: "Your PC configuration has been reset.",
    });
  };
  
  // Show component details in popup
  const showDetails = (e: React.MouseEvent, component: PCComponentData) => {
    e.stopPropagation(); // Prevent card click
    setDetailComponent(component);
    setIsDetailsOpen(true);
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep < BUILD_STEPS.length - 1) {
      // Reload latest component data from localStorage
      loadComponentsFromStorage();
      
      // Increment component version to ensure fresh data on step change
      componentVersionTracker++;
      setComponentVersion(componentVersionTracker);
      
      // Move to next step
      setCurrentStep(currentStep + 1);
      
      // Log for debugging
      console.log('Moving to next step, reloaded component data');
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      // Reload latest component data from localStorage
      loadComponentsFromStorage();
      
      // Increment component version to ensure fresh data on step change
      componentVersionTracker++;
      setComponentVersion(componentVersionTracker);
      
      // Move to previous step
      setCurrentStep(currentStep - 1);
      
      // Log for debugging
      console.log('Moving to previous step, reloaded component data');
    }
  };

  // Get current step
  const getCurrentStep = () => {
    return BUILD_STEPS[currentStep];
  };

  // Get components for current step with most up-to-date prices
  const getCurrentStepComponents = () => {
    // The componentVersion dependency ensures this re-runs when components are updated
    // When this changes, the entire function gets re-evaluated
    console.log(`Getting step components, version: ${componentVersion}`);
    
    // Force a fresh load from localStorage to get the latest prices
    loadComponentsFromStorage();
    
    const step = getCurrentStep();
    if (step.id === 'review') return [];
    
    // Create a new array to ensure React detects the change
    return [...(allComponents[step.id] || [])];
  };

  // Render component selection for current step
  const renderComponentSelection = () => {
    // Use componentVersion to ensure this re-runs when components are updated
    const _ = componentVersion; // eslint-disable-line no-unused-vars
    console.log(`Rendering component selection, version: ${componentVersion}`);
    
    // Force reload components from localStorage to ensure fresh data
    loadComponentsFromStorage();
    
    const currentStepObj = getCurrentStep();
    
    // If we're on the review step, show the summary
    if (currentStepObj.id === 'review') {
      return renderBuildSummary();
    }
    
    // Get fresh components for the current step directly from the allComponents object
    // This ensures we always have the latest component data including price updates
    // Using spread creates a new array reference, forcing React to re-render
    const componentsForStep = [...(allComponents[currentStepObj.id] || [])];
    
    // Group components by brand for filtering purposes
    const brandGroups = componentsForStep.reduce((groups, component) => {
      if (!groups[component.brand]) {
        groups[component.brand] = [];
      }
      groups[component.brand].push(component);
      return groups;
    }, {} as Record<string, PCComponentData[]>);
    
    // Get list of unique brands
    const brands = Object.keys(brandGroups).sort();
    
    // Using component-level state for filtering instead of local state declarations
    // No hooks are declared here
    
    // Filter and sort components
    let filteredComponents = [...componentsForStep];
    
    // Apply search term filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredComponents = filteredComponents.filter(component => 
        component.name.toLowerCase().includes(searchLower) || 
        (component.brand && component.brand.toLowerCase().includes(searchLower)) ||
        (component.description && component.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply brand filter
    if (selectedBrand) {
      filteredComponents = filteredComponents.filter(c => c.brand === selectedBrand);
    }
    
    // Apply availability filter
    if (availabilityFilter && availabilityFilter !== 'all') {
      filteredComponents = filteredComponents.filter(component => {
        if (availabilityFilter === 'in-stock') {
          return component.inventoryStatus === 'in-stock' || component.inStock === true;
        } else if (availabilityFilter === 'pre-order') {
          return component.inventoryStatus === 'pre-order';
        }
        return true;
      });
    }
    
    // Filter for compatibility with currently selected components
    filteredComponents = filteredComponents.filter(component => {
      // Skip compatibility check if no components selected yet
      if (Object.keys(selectedComponents).filter(key => 
        selectedComponents[key] !== null && key !== currentStepObj.id
      ).length === 0) {
        return true;
      }
      
      // Check compatibility with each selected component
      for (const [category, selectedComponent] of Object.entries(selectedComponents)) {
        // Skip current category and null values
        if (category === currentStepObj.id || !selectedComponent) continue;
        
        // Check if the current component is compatible with the selected component
        const result = checkComponentCompatibility(component, { [category]: selectedComponent });
        if (!result.compatible) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    filteredComponents.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
    
    // Show currently selected component if any
    const selectedComponent = selectedComponents[currentStepObj.id];
    
    return (
      <div className="p-0 sm:p-4 space-y-6">
        {/* Currently selected component */}
        {selectedComponent && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold tracking-tight text-gray-800">Selected Component</h3>
              <Badge variant="outline" className="h-6 bg-green-100 text-green-700 border-green-300">
                <Check className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            </div>
            
            <div className="bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="bg-white p-6 sm:p-8 flex-shrink-0 sm:w-1/2 flex items-center justify-center">
                  {selectedComponent.image ? (
                    <img 
                      src={selectedComponent.image} 
                      alt={selectedComponent.name}
                      className="max-w-full max-h-[250px] object-contain"
                    />
                  ) : (
                    <div className="text-6xl text-gray-400">
                      {currentStepObj.icon}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 p-4 sm:p-6">
                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-100 border border-gray-300 text-gray-700">
                        {selectedComponent.brand}
                      </Badge>
                      {/* Individual price removed as requested by client */}
                      {/* Inventory status badge */}
                      <Badge 
                        variant={
                          selectedComponent.inventoryStatus === 'in-stock' ? 'success' : 
                          selectedComponent.inventoryStatus === 'out-of-stock' ? 'destructive' : 
                          selectedComponent.inventoryStatus === 'pre-order' ? 'preorder' :
                          selectedComponent.inStock ? 'success' : 'destructive'
                        }
                        className="text-[11px]"
                      >
                        {selectedComponent.inventoryStatus === 'in-stock' ? 'In Stock' : 
                         selectedComponent.inventoryStatus === 'out-of-stock' ? 'Out of Stock' : 
                         selectedComponent.inventoryStatus === 'pre-order' ? 'Pre Order' :
                         selectedComponent.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-xl mt-1">{selectedComponent.name}</h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{selectedComponent.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-4">
                    {selectedComponent.specs && Object.entries(selectedComponent.specs).slice(0, 6).map(([key, value]) => (
                      <div key={key} className="flex items-baseline gap-2 text-sm border-b border-gray-200 pb-1">
                        <span className="capitalize font-medium text-gray-600 min-w-[80px]">{key}:</span>
                        <span className="text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button
                      variant="outline"
                      onClick={(e) => showDetails(e, selectedComponent)}
                      className="h-9 text-sm bg-transparent border border-gray-700 hover:bg-gray-800/50"
                    >
                      <Info className="h-4 w-4 mr-1.5" />
                      Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => removeComponent(currentStepObj.id)}
                      className="h-9 text-sm bg-red-950/50 border border-red-800/30 hover:bg-red-900/50 text-red-100"
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:gap-4 mb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                {selectedComponent ? 'Change Component' : `Select ${currentStepObj.name}`}
              </h3>
              
              {/* Enhanced Filtering and Search Controls */}
              <div className="flex flex-col w-full sm:flex-row sm:w-auto gap-3">
                {/* Search box */}
                <div className="relative w-full sm:w-[220px]">
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {/* Brand filter */}
                  <Select value={selectedBrand || 'all'} onValueChange={(value) => setSelectedBrand(value === 'all' ? null : value)}>
                    <SelectTrigger className="w-full sm:w-[150px] h-8 sm:h-9 text-xs sm:text-sm bg-white border border-gray-300 hover:border-gray-400 text-gray-700">
                      <SelectValue placeholder="Filter by brand" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px] bg-white border-gray-300">
                      <SelectItem value="all">All brands</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Availability filter */}
                  <Select value={availabilityFilter || 'all'} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] h-8 sm:h-9 text-xs sm:text-sm bg-white border border-gray-300 hover:border-gray-400 text-gray-700">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="all">Any Status</SelectItem>
                      <SelectItem value="in-stock">In Stock Only</SelectItem>
                      <SelectItem value="pre-order">Pre-Order Available</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Sort by */}
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-[150px] h-8 sm:h-9 text-xs sm:text-sm bg-white border border-gray-300 hover:border-gray-400 text-gray-700">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedBrand(null);
                      setAvailabilityFilter('all');
                    }} 
                    className="h-8 sm:h-9 text-xs sm:text-sm bg-white border border-gray-300 hover:border-gray-400 text-gray-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Reset Filters
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshComponentData} 
                    className="h-8 sm:h-9 text-xs sm:text-sm bg-white border border-gray-300 hover:border-gray-400 text-gray-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Component dropdown list */}
          <div className="space-y-2 mt-4 -mx-2 sm:mx-0">
            {filteredComponents.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg border border-gray-300 shadow-sm">
                <h3 className="text-lg font-medium text-gray-700">
                  {currentStepObj.id === 'gpu' 
                    ? 'No graphics cards currently available' 
                    : 'No components match your filters'}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {currentStepObj.id === 'gpu' 
                    ? 'Please skip this step - your CPU includes integrated graphics' 
                    : 'Try changing your filter criteria'}
                </p>
                {currentStepObj.id === 'gpu' && (
                  <Button
                    onClick={() => {
                      // Mark GPU as "completed" with a special placeholder value
                      setConfiguration(prev => ({
                        ...prev,
                        gpu: 'skipped'
                      }));
                      // Also add a placeholder in selectedComponents to track that it was skipped
                      setSelectedComponents(prev => ({
                        ...prev,
                        gpu: null
                      }));
                      // Move to next step
                      nextStep();
                      // Show toast
                      toast({
                        title: "Graphics Card Skipped",
                        description: "Using integrated graphics from your CPU.",
                      });
                    }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Skip this step
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredComponents.map(component => {
                  // Check if component is compatible with current selections
                  const isCompatible = isComponentCompatible(component);
                  const isSelected = selectedComponent?.id === component.id;
                  
                  return (
                    <div 
                      key={`${component.id}-${componentVersion}`}
                      className={`relative rounded-xl ${
                        isSelected 
                          ? 'bg-white ring-2 ring-blue-500 shadow-lg transform scale-[1.04]' 
                          : isCompatible 
                            ? component.inventoryStatus === 'out-of-stock' 
                              ? 'bg-white border border-gray-200 shadow-sm opacity-70' 
                              : 'bg-white border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1' 
                            : 'bg-white border border-red-200 shadow-sm'
                      } transition-all overflow-hidden flex flex-col group`}
                    >
                      {/* Component image area */}
                      <div className="aspect-square p-3 sm:p-4 flex items-center justify-center relative">
                        {/* White background for images */}
                        <div className="absolute inset-3 sm:inset-4 rounded-md bg-white"></div>
                        
                        {component.image ? (
                          component.imagesGallery && component.imagesGallery.length > 0 ? (
                            <div className={`w-full h-full relative z-10 ${
                              !isCompatible || component.inventoryStatus === 'out-of-stock' 
                                ? 'opacity-70 grayscale' 
                                : ''
                            }`}>
                              <ImageGallery 
                                images={processGalleryUrls(component.imagesGallery)}
                                mainImage={processImageUrl(component.image)}
                                alt={component.name}
                              />
                            </div>
                          ) : (
                            <img 
                              src={processImageUrl(component.image)} 
                              alt={component.name} 
                              className={`w-full h-full object-contain max-h-[300px] transition-transform duration-500 relative z-10 
                                ${isCompatible && component.inventoryStatus !== 'out-of-stock' 
                                  ? 'group-hover:scale-110' 
                                  : ''
                                }
                                ${!isCompatible || component.inventoryStatus === 'out-of-stock' 
                                  ? 'opacity-70 grayscale' 
                                  : ''
                                }`}
                              onError={(e) => {
                                // If image failed to load, use default
                                console.log('Image failed to load:', component.image);
                                (e.target as HTMLImageElement).src = '/default-component.jpg';
                              }}
                            />
                          )
                        ) : (
                          <div className={`text-7xl relative z-10 transition-transform duration-500 
                            ${isCompatible && component.inventoryStatus !== 'out-of-stock' ? 'group-hover:scale-110' : ''}
                            ${isCompatible ? 'text-gray-500' : 'text-gray-300'}`}>
                            {BUILD_STEPS.find(step => step.id === component.category)?.icon}
                          </div>
                        )}
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1 shadow-md z-20 animate-fadeIn">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        
                        {!isCompatible && (
                          <div className="absolute bottom-2 left-2 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded-md flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Not compatible
                          </div>
                        )}
                      </div>
                      
                      {/* Component info area */}
                      <div className="p-3 sm:p-4 border-t border-gray-100 bg-white flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2 sm:mb-2.5">
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-[10px] sm:text-xs font-medium px-2.5 py-0.5 shadow-sm">
                            {component.brand}
                          </Badge>
                          {/* Price badges removed as requested by client */}
                        </div>
                        
                        <h3 className="font-medium text-xs sm:text-sm line-clamp-1 mb-2 text-gray-800 group-hover:text-blue-700 transition-colors duration-200">{component.name}</h3>
                        
                        {/* Inventory Status Badge */}
                        <div className="mt-2 mb-3">
                          <div 
                            className={`inline-flex items-center rounded-full text-[10px] px-2.5 py-1 font-medium shadow-sm ${
                              component.inventoryStatus === 'in-stock' || component.inStock 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : component.inventoryStatus === 'pre-order'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              component.inventoryStatus === 'in-stock' || component.inStock 
                                ? 'bg-green-500 animate-pulse' 
                                : component.inventoryStatus === 'pre-order'
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            }`}></span>
                            {component.inventoryStatus === 'in-stock' ? 'In Stock' : 
                             component.inventoryStatus === 'out-of-stock' ? 'Out of Stock' : 
                             component.inventoryStatus === 'pre-order' ? 'Pre Order' :
                             component.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-3 sm:pt-4 flex gap-2 sm:gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => showDetails(e, component)}
                            className="h-8 sm:h-9 flex-1 text-[10px] sm:text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm rounded-md transition-all duration-200 hover:-translate-y-0.5"
                          >
                            <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 text-blue-600" />
                            Details
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => isCompatible && component.inventoryStatus !== 'out-of-stock' && selectComponent(component)}
                            disabled={!isCompatible || component.inventoryStatus === 'out-of-stock'}
                            className={`h-8 sm:h-9 flex-1 text-[10px] sm:text-xs rounded-md shadow-md transition-all duration-200 hover:-translate-y-0.5 ${
                              isSelected
                                ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 font-medium'
                                : isCompatible && component.inventoryStatus !== 'out-of-stock'
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 font-medium'
                                  : 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {isSelected ? (
                              <span className="flex items-center justify-center">
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                Selected
                              </span>
                            ) : component.inventoryStatus === 'out-of-stock' ? (
                              <span className="flex items-center justify-center">
                                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                Out of Stock
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                Select
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render build summary for review step
  const renderBuildSummary = () => {
    // Use componentVersion to ensure this re-runs when components are updated
    const _ = componentVersion; // eslint-disable-line no-unused-vars
    
    // Check if all required components are selected (or in case of GPU, it could be 'skipped')
    const isBuildComplete = BUILD_STEPS
      .filter(step => step.isRequired)
      .every(step => {
        // For GPU, allow either a component or 'skipped'
        if (step.id === 'gpu') {
          return Boolean(configuration[step.id]) || configuration[step.id] === 'skipped';
        }
        // For other components, must have a value
        return Boolean(configuration[step.id]);
      });
      
    return (
      <div className="space-y-6 p-2 sm:p-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-800">Build Summary</h3>
          
          {/* Status alerts */}
          {!compatibility.compatible && (
            <Alert variant="destructive" className="bg-red-950/30 border border-red-500/30 text-red-200 p-3 sm:p-4">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <AlertTitle className="font-medium sm:text-base">Compatibility Issues</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-xs sm:text-sm mt-2 sm:mt-3 text-red-200/90 space-y-1 sm:space-y-2">
                  {compatibility.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {!isBuildComplete && (
            <Alert variant="destructive" className="bg-amber-950/30 border border-amber-500/30 text-amber-200 p-3 sm:p-4">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <AlertTitle className="font-medium sm:text-base">Incomplete Build</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm text-amber-200/90 mt-1">
                Your build is missing required components. Please select them before proceeding.
              </AlertDescription>
            </Alert>
          )}
          
          {compatibility.compatible && isBuildComplete && (
            <Alert className="bg-green-950/30 border border-green-500/30 text-green-200 p-3 sm:p-4">
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
              <AlertTitle className="font-medium sm:text-base">Build Ready!</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm text-green-200/90 mt-1">
                Your PC build is compatible and ready to go. You can now add it to your cart.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Component list */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-md">
          <div className="py-4 px-5 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-500">
            <h4 className="font-medium text-white flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Selected Components
            </h4>
          </div>
          
          <div className="divide-y divide-gray-200">
            {BUILD_STEPS.filter(step => step.id !== 'review').map(step => {
              const component = selectedComponents[step.id];
              const stepIndex = BUILD_STEPS.findIndex(s => s.id === step.id);
              
              return (
                <div 
                  key={step.id} 
                  className={`p-4 sm:p-5 ${!component && step.isRequired ? 'bg-amber-50' : 'bg-white'} transition-colors hover:bg-gray-50`}
                >
                  <div className="flex gap-5">
                    {/* Component image or icon */}
                    <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-3 shadow-sm border border-gray-200 relative overflow-hidden group">
                      {/* White background */}
                      <div className="absolute inset-0 bg-white"></div>
                      
                      {component && component.image ? (
                        component.imagesGallery && component.imagesGallery.length > 0 ? (
                          <div className="relative z-10 w-full h-full">
                            <ImageGallery 
                              images={component.imagesGallery}
                              mainImage={component.image}
                              alt={component.name}
                            />
                          </div>
                        ) : (
                          <img 
                            src={component.image} 
                            alt={component.name} 
                            className="w-full h-full object-contain mix-blend-normal relative z-10 transition-transform duration-500 group-hover:scale-110"
                          />
                        )
                      ) : (
                        <div className="text-5xl sm:text-6xl text-gray-300 relative z-10">
                          {step.icon}
                        </div>
                      )}
                    </div>
                    
                    {/* Component details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center mb-2">
                          <span className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            {step.icon && <span className="text-blue-600">{step.icon}</span>}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-800">
                            {step.name}
                            {step.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                        </div>
                        
                        {!component && step.isRequired && (
                          <div className="inline-flex items-center rounded-full text-[10px] px-2.5 py-1 font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                            <AlertTriangle className="h-3 w-3 mr-1.5" />
                            Required
                          </div>
                        )}
                      </div>
                      
                      {/* Conditional content based on component selection */}
                      {step.id === 'gpu' && (configuration['gpu'] === 'skipped' || !component) ? (
                        <div className="mt-1">
                          <div className="text-xs text-muted-foreground">Using CPU integrated graphics</div>
                          <div className="flex justify-between items-center gap-3 mt-2">
                            <Badge variant="outline" className="bg-green-950/30 text-green-300 border-green-700/50 text-[10px]">
                              <Check className="h-2.5 w-2.5 mr-1" />
                              Skipped
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setCurrentStep(stepIndex)}
                              className="h-7 text-[10px] px-2 bg-transparent border-accent/30 hover:border-accent/70 text-accent"
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Change
                            </Button>
                          </div>
                        </div>
                      ) : component ? (
                        <div className="mt-1">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                              <h4 className="text-sm sm:text-base font-medium truncate text-gray-800">{component.name}</h4>
                              {/* Individual price badges removed as requested by client */}
                            </div>
                            
                            {/* Inventory status badge */}
                            <div>
                              <Badge 
                                variant={
                                  component.inventoryStatus === 'in-stock' ? 'success' : 
                                  component.inventoryStatus === 'out-of-stock' ? 'destructive' : 
                                  'outline'
                                }
                                className="text-[9px] mt-1"
                              >
                                {component.inventoryStatus === 'in-stock' ? 'In Stock' : 
                                 component.inventoryStatus === 'out-of-stock' ? 'Out of Stock' : 
                                 component.inventoryStatus === 'pre-order' ? 'Pre Order' :
                                 component.inStock ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-[10px] sm:text-xs text-gray-600 mt-1">
                            <span className="mr-2">{component.brand}</span>
                            
                            {component.specs && Object.entries(component.specs as Record<string, any>).slice(0, 1).map(([key, value]) => (
                              <span key={key} className="first:after:content-none after:content-['•'] after:mx-1.5 before:content-none">
                                <span className="capitalize">{key}:</span> {String(value).length > 15 ? String(value).substring(0, 15) + '...' : value}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-end gap-2 mt-1.5">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => showDetails(e, component)}
                              title="View details"
                              className="h-7 w-7 p-0 rounded-full"
                            >
                              <Info className="h-3.5 w-3.5 text-accent" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setCurrentStep(stepIndex)}
                              className="h-7 text-[10px] px-2 bg-transparent border-accent/30 hover:border-accent/70 text-accent"
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Change
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center gap-2 mt-2">
                          <div className="text-xs text-muted-foreground/70">
                            {step.isRequired ? 'Required - Not Selected' : 'Optional - Not Selected'}
                          </div>
                          <Button 
                            variant="outline"  
                            onClick={() => setCurrentStep(stepIndex)}
                            className="h-7 text-[10px] px-3 py-0 bg-accent/10 border-accent/30 hover:border-accent text-accent"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Select
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Performance Estimator */}
        {(selectedComponents.cpu || selectedComponents.gpu) && (
          <PerformanceEstimator 
            components={{
              cpu: selectedComponents.cpu?.name,
              gpu: selectedComponents.gpu?.name,
              ram: selectedComponents.memory?.name,
              storage: selectedComponents.storage?.name
            }} 
          />
        )}
        
        {/* Price and action - enhanced with advanced styling */}
        <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center p-5 border-b border-gray-300 bg-gradient-to-r from-white via-gray-50 to-white">
            <div className="flex items-center">
              <CircleDollarSign className="h-5 w-5 text-primary mr-2" />
              <div className="text-lg font-medium text-gray-800">Build Total</div>
            </div>
            <div key={`total-price-${componentVersion}`}> {/* Key to force re-render when version changes */}
              <div className="flex flex-col items-end">
                <div className="text-xs text-gray-500 mb-0.5">Total Price:</div>
                <div className="text-2xl font-bold text-primary">
                  £{totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white flex flex-col gap-3">
            <Button 
              disabled={!isBuildComplete || !compatibility.compatible}
              className="w-full py-4 h-auto text-base bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white font-semibold shadow-md rounded-md transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add PC to Cart
            </Button>
            
            {(!isBuildComplete || !compatibility.compatible) && (
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <p className="text-xs text-center text-gray-600 flex items-center justify-center">
                  <Info className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                  {!isBuildComplete 
                    ? 'Please select all required components to continue.' 
                    : 'Please resolve compatibility issues before adding to cart.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Total price banner component
  const TotalPriceBanner = () => (
    <div className="sticky top-0 z-20 w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-xl py-4 mb-5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -left-20 top-10 w-56 h-56 bg-white rounded-full filter blur-2xl"></div>
        <div className="absolute -right-20 -bottom-20 w-56 h-56 bg-blue-300 rounded-full filter blur-2xl"></div>
      </div>
      
      <div className="container mx-auto flex justify-between items-center px-4 relative z-10">
        <div className="flex items-center">
          <div className="flex justify-center items-center bg-blue-500 bg-opacity-30 border border-blue-400 border-opacity-30 w-10 h-10 rounded-full mr-3 shadow-inner">
            <CircleDollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Build Price</h3>
            <p className="text-blue-100 text-xs opacity-80 hidden sm:block">Configure your perfect PC</p>
          </div>
        </div>
        
        <div className="flex items-center" key={`total-price-banner-${componentVersion}`}>
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-blue-100 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            
            <div className="relative bg-white px-6 py-3 rounded-lg border border-blue-200 shadow-lg">
              <span className="text-sm text-gray-500 mr-2">Total:</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-700">£{totalPrice.toFixed(2)}</span>
              <span className="ml-1.5 text-xs text-gray-400">{Object.keys(selectedComponents).length > 0 ? Object.keys(selectedComponents).length + ' items' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 bg-white">
      {/* Total Price Banner - always visible */}
      <TotalPriceBanner />
      
      {/* Component Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 w-[95vw] sm:w-auto bg-white">
          
          {/* Component image gallery at the top of dialog */}
          {detailComponent?.image && (
            <div className="w-full">
              {detailComponent.imagesGallery && detailComponent.imagesGallery.length > 0 ? (
                <div className="relative border-b border-gray-300">
                  <ImageGallery
                    images={detailComponent.imagesGallery}
                    mainImage={detailComponent.image}
                    alt={detailComponent.name}
                    className="aspect-square sm:aspect-[16/9] max-h-[400px]"
                  />
                </div>
              ) : (
                <div className="aspect-square sm:aspect-[16/9] max-h-[400px] w-full flex items-center justify-center overflow-hidden border-b border-gray-300">
                  <img 
                    src={detailComponent.image} 
                    alt={detailComponent.name} 
                    className="w-full h-full object-contain mix-blend-normal"
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogHeader className="border-b border-gray-300 pb-3 pt-5 px-4 sm:px-6 sm:pt-4 bg-white">
            <DialogTitle className="text-base flex flex-wrap items-center gap-1 text-gray-800">
              <span className="mr-auto">{detailComponent?.name}</span>
              <span className="text-xs text-gray-500">{detailComponent?.brand}</span>
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-gray-600">
              {detailComponent?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-3 px-4 sm:px-6 space-y-3 sm:space-y-4">
            
            {/* Stock status only (price removed) - with white background */}
            <div className="flex justify-between items-center py-3 border-b border-gray-300 bg-white">
              <span className="font-semibold text-gray-700">Stock Status</span>
              <Badge 
                variant={
                  detailComponent?.inventoryStatus === 'in-stock' ? 'success' : 
                  detailComponent?.inventoryStatus === 'out-of-stock' ? 'destructive' : 
                  detailComponent?.inventoryStatus === 'pre-order' ? 'preorder' :
                  detailComponent?.inStock ? 'success' : 'destructive'
                }
                className="text-xs"
              >
                {detailComponent?.inventoryStatus === 'in-stock' ? 'In Stock' : 
                 detailComponent?.inventoryStatus === 'out-of-stock' ? 'Out of Stock' : 
                 detailComponent?.inventoryStatus === 'pre-order' ? 'Pre Order' :
                 detailComponent?.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            
            {/* Specifications - updated with white backgrounds */}
            <div className="bg-white pt-2">
              {detailComponent?.specsHtml ? (
                <div className="prose max-w-none text-sm text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: detailComponent.specsHtml }} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-3 text-sm">
                  {detailComponent?.specs && Object.entries(detailComponent.specs).map(([key, value]) => (
                    <div key={key} className="flex items-baseline justify-between border-b border-gray-200 pb-1 sm:pb-1">
                      <span className="font-medium text-gray-600 capitalize">{key}:</span>
                      <span className="text-right break-words max-w-[60%] text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Action buttons - with white background */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 mt-3 border-t border-gray-300 bg-white">
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsOpen(false)}
                className="sm:order-1 text-xs h-9 border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Close
              </Button>
              
              {/* If the detail component matches a currently selected component, show remove option */}
              {detailComponent && selectedComponents[detailComponent.category]?.id === detailComponent.id ? (
                <Button 
                  variant="destructive"
                  onClick={() => {
                    removeComponent(detailComponent.category);
                    setIsDetailsOpen(false);
                  }}
                  className="sm:order-2 text-xs h-9 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Remove Component
                </Button>
              ) : (
                // Otherwise show select option (if component is compatible)
                detailComponent && (
                  <Button 
                    onClick={() => {
                      if (isComponentCompatible(detailComponent)) {
                        selectComponent(detailComponent);
                        setIsDetailsOpen(false);
                      } else {
                        toast({
                          title: "Compatibility Issue",
                          description: "This component is not compatible with your current build.",
                          variant: "destructive"
                        });
                      }
                    }}
                    disabled={detailComponent && !isComponentCompatible(detailComponent)}
                    className={`sm:order-2 text-xs h-9 ${
                      detailComponent && !isComponentCompatible(detailComponent) 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                        : 'bg-accent hover:bg-accent/90 text-white'
                    }`}
                  >
                    Select Component
                  </Button>
                )
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg shadow-lg relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -right-10 top-5 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute -left-16 -bottom-8 w-40 h-40 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">Build Your Custom PC</h2>
              <p className="text-blue-100">Follow our step-by-step process to create your perfect custom PC</p>
            </div>
            
            <div className="flex items-center gap-2 mt-2 sm:mt-0 relative z-10 group">
              {/* Fancy glow effect behind the dropdown */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-200"></div>
              
              <Select 
                value={currentStep.toString()} 
                onValueChange={(value) => {
                  const stepIndex = parseInt(value);
                  // If trying to go to review, check if all required components are selected
                  if (BUILD_STEPS[stepIndex].id === 'review') {
                    // Filter for only required components and exclude the review step
                    const requiredComponents = BUILD_STEPS.filter(s => s.isRequired && s.id !== 'review');
                    // Check if all required components are selected
                    const allSelected = requiredComponents.every(s => {
                      // For GPU, allow either a component or 'skipped'
                      if (s.id === 'gpu') {
                        return Boolean(configuration[s.id]) || configuration[s.id] === 'skipped';
                      }
                      // For other components, must have a value
                      return Boolean(configuration[s.id]);
                    });
                    
                    if (allSelected) {
                      setCurrentStep(stepIndex);
                    } else {
                      // Use the imported toast function directly
                      toast({
                        title: "Cannot go to review",
                        description: "Please select all required components first.",
                        variant: "destructive"
                      });
                    }
                  } else {
                    setCurrentStep(stepIndex);
                  }
                }}
              >
                <SelectTrigger className="w-[200px] h-10 bg-white border-0 shadow-lg rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-800 relative z-10">
                  <div className="flex items-center">
                    <span className="mr-2 text-blue-600">{BUILD_STEPS[currentStep].icon}</span>
                    <SelectValue placeholder="Jump to step" className="text-gray-800">
                      {BUILD_STEPS[currentStep].name}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-gray-50 border border-gray-200 shadow-xl rounded-lg p-1">
                  {BUILD_STEPS.map((step, index) => {
                    // Check if step is completed - either passed or selected, or for GPU if it's been skipped
                    const isCompleted = index < currentStep || 
                      (step.id === 'gpu' ? Boolean(configuration[step.id]) || configuration[step.id] === 'skipped' : Boolean(configuration[step.id]));
                    
                    return (
                      <SelectItem 
                        key={step.id} 
                        value={index.toString()}
                        disabled={step.id === 'review' && !BUILD_STEPS.filter(s => s.isRequired && s.id !== 'review').every(s => configuration[s.id])}
                        className="text-gray-800"
                      >
                        <div className="flex items-center gap-2 py-1 px-1 rounded-md transition-colors hover:bg-blue-50">
                          <div className={`flex items-center justify-center h-7 w-7 rounded-full ${
                            currentStep === index 
                              ? 'bg-blue-100 text-blue-600' 
                              : isCompleted && step.id !== 'review'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {step.icon}
                          </div>
                          <span className={`${currentStep === index ? 'font-medium text-blue-700' : 'text-gray-800'}`}>
                            {step.name}
                          </span>
                          {isCompleted && step.id !== 'review' && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 ml-auto">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Step progress indicators removed */}
          
          {/* Mobile progress indicator removed */}
        </div>
        
        {/* Current step */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-2 pt-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
              <div>
                <CardTitle className="text-lg flex items-center text-gray-800">
                  {getCurrentStep().icon && <span className="mr-2 text-accent">{getCurrentStep().icon}</span>}
                  {getCurrentStep().name}
                </CardTitle>
                <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">
                  {getCurrentStep().description}
                </p>
              </div>
              
              <div className="flex justify-end">
                {Object.keys(selectedComponents).length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetConfiguration} 
                    className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 h-8 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Reset Build
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-2 px-0 sm:px-6">
            {renderComponentSelection()}
          </CardContent>
          
          <CardFooter className="flex justify-between py-4 border-t border-gray-300 bg-white">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-white hover:bg-gray-100 h-9 text-xs border-gray-300 text-gray-600"
              size="sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Previous
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={currentStep === BUILD_STEPS.length - 1 || 
                (getCurrentStep().isRequired && 
                  // Special handling for GPU step
                  (getCurrentStep().id === 'gpu' 
                    ? !configuration[getCurrentStep().id] && configuration[getCurrentStep().id] !== 'skipped'
                    : !configuration[getCurrentStep().id]))}
              className="bg-blue-600 hover:bg-blue-700 h-9 text-xs text-white"
              size="sm"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}