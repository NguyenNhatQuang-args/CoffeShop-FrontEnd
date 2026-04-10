import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, Calendar, Clock, User, Share2, Copy, Check } from 'lucide-react';
import { blogService } from '../services/blogService';
import { handleApiError } from '../utils/handleApiError';
import { getImageUrl } from '../utils/getImageUrl';
import { formatDate, formatReadTime } from '../utils/formatDate';

// ── Skeleton ────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="animate-pulse max-w-[1100px] mx-auto px-6 py-12">
      <div className="h-4 w-24 bg-primary/10 rounded mb-8" />
      <div className="aspect-[16/9] bg-primary/10 rounded-lg mb-8" />
      <div className="max-w-[800px]">
        <div className="h-3 w-20 bg-primary/10 rounded mb-4" />
        <div className="h-8 w-3/4 bg-primary/10 rounded mb-3" />
        <div className="h-8 w-1/2 bg-primary/10 rounded mb-6" />
        <div className="flex gap-4 mb-8">
          <div className="h-3 w-28 bg-primary/10 rounded" />
          <div className="h-3 w-20 bg-primary/10 rounded" />
          <div className="h-3 w-24 bg-primary/10 rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-primary/10 rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const contentRef = useRef(null);
  const heroImgRef = useRef(null);

  // ── Fetch post ──
  useEffect(() => {
    setLoading(true);
    setError(null);
    setPost(null);

    blogService.getBySlug(slug)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setPost(data);
        document.title = `${data.title} | Roxios Coffee`;
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 404) {
          setError('not_found');
        } else {
          setError(handleApiError(err));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Fetch related posts ──
  useEffect(() => {
    blogService.getAll({ page: 1, pageSize: 4 })
      .then((res) => {
        const paged = res.data.data ?? res.data;
        const items = (paged.items ?? [])
          .filter((p) => p.slug !== slug && p.isPublished !== false)
          .slice(0, 3);
        setRelated(items);
      })
      .catch(() => {});
  }, [slug]);

  // ── GSAP ──
  useGSAP(() => {
    if (post && heroImgRef.current) {
      gsap.from(heroImgRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' });
    }
  }, { dependencies: [post] });

  useGSAP(() => {
    if (post && contentRef.current) {
      gsap.from(contentRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.15 });
    }
  }, { dependencies: [post] });

  // ── Copy link ──
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // ── Share FB ──
  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank', 'width=600,height=400',
    );
  };

  // ── Render content paragraphs ──
  const renderContent = (content) => {
    if (!content) return null;
    return content.split('\n').filter(Boolean).map((para, i) => (
      <p key={i} className="mb-4 last:mb-0">{para}</p>
    ));
  };

  // ── States ──
  if (loading) return <DetailSkeleton />;

  if (error === 'not_found') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-bg">
        <p className="font-heading text-4xl font-bold text-primary mb-4">404</p>
        <p className="text-text-muted mb-8">Bài viết không tồn tại hoặc đã bị xoá</p>
        <Link to="/blog" className="px-6 py-2.5 text-sm font-medium bg-primary text-bg rounded hover:bg-secondary hover:text-primary transition-colors">
          Quay lại Blog
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-bg">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate(0)} className="px-6 py-2.5 text-sm font-medium border border-primary/20 rounded hover:bg-primary hover:text-bg transition-colors">
          Thử lại
        </button>
      </div>
    );
  }

  if (!post) return null;

  const thumbnail = getImageUrl(post.thumbnail || post.thumbnailUrl);

  return (
    <div className="bg-bg">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-8 md:py-12">
        {/* Back */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại Blog
        </button>

        {/* Hero image */}
        {thumbnail && thumbnail !== '/placeholder-coffee.jpg' && (
          <div ref={heroImgRef} className="relative aspect-[16/9] overflow-hidden rounded-lg mb-8">
            <img src={thumbnail} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Main content ── */}
          <article ref={contentRef} className="flex-1 min-w-0 max-w-[800px]">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-secondary bg-secondary/10 px-3 py-1 rounded-sm mb-4">
              Bài viết
            </span>

            <h1 className="font-heading font-bold text-primary mb-5" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.2 }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-secondary" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-secondary" />
                  {formatReadTime(post.readTime)}
                </span>
              )}
              {post.authorName && (
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-secondary" />
                  {post.authorName}
                </span>
              )}
            </div>

            <div className="h-px bg-primary/10 mb-8" />

            {/* Content */}
            <div className="prose-custom text-text leading-[1.8]" style={{ fontSize: '1.05rem' }}>
              {renderContent(post.content)}
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-28 space-y-8">
              {/* Share */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
                  Chia sẻ bài viết
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={shareFacebook}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-primary/10 rounded hover:border-secondary hover:text-secondary transition-colors"
                  >
                    <Share2 size={14} /> Facebook
                  </button>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-primary/10 rounded hover:border-secondary hover:text-secondary transition-colors"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    {copied ? 'Đã sao chép' : 'Sao chép link'}
                  </button>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
                    Bài viết liên quan
                  </h4>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        to={`/blog/${r.slug}`}
                        className="group flex gap-3"
                      >
                        <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-bg-dark">
                          <img
                            src={getImageUrl(r.thumbnail || r.thumbnailUrl)}
                            alt={r.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-primary line-clamp-2 group-hover:text-secondary transition-colors">
                            {r.title}
                          </p>
                          <span className="text-xs text-text-muted">
                            {formatDate(r.publishedAt || r.createdAt)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
