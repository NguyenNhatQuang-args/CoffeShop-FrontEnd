import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import { blogService } from '../services/blogService';
import { handleApiError } from '../utils/handleApiError';
import { getImageUrl } from '../utils/getImageUrl';
import { formatDate, formatReadTime } from '../utils/formatDate';

gsap.registerPlugin(ScrollTrigger);

const PAGE_SIZE = 9;

// ── Skeleton card ───────────────────────────────────────────────────
function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/9] bg-primary/10 rounded mb-4" />
      <div className="h-3 w-24 bg-primary/10 rounded mb-3" />
      <div className="h-5 w-full bg-primary/10 rounded mb-2" />
      <div className="h-5 w-3/4 bg-primary/10 rounded mb-3" />
      <div className="h-3 w-full bg-primary/10 rounded mb-1" />
      <div className="h-3 w-2/3 bg-primary/10 rounded" />
    </div>
  );
}

export default function BlogPublic() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroRef = useRef(null);
  const gridRef = useRef(null);

  // ── Set page title ──
  useEffect(() => {
    document.title = 'Blog | Roxios Coffee';
  }, []);

  // ── Fetch posts ──
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await blogService.getAll({ page, pageSize: PAGE_SIZE });
      const paged = res.data.data ?? res.data;
      const items = (paged.items ?? []).filter((p) => p.isPublished !== false);
      setPosts(items);
      setTotal(paged.totalCount ?? items.length);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  const goToPage = (p) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── GSAP Hero ──
  useGSAP(() => {
    gsap.from('.blog-hero-item', {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2,
    });
  }, { scope: heroRef });

  // ── GSAP cards ──
  useGSAP(() => {
    if (!loading && posts.length > 0) {
      gsap.fromTo('.blog-public-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 90%', once: true } },
      );
    }
  }, { scope: gridRef, dependencies: [loading, posts] });

  // Animate cards on page/filter change
  useEffect(() => {
    if (!loading && posts.length > 0) {
      requestAnimationFrame(() => {
        gsap.fromTo('.blog-public-card',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' },
        );
        ScrollTrigger.refresh();
      });
    }
  }, [posts, loading]);

  return (
    <>
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&q=80"
          alt="Roxios Blog"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/55" />
        <div className="relative z-10 text-center px-6">
          <span className="blog-hero-item block text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-4">
            Góc cà phê
          </span>
          <h1 className="blog-hero-item font-heading text-4xl md:text-6xl font-bold text-white mb-3">
            GÓC CÀ PHÊ
          </h1>
          <p className="blog-hero-item text-white/60 text-sm md:text-base mb-6">
            Kiến thức, câu chuyện và văn hóa cà phê
          </p>
          <nav className="blog-hero-item flex items-center justify-center gap-2 text-sm text-white/50">
            <Link to="/" className="hover:text-secondary transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-secondary">Blog</span>
          </nav>
        </div>
      </section>

      {/* ── Content ── */}
      <section ref={gridRef} className="py-12 md:py-20 bg-bg">
        <div className="container mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <p className="text-sm text-text-muted">
              <span className="font-bold text-primary">{total}</span> bài viết
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded flex items-center justify-between">
              <p className="text-sm text-red-700">Không thể tải dữ liệu. Vui lòng thử lại.</p>
              <button onClick={fetchPosts} className="flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-900">
                <RefreshCw size={14} /> Thử lại
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            /* Empty */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FileText size={48} className="text-text-muted/40 mb-6" />
              <p className="font-heading text-xl text-primary mb-2">Chưa có bài viết nào</p>
              <p className="text-sm text-text-muted mb-6">Hãy quay lại sau nhé!</p>
              <Link to="/" className="px-6 py-2.5 text-sm font-medium bg-secondary text-primary rounded hover:bg-secondary/90 transition-colors">
                Về trang chủ
              </Link>
            </div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="blog-public-card opacity-100 group flex flex-col">
                  <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden rounded bg-bg-dark mb-5">
                    <img
                      src={getImageUrl(post.thumbnail || post.thumbnailUrl)}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3 font-medium uppercase tracking-wider">
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    {post.readTime && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-secondary" />
                        <span>{formatReadTime(post.readTime)}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-heading text-xl font-bold text-primary mb-2 transition-colors group-hover:text-secondary line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-sm text-text-muted leading-relaxed mb-4 flex-grow line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    {post.authorName && (
                      <span className="text-xs text-text-muted">Bởi <span className="font-medium text-primary">{post.authorName}</span></span>
                    )}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-bold text-primary group-hover:text-secondary transition-colors"
                    >
                      Đọc thêm <span className="ml-1">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded border border-primary/10 disabled:opacity-30 hover:border-secondary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-secondary text-primary'
                      : 'border border-primary/10 hover:border-secondary'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded border border-primary/10 disabled:opacity-30 hover:border-secondary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
