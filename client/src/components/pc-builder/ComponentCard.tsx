import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PCComponentData } from '@/lib/componentData';
import { Badge } from '@/components/ui/badge';

interface ComponentCardProps {
  component: PCComponentData;
  selected: boolean;
  compatible: boolean;
  onClick: () => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ 
  component, 
  selected, 
  compatible = true,
  onClick 
}) => {
  // Format price as GBP
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
  }).format(component.price);

  // Process image URL to ensure it works with local storage
  const getImageUrl = (url: string | undefined): string => {
    if (!url) return '/default-component.jpg';
    
    // If it's already a full URL with http/https, use it as is
    if (url.startsWith('http')) {
      return url;
    }
    
    // If it's an absolute path (starts with /), use it from the server root
    if (url.startsWith('/')) {
      return url;
    }
    
    // For relative paths, assume they're in the uploads/components directory
    return `/uploads/components/${url}`;
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg cursor-pointer border-2 overflow-hidden ${
        selected ? 'border-primary bg-primary/5' : 
        !compatible ? 'border-destructive bg-destructive/5' : 
        'border-transparent hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative p-4 flex flex-col">
          {/* Inventory Status Badge */}
          <div className="absolute top-2 right-2 z-10">
            {component.inventoryStatus === 'in-stock' ? (
              <Badge variant="success" className="text-xs bg-green-600">In Stock</Badge>
            ) : component.inventoryStatus === 'out-of-stock' ? (
              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
            ) : (
              <Badge variant="outline" className="text-xs bg-amber-500 text-white">Pre Order</Badge>
            )}
          </div>
          
          {/* Component Image */}
          <div className="flex justify-center items-center w-full bg-white rounded-md overflow-hidden mb-3 p-4">
            <img 
              src={getImageUrl(component.imageUrl || component.image)} 
              alt={component.name} 
              className="object-contain max-h-36 transition-transform hover:scale-105"
              onError={(e) => {
                console.log('Image failed to load:', component.imageUrl || component.image);
                // Try the alternative field if one failed
                if (component.image && component.imageUrl && component.image !== component.imageUrl) {
                  (e.target as HTMLImageElement).src = getImageUrl(component.image);
                } else {
                  // Fall back to default image
                  (e.target as HTMLImageElement).src = '/default-component.jpg';
                }
              }}
            />
          </div>
          
          {/* Component Details */}
          <div className="text-sm font-medium line-clamp-2 h-10">{component.name}</div>
          {component.brand && <div className="text-xs text-muted-foreground mb-2">{component.brand}</div>}
          <div className="text-lg font-bold text-primary mt-auto">{formattedPrice}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentCard;