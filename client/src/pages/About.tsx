import { useEffect } from "react";
import { Link } from "wouter";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { 
  Info,
  CheckCircle, 
  Target, 
  Eye,
  Cpu
} from "lucide-react";

export default function About() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>About RigFreaks | Custom PC Builders</title>
        <meta name="description" content="Learn about RigFreaks, our story, values, and why we're the UK's most trusted custom PC builder. Built to perform, designed for you." />
      </Helmet>
      
      <div className="bg-gradient-to-b from-dark-card to-black py-10 border-b border-border">
        <Container>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-accent/10 p-4 rounded-full">
              <Info className="h-8 w-8 md:h-10 md:w-10 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">About RigFreaks</h1>
            <h2 className="text-xl text-primary mt-2 mb-4 font-semibold">Built to Perform. Designed for You.</h2>
            <div className="max-w-3xl text-center">
              <p className="text-muted-foreground text-lg mt-4">
                At RigFreaks, we're not just building PCs — we're delivering power, precision, and personality in every rig. Based in the UK, we specialize in custom-built desktop PCs tailored for gamers, creators, streamers, and professionals who demand more than just average performance.
              </p>
              <p className="text-muted-foreground text-lg mt-4">
                We believe your PC should work as hard as you do — whether you're climbing the ranks in competitive gaming, editing 4K footage, designing in CAD, or multitasking across demanding workflows. That's why every RigFreaks machine is assembled with care, tested for quality, and optimized for real-world use.
              </p>
            </div>
          </div>
        </Container>
      </div>
      
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 inline-block pb-2 border-b-2 border-primary">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                RigFreaks started with a simple frustration: mass-produced PCs just didn't deliver. Too many prebuilt systems were packed with mismatched components, subpar cooling, and limited upgrade paths — all wrapped in flashy marketing. We knew there had to be a better way.
              </p>
              <p>
                So we created RigFreaks — a UK-based service that puts customization, quality, and performance first. With a team of builders who live and breathe PC tech, we set out to create a place where every customer gets a rig that's built with purpose, passion, and precision.
              </p>
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg border border-border">
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80" 
                alt="PC building workshop" 
                className="w-full h-full object-cover aspect-video" 
              />
            </div>
          </div>
        </div>
        
        <div className="my-16 border-t border-border pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-black/20 p-4 rounded-lg border border-border">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518789646222-6ca1e8e9833f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                  alt="Custom gaming PC" 
                  className="w-full h-full object-cover aspect-video" 
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 inline-block pb-2 border-b-2 border-primary">Why Choose RigFreaks?</h2>
              <ul className="space-y-4">
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold text-primary">100% UK Focus</span> – We only serve the UK, which means faster delivery, localized support, and no surprises with taxes or import fees.
                  </div>
                </li>
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold text-primary">Expert Compatibility Checks</span> – Every part is hand-verified by experienced builders before assembly.
                  </div>
                </li>
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold text-primary">No Bloatware, Ever</span> – We ship clean systems with only the essentials installed — no unnecessary apps or background junk.
                  </div>
                </li>
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold text-primary">Real Customer Support</span> – We're a small, passionate team that genuinely cares about your build.
                  </div>
                </li>
                <li className="flex">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold text-primary">Premium Cable Management</span> – Because your rig should look as good as it performs.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="my-16 border-t border-border pt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center inline-block pb-2 border-b-2 border-primary">Our Mission & Vision</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-dark-card border-border hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Our Mission</h3>
                <p className="text-muted-foreground text-center">
                  To empower users across the UK with reliable, high-performance desktops — built the right way, from the ground up.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-card border-border hover:border-accent/50 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-accent/10">
                    <Eye className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Our Vision</h3>
                <p className="text-muted-foreground text-center">
                  To be the UK's most trusted name in custom PC building, where power meets personalization and every user is proud to call their machine a RigFreak.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-16 pt-16 border-t border-border text-center">
          <div className="bg-gradient-to-r from-dark-card to-black p-10 rounded-xl border border-border max-w-4xl mx-auto">
            <Cpu className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Experience the RigFreaks Difference?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a competitive gamer, content creator, or enthusiast, we've got the perfect PC for you. Start building yours today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                className="bg-primary hover:bg-primary/90 text-white font-semibold h-auto py-3 px-6"
              >
                <Link href="/collections/all">
                  SHOP PRE-BUILT PCs
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent/10 font-semibold h-auto py-3 px-6"
              >
                <Link href="/step-builder">
                  BUILD YOUR OWN PC
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
