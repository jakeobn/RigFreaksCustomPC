import React from 'react';
import { 
  Cpu, 
  Monitor, 
  HardDrive, 
  MemoryStick, 
  PcCase, 
  Thermometer, 
  Zap, 
  Keyboard, 
  Mouse,
  Fan,
  Settings,
  Wifi
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpecsVisualizerProps {
  specs: Record<string, string | number>;
  category?: string;
}

const SpecsVisualizer: React.FC<SpecsVisualizerProps> = ({ specs, category = 'keyboard' }) => {
  
  // Map spec categories to icons
  const getIconForCategory = (key: string) => {
    const iconMap: Record<string, JSX.Element> = {
      // Computing components
      cpu: <Cpu className="h-5 w-5 text-blue-400" />,
      gpu: <Monitor className="h-5 w-5 text-green-400" />,
      memory: <MemoryStick className="h-5 w-5 text-yellow-400" />,
      storage: <HardDrive className="h-5 w-5 text-purple-400" />,
      case: <PcCase className="h-5 w-5 text-gray-400" />,
      cooling: <Fan className="h-5 w-5 text-cyan-400" />,
      power: <Zap className="h-5 w-5 text-red-400" />,
      
      // Peripheral specific
      connection: <Wifi className="h-5 w-5 text-blue-400" />,
      type: <Keyboard className="h-5 w-5 text-indigo-400" />,
      switches: <Settings className="h-5 w-5 text-orange-400" />,
      polling: <Thermometer className="h-5 w-5 text-red-400" />,
      battery: <Zap className="h-5 w-5 text-green-400" />,
      dimensions: <PcCase className="h-5 w-5 text-gray-400" />,
      weight: <Settings className="h-5 w-5 text-purple-400" />
    };
    
    // Try to match the key to a specific icon, or use a default based on category
    for (const iconKey in iconMap) {
      if (key.toLowerCase().includes(iconKey.toLowerCase())) {
        return iconMap[iconKey];
      }
    }
    
    // Default icons based on product category
    const defaultIcons: Record<string, JSX.Element> = {
      keyboard: <Keyboard className="h-5 w-5 text-primary" />,
      mouse: <Mouse className="h-5 w-5 text-primary" />,
      default: <Settings className="h-5 w-5 text-primary" />
    };
    
    return defaultIcons[category] || defaultIcons.default;
  };
  
  // Format key for display
  const formatKey = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Determine if a value should be displayed with a progress bar
  const shouldShowProgress = (key: string, value: string | number) => {
    const progressKeys = ['rating', 'score', 'performance', 'speed', 'efficiency'];
    return (
      progressKeys.some(progressKey => key.toLowerCase().includes(progressKey)) &&
      !isNaN(Number(value)) && 
      Number(value) >= 0 && 
      Number(value) <= 100
    );
  };
  
  // Get progress color based on value
  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    if (value >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="specs-visualizer space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(specs).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col p-4 rounded-lg border border-gray-800 bg-gray-900/60"
          >
            <div className="flex items-center mb-2">
              {getIconForCategory(key)}
              <h3 className="ml-2 text-sm font-medium text-gray-300">{formatKey(key)}</h3>
            </div>
            
            <Separator className="my-2 bg-gray-800" />
            
            {shouldShowProgress(key, value) ? (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-bold">{value}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-xs text-gray-400">What's this?</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Performance score out of 100</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="bg-gray-800 h-2 w-full rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getProgressColor(Number(value))}`} 
                    style={{ width: `${Number(value)}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <span className="text-lg font-semibold text-white">{value}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpecsVisualizer;