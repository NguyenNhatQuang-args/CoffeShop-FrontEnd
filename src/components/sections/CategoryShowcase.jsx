import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES } from '../../constants/categoryData';

gsap.registerPlugin(ScrollTrigger);

export default function CategoryShowcase() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.from('.category-card', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      },
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, { scope: containerRef });

  const handleCategoryClick = (slug) => {
    navigate(`/menu?category=${slug}`);
  };

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-bg-dark">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
            THỰC ĐƠN CỦA CHÚNG TÔI
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {CATEGORIES.map((category) => (
            <div 
              key={category.id}
              className="category-card group relative aspect-square cursor-pointer overflow-hidden rounded"
              onClick={() => handleCategoryClick(category.slug)}
            >
              {/* Background Image */}
              <img 
                src={category.image} 
                alt={category.name} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <h3 className="font-heading text-2xl font-bold text-bg mb-1">
                  {category.name}
                </h3>
                <p className="text-secondary text-sm font-medium tracking-wider">
                  {category.count} Sản phẩm
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}