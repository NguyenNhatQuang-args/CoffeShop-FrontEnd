import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ABOUT } from '../../constants/aboutData';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const containerRef = useRef(null);
  const statsRef = useRef([]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
      }
    });

    // Left column: images
    tl.from('.about-img-main', {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, 0);

    tl.from('.about-img-sec', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.3);

    // Right column: text & stats
    tl.from('.about-text-item', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    }, 0.2);

    // CountUp Animation for Stats
    ABOUT.stats.forEach((stat, index) => {
      const el = statsRef.current[index];
      if (el) {
        const obj = { val: 0 };
        tl.to(obj, {
          val: stat.number,
          duration: 2,
          ease: 'power1.out',
          onUpdate: () => {
            el.innerText = Math.floor(obj.val) + stat.suffix;
          }
        }, 0.5);
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-bg overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left Column - Images (40%) */}
          <div className="w-full lg:w-[40%] relative">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0">
              <img
                src={ABOUT.image}
                alt="Coffee preparation"
                loading="lazy"
                className="about-img-main w-full h-full object-cover rounded"
              />
              <img
                src={ABOUT.image2}
                alt="Coffee beans"
                loading="lazy"
                className="about-img-sec absolute -bottom-10 -right-6 lg:-right-12 w-2/3 aspect-square object-cover border-4 border-bg rounded shadow-xl"
              />
            </div>
          </div>

          {/* Right Column - Content (60%) */}
          <div className="w-full lg:w-[60%] mt-12 lg:mt-0">
            <span className="about-text-item inline-block text-secondary text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4">
              {ABOUT.tag}
            </span>

            <h2 className="about-text-item font-heading text-4xl md:text-5xl font-bold leading-tight text-primary mb-6">
              {ABOUT.title}
            </h2>

            <p className="about-text-item text-text-muted text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
              {ABOUT.description}
            </p>

            {/* Stats Grid */}
            <div className="about-text-item grid grid-cols-2 gap-8 mb-10">
              {ABOUT.stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span
                    ref={(el) => statsRef.current[index] = el}
                    className="font-heading text-4xl md:text-5xl font-bold text-secondary mb-2"
                  >
                    0{stat.suffix}
                  </span>
                  <span className="text-sm md:text-base font-medium text-primary uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="about-text-item">
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-bg font-medium rounded hover:bg-primary/90 transition-colors"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
