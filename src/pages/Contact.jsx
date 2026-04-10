import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MapPin, Phone, Mail, Clock, ChevronDown, Check, Loader2, ExternalLink,
} from 'lucide-react';
import { CONTACT_INFO, BRANCHES, SUBJECTS } from '../constants/contactData';

gsap.registerPlugin(ScrollTrigger);

// ── Social SVG icons ────────────────────────────────────────────────
const SocialIcon = ({ type, size = 20 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor' };
  switch (type) {
    case 'fb':
      return (
        <svg {...props}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'ig':
      return (
        <svg {...props}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case 'tt':
      return (
        <svg {...props}>
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46 6.28 6.28 0 001.86-4.46V8.73A8.26 8.26 0 0021 10.14V6.69h-1.41z" />
        </svg>
      );
    case 'zl':
      return (
        <svg {...props}>
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.18 1.897-.962 6.502-1.36 8.627-.168.9-.5 1.2-.82 1.23-.697.064-1.226-.46-1.9-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.912.489-1.302.481-.428-.008-1.252-.242-1.865-.44-.751-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141a.506.506 0 01.171.325c.016.093.036.306.02.472z" />
        </svg>
      );
    default:
      return null;
  }
};

// ── Floating label input ────────────────────────────────────────────
function FloatingInput({ label, type = 'text', name, value, onChange, error, required, rows }) {
  const isTextarea = !!rows;
  const hasValue = value && value.length > 0;
  const Tag = isTextarea ? 'textarea' : 'input';

  return (
    <div className="relative">
      <Tag
        type={isTextarea ? undefined : type}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`peer w-full border-0 border-b-2 bg-transparent px-0 pt-6 pb-2 text-sm text-primary outline-none transition-colors
          ${error ? 'border-red-400' : 'border-primary/15 focus:border-secondary'}
          ${isTextarea ? 'resize-none' : ''}`}
      />
      <label
        className={`pointer-events-none absolute left-0 text-sm text-text-muted transition-all duration-200
          ${hasValue ? 'top-0 text-xs text-secondary' : 'top-6 peer-focus:top-0 peer-focus:text-xs peer-focus:text-secondary'}`}
      >
        {label}{required && ' *'}
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// =====================================================================
// HeroContact
// =====================================================================
function HeroContact() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from('.contact-hero-item', {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2,
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1600&q=80"
        alt="Contact Roxios"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/55" />
      <div className="relative z-10 text-center px-6">
        <span className="contact-hero-item block text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-4">
          Liên hệ với chúng tôi
        </span>
        <h1 className="contact-hero-item font-heading text-4xl md:text-6xl font-bold text-white mb-3">
          Roxios Luôn Lắng Nghe
        </h1>
        <p className="contact-hero-item text-white/60 text-sm md:text-base mb-6">
          Ghé thăm hoặc nhắn tin cho chúng tôi bất cứ lúc nào
        </p>
        <nav className="contact-hero-item flex items-center justify-center gap-2 text-sm text-white/50">
          <Link to="/" className="hover:text-secondary transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-secondary">Liên hệ</span>
        </nav>
      </div>
    </section>
  );
}

// =====================================================================
// ContactMain — Form + Info
// =====================================================================
function ContactMain() {
  const ref = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', content: '', agree: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useGSAP(() => {
    gsap.from('.contact-form-col', {
      x: -50, opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    });
    gsap.from('.contact-info-col', {
      x: 50, opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    });
  }, { scope: ref });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = 'Tên tối thiểu 2 ký tự';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email không hợp lệ';
    if (!form.content || form.content.trim().length < 10) errs.content = 'Nội dung tối thiểu 10 ký tự';
    if (!form.agree) errs.agree = 'Vui lòng đồng ý để tiếp tục';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSuccess(true); }, 1500);
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', subject: '', content: '', agree: false });
    setErrors({});
    setSuccess(false);
  };

  return (
    <section ref={ref} className="py-16 md:py-24 bg-bg">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-0 max-w-6xl mx-auto overflow-hidden rounded-lg shadow-lg">
          {/* ── Form column ── */}
          <div className="contact-form-col lg:w-[55%] p-8 md:p-12 bg-white">
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                  Cảm ơn bạn đã liên hệ!
                </h3>
                <p className="text-text-muted text-sm mb-8 max-w-sm">
                  Chúng tôi sẽ phản hồi sớm nhất có thể. Roxios trân trọng mọi ý kiến từ bạn.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 text-sm font-medium border border-primary/20 rounded hover:bg-primary hover:text-bg transition-colors"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-1">
                  Gửi Tin Nhắn
                </h2>
                <p className="text-sm text-text-muted mb-10">
                  Chúng tôi sẽ phản hồi trong vòng 24 giờ
                </p>

                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <FloatingInput label="Họ và tên" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
                    <FloatingInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <FloatingInput label="Số điện thoại" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                    <div className="relative">
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="peer w-full border-0 border-b-2 border-primary/15 bg-transparent px-0 pt-6 pb-2 text-sm text-primary outline-none focus:border-secondary transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Chọn chủ đề</option>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <label className={`pointer-events-none absolute left-0 text-sm transition-all duration-200 ${form.subject ? 'top-0 text-xs text-secondary' : 'top-0 text-xs text-text-muted'}`}>
                        Chủ đề
                      </label>
                      <ChevronDown size={14} className="absolute right-0 top-7 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <FloatingInput label="Nội dung" name="content" value={form.content} onChange={handleChange} error={errors.content} required rows={5} />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={form.agree}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 accent-secondary rounded"
                    />
                    <span className={`text-sm ${errors.agree ? 'text-red-500' : 'text-text-muted'}`}>
                      Tôi đồng ý để Roxios liên hệ lại qua email
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-primary text-bg text-sm font-medium rounded hover:bg-secondary hover:text-primary transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ── Info column ── */}
          <div className="contact-info-col lg:w-[45%] bg-primary text-white p-8 md:p-12 flex flex-col">
            <span className="font-heading text-xl font-bold text-secondary mb-8">{CONTACT_INFO.brand}</span>

            <div className="space-y-6 flex-1">
              {[
                { icon: MapPin, label: 'Địa chỉ chính', value: CONTACT_INFO.address },
                { icon: Phone, label: 'Hotline (miễn phí)', value: CONTACT_INFO.hotline },
                { icon: Mail, label: 'Email', value: CONTACT_INFO.email },
                { icon: Clock, label: 'Giờ mở cửa', value: `${CONTACT_INFO.openTime} (${CONTACT_INFO.openDays.toLowerCase()})` },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={18} className="text-secondary" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/40 block mb-1">{item.label}</span>
                      <span className="text-sm text-white/90">{item.value}</span>
                    </div>
                  </div>
                  {i < 3 && <div className="h-px bg-white/10 mt-6" />}
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block mb-4">
                Kết nối với chúng tôi
              </span>
              <div className="flex gap-3">
                {CONTACT_INFO.socials.map((s) => (
                  <a
                    key={s.icon}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-secondary hover:text-primary transition-colors"
                    aria-label={s.name}
                  >
                    <SocialIcon type={s.icon} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// BranchesSection
// =====================================================================
function BranchesSection() {
  const ref = useRef(null);
  const [activeBranch, setActiveBranch] = useState(BRANCHES.find((b) => b.isMain) || BRANCHES[0]);
  const [mapFading, setMapFading] = useState(false);
  // Mobile accordion: which branch id is open
  const [mobileOpen, setMobileOpen] = useState(activeBranch.id);

  useGSAP(() => {
    gsap.from('.branch-item', {
      y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    });
    gsap.from('.branch-map', {
      opacity: 0, duration: 0.6, delay: 0.3, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    });
  }, { scope: ref });

  const selectBranch = (branch) => {
    if (branch.id === activeBranch.id) return;
    setMapFading(true);
    setTimeout(() => {
      setActiveBranch(branch);
      setMapFading(false);
    }, 300);
  };

  const toggleMobile = (branch) => {
    setMobileOpen((prev) => (prev === branch.id ? null : branch.id));
    setActiveBranch(branch);
  };

  return (
    <section ref={ref} className="py-16 md:py-24 bg-bg-dark">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary mb-3 block">
            Hệ thống chi nhánh
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
            Tìm Roxios Gần Bạn
          </h2>
          <p className="text-sm text-text-muted">{BRANCHES.length} chi nhánh tại TP. Hồ Chí Minh</p>
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden md:flex gap-8 max-w-6xl mx-auto">
          {/* Branch list */}
          <div className="w-[40%] space-y-2">
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                onClick={() => selectBranch(b)}
                className={`branch-item w-full text-left p-5 rounded-lg transition-all duration-200 border-l-[3px] ${
                  activeBranch.id === b.id
                    ? 'border-secondary bg-white shadow-sm'
                    : 'border-transparent hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-heading text-base font-bold ${activeBranch.id === b.id ? 'text-primary' : 'text-text'}`}>
                    {b.name}
                  </span>
                  {b.isMain && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-secondary/20 text-secondary rounded">
                      Cơ sở chính
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted flex items-center gap-1.5">
                  <MapPin size={11} className="shrink-0" />{b.address}
                </p>
                <div className="flex gap-4 mt-1.5 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Phone size={10} />{b.phone}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{b.openTime}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div className="w-[60%]">
            <div className={`branch-map rounded-lg overflow-hidden transition-opacity duration-300 ${mapFading ? 'opacity-0' : 'opacity-100'}`}>
              <iframe
                key={activeBranch.id}
                src={activeBranch.mapUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={activeBranch.name}
              />
            </div>
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(activeBranch.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              <ExternalLink size={14} />
              Chỉ đường đến {activeBranch.name}
            </a>
          </div>
        </div>

        {/* ── Mobile accordion ── */}
        <div className="md:hidden space-y-3">
          {BRANCHES.map((b) => (
            <div key={b.id} className="branch-item rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleMobile(b)}
                className={`w-full text-left p-4 flex items-center justify-between border-l-[3px] ${
                  mobileOpen === b.id ? 'border-secondary' : 'border-transparent'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-heading text-sm font-bold text-primary">{b.name}</span>
                    {b.isMain && (
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-secondary/20 text-secondary rounded">
                        Chính
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">{b.address}</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-text-muted transition-transform ${mobileOpen === b.id ? 'rotate-180' : ''}`}
                />
              </button>

              {mobileOpen === b.id && (
                <div className="px-4 pb-4">
                  <div className="flex gap-4 text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1"><Phone size={10} />{b.phone}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{b.openTime}</span>
                  </div>
                  <div className="rounded overflow-hidden">
                    <iframe
                      src={b.mapUrl}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={b.name}
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(b.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-secondary"
                  >
                    <ExternalLink size={12} />
                    Chỉ đường
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// SocialsSection
// =====================================================================
function SocialsSection() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from('.social-card', {
      scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-bg-dark">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary mb-3 block">
          Follow us
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
          Theo Dõi Roxios
        </h2>
        <p className="text-sm text-text-muted mb-12 max-w-md mx-auto">
          Cập nhật menu mới, khuyến mãi và câu chuyện cà phê mỗi ngày
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {CONTACT_INFO.socials.map((s) => (
            <a
              key={s.icon}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card group p-6 rounded-lg bg-white border border-transparent hover:border-secondary hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/5 group-hover:bg-secondary/10 flex items-center justify-center text-primary/60 group-hover:text-secondary transition-colors">
                <SocialIcon type={s.icon} size={22} />
              </div>
              <p className="font-heading text-sm font-bold text-primary mb-0.5">{s.name}</p>
              <p className="text-xs text-text-muted">{s.handle}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Contact Page
// =====================================================================
export default function Contact() {
  useEffect(() => {
    document.title = 'Liên Hệ | Roxios Coffee';
  }, []);

  return (
    <>
      <HeroContact />
      <ContactMain />
      <BranchesSection />
      <SocialsSection />

      {/* Floating call button — mobile only */}
      <a
        href="tel:18001234"
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-secondary text-primary rounded-full shadow-xl flex items-center justify-center animate-pulse"
        aria-label="Gọi ngay"
      >
        <Phone size={22} />
      </a>
    </>
  );
}
