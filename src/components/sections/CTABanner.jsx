import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);

  useGSAP(() => {
    // Parallax background effect
    gsap.to(bgRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: '20%',
      ease: 'none'
    });

    // Content fade in
    gsap.from('.cta-content', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative py-32 md:py-40 overflow-hidden flex items-center justify-center">
      
      {/* Parallax Background */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <img 
          ref={bgRef}
          src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&q=80" 
          alt="Coffee shop atmosphere" 
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-primary/70"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <span className="cta-content inline-block text-secondary text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-6">
          ĐẾN VỚI CHÚNG TÔI
        </span>
        
        <h2 className="cta-content font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bg mb-10 whitespace-pre-line leading-tight">
          Trải Nghiệm Hương Vị<br/>Khác Biệt
        </h2>
        
        <div className="cta-content flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link 
            to="/menu"
            className="w-full sm:w-auto px-8 py-3 bg-secondary text-primary font-medium rounded hover:bg-secondary/90 transition-colors"
          >
            Xem thực đơn
          </Link>
          <Link 
            to="/contact"
            className="w-full sm:w-auto px-8 py-3 bg-transparent border border-bg text-bg font-medium rounded hover:bg-bg hover:text-primary transition-colors"
          >
            Tìm chi nhánh
          </Link>
        </div>
      </div>
      
    </section>
  );
}