import React from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import CustomPCBuilderCTA from "@/components/home/CustomPCBuilderCTA";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import BlogNews from "@/components/home/BlogNews";
import { Helmet } from "react-helmet";

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>RigFreaks - Custom Gaming PCs & Professional Workstations</title>
        <meta name="description" content="RigFreaks builds custom gaming PCs and workstations with premium components for gamers, creators, and professionals. Shop pre-built systems or design your own." />
        <meta property="og:title" content="RigFreaks - Custom Gaming PCs & Professional Workstations" />
        <meta property="og:description" content="Custom-built gaming PCs and workstations, designed by enthusiasts for enthusiasts. From 4K gaming to content creation." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1587202372616-b43abea06c2a" />
        <meta property="og:url" content="https://rigfreaks.com" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <HeroSection />
      <FeaturedCategories />
      <CustomPCBuilderCTA />
      <FeaturedProducts />
      <Testimonials />
      <BlogNews />
    </>
  );
};

export default Home;
