import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';

interface Product {
  id: number;
  title: string;
  handle: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  category: string;
  subcategory?: string;
  featuredImageUrl: string;
  imagesUrls?: string[];
  tags?: string[];
  specs: Record<string, any>;
  stock: number;
}

const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState('');
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({
    header: true,
    gallery: false,
    specs: false,
    description: false,
    compatibility: false,
  });

  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', handle],
    queryFn: async () => {
      const response = await fetch(`/api/products/${handle}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },
    enabled: !!handle,
  });

  useEffect(() => {
    if (product?.featuredImageUrl) {
      setSelectedImage(product.featuredImageUrl);
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Define the sections and their positions
      const sections = {
        header: 0,
        gallery: 300,
        specs: 800, 
        description: 1200,
        compatibility: 1600,
      };
      
      // Update visibility based on scroll position
      Object.entries(sections).forEach(([section, position]) => {
        setIsVisible(prev => ({
          ...prev,
          [section]: scrollPosition >= position,
        }));
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await apiRequest('POST', '/api/cart/add', {
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.featuredImageUrl,
        quantity: 1,
      });
      
      // Show confirmation (you might want to use toast here)
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => setLocation('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  // Calculate discount percentage if compareAtPrice exists
  const discountPercentage = product.compareAtPrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100) 
    : 0;

  // Format prices
  const formattedPrice = parseFloat(product.price).toFixed(2);
  const formattedComparePrice = product.compareAtPrice 
    ? parseFloat(product.compareAtPrice).toFixed(2) 
    : undefined;

  return (
    <>
      <Helmet>
        <title>{product.title} | RigFreaks</title>
        <meta name="description" content={`${product.title} - ${product.description.substring(0, 150)}...`} />
      </Helmet>

      <div className="min-h-screen bg-dark-base pb-20">
        {/* Sticky Header */}
        <div className={`sticky top-0 z-30 w-full bg-dark-surface shadow-md transition-all duration-300 ${isVisible.header ? 'py-4' : 'py-2'}`}>
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold transition-all duration-300">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="text-right">
                <div className="flex items-center justify-end">
                  {formattedComparePrice && (
                    <span className="text-gray-500 dark:text-gray-400 line-through mr-2">
                      ${formattedComparePrice}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary">
                    ${formattedPrice}
                  </span>
                </div>
                {discountPercentage > 0 && (
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>
              
              <Button 
                size="lg" 
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary/90 text-white font-rajdhani font-semibold"
              >
                Add to Cart
              </Button>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="w-full bg-dark-surface h-2 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full opacity-20 bg-gradient-to-r from-accent to-primary"></div>
            <div 
              className="bg-primary h-2 transition-all duration-300 ease-in-out relative"
              style={{ 
                width: `${Math.min(
                  (window.scrollY / 2000) * 100, 
                  100
                )}%` 
              }}
            >
              <div className="absolute top-0 right-0 h-full w-4 bg-accent glow-accent"></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Image Gallery */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden mb-8 border-0 shadow-lg bg-dark-card">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden" style={{ height: '500px' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 z-0"></div>
                    <div 
                      className="aspect-w-16 aspect-h-9 bg-center bg-cover transform transition-all duration-700 ease-out hover:scale-105 relative z-10" 
                      style={{ 
                        backgroundImage: `url(${selectedImage || product.featuredImageUrl})`,
                        height: '500px',
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-dark-base/60 to-transparent opacity-30"></div>
                      <div className="absolute top-4 right-4 bg-primary/80 text-white px-3 py-2 rounded-md shadow-md backdrop-blur-sm font-rajdhani font-semibold">
                        {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                      </div>
                      {discountPercentage > 0 && (
                        <div className="absolute top-4 left-4 bg-accent/80 text-black px-3 py-2 rounded-md shadow-md backdrop-blur-sm font-rajdhani font-semibold">
                          SAVE {discountPercentage}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Thumbnail gallery */}
                  {(product.imagesUrls && product.imagesUrls.length > 0) && (
                    <div className="flex overflow-x-auto p-2 space-x-2 bg-dark-surface custom-scrollbar">
                      <div 
                        className={`flex-shrink-0 w-20 h-20 bg-center bg-cover cursor-pointer border-2 ${selectedImage === product.featuredImageUrl ? 'border-primary' : 'border-transparent'}`}
                        style={{ backgroundImage: `url(${product.featuredImageUrl})` }}
                        onClick={() => setSelectedImage(product.featuredImageUrl)}
                      ></div>
                      
                      {product.imagesUrls.map((img, index) => (
                        <div 
                          key={index}
                          className={`flex-shrink-0 w-20 h-20 bg-center bg-cover cursor-pointer border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                          style={{ backgroundImage: `url(${img})` }}
                          onClick={() => setSelectedImage(img)}
                        ></div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Product description */}
              <Card className="mb-8 border-0 shadow-lg bg-dark-card relative overflow-hidden" id="description">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/10 rounded-bl-full opacity-50 transform -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-tr-full opacity-50 transform translate-y-6 -translate-x-6"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-8 bg-primary mr-4"></div>
                    <h2 className="text-3xl font-bold font-rajdhani">Description</h2>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none relative">
                    <div className="mb-6 text-lg leading-relaxed">
                      {product.description}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-dark-surface rounded-lg p-5 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <h3 className="text-xl font-bold font-rajdhani mb-3 flex items-center">
                          <span className="text-primary mr-2">★</span> Key Features
                        </h3>
                        <ul className="space-y-2">
                          {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                            <li key={key} className="flex items-start">
                              <span className="text-accent mr-2">✓</span> 
                              <span className="capitalize font-medium">{key}:</span> 
                              <span className="ml-1">{String(value)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-dark-surface rounded-lg p-5 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <h3 className="text-xl font-bold font-rajdhani mb-3 flex items-center">
                          <span className="text-primary mr-2">⚡</span> Performance
                        </h3>
                        <p className="mb-4">Experience exceptional performance with this high-quality product.</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>Rating:</span>
                          <div className="flex items-center">
                            <span className="text-accent">★★★★</span><span>★</span>
                            <span className="ml-1">(4.0/5)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product specifications */}
              <Card className="mb-8 border-0 shadow-lg bg-dark-card relative overflow-hidden group" id="specifications">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-70"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-8 bg-accent mr-4"></div>
                    <h2 className="text-3xl font-bold font-rajdhani">Technical Specifications</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specs).map(([key, value], index) => (
                      <div 
                        key={key} 
                        className="p-4 bg-dark-surface rounded-lg border border-transparent hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group"
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <h3 className="capitalize font-rajdhani font-semibold text-lg mb-1 text-primary group-hover:text-accent transition-colors">
                          {key}
                        </h3>
                        
                        <div className="flex items-center mt-2">
                          <div className="w-10 h-1 bg-accent/30 mr-3"></div>
                          <span className="text-gray-200">{String(value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 bg-dark-surface/50 p-4 rounded-lg border border-accent/10">
                    <h3 className="text-xl font-bold font-rajdhani mb-3 flex items-center">
                      <span className="text-accent mr-2">ℹ</span> Technical Details
                    </h3>
                    <p className="text-gray-400 text-sm">
                      All specifications are subject to change without notice. Actual performance may vary based on system configuration and usage conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Details and Purchase */}
            <div>
              <Card className="border-0 shadow-lg bg-dark-card sticky top-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/80 via-accent/50 to-primary/80"></div>
                
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full bg-dark-surface border-b border-accent/20">
                    <TabsTrigger 
                      className="flex-1 font-rajdhani text-base uppercase data-[state=active]:text-accent data-[state=active]:shadow-[0_0_10px_rgba(0,240,255,0.5)]" 
                      value="overview"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      className="flex-1 font-rajdhani text-base uppercase data-[state=active]:text-accent data-[state=active]:shadow-[0_0_10px_rgba(0,240,255,0.5)]" 
                      value="details"
                    >
                      Details
                    </TabsTrigger>
                    <TabsTrigger 
                      className="flex-1 font-rajdhani text-base uppercase data-[state=active]:text-accent data-[state=active]:shadow-[0_0_10px_rgba(0,240,255,0.5)]" 
                      value="related"
                    >
                      Related
                    </TabsTrigger>
                  </TabsList>
                  
                  <ScrollArea className="h-[600px] custom-scrollbar">
                    <TabsContent value="overview" className="p-6 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-accent/5 rounded-bl-full opacity-30"></div>
                      
                      <div className="mb-6 bg-dark-surface p-4 rounded-lg border border-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full opacity-50"></div>
                        
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold font-rajdhani">Price</h3>
                          {discountPercentage > 0 && (
                            <span className="bg-accent text-black px-2 py-1 rounded text-sm font-bold">
                              SAVE {discountPercentage}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-baseline mb-3">
                          <span className="text-3xl font-bold text-primary mr-3">
                            ${formattedPrice}
                          </span>
                          {formattedComparePrice && (
                            <span className="text-gray-400 line-through">
                              ${formattedComparePrice}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm bg-dark-base/50 p-2 rounded">
                          <span className="font-medium">Availability:</span>
                          <span className={`flex items-center ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-1 h-5 bg-primary"></div>
                          <h3 className="text-xl font-bold font-rajdhani">Quick Specifications</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {Object.entries(product.specs).slice(0, 5).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700/30">
                              <span className="font-medium capitalize text-gray-300">{key}</span>
                              <span className="text-accent">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        <div>
                          <h4 className="font-rajdhani text-base font-semibold uppercase">Category</h4>
                          <div className="flex items-center mt-1 bg-dark-surface px-3 py-2 rounded-md">
                            <span className="text-accent mr-2">•</span>
                            <p className="capitalize">{product.category}</p>
                          </div>
                        </div>
                        
                        {product.tags && product.tags.length > 0 && (
                          <div>
                            <h4 className="font-rajdhani text-base font-semibold uppercase">Tags</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {product.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-dark-surface border border-accent/20 rounded text-sm hover:border-accent/50 transition-colors cursor-pointer">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="relative mt-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-lg opacity-30"></div>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-white font-rajdhani font-semibold text-lg py-6 relative z-10"
                          onClick={handleAddToCart}
                        >
                          ADD TO CART
                        </Button>
                        
                        <div className="mt-3 text-xs text-gray-400 text-center">
                          Fast shipping available | 30-day returns | 2-year warranty
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-1 h-6 bg-accent mr-3"></div>
                        <h3 className="text-2xl font-bold font-rajdhani">Technical Details</h3>
                      </div>
                      
                      <div className="space-y-5">
                        {Object.entries(product.specs).map(([key, value], index) => (
                          <div 
                            key={key} 
                            className="border-b border-gray-700/30 pb-3"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <h4 className="font-rajdhani font-semibold uppercase text-primary mb-1 flex items-center">
                              <span className="text-accent mr-2">•</span>
                              {key}
                            </h4>
                            <div className="bg-dark-surface px-3 py-2 rounded ml-4 mt-1">
                              <p className="text-gray-200">{String(value)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 p-4 bg-dark-surface rounded-lg border border-accent/20">
                        <div className="flex items-center mb-2">
                          <span className="text-accent mr-2">💡</span>
                          <h4 className="font-rajdhani font-semibold">Tech Expert Advice</h4>
                        </div>
                        <p className="text-sm text-gray-400">
                          This product is optimized for high-performance computing and gaming. For best results, pair with compatible components.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="related" className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-1 h-6 bg-accent mr-3"></div>
                        <h3 className="text-2xl font-bold font-rajdhani">You May Also Like</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="bg-dark-surface rounded-lg p-3 flex items-center space-x-3 hover:border-accent/30 border border-transparent transition-colors cursor-pointer">
                            <div className="w-16 h-16 bg-dark-base rounded flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-sm">Related Product {item}</h4>
                              <p className="text-primary text-xs">$199.99</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 p-4 bg-dark-base rounded-lg text-center">
                        <p className="text-gray-400 text-sm mb-2">
                          Looking for similar products?
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full border-accent text-accent hover:bg-accent/10"
                        >
                          Browse Collection
                        </Button>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;