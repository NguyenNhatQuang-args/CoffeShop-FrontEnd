import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, SlidersHorizontal, X, Grid3X3, List, ChevronDown, Coffee } from 'lucide-react';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../constants/menuData';
import ProductModal from '../components/menu/ProductModal';

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

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [tempFilter, setTempFilter] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const heroRef = useRef(null);
  const sidebarRef = useRef(null);
  const productsRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  // Sync category from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Hero animation
  useGSAP(() => {
    gsap.from('.menu-hero-item', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.2,
    });
  }, { scope: heroRef });

  // Sidebar animation
  useGSAP(() => {
    gsap.from(sidebarRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.3,
    });
  }, { scope: sidebarRef });

  // Product cards animation on mount
  useGSAP(() => {
    gsap.from('.product-item', {
      scrollTrigger: {
        trigger: productsRef.current,
        start: 'top 85%',
        once: true,
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
    });
  }, { scope: productsRef });

  // Mobile drawer animation
  useGSAP(() => {
    if (!mobileDrawerRef.current) return;
    if (mobileFilterOpen) {
      gsap.to(mobileDrawerRef.current, { y: 0, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to(mobileDrawerRef.current, { y: '100%', duration: 0.3, ease: 'power2.in' });
    }
  }, [mobileFilterOpen]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    let result = [...MENU_PRODUCTS];

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const kw = search.toLowerCase().trim();
      result = result.filter((p) => p.name.toLowerCase().includes(kw));
    }
    if (tempFilter.length > 0) {
      result = result.filter((p) => tempFilter.some((t) => p.temps.includes(t)));
    }
    if (onlyAvailable) {
      result = result.filter((p) => p.isAvailable);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.sizes[0].price - b.sizes[0].price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.sizes[0].price - a.sizes[0].price);
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
    }

    return result;
  }, [activeCategory, search, tempFilter, onlyAvailable, sortBy]);

  const hasActiveFilter =
    activeCategory !== 'all' || search.trim() || tempFilter.length > 0 || onlyAvailable;

  const resetFilters = () => {
    setSearch('');
    setActiveCategory('all');
    setTempFilter([]);
    setOnlyAvailable(false);
    setSortBy('default');
  };

  const toggleTemp = (t) => {
    setTempFilter((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const animateCardsIn = useCallback(() => {
    requestAnimationFrame(() => {
      gsap.fromTo(
        '.product-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
      );
    });
  }, []);

  // Re-animate cards when filters change
  useEffect(() => {
    animateCardsIn();
  }, [filteredProducts, viewMode, animateCardsIn]);

  // Sidebar content (shared between desktop & mobile)
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-primary/10 rounded bg-bg text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 block">
          Danh mục
        </label>
        <ul className="flex flex-col gap-1">
          {MENU_CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setMobileFilterOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded transition-all duration-200 ${
                  activeCategory === cat.slug
                    ? 'text-secondary font-bold border-l-[3px] border-secondary bg-secondary/5 pl-[13px]'
                    : 'text-text hover:pl-6 hover:text-secondary'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
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
                checked={tempFilter.includes(t)}
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
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
              onlyAvailable ? 'bg-secondary' : 'bg-primary/20'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                onlyAvailable ? 'translate-x-5' : 'translate-x-0.5'
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
            Khám phá hơn 18 thức uống tinh tế
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
                  <span className="font-bold text-primary">{filteredProducts.length}</span> sản phẩm
                </p>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
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

              {/* Products */}
              {filteredProducts.length === 0 ? (
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
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="product-item group">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden rounded bg-bg-dark mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
                            !product.isAvailable ? 'grayscale' : ''
                          }`}
                        />
                        {product.tag && (
                          <span className="absolute top-3 left-3 bg-secondary text-primary text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-sm">
                            {product.tag}
                          </span>
                        )}
                        {!product.isAvailable && (
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
                            Từ {formatPrice(product.sizes[0].price)}
                          </span>
                          <div className="flex gap-1.5">
                            {product.temps.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-primary/10 text-text-muted"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ---- LIST VIEW ---- */
                <div className="flex flex-col gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-item group flex items-center gap-5 p-4 rounded border border-primary/5 hover:border-secondary/30 hover:shadow-sm transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-[100px] h-[100px] shrink-0 overflow-hidden rounded bg-bg-dark">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className={`w-full h-full object-cover ${
                            !product.isAvailable ? 'grayscale' : ''
                          }`}
                        />
                        {!product.isAvailable && (
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
                          {product.tag && (
                            <span className="shrink-0 bg-secondary text-primary text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm">
                              {product.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-muted truncate">{product.description}</p>
                        <div className="flex gap-1.5 mt-1.5">
                          {product.temps.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-primary/10 text-text-muted"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="shrink-0 text-right flex flex-col items-end gap-2">
                        <span className="text-secondary font-medium text-sm whitespace-nowrap">
                          Từ {formatPrice(product.sizes[0].price)}
                        </span>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-xs font-medium text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-secondary hover:border-secondary hover:text-primary transition-colors"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
