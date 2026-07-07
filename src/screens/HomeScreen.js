// Home Screen Component — Prompt 2 Complete Flagship Implementation
const { useState, useEffect, useRef } = React;

const HomeScreen = ({ onSelectTab, onReplaySplash, onReplayOnboarding, onOpenAuth, selectedLocation = 'Hyderabad', onOpenLocation }) => {
  // Carousel slide state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');

  // Auto-advance carousel every 5s unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSlideDirection('next');
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

  // Re-initialize Lucide icons on slide change
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => window.lucide.createIcons(), 30);
    }
  }, [currentSlide]);

  // Touch swipe handling for carousel
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setIsPaused(false);
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      setSlideDirection('next');
      setCurrentSlide((prev) => (prev + 1) % 3);
    } else if (diff < -40) {
      setSlideDirection('prev');
      setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    }
  };

  // Note: Pull-to-Refresh is handled globally by PullToRefresh class in spring.js
  // bound to .screen-container in App.js. No local PTR implementation needed.

  return (
    <div className="screen-transition-enter" style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)', background: '#FFFFFF' }}>
      {/* PTR handled globally by PullToRefresh in App.js — no local indicator needed */}

      {/* 1. SEAMLESS DARK HERO SECTION (Continues #070A13 from Top Header) */}
      <div
        className="hero-section dark-anchor"
        style={{
          background: 'linear-gradient(180deg, #070A13 0%, #FFF5EC 100%)',
          padding: '4px var(--screen-padding) 44px var(--screen-padding)',
          margin: 0,
          position: 'relative',
          zIndex: 1,
          color: '#FFFFFF'
        }}
      >
        <div
          className="hero-carousel"
          style={{ position: 'relative', overflow: 'hidden', minHeight: '200px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* SLIDE 0 — EXACT MATCH OF USER IMAGE: "See the world in perfect clarity" */}
          {currentSlide === 0 && (
            <div
              className="carousel-slide-inner"
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: slideDirection === 'next' ? 'slideInRight 400ms var(--spring-bezier)' : 'slideInLeft 400ms var(--spring-bezier)'
              }}
            >
              {/* Left Column: 60% Width */}
              <div style={{ width: '60%', paddingRight: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.15', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                  See the world<br />
                  in perfect <span style={{ color: '#9CCC65' }}>clarity</span>
                </h1>
                <p style={{ fontSize: '14px', color: '#A5B4FC', margin: '0 0 18px 0', lineHeight: '1.4', fontWeight: '500', textShadow: 'none' }}>
                  Premium Lenses.<br />
                  Perfect Vision.
                </p>
                <button
                  onClick={() => onSelectTab('shop')}
                  style={{
                    background: '#9CCC65',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '0 22px',
                    height: '42px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(132, 204, 22, 0.3)',
                    transition: 'transform 200ms ease'
                  }}
                >
                  <span>Shop Now</span>
                  <i data-lucide="arrow-right" style={{ width: '16px', height: '16px', color: '#000000' }} />
                </button>
              </div>

              {/* Right Column: 40% Width */}
              <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(0, 229, 255, 0.25) 0%, transparent 70%)', filter: 'blur(25px)', pointerEvents: 'none' }} />
                <svg width="130" height="70" viewBox="0 0 120 65" fill="none" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))' }}>
                  <circle cx="30" cy="32" r="22" stroke="#1E293B" strokeWidth="4.5" fill="rgba(15, 23, 42, 0.85)" />
                  <circle cx="90" cy="32" r="22" stroke="#1E293B" strokeWidth="4.5" fill="rgba(15, 23, 42, 0.85)" />
                  <circle cx="30" cy="32" r="19" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="18 8" opacity="0.8" />
                  <circle cx="90" cy="32" r="19" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="18 8" opacity="0.8" />
                  <path d="M52 32 C 56 26, 64 26, 68 32" stroke="#1E293B" strokeWidth="4.5" fill="none" />
                  <path d="M8 32 L 1 24 M 112 32 L 119 24" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M20 24 L 38 38 M 80 24 L 98 38" stroke="#00E5FF" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          )}

          {/* SLIDE 1 — VIP CLUB */}
          {currentSlide === 1 && (
            <div
              className="carousel-slide-inner"
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: slideDirection === 'next' ? 'slideInRight 400ms var(--spring-bezier)' : 'slideInLeft 400ms var(--spring-bezier)'
              }}
            >
              <div style={{ width: '60%', paddingRight: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="badge-pill badge-purple" style={{ fontSize: '10px', padding: '4px 10px', marginBottom: '8px', display: 'inline-block' }}>VIP CLUB</span>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.1', margin: '0 0 4px 0' }}>
                  Flat 25% Off
                </h2>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#9CCC65', lineHeight: '1.0', marginBottom: '12px' }}>
                  ₹99/mo
                </div>
                <p style={{ fontSize: '13px', color: '#A5B4FC', margin: '0 0 16px 0', lineHeight: '1.4', textShadow: 'none' }}>
                  Free checkups & priority slots
                </p>
                <button
                  onClick={() => onSelectTab('membership')}
                  style={{ background: '#9CCC65', color: '#000000', border: 'none', borderRadius: '999px', padding: '0 22px', height: '42px', fontSize: '13px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(156, 204, 101, 0.3)' }}
                >
                  <span>Join Now</span>
                  <i data-lucide="arrow-right" style={{ width: '16px', height: '16px', color: '#000000' }} />
                </button>
              </div>

              <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 1, position: 'relative' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(132,204,22,0.2), rgba(0,229,255,0.2))', border: '1.5px solid rgba(132,204,22,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', transform: 'rotate(6deg)' }}>
                  <span style={{ fontSize: '38px' }}>👑</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#FFFFFF', marginTop: '4px', letterSpacing: '1px' }}>VIP CLUB</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2 — FREE EYE CHECK-UP */}
          {currentSlide === 2 && (
            <div
              className="carousel-slide-inner"
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: slideDirection === 'next' ? 'slideInRight 400ms var(--spring-bezier)' : 'slideInLeft 400ms var(--spring-bezier)'
              }}
            >
              <div style={{ width: '60%', paddingRight: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="badge-pill badge-cyan" style={{ fontSize: '10px', padding: '4px 10px', marginBottom: '8px', display: 'inline-block' }}>100% ONLINE</span>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.1', margin: '0 0 4px 0' }}>
                  Free Online
                </h2>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#00E5FF', lineHeight: '1.0', marginBottom: '12px' }}>
                  Check-Up
                </div>
                <p style={{ fontSize: '13px', color: '#A5B4FC', margin: '0 0 16px 0', lineHeight: '1.4', textShadow: 'none' }}>
                  Certified optometrists from home
                </p>
                <button
                  onClick={() => onSelectTab('eyetest')}
                  style={{ background: '#00E5FF', color: '#000000', border: 'none', borderRadius: '999px', padding: '0 22px', height: '42px', fontSize: '13px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 229, 255, 0.3)' }}
                >
                  <span>Book Free</span>
                  <i data-lucide="arrow-right" style={{ width: '16px', height: '16px', color: '#000000' }} />
                </button>
              </div>

              <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 1, position: 'relative' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '45px', background: 'rgba(0,229,255,0.18)', border: '2px solid rgba(0,229,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0,229,255,0.3)' }}>
                  <i data-lucide="eye" style={{ width: '45px', height: '45px', color: '#00E5FF' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CAROUSEL DOTS (At bottom of dark hero section) */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '24px' }}>
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              onClick={() => {
                setSlideDirection(idx > currentSlide ? 'next' : 'prev');
                setCurrentSlide(idx);
              }}
              style={{
                width: currentSlide === idx ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: currentSlide === idx ? '#9CCC65' : '#4A5568',
                transition: 'all 300ms var(--spring-bezier)',
                cursor: 'pointer',
                display: 'inline-block'
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. LIGHT BODY CONTAINER WITH ROUNDED TOP CORNERS OVERLAPPING HERO */}
      <div
        className="home-light-body"
        style={{
          background: '#FFFFFF',
          borderTopLeftRadius: '50% 40px',
          borderTopRightRadius: '50% 40px',
          marginTop: '-36px',
          padding: '32px 0 0 0',
          position: 'relative',
          zIndex: 10,
          boxShadow: 'none'
        }}
      >
        {/* A. 4 ACTION CARDS ROW (Eyeglasses, Lenses, Blue Cut, Store Locator) */}
        <div style={{ margin: '0 var(--screen-padding) 28px var(--screen-padding)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: '#FFFFFF', borderRadius: '20px', padding: '16px 4px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #F0F0F0' }}>
          {[
            { icon: 'glasses', color: '#9CCC65', bg: 'rgba(156, 204, 101, 0.12)', title: 'Eyeglasses', sub: 'Stylish Frames', tab: 'shop' },
            { icon: 'disc', color: '#1E88E5', bg: 'rgba(30, 136, 229, 0.12)', title: 'Lenses', sub: 'Premium Quality', tab: 'shop' },
            { icon: 'shield-check', color: '#9CCC65', bg: 'rgba(156, 204, 101, 0.12)', title: 'Blue Cut', sub: 'Screen Protection', tab: 'shop' },
            { icon: 'map-pin', color: '#1E88E5', bg: 'rgba(30, 136, 229, 0.12)', title: 'Store Locator', sub: 'Find Near You', tab: 'stores' }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTab(item.tab)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer',
                borderRight: idx < 3 ? '1px solid #F0F0F0' : 'none', padding: '0 4px'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <i data-lucide={item.icon} style={{ width: '22px', height: '22px', color: item.color }} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#111111', marginBottom: '2px' }}>{item.title}</div>
              <div style={{ fontSize: '10px', color: '#757575', fontWeight: '400', lineHeight: '1.2' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* B. SHOP BY CATEGORY SECTION */}
        <div style={{ margin: '0 var(--screen-padding) 28px var(--screen-padding)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111111', margin: 0 }}>Shop by Category</h2>
            <span onClick={() => onSelectTab('shop')} style={{ fontSize: '13px', fontWeight: '700', color: '#9CCC65', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
              See All &gt;
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { title: 'Men', sub: 'Collection', bg: '#F5F5F7', img: 'assets/category_eyeglasses_1783260180325.png', tab: 'shop' },
              { title: 'Women', sub: 'Collection', bg: '#FFF0F5', img: 'assets/category_sunglasses_1783260195132.png', tab: 'shop' },
              { title: 'Sunglasses', sub: 'Collection', bg: '#F5F5F7', img: 'assets/category_sunglasses_1783260195132.png', tab: 'shop' },
              { title: 'Blue Cut', sub: 'Lenses', bg: '#F0F4F8', img: 'assets/category_computer_1783260205921.png', tab: 'shop' }
            ].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => onSelectTab(cat.tab)}
                style={{
                  background: cat.bg,
                  borderRadius: '20px',
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: 'none',
                  border: 'none',
                  minHeight: '140px'
                }}
              >
                <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', overflow: 'hidden' }}>
                  <img src={cat.img} alt={cat.title} style={{ width: '85%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#111111', marginBottom: '2px' }}>{cat.title}</div>
                    <div style={{ fontSize: '10px', color: '#757575', fontWeight: '400' }}>{cat.sub}</div>
                  </div>
                  <span style={{ color: '#9CCC65', fontSize: '14px', fontWeight: '800' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* C. BLUE CUT DARK BANNER CARD */}
        <div
          onClick={() => onSelectTab('shop')}
          style={{
            margin: '0 var(--screen-padding) 28px var(--screen-padding)',
            background: 'linear-gradient(135deg, #020813 0%, #0B1C3F 100%)',
            borderRadius: '24px',
            padding: '20px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(2, 8, 19, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(33, 150, 243, 0.3) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '25px', background: 'rgba(33, 150, 243, 0.15)', border: '1.5px solid rgba(33, 150, 243, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(33, 150, 243, 0.4)', flexShrink: 0 }}>
              <i data-lucide="shield" style={{ width: '24px', height: '24px', color: '#2196F3' }} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2', marginBottom: '4px' }}>
                Protect your eyes<br />
                from <span style={{ color: '#2196F3' }}>digital strain</span>
              </div>
              <div style={{ fontSize: '12px', color: '#A0A4C8', fontWeight: '500' }}>
                Explore our Blue Cut Lenses
              </div>
            </div>
          </div>

          <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2 }}>
            <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '800' }}>→</span>
          </div>
        </div>

        {/* D. 4 TRUST BADGES ROW */}
        <div style={{ margin: '0 var(--screen-padding) 28px var(--screen-padding)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: '#FFFFFF', borderRadius: '20px', padding: '18px 4px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #F0F0F0' }}>
          {[
            { icon: 'award', color: '#9CCC65', bg: 'rgba(156, 204, 101, 0.12)', title: 'Premium Quality', sub: 'Assured' },
            { icon: 'shield-check', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', title: 'UV Protection', sub: '100%' },
            { icon: 'check-circle', color: '#9CCC65', bg: 'rgba(156, 204, 101, 0.12)', title: '1 Year Warranty', sub: 'On Lenses' },
            { icon: 'headphones', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', title: 'Expert Support', sub: 'Always Here' }
          ].map((badge, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                borderRight: idx < 3 ? '1px solid #EAEAEA' : 'none', padding: '0 4px'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '22px', background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <i data-lucide={badge.icon} style={{ width: '22px', height: '22px', color: badge.color }} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#1C1917', marginBottom: '2px' }}>{badge.title}</div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '500' }}>{badge.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FREE EYE CHECK-UP FEATURE CARD (Section 5 per Item 1 & Item 8) */}
      <div
        className="glass-card-glow-cyan fade-up-item"
        style={{ margin: '0 var(--screen-padding) 32px var(--screen-padding)', padding: '20px', height: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '14px', animationDelay: '80ms' }}
      >
        <div style={{ width: '52px', height: '52px', borderRadius: '26px', background: 'rgba(41,182,246,0.18)', border: '1.5px solid rgba(41,182,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i data-lucide="eye" style={{ width: '26px', height: '26px', color: '#29B6F6' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', height: '22px', padding: '0 10px', background: 'rgba(102,187,106,0.2)', color: '#66BB6A', fontSize: '10px', fontWeight: '700', borderRadius: '999px', marginBottom: '6px' }}>
            FREE
          </span>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0, lineHeight: '1.2' }}>
            Online Eye Check-Up
          </h3>
          <p style={{ fontSize: '12px', color: '#A0A4C8', lineHeight: '1.5', margin: '4px 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            Book with certified optometrists from home. Get your digital prescription instantly.
          </p>
          <button
            className="btn-primary-pill"
            style={{ height: '36px', padding: '0 16px', fontSize: '12px', marginTop: '10px', width: 'fit-content', background: 'linear-gradient(135deg, #29B6F6, #0288D1)' }}
            onClick={() => onSelectTab('eyetest')}
          >
            Book Now — Free
          </button>
        </div>
      </div>

      {/* 6. BOGO OFFER DETAIL CARD (Section 6 per Item 1) */}
      <div className="bogo-rotating-card fade-up-item" style={{ margin: '0 var(--screen-padding) 32px var(--screen-padding)', animationDelay: '120ms' }}>
        <div className="bogo-card-inner">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(255,122,48,0.18)', border: '1.5px solid rgba(255,122,48,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
              🎁
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
                Buy 1 Get 1 FREE
              </h3>
              <p style={{ fontSize: '13px', color: '#A0A4C8', lineHeight: '1.5' }}>
                Purchase any frame worth ₹1,699 or more and get a second frame absolutely free. No code needed.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <button
              className="btn-primary-pill"
              style={{ height: '42px', padding: '0 20px', fontSize: '14px', background: 'linear-gradient(135deg, #FF7A30, #FF7873)' }}
              onClick={() => onSelectTab('shop')}
            >
              Shop the Offer →
            </button>
            <span style={{ fontSize: '11px', color: '#6B6E9A', fontStyle: 'italic' }}>
              *Both frames from same price tier or lower.
            </span>
          </div>
        </div>
      </div>

      {/* 7. MEMBERSHIP TEASER CARD (Section 7 per Item 1) */}
      <div className="purple-shimmer-card fade-up-item" style={{ margin: '0 var(--screen-padding) 32px var(--screen-padding)', animationDelay: '160ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#8140DC', letterSpacing: '1.5px' }}>
            LENS MAKERS CLUB
          </span>
          <span className="badge-pill badge-purple" style={{ fontSize: '10px' }}>VIP PRIVILEGE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF' }}>₹99</span>
          <span style={{ fontSize: '16px', color: '#A0A4C8', fontWeight: '500' }}>/ month</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', position: 'relative', zIndex: 2, fontSize: '13px', color: '#F0F0F5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#66BB6A', fontWeight: '800', fontSize: '14px' }}>✓</span> Flat 25% off on all eyewear
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#66BB6A', fontWeight: '800', fontSize: '14px' }}>✓</span> 1 free online eye check-up per month
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#66BB6A', fontWeight: '800', fontSize: '14px' }}>✓</span> Priority AR Try-On slots
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          <button
            className="btn-primary-pill"
            style={{ height: '44px', padding: '0 22px', fontSize: '14px', background: 'linear-gradient(135deg, #8140DC, #FF7873)' }}
            onClick={() => onSelectTab('membership')}
          >
            Join Club for ₹99 →
          </button>
          <span style={{ fontSize: '11px', color: '#A0A4C8' }}>
            No lock-in. Cancel anytime.
          </span>
        </div>
      </div>

      {/* 8. AR TRY-ON FEATURE CARD (Section 8 - 28px gap before Premium Specials per Item 1) */}
      <div
        className="glass-card-glow-pink fade-up-item"
        style={{ margin: '0 var(--screen-padding) 32px var(--screen-padding)', display: 'flex', alignItems: 'center', gap: '16px', animationDelay: '200ms' }}
      >
        <div className="pulse-glow-circle">
          <i data-lucide="camera" style={{ width: '26px', height: '26px', color: '#FF7873' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
            Virtual Try-On
          </h3>
          <p style={{ fontSize: '12px', color: '#A0A4C8', lineHeight: '1.4', marginBottom: '10px' }}>
            See exactly how any frame looks on your face using your camera — in real time.
          </p>
          <button
            className="btn-primary-pill"
            style={{ height: '38px', padding: '0 18px', fontSize: '13px' }}
            onClick={() => onSelectTab('tryon')}
          >
            Try Now
          </button>
        </div>
      </div>

      {/* 9. PREMIUM SPECIALS (Section 9 - 3 Stacked Product Cards per Item 6 & Item 7) */}
      <div className="fade-up-item" style={{ animationDelay: '240ms', padding: '0 var(--screen-padding)', marginBottom: '32px' }}>
        <h2 className="section-heading mb-3">
          Premium Specials
        </h2>

        {/* Card 1: Aviator Gold Frame */}
        <div className="premium-special-card" onClick={() => onSelectTab('shop')}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', borderRadius: '16px 0 0 16px', background: '#8140DC' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <span style={{ fontSize: '28px' }}>🕶️</span>
            </div>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#F0F0F5', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Aviator Gold Frame</div>
              <div style={{ fontSize: '11px', color: '#A0A4C8', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>24K Plated Titanium • UV400</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginTop: '4px' }}>₹4,499</div>
            </div>
          </div>
          <div style={{ height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', flexShrink: 0 }}>
            <span className="badge-pill badge-purple" style={{ fontSize: '10px' }}>
              PREMIUM
            </span>
          </div>
        </div>

        {/* Card 2: Tortoise Classic */}
        <div className="premium-special-card" onClick={() => onSelectTab('shop')}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', borderRadius: '16px 0 0 16px', background: '#8140DC' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <span style={{ fontSize: '28px' }}>👓</span>
            </div>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#F0F0F5', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Tortoise Classic</div>
              <div style={{ fontSize: '11px', color: '#A0A4C8', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Italian Acetate • Anti-Glare</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginTop: '4px' }}>₹3,899</div>
            </div>
          </div>
          <div style={{ height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', flexShrink: 0 }}>
            <span className="badge-pill badge-purple" style={{ fontSize: '10px' }}>
              PREMIUM
            </span>
          </div>
        </div>

        {/* Card 3: Round Titanium Lite */}
        <div className="premium-special-card" onClick={() => onSelectTab('shop')}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', borderRadius: '16px 0 0 16px', background: '#8140DC' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <span style={{ fontSize: '28px' }}>🥽</span>
            </div>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#F0F0F5', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Round Titanium Lite</div>
              <div style={{ fontSize: '11px', color: '#A0A4C8', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Featherweight 12g • Matte Black</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginTop: '4px' }}>₹5,299</div>
            </div>
          </div>
          <div style={{ height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', flexShrink: 0 }}>
            <span className="badge-pill badge-purple" style={{ fontSize: '10px' }}>
              PREMIUM
            </span>
          </div>
        </div>
      </div>

      {/* 9.5 DIGITAL EYE PRESCRIPTION TEASER CARD (Prompt 8) */}
      <div
        className="rx-card-cyan fade-up-item"
        style={{ margin: '0 var(--screen-padding) 32px var(--screen-padding)', animationDelay: '260ms', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}
        onClick={() => onSelectTab('prescription')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(41,182,246,0.2)', border: '1.5px solid #29B6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
            👁️
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#FFFFFF' }}>Digital Eye Prescriptions</div>
            <div style={{ fontSize: '12px', color: '#A0A4C8', marginTop: '2px' }}>Store & share OCR-scanned medical vision records</div>
          </div>
        </div>
        <button
          type="button"
          style={{ padding: '8px 14px', borderRadius: '999px', background: 'rgba(41,182,246,0.15)', border: '1px solid #29B6F6', color: '#29B6F6', fontSize: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}
          onClick={(e) => { e.stopPropagation(); onSelectTab('prescription'); }}
        >
          Manage Rx →
        </button>
      </div>

      {/* 10. STORE LOCATOR TEASER CARD (Section 10 per Item 1 & Item 9) */}
      <div
        className="glass-card-glow-green fade-up-item"
        style={{ margin: '0 var(--screen-padding) 0 var(--screen-padding)', animationDelay: '280ms', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => onSelectTab('stores')}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(#66BB6A 1.5px, transparent 1.5px)', backgroundSize: '16px 16px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <i data-lucide="map-pin" style={{ width: '20px', height: '20px', color: '#66BB6A' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
              Find a Lens Makers Store Near You
            </h3>
          </div>

          <div style={{ fontSize: '13px', color: '#66BB6A', fontWeight: '600', marginBottom: '14px' }}>
            DELIVER TO: {selectedLocation}
          </div>

          <button
            type="button"
            className="btn-secondary-pill"
            style={{ height: '40px', padding: '0 20px', fontSize: '13px', borderColor: '#66BB6A', color: '#66BB6A' }}
            onClick={(e) => { e.stopPropagation(); onSelectTab('stores'); }}
          >
            Find Stores →
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', padding: '16px var(--screen-padding) 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '12px', color: '#6B6E9A' }}>
          Lens Makers Club • Built with Vanilla CSS & React
        </div>
      </div>
    </div>
  );
};

window.HomeScreen = HomeScreen;
