import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  mainImage?: string;
  alt: string;
  className?: string;
}

export function ImageGallery({ images, mainImage, alt, className = '' }: ImageGalleryProps) {
  const allImages = mainImage 
    ? [mainImage, ...images.filter(img => img !== mainImage)]
    : images;
    
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const onSelect = () => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  };

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // If there's only one image, just render it without the carousel
  if (allImages.length <= 1) {
    return (
      <div className={`relative aspect-square overflow-hidden ${className}`}>
        <img 
          src={allImages[0]} 
          alt={alt} 
          className="w-full h-full object-contain mix-blend-normal"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {allImages.map((src, index) => (
            <div 
              className="relative min-w-full aspect-square flex items-center justify-center" 
              key={index}
            >
              <img 
                src={src} 
                alt={`${alt} ${index + 1}`} 
                className="w-full h-full object-contain mix-blend-normal"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md z-10"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md z-10"
        onClick={scrollNext}
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </Button>
      
      {/* Image counter and dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 z-10">
        {/* Dots indicator */}
        <div className="flex justify-center bg-black/20 backdrop-blur-sm rounded-full py-1.5 px-3 gap-1.5">
          {allImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === selectedIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}