import React from "react";
import { Link } from "wouter";
import { ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative h-[80vh] flex items-center bg-cover bg-center" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1587202372616-b43abea06c2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-dark-base/90 to-dark-base/70"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-rajdhani mb-4 leading-tight">
            CUSTOM-BUILT <span className="text-primary">GAMING PCs</span> FOR ULTIMATE PERFORMANCE
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-inter">
            Engineered for gamers. Built by enthusiasts. Trusted by pros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild 
              className="bg-primary hover:bg-primary/90 text-white text-lg h-auto px-8 py-4 font-rajdhani font-semibold"
            >
              <Link href="/collections/all">
                SHOP PRE-BUILT PCs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-accent/10 hover:text-white text-lg h-auto px-8 py-4 font-rajdhani font-semibold"
            >
              <Link href="/step-builder">
                BUILD YOUR OWN PC <Wrench className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
