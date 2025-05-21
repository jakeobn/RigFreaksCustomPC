import React from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import vortexPcImage from "@assets/Untitled design (3).png";
import novaPcImage from "@assets/Untitled design (1).png";

interface CategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  imageUrl,
  slug
}) => {
  return (
    <Card className="bg-dark-surface rounded-lg overflow-hidden border border-gray-800 neon-border group transition-all duration-300">
      <div className="h-60 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold font-rajdhani mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Link href={`/collections/${slug}`} className="inline-block text-primary font-rajdhani font-semibold group-hover:underline transition">
          EXPLORE {title.split(" ")[0]} <ChevronRight className="inline-block ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

const FeaturedCategories: React.FC = () => {
  const categories = [
    {
      title: "VORTEX SERIES",
      description: "Ultimate 4K gaming experience with framerates up to 120fps",
      imageUrl: vortexPcImage,
      slug: "vortex"
    },
    {
      title: "NOVA SERIES",
      description: "Perfect for 1080p/1440p gaming with smooth framerates",
      imageUrl: novaPcImage,
      slug: "nova"
    },
    {
      title: "PULSE SERIES",
      description: "Designed for content creators, video editing, and 3D rendering",
      imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      slug: "pulse"
    },
    {
      title: "RACING SIMULATION PCs",
      description: "Tussle for pole position with a specialist racing sim setup",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      slug: "racing-sim"
    },
    {
      title: "FLIGHT SIMULATION PCs",
      description: "Take to the skies with immersive flight simulation rigs",
      imageUrl: "https://images.unsplash.com/photo-1546132006-0fed653d554c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      slug: "flight-sim"
    }
  ];

  return (
    <section className="py-16 bg-dark-base">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-rajdhani mb-12 text-center">
          <span className="border-b-4 border-primary pb-2">FEATURED COLLECTIONS</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index}
              title={category.title}
              description={category.description}
              imageUrl={category.imageUrl}
              slug={category.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
