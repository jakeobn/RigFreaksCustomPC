import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";
import { Truck } from "lucide-react";

export default function DeliveryInfo() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle scrolling and highlighting active section
  useEffect(() => {
    const sections = document.querySelectorAll('.policy-section');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    // Add smooth scrolling for sidebar links
    const handleSidebarClick = (e: MouseEvent, targetId: string) => {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(targetId);
      }
    };
    
    const sidebarLinks = document.querySelectorAll('.policy-sidebar a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          handleSidebarClick(e as MouseEvent, targetId);
        }
      });
    });
    
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const sections = [
    { id: "process-overview", title: "Process Overview" },
    { id: "order-processing", title: "Order Processing & Build" },
    { id: "testing-troubleshooting", title: "Testing & Troubleshooting" },
    { id: "packaging-shipping", title: "Packaging & Shipping" },
    { id: "delivery-timeline", title: "Delivery Timeline" },
    { id: "restrictions-notes", title: "Restrictions & Notes" }
  ];

  return (
    <>
      <Helmet>
        <title>Delivery Information | RigFreaks</title>
        <meta name="description" content="Learn about RigFreaks delivery process, timelines, and shipping information for custom gaming PCs." />
      </Helmet>
      
      <div className="bg-gradient-to-b from-dark-card to-black py-10 border-b border-border">
        <Container>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-accent/10 p-4 rounded-full">
              <Truck className="h-8 w-8 md:h-10 md:w-10 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Delivery Information</h1>
            <p className="text-muted-foreground text-center max-w-2xl mt-4">
              Custom PC Excellence, Delivered to Your Door
            </p>
          </div>
        </Container>
      </div>
      
      <Container className="py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-[250px] shrink-0">
            <div className="policy-sidebar sticky top-20">
              <div className="border border-border rounded-md overflow-hidden">
                <ul className="divide-y divide-border">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`}
                        className={`block px-4 py-3 text-sm transition-colors hover:bg-primary hover:text-white ${
                          activeSection === section.id ? 'bg-primary text-white' : 'text-foreground'
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div id="process-overview" className="policy-section mt-10 mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">1. Process Overview</h2>
              
              <div className="bg-card rounded-lg border border-border/50 p-6">
                <p className="text-lg mb-6">
                  At RigFreaks, we are committed to delivering high-performance custom PCs that exceed your expectations. Our process is thorough, ensuring every component meets the highest standards of quality and reliability.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">1</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-center mb-2">Order Processing & Build</h3>
                    <p className="text-sm text-center">
                      Sourcing components and assembling your custom PC with precision and care.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">2</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-center mb-2">Testing & Troubleshooting</h3>
                    <p className="text-sm text-center">
                      Rigorous stress tests and quality checks to ensure peak performance.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">3</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-center mb-2">Packaging & Shipping</h3>
                    <p className="text-sm text-center">
                      Secure packaging and reliable delivery to your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="order-processing" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">2. Order Processing and Build Time</h2>
              
              <div className="bg-card rounded-lg border border-border/50 p-6 mb-6">
                <p className="mb-4">
                  Once you place your order, we begin by sourcing the best parts available for your custom PC. Depending on the availability of components, it can take 1-3 days for us to acquire everything needed.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <h3 className="font-bold text-accent mb-2">Component Sourcing</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span>High-quality components from trusted suppliers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span>Strict quality control checks before assembly</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span>1-3 days depending on availability and rarity</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <h3 className="font-bold text-accent mb-2">Assembly Process</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span>Experienced technicians handle assembly</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span>Meticulous attention to detail for every component</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">•</span>
                        <span>Usually takes 1-2 days based on build complexity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground italic text-sm">
                Note: Custom PC builds with rare or specialized components may take slightly longer to source.
              </p>
            </div>
            
            <div id="testing-troubleshooting" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">3. Rigorous Testing and Troubleshooting</h2>
              
              <p className="mb-6">
                After the build is complete, your custom PC undergoes a series of rigorous stress tests to ensure that all components are functioning at their peak performance.
              </p>
              
              <div className="bg-card rounded-lg border border-border/50 p-6 mb-6">
                <h3 className="font-bold mb-4">We Test For:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">CPU Performance and Stability</p>
                      <p className="text-sm text-muted-foreground">Stress testing under various workloads</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">GPU Load Handling</p>
                      <p className="text-sm text-muted-foreground">Temperature regulation and performance benchmarks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Memory Stress Tests</p>
                      <p className="text-sm text-muted-foreground">Checking for reliability and stability</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Storage Performance</p>
                      <p className="text-sm text-muted-foreground">Hard drive and SSD read/write speeds</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">System Stability</p>
                      <p className="text-sm text-muted-foreground">Under high usage scenarios and benchmarks</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="mt-4">
                If any issues arise during these tests, we troubleshoot immediately, replacing or adjusting parts as necessary to ensure your PC meets our high standards. This process usually takes 2-3 days, as we prioritize delivering a system that runs smoothly and reliably.
              </p>
            </div>
            
            <div id="packaging-shipping" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">4. Packaging and Shipping</h2>
              
              <div className="bg-card rounded-lg border border-border/50 p-6 mb-6">
                <p className="mb-6">
                  Once your PC passes all tests and we're confident it's in perfect working order, we carefully package it for safe delivery. We use high-quality packaging materials to ensure your PC arrives in pristine condition.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-bold text-accent mb-3">Our Packaging Process</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>Custom-fit foam inserts to prevent movement</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>Anti-static materials to protect components</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>Reinforced corners for impact protection</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>Special GPU and cooler support brackets</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-bold text-accent mb-3">Shipping Partners</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>Trusted courier services with proven track records</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>Full tracking from dispatch to delivery</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>Insurance coverage for all shipments</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>Special handling instructions for fragile items</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <p className="mt-6 text-sm">
                  Standard shipping within the UK typically takes 1-2 days, depending on the courier service and your location.
                </p>
              </div>
            </div>
            
            <div id="delivery-timeline" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">5. Delivery Timeline</h2>
              
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 mb-6 text-center">
                <h3 className="text-2xl font-bold mb-4">Estimated Delivery Time: 7-10 Days</h3>
                <p className="text-muted-foreground mb-8">From the moment you place your order to delivery at your doorstep</p>
                
                <div className="relative py-4">
                  {/* Progress bar */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-border">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-primary to-accent"></div>
                  </div>
                  
                  {/* Timeline points */}
                  <div className="grid grid-cols-3 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4 relative z-10">
                        1
                      </div>
                      <h4 className="font-bold">Order Processing & Build</h4>
                      <div className="mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        3-5 days
                      </div>
                      <p className="mt-2 text-sm px-4">Component sourcing and assembly</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-primary/80 rounded-full flex items-center justify-center text-white font-bold mb-4 relative z-10">
                        2
                      </div>
                      <h4 className="font-bold">Testing & Troubleshooting</h4>
                      <div className="mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        2-3 days
                      </div>
                      <p className="mt-2 text-sm px-4">Quality assurance and benchmarking</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold mb-4 relative z-10">
                        3
                      </div>
                      <h4 className="font-bold">Shipping</h4>
                      <div className="mt-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                        1-2 days
                      </div>
                      <p className="mt-2 text-sm px-4">Secure delivery within UK mainland</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="restrictions-notes" className="policy-section mb-10">
              <h2 className="text-2xl font-semibold text-primary mb-5">6. Restrictions and Notes</h2>
              
              <div className="bg-warning/10 text-warning-foreground rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Important Notes:</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning mr-3 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p>Unfortunately, we can't offer timed or Saturday/Sunday delivery services outside of the UK mainland.</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning mr-3 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p>Currently, we are unable to deliver to the Republic of Ireland.</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning mr-3 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p>Delivery times may be extended during peak periods such as Black Friday, Christmas, and major product launches.</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-6">
                <p className="text-lg">
                  Thank you for choosing RigFreaks! We take pride in delivering a PC that's perfectly suited to your needs, with unparalleled performance and reliability.
                </p>
                
                <div className="mt-6 flex justify-center">
                  <Link href="/step-builder" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    Start Building Your PC
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Link href="/" className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-colors">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}