import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';

const formatPrice = (price) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';

export default function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedTemp, setSelectedTemp] = useState(product.temps[0]);
  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Animate in
  useGSAP(() => {
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.05 }
    );
  });

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: 'power2.in',
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  const currentPrice = product.sizes[selectedSize].price;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 bg-bg rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-bg/80 backdrop-blur flex items-center justify-center text-primary hover:bg-secondary hover:text-primary transition-colors shadow"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="md:w-1/2 shrink-0">
            <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 bg-secondary text-primary text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            {/* Category */}
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              {CATEGORY_LABELS[product.category] || product.category}
            </span>

            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-3">
              {product.name}
            </h2>

            <p className="text-text-muted text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size selection */}
            <div className="mb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 block">
                Chọn size
              </label>
              <div className="flex gap-2">
                {product.sizes.map((size, idx) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(idx)}
                    className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                      selectedSize === idx
                        ? 'bg-secondary text-primary border-secondary'
                        : 'border-primary/15 text-text hover:border-secondary'
                    }`}
                  >
                    {size.name}
                    <span className="block text-[10px] mt-0.5 opacity-70">
                      {formatPrice(size.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature selection */}
            {product.temps.length > 1 && (
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 block">
                  Nhiệt độ
                </label>
                <div className="flex gap-2">
                  {product.temps.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTemp(t)}
                      className={`px-5 py-2 text-sm font-medium rounded border transition-colors ${
                        selectedTemp === t
                          ? 'bg-primary text-bg border-primary'
                          : 'border-primary/15 text-text hover:border-primary'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mt-auto pt-6 border-t border-primary/10">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-xs text-text-muted block mb-1">Giá</span>
                  <span className="font-heading text-3xl font-bold text-secondary">
                    {formatPrice(currentPrice)}
                  </span>
                </div>
                {!product.isAvailable && (
                  <span className="text-sm font-bold text-red-500">Tạm hết hàng</span>
                )}
              </div>

              <p className="text-xs text-text-muted italic">
                Liên hệ nhân viên để đặt hàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_LABELS = {
  'ca-phe-viet': 'Cà Phê Việt',
  espresso: 'Espresso',
  'cold-brew': 'Cold Brew',
  'tra-matcha': 'Trà & Matcha',
  'sinh-to': 'Sinh Tố & Nước Ép',
  chocolate: 'Chocolate',
};
