import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { PCComponentData, allComponents } from '../lib/componentData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Check, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Cpu, 
  Zap, 
  ThermometerSnowflake,
  Award,
  Info,
  FileText,
  Images,
  Heart,
  HeartOff,
  Share2,
  Truck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const ComponentDetailPage = () => {
  const params = useParams();
  const [, navigate] = useLocation();
  const [component, setComponent] = useState<PCComponentData | null>(null);
  const [relatedComponents, setRelatedComponents] = useState<PCComponentData[]>([]);
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Refs for scroll sections
  const overviewRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  
  // For sticky navigation tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight - windowHeight;
      const progress = (scrollPosition / fullHeight) * 100;
      setScrollProgress(progress);
      
      // Update active tab based on scroll position
      const sections = [
        { ref: overviewRef, id: 'overview' },
        { ref: specsRef, id: 'specs' },
        { ref: galleryRef, id: 'gallery' },
        { ref: reviewsRef, id: 'reviews' }
      ];
      
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveTab(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to scroll to section when tab is clicked
  const scrollToSection = (sectionId: string) => {
    const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
      'overview': overviewRef,
      'specs': specsRef,
      'gallery': galleryRef,
      'reviews': reviewsRef
    };
    
    const ref = sectionRefs[sectionId];
    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80, // Offset for header
        behavior: 'smooth'
      });
    }
    
    setActiveTab(sectionId);
  };

  useEffect(() => {
    // Find the component based on the ID parameter
    const { category, id } = params;
    if (!category || !id) {
      navigate('/not-found');
      return;
    }

    const categoryComponents = allComponents[category];
    if (!categoryComponents) {
      navigate('/not-found');
      return;
    }

    const foundComponent = categoryComponents.find(comp => comp.id === id);
    if (!foundComponent) {
      navigate('/not-found');
      return;
    }

    setComponent(foundComponent);
    
    // Set the current image
    if (foundComponent.image) {
      setCurrentImage(foundComponent.image);
    }
    
    // Initialize gallery
    if (foundComponent.imagesGallery && foundComponent.imagesGallery.length > 0) {
      setCurrentImage(foundComponent.imagesGallery[0]);
      setGalleryIndex(0);
    }

    // Find related components (same category, different models)
    const related = categoryComponents
      .filter(comp => comp.id !== id)
      .sort(() => 0.5 - Math.random()) // Simple random sorting
      .slice(0, 4); // Get 4 related components
    
    setRelatedComponents(related);
    
    // Reset scroll position
    window.scrollTo(0, 0);
  }, [params, navigate]);

  const handleAddToCart = async () => {
    if (!component) return;
    
    setIsAddingToCart(true);
    try {
      await apiRequest('/api/cart/add', 'POST', { 
        componentId: component.id,
        category: component.category,
        quantity: 1
      });
      
      toast({
        title: "Added to cart",
        description: `${component.name} has been added to your cart.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding this item to your cart.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${component?.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  if (!component) {
    return (
      <div className="w-full bg-dark-base min-h-screen">
        <div className="container mx-auto py-10 px-4">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Loading component details...</h2>
              <p className="text-muted-foreground mt-2">Please wait while we fetch the component information.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format specifications for display
  const specs = Object.entries(component.specs).map(([key, value]) => {
    // Convert camelCase to Title Case (e.g., "ramType" to "Ram Type")
    const formattedKey = key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1 $2');
    
    return { key: formattedKey, value };
  });
  
  // Group specifications by category for better organization
  const specCategories = {
    'General': specs.filter(spec => 
      ['Type', 'Brand', 'Model', 'Series'].some(k => spec.key.includes(k))),
    'Performance': specs.filter(spec => 
      ['Speed', 'Frequency', 'Power', 'Performance', 'Wattage', 'Core', 'Clock'].some(k => spec.key.includes(k))),
    'Physical': specs.filter(spec => 
      ['Size', 'Dimension', 'Weight', 'Form Factor'].some(k => spec.key.includes(k))),
    'Other': specs.filter(spec => 
      !['Type', 'Brand', 'Model', 'Series', 'Speed', 'Frequency', 'Power', 'Performance', 'Wattage', 'Core', 'Clock', 'Size', 'Dimension', 'Weight', 'Form Factor'].some(k => spec.key.includes(k)))
  };

  // Get key features (we'll extract 4-5 important specs)
  const getKeyFeatures = () => {
    const keySpecs: string[] = [];
    
    // Look for important specs based on component type
    if (component.category === 'cpu') {
      const cores = specs.find(s => s.key.includes('Core'))?.value;
      const speed = specs.find(s => s.key.includes('Clock') || s.key.includes('Speed'))?.value;
      const socket = specs.find(s => s.key.includes('Socket'))?.value;
      
      if (cores) keySpecs.push(`${cores} Cores`);
      if (speed) keySpecs.push(`${speed} Clock Speed`);
      if (socket) keySpecs.push(`${socket} Socket`);
    } 
    else if (component.category === 'gpu') {
      const vram = specs.find(s => s.key.includes('Memory') || s.key.includes('VRAM'))?.value;
      const type = specs.find(s => s.key.includes('Type'))?.value;
      
      if (vram) keySpecs.push(`${vram} VRAM`);
      if (type) keySpecs.push(`${type}`);
    }
    else if (component.category === 'case') {
      const formFactor = specs.find(s => s.key.includes('Form Factor'))?.value;
      if (formFactor) keySpecs.push(`Supports ${formFactor}`);
    }
    
    // Add general key specs for all component types
    const dimensions = specs.find(s => s.key.includes('Dimension'))?.value;
    if (dimensions) keySpecs.push(`${dimensions}`);
    
    // Add component-specific feature 
    keySpecs.push(component.category === 'case' ? 'Premium Build Quality' : 'High Performance');
    
    // If we don't have enough key specs, add generic ones
    if (keySpecs.length < 4) {
      keySpecs.push('Advanced Technology');
      keySpecs.push('Reliable Performance');
    }
    
    return keySpecs.slice(0, 5); // Limit to 5 features
  };

  const keyFeatures = getKeyFeatures();

  return (
    <div className="w-full bg-dark-base min-h-screen pb-16">
      {/* Progress bar at the top of the page */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <Progress value={scrollProgress} className="w-full h-1" />
      </div>
      
      {/* Sticky navigation */}
      <div className="sticky top-0 z-40 w-full bg-dark-surface/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-4 px-4">
            {/* Back button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/step-builder`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            
            {/* Page tabs */}
            <TabsList className="mx-auto">
              <TabsTrigger 
                value="overview" 
                onClick={() => scrollToSection('overview')}
                className={activeTab === 'overview' ? 'bg-accent text-white' : ''}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="specs" 
                onClick={() => scrollToSection('specs')}
                className={activeTab === 'specs' ? 'bg-accent text-white' : ''}
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                onClick={() => scrollToSection('gallery')}
                className={activeTab === 'gallery' ? 'bg-accent text-white' : ''}
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                onClick={() => scrollToSection('reviews')}
                className={activeTab === 'reviews' ? 'bg-accent text-white' : ''}
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={toggleWishlist}>
                {isWishlisted ? <Heart className="h-4 w-4 fill-accent text-accent" /> : <Heart className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero section */}
      <div className="relative w-full bg-gradient-to-b from-dark-surface to-dark-base">
        <div className="container mx-auto pt-8 pb-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Hero Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full opacity-30"></div>
                <div className="relative aspect-square w-full bg-accent/5 rounded-lg overflow-hidden flex items-center justify-center p-8">
                  <img 
                    src={currentImage} 
                    alt={component.name} 
                    className="max-w-full max-h-full object-contain z-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Column - Component Details */}
            <div className="flex flex-col">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
                    {component.category.toUpperCase()}
                  </Badge>
                  <Badge variant={component.inStock ? "outline" : "destructive"} className={component.inStock ? "bg-green-900/20 text-green-400 border-green-500/30" : ""}>
                    {component.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{component.name}</h1>
                
                <div className="flex items-center gap-2 mb-6">
                  <p className="text-muted-foreground">By <span className="text-accent">{component.brand}</span></p>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">(24 reviews)</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-1">£{component.price.toFixed(2)}</h2>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <Truck size={16} /> 
                      Free shipping • Delivery in 2-3 business days
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleAddToCart}
                      disabled={!component.inStock || isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⟳</span> Adding...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ShoppingCart size={18} /> Add to Cart
                        </span>
                      )}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" onClick={toggleWishlist} className="w-full">
                        {isWishlisted ? (
                          <span className="flex items-center gap-2">
                            <HeartOff size={16} /> Remove from Wishlist
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Heart size={16} /> Add to Wishlist
                          </span>  
                        )}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <span className="flex items-center gap-2">
                          <Share2 size={16} /> Share
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key features section */}
      <div className="w-full bg-dark-surface py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-dark-surface border border-accent/20 rounded-lg p-4 flex flex-col items-center text-center hover:border-accent/50 transition-colors">
                {index === 0 && <Cpu className="h-8 w-8 text-accent mb-3" />}
                {index === 1 && <Zap className="h-8 w-8 text-accent mb-3" />}
                {index === 2 && <ThermometerSnowflake className="h-8 w-8 text-accent mb-3" />}
                {index === 3 && <Award className="h-8 w-8 text-accent mb-3" />}
                {index === 4 && <Check className="h-8 w-8 text-accent mb-3" />}
                <p className="font-medium text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content sections */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Section */}
        <div ref={overviewRef} id="overview" className="py-8">
          <h2 className="text-2xl font-bold mb-6 text-accent">Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4">{component.name}</h3>
                <p className="text-muted-foreground mb-6">{component.description}</p>
                
                <div className="bg-dark-surface border border-accent/10 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h4 className="text-lg font-semibold mb-3">Product Description</h4>
                <p className="text-muted-foreground mb-4">
                  Introducing the {component.name}, a high-performance {component.category} designed for enthusiasts and gamers 
                  who demand nothing but the best. Crafted by {component.brand}, this {component.category} offers exceptional quality,
                  reliability, and cutting-edge features that set it apart from the competition.
                </p>
                <p className="text-muted-foreground">
                  Whether you're building a new system or upgrading your current setup, the {component.name} delivers the 
                  perfect balance of performance, aesthetics, and value. Experience the difference that premium components 
                  make in your computing experience.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-dark-surface border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Specs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {specs.slice(0, 8).map((spec, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-accent/10 last:border-0">
                        <span className="text-muted-foreground">{spec.key}:</span>
                        <span className="font-medium">{spec.value.toString()}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="link" 
                    className="mt-4 px-0 text-accent"
                    onClick={() => scrollToSection('specs')}
                  >
                    View full specifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Specifications Section */}
        <div ref={specsRef} id="specs" className="py-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-accent">Detailed Specifications</h2>
          
          {component.specsHtml ? (
            <Card className="bg-dark-surface border-accent/20">
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: component.specsHtml }} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-dark-surface border-accent/20">
              <CardContent className="p-6">
                <Tabs defaultValue="general">
                  <TabsList className="mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="physical">Physical</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specCategories.General.map((spec, index) => (
                        <div key={index} className="flex justify-between p-3 bg-dark-base/70 rounded-md">
                          <span className="font-medium">{spec.key}:</span>
                          <span className="text-muted-foreground">{spec.value.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="performance">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specCategories.Performance.map((spec, index) => (
                        <div key={index} className="flex justify-between p-3 bg-dark-base/70 rounded-md">
                          <span className="font-medium">{spec.key}:</span>
                          <span className="text-muted-foreground">{spec.value.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="physical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specCategories.Physical.map((spec, index) => (
                        <div key={index} className="flex justify-between p-3 bg-dark-base/70 rounded-md">
                          <span className="font-medium">{spec.key}:</span>
                          <span className="text-muted-foreground">{spec.value.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="other">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specCategories.Other.map((spec, index) => (
                        <div key={index} className="flex justify-between p-3 bg-dark-base/70 rounded-md">
                          <span className="font-medium">{spec.key}:</span>
                          <span className="text-muted-foreground">{spec.value.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Gallery Section */}
        <div ref={galleryRef} id="gallery" className="py-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-accent">Product Gallery</h2>
          
          <div className="mb-8">
            <div className="relative aspect-video w-full bg-dark-surface rounded-lg overflow-hidden">
              <img 
                src={currentImage} 
                alt={component.name} 
                className="w-full h-full object-contain"
              />
              
              {component.imagesGallery && component.imagesGallery.length > 1 && (
                <>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                    onClick={() => {
                      const newIndex = galleryIndex === 0 
                        ? component.imagesGallery!.length - 1 
                        : galleryIndex - 1;
                      setGalleryIndex(newIndex);
                      setCurrentImage(component.imagesGallery![newIndex]);
                    }}
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                    onClick={() => {
                      const newIndex = galleryIndex === component.imagesGallery!.length - 1
                        ? 0
                        : galleryIndex + 1;
                      setGalleryIndex(newIndex);
                      setCurrentImage(component.imagesGallery![newIndex]);
                    }}
                  >
                    <ChevronRight size={18} />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {component.imagesGallery && component.imagesGallery.length > 1 ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
              {component.imagesGallery.map((img, index) => (
                <div 
                  key={index}
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                    index === galleryIndex ? 'border-accent' : 'border-transparent'
                  } hover:border-accent/50 transition-colors`}
                  onClick={() => {
                    setGalleryIndex(index);
                    setCurrentImage(img);
                  }}
                >
                  <img 
                    src={img} 
                    alt={`${component.name} - view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No additional images available</p>
            </div>
          )}
        </div>
        
        {/* Reviews Section */}
        <div ref={reviewsRef} id="reviews" className="py-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-accent">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Card className="bg-dark-surface border-accent/20">
                <CardHeader>
                  <CardTitle className="text-xl">4.0</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                    <p className="mt-1">Based on 24 reviews</p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">5 star</span>
                      <Progress value={45} className="h-2 flex-1" />
                      <span className="text-xs">45%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">4 star</span>
                      <Progress value={35} className="h-2 flex-1" />
                      <span className="text-xs">35%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">3 star</span>
                      <Progress value={15} className="h-2 flex-1" />
                      <span className="text-xs">15%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">2 star</span>
                      <Progress value={3} className="h-2 flex-1" />
                      <span className="text-xs">3%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">1 star</span>
                      <Progress value={2} className="h-2 flex-1" />
                      <span className="text-xs">2%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Write a Review</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <div className="space-y-6">
                {/* Review 1 */}
                <Card className="bg-dark-surface border-accent/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Great performance</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-3 w-3 ${star <= 5 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} 
                              />
                            ))}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">2 weeks ago</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      This {component.category} exceeded my expectations. The build quality is excellent, 
                      and it performs exceptionally well in my system. Highly recommended for anyone looking 
                      for a reliable {component.category}.
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    <div>Alex P. - Verified Purchaser</div>
                  </CardFooter>
                </Card>
                
                {/* Review 2 */}
                <Card className="bg-dark-surface border-accent/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Solid quality</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-3 w-3 ${star <= 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} 
                              />
                            ))}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">1 month ago</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Overall, I'm satisfied with this {component.category}. It works as expected and 
                      the performance is good for the price. Installation was straightforward, and it 
                      integrates well with my other components.
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    <div>Sarah J. - Verified Purchaser</div>
                  </CardFooter>
                </Card>
                
                <Button variant="outline" className="w-full">Load More Reviews</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Components */}
      {relatedComponents.length > 0 && (
        <div className="w-full bg-dark-surface py-12 mt-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-accent">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedComponents.map((related) => (
                <Card 
                  key={related.id} 
                  className="bg-dark-base overflow-hidden cursor-pointer hover:border-accent/50 transition-all group"
                  onClick={() => navigate(`/component/${related.category}/${related.id}`)}
                >
                  <div className="aspect-square w-full bg-dark-surface p-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent/5 transform group-hover:scale-95 transition-transform"></div>
                    <img 
                      src={related.image} 
                      alt={related.name} 
                      className="max-w-full max-h-full object-contain z-10 transform group-hover:scale-110 transition-transform" 
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base leading-tight line-clamp-2 group-hover:text-accent transition-colors">{related.name}</CardTitle>
                    <CardDescription className="flex justify-between items-center mt-1">
                      <span className="text-sm">{related.brand}</span>
                      <Badge variant={related.inStock ? "outline" : "destructive"} className="text-xs">
                        {related.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 flex justify-between items-center border-t border-accent/10">
                    <span className="font-bold text-primary">£{related.price.toFixed(2)}</span>
                    <Button variant="outline" size="sm" className="h-8">
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Call to action */}
      <div className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-accent/20 to-dark-surface border-accent/30">
          <CardContent className="p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Complete Your Build</h3>
              <p className="text-muted-foreground mb-4">
                Continue building your custom PC with our step-by-step guide. We'll help you select compatible components
                for the ultimate gaming or productivity experience.
              </p>
              <Button onClick={() => navigate('/step-builder')}>
                Continue Building
              </Button>
            </div>
            <div className="flex-shrink-0">
              <img 
                src="/assets/RigFreaks.png" 
                alt="RigFreaks Logo" 
                className="w-28 h-28 object-contain opacity-90"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentDetailPage;