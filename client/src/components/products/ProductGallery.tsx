import React, { useState, useRef, useEffect } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  X, 
  Share2,
  Download
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

  // Auto-hide overlay after inactivity
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isZoomed) {
      timer = setTimeout(() => {
        setShowOverlay(false);
      }, 3000);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isZoomed, dragPosition]);

  const handleMouseMove = () => {
    setShowOverlay(true);
  };

  const nextImage = () => {
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setDragPosition({ x: 0, y: 0 });
    }
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setDragPosition({ x: 0, y: 0 });
    }
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    if (isZoomed) {
      setZoomLevel(1);
      setDragPosition({ x: 0, y: 0 });
    } else {
      setZoomLevel(1.5);
    }
    setIsZoomed(!isZoomed);
  };

  const increaseZoom = () => {
    if (zoomLevel < 3) {
      setZoomLevel(zoomLevel + 0.5);
      setIsZoomed(true);
    }
  };

  const decreaseZoom = () => {
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 0.5);
      if (zoomLevel - 0.5 <= 1) {
        setIsZoomed(false);
        setDragPosition({ x: 0, y: 0 });
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Reset zoom when toggling fullscreen
    if (!isFullscreen) {
      setZoomLevel(1);
      setDragPosition({ x: 0, y: 0 });
      setIsZoomed(false);
    }
  };

  const handleImageDrag = (event: any, info: any) => {
    if (zoomLevel > 1) {
      setDragPosition({
        x: info.offset.x,
        y: info.offset.y
      });
      setShowOverlay(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const xDiff = touchStart.x - e.touches[0].clientX;
    
    // If horizontal swipe is significant and we're not zoomed in
    if (Math.abs(xDiff) > 50 && zoomLevel === 1) {
      if (xDiff > 0) {
        nextImage();
      } else {
        prevImage();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this ${title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Could not share:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <div className="w-full" ref={containerRef}>
        {/* Main image display */}
        <div 
          className="relative mb-4 border border-gray-800 rounded-lg overflow-hidden bg-gradient-to-b from-gray-900 to-black"
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-[450px] overflow-hidden">
            <motion.img 
              ref={imageRef}
              src={images[selectedImage]} 
              alt={`${title} - Image ${selectedImage + 1}`} 
              className="w-full h-full object-contain select-none"
              style={{
                cursor: isZoomed ? 'grab' : 'zoom-in',
                transformOrigin: 'center center',
              }}
              onClick={zoomLevel === 1 ? toggleZoom : undefined}
              drag={zoomLevel > 1}
              dragConstraints={containerRef}
              dragElastic={0.1}
              animate={{ 
                scale: zoomLevel,
                x: dragPosition.x,
                y: dragPosition.y
              }}
              onDragStart={() => setIsZoomed(true)}
              onDrag={handleImageDrag}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          
          {/* Overlay controls - shown on hover or when active */}
          <AnimatePresence>
            {(showOverlay || !isZoomed) && (
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top controls */}
                <div className="absolute top-3 right-3 flex space-x-2 pointer-events-auto">
                  <Button 
                    size="icon"
                    variant="outline"
                    className="bg-black/50 backdrop-blur hover:bg-black/70 text-white border-gray-700 h-8 w-8 rounded-full"
                    onClick={handleShareClick}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon"
                    variant="outline"
                    className="bg-black/50 backdrop-blur hover:bg-black/70 text-white border-gray-700 h-8 w-8 rounded-full"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Bottom controls */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 pointer-events-auto">
                    <Button 
                      size="icon"
                      variant="ghost" 
                      className="h-7 w-7 rounded-full hover:bg-gray-800/50 text-white"
                      onClick={prevImage}
                      disabled={selectedImage === 0 && zoomLevel === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-white text-xs font-medium flex items-center">
                      {selectedImage + 1} / {images.length}
                    </span>
                    <Button 
                      size="icon"
                      variant="ghost" 
                      className="h-7 w-7 rounded-full hover:bg-gray-800/50 text-white"
                      onClick={nextImage}
                      disabled={selectedImage === images.length - 1 && zoomLevel === 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Zoom controls */}
                <div className="absolute bottom-3 right-3 flex flex-col space-y-2 pointer-events-auto">
                  {isZoomed ? (
                    <Button 
                      size="icon"
                      variant="outline"
                      className="bg-black/50 backdrop-blur hover:bg-black/70 text-white border-gray-700 h-8 w-8 rounded-full"
                      onClick={increaseZoom}
                      disabled={zoomLevel >= 3}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      size="icon"
                      variant="outline"
                      className="bg-black/50 backdrop-blur hover:bg-black/70 text-white border-gray-700 h-8 w-8 rounded-full"
                      onClick={toggleZoom}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {isZoomed && (
                    <Button 
                      size="icon"
                      variant="outline"
                      className="bg-black/50 backdrop-blur hover:bg-black/70 text-white border-gray-700 h-8 w-8 rounded-full"
                      onClick={decreaseZoom}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Thumbnail gallery - Desktop */}
        {images.length > 1 && (
          <div className="hidden md:grid grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                className={cn(
                  "overflow-hidden rounded-md border transition-all duration-200 aspect-square group",
                  selectedImage === index 
                    ? "border-primary ring-1 ring-primary" 
                    : "border-gray-800 opacity-70 hover:opacity-100 hover:border-gray-600"
                )}
                onClick={() => setSelectedImage(index)}
              >
                <div className="w-full h-full relative">
                  <img 
                    src={image} 
                    alt={`${title} thumbnail ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover group-hover:scale-105 transition-transform",
                      selectedImage === index ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                    )}
                  />
                  <div className={cn(
                    "absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100",
                    selectedImage === index ? "opacity-0" : "transition-opacity"
                  )}></div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Mobile view - Carousel */}
        <div className="md:hidden mt-4">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div 
                    className={cn(
                      "overflow-hidden rounded-lg p-1",
                      selectedImage === index 
                        ? "border-2 border-primary" 
                        : "border border-gray-800"
                    )}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${title} view ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-black/80 text-white border-gray-700" />
            <CarouselNext className="bg-black/80 text-white border-gray-700" />
          </Carousel>
        </div>
      </div>
      
      {/* Fullscreen dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-screen-xl w-[95vw] h-[90vh] p-0 border-gray-800 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-50 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="w-full h-full flex flex-col">
              {/* Main fullscreen image */}
              <div className="flex-1 relative overflow-hidden">
                <motion.img 
                  src={images[selectedImage]} 
                  alt={`${title} - Image ${selectedImage + 1}`} 
                  className="w-full h-full object-contain"
                  animate={{ scale: zoomLevel }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 rounded-full w-10 h-10 text-white hover:bg-black/60"
                      disabled={selectedImage === 0}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 rounded-full w-10 h-10 text-white hover:bg-black/60"
                      disabled={selectedImage === images.length - 1}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
              
              {/* Thumbnails in fullscreen mode */}
              {images.length > 1 && (
                <div className="h-20 border-t border-gray-800 flex items-center justify-center bg-black/90 p-2">
                  <div className="flex space-x-2 overflow-x-auto px-4">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={cn(
                          "flex-shrink-0 h-16 w-16 overflow-hidden rounded border transition-all",
                          selectedImage === index 
                            ? "border-primary" 
                            : "border-gray-700 opacity-60 hover:opacity-100"
                        )}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img 
                          src={image} 
                          alt={`${title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductGallery;
