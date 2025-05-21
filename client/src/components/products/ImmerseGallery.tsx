import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Maximize2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ImmerseGalleryProps {
  images: string[];
  productTitle: string;
}

const ImmerseGallery: React.FC<ImmerseGalleryProps> = ({ images, productTitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0.5, y: 0.5 });
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };
  
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };
  
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    setIsZoomed(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
    
    setZoomPosition({ x, y });
  };
  
  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
    setIsZoomed(false);
  };
  
  const zoomStyles = isZoomed ? {
    transform: `scale(2.5)`,
    transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`
  } : {};
  
  return (
    <>
      {/* Regular Gallery */}
      <div className={`immerse-gallery ${isFullscreen ? 'hidden' : ''}`}>
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gray-800">
          {/* Main Image */}
          <div 
            className="relative w-full aspect-square cursor-zoom-in overflow-hidden"
            onMouseMove={handleMouseMove}
            onClick={handleZoomToggle}
          >
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={images[activeIndex]}
              alt={`${productTitle} - Image ${activeIndex + 1}`}
              className="w-full h-full object-contain"
              style={zoomStyles}
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/60 backdrop-blur-sm border-0 hover:bg-black/80"
              onClick={handleZoomToggle}
            >
              {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/60 backdrop-blur-sm border-0 hover:bg-black/80"
              onClick={handleFullscreenToggle}
            >
              <Maximize2 size={16} />
            </Button>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm border-0 hover:bg-black/80"
            onClick={handlePrev}
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm border-0 hover:bg-black/80"
            onClick={handleNext}
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Thumbnails */}
        <div className="mt-4 flex space-x-2 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                index === activeIndex ? 'border-primary' : 'border-gray-800'
              }`}
              onClick={() => handleThumbClick(index)}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
          >
            <div className="absolute top-4 right-4 flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/60 backdrop-blur-sm border-0 hover:bg-black/80"
                onClick={handleZoomToggle}
              >
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/60 backdrop-blur-sm border-0 hover:bg-black/80"
                onClick={handleFullscreenToggle}
              >
                <X size={20} />
              </Button>
            </div>

            <div 
              className="relative w-full h-[80vh] cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onClick={handleZoomToggle}
            >
              <motion.img
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={images[activeIndex]}
                alt={`${productTitle} - Image ${activeIndex + 1}`}
                className="w-full h-full object-contain"
                style={zoomStyles}
              />
            </div>

            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/60 backdrop-blur-sm border-0 hover:bg-black/80"
                onClick={handlePrev}
              >
                <ArrowLeft size={24} />
              </Button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/60 backdrop-blur-sm border-0 hover:bg-black/80"
                onClick={handleNext}
              >
                <ArrowRight size={24} />
              </Button>
            </div>

            <div className="mt-4 flex justify-center space-x-2 max-w-3xl overflow-x-auto p-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    index === activeIndex ? 'border-primary' : 'border-gray-700'
                  }`}
                  onClick={() => handleThumbClick(index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImmerseGallery;