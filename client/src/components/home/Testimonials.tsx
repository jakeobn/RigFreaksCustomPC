import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface TestimonialProps {
  quote: string;
  title: string;
  name: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, title, name, rating }) => {
  return (
    <Card className="bg-dark-surface rounded-xl border border-gray-800 relative">
      <CardContent className="p-6">
        <div className="text-primary text-4xl absolute -top-5 right-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
          </svg>
        </div>
        <div className="mb-4">
          <div className="flex text-yellow-400 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg 
                key={i}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="h-4 w-4"
              >
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
          <h3 className="text-xl font-rajdhani font-bold">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          {quote}
        </p>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-dark-card flex items-center justify-center text-primary">
            <User className="h-6 w-6" />
          </div>
          <div className="ml-3">
            <h4 className="font-medium">{name}</h4>
            <p className="text-muted-foreground text-sm">Verified Buyer</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "The Vortex Pro X has exceeded all my expectations. Every game runs flawlessly at 4K, and the build quality is exceptional. Customer service was top-notch too.",
      title: "Incredible Performance",
      name: "Alex Reynolds",
      rating: 5
    },
    {
      quote: "Using the custom PC builder was a breeze. The real-time compatibility checks saved me from making mistakes, and the final build arrived exactly as I designed it.",
      title: "Custom Build Made Easy",
      name: "Sarah Chen",
      rating: 5
    },
    {
      quote: "As a video editor, my Pulse Creator PC handles 4K footage without breaking a sweat. Renders are lightning fast, and it stays whisper quiet even under heavy loads.",
      title: "Perfect for Content Creation",
      name: "Marcus Johnson",
      rating: 4.5
    }
  ];

  return (
    <section className="py-16 bg-dark-base">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-rajdhani mb-10 text-center">
          <span className="border-b-4 border-primary pb-2">WHAT OUR CUSTOMERS SAY</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              title={testimonial.title}
              name={testimonial.name}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
