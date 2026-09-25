import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PlatformLogo {
  id: string;
  name: string;
  localSrc: string;
  remoteFallback: string;
  alt: string;
}

const PLATFORMS: PlatformLogo[] = [
  {
    id: 'fridaysflats',
    name: 'Fridays Flats',
    localSrc: '/platforms/fridaysflats-logo.svg',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/05/fridaysflats-logo.svg',
    alt: 'fridaysflats -logo'
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    localSrc: '/platforms/airbnb-logo.svg',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/03/airbnb-_logo.svg',
    alt: 'airbnb _logo'
  },
  {
    id: 'vrbo',
    name: 'Vrbo',
    localSrc: '/platforms/vrbo-logo.svg',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/03/vrbo-_logo.svg',
    alt: 'vrbo _logo'
  },
  {
    id: 'booking',
    name: 'Booking.com',
    localSrc: '/platforms/booking-logo.svg',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/03/booking-_logo.svg',
    alt: 'booking _logo'
  },
  {
    id: 'hostfully',
    name: 'Hostfully',
    localSrc: '/platforms/hostfully-logo.svg',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/03/hostfully-_logo.svg',
    alt: 'hostfully _logo'
  },
  {
    id: 'airdna',
    name: 'AirDNA',
    localSrc: '/platforms/airdna-logo.png',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/05/airdna-logo.png',
    alt: 'airdna-logo'
  },
  {
    id: 'beyond',
    name: 'Beyond',
    localSrc: '/platforms/beyond-logo.png',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/05/beyond-logo.png',
    alt: 'beyond-logo'
  },
  {
    id: 'hometogo',
    name: 'HomeToGo',
    localSrc: '/platforms/home-to-go-logo.png',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/05/home-to-go-logo.png',
    alt: 'home-to-go-logo'
  },
  {
    id: 'homes-villas',
    name: 'Homes & Villas by Marriott Bonvoy',
    localSrc: '/platforms/home-villas-logo.png',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/05/home-villas-logo.png',
    alt: 'home-villas-logo'
  },
  {
    id: 'pricelabs',
    name: 'PriceLabs',
    localSrc: '/platforms/pricelabs-logo.png',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/05/pricelabs-logo.png',
    alt: 'pricelabs-logo'
  },
  {
    id: 'turno',
    name: 'Turno',
    localSrc: '/platforms/turno-logo.png',
    remoteFallback: 'https://bcnflatmanagement.com/wp-content/uploads/2023/05/turno-logo.png',
    alt: 'turno-logo'
  }
];

export const PlatformsCarouselSection: React.FC = () => {
  const { currentTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive visible count: 3 on mobile (<640px), 4 on tablet (<1024px), 5 on desktop (>=1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(4);
      } else {
        setVisibleCount(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, PLATFORMS.length - visibleCount);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay interval (3800ms, paused on hover)
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

  return (
    <section 
      id="seccion-plataformas-reserva" 
      aria-label="Plataformas de gestión y distribución turística"
      className="py-12 sm:py-16 bg-white border-y border-slate-200/90 shadow-xs relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching BCN Flat Management style */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 
            id="heading-plataformas-turismo"
            className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Gestionamos tu propiedad en las principales plataformas
          </h2>
          <div 
            className="w-12 h-0.5 mx-auto mt-2.5 rounded-full opacity-60"
            style={{ backgroundColor: currentTheme.colors.primary }}
          />
        </div>

        {/* Carousel Container */}
        <div 
          id="contenedor-carrusel-plataformas"
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="Carrusel de plataformas de reserva"
        >
          {/* Navigation Arrows */}
          <button
            type="button"
            id="btn-carrusel-prev"
            onClick={prevSlide}
            aria-label="Plataforma anterior"
            className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="btn-carrusel-next"
            onClick={nextSlide}
            aria-label="Siguiente plataforma"
            className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Sliding Track Viewport */}
          <div className="overflow-hidden py-3">
            <div 
              className="flex items-center transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
              }}
            >
              {PLATFORMS.map((platform, idx) => (
                <div
                  key={platform.id}
                  id={`slide-plataforma-${platform.id}`}
                  className="shrink-0 px-3 sm:px-6 md:px-8 flex items-center justify-center"
                  style={{ width: `${100 / visibleCount}%` }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} de ${PLATFORMS.length}: ${platform.name}`}
                >
                  <figure className="w-full flex items-center justify-center h-14 sm:h-16 md:h-20 group">
                    <img
                      src={platform.localSrc}
                      alt={platform.alt}
                      loading="lazy"
                      decoding="async"
                      className="max-h-8 sm:max-h-10 md:max-h-12 w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[180px] object-contain transition-all duration-300 filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                      onError={(e) => {
                        // Defensive fallback to remote URL if local asset ever fails
                        const target = e.currentTarget;
                        if (target.src !== platform.remoteFallback) {
                          target.src = platform.remoteFallback;
                        }
                      }}
                    />
                  </figure>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Pagination Bullets (matching BCN Flat Management pagination) */}
          <div 
            id="paginacion-carrusel-plataformas"
            className="flex items-center justify-center gap-2 mt-6 sm:mt-8"
            role="tablist"
            aria-label="Páginas del carrusel"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => {
              const isActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  role="tab"
                  id={`dot-plataformas-${dotIdx}`}
                  aria-selected={isActive}
                  aria-label={`Ir al grupo ${dotIdx + 1}`}
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                    isActive 
                      ? 'w-6 h-2 bg-slate-800' 
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.colors.primary : undefined
                  }}
                />
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
