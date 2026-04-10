import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { blogService } from '../../services/blogService';
import { getImageUrl } from '../../utils/getImageUrl';
import { formatDate, formatReadTime } from '../../utils/formatDate';
import { BLOG_POSTS } from '../../constants/blogData';

gsap.registerPlugin(ScrollTrigger);

export default function LatestBlog() {
  const containerRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch 3 latest published posts, fallback to hardcoded data
  useEffect(() => {
    blogService.getAll({ page: 1, pageSize: 3 })
      .then((res) => {
        const paged = res.data.data ?? res.data;
        const items = (paged.items ?? []).filter((p) => p.isPublished !== false);
        setPosts(items.length > 0 ? items : BLOG_POSTS);
      })
      .catch(() => {
        setPosts(BLOG_POSTS);
      })
      .finally(() => setLoading(false));
  }, []);

  useGSAP(() => {
    if (!loading && posts.length > 0) {
      gsap.from('.blog-card', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      });
    }
  }, { scope: containerRef, dependencies: [loading, posts] });

  // Normalize post shape (API vs hardcoded)
  const normalizePost = (post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    thumbnail: getImageUrl(post.thumbnail || post.thumbnailUrl),
    date: formatDate(post.publishedAt || post.createdAt) || post.date || '',
    readTime: post.readTime ? formatReadTime(post.readTime) : (post.readTime || ''),
  });

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-bg">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="inline-block text-secondary text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4">
              GÓC CÀ PHÊ
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
              Kiến Thức & Câu Chuyện
            </h2>
          </div>
          <Link
            to="/blog"
            className="text-primary font-medium border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors"
          >
            Xem tất cả bài viết →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-primary/10 rounded mb-6" />
                <div className="h-3 w-24 bg-primary/10 rounded mb-4" />
                <div className="h-5 w-3/4 bg-primary/10 rounded mb-3" />
                <div className="h-4 w-full bg-primary/10 rounded mb-2" />
                <div className="h-4 w-2/3 bg-primary/10 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((raw) => {
              const post = normalizePost(raw);
              return (
                <article key={post.id} className="blog-card group flex flex-col">
                  <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden rounded mb-6">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-text-muted mb-4 font-medium uppercase tracking-wider">
                    <span>{post.date}</span>
                    {post.readTime && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-secondary" />
                        <span>{post.readTime}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3 transition-colors group-hover:text-secondary">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-text-muted text-base leading-relaxed mb-6 flex-grow line-clamp-2">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-bold text-primary group-hover:text-secondary transition-colors w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-300 group-hover:after:w-full"
                  >
                    Đọc thêm <span className="ml-2">→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
