import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SLIDES } from '../../constants/heroSlides';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Auto-slide logic
  useEffect(() => {
    if (!isHovered) {
      // 1.5s = 1500ms theo yêu cầu
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 1500);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isHovered, nextSlide]);

  useGSAP(() => {
    const currentSlide = `.slide-${current}`;
    
    // Reset z-indexes to ensure current slide is on top
    gsap.set('.slide-bg', { zIndex: 0 });
    gsap.set(currentSlide, { zIndex: 10 });

    // Animate current slide background in (fade in from right)
    gsap.fromTo(currentSlide,
      { opacity: 0, x: 50, scale: 1 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
    );

    // Animate other slides out (scale up slightly + fade out)
    SLIDES.forEach((_, idx) => {
      if (idx !== current) {
        gsap.to(`.slide-${idx}`, {
          opacity: 0,
          scale: 1.05,
          duration: 1,
          ease: 'power2.inOut'
        });
      }
    });

    // Animate content of current slide (stagger slide up + fade in)
    gsap.fromTo(`.content-${current} .animate-item`,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.3 }
    );

  }, [current]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[70vh] md:h-screen bg-primary overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`slide-bg slide-${index} absolute inset-0 w-full h-full`}
          style={{ opacity: index === current ? 1 : 0 }}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay Tối Nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/30"></div>
          </div>

          {/* Content */}
          <div className={`content-${index} relative z-20 w-full h-full flex flex-col items-center justify-center text-center px-6 container mx-auto`}>
            <span className="animate-item inline-block text-secondary text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4 md:mb-6">
              {slide.tag}
            </span>
            
            <h2 className="animate-item font-heading text-bg font-bold leading-tight mb-6 max-w-4xl"
                style={{ fontSize: 'clamp(3rem, 5vw + 1rem, 6rem)' }}>
              {slide.title}
            </h2>
            
            <p className="animate-item text-bg/80 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
              {slide.description}
            </p>
            
            <div className="animate-item flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Link 
                to={`/product/${slide.id}`}
                className="w-full sm:w-auto px-8 py-3 bg-secondary text-primary font-medium rounded hover:bg-secondary/90 transition-colors"
              >
                {slide.btnPrimary}
              </Link>
              <Link 
                to="/menu"
                className="w-full sm:w-auto px-8 py-3 bg-transparent border border-bg text-bg font-medium rounded hover:bg-bg hover:text-primary transition-colors"
              >
                {slide.btnSecondary}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows (Hidden on Mobile) */}
      <button 
        onClick={prevSlide}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-bg/30 bg-primary/20 text-bg items-center justify-center backdrop-blur-sm hover:bg-secondary hover:border-secondary hover:text-primary transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={nextSlide}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-bg/30 bg-primary/20 text-bg items-center justify-center backdrop-blur-sm hover:bg-secondary hover:border-secondary hover:text-primary transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full h-2 ${
              index === current 
                ? 'w-8 bg-secondary' 
                : 'w-2 bg-bg/50 hover:bg-bg'
            }`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}