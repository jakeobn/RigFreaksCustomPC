import React from "react";
import { Link } from "wouter";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/products/ProductCard";

interface Product {
  id: number;
  title: string;
  handle: string;
  description: string;
  price: string;
  category: string;
  featuredImageUrl: string;
  specs: Record<string, string>;
  tag?: string;
}

const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
    staleTime: 60 * 1000, // 1 minute
  });

  // Fallback data for initial render
  const featuredProducts: Product[] = products || [
    {
      id: 1,
      title: "Vortex Pro X",
      handle: "vortex-pro-x",
      description: "Ultimate 4K Gaming Experience",
      price: "3499.99",
      category: "vortex",
      featuredImageUrl: "/assets/pc1.png",
      specs: {
        gpu: "RTX 4090",
        cpu: "i9-13900K",
        ram: "64GB DDR5"
      },
      tag: "BEST SELLER"
    },
    {
      id: 2,
      title: "Nova Elite",
      handle: "nova-elite",
      description: "Competitive 1440p Gaming",
      price: "1899.99",
      category: "nova",
      featuredImageUrl: "/assets/pc2.png",
      specs: {
        gpu: "RTX 3070 Ti",
        cpu: "i5-13600K",
        ram: "32GB DDR4"
      }
    },
    {
      id: 3,
      title: "Pulse Creator Pro",
      handle: "pulse-creator-pro",
      description: "Professional Content Creation",
      price: "2999.99",
      category: "pulse",
      featuredImageUrl: "/assets/pc3.png",
      specs: {
        gpu: "RTX 4080",
        cpu: "Ryzen 9 7950X",
        ram: "64GB DDR5"
      },
      tag: "NEW"
    },
    {
      id: 4,
      title: "Nova Starter",
      handle: "nova-starter",
      description: "1080p Gaming Excellence",
      price: "1199.99",
      category: "nova",
      featuredImageUrl: "/assets/pc4.png",
      specs: {
        gpu: "RTX 3060",
        cpu: "i5-12400F",
        ram: "16GB DDR4"
      },
      tag: "BEST VALUE"
    }
  ];

  return (
    <section id="featured-products" className="py-16 bg-dark-base">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-rajdhani">
            <span className="border-b-4 border-primary pb-2">FEATURED RIGS</span>
          </h2>
          <Link href="/collections/all" className="text-accent hover:text-primary transition-colors duration-300 font-rajdhani font-semibold">
            VIEW ALL <ArrowRight className="ml-1 h-4 w-4 inline-block" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
