import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, 
  User, 
  ShoppingCart, 
  ChevronDown,
  Menu,
  X,
  LogOut,
  Mail,
  HelpCircle,
  Shield,
  RotateCcw,
  Info,
  Award,
  Star,
  FileText,
  Palette,
  Database
} from "lucide-react";

import CartContent from "@/components/cart/CartContent";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/localCartContext";
import rigFreaksLogo from "@assets/RigFreaks.png";
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logoutMutation } = useAuth();
  const { cart, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMobileMenuOpen(false);
  }, [location]);

  // Dawn-style accessibility enhancement for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Close the dialog
      setIsSearchOpen(false);
      // Navigate to a search page with the query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Custom mega dropdown content components
  const PcMegaDropdown = () => (
    <div className="container mx-auto px-4 py-5">
      <div className="grid grid-cols-6 gap-4">
        {/* Vortex Series */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/collections/vortex" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1593640495253-23196b27a87f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Vortex Gaming PCs" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Vortex Series</p>
              <p className="text-xs text-muted-foreground mt-1">High-End Gaming</p>
            </Link>
          </div>
        </div>
        
        {/* Nova Series */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/collections/nova" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Nova Gaming PCs" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Nova Series</p>
              <p className="text-xs text-muted-foreground mt-1">Mid-Range Gaming</p>
            </Link>
          </div>
        </div>
        
        {/* Pulse Series */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/collections/pulse" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1616588589676-62b3bd4b7d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Pulse Creator PCs" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Pulse Series</p>
              <p className="text-xs text-muted-foreground mt-1">Content Creation</p>
            </Link>
          </div>
        </div>
        
        {/* Racing Simulation */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/collections/racing-sim" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Racing Simulation PCs" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Racing Simulation</p>
              <p className="text-xs text-muted-foreground mt-1">Specialist Racing Setups</p>
            </Link>
          </div>
        </div>
        
        {/* Flight Simulation */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/collections/flight-sim" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1546132006-0fed653d554c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Flight Simulation PCs" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Flight Simulation</p>
              <p className="text-xs text-muted-foreground mt-1">Immersive Flight Rigs</p>
            </Link>
          </div>
        </div>
        
        {/* Quick Links Column */}
        <div className="col py-2">
          <div className="bg-dark-card p-4 rounded-md border border-gray-800 h-full">
            <h4 className="font-bold text-primary mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/collections/all" className="text-sm hover:text-primary transition-colors">All Gaming PCs</Link></li>
              <li><Link href="/step-builder" className="text-sm hover:text-primary transition-colors">Custom PC Builder</Link></li>
              <li><Link href="/help-me-choose" className="text-sm hover:text-primary transition-colors">Help Me Choose</Link></li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Link 
                href="/step-builder" 
                className="w-full bg-primary hover:bg-primary/90 text-white text-center py-2 rounded-md block text-sm font-medium transition-colors"
              >
                Start Your Custom Build
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ComponentsMegaDropdown = () => (
    <div className="container mx-auto px-4 py-5">
      <div className="grid grid-cols-6 gap-4">
        {/* CPUs */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/components/cpu" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Processors (CPUs)" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Processors</p>
              <p className="text-xs text-muted-foreground mt-1">CPUs</p>
            </Link>
          </div>
        </div>
        
        {/* GPUs */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/components/gpu" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1591405351990-4726e331f141?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Graphics Cards" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Graphics Cards</p>
              <p className="text-xs text-muted-foreground mt-1">GPUs</p>
            </Link>
          </div>
        </div>
        
        {/* Memory */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/components/memory" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1562976540-1502c2145186?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Memory (RAM)" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Memory</p>
              <p className="text-xs text-muted-foreground mt-1">RAM</p>
            </Link>
          </div>
        </div>
        
        {/* Storage */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/components/storage" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1600348712270-8e64df58fd2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Storage" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Storage</p>
              <p className="text-xs text-muted-foreground mt-1">SSDs & HDDs</p>
            </Link>
          </div>
        </div>
        
        {/* Cooling */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md hover:border-primary border border-gray-800 transition-all duration-300 group">
            <Link href="/components/cooling" className="block relative">
              <img 
                src="https://images.unsplash.com/photo-1662979865153-5bf066b9d50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt="Cooling" 
                className="mx-auto object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
                width="180"
                height="180"
              />
              <p className="font-bold text-white group-hover:text-primary transition-colors">Cooling</p>
              <p className="text-xs text-muted-foreground mt-1">Air & Liquid</p>
            </Link>
          </div>
        </div>
        
        {/* Quick Links Column */}
        <div className="col py-2">
          <div className="bg-dark-card p-4 rounded-md border border-gray-800 h-full">
            <h4 className="font-bold text-primary mb-3">Component Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/components" className="text-sm hover:text-primary transition-colors">All Components</Link></li>
              <li><Link href="/components/motherboard" className="text-sm hover:text-primary transition-colors">Motherboards</Link></li>
              <li><Link href="/components/cases" className="text-sm hover:text-primary transition-colors">PC Cases</Link></li>
              <li><Link href="/components/psu" className="text-sm hover:text-primary transition-colors">Power Supplies</Link></li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Link 
                href="/compatibility-checker" 
                className="w-full bg-primary hover:bg-primary/90 text-white text-center py-2 rounded-md block text-sm font-medium transition-colors"
              >
                Check Compatibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  const SupportMegaDropdown = () => (
    <div className="container mx-auto px-4 py-5">
      <div className="grid grid-cols-3 gap-4">
        {/* Support Column */}
        <div className="col py-2">
          <div className="bg-dark-card p-4 rounded-md border border-gray-800">
            <h4 className="font-bold text-primary mb-3">Customer Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm hover:text-primary transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-primary transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-sm hover:text-primary transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Warranty Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm hover:text-primary transition-colors flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* About Column */}
        <div className="col py-2">
          <div className="bg-dark-card p-4 rounded-md border border-gray-800">
            <h4 className="font-bold text-primary mb-3">About RigFreaks</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-primary transition-colors flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/why-choose-us" className="text-sm hover:text-primary transition-colors flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-sm hover:text-primary transition-colors flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-primary transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Blog & News
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Help Cards */}
        <div className="col py-2">
          <div className="text-center bg-dark-card p-4 rounded-md border border-primary h-full">
            <h4 className="font-bold text-primary text-xl mb-4">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">Our support team is available to help with any questions about your purchase or PC building journey.</p>
            <div className="space-y-3">
              <Link 
                href="/contact" 
                className="w-full bg-primary hover:bg-primary/90 text-white text-center py-2 rounded-md block text-sm font-medium transition-colors"
              >
                Contact Us
              </Link>
              <Link 
                href="/live-chat" 
                className="w-full bg-dark-surface hover:bg-dark-surface/80 text-white text-center py-2 rounded-md block text-sm font-medium transition-colors border border-primary/50"
              >
                Live Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header 
      className={`${isScrolled ? 'bg-dark-base/95 backdrop-blur-sm shadow-lg' : 'bg-dark-base'} 
      border-b border-gray-800 sticky top-0 z-50 transition-all duration-300`}
      role="banner"
    >
      {/* Top announcement bar (Dawn-style) */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 text-center text-sm font-medium">
        <p>Free shipping on all orders over £1000 | 3-year warranty included</p>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Dawn uses semantic markup */}
          <Link href="/" className="flex items-center pr-4" aria-label="RigFreaks Home">
            <h1 className="text-2xl md:text-3xl font-bold font-rajdhani">
              <img 
                src={rigFreaksLogo} 
                alt="RigFreaks Logo" 
                className="h-14 md:h-16" 
              />
            </h1>
          </Link>
          
          {/* Desktop Navigation with Full-Width Mega Dropdown */}
          <nav className="hidden lg:flex space-x-8 font-rajdhani text-lg" role="navigation" aria-label="Main menu">
            <DropdownMenu>
              <DropdownMenuTrigger className="menu-hover transition-colors duration-200 flex items-center px-2 py-1" aria-haspopup="menu">
                Gaming PCs <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-screen left-0 p-0 rounded-none border-t-0 border-x-0 border-b border-gray-700 shadow-lg bg-dark-base">
                <PcMegaDropdown />
              </DropdownMenuContent>
            </DropdownMenu>
            


            
            <DropdownMenu>
              <DropdownMenuTrigger className="menu-hover transition-colors duration-200 flex items-center px-2 py-1" aria-haspopup="menu">
                Support <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-screen left-0 p-0 rounded-none border-t-0 border-x-0 border-b border-gray-700 shadow-lg bg-dark-base">
                <SupportMegaDropdown />
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          {/* Icons - Dawn's approach with good accessibility */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-text-light hover:text-accent transition-colors duration-200" 
              aria-label="Search"
              title="Search"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-text-light hover:text-accent transition-colors duration-200 flex items-center"
                    aria-label="My Account"
                    title="My Account"
                  >
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="bg-dark-surface text-primary">
                        {user.username ? user.username.substring(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-dark-base border border-border">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-primary"
                    onClick={() => navigate("/account")}
                  >
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-primary"
                    onClick={() => navigate("/account/builds")}
                  >
                    Saved Builds
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-primary"
                    onClick={() => navigate("/account/orders")}
                  >
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground pt-0">
                    Admin Tools
                  </DropdownMenuLabel>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-primary"
                    onClick={() => navigate("/admin/products")}
                  >
                    Product Management
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-primary"
                    onClick={() => navigate("/admin/shopify")}
                  >
                    Shopify Import
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-primary"
                    onClick={() => navigate("/admin/components")}
                  >
                    Component Management
                  </DropdownMenuItem>
                  {/* Using local storage instead of Supabase */}
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-primary flex items-center"
                    onClick={() => navigate("/admin/theme")}
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    Theme Customizer
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-primary flex items-center"
                    onClick={() => navigate("/admin/xml-service")}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    XML Service Client
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-dark-card hover:text-destructive flex items-center"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Logging out..." : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="text-text-light hover:text-accent hover:bg-transparent transition-colors duration-200 p-0"
                aria-label="Login/Register"
                title="Login/Register"
                onClick={() => navigate("/auth")}
              >
                <User className="h-5 w-5 mr-2" aria-hidden="true" />
                <span className="hidden md:inline">Login</span>
              </Button>
            )}
            <button 
              className="text-text-light hover:text-accent transition-colors duration-200 relative"
              aria-label={`Cart (${cart.totalQuantity} items)`}
              title="View cart"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" aria-hidden="true">
                {cart.totalQuantity || 0}
              </span>
            </button>
            
            {/* Mobile menu button - Dawn style with ARIA controls */}
            <div className="lg:hidden">
              <button 
                onClick={toggleMobileMenu} 
                className="text-white p-1 focus:outline-none focus:ring-2 focus:ring-accent rounded"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu - Dawn style with transitions */}
        <div 
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          aria-hidden={!isMobileMenuOpen}
        >
          <nav className="flex flex-col space-y-3 font-rajdhani text-lg border-t border-gray-800 pt-3 mt-3" role="navigation" aria-label="Mobile menu">
            {/* Our PCs dropdown section */}
            <div className="p-2 rounded transition-all duration-200">
              <button 
                onClick={() => {
                  // Toggle a local state for this specific dropdown
                  const newState = !document.getElementById('mobile-pcs-dropdown')?.classList.contains('hidden');
                  if (newState) {
                    document.getElementById('mobile-pcs-dropdown')?.classList.add('hidden');
                    document.getElementById('mobile-pcs-chevron')?.classList.remove('rotate-180');
                  } else {
                    document.getElementById('mobile-pcs-dropdown')?.classList.remove('hidden');
                    document.getElementById('mobile-pcs-chevron')?.classList.add('rotate-180');
                  }
                }}
                className="flex items-center justify-between w-full bg-dark-base hover:bg-dark-surface/50 rounded p-2"
              >
                <span className="font-bold">Our PCs</span>
                <ChevronDown id="mobile-pcs-chevron" className="h-4 w-4 transition-transform duration-200" />
              </button>
              
              <div id="mobile-pcs-dropdown" className="pl-2 mt-2 space-y-2 hidden bg-dark-base rounded p-2">
                <Link href="/collections/all" className="block py-1 hover:text-primary">
                  All Gaming PCs
                </Link>
                <Link href="/collections/vortex" className="block py-1 hover:text-primary">
                  Vortex Series (High-End)
                </Link>
                <Link href="/collections/nova" className="block py-1 hover:text-primary">
                  Nova Series (Mid-Range)
                </Link>
                <Link href="/collections/pulse" className="block py-1 hover:text-primary">
                  Pulse Creator PCs
                </Link>
                <Link href="/collections/racing-sim" className="block py-1 hover:text-primary">
                  Racing Simulation PCs
                </Link>
                <Link href="/collections/flight-sim" className="block py-1 hover:text-primary">
                  Flight Simulation PCs
                </Link>
              </div>
            </div>
            

            

            {/* Support dropdown section */}
            <div className="p-2 rounded transition-all duration-200">
              <button 
                onClick={() => {
                  // Toggle a local state for this specific dropdown
                  const newState = !document.getElementById('mobile-support-dropdown')?.classList.contains('hidden');
                  if (newState) {
                    document.getElementById('mobile-support-dropdown')?.classList.add('hidden');
                    document.getElementById('mobile-support-chevron')?.classList.remove('rotate-180');
                  } else {
                    document.getElementById('mobile-support-dropdown')?.classList.remove('hidden');
                    document.getElementById('mobile-support-chevron')?.classList.add('rotate-180');
                  }
                }}
                className="flex items-center justify-between w-full bg-dark-base hover:bg-dark-surface/50 rounded p-2"
              >
                <span className="font-bold">Support</span>
                <ChevronDown id="mobile-support-chevron" className="h-4 w-4 transition-transform duration-200" />
              </button>
              
              <div id="mobile-support-dropdown" className="pl-2 mt-2 space-y-2 hidden bg-dark-base rounded p-2">
                <Link href="/about" className="block py-1 hover:text-primary">
                  About Us
                </Link>
                <Link href="/contact" className="block py-1 hover:text-primary">
                  Contact Support
                </Link>
                <Link href="/faq" className="block py-1 hover:text-primary">
                  FAQs
                </Link>
                <Link href="/warranty" className="block py-1 hover:text-primary">
                  Warranty Information
                </Link>
                <Link href="/returns" className="block py-1 hover:text-primary">
                  Returns & Refunds
                </Link>
              </div>
            </div>
            
            {/* Auth items for mobile */}
            {user ? (
              <>
                <div className="border-t border-gray-800 pt-2 mt-2">
                  <div className="flex items-center mb-2 p-2">
                    <Avatar className="h-8 w-8 mr-3 border border-border">
                      <AvatarFallback className="bg-dark-surface text-primary">
                        {user.username ? user.username.substring(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/account" className="menu-hover transition-colors duration-200 p-2 hover:bg-dark-surface rounded">
                    My Account
                  </Link>
                  <Link href="/account/builds" className="menu-hover transition-colors duration-200 p-2 hover:bg-dark-surface rounded">
                    Saved Builds
                  </Link>
                  <Link href="/account/orders" className="menu-hover transition-colors duration-200 p-2 hover:bg-dark-surface rounded">
                    Order History
                  </Link>
                  <button 
                    className="w-full text-left menu-hover transition-colors duration-200 p-2 hover:bg-dark-surface rounded text-destructive flex items-center"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <Link href="/auth" className="menu-hover transition-colors duration-200 p-2 hover:bg-dark-surface rounded border-t border-gray-800 pt-2 mt-2">
                Log In / Register
              </Link>
            )}
          </nav>
        </div>
      </div>
      
      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md bg-dark-base border-border">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                className="pl-10 bg-dark-surface border-border py-6 text-base"
                placeholder="Search for products, categories, etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Search
            </Button>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-accent text-accent hover:bg-accent/10"
              >
                Cancel
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Cart Sheet */}
      <CartContent />
    </header>
  );
};

export default Header;