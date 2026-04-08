import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BLOG_POSTS } from '../../constants/blogData';

gsap.registerPlugin(ScrollTrigger);

export default function LatestBlog() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.blog-card', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }, { scope: containerRef });

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
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
                <span className="w-1 h-1 rounded-full bg-secondary"></span>
                <span>{post.readTime}</span>
              </div>
              
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3 transition-colors group-hover:text-secondary">
                <Link to={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-text-muted text-base leading-relaxed mb-6 flex-grow">
                {post.excerpt}
              </p>
              
              <Link 
                to={`/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-bold text-primary group-hover:text-secondary transition-colors w-fit relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-300 group-hover:after:w-full"
              >
                Đọc thêm <span className="ml-2">→</span>
              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}