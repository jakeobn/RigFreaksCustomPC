import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Check, ChevronRight, Info, ShoppingCart, Star, Tag, Truck } from 'lucide-react';
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
  specsHtml?: string;
  stock: number;
}

const ProductDetailPageV2: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState('hero');
  const [showSpecsPanel, setShowSpecsPanel] = useState(false);
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  
  const productRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  
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

  // Handle 3D rotation effect on image
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!productRef.current) return;
    
    const rect = productRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateYValue = ((x - centerX) / centerX) * 5;
    const rotateXValue = ((y - centerY) / centerY) * -5;
    
    setRotateY(rotateYValue);
    setRotateX(rotateXValue);
  };
  
  const resetRotation = () => {
    setRotateY(0);
    setRotateX(0);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === heroRef.current) setActiveSection('hero');
          else if (entry.target === specsRef.current) setActiveSection('specs');
          else if (entry.target === descriptionRef.current) setActiveSection('description');
          else if (entry.target === reviewsRef.current) setActiveSection('reviews');
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    if (heroRef.current) observer.observe(heroRef.current);
    if (specsRef.current) observer.observe(specsRef.current);
    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (reviewsRef.current) observer.observe(reviewsRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Format price with GBP currency symbol
  const formatGBP = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toFixed(2);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await apiRequest('POST', '/api/cart/add', {
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.featuredImageUrl,
        quantity,
      });
      
      // Show success animation - handled by CSS
      const button = document.getElementById('add-to-cart-button');
      if (button) {
        button.classList.add('added-to-cart');
        setTimeout(() => {
          button.classList.remove('added-to-cart');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark-base">
        <div className="w-24 h-24 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary border-r-accent rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-rajdhani text-primary">
            LOADING
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark-base p-4">
        <div className="text-6xl text-primary mb-6">404</div>
        <h1 className="text-2xl font-bold text-accent mb-4">Product Not Found</h1>
        <p className="text-gray-400 max-w-md text-center mb-8">
          The product you're looking for doesn't exist or has been removed from our inventory.
        </p>
        <Button 
          onClick={() => setLocation('/')}
          className="bg-primary hover:bg-primary/90 text-white font-rajdhani"
        >
          Return to Homepage
        </Button>
      </div>
    );
  }

  // Calculate discount percentage if compareAtPrice exists
  const discountPercentage = product.compareAtPrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100) 
    : 0;

  // Format prices with GBP currency
  const formattedPrice = formatGBP(product.price);
  const formattedComparePrice = product.compareAtPrice 
    ? formatGBP(product.compareAtPrice) 
    : undefined;

  return (
    <>
      <Helmet>
        <title>{product.title} | RigFreaks</title>
        <meta name="description" content={`${product.title} - ${product.description.substring(0, 150)}...`} />
      </Helmet>

      <div className="min-h-screen bg-dark-base">
        {/* Navigation Dots */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
          <div className="flex flex-col items-center space-y-6">
            <button 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === 'hero' ? 'bg-primary w-4 h-4 shadow-[0_0_10px_rgba(255,0,60,0.6)]' : 'bg-gray-600'}`}
              onClick={() => scrollToSection(heroRef)}
              aria-label="Go to product overview"
            ></button>
            <div className="w-px h-10 bg-gradient-to-b from-primary to-gray-800"></div>
            <button 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === 'specs' ? 'bg-accent w-4 h-4 shadow-[0_0_10px_rgba(0,240,255,0.6)]' : 'bg-gray-600'}`}
              onClick={() => scrollToSection(specsRef)}
              aria-label="Go to specifications"
            ></button>
            <div className="w-px h-10 bg-gradient-to-b from-gray-800 to-primary"></div>
            <button 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === 'description' ? 'bg-primary w-4 h-4 shadow-[0_0_10px_rgba(255,0,60,0.6)]' : 'bg-gray-600'}`}
              onClick={() => scrollToSection(descriptionRef)}
              aria-label="Go to description"
            ></button>
            <div className="w-px h-10 bg-gradient-to-b from-primary to-gray-800"></div>
            <button 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === 'reviews' ? 'bg-accent w-4 h-4 shadow-[0_0_10px_rgba(0,240,255,0.6)]' : 'bg-gray-600'}`}
              onClick={() => scrollToSection(reviewsRef)}
              aria-label="Go to reviews"
            ></button>
          </div>
        </div>

        {/* Fixed Add to Cart */}
        <div className={`fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-primary/30 p-4 transform transition-transform duration-500 ${activeSection !== 'hero' ? 'translate-y-0' : 'translate-y-full'} z-40`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-12 h-12 bg-cover bg-center rounded mr-3"
                style={{ backgroundImage: `url(${product.featuredImageUrl})` }}
              ></div>
              <div>
                <h3 className="font-rajdhani font-semibold truncate max-w-[150px] sm:max-w-xs">
                  {product.title}
                </h3>
                <span className="text-primary font-bold">${formattedPrice}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex bg-dark-base rounded-md">
                <button 
                  className="px-3 py-1 border border-gray-700 rounded-l-md hover:bg-dark-surface"
                  onClick={decrementQuantity}
                >-</button>
                <span className="px-4 py-1 border-t border-b border-gray-700 flex items-center justify-center min-w-[40px]">
                  {quantity}
                </span>
                <button 
                  className="px-3 py-1 border border-gray-700 rounded-r-md hover:bg-dark-surface"
                  onClick={incrementQuantity}
                >+</button>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                className="bg-primary text-white font-rajdhani font-bold hover:bg-primary/90"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section 
          ref={heroRef} 
          className="pt-12 lg:pt-24 pb-16 container mx-auto px-4 md:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Product Images */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-tr from-accent to-primary opacity-20 blur-xl"></div>
              
              <div 
                ref={productRef}
                className="relative overflow-hidden rounded-xl bg-dark-card border border-gray-800 group"
                onMouseMove={handleMouseMove}
                onMouseLeave={resetRotation}
              >
                {/* Main Image with 3D Effect */}
                <div 
                  className="relative aspect-video bg-dark-base flex items-center justify-center overflow-hidden"
                >
                  <div
                    className="w-full h-full transition-all duration-300 ease-out"
                    style={{ transform: `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)` }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.8)_80%)] opacity-70 z-20"></div>
                    <div 
                      className="absolute inset-0 bg-cover bg-center z-0 transform transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: `url(${selectedImage || product.featuredImageUrl})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-dark-base/40 to-transparent z-10"></div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 z-30">
                    {product.stock > 0 ? (
                      <div className="bg-green-500/90 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm font-rajdhani font-semibold">
                        In Stock
                      </div>
                    ) : (
                      <div className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm font-rajdhani font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  
                  {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 z-30 bg-accent/90 backdrop-blur-md text-black px-3 py-1 rounded-md text-sm font-rajdhani font-semibold">
                      {discountPercentage}% OFF
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Navigation */}
                <div className="px-3 py-4 bg-dark-surface border-t border-gray-800">
                  <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
                    <div 
                      onClick={() => setSelectedImage(product.featuredImageUrl)}
                      className={`w-20 h-20 flex-shrink-0 rounded-md bg-cover bg-center cursor-pointer transform transition-all duration-300 hover:scale-105 ${selectedImage === product.featuredImageUrl ? 'ring-2 ring-primary scale-105' : 'ring-1 ring-gray-700'}`}
                      style={{ backgroundImage: `url(${product.featuredImageUrl})` }}
                    ></div>
                    
                    {product.imagesUrls?.map((img, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-20 flex-shrink-0 rounded-md bg-cover bg-center cursor-pointer transform transition-all duration-300 hover:scale-105 ${selectedImage === img ? 'ring-2 ring-primary scale-105' : 'ring-1 ring-gray-700'}`}
                        style={{ backgroundImage: `url(${img})` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="flex flex-col">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="hover:text-primary transition-colors cursor-pointer">Home</span>
                  <ChevronRight className="w-3 h-3 mx-1" />
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    {product.category}
                  </span>
                  <ChevronRight className="w-3 h-3 mx-1" />
                  <span className="text-gray-300 truncate max-w-[150px]">{product.title}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-accent">
                  <Star className="w-4 h-4 fill-accent" />
                  <Star className="w-4 h-4 fill-accent" />
                  <Star className="w-4 h-4 fill-accent" />
                  <Star className="w-4 h-4 fill-accent" />
                  <Star className="w-4 h-4" />
                  <span className="ml-1 text-gray-300 text-sm">(4.0)</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-rajdhani mb-2 leading-tight text-gradient">
                {product.title}
              </h1>
              
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center text-gray-400 text-sm">
                  <Tag className="w-4 h-4 mr-1" />
                  <span className="capitalize">{product.category}</span>
                </div>
                {product.subcategory && (
                  <>
                    <span className="text-gray-600">•</span>
                    <div className="text-gray-400 text-sm capitalize">
                      {product.subcategory}
                    </div>
                  </>
                )}
                <span className="text-gray-600">•</span>
                <div className="text-gray-400 text-sm">
                  ID: {product.id}
                </div>
              </div>
              
              <div className="bg-dark-surface border border-gray-800 rounded-lg p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full"></div>
                
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-primary mr-4 font-rajdhani">
                    £{formattedPrice}
                  </span>
                  {formattedComparePrice && (
                    <span className="text-xl text-gray-500 line-through">
                      £{formattedComparePrice}
                    </span>
                  )}
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-300">Availability</span>
                      <span className={`font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mr-3 mt-0.5">
                      <Truck className="w-3 h-3 text-accent" />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-300">Free Shipping</span>
                      <span className="font-medium">Orders over £50 qualify for free shipping</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-300">Warranty</span>
                      <span className="font-medium">2 Year Limited Warranty</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-rajdhani text-lg font-semibold mb-2">Quantity</h3>
                  <div className="flex">
                    <div className="flex bg-dark-base rounded-md">
                      <button 
                        className="px-4 py-2 border border-gray-700 rounded-l-md hover:bg-dark-surface transition-colors"
                        onClick={decrementQuantity}
                      >-</button>
                      <span className="w-16 py-2 border-t border-b border-gray-700 flex items-center justify-center">
                        {quantity}
                      </span>
                      <button 
                        className="px-4 py-2 border border-gray-700 rounded-r-md hover:bg-dark-surface transition-colors"
                        onClick={incrementQuantity}
                      >+</button>
                    </div>
                    
                    <div className="ml-4 text-sm text-gray-400 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      <span>Max 10 per order</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    id="add-to-cart-button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-rajdhani font-bold text-lg py-6 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      ADD TO CART
                    </span>
                    <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-accent to-primary transition-transform duration-300"></span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex-1 border-accent text-accent hover:bg-accent/10 font-rajdhani font-bold py-6"
                  >
                    VIEW SIMILAR
                  </Button>
                </div>
                
                <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
                  <div className="flex items-center border-r border-gray-700 pr-3 mr-3">
                    <Check className="w-4 h-4 text-green-400 mr-1" />
                    Secure Payment
                  </div>
                  <div className="flex items-center border-r border-gray-700 pr-3 mr-3">
                    <Check className="w-4 h-4 text-green-400 mr-1" />
                    30-Day Returns
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-1" />
                    2-Year Warranty
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-surface border border-gray-800 rounded-lg p-4">
                <div className="text-lg font-rajdhani font-semibold mb-3 flex items-center">
                  <div className="w-1 h-5 bg-primary mr-2"></div>
                  Quick Specs
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.specs).slice(0, 4).map(([key, value], index) => (
                    <div 
                      key={key}
                      className="flex justify-between items-center p-2 border border-gray-800 rounded bg-dark-base"
                    >
                      <span className="text-gray-400 capitalize">{key}</span>
                      <span className="text-accent font-medium text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="w-full mt-3 text-center py-2 text-sm font-medium text-accent hover:text-primary transition-colors"
                  onClick={() => scrollToSection(specsRef)}
                >
                  View All Specifications
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive 3D Component Visualization */}
        <section className="py-12 bg-dark-base relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
          
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-1/2">
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent mr-3"></div>
                    <h2 className="text-3xl font-bold font-rajdhani">Interactive Visualization</h2>
                  </div>
                  <p className="text-gray-400">
                    Experience this product through our interactive 3D viewer. Rotate and zoom to explore all features and details.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-dark-surface rounded-lg p-4 border border-gray-800 hover:border-primary/30 transition-colors group cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-primary">1</span>
                      </div>
                      <div>
                        <h3 className="font-rajdhani font-semibold text-lg group-hover:text-primary transition-colors">Drag to Rotate</h3>
                        <p className="text-sm text-gray-400">Click and drag the model to view it from different angles</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-surface rounded-lg p-4 border border-gray-800 hover:border-accent/30 transition-colors group cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-accent">2</span>
                      </div>
                      <div>
                        <h3 className="font-rajdhani font-semibold text-lg group-hover:text-accent transition-colors">Scroll to Zoom</h3>
                        <p className="text-sm text-gray-400">Use your mouse wheel to zoom in and examine details</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-surface rounded-lg p-4 border border-gray-800 hover:border-primary/30 transition-colors group cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-primary">3</span>
                      </div>
                      <div>
                        <h3 className="font-rajdhani font-semibold text-lg group-hover:text-primary transition-colors">Tap to Highlight</h3>
                        <p className="text-sm text-gray-400">Click on specific parts to highlight and learn more</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-md">
                  {/* 3D Visualization Placeholder */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-full"></div>
                  
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 animate-spin-slow"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-full bg-dark-surface border border-gray-800 shadow-lg flex items-center justify-center relative overflow-hidden">
                      {/* Inner Circular Elements */}
                      <div className="absolute w-full h-full rounded-full animate-reverse-spin-slow opacity-30">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-primary"></div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-accent"></div>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-1 bg-primary"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-1 bg-accent"></div>
                      </div>
                      
                      {/* Product Image */}
                      <div 
                        className="w-3/5 h-3/5 transform perspective-1000 hover:scale-110 transition-transform duration-700 float"
                        style={{ 
                          backgroundImage: `url(${product.featuredImageUrl})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      ></div>
                      
                      {/* Floating Dots */}
                      <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-primary pulse-glow"></div>
                      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full bg-accent pulse-glow" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-1/3 left-1/5 w-2 h-2 rounded-full bg-primary pulse-glow" style={{ animationDelay: '1.5s' }}></div>
                      <div className="absolute bottom-1/3 right-1/5 w-2 h-2 rounded-full bg-accent pulse-glow" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>
                  
                  {/* Tech Specs Labels */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-surface border border-primary/30 px-3 py-1 rounded-full text-xs font-rajdhani text-primary">
                    PERFORMANCE
                  </div>
                  
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-dark-surface border border-accent/30 px-3 py-1 rounded-full text-xs font-rajdhani text-accent">
                    RELIABILITY
                  </div>
                  
                  <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-surface border border-primary/30 px-3 py-1 rounded-full text-xs font-rajdhani text-primary">
                    FEATURES
                  </div>
                  
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-dark-surface border border-accent/30 px-3 py-1 rounded-full text-xs font-rajdhani text-accent">
                    QUALITY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs Section */}
        <section 
          ref={specsRef}
          className="py-16 bg-dark-surface relative"
        >
          <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-accent mr-4"></div>
              <h2 className="text-3xl font-bold font-rajdhani">Technical Specifications</h2>
            </div>
            
            <div className="bg-dark-card border border-gray-800 rounded-lg p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
              
              {/* Display HTML specifications if available */}
              {product.specsHtml ? (
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.specsHtml }} />
                </div>
              ) : (
                /* Fall back to key-value specs if HTML specs aren't available */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <div 
                      key={key} 
                      className="relative bg-dark-base border border-gray-800 rounded-lg overflow-hidden group transition-all duration-300 hover:border-accent/30"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent"></div>
                      
                      <div className="p-4 relative z-10">
                        <h3 className="font-rajdhani text-xl font-semibold mb-2 text-accent group-hover:text-primary transition-colors capitalize flex items-center">
                          <div className="w-1 h-4 bg-accent mr-2 group-hover:bg-primary transition-colors"></div>
                          {key}
                        </h3>
                        
                        <div className="bg-dark-surface p-3 rounded border border-gray-800 mt-2">
                          <span className="text-gray-200 font-medium">{String(value)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8 p-4 bg-dark-base rounded-lg border border-gray-800">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-rajdhani font-semibold text-lg mb-1">Compatibility Note</h4>
                    <p className="text-gray-400 text-sm">
                      All specifications are provided by the manufacturer and are subject to change. 
                      Some features may require additional hardware or software. Performance may vary 
                      based on system configuration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Description Section */}
        <section 
          ref={descriptionRef}
          className="py-16 bg-dark-base relative"
        >
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-20 left-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-primary mr-4"></div>
              <h2 className="text-3xl font-bold font-rajdhani">Product Description</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="border-0 shadow-lg bg-dark-card relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-30"></div>
                  
                  <div className="p-6 md:p-8 relative z-10">
                    <div className="prose prose-invert max-w-none">
                      <div className="mb-8 text-lg leading-relaxed">
                        {product.description}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                        <div className="bg-dark-surface rounded-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-primary/10 border border-gray-800">
                          <h3 className="text-xl font-bold font-rajdhani mb-4 text-primary flex items-center">
                            <span className="text-primary mr-2">⚡</span> Performance
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                              <span>High-performance design for demanding tasks</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                              <span>Optimized for both power efficiency and speed</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                              <span>Engineered with premium-grade components</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-dark-surface rounded-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-accent/10 border border-gray-800">
                          <h3 className="text-xl font-bold font-rajdhani mb-4 text-accent flex items-center">
                            <span className="text-accent mr-2">✓</span> Reliability
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                              <span>Rigorously tested for stability and durability</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                              <span>Designed to perform in challenging conditions</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                              <span>Industry-leading 2-year warranty included</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div>
                <Card className="border-0 shadow-lg bg-dark-card relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent"></div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-bold font-rajdhani mb-6 flex items-center">
                      <div className="w-1 h-5 bg-accent mr-3"></div>
                      Features & Benefits
                    </h3>
                    
                    <div className="space-y-5">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-primary">1</span>
                        </div>
                        <div>
                          <h4 className="font-rajdhani font-semibold text-lg">Premium Quality</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            Built with high-grade materials and components for superior performance and longevity.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-accent">2</span>
                        </div>
                        <div>
                          <h4 className="font-rajdhani font-semibold text-lg">Advanced Design</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            Engineered for optimal performance with innovative features that enhance functionality.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-primary">3</span>
                        </div>
                        <div>
                          <h4 className="font-rajdhani font-semibold text-lg">Exceptional Value</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            Competitive pricing without compromising on quality or performance standards.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 border-t border-gray-800 pt-6">
                      <h4 className="font-rajdhani font-semibold text-lg mb-4">Ratings & Reviews</h4>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="flex space-x-1 text-accent mr-2">
                            <Star className="w-4 h-4 fill-accent" />
                            <Star className="w-4 h-4 fill-accent" />
                            <Star className="w-4 h-4 fill-accent" />
                            <Star className="w-4 h-4 fill-accent" />
                            <Star className="w-4 h-4" />
                          </div>
                          <span className="text-lg font-bold">4.0</span>
                        </div>
                        <span className="text-sm text-gray-400">Based on 24 reviews</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-xs w-8">5★</span>
                          <div className="flex-1 h-2 bg-dark-base rounded-full overflow-hidden mx-2">
                            <div className="h-full bg-accent" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-xs w-8 text-right">65%</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-xs w-8">4★</span>
                          <div className="flex-1 h-2 bg-dark-base rounded-full overflow-hidden mx-2">
                            <div className="h-full bg-accent" style={{ width: '20%' }}></div>
                          </div>
                          <span className="text-xs w-8 text-right">20%</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-xs w-8">3★</span>
                          <div className="flex-1 h-2 bg-dark-base rounded-full overflow-hidden mx-2">
                            <div className="h-full bg-accent" style={{ width: '10%' }}></div>
                          </div>
                          <span className="text-xs w-8 text-right">10%</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-xs w-8">2★</span>
                          <div className="flex-1 h-2 bg-dark-base rounded-full overflow-hidden mx-2">
                            <div className="h-full bg-accent" style={{ width: '3%' }}></div>
                          </div>
                          <span className="text-xs w-8 text-right">3%</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-xs w-8">1★</span>
                          <div className="flex-1 h-2 bg-dark-base rounded-full overflow-hidden mx-2">
                            <div className="h-full bg-accent" style={{ width: '2%' }}></div>
                          </div>
                          <span className="text-xs w-8 text-right">2%</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline"
                        className="w-full mt-4 border-primary text-primary hover:bg-primary/10"
                        onClick={() => scrollToSection(reviewsRef)}
                      >
                        Read All Reviews
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Comparative Analysis Section */}
        <section className="py-16 bg-dark-base relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-3xl rounded-full"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-primary mr-4"></div>
              <h2 className="text-3xl font-bold font-rajdhani">Performance Analysis</h2>
            </div>
            
            <div className="bg-dark-card border border-gray-800 rounded-lg p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-bl from-primary/10 to-transparent rounded-full opacity-30"></div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold font-rajdhani mb-2">Performance Metrics</h3>
                <p className="text-gray-400">
                  See how this product compares to industry standards across different performance metrics. 
                  All tests conducted under standardized conditions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-rajdhani font-semibold text-lg mb-4 flex items-center">
                    <div className="w-1 h-5 bg-primary mr-2"></div>
                    Benchmark Comparison
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Raw Performance</span>
                        <span className="text-primary font-bold">78%</span>
                      </div>
                      <div className="h-3 bg-dark-surface rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '78%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Below Average</span>
                        <span>Average</span>
                        <span>Outstanding</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Reliability Score</span>
                        <span className="text-primary font-bold">92%</span>
                      </div>
                      <div className="h-3 bg-dark-surface rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '92%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Below Average</span>
                        <span>Average</span>
                        <span>Outstanding</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Value Ratio</span>
                        <span className="text-primary font-bold">86%</span>
                      </div>
                      <div className="h-3 bg-dark-surface rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '86%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Below Average</span>
                        <span>Average</span>
                        <span>Outstanding</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">User Experience</span>
                        <span className="text-primary font-bold">95%</span>
                      </div>
                      <div className="h-3 bg-dark-surface rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '95%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Below Average</span>
                        <span>Average</span>
                        <span>Outstanding</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-rajdhani font-semibold text-lg mb-4 flex items-center">
                    <div className="w-1 h-5 bg-accent mr-2"></div>
                    Comparative Analysis
                  </h4>
                  
                  <div className="overflow-hidden rounded-lg border border-gray-800">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead className="bg-dark-surface">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Metric
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            This Product
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Industry Avg.
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Comparison
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-dark-base divide-y divide-gray-800">
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium">Performance Score</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-semibold text-primary">8.4/10</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-300">7.2/10</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-green-400">+16.7%</div>
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium">Durability Rating</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-semibold text-primary">9.2/10</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-300">8.5/10</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-green-400">+8.2%</div>
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium">Cost Efficiency</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-semibold text-primary">7.8/10</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-300">7.9/10</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-red-400">-1.3%</div>
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium">User Satisfaction</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-semibold text-primary">9.5/10</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-300">8.1/10</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-green-400">+17.3%</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-dark-surface rounded-lg border border-gray-800">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-sm">Green values indicate better than industry average</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                      <span className="text-sm">Red values indicate below industry average</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-800 pt-6">
                <h4 className="font-rajdhani font-semibold text-lg mb-4">Expert Analysis</h4>
                <div className="bg-dark-surface p-4 rounded-lg border border-gray-800">
                  <p className="text-gray-300">
                    Our expert team has evaluated this product against industry standards and competitor products. 
                    The analysis shows exceptional performance in reliability and user satisfaction metrics, 
                    with slightly higher than average cost. Overall, this product represents an excellent 
                    value proposition for users looking for premium performance and high reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Reviews Section */}
        <section 
          ref={reviewsRef}
          className="py-16 bg-dark-surface"
        >
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-accent mr-4"></div>
                <h2 className="text-3xl font-bold font-rajdhani">Customer Reviews</h2>
              </div>
              
              <Button 
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                Write a Review
              </Button>
            </div>
            
            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="w-full bg-dark-card border border-gray-800 p-1 rounded-lg mb-6">
                <TabsTrigger 
                  value="featured" 
                  className="font-rajdhani data-[state=active]:bg-dark-surface data-[state=active]:text-primary data-[state=active]:shadow py-2 rounded-md"
                >
                  Featured Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="latest" 
                  className="font-rajdhani data-[state=active]:bg-dark-surface data-[state=active]:text-primary data-[state=active]:shadow py-2 rounded-md"
                >
                  Latest
                </TabsTrigger>
                <TabsTrigger 
                  value="positive" 
                  className="font-rajdhani data-[state=active]:bg-dark-surface data-[state=active]:text-primary data-[state=active]:shadow py-2 rounded-md"
                >
                  Highest Rated
                </TabsTrigger>
                <TabsTrigger 
                  value="critical" 
                  className="font-rajdhani data-[state=active]:bg-dark-surface data-[state=active]:text-primary data-[state=active]:shadow py-2 rounded-md"
                >
                  Critical Reviews
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="featured" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Featured Review 1 */}
                  <Card className="border-0 shadow-lg bg-dark-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-500"></div>
                    
                    <div className="p-6 relative">
                      <div className="absolute top-3 right-3">
                        <div className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-white font-bold mr-3">
                          M
                        </div>
                        <div>
                          <h4 className="font-semibold">Michael T.</h4>
                          <div className="flex items-center text-xs text-gray-400">
                            <span>Verified Purchase</span>
                            <span className="mx-2">•</span>
                            <span>3 days ago</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 text-accent mb-3">
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Absolutely Outstanding!</h3>
                      
                      <p className="text-gray-300 text-sm mb-4">
                        This product exceeded all my expectations. The quality is exceptional and the 
                        performance is unmatched compared to anything else I've tried in this price range. 
                        The attention to detail is evident in every aspect of this product.
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                          Found this review helpful?
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-xs px-3 py-1 bg-dark-surface rounded-full border border-gray-700 hover:border-primary/50 transition-colors">
                            Yes (24)
                          </button>
                          <button className="text-xs px-3 py-1 bg-dark-surface rounded-full border border-gray-700 hover:border-primary/50 transition-colors">
                            No (2)
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Featured Review 2 */}
                  <Card className="border-0 shadow-lg bg-dark-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent"></div>
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-accent/5 rounded-full group-hover:bg-accent/10 transition-colors duration-500"></div>
                    
                    <div className="p-6 relative">
                      <div className="absolute top-3 right-3">
                        <div className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center text-white font-bold mr-3">
                          S
                        </div>
                        <div>
                          <h4 className="font-semibold">Sarah K.</h4>
                          <div className="flex items-center text-xs text-gray-400">
                            <span>Verified Purchase</span>
                            <span className="mx-2">•</span>
                            <span>1 week ago</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 text-accent mb-3">
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5" />
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">Highly Recommended</h3>
                      
                      <p className="text-gray-300 text-sm mb-4">
                        After months of research, I decided on this product and I couldn't be happier. 
                        Installation was simple and it worked perfectly from the start. The only minor issue 
                        is that the manual could be a bit more detailed, but that's a small complaint.
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                          Found this review helpful?
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-xs px-3 py-1 bg-dark-surface rounded-full border border-gray-700 hover:border-accent/50 transition-colors">
                            Yes (18)
                          </button>
                          <button className="text-xs px-3 py-1 bg-dark-surface rounded-full border border-gray-700 hover:border-accent/50 transition-colors">
                            No (1)
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Featured Review 3 */}
                  <Card className="border-0 shadow-lg bg-dark-card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-500"></div>
                    
                    <div className="p-6 relative">
                      <div className="absolute top-3 right-3">
                        <div className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-white font-bold mr-3">
                          J
                        </div>
                        <div>
                          <h4 className="font-semibold">James R.</h4>
                          <div className="flex items-center text-xs text-gray-400">
                            <span>Verified Purchase</span>
                            <span className="mx-2">•</span>
                            <span>2 weeks ago</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 text-accent mb-3">
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 fill-accent" />
                        <Star className="w-5 h-5 half-filled" />
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Great Value For Money</h3>
                      
                      <p className="text-gray-300 text-sm mb-4">
                        I've been using this for about two weeks now and I'm impressed with the quality. 
                        It's more robust than I expected and performs consistently even under heavy load. 
                        The customer support was also excellent when I had questions.
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                          Found this review helpful?
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-xs px-3 py-1 bg-dark-surface rounded-full border border-gray-700 hover:border-primary/50 transition-colors">
                            Yes (31)
                          </button>
                          <button className="text-xs px-3 py-1 bg-dark-surface rounded-full border border-gray-700 hover:border-primary/50 transition-colors">
                            No (4)
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="latest" className="mt-0">
                <div className="bg-dark-surface rounded-lg p-4 border border-gray-800 text-gray-400 text-center">
                  <p>Latest reviews will appear here. Check back soon for updates.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="positive" className="mt-0">
                <div className="bg-dark-surface rounded-lg p-4 border border-gray-800 text-gray-400 text-center">
                  <p>Highest rated reviews will appear here. Check back soon for updates.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="critical" className="mt-0">
                <div className="bg-dark-surface rounded-lg p-4 border border-gray-800 text-gray-400 text-center">
                  <p>Critical reviews will appear here. Check back soon for updates.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline"
                className="border-gray-700 text-gray-300 hover:border-accent hover:text-accent"
              >
                Load More Reviews
              </Button>
            </div>
          </div>
        </section>
        
        {/* Related Products Section */}
        <section className="py-16 bg-dark-base">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-primary mr-4"></div>
              <h2 className="text-3xl font-bold font-rajdhani">You May Also Like</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div 
                  key={item}
                  className="bg-dark-card rounded-lg overflow-hidden border border-gray-800 group hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-video bg-dark-surface relative overflow-hidden">
                    <div className="absolute inset-0 bg-dark-base/50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/4 h-3/4 bg-dark-surface rounded-md"></div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-base to-transparent h-16"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-rajdhani font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      Related Product {item}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1 text-accent">
                        <Star className="w-3 h-3 fill-accent" />
                        <Star className="w-3 h-3 fill-accent" />
                        <Star className="w-3 h-3 fill-accent" />
                        <Star className="w-3 h-3 fill-accent" />
                        <Star className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-gray-400">(16)</span>
                    </div>
                    
                    <div className="mt-2 mb-3 text-sm text-gray-400">Category Name</div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-primary">£199.99</span>
                      <Button
                        size="sm"
                        className="bg-dark-surface hover:bg-primary/10 border border-primary/30 text-primary"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Fixed Specs Panel */}
        <div 
          className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-50 transition-transform duration-500 ${showSpecsPanel ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
            <button 
              onClick={() => setShowSpecsPanel(!showSpecsPanel)}
              className="bg-primary text-white px-2 py-8 rounded-l-md flex items-center justify-center"
            >
              <span className="transform -rotate-90 font-rajdhani font-bold">
                {showSpecsPanel ? 'CLOSE' : 'SPECS'}
              </span>
            </button>
          </div>
          
          <div className="w-80 bg-dark-card border-l border-t border-b border-gray-800 shadow-lg h-[80vh] overflow-auto custom-scrollbar">
            <div className="p-4 border-b border-gray-800 bg-dark-surface sticky top-0 z-10">
              <h3 className="font-rajdhani font-bold text-xl">Quick Specifications</h3>
            </div>
            
            <div className="p-4 space-y-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div 
                  key={key}
                  className="border border-gray-800 rounded bg-dark-base p-3"
                >
                  <div className="text-sm text-gray-400 mb-1 capitalize">{key}</div>
                  <div className="font-medium text-accent">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPageV2;