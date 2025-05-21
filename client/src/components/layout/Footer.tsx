import React, { useState } from "react";
import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import rigFreaksLogo from "@assets/RigFreaks.png";

// Dawn-style collapsible footer sections for mobile
const FooterSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border-b border-gray-800 md:border-none">
      <button 
        className="flex justify-between items-center w-full py-4 md:py-0 md:mb-6 md:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`footer-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <h3 className="text-lg font-bold font-rajdhani">{title}</h3>
        <span className="md:hidden">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>
      <div 
        id={`footer-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={`overflow-hidden transition-all duration-300 md:h-auto ${isExpanded ? 'h-auto pb-4' : 'h-0 md:h-auto'}`}
      >
        {children}
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would handle newsletter signup here
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Thanks for subscribing! Check your email for confirmation.");
  };

  return (
    <footer className="bg-dark-base border-t border-gray-800" role="contentinfo">
      {/* Dawn-style country selector */}
      <div className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center md:justify-end space-x-4 text-sm">
            <span className="text-muted-foreground">Country/region</span>
            <select 
              aria-label="Country/region" 
              className="bg-dark-card border border-gray-700 rounded px-2 py-1 text-sm"
              defaultValue="uk"
            >
              <option value="uk">United Kingdom (GBP £)</option>
              <option value="us">United States (GBP £)</option>
              <option value="ca">Canada (GBP £)</option>
              <option value="eu">European Union (EUR €)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {/* Company Info */}
          <div className="mb-8 md:mb-0">
            <FooterSection title="ABOUT RIGFREAKS">
              <div className="mb-6">
                <img 
                  src={rigFreaksLogo} 
                  alt="RigFreaks Logo" 
                  className="h-12" 
                />
              </div>
              <p className="text-muted-foreground mb-6">
                Custom-built gaming PCs and workstations, designed by enthusiasts for enthusiasts.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" aria-hidden="true" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </FooterSection>
          </div>
          
          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <FooterSection title="QUICK LINKS">
              <ul className="space-y-3">
                <li>
                  <Link href="/collections/vortex" className="text-muted-foreground hover:text-accent transition-colors">
                    Gaming PCs
                  </Link>
                </li>
                <li>
                  <Link href="/collections/pulse" className="text-muted-foreground hover:text-accent transition-colors">
                    Creator PCs
                  </Link>
                </li>
                <li>
                  <Link href="/step-builder" className="text-muted-foreground hover:text-accent transition-colors">
                    PC Builder
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    Financing Options
                  </Link>
                </li>
                <li>
                  <Link href="/pages/delivery-info" className="text-muted-foreground hover:text-accent transition-colors">
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    Warranty & Returns
                  </Link>
                </li>
              </ul>
            </FooterSection>
          </div>
          
          {/* Support */}
          <div className="mb-8 md:mb-0">
            <FooterSection title="SUPPORT">
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/pages/faq" className="text-muted-foreground hover:text-accent transition-colors">
                    FAQs
                  </Link>
                </li>

              </ul>
            </FooterSection>
          </div>
          
          {/* Newsletter - Dawn-style newsletter with better accessibility */}
          <div>
            <FooterSection title="STAY UPDATED">
              <p className="text-muted-foreground mb-4">Subscribe to get the latest news and exclusive offers.</p>
              <form 
                className="mb-4" 
                onSubmit={handleSubmit}
                aria-label="Newsletter subscription form"
              >
                <div className="flex">
                  <div className="relative flex-grow">
                    <Input 
                      type="email" 
                      id="footerEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address" 
                      className="rounded-r-none bg-dark-card border-gray-700 focus-visible:ring-accent w-full"
                      aria-label="Email address"
                      required
                    />
                    <label htmlFor="footerEmail" className="sr-only">Email address</label>
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 text-white rounded-l-none px-4 py-2"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </form>
              <p className="text-muted-foreground text-sm">
                By subscribing, you agree to our <Link href="/pages/privacy-policy" className="text-accent underline hover:text-accent/80">Privacy Policy</Link>, <Link href="/pages/terms-of-service" className="text-accent underline hover:text-accent/80">Terms of Service</Link>, and <Link href="/pages/cookie-policy" className="text-accent underline hover:text-accent/80">Cookie Policy</Link>.
              </p>
            </FooterSection>
          </div>
        </div>
        
        {/* Payment methods - Dawn style feature */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <h3 className="text-center text-sm font-medium mb-4">WE ACCEPT</h3>
          <div className="flex justify-center space-x-4 mb-8">
            <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4fdbdb1a35ce83b89cca12a187f00.svg" alt="Visa" className="h-8" />
            <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d4efa50cf8626e8553c2b311353fbf67485f9c1a2b88d1.svg" alt="Mastercard" className="h-8" />
            <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/american_express-2264c9b8b57b23b0b0831827e90cd7bcda2836adc42a912ebedf545dead35b20.svg" alt="American Express" className="h-8" />
            <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/discover-8265cfcf6ceb8161d309e9b35c1b1e7b4305d00e64cda22fe7e2d1acd79037e9.svg" alt="Discover" className="h-8" />
            <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ca0d22dd15da6e92cc7266e93eb43762df5aa355d.svg" alt="PayPal" className="h-8" />
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} RigFreaks. All rights reserved.
            </div>
            <div className="flex space-x-4 text-sm">
              <Link href="/pages/privacy-policy" className="text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/pages/terms-of-service" className="text-muted-foreground hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link href="/pages/cookie-policy" className="text-muted-foreground hover:text-accent transition-colors">
                Cookie Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
