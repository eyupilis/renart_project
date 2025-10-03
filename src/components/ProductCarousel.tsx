import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCarouselProps {
  products: Product[];
  autoPlay?: boolean;
  transitionSpeed?: number;
  showParallax?: boolean;
  onProductSelect?: (product: Product) => void;
}

interface TouchData {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  velocity: number;
  startTime: number;
}

export function ProductCarousel({ 
  products, 
  autoPlay = true, 
  transitionSpeed = 600,
  showParallax = true,
  onProductSelect 
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchData, setTouchData] = useState<TouchData | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Progressive image loading
  const preloadImages = useCallback((startIndex: number, count: number = 5) => {
    const imagesToLoad = [];
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % products.length;
      if (!loadedImages.has(index)) {
        imagesToLoad.push(index);
      }
    }

    imagesToLoad.forEach(index => {
      const product = products[index];
      if (product) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
        img.src = product.image_white;
      }
    });
  }, [products, loadedImages]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && products.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, 4000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, products.length]);

  // Preload images when component mounts or current index changes
  useEffect(() => {
    preloadImages(currentIndex);
  }, [currentIndex, preloadImages]);

  // Parallax scroll effect
  useEffect(() => {
    if (!showParallax) return;

    const handleScroll = () => {
      if (carouselRef.current) {
        const rect = carouselRef.current.getBoundingClientRect();
        const centerY = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const offset = (centerY - elementCenter) * 0.05;
        setParallaxOffset(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showParallax]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev + 1) % products.length);
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionSpeed);
  }, [isTransitioning, products.length, transitionSpeed]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionSpeed);
  }, [isTransitioning, products.length, transitionSpeed]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionSpeed);
  }, [isTransitioning, currentIndex, transitionSpeed]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchData({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: false,
      velocity: 0,
      startTime: Date.now()
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchData) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchData.startX;
    const deltaY = touch.clientY - touchData.startY;
    
    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      
      const velocity = deltaX / (Date.now() - touchData.startTime);
      setTouchData({
        ...touchData,
        currentX: touch.clientX,
        currentY: touch.clientY,
        isDragging: true,
        velocity
      });
    }
  }, [touchData]);

  const handleTouchEnd = useCallback(() => {
    if (!touchData) return;
    
    const deltaX = touchData.currentX - touchData.startX;
    const threshold = 50;
    const velocityThreshold = 0.5;
    
    if (touchData.isDragging && (Math.abs(deltaX) > threshold || Math.abs(touchData.velocity) > velocityThreshold)) {
      if (deltaX > 0 || touchData.velocity > velocityThreshold) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    setTouchData(null);
  }, [touchData, goToNext, goToPrevious]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (products.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center">
        <div className="text-neutral-500 text-lg">No products available</div>
      </div>
    );
  }

  // Get visible rings (5 rings: 2 before, 1 center, 2 after)
  const getVisibleRings = () => {
    const rings = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + products.length) % products.length;
      rings.push({
        product: products[index],
        index,
        position: i,
        isActive: i === 0
      });
    }
    return rings;
  };

  const visibleRings = getVisibleRings();

  return (
    <div className="w-full py-12 bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-3 tracking-wide">
            Featured Collection
          </h2>
          <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Discover our handcrafted engagement rings, each piece representing timeless elegance and exceptional artistry
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative group"
          style={{
            transform: showParallax ? `translateY(${parallaxOffset}px)` : undefined,
            transition: showParallax ? 'transform 0.1s ease-out' : undefined
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Multi-Ring Display */}
          <div className="relative h-[320px] overflow-hidden">
            <div className="flex items-center justify-center h-full space-x-8">
              {visibleRings.map(({ product, index, position, isActive }) => {
                // Calculate scale and opacity based on position
                let scale = 0.7;
                let opacity = 0.4;
                let zIndex = 1;
                
                if (position === 0) { // Center ring
                  scale = 1;
                  opacity = 1;
                  zIndex = 10;
                } else if (Math.abs(position) === 1) { // Adjacent rings
                  scale = 0.85;
                  opacity = 0.7;
                  zIndex = 5;
                } else { // Outer rings
                  scale = 0.7;
                  opacity = 0.4;
                  zIndex = 1;
                }

                return loadedImages.has(index) ? (
                  <img
                    key={`ring-${index}-${position}`}
                    src={product.image_white}
                    alt={product.name}
                    className="flex-shrink-0 transition-all duration-700 ease-out cursor-pointer hover:scale-110 object-contain"
                    style={{
                      width: '280px',
                      height: '280px',
                      transform: `scale(${scale})`,
                      opacity,
                      zIndex,
                      transitionDuration: `${transitionSpeed}ms`
                    }}
                    onClick={() => {
                      if (isActive && onProductSelect) {
                        onProductSelect(product);
                      } else if (!isActive) {
                        goToSlide(index);
                      }
                    }}
                  />
                ) : (
                  <div
                    key={`ring-loading-${index}-${position}`}
                    className="flex-shrink-0 w-32 h-32 bg-neutral-200 rounded-full animate-pulse flex items-center justify-center"
                    style={{
                      transform: `scale(${scale})`,
                      opacity,
                      zIndex
                    }}
                  >
                    <div className="w-16 h-16 bg-neutral-300 rounded-full animate-pulse" />
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md 
                       rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
              aria-label="Previous rings"
            >
              <ChevronLeft size={20} className="text-neutral-800" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md 
                       rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
              aria-label="Next rings"
            >
              <ChevronRight size={20} className="text-neutral-800" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(prev => !prev);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full 
                       flex items-center justify-center hover:bg-black/80 transition-all duration-300
                       opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? (
                <Pause size={16} className="text-white" />
              ) : (
                <Play size={16} className="text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 disabled:cursor-not-allowed ${
                index === currentIndex
                  ? 'w-8 h-2 bg-neutral-800 rounded-full'
                  : 'w-2 h-2 bg-neutral-300 rounded-full hover:bg-neutral-400 hover:scale-125'
              }`}
              aria-label={`Go to ring ${index + 1}`}
            />
          ))}
        </div>

        {/* Carousel Info */}
        <div className="flex items-center justify-between mt-6 text-xs text-neutral-600">
          <div className="flex items-center space-x-3">
            <span>{currentIndex + 1} of {products.length}</span>
            <span className="w-px h-3 bg-neutral-300" />
            <span>Use arrow keys or swipe to navigate • Click rings to select</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span>Auto-play:</span>
            <div className={`w-6 h-3 rounded-full border transition-all duration-300 ${
              isPlaying ? 'bg-neutral-800 border-neutral-800' : 'bg-white border-neutral-300'
            }`}>
              <div className={`w-2 h-2 bg-white rounded-full transition-all duration-300 ${
                isPlaying ? 'translate-x-3' : 'translate-x-0.5'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}