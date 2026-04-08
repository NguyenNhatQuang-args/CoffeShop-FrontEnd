import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    id: 1,
    title: "Chọn Lọc Hạt",
    desc: "Hạt Arabica và Robusta từ cao nguyên Đà Lạt, được chọn lọc thủ công từng mẻ.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80",
    icon: "🌱"
  },
  {
    id: 2,
    title: "Rang Xay Tươi",
    desc: "Rang tươi mỗi ngày theo công thức riêng, giữ trọn hương thơm tự nhiên.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
    icon: "🔥"
  },
  {
    id: 3,
    title: "Pha Chế Tỉ Mỉ",
    desc: "Barista được đào tạo bài bản, pha từng ly với sự tận tâm và chính xác.",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80",
    icon: "☕"
  }
];

export default function CoffeeProcess() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
      }
    });

    // Connecting line animation
    tl.to('.process-line', {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 0);

    // Steps animation
    tl.from('.process-step', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: 'power2.out'
    }, 0.2);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-primary text-bg overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="process-step font-heading text-3xl md:text-4xl font-bold mb-6">
            Nghệ Thuật Cà Phê
          </h2>
          <div className="process-step w-16 h-1 bg-secondary mx-auto"></div>
        </div>

        <div className="relative">
          {/* Horizontal Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-[100px] left-[16.66%] right-[16.66%] h-[1px] bg-text-muted/30 origin-left">
            <div className="process-line w-full h-full bg-secondary origin-left scale-x-0"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {PROCESS_STEPS.map((step) => (
              <div key={step.id} className="process-step relative flex flex-col items-center text-center">
                
                {/* Image & Number */}
                <div className="relative mb-8">
                  {/* Large background number */}
                  <span className="absolute -top-10 -left-6 text-[8rem] font-heading font-bold text-bg/5 select-none leading-none">
                    {step.id}
                  </span>
                  
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-bg/10 z-10">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      loading="lazy" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/20"></div>
                  </div>
                  
                  {/* Icon Badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-2xl z-20 shadow-lg border-4 border-primary">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-heading text-2xl font-bold text-secondary mb-4">
                  {step.title}
                </h3>
                <p className="text-text-muted text-base max-w-sm leading-relaxed">
                  {step.desc}
                </p>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}