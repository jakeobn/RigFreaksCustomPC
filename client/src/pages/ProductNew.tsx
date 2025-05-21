import React, { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ImmerseGallery from "@/components/products/ImmerseGallery";
import SpecsVisualizer from "@/components/products/SpecsVisualizer";
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
  Clock,
  Lightbulb
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
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Helper to format prices
const formatPrice = (price: string) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(Number(price));
};

// Color option component
const ColorOption: React.FC<{
  name: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ name, color, isSelected, onClick }) => (
  <button
    className={`relative rounded-full h-10 w-10 border-2 transition-all duration-200 ${
      isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-700'
    }`}
    style={{ backgroundColor: color }}
    onClick={onClick}
    aria-label={name}
  >
    {isSelected && (
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
    )}
  </button>
);

// Feature card component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="feature-card bg-black border border-gray-900 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300">
    <div className="flex items-center space-x-3 mb-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

// Review component
const Review: React.FC<{
  author: string;
  rating: number;
  date: string;
  content: string;
  verified?: boolean;
}> = ({ author, rating, date, content, verified = false }) => (
  <div className="review border-b border-gray-800 py-4 last:border-0">
    <div className="flex justify-between items-start mb-2">
      <div>
        <div className="flex items-center space-x-2">
          <h4 className="font-medium">{author}</h4>
          {verified && (
            <Badge variant="outline" className="border-green-500/30 text-green-500 text-xs px-1.5 bg-green-500/10">
              Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-blue-500 fill-blue-500' : 'text-gray-600'}`} 
            />
          ))}
          <span className="text-xs text-gray-400 ml-2">{date}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 rounded-full px-2 text-xs"
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          Helpful
        </Button>
      </div>
    </div>
    <p className="text-gray-300 text-sm mt-2">{content}</p>
  </div>
);

const ProductNew: React.FC = () => {
  const [match, params] = useRoute<{ handle: string }>("/products/:handle");
  const productHandle = params?.handle;

  // Product interaction state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState("overview");
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);

  // UI state
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [isCartSticky, setIsCartSticky] = useState(false);

  // Section refs
  const overviewRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${productHandle}`],
    enabled: !!productHandle,
  });

  // Default product data while loading
  const productData = product || {
    id: '',
    title: 'Product',
    description: 'Loading product description...',
    price: '0',
    compareAtPrice: '0',
    imagesUrls: [],
    category: 'keyboard',
    brand: 'Unknown',
    specs: {},
    features: [],
    availability: 'In Stock',
    tags: [],
    handle: '',
  };

  // Product is only available in black
  const productColor = "Black";

  // Dummy FAQ data
  const faqItems = [
    {
      id: 'faq-1',
      question: 'What switches does this keyboard use?',
      answer: 'The ASUS ROG Strix Scope II 96 uses ROG NX Snow mechanical switches that are pre-lubricated for smooth actuation. These switches are hot-swappable, allowing you to customize your keyboard by replacing them with other ROG NX switches.'
    },
    {
      id: 'faq-2',
      question: 'How long does the battery last?',
      answer: 'On a full charge, the keyboard can be used for up to 386 hours with no RGB lighting when connected via Bluetooth. With RGB lighting at 100% brightness, battery life is approximately 76 hours on Bluetooth or 63 hours when using the 2.4GHz RF connection.'
    },
    {
      id: 'faq-3',
      question: 'Is this keyboard compatible with Mac?',
      answer: 'Yes, the keyboard is compatible with Mac OS, though some function keys may work differently. For full functionality and customization options, the ASUS Armoury Crate software is recommended, which is primarily designed for Windows.'
    },
    {
      id: 'faq-4',
      question: 'What\'s included in the box?',
      answer: 'The package includes the ASUS ROG Strix Scope II 96 keyboard, a detachable wrist rest, a USB-C to USB-A cable for wired connection and charging, a 2.4GHz RF dongle, a user manual, and warranty information.'
    },
    {
      id: 'faq-5',
      question: 'How do I customize the RGB lighting?',
      answer: 'The RGB lighting can be customized using the ASUS Armoury Crate software, which allows you to select from 8 preset effects or create your own custom lighting profiles with the Aura Creator tool. Basic lighting effects can also be controlled directly from the keyboard using function key combinations.'
    }
  ];

  // Related products (would normally come from API)
  const relatedProducts = [
    {
      id: 1,
      title: "ASUS ROG Strix G15 Gaming Laptop",
      price: "1499.99",
      imageUrl: "https://source.unsplash.com/random/300x300?gaming=laptop",
      discount: 15,
      isNew: true
    },
    {
      id: 2,
      title: "ASUS ROG Gladius III Mouse",
      price: "89.99",
      imageUrl: "https://source.unsplash.com/random/300x300?gaming=mouse",
      discount: 0,
      isNew: false
    },
    {
      id: 3,
      title: "ASUS ROG Delta Headset",
      price: "129.99",
      imageUrl: "https://source.unsplash.com/random/300x300?gaming=headset",
      discount: 10,
      isNew: false
    },
    {
      id: 4,
      title: "ASUS ROG Claymore II Keyboard",
      price: "249.99",
      imageUrl: "https://source.unsplash.com/random/300x300?gaming=keyboard",
      discount: 0,
      isNew: true
    }
  ];

  // Handle sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsHeaderSticky(scrollPosition > 100);
      setIsCartSticky(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle section navigation
  const scrollToSection = (section: string) => {
    setActiveSection(section);

    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      overview: overviewRef,
      specs: specsRef,
      features: featuresRef,
      reviews: reviewsRef,
      faq: faqRef
    };

    const ref = refs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Quantity handlers
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  // Add to cart handler
  const handleAddToCart = () => {
    console.log("Added to cart:", productData.title, "Quantity:", quantity, "Color:", productColor);
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    setIsWishlistActive(!isWishlistActive);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h2>
        <p className="mb-6">We couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{productData.title} | RigFreaks</title>
        <meta name="description" content={productData.description.substring(0, 160)} />
      </Helmet>

      {/* Sticky navigation header */}
      <div 
        className={cn(
          "product-nav transition-all duration-300 z-10 w-full bg-[rgba(31,41,55,0.6)]",
          isHeaderSticky ? "sticky top-0 shadow-lg shadow-black/40" : ""
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Product title (visible when sticky) */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="md:hidden"
              >
                <Link href="/products">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h2 className={cn(
                "font-medium transition-all duration-300",
                isHeaderSticky ? "opacity-100 text-base" : "opacity-0 text-xs"
              )}>
                {productData.title}
              </h2>
            </div>

            {/* Navigation items */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                className={cn(
                  "text-sm hover:text-blue-500 transition-colors",
                  activeSection === "overview" ? "text-blue-500 font-medium" : "text-gray-400"
                )}
                onClick={() => scrollToSection("overview")}
              >
                Overview
              </button>
              <button 
                className={cn(
                  "text-sm hover:text-blue-500 transition-colors",
                  activeSection === "specs" ? "text-blue-500 font-medium" : "text-gray-400"
                )}
                onClick={() => scrollToSection("specs")}
              >
                Specifications
              </button>
              <button 
                className={cn(
                  "text-sm hover:text-blue-500 transition-colors",
                  activeSection === "features" ? "text-blue-500 font-medium" : "text-gray-400"
                )}
                onClick={() => scrollToSection("features")}
              >
                Features
              </button>
              <button 
                className={cn(
                  "text-sm hover:text-blue-500 transition-colors",
                  activeSection === "reviews" ? "text-blue-500 font-medium" : "text-gray-400"
                )}
                onClick={() => scrollToSection("reviews")}
              >
                Reviews
              </button>
              <button 
                className={cn(
                  "text-sm hover:text-blue-500 transition-colors",
                  activeSection === "faq" ? "text-blue-500 font-medium" : "text-gray-400"
                )}
                onClick={() => scrollToSection("faq")}
              >
                FAQ
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <div className={cn(
                "transition-all duration-300",
                isHeaderSticky ? "opacity-100" : "opacity-0 pointer-events-none"
              )}>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                  In Stock
                </Badge>
              </div>
              <Button 
                variant="default" 
                size="sm" 
                className={cn(
                  "whitespace-nowrap transition-all duration-300 bg-primary hover:bg-primary/90",
                  isHeaderSticky ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-dark-base min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-400 space-x-2">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
              <ChevronRight className="h-3 w-3" />
              <Link 
                href={`/categories/${productData.category}`} 
                className="hover:text-primary transition-colors"
              >
                {productData.category.charAt(0).toUpperCase() + productData.category.slice(1)}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-300 truncate max-w-[150px] md:max-w-xs">
                {productData.title}
              </span>
            </div>
          </div>

          {/* Hero section */}
          <div className="mb-16">
            <h1 className="text-3xl md:text-5xl font-bold font-rajdhani mb-4">
              {productData.title}
            </h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1">
                New Arrival
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 px-3 py-1">
                Gaming Pro
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 px-3 py-1">
                In Stock
              </Badge>
            </div>
            <p className="text-gray-400 max-w-4xl text-lg mb-6">
              Take your typing experience to a whole new level with the ASUS ROG Strix Scope II 96. This wireless gaming keyboard packs the functionality of a full-size keyboard into a 96% frame, saving on precious desk space without compromising on performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="bg-black/50 rounded-lg border border-gray-900 p-4 flex items-center">
                <div className="bg-blue-600/10 rounded-full p-2 mr-3">
                  <Keyboard className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">96% Compact Layout</h3>
                  <p className="text-xs text-gray-400">Full functionality in a space-saving design</p>
                </div>
              </div>
              <div className="bg-black/50 rounded-lg border border-gray-900 p-4 flex items-center">
                <div className="bg-blue-600/10 rounded-full p-2 mr-3">
                  <Wifi className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Tri-Mode Connectivity</h3>
                  <p className="text-xs text-gray-400">Bluetooth, 2.4GHz wireless, and USB-C</p>
                </div>
              </div>
              <div className="bg-black/50 rounded-lg border border-gray-900 p-4 flex items-center">
                <div className="bg-blue-600/10 rounded-full p-2 mr-3">
                  <Settings className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Hot-Swappable</h3>
                  <p className="text-xs text-gray-400">Customize your switches without soldering</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column - Gallery and details */}
            <div className="lg:col-span-8 space-y-16">
              {/* Overview section */}
              <section ref={overviewRef} id="overview" className="space-y-8">
                {/* Image gallery */}
                {productData.imagesUrls.length > 0 && (
                  <ImmerseGallery 
                    images={productData.imagesUrls} 
                    productTitle={productData.title}
                  />
                )}

                {/* Product highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FeatureCard
                    icon={<Keyboard className="h-5 w-5 text-primary" />}
                    title="96% Layout"
                    description="Compact design that preserves the numpad and arrow keys while reducing overall size"
                  />
                  <FeatureCard
                    icon={<Settings className="h-5 w-5 text-primary" />}
                    title="Hot-swappable Switches"
                    description="Easily customize your typing experience by changing switches without soldering"
                  />
                  <FeatureCard
                    icon={<Wifi className="h-5 w-5 text-primary" />}
                    title="Tri-mode Connectivity"
                    description="Connect via Bluetooth, 2.4GHz wireless, or USB-C for maximum flexibility"
                  />
                  <FeatureCard
                    icon={<Zap className="h-5 w-5 text-primary" />}
                    title="Long Battery Life"
                    description="Up to 386 hours of use on a single charge with RGB lighting off"
                  />
                </div>


              </section>

              {/* Specifications section */}
              <section ref={specsRef} id="specifications" className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold font-rajdhani border-b border-gray-900 pb-4 text-blue-400">
                  Technical Specifications
                </h2>
                <SpecsVisualizer 
                  specs={{
                    "Type": "96% Mechanical Gaming Keyboard",
                    "Switches": "ROG NX Snow (Hot-swappable)",
                    "Connection": "Bluetooth / 2.4GHz / USB-C",
                    "Polling Rate": "1000Hz",
                    "N-Key Rollover": "Full (NKRO)",
                    "Battery Life": "Up to 1500 hours",
                    "RGB Lighting": "Per-key RGB with Aura Sync",
                    "Dimensions": "377 x 131 x 40 mm",
                    "Weight": "1012g"
                  }} 
                  category="keyboard"
                />

                {showMoreSpecs && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Additional Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="flex flex-col space-y-4 rounded-lg border border-gray-800 bg-gray-900/60 p-4">
                        <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className="text-gray-400">Switch Type</span>
                          <span>ROG NX Snow mechanical</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className="text-gray-400">Key Actuation</span>
                          <span>1.8mm pre-travel, 4.0mm total</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className="text-gray-400">Actuation Force</span>
                          <span>40gf to actuate, 55gf to bottom</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className="text-gray-400">Sound Dampening</span>
                          <span>Built-in foam material</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className="text-gray-400">Wrist Rest</span>
                          <span>Detachable</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-4 rounded-lg border border-gray-800 bg-gray-900/60 p-4">
                        <div className="flex justify-between py-2 border-b border-gray-900">
                          <span className="text-gray-400">Multi-Device Support</span>
                          <span>3 devices via Bluetooth</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-900">
                          <span className="text-gray-400">Special Features</span>
                          <span>Multi-function scroll button</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-900">
                          <span className="text-gray-400">Gaming Features</span>
                          <span>Xbox Game Bar hotkeys</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-900">
                          <span className="text-gray-400">Software</span>
                          <span>Armoury Crate</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-900">
                          <span className="text-gray-400">Tilt Angles</span>
                          <span>Three adjustable positions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    className="border-gray-900 hover:bg-black/50 text-blue-400"
                    onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                  >
                    {showMoreSpecs ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Show More Specifications
                      </>
                    )}
                  </Button>
                </div>
              </section>

              {/* Features section */}
              <section ref={featuresRef} id="features" className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold font-rajdhani border-b border-gray-900 pb-4 text-blue-400">
                  Features & Details
                </h2>

                <div className="space-y-12">
                  {/* Feature 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-3">Compact 96% Layout</h3>
                      <p className="text-gray-400 mb-4">
                        The ASUS ROG Strix Scope II 96 offers a compact 96% layout that preserves the number pad and all essential keys while reducing overall size. Perfect for gamers who need both desk space and full functionality.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">Space-saving 96% form factor with full numpad</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">Dedicated Xbox Game Bar hotkeys for streamers</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">Intuitive multi-function scroll button for control</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-black rounded-xl overflow-hidden border border-gray-900">
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={productData.imagesUrls[0] || "https://source.unsplash.com/random/800x600?gaming=keyboard"} 
                          alt="Compact 96% Layout" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1 bg-black rounded-xl overflow-hidden border border-gray-900">
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={productData.imagesUrls[1] || "https://source.unsplash.com/random/800x600?gaming=keyboard-switches"} 
                          alt="Hot-swappable Switches" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div className="order-1 md:order-2">
                      <h3 className="text-xl font-bold mb-3">Advanced Sound Dampening</h3>
                      <p className="text-gray-400 mb-4">
                        The ASUS ROG Strix Scope II 96 utilises ROG NX Snow switches and sound dampening materials to absorb any pinging or echoes. The NX Snow switches are linear, with a 1.8mm pre-travel and 4.0mm total travel that requires 40gf force to actuate and 55gf to bottom out.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">Pre-lubricated switches for smooth actuation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">Hot-swappable design for customization</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">Sound-absorbing foam reduces pinging and echoes</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-3">Tri-Mode Connectivity</h3>
                      <p className="text-gray-400 mb-4">
                        The keyboard harnesses the convenience of tri-mode connectivity. This means you can connect via Bluetooth, 2.4GHz wireless, or USB. In Bluetooth mode, you can connect to up to three devices, adding versatility to your setup. In wireless mode, the ROG SpeedNova technology delivers low latency performance and enhanced battery life.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">Connect to up to 3 devices via Bluetooth</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">ROG SpeedNova 2.4GHz wireless technology</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">Up to 1,500+ hours of battery life</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-black rounded-xl overflow-hidden border border-gray-900">
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={productData.imagesUrls[2] || "https://source.unsplash.com/random/800x600?gaming=wireless"} 
                          alt="Tri-Mode Connectivity" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reviews section */}
              <section ref={reviewsRef} id="reviews" className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold font-rajdhani border-b border-gray-900 pb-4 text-blue-400">
                  Customer Reviews
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Review summary */}
                  <div className="md:col-span-4 bg-black rounded-xl border border-gray-900 p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-5xl font-bold mb-1">4.7</h3>
                      <div className="flex justify-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-5 w-5 ${star <= 4.7 ? 'text-blue-500 fill-blue-500' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-400">Based on 24 reviews</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="min-w-[40px] text-sm">5 ★</span>
                        <div className="w-full bg-gray-900 rounded-full h-2 mx-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="min-w-[30px] text-right text-sm">18</span>
                      </div>
                      <div className="flex items-center">
                        <span className="min-w-[40px] text-sm">4 ★</span>
                        <div className="w-full bg-gray-900 rounded-full h-2 mx-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '17%' }}></div>
                        </div>
                        <span className="min-w-[30px] text-right text-sm">4</span>
                      </div>
                      <div className="flex items-center">
                        <span className="min-w-[40px] text-sm">3 ★</span>
                        <div className="w-full bg-gray-900 rounded-full h-2 mx-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                        </div>
                        <span className="min-w-[30px] text-right text-sm">2</span>
                      </div>
                      <div className="flex items-center">
                        <span className="min-w-[40px] text-sm">2 ★</span>
                        <div className="w-full bg-gray-900 rounded-full h-2 mx-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="min-w-[30px] text-right text-sm">0</span>
                      </div>
                      <div className="flex items-center">
                        <span className="min-w-[40px] text-sm">1 ★</span>
                        <div className="w-full bg-gray-900 rounded-full h-2 mx-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="min-w-[30px] text-right text-sm">0</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button variant="outline" className="w-full border-gray-900 hover:bg-gray-900">
                        Write a Review
                      </Button>
                    </div>
                  </div>

                  {/* Review list */}
                  <div className="md:col-span-8 bg-black rounded-xl border border-gray-900 p-6">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        <Review 
                          author="Alex M." 
                          rating={5} 
                          date="2 weeks ago" 
                          content="This keyboard feels amazing to type on! The ROG NX Snow switches are incredibly smooth right out of the box, and I love that I can swap them if I want to try something different. The 96% layout is perfect - compact but still has all the keys I need. Battery life is impressive and the tri-mode connectivity is very convenient."
                          verified={true}
                        />
                        <Review 
                          author="Sarah K." 
                          rating={5} 
                          date="1 month ago" 
                          content="Perfect keyboard for both gaming and work. The build quality is excellent, with a solid feel and no flex. RGB lighting is customizable and looks great. I particularly appreciate the wrist rest which makes long typing sessions comfortable."
                          verified={true}
                        />
                        <Review 
                          author="Michael T." 
                          rating={4} 
                          date="6 weeks ago" 
                          content="Great keyboard overall. The switches feel fantastic and the connectivity options are versatile. My only minor complaint is that the software could be more intuitive, but once you get the hang of it, you can customize everything to your liking."
                          verified={true}
                        />
                        <Review 
                          author="Jennifer R." 
                          rating={5} 
                          date="2 months ago" 
                          content="Love this keyboard! The 96% layout is the perfect compromise between a full-size and a TKL. Keys are satisfying to press and the RGB lighting is gorgeous. Battery life is as advertised - lasts me about a week with RGB on. Highly recommend!"
                          verified={false}
                        />
                        <Review 
                          author="David B." 
                          rating={3} 
                          date="3 months ago" 
                          content="Decent keyboard but took me some time to get used to the layout. The software is a bit clunky but the hardware itself is solid. Wireless connection is stable with no noticeable lag."
                          verified={true}
                        />
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </section>

              {/* FAQ section */}
              <section ref={faqRef} id="faq" className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold font-rajdhani border-b border-gray-900 pb-4 text-blue-400">
                  Frequently Asked Questions
                </h2>

                <div className="bg-black rounded-xl border border-gray-900 p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((faq) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={faq.id}
                        className="border-b border-gray-900 last:border-0"
                      >
                        <AccordionTrigger className="text-left hover:text-blue-400 py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-500/10 rounded-full p-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Have more questions?</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Our support team is ready to help you with any product-related questions.
                        </p>
                        <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-900">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column - Purchasing sidebar */}
            <div className="lg:col-span-4">
              <div className={cn(
                "transition-all duration-300",
                isCartSticky ? "lg:sticky lg:top-24" : ""
              )}>
                {/* Purchase card */}
                <div className="bg-black rounded-xl border border-gray-900 overflow-hidden mb-6">
                  <div className="p-6">
                    {/* Price section */}
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">{formatPrice(productData.price)}</span>
                        {productData.compareAtPrice && parseFloat(productData.compareAtPrice) > parseFloat(productData.price) && (
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            {formatPrice(productData.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      {productData.compareAtPrice && parseFloat(productData.compareAtPrice) > parseFloat(productData.price) && (
                        <div className="mt-1">
                          <Badge variant="outline" className="bg-green-600/10 text-green-500 border-green-600/20">
                            Save {Math.round((1 - parseFloat(productData.price) / parseFloat(productData.compareAtPrice)) * 100)}%
                          </Badge>
                        </div>
                      )}
                      <p className="text-sm text-gray-400 mt-2">
                        <Clock className="inline-block h-4 w-4 mr-1" />
                        Free shipping
                      </p>
                    </div>

                    {/* Color */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Color</h3>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-black border border-gray-700 mr-2"></div>
                        <span>Black</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Only available in Black
                      </p>
                    </div>

                    {/* Quantity selector */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Quantity</h3>
                      <div className="flex">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-l-md rounded-r-none border-r-0 border-gray-900"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="w-16 flex items-center justify-center border-y border-gray-900 bg-black/20">
                          {quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-r-md rounded-l-none border-l-0 border-gray-900"
                          onClick={incrementQuantity}
                          disabled={quantity >= 10}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                      <CartButton
                        productId={productData.id}
                        productTitle={productData.title}
                        price={parseFloat(productData.price)}
                        className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
                      />
                      <Button
                        variant="outline"
                        className="w-full border-gray-900 hover:bg-gray-900 h-12 text-base"
                        onClick={toggleWishlist}
                      >
                        {isWishlistActive ? (
                          <>
                            <Heart className="mr-2 h-5 w-5 text-red-500 fill-red-500" />
                            Added to Wishlist
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-5 w-5" />
                            Add to Wishlist
                          </>
                        )}
                      </Button>
                      <AddToPCBuilder
                        productId={productData.id}
                        productTitle={productData.title}
                        className="w-full h-12 text-base border-gray-700 hover:bg-gray-900"
                      />
                    </div>
                  </div>

                  {/* Extra info */}
                  <div className="bg-black/30 px-6 py-4 border-t border-gray-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                        In Stock
                      </Badge>
                      <span className="text-sm text-gray-300">Ready to ship</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Truck className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Free shipping on orders over $49</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Shield className="h-4 w-4 mr-2 text-gray-400" />
                        <span>2-year warranty included</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 mr-2 text-gray-400" />
                        <span>30-day satisfaction guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Similar products card */}
                <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gray-800 overflow-hidden">
                  <div className="p-6">
                    <h3 className="font-bold mb-4">You Might Also Like</h3>
                    <div className="space-y-4">
                      {relatedProducts.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex space-x-3 group">
                          <div className="h-20 w-20 bg-black/50 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={product.imageUrl} 
                              alt={product.title} 
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                              {product.title}
                            </h4>
                            <span className="text-sm mt-1">{formatPrice(product.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <Button variant="link" className="text-primary p-0 h-auto">
                        View More Similar Products
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related products full-width section */}
          <section className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-rajdhani">Complete Your Setup</h2>
              <Button variant="outline" className="border-gray-700 hover:bg-gray-900">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="bg-black border border-gray-900 group hover:border-blue-500 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-red-600">
                          -{product.discount}%
                        </Badge>
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-blue-600">
                          New
                        </Badge>
                      </div>
                    )}
                    <AspectRatio ratio={1/1}>
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                      />
                    </AspectRatio>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 text-white w-full text-xs"
                          >
                            Add to Cart
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="bg-white/10 backdrop-blur-sm border-0"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 mb-2 line-clamp-2">
                      Premium gaming accessory with RGB lighting
                    </p>
                    <div className="flex items-baseline">
                      <span className="font-bold">
                        {formatPrice(product.price)}
                      </span>
                      {product.discount > 0 && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          {formatPrice((parseFloat(product.price) / (1 - product.discount / 100)).toFixed(2))}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Recently viewed section */}
      <div className="bg-dark-base py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold font-rajdhani mb-6">Recently Viewed</h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 hide-scrollbar">
            {[...Array(4)].map((_, index) => (
              <div 
                key={index} 
                className="w-60 flex-shrink-0 bg-black rounded-lg overflow-hidden border border-gray-900 hover:border-blue-500 transition-colors group"
              >
                <div className="aspect-square relative">
                  <img 
                    src={`https://source.unsplash.com/random/300x300?gaming&sig=${index}`}
                    alt="Recently viewed product"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm truncate group-hover:text-blue-500 transition-colors">
                    Gaming Product {index + 1}
                  </h3>
                  <p className="text-blue-500 font-medium text-sm mt-1">
                    {formatPrice((129.99 + index * 10).toString())}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductNew;