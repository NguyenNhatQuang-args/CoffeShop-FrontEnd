import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.footer-col', {
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="bg-primary text-bg pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div className="footer-col flex flex-col items-start">
            <h3 className="font-heading text-2xl font-bold mb-6 text-bg">Roxios Coffee</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-6 max-w-sm">
              Trải nghiệm cà phê nguyên bản trong không gian tối giản, thanh lịch. 
              Mang đến cho bạn những khoảnh khắc thư giãn tuyệt vời nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="font-heading text-lg font-bold mb-6 text-secondary">Thực đơn nhanh</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/menu" className="text-sm text-text-muted hover:text-secondary transition-colors">Cà phê truyền thống</Link>
              </li>
              <li>
                <Link to="/menu" className="text-sm text-text-muted hover:text-secondary transition-colors">Cà phê pha máy</Link>
              </li>
              <li>
                <Link to="/menu" className="text-sm text-text-muted hover:text-secondary transition-colors">Trà & Trái cây</Link>
              </li>
              <li>
                <Link to="/menu" className="text-sm text-text-muted hover:text-secondary transition-colors">Bánh ngọt</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="footer-col">
            <h4 className="font-heading text-lg font-bold mb-6 text-secondary">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="text-sm text-text-muted">
                123 Đường Cà Phê, Quận 1, TP. HCM
              </li>
              <li className="text-sm text-text-muted">
                Hotline: 1900 1234
              </li>
              <li className="text-sm text-text-muted">
                Email: hello@coffeeshop.com
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-8 h-8 rounded-full border border-text-muted flex items-center justify-center text-text-muted hover:text-secondary hover:border-secondary transition-colors">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-text-muted flex items-center justify-center text-text-muted hover:text-secondary hover:border-secondary transition-colors">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-col border-t border-text-muted/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-text-muted mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Coffee Shop. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-text-muted">
            <Link to="/privacy" className="hover:text-secondary transition-colors">Chính sách bảo mật</Link>
            <Link to="/terms" className="hover:text-secondary transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}