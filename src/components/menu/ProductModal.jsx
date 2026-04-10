import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, Loader2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { handleApiError } from '../../utils/handleApiError';
import { getImageUrl } from '../../utils/getImageUrl';

const formatPrice = (price) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';

export default function ProductModal({ product, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState(null);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedTemp, setSelectedTemp] = useState(null);

  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Fetch product detail
  useEffect(() => {
    setLoadingDetail(true);
    setDetailError(null);

    productService.getBySlug(product.slug)
      .then((res) => {
        const data = res.data.data ?? res.data;
        data.imageUrl = getImageUrl(data.imageUrl);
        setDetail(data);

        // Set default temperature
        if (data.variants?.length > 0) {
          const temps = [...new Set(data.variants.map((v) => v.temperature))];
          setSelectedTemp(temps[0] || null);
        }
      })
      .catch((err) => setDetailError(handleApiError(err)))
      .finally(() => setLoadingDetail(false));
  }, [product.slug]);

  // Animate in
  useGSAP(() => {
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.95, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.05 });
  });

  const handleClose = () => {
    gsap.to(modalRef.current, { opacity: 0, scale: 0.95, duration: 0.2, ease: 'power2.in' });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: onClose });
  };

  // Derive data from detail
  const variants = detail?.variants ?? [];
  const hasVariants = variants.length > 0;

  // Group unique sizes and temperatures
  const availableTemps = hasVariants
    ? [...new Set(variants.map((v) => v.temperature))]
    : [];

  // Filter variants by selected temperature to show size options
  const sizeVariants = hasVariants
    ? variants.filter((v) => !selectedTemp || v.temperature === selectedTemp)
    : [];

  // Unique sizes for selected temp
  const uniqueSizes = [];
  const seenSizes = new Set();
  for (const v of sizeVariants) {
    if (!seenSizes.has(v.sizeName)) {
      seenSizes.add(v.sizeName);
      uniqueSizes.push(v);
    }
  }

  // Current price
  const currentPrice = hasVariants
    ? (uniqueSizes[selectedVariantIdx] ?? uniqueSizes[0])?.price
    : detail?.minPrice;

  // Reset size index when temp changes
  useEffect(() => {
    setSelectedVariantIdx(0);
  }, [selectedTemp]);

  // Is product unavailable?
  const isUnavailable = detail ? detail.isActive === false : false;

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

        {loadingDetail ? (
          /* Loading state */
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-secondary" />
          </div>
        ) : detailError ? (
          /* Error state */
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <p className="text-red-500 text-sm mb-4">{detailError}</p>
            <button
              onClick={handleClose}
              className="text-sm font-medium text-primary border border-primary/20 px-4 py-2 rounded hover:bg-secondary hover:border-secondary transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : detail && (
          <div className="flex flex-col md:flex-row">
            {/* Left: Image */}
            <div className="md:w-1/2 shrink-0">
              <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                <img
                  src={detail.imageUrl}
                  alt={detail.name}
                  className="w-full h-full object-cover"
                />
                {detail.tags?.[0] && (
                  <span className="absolute top-4 left-4 bg-secondary text-primary text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm">
                    {detail.tags[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
              {/* Category */}
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                {detail.categoryName}
              </span>

              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-3">
                {detail.name}
              </h2>

              <p className="text-text-muted text-sm leading-relaxed mb-6">
                {detail.description}
              </p>

              {/* Temperature selection */}
              {availableTemps.length > 1 && (
                <div className="mb-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 block">
                    Nhiệt độ
                  </label>
                  <div className="flex gap-2">
                    {availableTemps.map((t) => (
                      <button
                        key={t}
                        onClick={() => !isUnavailable && setSelectedTemp(t)}
                        disabled={isUnavailable}
                        className={`px-5 py-2 text-sm font-medium rounded border transition-colors ${
                          selectedTemp === t
                            ? 'bg-primary text-bg border-primary'
                            : 'border-primary/15 text-text hover:border-primary'
                        } ${isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {uniqueSizes.length > 0 && (
                <div className="mb-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 block">
                    Chọn size
                  </label>
                  <div className="flex gap-2">
                    {uniqueSizes.map((variant, idx) => (
                      <button
                        key={variant.id ?? variant.sizeName}
                        onClick={() => !isUnavailable && setSelectedVariantIdx(idx)}
                        disabled={isUnavailable}
                        className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                          selectedVariantIdx === idx
                            ? 'bg-secondary text-primary border-secondary'
                            : 'border-primary/15 text-text hover:border-secondary'
                        } ${isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {variant.sizeName}
                        <span className="block text-[10px] mt-0.5 opacity-70">
                          {formatPrice(variant.price)}
                        </span>
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
                      {currentPrice != null ? formatPrice(currentPrice) : '—'}
                    </span>
                  </div>
                  {isUnavailable && (
                    <span className="text-sm font-bold text-red-500">Tạm hết hàng</span>
                  )}
                </div>

                <p className="text-xs text-text-muted italic">
                  Liên hệ nhân viên để đặt hàng
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
