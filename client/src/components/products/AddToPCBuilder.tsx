import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PcCase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addProductAsComponent } from "@/lib/pcBuilderUtils";
import { toast } from "@/hooks/use-toast";

interface AddToPCBuilderProps {
  productId: number;
  productTitle: string;
  className?: string;
}

const COMPONENT_TYPES = [
  { value: "cpu", label: "CPU (Processor)" },
  { value: "motherboard", label: "Motherboard" },
  { value: "ram", label: "RAM (Memory)" },
  { value: "storage", label: "Storage" },
  { value: "psu", label: "Power Supply" },
  { value: "case", label: "Case" },
  { value: "cooling", label: "CPU Cooler" },
];

const AddToPCBuilder: React.FC<AddToPCBuilderProps> = ({ productId, productTitle, className }) => {
  const [open, setOpen] = useState(false);
  const [componentType, setComponentType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleAddToBuilder = async () => {
    if (!componentType) {
      toast({
        title: "Please select a component type",
        description: "Select the type of PC component this product represents.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await addProductAsComponent(productId, componentType);
      toast({
        title: "Added to PC Builder",
        description: `${productTitle} has been added as a ${componentType.toUpperCase()} component.`,
      });
      setOpen(false);
      
      // Navigate to PC Builder page
      setLocation("/pc-builder");
    } catch (error) {
      console.error("Error adding to PC Builder:", error);
      toast({
        title: "Error adding to PC Builder",
        description: "There was a problem adding this product to the PC Builder.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full border-accent text-accent hover:bg-accent/10 h-12 font-rajdhani ${className || ''}`}
        >
          <PcCase className="mr-2 h-5 w-5" /> ADD TO PC BUILDER
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dark-surface border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-rajdhani">Add to PC Builder</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select the component type for "{productTitle}" to add it to your custom PC build.
          </p>
          <Select value={componentType} onValueChange={setComponentType}>
            <SelectTrigger className="w-full bg-dark-card border-gray-700">
              <SelectValue placeholder="Select component type" />
            </SelectTrigger>
            <SelectContent className="bg-dark-card border-gray-700">
              {COMPONENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-700">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleAddToBuilder} 
            disabled={!componentType || loading}
            className="bg-accent hover:bg-accent/90"
          >
            {loading ? "Adding..." : "Add & Continue to PC Builder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPCBuilder;