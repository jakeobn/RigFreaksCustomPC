import React from "react";
import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductProps {
  product: {
    id: number;
    title: string;
    handle: string;
    description: string;
    price: string;
    category: string;
    featuredImageUrl: string;
    specs: Record<string, string>;
    tag?: string;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implementation will depend on the cart functionality
    console.log(`Adding product ${product.id} to cart`);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(parseFloat(price));
  };

  const getTagColorClass = (tag?: string) => {
    if (!tag) return "";
    
    switch(tag.toUpperCase()) {
      case "BEST SELLER":
        return "bg-primary";
      case "NEW":
        return "bg-accent";
      case "BEST VALUE":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Link href={`/products/${product.handle}`}>
      <Card className="bg-dark-surface rounded-lg overflow-hidden border border-gray-800 neon-border group transition-all duration-300 cursor-pointer h-full">
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <img 
              src={product.featuredImageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          {product.tag && (
            <div className={`absolute top-3 right-3 ${getTagColorClass(product.tag)} text-white text-xs font-bold px-2 py-1 rounded`}>
              {product.tag}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold font-rajdhani mb-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            {/* Extract plain text from HTML description, keeping only first sentence */}
            {product.description.replace(/<[^>]*>?/gm, '').split('.')[0]}...
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {Object.entries(product.specs).map(([key, value], index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-dark-base px-2 py-1 rounded text-xs"
              >
                {value}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold font-rajdhani">{formatPrice(product.price)}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-dark-base hover:bg-dark-card transition-colors duration-300 rounded-full h-10 w-10"
              onClick={addToCart}
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
