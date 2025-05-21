import React from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface BlogPost {
  id: number;
  title: string;
  handle: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
}

const BlogNews: React.FC = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/blog/latest'],
    staleTime: 60 * 1000, // 1 minute
  });

  // Fallback data for initial render
  const blogPosts: BlogPost[] = posts || [
    {
      id: 1,
      title: "Next-Gen GPUs: What to Expect",
      handle: "next-gen-gpus",
      excerpt: "Exploring the upcoming GPU technologies and what they mean for gaming and content creation.",
      imageUrl: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      category: "News",
      date: "June 15, 2023"
    },
    {
      id: 2,
      title: "Custom Water Cooling Guide",
      handle: "water-cooling-guide",
      excerpt: "Everything you need to know about setting up a custom water cooling loop for maximum performance.",
      imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      category: "Guide",
      date: "June 8, 2023"
    },
    {
      id: 3,
      title: "Ultimate Gaming Setup Tour",
      handle: "gaming-setup-tour",
      excerpt: "Take a tour of our most advanced Vortex Pro X build with a complete gaming battlestation setup.",
      imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      category: "Showcase",
      date: "June 1, 2023"
    }
  ];

  return (
    <section className="py-16 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-rajdhani">
            <span className="border-b-4 border-accent pb-2">LATEST BUILDS & NEWS</span>
          </h2>
          <Link href="/blog" className="text-accent hover:text-primary transition-colors duration-300 font-rajdhani font-semibold">
            VIEW ALL <ArrowRight className="ml-1 h-4 w-4 inline-block" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <Card 
              key={post.id}
              className="bg-dark-surface rounded-lg overflow-hidden border border-gray-800 group hover:border-accent transition-all duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Badge 
                    variant="outline" 
                    className={`${
                      post.category === 'News' 
                        ? 'bg-accent/20 text-accent' 
                        : post.category === 'Guide' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-accent/20 text-accent'
                    } text-xs px-3 py-1 rounded-full`}
                  >
                    {post.category}
                  </Badge>
                  <span className="text-muted-foreground text-sm ml-3">{post.date}</span>
                </div>
                <h3 className="text-xl font-rajdhani font-bold mb-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                <Link 
                  href={`/blog/${post.handle}`} 
                  className="text-accent hover:text-primary transition-colors font-medium inline-flex items-center"
                >
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogNews;
