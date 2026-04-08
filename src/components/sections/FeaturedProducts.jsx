import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FEATURED_PRODUCTS } from '../../constants/featuredData';

gsap.registerPlugin(ScrollTrigger);

const TABS = ["Tất cả", "Cà Phê Việt", "Espresso", "Cold Brew", "Trà & Nước"];

export default function FeaturedProducts() {
  const containerRef = useRef(null);
  const cardsRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [filteredProducts, setFilteredProducts] = useState(FEATURED_PRODUCTS);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Initial scroll animation
  useGSAP(() => {
    gsap.from('.section-header', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.product-card', {
      scrollTrigger: {
        trigger: cardsRef.current,
        start: 'top 85%',
        once: true,
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, []);

  const handleTabChange = contextSafe((tab) => {
    if (tab === activeTab) return;
    
    // Animate out
    gsap.to('.product-card', {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        setActiveTab(tab);
        const filtered = tab === "Tất cả" 
          ? FEATURED_PRODUCTS 
          : FEATURED_PRODUCTS.filter(p => p.category === tab);
        setFilteredProducts(filtered);

        // React needs a tick to render new DOM before we animate in
        setTimeout(() => {
          gsap.fromTo('.product-card', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
          );
        }, 50);
      }
    });
  });

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-bg">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header & Tabs */}
        <div className="section-header text-center mb-12">
          <span className="inline-block text-secondary text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4">
            SẢN PHẨM NỔI BẬT
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-10">
            Tinh Hoa Trong Từng Ly
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`text-sm md:text-base font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-secondary text-primary' 
                    : 'border-transparent text-text-muted hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card group relative">
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden rounded bg-bg-dark mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.tag && (
                  <div className="absolute top-4 left-4 bg-secondary text-primary text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm z-10">
                    {product.tag}
                  </div>
                )}
                
                {/* Hover Overlay Button */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <Link 
                    to={`/product/${product.id}`}
                    className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-bg text-primary font-medium px-6 py-2 rounded shadow-lg hover:bg-secondary hover:text-bg"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
              
              {/* Info */}
              <div className="text-center">
                <p className="text-text-muted text-sm mb-1">{product.category}</p>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  <Link to={`/product/${product.id}`} className="hover:text-secondary transition-colors">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-secondary font-medium">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}