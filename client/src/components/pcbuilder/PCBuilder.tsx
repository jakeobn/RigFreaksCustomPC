import React, { useState, useEffect } from "react";
import ComponentSelector from "./ComponentSelector";
import BuildSummary from "./BuildSummary";
import PerformanceEstimator from "@/components/performance/PerformanceEstimator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Zap, Cpu, Monitor, HardDrive, Server } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { PCComponentData, checkComponentCompatibility, allComponents } from "@/lib/componentData";

// Create some sample components for prebuilt configurations
const sampleComponents = {
  cpu: {
    i9: {
      id: "cpu-i9-13900k",
      name: "Intel Core i9-13900K",
      type: "cpu",
      price: "599.99",
      specs: {
        cores: "24 Cores (8P+16E)",
        frequency: "5.8 GHz Max",
        socket: "LGA 1700"
      },
      imageUrl: "/assets/components/cpu-intel-i9.jpg",
      brand: "Intel",
      inStock: true,
      rating: 4.9,
      tdp: 125
    },
    ryzen9: {
      id: "cpu-ryzen9-7950x",
      name: "AMD Ryzen 9 7950X",
      type: "cpu",
      price: "579.99",
      specs: {
        cores: "16 Cores / 32 Threads",
        frequency: "5.7 GHz Max",
        socket: "AM5"
      },
      imageUrl: "/assets/components/cpu-amd-ryzen9.jpg",
      brand: "AMD",
      inStock: true,
      rating: 4.8,
      tdp: 170
    },
    ryzen7: {
      id: "cpu-ryzen7-7700x",
      name: "AMD Ryzen 7 7700X",
      type: "cpu",
      price: "349.99",
      specs: {
        cores: "8 Cores / 16 Threads",
        frequency: "5.4 GHz Max",
        socket: "AM5"
      },
      imageUrl: "/assets/components/cpu-amd-ryzen7.jpg",
      brand: "AMD",
      inStock: true,
      rating: 4.7,
      tdp: 105
    },
    i5: {
      id: "cpu-i5-13600k",
      name: "Intel Core i5-13600K",
      type: "cpu",
      price: "299.99",
      specs: {
        cores: "14 Cores (6P+8E)",
        frequency: "5.1 GHz Max",
        socket: "LGA 1700"
      },
      imageUrl: "/assets/components/cpu-intel-i5.jpg",
      brand: "Intel",
      inStock: true,
      rating: 4.7,
      tdp: 125
    }
  },

  ram: {
    ram32: {
      id: "ram-32gb-ddr5",
      name: "32GB DDR5-6000 RGB RAM",
      type: "ram",
      price: "189.99",
      specs: {
        capacity: "32GB (2x16GB)",
        speed: "6000MHz",
        type: "DDR5"
      },
      imageUrl: "/assets/components/ram-32gb.jpg",
      brand: "Corsair",
      inStock: true,
      rating: 4.8
    },
    ram64: {
      id: "ram-64gb-ddr5",
      name: "64GB DDR5-5600 Pro RAM",
      type: "ram",
      price: "349.99",
      specs: {
        capacity: "64GB (2x32GB)",
        speed: "5600MHz",
        type: "DDR5"
      },
      imageUrl: "/assets/components/ram-64gb.jpg",
      brand: "G.Skill",
      inStock: true,
      rating: 4.9
    },
    ram16: {
      id: "ram-16gb-ddr5",
      name: "16GB DDR5-5200 RAM",
      type: "ram",
      price: "119.99",
      specs: {
        capacity: "16GB (2x8GB)",
        speed: "5200MHz",
        type: "DDR5"
      },
      imageUrl: "/assets/components/ram-16gb.jpg",
      brand: "Kingston",
      inStock: true,
      rating: 4.7
    }
  },
  storage: {
    storage2tb: {
      id: "storage-2tb-nvme",
      name: "2TB NVMe Gen4 SSD",
      type: "storage",
      price: "229.99",
      specs: {
        capacity: "2TB",
        type: "NVMe PCIe 4.0",
        readSpeed: "7000 MB/s"
      },
      imageUrl: "/assets/components/storage-2tb.jpg",
      brand: "Samsung",
      inStock: true,
      rating: 4.9
    },
    storage4tb: {
      id: "storage-4tb-nvme",
      name: "4TB NVMe Gen4 SSD",
      type: "storage",
      price: "429.99",
      specs: {
        capacity: "4TB",
        type: "NVMe PCIe 4.0",
        readSpeed: "7300 MB/s"
      },
      imageUrl: "/assets/components/storage-4tb.jpg",
      brand: "WD Black",
      inStock: true,
      rating: 4.9
    },
    storage1tb: {
      id: "storage-1tb-nvme",
      name: "1TB NVMe Gen4 SSD",
      type: "storage",
      price: "129.99",
      specs: {
        capacity: "1TB",
        type: "NVMe PCIe 4.0",
        readSpeed: "6600 MB/s"
      },
      imageUrl: "/assets/components/storage-1tb.jpg",
      brand: "Crucial",
      inStock: true,
      rating: 4.8
    },
    storage512gb: {
      id: "storage-512gb-nvme",
      name: "512GB NVMe Gen4 SSD",
      type: "storage",
      price: "79.99",
      specs: {
        capacity: "512GB",
        type: "NVMe PCIe 4.0",
        readSpeed: "5000 MB/s"
      },
      imageUrl: "/assets/components/storage-512gb.jpg",
      brand: "Crucial",
      inStock: true,
      rating: 4.7
    }
  },
  motherboard: {
    z790: {
      id: "mb-z790-gaming",
      name: "Z790 Gaming Motherboard",
      type: "motherboard",
      price: "349.99",
      specs: {
        socket: "LGA 1700",
        formFactor: "ATX",
        ramType: "DDR5"
      },
      imageUrl: "/assets/components/mb-z790.jpg",
      brand: "ASUS",
      inStock: true,
      rating: 4.8
    },
    x670: {
      id: "mb-x670-creator",
      name: "X670E Creator Motherboard",
      type: "motherboard",
      price: "449.99",
      specs: {
        socket: "AM5",
        formFactor: "ATX",
        ramType: "DDR5"
      },
      imageUrl: "/assets/components/mb-x670.jpg",
      brand: "MSI",
      inStock: true,
      rating: 4.9
    },
    b650: {
      id: "mb-b650-gaming",
      name: "B650 Gaming Motherboard",
      type: "motherboard",
      price: "229.99",
      specs: {
        socket: "AM5",
        formFactor: "ATX",
        ramType: "DDR5"
      },
      imageUrl: "/assets/components/mb-b650.jpg",
      brand: "Gigabyte",
      inStock: true,
      rating: 4.7
    },
    b660: {
      id: "mb-b660-gaming",
      name: "B660 Gaming Motherboard",
      type: "motherboard",
      price: "179.99",
      specs: {
        socket: "LGA 1700",
        formFactor: "ATX",
        ramType: "DDR4"
      },
      imageUrl: "/assets/components/mb-b660.jpg",
      brand: "ASRock",
      inStock: true,
      rating: 4.6
    }
  },
  psu: {
    psu1000w: {
      id: "psu-1000w-platinum",
      name: "1000W Platinum Power Supply",
      type: "psu",
      price: "249.99",
      specs: {
        wattage: "1000W",
        efficiency: "80+ Platinum",
        modularity: "Full"
      },
      imageUrl: "/assets/components/psu-1000w.jpg",
      brand: "Corsair",
      inStock: true,
      rating: 4.9,
      wattage: 1000
    },
    psu850w: {
      id: "psu-850w-gold",
      name: "850W Gold Power Supply",
      type: "psu",
      price: "159.99",
      specs: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modularity: "Full"
      },
      imageUrl: "/assets/components/psu-850w.jpg",
      brand: "EVGA",
      inStock: true,
      rating: 4.8,
      wattage: 850
    },
    psu750w: {
      id: "psu-750w-gold",
      name: "750W Gold Power Supply",
      type: "psu",
      price: "129.99",
      specs: {
        wattage: "750W",
        efficiency: "80+ Gold",
        modularity: "Full"
      },
      imageUrl: "/assets/components/psu-750w.jpg",
      brand: "Seasonic",
      inStock: true,
      rating: 4.8,
      wattage: 750
    },
    psu650w: {
      id: "psu-650w-bronze",
      name: "650W Bronze Power Supply",
      type: "psu",
      price: "79.99",
      specs: {
        wattage: "650W",
        efficiency: "80+ Bronze",
        modularity: "Semi"
      },
      imageUrl: "/assets/components/psu-650w.jpg",
      brand: "Thermaltake",
      inStock: true,
      rating: 4.6,
      wattage: 650
    }
  },
  case: {
    phantomElite: {
      id: "case-phantom-elite",
      name: "Phantom Elite RGB Case",
      type: "case",
      price: "199.99",
      specs: {
        formFactor: "ATX Full Tower",
        material: "Tempered Glass & Steel"
      },
      imageUrl: "/assets/components/case-phantom.jpg",
      brand: "NZXT",
      inStock: true,
      rating: 4.9
    },
    eclipse: {
      id: "case-eclipse-mid",
      name: "Eclipse Mid Tower RGB",
      type: "case",
      price: "149.99",
      specs: {
        formFactor: "ATX Mid Tower",
        material: "Tempered Glass & Steel"
      },
      imageUrl: "/assets/components/case-eclipse.jpg",
      brand: "Phanteks",
      inStock: true,
      rating: 4.8
    },
    creator: {
      id: "case-creator-pro",
      name: "Creator Pro Silent",
      type: "case",
      price: "179.99",
      specs: {
        formFactor: "ATX Full Tower",
        material: "Aluminum & Steel"
      },
      imageUrl: "/assets/components/case-creator.jpg",
      brand: "Fractal",
      inStock: true,
      rating: 4.7
    },
    basic: {
      id: "case-basic-atx",
      name: "Basic ATX Tower",
      type: "case",
      price: "69.99",
      specs: {
        formFactor: "ATX Mid Tower",
        material: "Steel & Acrylic"
      },
      imageUrl: "/assets/components/case-basic.jpg",
      brand: "Cooler Master",
      inStock: true,
      rating: 4.5
    }
  },
  cooling: {
    liquidAIO: {
      id: "cooling-liquid-360",
      name: "360mm Liquid AIO Cooler",
      type: "cooling",
      price: "179.99",
      specs: {
        type: "Liquid AIO",
        size: "360mm Radiator"
      },
      imageUrl: "/assets/components/cooling-aio360.jpg",
      brand: "NZXT",
      inStock: true,
      rating: 4.9
    },
    airPremium: {
      id: "cooling-air-premium",
      name: "Premium Dual Tower Air Cooler",
      type: "cooling",
      price: "89.99",
      specs: {
        type: "Air Cooler",
        size: "Dual Tower"
      },
      imageUrl: "/assets/components/cooling-air-premium.jpg",
      brand: "Noctua",
      inStock: true,
      rating: 4.8
    },
    aio240: {
      id: "cooling-aio-240",
      name: "240mm RGB AIO Cooler",
      type: "cooling",
      price: "129.99",
      specs: {
        type: "Liquid AIO",
        size: "240mm Radiator"
      },
      imageUrl: "/assets/components/cooling-aio240.jpg",
      brand: "Corsair",
      inStock: true,
      rating: 4.7
    },
    airBasic: {
      id: "cooling-air-basic",
      name: "Tower Air Cooler",
      type: "cooling",
      price: "49.99",
      specs: {
        type: "Air Cooler",
        size: "Single Tower"
      },
      imageUrl: "/assets/components/cooling-air-basic.jpg",
      brand: "Cooler Master",
      inStock: true,
      rating: 4.6
    }
  },
  os: {
    win11pro: {
      id: "os-windows-11-pro",
      name: "Windows 11 Pro",
      type: "os",
      price: "139.99",
      specs: {
        architecture: "64-bit",
        licenseType: "OEM",
        activation: "Digital License"
      },
      imageUrl: "/static/images/os/windows-11-pro.png",
      brand: "Microsoft",
      inStock: true,
      rating: 4.8
    },
    win11home: {
      id: "os-windows-11-home",
      name: "Windows 11 Home",
      type: "os",
      price: "114.99",
      specs: {
        architecture: "64-bit",
        licenseType: "OEM",
        activation: "Digital License"
      },
      imageUrl: "/static/images/os/windows-11-home.png",
      brand: "Microsoft",
      inStock: true,
      rating: 4.7
    },
    noOS: {
      id: "os-no-os",
      name: "No Windows",
      type: "os",
      price: "0.00",
      specs: {
        description: "No preinstalled operating system",
        notes: "Customer responsible for OS installation"
      },
      imageUrl: "/static/images/os/no-windows.png",
      brand: "RIGFREAKS",
      inStock: true,
      rating: 0
    }
  }
};

// Define prebuilt PC configurations
const prebuiltConfigs = [
  {
    id: "vortex-extreme",
    name: "Vortex Extreme",
    description: "Ultimate 4K gaming rig with bleeding-edge performance",
    price: "3999.99",
    category: "gaming",
    icon: Zap,
    features: ["4K Gaming", "Ray Tracing", "Streaming", "VR Ready"],
    components: {
      cpu: sampleComponents.cpu.i9,
      ram: sampleComponents.ram.ram32,
      storage: sampleComponents.storage.storage2tb,
      motherboard: sampleComponents.motherboard.z790,
      psu: sampleComponents.psu.psu1000w,
      case: sampleComponents.case.phantomElite,
      cooling: sampleComponents.cooling.liquidAIO,
      os: sampleComponents.os.win11pro
    }
  },
  {
    id: "nova-plus",
    name: "Nova Plus",
    description: "Perfect balance of price and performance for 1440p gaming",
    price: "1899.99",
    category: "gaming",
    icon: Monitor,
    features: ["1440p Gaming", "Streaming", "RGB Lighting", "Compact Design"],
    components: {
      cpu: sampleComponents.cpu.ryzen7,
      ram: sampleComponents.ram.ram16,
      storage: sampleComponents.storage.storage1tb,
      motherboard: sampleComponents.motherboard.b650,
      psu: sampleComponents.psu.psu750w,
      case: sampleComponents.case.eclipse,
      cooling: sampleComponents.cooling.airPremium,
      os: sampleComponents.os.win11home
    }
  },
  {
    id: "pulse-creator",
    name: "Pulse Creator",
    description: "Professional workstation optimized for content creation",
    price: "2999.99",
    category: "workstation",
    icon: Server,
    features: ["Video Editing", "3D Rendering", "Multi-tasking", "Content Creation"],
    components: {
      cpu: sampleComponents.cpu.ryzen9,
      ram: sampleComponents.ram.ram64,
      storage: sampleComponents.storage.storage4tb,
      motherboard: sampleComponents.motherboard.x670,
      psu: sampleComponents.psu.psu850w,
      case: sampleComponents.case.creator,
      cooling: sampleComponents.cooling.aio240,
      os: sampleComponents.os.win11pro
    }
  },
  {
    id: "starter-gaming",
    name: "Starter Gaming",
    description: "Affordable entry-level rig for 1080p gaming",
    price: "999.99",
    category: "budget",
    icon: Cpu,
    features: ["1080p Gaming", "Budget Friendly", "Upgradable", "Compact"],
    components: {
      cpu: sampleComponents.cpu.i5,
      ram: sampleComponents.ram.ram16,
      storage: sampleComponents.storage.storage512gb,
      motherboard: sampleComponents.motherboard.b660,
      psu: sampleComponents.psu.psu650w,
      case: sampleComponents.case.basic,
      cooling: sampleComponents.cooling.airBasic,
      os: sampleComponents.os.win11home
    }
  }
];

const PCBuilder: React.FC = () => {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, PCComponentData>>({});
  const [compatibility, setCompatibility] = useState<Record<string, boolean>>({
    cpu: true,
    ram: true,
    storage: true,
    motherboard: true,
    psu: true, 
    case: true,
    cooling: true,
    os: true
  });
  const [activeTab, setActiveTab] = useState("custom");

  // Define component categories
  const componentCategories = [
    { id: 1, name: "CPU (Processor)", type: "cpu", icon: "cpu" },
    { id: 2, name: "RAM (Memory)", type: "ram", icon: "ram" },
    { id: 3, name: "Storage", type: "storage", icon: "storage" },
    { id: 4, name: "Motherboard", type: "motherboard", icon: "motherboard" },
    { id: 5, name: "Power Supply", type: "psu", icon: "psu" },
    { id: 6, name: "Case", type: "case", icon: "case" },
    { id: 7, name: "CPU Cooler", type: "cooling", icon: "cooling" },
    { id: 8, name: "Operating System", type: "os", icon: "os" }
  ];

  // Update compatibility when components change
  useEffect(() => {
    if (Object.keys(selectedComponents).length > 0) {
      const compatibilityResults = checkComponentCompatibility(selectedComponents);
      setCompatibility(compatibilityResults);
    }
  }, [selectedComponents]);

  const hasCompatibilityWarnings = Object.values(compatibility).some(value => value === false);

  const selectComponent = (type: string, component: PCComponentData) => {
    setSelectedComponents(prev => ({
      ...prev,
      [type]: component
    }));
    
    // If we're in prebuilt tab, switch to custom tab after selection
    if (activeTab === "prebuilt") {
      setActiveTab("custom");
    }
  };
  
  // Load a prebuilt configuration
  const loadPrebuiltConfig = (config: any) => {
    // Filter out any undefined components (in case some weren't found in the database)
    const validComponents: Record<string, PCComponentData> = {};
    
    Object.entries(config.components).forEach(([type, component]: [string, any]) => {
      if (component) {
        validComponents[type] = component;
      }
    });
    
    setSelectedComponents(validComponents);
    setActiveTab("custom"); // Switch to custom tab to show component selection
  };

  return (
    <section id="custom-builder" className="py-16 bg-gradient-dark">
      <Helmet>
        <title>Custom PC Builder | RigFreaks</title>
        <meta name="description" content="Build your dream gaming PC with our easy-to-use PC Builder. Choose from top-quality components and create a custom PC that matches your gaming needs." />
      </Helmet>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-rajdhani mb-6 text-center">
          <span className="border-b-4 border-accent pb-2">CUSTOM PC BUILDER</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
          Select your components to build a custom PC tailored to your needs, or choose from one of our expert-designed prebuilt configurations.
        </p>
        
        <Tabs defaultValue="custom" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-dark-card">
              <TabsTrigger value="custom" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Custom Build
              </TabsTrigger>
              <TabsTrigger value="prebuilt" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Prebuilt PCs
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="prebuilt" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {prebuiltConfigs.map(config => {
                const ConfigIcon = config.icon;
                return (
                  <Card key={config.id} className="bg-dark-card border-gray-700 hover:border-primary transition-colors overflow-hidden">
                    <div className="bg-gradient-to-r from-dark-card to-dark-base p-4 border-b border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-rajdhani font-bold">{config.name}</h3>
                        <ConfigIcon className="h-6 w-6 text-accent" />
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{config.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {config.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-dark-base border-accent/20">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">£{config.price}</div>
                    </div>
                    <CardContent className="p-4 pt-4">
                      <div className="space-y-2 mb-4">
                        {Object.entries(config.components).map(([type, component]: [string, any]) => (
                          component && (
                            <div key={type} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{type.toUpperCase()}</span>
                              <span className="font-medium truncate ml-2">{component.name}</span>
                            </div>
                          )
                        ))}
                      </div>
                      <Button 
                        className="w-full bg-accent hover:bg-accent/90 text-dark-base font-rajdhani font-semibold"
                        onClick={() => loadPrebuiltConfig(config)}
                      >
                        Select & Customize
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-6">
            {hasCompatibilityWarnings && (
              <Alert variant="destructive" className="mb-8 bg-amber-900/50 border-amber-600 text-amber-100">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Compatibility Warning</AlertTitle>
                <AlertDescription>
                  Some of your selected components may not be compatible. Please review the warnings in the component sections.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Component Selection Area */}
              <div className="lg:w-2/3">
                <ComponentSelector 
                  categories={componentCategories}
                  selectedComponents={selectedComponents}
                  onSelect={selectComponent}
                  compatibility={compatibility}
                />
                
                {/* Performance Estimator */}
                {(selectedComponents.cpu || selectedComponents.gpu) && (
                  <PerformanceEstimator 
                    components={{
                      cpu: selectedComponents.cpu?.name,
                      gpu: selectedComponents.gpu?.name,
                      ram: selectedComponents.ram?.name,
                      storage: selectedComponents.storage?.name
                    }}
                  />
                )}
              </div>
              
              {/* Build Summary */}
              <div className="lg:w-1/3">
                <BuildSummary 
                  selectedComponents={selectedComponents}
                  hasCompatibilityWarnings={hasCompatibilityWarnings}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PCBuilder;
