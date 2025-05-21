import React, { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AddToPCBuilder from "@/components/products/AddToPCBuilder";
import CartButton from "@/components/cart/CartButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight,
  Truck, 
  Shield, 
  Award, 
  Keyboard, 
  Settings, 
  Wifi, 
  Sliders, 
  Heart,
  CheckCircle2,
  Flame,
  Cpu,
  Monitor,
  HardDrive,
  Zap,
  Fan,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  PcCase,
  MemoryStick,
  Plus,
  Minus,
  X,
  ExternalLink,
  Info,
  PlayCircle,
  Share2,
  Download,
  ThumbsUp,
  MessageSquare,
  BarChart3,
  LightbulbIcon,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Product: React.FC = () => {
  const [match, params] = useRoute<{ handle: string }>("/products/:handle");
  const productHandle = params?.handle;
  const [showDetails, setShowDetails] = useState(false);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [isSticky, setIsSticky] = useState(false);
  
  // Handle scroll for sticky product info
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${productHandle}`],
    enabled: !!productHandle,
    staleTime: 60 * 1000,
  });

  // Fallback data for render
  const productData = product || {
    id: 1,
    title: "Vortex Pro X Gaming PC",
    handle: "vortex-pro-x",
    description: "Experience gaming at its finest with the Vortex Pro X. This flagship gaming PC is equipped with top-tier components to deliver exceptional 4K gaming performance with high framerates. Perfect for competitive gamers and enthusiasts who demand the very best.",
    price: "3499.99",
    compareAtPrice: "3699.99",
    category: "vortex",
    imagesUrls: [
      "https://pixabay.com/get/g27530805296928ef179c4da247aaa59fa30395477b410fd37a141243234f103f2410e55593b81f6a4e14001f79cc7301e996856c6b8e1e671366a38b96cdf87e_1280.jpg",
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080",
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=380",
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=380"
    ],
    specs: {
      "CPU": "Intel Core i9-13900K (24 cores, 5.8GHz)",
      "GPU": "NVIDIA GeForce RTX 4090 24GB GDDR6X",
      "RAM": "64GB DDR5-6000MHz RGB (2x32GB)",
      "Storage": "2TB NVMe Gen4 SSD + 4TB HDD",
      "Motherboard": "ASUS ROG Maximus Z790 Hero",
      "Power Supply": "1200W 80+ Platinum Fully Modular",
      "Cooling": "360mm AIO Liquid Cooler RGB",
      "Case": "Lian Li PC-O11 Dynamic XL RGB"
    },
    features: [
      "Ray tracing enabled for realistic lighting effects",
      "DLSS 3.0 for AI enhanced frame generation",
      "Silent operation with optimized airflow",
      "Premium RGB lighting with 16.8 million colors",
      "Tool-less design for easy upgrades",
      "Pre-installed Windows 11 Pro"
    ],
    relatedProducts: [2, 3, 4]
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(parseFloat(price));
  };

  const toggleWishlist = () => {
    setIsWishlistActive(!isWishlistActive);
  };

  const getPerformanceScore = (score: number) => {
    if (score >= 90) return "Exceptional";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 50) return "Average";
    return "Basic";
  };

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'cpu':
      case 'processor':
        return <Cpu className="w-5 h-5" />;
      case 'gpu':
      case 'graphics':
        return <Monitor className="w-5 h-5" />;
      case 'motherboard':
        return <Settings className="w-5 h-5" />;
      case 'ram':
      case 'memory':
        return <MemoryStick className="w-5 h-5" />;
      case 'storage':
      case 'ssd':
      case 'hdd':
        return <HardDrive className="w-5 h-5" />;
      case 'psu':
      case 'power':
        return <Zap className="w-5 h-5" />;
      case 'cooling':
        return <Fan className="w-5 h-5" />;
      case 'case':
        return <PcCase className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/collections/all">View All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{productData.title} - RigFreaks Gaming PCs</title>
        <meta name="description" content={productData.description.substring(0, 160)} />
        <meta property="og:title" content={`${productData.title} - RigFreaks Gaming PCs`} />
        <meta property="og:description" content={productData.description.substring(0, 160)} />
        <meta property="og:image" content={productData.imagesUrls[0]} />
        <meta property="og:url" content={`https://rigfreaks.com/products/${productData.handle}`} />
        <meta property="og:type" content="product" />
      </Helmet>
      
      <div className="bg-gradient-to-b from-black via-black to-gray-900">
        {/* Hero section with product name and category */}
        <div className="bg-gradient-to-r from-gray-900 to-black py-8 border-b border-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center mb-2 space-x-2 text-sm text-gray-400">
                  <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link href={`/collections/${productData.category}`} className="hover:text-primary transition-colors">
                    {productData.category.charAt(0).toUpperCase() + productData.category.slice(1)}
                  </Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-gray-300 truncate max-w-[200px]">{productData.title}</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold font-rajdhani leading-tight">
                  {productData.title}
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1.5">
                  Featured
                </Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 px-3 py-1.5">
                  In Stock
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl py-12">
          {/* Main product layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left column - Product Gallery and Specs */}
            <div className="lg:col-span-7 space-y-8">
              {/* Product Gallery */}
              <ProductGallery 
                images={productData.imagesUrls} 
                title={productData.title} 
              />
              
              {/* Mobile price and action buttons - visible on small screens */}
              <div className="lg:hidden bg-dark-surface border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold">{formatPrice(productData.price)}</span>
                      {productData.compareAtPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(productData.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    {productData.compareAtPrice && (
                      <Badge className="bg-green-600">
                        Save {Math.round((1 - parseFloat(productData.price) / parseFloat(productData.compareAtPrice)) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "rounded-full border-gray-700",
                      isWishlistActive ? "text-red-500 border-red-500/50 bg-red-500/10" : "text-gray-400"
                    )}
                    onClick={toggleWishlist}
                  >
                    <Heart className={cn("h-5 w-5", isWishlistActive ? "fill-red-500" : "")} />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <CartButton 
                    productId={productData.id}
                    productTitle={productData.title}
                    price={parseFloat(productData.price)}
                    className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white"
                  />
                  <AddToPCBuilder 
                    productId={productData.id} 
                    productTitle={productData.title} 
                    className="w-full h-10 border-gray-700 hover:bg-dark-surface"
                  />
                </div>
              </div>
              
              {/* Product Details Cards */}
              <div className="space-y-6">
                {/* Key Features Card */}
                <Card className="bg-dark-surface border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-rajdhani">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Feature 1 */}
                      <div className="flex space-x-3 p-3 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-gray-800/50">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Keyboard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">96% Layout</h3>
                          <p className="text-sm text-gray-400">Compact design without sacrificing functionality</p>
                        </div>
                      </div>
                      
                      {/* Feature 2 */}
                      <div className="flex space-x-3 p-3 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-gray-800/50">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Settings className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Hot-swappable</h3>
                          <p className="text-sm text-gray-400">Easily replace switches for customization</p>
                        </div>
                      </div>
                      
                      {/* Feature 3 */}
                      <div className="flex space-x-3 p-3 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-gray-800/50">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Wifi className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Tri-mode Connectivity</h3>
                          <p className="text-sm text-gray-400">Bluetooth, 2.4GHz wireless, and USB</p>
                        </div>
                      </div>
                      
                      {/* Feature 4 */}
                      <div className="flex space-x-3 p-3 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-gray-800/50">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Sliders className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Ergonomic Design</h3>
                          <p className="text-sm text-gray-400">Detachable wrist rest and three tilt angles</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Technical Specifications Preview */}
                <Card className="bg-dark-surface border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-rajdhani">Technical Specifications</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary/80 font-medium"
                      onClick={() => setActiveTab("specs")}
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                      {Object.entries(productData.specs).slice(0, 6).map(([key, value], index) => (
                        <div key={index} className="flex items-center space-x-2 py-1 border-b border-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                            {getCategoryIcon(key)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{key}</p>
                            <p className="text-sm text-gray-400 truncate">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Performance Benchmarks Card */}
                <Card className="bg-dark-surface border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-rajdhani">Performance at a Glance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {/* Gaming Performance */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              <Flame className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-medium">Gaming Performance</span>
                          </div>
                          <span className="text-primary font-medium">{getPerformanceScore(88)}</span>
                        </div>
                        <Progress value={88} className="h-2 bg-gray-800" />
                        <p className="text-xs text-gray-400">Perfect for 1080p gaming with high framerates</p>
                      </div>
                      
                      {/* Typing Experience */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                              <Keyboard className="h-5 w-5 text-green-500" />
                            </div>
                            <span className="font-medium">Typing Experience</span>
                          </div>
                          <span className="text-green-500 font-medium">{getPerformanceScore(95)}</span>
                        </div>
                        <Progress value={95} className="h-2 bg-gray-800" />
                        <p className="text-xs text-gray-400">Premium tactile feel with minimal noise</p>
                      </div>
                      
                      {/* Connectivity */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                              <Wifi className="h-5 w-5 text-blue-500" />
                            </div>
                            <span className="font-medium">Connectivity</span>
                          </div>
                          <span className="text-blue-500 font-medium">{getPerformanceScore(92)}</span>
                        </div>
                        <Progress value={92} className="h-2 bg-gray-800" />
                        <p className="text-xs text-gray-400">Versatile with multiple connection options</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Mobile Tab Navigation */}
                <div className="lg:hidden border-t border-gray-800 pt-6">
                  <Tabs defaultValue="specs" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full bg-dark-surface border border-gray-800 rounded-lg p-1">
                      <TabsTrigger value="specs" className="flex-1">Specifications</TabsTrigger>
                      <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                      <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="specs" className="mt-4">
                      <div className="bg-dark-surface rounded-lg border border-gray-800 p-4">
                        <ScrollArea className="h-[400px] pr-4">
                          <SpecTable specs={productData.specs} specsHtml={productData.specsHtml} />
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="features" className="mt-4">
                      <div className="bg-dark-surface rounded-lg border border-gray-800 p-4">
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-xl font-rajdhani font-bold mb-3 flex items-center">
                                <Keyboard className="h-5 w-5 text-primary mr-2" />
                                Strix Scope II Design
                              </h3>
                              <p className="text-gray-300 mb-3">
                                The ASUS ROG Strix Scope II 96 is a wireless keyboard that packs a full set of UK ISO keys into a compact 96% form factor. All of the functionality while saving on space! The durable keycaps are illuminated by vibrant RGB lighting with 8 preset effects, which you can customise via Aura Creator. The keyboard also features a special Function key which changes the F1 to F12 keys to media control options.
                              </p>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-rajdhani font-bold mb-3 flex items-center">
                                <Settings className="h-5 w-5 text-primary mr-2" />
                                Tactile Controls
                              </h3>
                              <p className="text-gray-300 mb-3">
                                The ROG Strix Scope II 96 uses ROG NX Snow mechanical key switches that are pre-lubricated for smooth actuation. These are hot-swappable, meaning you can easily replace them with ROG NX switches for more customisation. These are designed for actuation with low-to-mid keypress force. For added comfort, the keyboard features hot keys for Windows' Gaming features.
                              </p>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-rajdhani font-bold mb-3 flex items-center">
                                <Wifi className="h-5 w-5 text-primary mr-2" />
                                Tri-Mode Connectivity
                              </h3>
                              <p className="text-gray-300 mb-3">
                                The keyboard uses tri-mode connectivity through Bluetooth, 2.4GHz RF and wired USB. The RF dongle is stored in a compartment in the keyboard itself, for on-the-go usage. On a full charge, the keyboard can be used for up to 386 hours with no RGB lighting on Bluetooth. When RGB is on 100% brightness, this is shortened to 76 hours on Bluetooth or 63 hours using RF.
                              </p>
                            </div>
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="mt-4">
                      <div className="bg-dark-surface rounded-lg border border-gray-800 p-4">
                        <div className="text-center py-6">
                          <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                          <p className="text-gray-400 mb-4 text-sm">Be the first to review this product.</p>
                          <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-dark-base text-sm">
                            Write a Review
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              
            </div>
            
            {/* Right column - Product Info and Checkout */}
            <div className="lg:col-span-5">
              <div className={cn(
                "lg:sticky space-y-6 transition-all duration-300",
                isSticky ? "lg:top-6" : "lg:top-6"
              )}>
                {/* Product Info Card */}
                <Card className="bg-dark-surface border-gray-800">
                  <CardContent className="p-6">
                    {/* Price and action buttons */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-3xl font-bold">{formatPrice(productData.price)}</span>
                          {productData.compareAtPrice && (
                            <span className="text-base text-muted-foreground line-through">
                              {formatPrice(productData.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        {productData.compareAtPrice && (
                          <Badge className="bg-green-600">
                            Save {Math.round((1 - parseFloat(productData.price) / parseFloat(productData.compareAtPrice)) * 100)}%
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={cn(
                          "rounded-full border-gray-700",
                          isWishlistActive ? "text-red-500 border-red-500/50 bg-red-500/10" : "text-gray-400"
                        )}
                        onClick={toggleWishlist}
                      >
                        <Heart className={cn("h-5 w-5", isWishlistActive ? "fill-red-500" : "")} />
                      </Button>
                    </div>
                    
                    {/* Availability and shipping */}
                    <div className="flex flex-col gap-3 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800/50">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium">Availability</span>
                        </div>
                        <span className="text-sm text-green-500">In Stock</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800/50">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm font-medium">Shipping</span>
                        </div>
                        <span className="text-sm">Free</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-800/50">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm font-medium">Warranty</span>
                        </div>
                        <span className="text-sm">2 Years</span>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="space-y-3 mb-6">
                      <CartButton 
                        productId={productData.id}
                        productTitle={productData.title}
                        price={parseFloat(productData.price)}
                        className="w-full h-14 text-base font-medium bg-primary hover:bg-primary/90 text-white"
                      />
                      <AddToPCBuilder 
                        productId={productData.id} 
                        productTitle={productData.title} 
                        className="w-full h-12 border-gray-700 hover:bg-dark-surface"
                      />
                    </div>
                    
                    {/* Key tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                        96% Layout
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                        ROG NX Snow Switches
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                        Tri-mode Connectivity
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                        Hot-swappable
                      </div>
                    </div>
                    
                    {/* Description with expandable section */}
                    <div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-2">
                        Take your typing experience to a whole new level with the ASUS ROG Strix Scope II. This wireless gaming keyboard packs the functionality of a full-size keyboard into a 96% frame, saving precious desk space without compromising on performance.
                      </p>
                      
                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-gray-300 text-sm leading-relaxed mb-2"
                        >
                          <p className="mb-2">
                            Equipped with RX Snow switches, tri-mode connectivity, and hot-swapping, this keyboard is a vital addition to your gaming setup. Plus, the detachable wrist rest and three-tier feet ensure you'll stay comfortable as you game for hours on end.
                          </p>
                          <p>
                            The keyboard features customizable RGB lighting with 8 preset effects that you can personalize via Aura Creator, adding a vibrant touch to your gaming station.
                          </p>
                        </motion.div>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        className="text-primary p-0 h-auto text-sm font-medium hover:bg-transparent hover:text-primary/80" 
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        {showDetails ? "Show Less" : "Show More"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Services and Support Card */}
                <Card className="bg-dark-surface border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Premium Services & Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Free Express Shipping</h4>
                        <p className="text-xs text-gray-400">Delivered in 2-5 business days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">2-Year Extended Warranty</h4>
                        <p className="text-xs text-gray-400">All parts and labor covered</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Quality Tested</h4>
                        <p className="text-xs text-gray-400">48-hour stress test on all systems</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Desktop Product details tabs */}
          <div className="hidden lg:block mt-16 border-t border-gray-800 pt-12">
            <Tabs defaultValue="specs" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-8 border-b border-gray-800 bg-transparent w-full justify-start space-x-8 rounded-none px-0">
                <TabsTrigger 
                  value="specs" 
                  className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none pb-4 bg-transparent data-[state=active]:bg-transparent"
                >
                  Technical Specifications
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none pb-4 bg-transparent data-[state=active]:bg-transparent"
                >
                  Features & Details
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none pb-4 bg-transparent data-[state=active]:bg-transparent"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="faq" 
                  className="text-lg font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none pb-4 bg-transparent data-[state=active]:bg-transparent"
                >
                  FAQ
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="specs" className="mt-0">
                <div className="bg-dark-surface rounded-lg border border-gray-800 p-8">
                  <SpecTable specs={productData.specs} specsHtml={productData.specsHtml} />
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-0">
                <div className="bg-dark-surface rounded-lg border border-gray-800 p-8">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-rajdhani font-bold mb-3 flex items-center">
                        <Keyboard className="h-5 w-5 text-primary mr-2" />
                        Strix Scope II Design
                      </h3>
                      <p className="text-gray-300 mb-3">
                        The ASUS ROG Strix Scope II 96 is a wireless keyboard that packs a full set of UK ISO keys into a compact 96% form factor. All of the functionality while saving on space! The durable keycaps are illuminated by vibrant RGB lighting, which can be fully adjusted within ASUS Aura Sync software. Adding a splash of that classic ROG style, the spacebar features ROG markings with RGB shine through.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-rajdhani font-bold mb-3 flex items-center">
                        <Settings className="h-5 w-5 text-primary mr-2" />
                        NX Snow Switches
                      </h3>
                      <p className="text-gray-300 mb-3">
                        To elevate your typing experience, the ASUS ROG Strix Scope II 96 utilises ROG NX Snow switches and sound dampening materials to absorb any pinging or echoes. The NX Snow switches are linear, with a 1.8mm pre- and 4.0 total travel that requires 40gf force to actuate and 55gf to bottom out. They are perfect for rapid-fire keystrokes in the heat of battle.
                      </p>
                      <p className="text-gray-300 mb-3">
                        With both sound dampening foam and switch dampening pads, you can enjoy the thocky acoustics of every keystroke. What's more, the ASUS ROG Strix Scope II 96 features pre-lubricated ROG stabilisers on the longer keys. These keep each keystroke smooth and wobble free, as they reduce friction and enhance stability.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-rajdhani font-bold mb-3 flex items-center">
                        <Wifi className="h-5 w-5 text-primary mr-2" />
                        Tri-mode Connectivity
                      </h3>
                      <p className="text-gray-300 mb-3">
                        The ASUS ROG Strix Scope II 96 harnesses the convenience of tri-mode connectivity. This means you can connect via Bluetooth, 2.4GHz wireless, or USB. In Bluetooth mode, you can connect this keyboard up to three devices, adding some versatility to your set-up. In wireless, the ROG SpeedNova technology delivers low latency performance and enhanced battery life – up to 1,500+ hours!
                      </p>
                      <p className="text-gray-300 mb-3">
                        When you need to play and charge, the USB-C to USB-A cable enables to you to plug in and continue playing, even when battery is low.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-rajdhani font-bold mb-3 flex items-center">
                        <Sliders className="h-5 w-5 text-primary mr-2" />
                        On-the-Fly Control
                      </h3>
                      <p className="text-gray-300 mb-3">
                        The ASUS ROG Strix Scope II 96 puts control at your fingertips. The top righthand corner features a multi-function scroll button that can be used to adjust volume, media playback, and lighting. You can even assign your own use via Armoury Crate software!
                      </p>
                      <p className="text-gray-300 mb-3">
                        The first five F-keys are pre-set with Xbox Game Bar shortcuts, to optimise streaming control. F1 opens Game Bar, F2 print screens, F3 records the last 30 seconds of gameplay, F4 starts or pauses recording, and F5 can be used to mute or unmute your microphone.
                      </p>
                      <p className="text-gray-300">
                        In addition to this, you can map your own custom macros, either on the fly or within Armoury Crate. The ASUS ROG Strix Scope II 96 has on-board memory for the default profile and up to five custom schemes, so you can tailor this gaming keyboard to your every need.
                      </p>
                    </div>
                    
                    {/* Original features for compatibility */}
                    <div className="hidden">
                      {productData.features && productData.features.length > 0 ? (
                        <ul className="space-y-4">
                          {productData.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-3 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No feature information available for this product.</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <div className="bg-dark-surface rounded-lg border border-gray-800 p-8">
                  <div className="text-center py-10">
                    <h3 className="text-xl font-medium mb-3">No Reviews Yet</h3>
                    <p className="text-gray-400 mb-6">Be the first to review this product.</p>
                    <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-dark-base">
                      Write a Review
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-0">
                <div className="bg-dark-surface rounded-lg border border-gray-800 p-8">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-gray-800">
                      <AccordionTrigger className="hover:text-primary">
                        What switches does this keyboard use?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        The ASUS ROG Strix Scope II 96 uses ROG NX Snow mechanical switches that are pre-lubricated for smooth actuation. These switches are hot-swappable, allowing you to customize your keyboard by replacing them with other ROG NX switches.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2" className="border-gray-800">
                      <AccordionTrigger className="hover:text-primary">
                        How long does the battery last?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        On a full charge, the keyboard can be used for up to 386 hours with no RGB lighting when connected via Bluetooth. With RGB lighting at 100% brightness, battery life is approximately 76 hours on Bluetooth or 63 hours when using the 2.4GHz RF connection.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3" className="border-gray-800">
                      <AccordionTrigger className="hover:text-primary">
                        Is this keyboard compatible with Mac?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        Yes, the keyboard is compatible with Mac OS, though some function keys may work differently. For full functionality and customization options, the ASUS Armoury Crate software is recommended, which is primarily designed for Windows.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4" className="border-gray-800">
                      <AccordionTrigger className="hover:text-primary">
                        What's included in the box?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        The package includes the ASUS ROG Strix Scope II 96 keyboard, a detachable wrist rest, a USB-C to USB-A cable for wired connection and charging, a 2.4GHz RF dongle, a user manual, and warranty information.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5" className="border-gray-800">
                      <AccordionTrigger className="hover:text-primary">
                        How do I customize the RGB lighting?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        The RGB lighting can be customized using the ASUS Armoury Crate software, which allows you to select from 8 preset effects or create your own custom lighting profiles with the Aura Creator tool. Basic lighting effects can also be controlled directly from the keyboard using function key combinations.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related products section */}
          <div className="mt-16 pt-12 border-t border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-rajdhani">You May Also Like</h2>
              <Button variant="outline" className="border-gray-700 hover:bg-dark-surface">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Product cards would be mapped from data */}
              {/* Placeholder for 4 related products */}
              {[1, 2, 3, 4].map((_, index) => (
                <Card key={index} className="bg-dark-surface border-gray-800 group hover:border-primary transition-all duration-300 overflow-hidden">
                  <div className="aspect-square relative overflow-hidden bg-black/50">
                    <img 
                      src={index === 0 ? productData.imagesUrls[0] : `https://source.unsplash.com/random/300x300?gaming&sig=${index}`} 
                      alt="Related product" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    {index === 0 && (
                      <div className="absolute top-3 right-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                        Best Seller
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                      {index === 0 ? "ASUS ROG Rapture GT" : `Gaming Product ${index + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      Premium gaming peripheral with RGB lighting and customizable features
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">
                        {formatPrice((199.99 + index * 50).toString())}
                      </span>
                      <Button variant="outline" size="sm" className="h-8 rounded-full px-3 border-gray-700 hover:bg-gray-800">
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
