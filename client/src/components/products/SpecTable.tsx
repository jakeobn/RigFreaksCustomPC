import React from "react";
import { Separator } from "@/components/ui/separator";
import { 
  Cpu, 
  PcCase, 
  HardDrive, 
  PackageOpen, 
  Zap, 
  Fan, 
  Monitor, 
  MemoryStick,
  Keyboard,
  MousePointer,
  Headphones,
  Bluetooth,
  Wifi,
  Usb
} from "lucide-react";

interface SpecTableProps {
  specs?: {
    [key: string]: string;
  };
  specsHtml?: string;
}

const SpecTable: React.FC<SpecTableProps> = ({ specs, specsHtml }) => {
  const getIconForSpec = (specName: string) => {
    const name = specName.toLowerCase();
    if (name.includes('cpu') || name.includes('processor')) return <Cpu className="h-5 w-5 text-primary" />;
    if (name.includes('storage') || name.includes('ssd') || name.includes('hdd')) return <HardDrive className="h-5 w-5 text-primary" />;
    if (name.includes('ram') || name.includes('memory')) return <MemoryStick className="h-5 w-5 text-primary" />;
    if (name.includes('motherboard')) return <PackageOpen className="h-5 w-5 text-primary" />;
    if (name.includes('psu') || name.includes('power')) return <Zap className="h-5 w-5 text-primary" />;
    if (name.includes('cooling')) return <Fan className="h-5 w-5 text-primary" />;
    if (name.includes('display') || name.includes('monitor')) return <Monitor className="h-5 w-5 text-primary" />;
    if (name.includes('keyboard')) return <Keyboard className="h-5 w-5 text-primary" />;
    if (name.includes('mouse')) return <MousePointer className="h-5 w-5 text-primary" />;
    if (name.includes('headset') || name.includes('audio')) return <Headphones className="h-5 w-5 text-primary" />;
    if (name.includes('bluetooth')) return <Bluetooth className="h-5 w-5 text-primary" />;
    if (name.includes('wifi') || name.includes('wireless')) return <Wifi className="h-5 w-5 text-primary" />;
    if (name.includes('usb') || name.includes('port')) return <Usb className="h-5 w-5 text-primary" />;
    
    return <PackageOpen className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="bg-black/10 border border-gray-800 rounded-lg">
      <h3 className="font-rajdhani text-xl font-bold px-4 py-3 border-b border-gray-800">Technical Specifications</h3>
      
      {specsHtml ? (
        // If HTML specs are available, render them
        <div className="p-4">
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: specsHtml }} />
          </div>
        </div>
      ) : (
        // Otherwise, render the key-value specs
        <div className="divide-y divide-gray-800/60">
          {specs && Object.keys(specs).length > 0 ? (
            Object.entries(specs).map(([name, value], index) => (
              <div key={index} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center mb-1 sm:mb-0 sm:min-w-[180px] sm:pr-4">
                  <div className="mr-3 text-primary">
                    {getIconForSpec(name)}
                  </div>
                  <span className="font-medium text-sm">{name}</span>
                </div>
                <span className="text-gray-300 pl-8 sm:pl-0">{value}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No specifications available for this product.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecTable;
