import { useRef, useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Thực đơn', path: '/menu' },
  { name: 'Giới thiệu', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Liên hệ', path: '/lien-he' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  // Handle scroll for sticky header blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    // Initial load animation
    gsap.from('.animate-nav-item', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.1, // Staggered slightly
    });
  }, { scope: headerRef });

  useGSAP(() => {
    // Mobile menu drawer animation
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power2.in',
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-bg/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="animate-nav-item font-heading text-2xl font-bold tracking-wider text-primary"
          >
            Roxios Coffee
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `animate-nav-item text-sm font-medium transition-colors hover:text-secondary ${
                    isActive ? 'text-secondary' : 'text-text'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block animate-nav-item">
            <Link
              to="/order"
              className="group relative inline-flex items-center justify-center overflow-hidden border border-primary px-6 py-2 text-sm font-medium text-primary transition-all duration-300 rounded"
            >
              <span className="absolute inset-0 h-full w-full -translate-x-full bg-secondary transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
                Đặt hàng
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="animate-nav-item md:hidden text-primary p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-y-0 right-0 z-[60] w-64 bg-bg shadow-2xl translate-x-full md:hidden flex flex-col border-l border-primary/10"
      >
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <span className="font-heading text-xl font-bold text-primary">MENU</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-primary p-2 hover:text-secondary transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-6 gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors hover:text-secondary ${
                  isActive ? 'text-secondary' : 'text-text'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/order"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 text-center rounded bg-primary px-6 py-3 text-sm font-medium text-bg hover:bg-primary/90 transition-colors"
          >
            Đặt hàng
          </Link>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 z-[55] md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}