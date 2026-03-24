import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowRight, Play, ChevronDown, Send,
  Users, Award, Globe, BookOpen, Wrench, Gift,
  Headphones, Check, Clock, BarChart3,
} from 'lucide-react'
import { courseService } from '../../services/courseService'
import type { Course } from '../../types'
import './LandingPage.css'

/* ── Animated Counter ── */
function useCounter(end: number, dur = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inV = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inV) return
    let s = 0
    const inc = end / (dur / 16)
    const t = setInterval(() => {
      s += inc
      if (s >= end) { setCount(end); clearInterval(t) }
      else setCount(Math.floor(s))
    }, 16)
    return () => clearInterval(t)
  }, [inV, end, dur])
  return { count, ref }
}

/* ── Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  }),
}
const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
}
const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
}
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

/* ── FAQ data ── */
const faqs = [
  { q: 'Can I start at my own pace?', a: 'Absolutely! All content is available on-demand. Learn at your own speed, revisit sessions anytime, and track your progress through the dashboard.' },
  { q: 'Do I get a certificate after completing my course?', a: 'Yes! Upon completing the required workshops and assessments, you receive an official CAP Business PRO certificate.' },
  { q: 'Are the courses suitable for beginners?', a: 'Yes. We have content for all skill levels — from brand new painters to experienced professionals looking to grow their business.' },
  { q: 'Can I access CAP Business PRO on my mobile device?', a: 'Yes, the platform is fully responsive and works beautifully on phones, tablets, and desktops.' },
  { q: 'How long do I have access to a course?', a: 'Pro and Elite subscribers have unlimited access to all content for the duration of their subscription.' },
  { q: 'Are there quizzes or assessments?', a: 'Yes, interactive assessments are included to test your knowledge.' },
]

/* Tilde SVG for stats */
const TildeSVG = () => (
  <svg viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8C8 2 14 12 20 6C26 0 32 10 38 4" stroke="#f26f21" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function LandingPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    
    // Fetch real courses from DB
    courseService.getCourses()
      .then(data => setCourses(data || []))
      .catch(err => {
        console.error('Failed to fetch courses:', err)
      })

    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleCourseClick = () => {
    navigate('/register')
  }

  return (
    <div className="lp">

      {/* ═══ NAVBAR ═══ */}
      <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <motion.a 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            href="#" className="lp-logo"
          >
            <img src="/capplc-logo1.png" alt="CAP Business PRO" fetchPriority="high" />
          </motion.a>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="lp-nav-actions"
          >
            <Link to="/login" className="lp-nav-signin">Sign In</Link>
            <Link to="/register" className="lp-nav-cta">Subscribe now</Link>
          </motion.div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="lp-hero" id="hero">
        <div className="deco deco-dot deco-dot-1" />
        <div className="deco deco-dot deco-dot-2" />
        <div className="deco deco-dot deco-dot-3" />
        <div className="deco-cross deco-cross-1" />
        <div className="deco-cross deco-cross-2" />

        <div className="lp-hero-inner">
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            <motion.div variants={fadeUp} custom={0} className="lp-hero-enrolled">
              <div className="lp-hero-avatar-stack">
                <img src="/landing/full_value3.88f5b03e7d581a65be92.png" className="lp-hero-av" alt="User" loading="lazy" />
                <img src="/landing/full_value4.541bbd7d799efd9ea392.png" className="lp-hero-av" alt="User" loading="lazy" />
                <img src="/landing/full_value6.925d86c457494824d74e.png" className="lp-hero-av" alt="User" loading="lazy" />
                <img src="/landing/womanPainter.jpg" className="lp-hero-av" alt="User" loading="lazy" />
                <img src="/landing/professional.jpg" className="lp-hero-av" alt="User" loading="lazy" />
              </div>
              <span className="lp-hero-enrolled-text">
                <strong style={{ color: 'var(--orange)' }}>500+</strong> Professionals already enrolled
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="lp-hero-title">
              CAP Business <span className="accent">PRO</span> <br />
              Workshop
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="lp-hero-sub">
              Empowering Painting Professionals. Grow your painting business with expert training, resources,
              and exclusive benefits designed for you.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="lp-hero-ctas">
              <Link to="/register" className="lp-btn-primary">
                Register now <ArrowRight size={17} />
              </Link>
              <a href="#about" className="lp-btn-outline">
                <Play size={17} /> Watch demo
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="lp-hero-photos">
              <div className="lp-hero-photo">
                <img src="/landing/professional.jpg" alt="Professional training" loading="lazy" />
                <div className="lp-hero-photo-label">Professional Training</div>
              </div>
              <div className="lp-hero-photo">
                <img src="/landing/womanPainter.jpg" alt="Expert workshops" loading="lazy" />
                <div className="lp-hero-photo-label">Expert Workshops</div>
              </div>
              <div className="lp-hero-photo">
                <img src="/landing/download1.png" alt="Business growth" loading="lazy" />
                <div className="lp-hero-photo-label">Business Growth</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ WAVE ═══ */}
      <div className="lp-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
        </svg>
      </div>

      {/* ═══ TOP COURSES ═══ */}
      <section className="lp-section lp-courses" id="courses">
        <div className="lp-section-inner lp-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp}
            className="lp-section-title"
          >
            Browse Our Top <span className="slash">Courses</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeUp}
            className="lp-section-desc centered"
          >
            Explore expert-led sessions designed to elevate your painting career.
          </motion.p>
        </div>

        {courses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true, amount: 0.1 }}
            className="lp-marquee-wrap"
          >
            <div className="lp-marquee-track">
              {[...courses, ...courses, ...courses].map((c, i) => (
                <div key={i} className="lp-course-card" onClick={handleCourseClick} style={{ cursor: 'pointer' }}>
                  <div className="lp-course-thumb">
                    <img src={c.thumbnail_url || c.thumbnail || '/landing/cap-img1.png'} alt={c.title} loading="lazy" />
                    <span className={`lp-course-badge ${c.tier_access === 'free' ? 'free' : 'pro'}`}>
                      {c.tier_access || 'Pro'}
                    </span>
                  </div>
                  <div className="lp-course-body">
                    <h3>{c.title}</h3>
                    <div className="lp-course-meta">
                      <span className="lp-course-rating">
                        <Users size={12} /> {Math.floor(Math.random() * 100) + 50} Students
                      </span>
                      <span><Clock size={12} /> {c.duration || '2.5'}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="lp-section-inner lp-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }}>
            <Link to="/register" className="lp-see-all">
              See All Courses <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="lp-section lp-features" id="features">
        <div className="lp-section-inner lp-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}
            className="lp-section-title"
          >
            Everything You Need to<br />Learn <span className="slash">Smarter</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}
            className="lp-section-desc centered"
          >
            All the tools and resources you need to grow your painting career.
          </motion.p>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={stagger} 
            className="lp-features-grid"
          >
            {[
              { icon: <BookOpen size={22} />, color: 'orange', title: 'Learning Paths', desc: 'Expert curated paths to master painting skills.', img: '/landing/cap-img1.png' },
              { icon: <BarChart3 size={22} />, color: 'violet', title: 'Progress Tracking', desc: 'Monitor your journey with real-time dashboards.', img: '/landing/cap-img2.png' },
              { icon: <Wrench size={22} />, color: 'teal', title: 'Business Tools', desc: 'Estimators, quoting tools, and business resources.', img: '/landing/download3.png' },
              { icon: <Gift size={22} />, color: 'rose', title: 'Exclusive Bonuses', desc: 'Discounts on CAP products and referral rewards.', img: '/landing/download1.png' },
              { icon: <Award size={22} />, color: 'orange', title: 'Official Certification', desc: 'Boost your credibility with CAP Pro certificates.', img: '/landing/professional.jpg' },
              { icon: <Headphones size={22} />, color: 'violet', title: 'Priority Support', desc: 'Dedicated support for all our professional members.', img: '/landing/womanPainter.jpg' },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i} className="lp-feat-card">
                <div className="lp-feat-img">
                  <img src={f.img} alt={f.title} loading="lazy" />
                </div>
                <div className={`lp-feat-icon ${f.color}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY CAP BUSINESS PRO EXISTS ═══ */}
      <section className="lp-section lp-about" id="about">
        <div className="lp-section-inner">
          <div className="lp-about-grid">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1, margin: '-10%' }} 
              variants={slideInLeft} 
              className="lp-about-visual"
            >
              <div className="lp-about-img-wrap">
                <div className="lp-about-img">
                  <img src="/landing/full_value3.88f5b03e7d581a65be92.png" alt="CAP Business PRO" loading="lazy" />
                </div>
                <div className="lp-about-float">
                  <div className="num">10+</div>
                  <div className="lbl">Years of<br />Excellence</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1, margin: '-10%' }} 
              variants={slideInRight} 
              className="lp-about-text"
            >
              <span className="lp-section-label">About Us</span>
              <h2>Why CAP Business PRO Exists</h2>
              <p>
                CAP Business PRO is the premier professional development platform created by
                Chemical and Allied Products Plc (CAP Plc). We believe every painting professional deserves access to world-class
                training and business tools.
              </p>
              <p>
                 Equipping you with everything you need to build a thriving painting business in
                Nigeria's construction industry.
              </p>

              <div className="lp-about-checks">
                {[
                  { icon: <Check size={13} />, text: 'Professional Training' },
                  { icon: <Award size={13} />, text: 'Certification' },
                  { icon: <Globe size={13} />, text: 'Nationwide Access' },
                  { icon: <Users size={13} />, text: 'Expert Instructors' },
                ].map(c => (
                  <div key={c.text} className="lp-about-check">
                    <div className="lp-about-check-icon">{c.icon}</div>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <StatsSection />

      {/* ═══ WAVE ═══ */}
      <div className="lp-wave" style={{ transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
        </svg>
      </div>

      {/* ═══ PRICING ═══ */}
      <section className="lp-section lp-pricing" id="pricing">
        <div className="lp-section-inner lp-center">
          <motion.span initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.1 }} className="lp-section-label">
            Pricing
          </motion.span>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}
            className="lp-section-title"
          >
            Find the Right Plan for You
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}
            className="lp-section-desc centered"
          >
            Choose a plan that matches your goals.
          </motion.p>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={stagger} className="lp-pricing-grid">
            <motion.div variants={fadeUp} custom={0} className="lp-price-card">
              <div className="lp-price-tier">Free</div>
              <div className="lp-price-amount">₦0</div>
              <div className="lp-price-period">Forever free</div>
              <ul className="lp-price-features">
                <li><span className="lp-price-check"><Check size={11} /></span> 2 free workshops</li>
                <li><span className="lp-price-check"><Check size={11} /></span> Community forum</li>
                <li><span className="lp-price-check"><Check size={11} /></span> Email support</li>
              </ul>
              <Link to="/register" className="lp-price-btn">Get started</Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="lp-price-card pop">
              <div className="lp-price-pop-badge">Most Popular</div>
              <div className="lp-price-tier">Pro</div>
              <div className="lp-price-amount">₦29,999</div>
              <div className="lp-price-period">per year</div>
              <ul className="lp-price-features">
                <li><span className="lp-price-check"><Check size={11} /></span> Full workshop library</li>
                <li><span className="lp-price-check"><Check size={11} /></span> Video tutorials & tools</li>
                <li><span className="lp-price-check"><Check size={11} /></span> CAP certification</li>
                <li><span className="lp-price-check"><Check size={11} /></span> Priority support</li>
              </ul>
              <Link to="/register" className="lp-price-btn">Subscribe now</Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="lp-price-card">
              <div className="lp-price-tier">Elite</div>
              <div className="lp-price-amount">₦49,999</div>
              <div className="lp-price-period">per year</div>
              <ul className="lp-price-features">
                <li><span className="lp-price-check"><Check size={11} /></span> 1-on-1 mentorship</li>
                <li><span className="lp-price-check"><Check size={11} /></span> Product discounts</li>
                <li><span className="lp-price-check"><Check size={11} /></span> Referral program</li>
                <li><span className="lp-price-check"><Check size={11} /></span> Dedicated agent</li>
              </ul>
              <Link to="/register" className="lp-price-btn">Go elite</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="lp-section lp-testimonial" id="testimonials">
        <div className="lp-testi-shape lp-testi-shape-1" />
        <div className="lp-testi-shape lp-testi-shape-2" />

        <div className="lp-section-inner lp-center" style={{ position: 'relative', zIndex: 2 }}>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}
            className="lp-section-title"
          >
            What Learners Say About<br />CAP Business <span className="slash">PRO</span>
          </motion.h2>
        </div>

        <div className="lp-testi-inner">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.7 }}
          >
            <p className="lp-testi-text">
              "CAP Business PRO has completely transformed my painting business. The workshops are
              practical, the tools have helped me manage projects efficiently, and the certification
              gave me credibility with new clients."
            </p>
            <div className="lp-testi-author">
              <h4>Orimogunje Oyebola</h4>
              <p>Professional Painter, Lagos</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="lp-section lp-faq" id="faq">
        <div className="lp-section-inner lp-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}
            className="lp-section-title"
          >
            Frequently Asked<br />Questions
          </motion.h2>
        </div>

        <div className="lp-faq-grid">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="lp-faq-item"
            >
              <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}
                <ChevronDown className={`lp-faq-chevron ${openFaq === i ? 'open' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="lp-faq-a">{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="lp-cta-banner">
        <div className="lp-cta-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,0 L0,0 Z" fill="#f8fafc" />
          </svg>
        </div>
        <div className="lp-cta-banner-inner">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}
          >
            <h2>Start Your Learning Journey<br />With CAP Business PRO Workshop</h2>
            <p>
              Join hundreds of Nigerian painting professionals who are already growing.
            </p>
            <Link to="/register" className="lp-cta-banner-btn">
              Get started now <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <img src="/capplc-logo1.png" alt="CAP Business PRO" className="lp-footer-logo" loading="lazy" />
            <p>
              Professional development platform for Nigerian painters. Powered by CAP Plc.
            </p>
          </div>

          <div className="lp-footer-col">
            <h4>Quick Links</h4>
            <a href="#hero">Home</a>
            <a href="#courses">Courses</a>
            <a href="#features">Benefits</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="lp-footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>

          <div className="lp-footer-col">
            <h4>Stay Updated</h4>
            <div className="lp-footer-nl">
              <input type="email" placeholder="Your email" />
              <button><Send size={15} /></button>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <p>© {new Date().getFullYear()} CAP Business PRO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

/* ═══ Stats Section ═══ */
function StatsSection() {
  const s1 = useCounter(500)
  const s2 = useCounter(50)
  const s3 = useCounter(36)
  const s4 = useCounter(100)

  return (
    <section className="lp-stats">
      <div className="lp-section-inner">
        <div className="lp-stats-grid">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} custom={0} className="lp-stat" ref={s1.ref}>
            <div className="lp-stat-tilde"><TildeSVG /></div>
            <div className="lp-stat-num">{s1.count}+</div>
            <div className="lp-stat-lbl">Painters Trained</div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} custom={1} className="lp-stat" ref={s2.ref}>
            <div className="lp-stat-tilde"><TildeSVG /></div>
            <div className="lp-stat-num">{s2.count}+</div>
            <div className="lp-stat-lbl">Expert Workshops</div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} custom={2} className="lp-stat" ref={s3.ref}>
            <div className="lp-stat-tilde"><TildeSVG /></div>
            <div className="lp-stat-num">{s3.count}</div>
            <div className="lp-stat-lbl">Nigerian States</div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUp} custom={3} className="lp-stat" ref={s4.ref}>
            <div className="lp-stat-tilde"><TildeSVG /></div>
            <div className="lp-stat-num">{s4.count}%</div>
            <div className="lp-stat-lbl">Certifications</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
