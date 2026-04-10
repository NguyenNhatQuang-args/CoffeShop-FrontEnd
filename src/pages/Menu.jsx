import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search, SlidersHorizontal, X, Grid3X3, List, ChevronDown, ChevronLeft, ChevronRight, Coffee, Loader2, RefreshCw,
} from 'lucide-react';
import useMenu from '../hooks/useMenu';
import ProductModal from '../components/menu/ProductModal';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';
import { getImageUrl } from '../utils/getImageUrl';

gsap.registerPlugin(ScrollTrigger);

const formatPrice = (price) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';

const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'name-az', label: 'Tên A-Z' },
];

export default function Menu() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const {
    products,
    categories,
    total,
    loading,
    error,
    filters,
    setFilters,
    retry,
  } = useMenu();

  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const heroRef = useRef(null);
  const sidebarRef = useRef(null);
  const productsRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  // Sync category from URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== filters.categorySlug) {
      setFilters((prev) => ({ ...prev, categorySlug: cat, page: 1 }));
    }
  }, [searchParams]);

  // Debounced search → sync searchInput into filters.search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput, page: 1 };
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // =================== GSAP ANIMATIONS ===================

  useGSAP(() => {
    gsap.from('.menu-hero-item', {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2,
    });
  }, { scope: heroRef });

  useGSAP(() => {
    gsap.from(sidebarRef.current, {
      x: -30, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.3,
    });
  }, { scope: sidebarRef });

  useGSAP(() => {
    if (!loading && products.length > 0) {
      const cards = gsap.utils.toArray('.product-item');
      if (cards.length === 0) return;

      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play none none none',
            once: true,
          },
        },
      );
    }
  }, { scope: productsRef, dependencies: [loading, products] });

  useGSAP(() => {
    if (!mobileDrawerRef.current) return;
    if (mobileFilterOpen) {
      gsap.to(mobileDrawerRef.current, { y: 0, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to(mobileDrawerRef.current, { y: '100%', duration: 0.3, ease: 'power2.in' });
    }
  }, [mobileFilterOpen]);

  const animateCardsIn = useCallback(() => {
    requestAnimationFrame(() => {
      gsap.fromTo(
        '.product-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' },
      );
    });
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      animateCardsIn();
      ScrollTrigger.refresh();
    }
  }, [products, viewMode, loading, animateCardsIn]);

  // =================== FILTER HELPERS ===================

  const allCategories = useMemo(
    () => [{ id: 0, name: 'Tất cả', slug: 'all' }, ...categories],
    [categories],
  );

  const hasActiveFilter =
    filters.categorySlug !== 'all' || searchInput.trim() || filters.temps.length > 0 || filters.onlyAvailable;

  const resetFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      categorySlug: 'all',
      temps: [],
      onlyAvailable: false,
      sortBy: 'default',
      page: 1,
      pageSize: 12,
    });
  };

  const toggleTemp = (t) => {
    setFilters((prev) => {
      const temps = prev.temps.includes(t)
        ? prev.temps.filter((x) => x !== t)
        : [...prev.temps, t];
      return { ...prev, temps, page: 1 };
    });
  };

  const setCategory = (slug) => {
    setFilters((prev) => ({ ...prev, categorySlug: slug, page: 1 }));
    setMobileFilterOpen(false);
  };

  const setSortBy = (value) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const setOnlyAvailable = (val) => {
    setFilters((prev) => ({ ...prev, onlyAvailable: val, page: 1 }));
  };

  // =================== PAGINATION ===================

  const totalPages = Math.ceil(total / filters.pageSize) || 1;

  const goToPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // =================== SIDEBAR CONTENT ===================

  const categorySkeleton = (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-9 bg-primary/10 rounded animate-pulse" />
      ))}
    </div>
  );

  const filterContent = (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 block">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm tên thức uống..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-primary/10 rounded bg-bg text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 block">
          Danh mục
        </label>
        {categories.length === 0 && loading ? (
          categorySkeleton
        ) : (
          <ul className="flex flex-col gap-1">
            {allCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setCategory(cat.slug)}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded transition-all duration-200 ${
                    filters.categorySlug === cat.slug
                      ? 'text-secondary font-bold border-l-[3px] border-secondary bg-secondary/5 pl-[13px]'
                      : 'text-text hover:pl-6 hover:text-secondary'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Temperature filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 block">
          Nhiệt độ
        </label>
        <div className="flex flex-col gap-2">
          {['Nóng', 'Đá'].map((t) => (
            <label
              key={t}
              className="flex items-center gap-3 cursor-pointer px-4 py-2 rounded hover:bg-bg-dark transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.temps.includes(t)}
                onChange={() => toggleTemp(t)}
                className="w-4 h-4 accent-[#c8a96e] rounded"
              />
              <span className="text-sm">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer px-4 py-2 rounded hover:bg-bg-dark transition-colors">
          <div
            onClick={() => setOnlyAvailable(!filters.onlyAvailable)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
              filters.onlyAvailable ? 'bg-secondary' : 'bg-primary/20'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                filters.onlyAvailable ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="text-sm">Chỉ hiện còn hàng</span>
        </label>
      </div>

      {/* Reset */}
      {hasActiveFilter && (
        <button
          onClick={resetFilters}
          className="w-full py-2.5 text-sm font-medium text-secondary border border-secondary rounded hover:bg-secondary hover:text-primary transition-colors"
        >
          Đặt lại bộ lọc
        </button>
      )}
    </div>
  );

  // =================== RENDER PRODUCT CARD (grid) ===================

  const renderGridCard = (product) => {
    const price = product.minPrice;
    const tag = product.tags?.[0] ?? null;

    return (
      <div key={product.id} className="product-item opacity-100 group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded bg-bg-dark mb-4">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
              !product.isActive ? 'grayscale' : ''
            }`}
          />
          {tag && (
            <span className="absolute top-3 left-3 bg-secondary text-primary text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-sm">
              {tag}
            </span>
          )}
          {!product.isActive && (
            <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
              <span className="bg-primary/80 text-bg text-sm font-bold px-4 py-2 rounded">
                Hết hàng
              </span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
            <button
              onClick={() => setSelectedProduct(product)}
              className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300 bg-bg text-primary text-sm font-medium px-5 py-2 rounded shadow-lg hover:bg-secondary hover:text-primary"
            >
              Xem chi tiết
            </button>
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-heading text-lg font-semibold text-primary mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-text-muted truncate mb-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-secondary font-medium text-sm">
              {price != null ? `Từ ${formatPrice(price)}` : ''}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // =================== RENDER PRODUCT CARD (list) ===================

  const renderListCard = (product) => {
    const price = product.minPrice;
    const tag = product.tags?.[0] ?? null;

    return (
      <div
        key={product.id}
        className="product-item opacity-100 group flex items-center gap-5 p-4 rounded border border-primary/5 hover:border-secondary/30 hover:shadow-sm transition-all"
      >
        {/* Thumbnail */}
        <div className="relative w-[100px] h-[100px] shrink-0 overflow-hidden rounded bg-bg-dark">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover ${!product.isActive ? 'grayscale' : ''}`}
          />
          {!product.isActive && (
            <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
              <span className="text-bg text-[10px] font-bold">Hết hàng</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-heading text-base font-semibold text-primary truncate">
              {product.name}
            </h3>
            {tag && (
              <span className="shrink-0 bg-secondary text-primary text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm">
                {tag}
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted truncate">{product.description}</p>
        </div>

        {/* Price & CTA */}
        <div className="shrink-0 text-right flex flex-col items-end gap-2">
          <span className="text-secondary font-medium text-sm whitespace-nowrap">
            {price != null ? `Từ ${formatPrice(price)}` : ''}
          </span>
          <button
            onClick={() => setSelectedProduct(product)}
            className="text-xs font-medium text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-secondary hover:border-secondary hover:text-primary transition-colors"
          >
            Chi tiết
          </button>
        </div>
      </div>
    );
  };

  // =================== PAGINATION COMPONENT ===================

  const pagination = totalPages > 1 && (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => goToPage(filters.page - 1)}
        disabled={filters.page <= 1}
        className="p-2 rounded border border-primary/10 disabled:opacity-30 hover:border-secondary transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
            p === filters.page
              ? 'bg-secondary text-primary'
              : 'border border-primary/10 hover:border-secondary'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => goToPage(filters.page + 1)}
        disabled={filters.page >= totalPages}
        className="p-2 rounded border border-primary/10 disabled:opacity-30 hover:border-secondary transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );

  return (
    <>
      {/* =================== HERO =================== */}
      <section ref={heroRef} className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&q=80"
          alt="Menu hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="relative z-10 text-center px-6">
          <h1 className="menu-hero-item font-heading text-5xl md:text-6xl font-bold text-bg mb-4">
            THỰC ĐƠN
          </h1>
          <p className="menu-hero-item text-bg/80 text-base md:text-lg mb-6">
            Khám phá hơn {total || '…'} thức uống tinh tế
          </p>
          <nav className="menu-hero-item flex items-center justify-center gap-2 text-sm text-bg/60">
            <Link to="/" className="hover:text-secondary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-secondary">Thực đơn</span>
          </nav>
        </div>
      </section>

      {/* =================== MAIN CONTENT =================== */}
      <section className="py-10 md:py-16 bg-bg">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex gap-10">
            {/* ---- Desktop Sidebar ---- */}
            <aside
              ref={sidebarRef}
              className="hidden lg:block w-[280px] shrink-0 sticky top-28 self-start"
            >
              {filterContent}
            </aside>

            {/* ---- Products Area ---- */}
            <div ref={productsRef} className="flex-1 min-w-0">
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <p className="text-sm text-text-muted">
                  Đang hiển thị{' '}
                  <span className="font-bold text-primary">{products.length}</span>{' '}
                  / {total} sản phẩm
                </p>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-bg border border-primary/10 rounded pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-secondary cursor-pointer"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                  </div>

                  {/* View toggle */}
                  <div className="hidden sm:flex border border-primary/10 rounded overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-primary text-bg'
                          : 'text-text-muted hover:text-primary'
                      }`}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${
                        viewMode === 'list'
                          ? 'bg-primary text-bg'
                          : 'text-text-muted hover:text-primary'
                      }`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded flex items-center justify-between">
                  <p className="text-sm text-red-700">
                    Không thể tải dữ liệu. Vui lòng thử lại.
                  </p>
                  <button
                    onClick={retry}
                    className="flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Thử lại
                  </button>
                </div>
              )}

              {/* Loading skeleton */}
              {loading ? (
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              ) : products.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Coffee size={48} className="text-text-muted/40 mb-6" />
                  <p className="font-heading text-xl text-primary mb-2">
                    Không tìm thấy thức uống phù hợp
                  </p>
                  <p className="text-sm text-text-muted mb-6">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 text-sm font-medium bg-secondary text-primary rounded hover:bg-secondary/90 transition-colors"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                /* ---- GRID VIEW ---- */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(renderGridCard)}
                </div>
              ) : (
                /* ---- LIST VIEW ---- */
                <div className="flex flex-col gap-4">
                  {products.map(renderListCard)}
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination}
            </div>
          </div>
        </div>
      </section>

      {/* =================== MOBILE FILTER BUTTON =================== */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-secondary text-primary rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        <SlidersHorizontal size={20} />
      </button>

      {/* =================== MOBILE FILTER DRAWER =================== */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 bg-primary/30 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        />
      )}
      <div
        ref={mobileDrawerRef}
        className="fixed bottom-0 left-0 right-0 z-[55] lg:hidden bg-bg rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto translate-y-full"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 sticky top-0 bg-bg rounded-t-2xl">
          <h3 className="font-heading text-lg font-bold">Bộ lọc</h3>
          <button onClick={() => setMobileFilterOpen(false)} className="p-1">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{filterContent}</div>
      </div>

      {/* =================== PRODUCT MODAL =================== */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}
