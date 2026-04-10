import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Leaf, Search, Heart, Users } from 'lucide-react';
import {
  BRAND,
  COFFEE_JOURNEY,
  COFFEE_TYPES,
  STATS,
  VALUES,
} from '../constants/aboutPageData';

gsap.registerPlugin(ScrollTrigger);

const VALUE_ICONS = { leaf: Leaf, search: Search, heart: Heart, users: Users };

// =====================================================================
// HeroAbout
// =====================================================================
function HeroAbout() {
  const ref = useRef(null);
  const imgRef = useRef(null);

  useGSAP(() => {
    gsap.from('.about-hero-item', {
      y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.3,
    });
    gsap.to(imgRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] flex items-end justify-center overflow-hidden">
      <img
        ref={imgRef}
        src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&q=80"
        alt="Roxios Coffee"
        className="absolute inset-0 w-full h-full object-cover scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative z-10 text-center px-6 pb-[15vh]">
        <span className="about-hero-item block text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-4">
          THE STORY OF ROXIOS
        </span>
        <h1 className="about-hero-item font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
          Từ Hạt Đến Ly
        </h1>
        <p className="about-hero-item text-white/60 text-base md:text-lg max-w-lg mx-auto mb-10">
          Hành trình 5 công đoạn tạo nên ly cà phê hoàn hảo
        </p>
        <div className="about-hero-item animate-bounce">
          <ChevronDown size={28} className="text-white/50 mx-auto" />
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// BrandIntro
// =====================================================================
function BrandIntro() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from('.brand-left', {
      x: -60, opacity: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    });
    gsap.from('.brand-right', {
      x: 60, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15,
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-bg">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Left — Quote */}
          <div className="brand-left lg:w-1/2">
            <blockquote className="font-heading text-3xl md:text-4xl lg:text-[2.6rem] italic text-secondary leading-snug mb-8">
              "{BRAND.tagline}"
            </blockquote>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <div>
                <span className="block text-xs uppercase tracking-wider mb-1">Thương hiệu</span>
                <span className="font-heading text-lg text-primary font-bold">{BRAND.name}</span>
              </div>
              <div className="w-px h-10 bg-primary/10" />
              <div>
                <span className="block text-xs uppercase tracking-wider mb-1">Thành lập</span>
                <span className="font-heading text-lg text-primary font-bold">{BRAND.founded}</span>
              </div>
              <div className="w-px h-10 bg-primary/10" />
              <div>
                <span className="block text-xs uppercase tracking-wider mb-1">Xuất xứ</span>
                <span className="font-heading text-lg text-primary font-bold">{BRAND.origin}</span>
              </div>
            </div>
          </div>

          {/* Right — Description + Values */}
          <div className="brand-right lg:w-1/2">
            <p className="text-text-muted leading-relaxed text-base mb-8">
              {BRAND.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {VALUES.map((v) => {
                const Icon = VALUE_ICONS[v.icon] || Leaf;
                return (
                  <div key={v.title} className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Icon size={18} className="text-secondary" />
                    </div>
                    <span className="text-xs font-bold text-primary">{v.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// CoffeeJourney
// =====================================================================
function CoffeeJourney() {
  const ref = useRef(null);
  const lineRef = useRef(null);

  useGSAP(() => {
    // Timeline line grows
    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        },
      );
    }

    // Each step
    COFFEE_JOURNEY.forEach((item, i) => {
      const stepEl = `.journey-step-${i}`;
      const imgDirection = item.side === 'right' ? 80 : -80;

      gsap.from(`${stepEl} .journey-img`, {
        x: imgDirection, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: stepEl, start: 'top 80%', once: true },
      });
      gsap.from(`${stepEl} .journey-text`, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.1,
        scrollTrigger: { trigger: stepEl, start: 'top 80%', once: true },
      });
      gsap.from(`${stepEl} .journey-number`, {
        opacity: 0, duration: 1, delay: 0.3,
        scrollTrigger: { trigger: stepEl, start: 'top 80%', once: true },
      });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative">
      {/* Vertical timeline line — desktop only */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px">
        <div ref={lineRef} className="w-full h-full bg-secondary/30 origin-top" />
      </div>

      {COFFEE_JOURNEY.map((item, i) => {
        const isImgRight = item.side === 'right';

        return (
          <div
            key={item.step}
            className={`journey-step-${i} relative ${i % 2 === 0 ? 'bg-bg' : 'bg-bg-dark'}`}
          >
            <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
              {/* Timeline dot — desktop */}
              <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-secondary border-4 border-bg" />
              </div>

              <div className={`flex flex-col ${isImgRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center`}>
                {/* Text side */}
                <div className="journey-text lg:w-1/2 ">
                  <span
                    className="journey-number hidden md:block font-heading font-black select-none pointer-events-none"
                    style={{ fontSize: 'clamp(70px, 10vw, 130px)', color: '#1a1a1a', opacity: 0.8, lineHeight: 1.3, marginBottom: '-10px'  }}
                  >
                    {item.step}
                  </span>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-secondary bg-secondary/10 px-3 py-1 rounded-sm mb-3">
                    {item.highlight}
                  </span>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 rounded-full bg-primary text-bg text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-sm italic text-text-muted mb-4">{item.subtitle}</p>
                  <p className="text-text-muted leading-relaxed">{item.description}</p>
                </div>

                {/* Image side */}
                <div className="journey-img lg:w-1/2">
                  <div className="overflow-hidden rounded-sm">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

// =====================================================================
// CoffeeTypes
// =====================================================================
function CoffeeTypesSection() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from('.coffee-type-card', {
      y: 40, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-primary">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary mb-3 block">
            Our Coffee
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
            Dòng Cà Phê Của Chúng Tôi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {COFFEE_TYPES.map((coffee) => (
            <div
              key={coffee.name}
              className="coffee-type-card group text-center p-8 rounded-lg hover:bg-[#2a2a2a] transition-colors duration-300"
            >
              <div className="w-[180px] h-[180px] mx-auto mb-6 rounded-full overflow-hidden border-2 border-secondary/60 group-hover:border-secondary transition-colors">
                <img
                  src={coffee.image}
                  alt={coffee.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-4">{coffee.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Vùng trồng</span>
                  <span className="text-white/80">{coffee.origin}</span>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div className="flex justify-between text-white/50">
                  <span>Hương vị</span>
                  <span className="text-white/80">{coffee.flavor}</span>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div className="flex justify-between text-white/50">
                  <span>Caffeine</span>
                  <span className="text-white/80">{coffee.caffeine}</span>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div className="flex justify-between text-white/50">
                  <span>Độ cao</span>
                  <span className="text-white/80">{coffee.altitude}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// StatsSection
// =====================================================================
function StatsSection() {
  const ref = useRef(null);
  const countersRef = useRef([]);

  useGSAP(() => {
    STATS.forEach((stat, i) => {
      const el = countersRef.current[i];
      if (!el) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.number,
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        onUpdate: () => {
          el.textContent = Math.round(obj.val);
        },
      });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-secondary">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center relative">
              {/* Separator — desktop only, not on first item */}
              {i > 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-primary/15" />
              )}
              <div className="flex items-baseline justify-center gap-0.5">
                <span
                  ref={(el) => { countersRef.current[i] = el; }}
                  className="font-heading text-5xl md:text-6xl font-bold text-primary"
                >
                  0
                </span>
                <span className="font-heading text-2xl md:text-3xl font-bold text-primary">
                  {stat.suffix}
                </span>
              </div>
              <span className="text-sm text-primary/70 mt-2 block">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// ValuesSection
// =====================================================================
function ValuesSection() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from('.value-card', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-bg">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary mb-3 block">
            Our Values
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
            Giá Trị Cốt Lõi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VALUES.map((v) => {
            const Icon = VALUE_ICONS[v.icon] || Leaf;
            return (
              <div
                key={v.title}
                className="value-card group p-6 rounded-lg border border-primary/5 hover:border-transparent hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Bottom border hover animation */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-500" />

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-primary mb-1">{v.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// CTAAbout
// =====================================================================
function CTAAbout() {
  const ref = useRef(null);
  const imgRef = useRef(null);

  useGSAP(() => {
    gsap.to(imgRef.current, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
    });
    gsap.from('.cta-about-item', {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
      <img
        ref={imgRef}
        src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1600&q=80"
        alt="Roxios CTA"
        className="absolute inset-0 w-full h-full object-cover scale-110"
      />
      <div className="absolute inset-0 bg-primary/65" />

      <div className="relative z-10 text-center px-6">
        <h2 className="cta-about-item font-heading text-3xl md:text-5xl font-bold text-white mb-6">
          Đến Roxios, Thưởng Thức Hành Trình
        </h2>
        <div className="cta-about-item flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/menu"
            className="px-8 py-3 bg-secondary text-primary font-medium rounded hover:bg-secondary/90 transition-colors"
          >
            Xem thực đơn
          </Link>
          <Link
            to="/lien-he"
            className="px-8 py-3 border border-white/40 text-white font-medium rounded hover:bg-white/10 transition-colors"
          >
            Tìm chi nhánh
          </Link>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// About Page
// =====================================================================
export default function About() {
  useEffect(() => {
    document.title = 'Về Chúng Tôi | Roxios Coffee';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Khám phá hành trình từ hạt cà phê đến ly cà phê của Roxios — từ nông trại hữu cơ Đà Lạt đến tay bạn.');
    }
  }, []);

  return (
    <>
      <HeroAbout />
      <BrandIntro />
      <CoffeeJourney />
      <CoffeeTypesSection />
      <StatsSection />
      <ValuesSection />
      <CTAAbout />
    </>
  );
}
