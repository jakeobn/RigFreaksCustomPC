import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Cpu, 
  HardDrive, 
  MonitorSmartphone, 
  Fan, 
  Box, 
  Zap, 
  Server, 
  MemoryStick, 
  ChevronRight, 
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Types
interface Component {
  id: string;
  name: string;
  price: number;
  description: string;
  brand: string;
  image?: string;
  specs: Record<string, string | number>;
  category: string;
  compatibility?: string[];
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isRequired: boolean;
}

interface PCConfiguration {
  [category: string]: string | null;
}

// Mock data - replace with API calls in production
const COMPONENT_CATEGORIES: ComponentCategory[] = [
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
    id: 'memory',
    name: 'Memory (RAM)',
    icon: <MemoryStick className="h-6 w-6" />,
    description: 'Temporary storage for data that your CPU needs to access quickly.',
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
    id: 'power',
    name: 'Power Supply',
    icon: <Zap className="h-6 w-6" />,
    description: 'Provides the electricity needed to run all your components.',
    isRequired: true
  },
  {
    id: 'cooling',
    name: 'CPU Cooling',
    icon: <Fan className="h-6 w-6" />,
    description: 'Keeps your CPU cool under heavy workloads.',
    isRequired: true
  }
];

// Sample components - replace with API data
const SAMPLE_COMPONENTS: Record<string, Component[]> = {
  case: [
    {
      id: 'case-hyte-y70',
      name: 'HYTE Y70 Touch Tempered Glass Case - Black',
      price: 249.99,
      description: 'Premium tempered glass case with touch controls and RGB lighting',
      brand: 'HYTE',
      image: 'https://example.com/case-hyte-y70.jpg',
      specs: {
        formFactor: 'Mid Tower',
        dimensions: '490mm x 285mm x 490mm',
        maxGPULength: '422mm',
        maxCPUHeight: '165mm'
      },
      category: 'case',
      compatibility: ['atx', 'micro-atx', 'mini-itx']
    },
    {
      id: 'case-phanteks-p500a',
      name: 'Phanteks P500A Digital RGB Case',
      price: 149.99,
      description: 'High airflow mesh front panel case with excellent cooling performance',
      brand: 'Phanteks',
      image: 'https://example.com/case-phanteks-p500a.jpg',
      specs: {
        formFactor: 'Mid Tower',
        dimensions: '465mm x 230mm x 470mm',
        maxGPULength: '435mm',
        maxCPUHeight: '190mm'
      },
      category: 'case',
      compatibility: ['atx', 'micro-atx', 'mini-itx']
    }
  ],
  cpu: [
    {
      id: 'cpu-amd-7900x',
      name: 'AMD Ryzen 9 7900X',
      price: 399.99,
      description: '12-core, 24-thread processor with high clock speeds for gaming and content creation',
      brand: 'AMD',
      image: 'https://example.com/cpu-amd-7900x.jpg',
      specs: {
        cores: 12,
        threads: 24,
        baseClock: '4.7 GHz',
        boostClock: '5.6 GHz',
        socket: 'AM5',
        tdp: '170W'
      },
      category: 'cpu',
      compatibility: ['am5']
    },
    {
      id: 'cpu-intel-13700k',
      name: 'Intel Core i7-13700K',
      price: 379.99,
      description: '16-core hybrid processor with excellent gaming and multitasking performance',
      brand: 'Intel',
      image: 'https://example.com/cpu-intel-13700k.jpg',
      specs: {
        cores: 16,
        threads: 24,
        baseClock: '3.4 GHz',
        boostClock: '5.4 GHz',
        socket: 'LGA 1700',
        tdp: '125W'
      },
      category: 'cpu',
      compatibility: ['lga1700']
    }
  ],
  // Add other components as needed...
};

// Helper function to process image URLs
const processImageUrl = (image: string): string => {
  // Implement your logic here to handle local image URLs
  // This is a placeholder, replace with your actual implementation
  return image;
};

// Component function
export function PCBuilder() {
  const [activeCategory, setActiveCategory] = useState<string>('case');
  const [configuration, setConfiguration] = useState<PCConfiguration>({});
  const [selectedComponents, setSelectedComponents] = useState<Record<string, Component | null>>({});
  const [compatibility, setCompatibility] = useState<{ compatible: boolean; issues: string[] }>({ 
    compatible: true, 
    issues: [] 
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [buildProgress, setBuildProgress] = useState<number>(0);

  // Calculate build progress
  useEffect(() => {
    const requiredCategories = COMPONENT_CATEGORIES.filter(cat => cat.isRequired).length;
    const selectedCount = Object.values(configuration).filter(Boolean).length;
    const progress = requiredCategories > 0 ? (selectedCount / requiredCategories) * 100 : 0;
    setBuildProgress(progress);
  }, [configuration]);

  // Calculate total price
  useEffect(() => {
    const price = Object.values(selectedComponents).reduce((sum, component) => {
      return sum + (component?.price || 0);
    }, 0);
    setTotalPrice(price);
  }, [selectedComponents]);

  // Check compatibility whenever components change
  useEffect(() => {
    // Simplified compatibility check - would be more complex in production
    const issues: string[] = [];

    // Example: Check if CPU and motherboard sockets match
    const cpu = selectedComponents['cpu'];
    const mobo = selectedComponents['motherboard'];

    if (cpu && mobo) {
      const cpuSocket = cpu.specs.socket as string;
      const moboSocket = mobo.specs.socket as string;

      if (cpuSocket !== moboSocket) {
        issues.push(`CPU socket (${cpuSocket}) is not compatible with motherboard socket (${moboSocket})`);
      }
    }

    // More compatibility checks would go here...

    setCompatibility({
      compatible: issues.length === 0,
      issues
    });
  }, [selectedComponents]);

  // Select a component
  const selectComponent = (component: Component) => {
    setConfiguration(prev => ({
      ...prev,
      [component.category]: component.id
    }));

    setSelectedComponents(prev => ({
      ...prev,
      [component.category]: component
    }));

    toast({
      title: "Component Added",
      description: `${component.name} has been added to your build.`,
    });
  };

  // Remove a component
  const removeComponent = (category: string) => {
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
      description: `The ${COMPONENT_CATEGORIES.find(cat => cat.id === category)?.name || category} has been removed from your build.`,
    });
  };

  // Reset configuration
  const resetConfiguration = () => {
    setConfiguration({});
    setSelectedComponents({});

    toast({
      title: "Build Reset",
      description: "Your PC configuration has been reset.",
    });
  };

  // Get component list for current category
  const getComponentList = () => {
    return SAMPLE_COMPONENTS[activeCategory] || [];
  };

  // Render the component selection for current category
  const renderComponentSelection = () => {
    const components = getComponentList();

    if (components.length === 0) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          No components available for this category.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {components.map(component => (
          <Card key={component.id} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {component.image ? (
                <img 
                  src={component.image} 
                  alt={component.name} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-4xl text-muted-foreground">
                  {COMPONENT_CATEGORIES.find(cat => cat.id === component.category)?.icon}
                </div>
              )}
            </div>

            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{component.name}</CardTitle>
                <Badge>{component.brand}</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">{component.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(component.specs).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span className="font-medium capitalize">{key}:</span>
                    <span className="ml-1">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="font-bold">${component.price.toFixed(2)}</div>

              <Button onClick={() => selectComponent(component)}>
                <Plus className="h-4 w-4 mr-2" />
                Select
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - component categories */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Build Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={buildProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-sm">
                <span>{Math.round(buildProgress)}% Complete</span>
                <span className="text-muted-foreground">
                  {Object.values(configuration).filter(Boolean).length} / {COMPONENT_CATEGORIES.filter(cat => cat.isRequired).length} Components
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <CardTitle>Component Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-px mt-2">
                {COMPONENT_CATEGORIES.map(category => {
                  const isSelected = category.id === activeCategory;
                  const hasComponent = Boolean(configuration[category.id]);

                  return (
                    <button
                      key={category.id}
                      className={`w-full flex items-center p-3 transition-colors text-left
                        ${isSelected 
                          ? 'bg-primary text-primary-foreground' 
                          : hasComponent 
                            ? 'bg-muted hover:bg-primary/20' 
                            : 'hover:bg-muted'
                        }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <div className={`mr-3 ${isSelected ? 'text-primary-foreground' : ''}`}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{category.name}</div>
                          {hasComponent && (
                            <Badge variant="outline" className="ml-2">Selected</Badge>
                          )}
                        </div>
                        {isSelected && (
                          <p className="text-xs mt-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 ml-2 opacity-50" />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content - component selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>
                  Select {COMPONENT_CATEGORIES.find(cat => cat.id === activeCategory)?.name}
                </CardTitle>

                <Tabs defaultValue="all" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="compatible">Compatible</TabsTrigger>
                    <TabsTrigger value="price">Price</TabsTrigger>
                    <TabsTrigger value="rating">Rating</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            {renderComponentSelection()}
          </Card>

          {/* Selected components summary */}
          <Card>
            <CardHeader>
              <CardTitle>Build Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(selectedComponents).length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No components selected yet. Start by selecting components from the categories on the left.
                </div>
              ) : (
                <div className="space-y-4">
                  {!compatibility.compatible && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Compatibility Issues</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                          {compatibility.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    {COMPONENT_CATEGORIES.map(category => {
                      const component = selectedComponents[category.id];

                      if (!component) return null;

                      return (
                        <div key={category.id} className="flex items-center p-3 border rounded-md">
                          <div className="flex-shrink-0 mr-3">
                            {category.icon}
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{component.name}</div>
                                <div className="text-xs text-muted-foreground">{category.name}</div>
                              </div>
                              <div className="font-bold">£{component.price.toFixed(2)}</div>
                            </div>
                          </div>

                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="ml-2"
                            onClick={() => removeComponent(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <div className="font-medium">Total Price:</div>
                    <div className="text-xl font-bold">£{totalPrice.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetConfiguration}>
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Build
              </Button>

              <Button disabled={Object.keys(selectedComponents).length === 0 || !compatibility.compatible}>
                Continue to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}