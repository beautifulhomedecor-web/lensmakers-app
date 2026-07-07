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
    <div className="screen-transition-enter" style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)' }}>
      {/* PTR handled globally by PullToRefresh in App.js — no local indicator needed */}

      {/* 2. HERO BANNER CAROUSEL (Section 2 - Exact 220px height, 60% left column, 40% right column per Item 2) */}
      <div className="hero-carousel-wrapper" style={{ position: 'relative', margin: '0 var(--screen-padding) 32px var(--screen-padding)' }}>
        <div
          className="hero-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* SLIDE 1 — BOGO OFFER */}
          {currentSlide === 0 && (
            <div
              className="carousel-slide-inner"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                animation: slideDirection === 'next' ? 'slideInRight 400ms var(--spring-bezier)' : 'slideInLeft 400ms var(--spring-bezier)'
              }}
            >
              <div style={{ position: 'absolute', top: '-40px', left: '10%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(255,77,141,0.25) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
              
              {/* Left Column: 60% Width */}
              <div style={{ width: '60%', paddingRight: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="badge-pill badge-orange" style={{ fontSize: '10px', padding: '4px 10px', marginBottom: '8px', display: 'inline-block' }}>LIMITED OFFER</span>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.1', margin: '0 0 4px 0' }}>
                  Buy 1 Get 1
                </h2>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#FF4D8D', lineHeight: '1.0', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                  FREE
                </div>
                <p style={{ fontSize: '12px', color: '#A0A4C8', margin: '0 0 14px 0', lineHeight: '1.3' }}>
                  On purchase of ₹1,699+
                </p>
                <button
                  className="btn-primary-pill"
                  style={{ height: '38px', padding: '0 18px', fontSize: '13px', width: 'fit-content' }}
                  onClick={() => onSelectTab('shop')}
                >
                  Shop Now →
                </button>
              </div>

              {/* Right Column: 40% Width (max-height 180px illustration) */}
              <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', maxHeight: '180px', height: '100%', zIndex: 1, position: 'relative' }}>
                <svg width="110" height="90" viewBox="0 0 120 100" fill="none">
                  <circle cx="32" cy="45" r="22" stroke="#1E88E5" strokeWidth="3.5" fill="rgba(30,136,229,0.15)" />
                  <circle cx="88" cy="45" r="22" stroke="#1E88E5" strokeWidth="3.5" fill="rgba(30,136,229,0.15)" />
                  <path d="M54 45 C 58 40, 62 40, 66 45" stroke="#1E88E5" strokeWidth="3.5" fill="none" />
                  <path d="M10 45 L 2 35 M 110 45 L 118 35" stroke="#1E88E5" strokeWidth="3.5" strokeLinecap="round" />
                  
                  {/* Second pair overlapping behind */}
                  <g transform="translate(-12, 22) scale(0.85)" opacity="0.65">
                    <circle cx="32" cy="45" r="22" stroke="#FF4D8D" strokeWidth="3.5" fill="rgba(255,77,141,0.15)" />
                    <circle cx="88" cy="45" r="22" stroke="#FF4D8D" strokeWidth="3.5" fill="rgba(255,77,141,0.15)" />
                    <path d="M54 45 C 58 40, 62 40, 66 45" stroke="#FF4D8D" strokeWidth="3.5" fill="none" />
                  </g>
                </svg>
                {/* Overlapping FREE Ribbon Badge */}
                <div style={{ position: 'absolute', bottom: '8px', right: '-4px', background: 'linear-gradient(135deg, #43A047, #2E7D32)', color: '#FFFFFF', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', transform: 'rotate(-6deg)' }}>
                  ★ 2nd FREE
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2 — MEMBERSHIP CLUB */}
          {currentSlide === 1 && (
            <div
              className="carousel-slide-inner"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                animation: slideDirection === 'next' ? 'slideInRight 400ms var(--spring-bezier)' : 'slideInLeft 400ms var(--spring-bezier)'
              }}
            >
              <div style={{ position: 'absolute', top: '10%', right: '10%', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(124,77,141,0.3) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

              {/* Left Column: 60% Width */}
              <div style={{ width: '60%', paddingRight: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="badge-pill badge-purple" style={{ fontSize: '10px', padding: '4px 10px', marginBottom: '8px', display: 'inline-block' }}>LENS MAKERS CLUB</span>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.1', margin: '0 0 4px 0' }}>
                  Flat 25% Off
                </h2>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#7C4DFF', lineHeight: '1.0', marginBottom: '12px' }}>
                  ₹99/mo
                </div>
                <p style={{ fontSize: '12px', color: '#A0A4C8', margin: '0 0 14px 0', lineHeight: '1.3' }}>
                  Free checkups & priority slots
                </p>
                <button
                  className="btn-primary-pill"
                  style={{ height: '38px', padding: '0 18px', fontSize: '13px', width: 'fit-content', background: 'linear-gradient(135deg, #7C4DFF, #512DA8)' }}
                  onClick={() => onSelectTab('membership')}
                >
                  Join Now →
                </button>
              </div>

              {/* Right Column: 40% Width (max-height 180px illustration) */}
              <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', maxHeight: '180px', height: '100%', zIndex: 1, position: 'relative' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(124,77,255,0.25), rgba(255,77,141,0.25))', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', transform: 'rotate(6deg)' }}>
                  <span style={{ fontSize: '36px' }}>👑</span>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#FFFFFF', marginTop: '4px', letterSpacing: '1px' }}>VIP CLUB</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3 — FREE EYE CHECK-UP */}
          {currentSlide === 2 && (
            <div
              className="carousel-slide-inner"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                animation: slideDirection === 'next' ? 'slideInRight 400ms var(--spring-bezier)' : 'slideInLeft 400ms var(--spring-bezier)'
              }}
            >
              <div style={{ position: 'absolute', top: '10%', right: '20%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(41,182,246,0.25) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

              {/* Left Column: 60% Width */}
              <div style={{ width: '60%', paddingRight: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="badge-pill badge-cyan" style={{ fontSize: '10px', padding: '4px 10px', marginBottom: '8px', display: 'inline-block' }}>100% ONLINE</span>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.1', margin: '0 0 4px 0' }}>
                  Free Online
                </h2>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#29B6F6', lineHeight: '1.0', marginBottom: '12px' }}>
                  Check-Up
                </div>
                <p style={{ fontSize: '12px', color: '#A0A4C8', margin: '0 0 14px 0', lineHeight: '1.3' }}>
                  Certified optometrists from home
                </p>
                <button
                  className="btn-primary-pill"
                  style={{ height: '38px', padding: '0 18px', fontSize: '13px', width: 'fit-content', background: 'linear-gradient(135deg, #29B6F6, #0288D1)' }}
                  onClick={() => onSelectTab('eyetest')}
                >
                  Book Free →
                </button>
              </div>

              {/* Right Column: 40% Width (max-height 180px illustration) */}
              <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', maxHeight: '180px', height: '100%', zIndex: 1, position: 'relative' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '42px', background: 'rgba(41,182,246,0.18)', border: '2px solid rgba(41,182,246,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(41,182,246,0.3)' }}>
                  <i data-lucide="eye" style={{ width: '42px', height: '42px', color: '#29B6F6' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CAROUSEL CONTROLS (8px below card edge per Item 2) */}
        <div className="carousel-dots">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => {
                setSlideDirection(idx > currentSlide ? 'next' : 'prev');
                setCurrentSlide(idx);
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. CATEGORY SECTION — "SHOP BY CATEGORY" (Section 4) */}
      <div className="fade-up-item" style={{ animationDelay: '40ms' }}>
        <h2 className="section-heading mb-2" style={{ padding: '0 var(--screen-padding)' }}>
          Shop by Category
        </h2>
        <div className="category-grid">
          {/* Card 1: Eyeglasses */}
          <div
            className="category-card"
            style={{ 
              background: `linear-gradient(to bottom, rgba(15,21,53,0) 40%, rgba(15,21,53,0.95) 100%), url('assets/category_eyeglasses_1783260180325.png') center/cover no-repeat`, 
              border: '1px solid rgba(30,136,229,0.4)',
              justifyContent: 'flex-end',
              paddingBottom: '16px'
            }}
            onClick={() => onSelectTab('shop')}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', textAlign: 'center', width: '100%', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Eyeglasses</div>
          </div>

          {/* Card 2: Sunglasses */}
          <div
            className="category-card"
            style={{ 
              background: `linear-gradient(to bottom, rgba(15,21,53,0) 40%, rgba(15,21,53,0.95) 100%), url('assets/category_sunglasses_1783260195132.png') center/cover no-repeat`, 
              border: '1px solid rgba(255,122,48,0.4)',
              justifyContent: 'flex-end',
              paddingBottom: '16px'
            }}
            onClick={() => onSelectTab('shop')}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', textAlign: 'center', width: '100%', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Sunglasses</div>
            <span className="badge-pill badge-orange" style={{ position: 'absolute', bottom: '-9px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', height: '18px', padding: '0 8px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', zIndex: 10 }}>NEW</span>
          </div>

          {/* Card 3: Computer */}
          <div
            className="category-card"
            style={{ 
              background: `linear-gradient(to bottom, rgba(15,21,53,0) 40%, rgba(15,21,53,0.95) 100%), url('assets/category_computer_1783260205921.png') center/cover no-repeat`, 
              border: '1px solid rgba(124,77,255,0.4)',
              justifyContent: 'flex-end',
              paddingBottom: '16px'
            }}
            onClick={() => onSelectTab('shop')}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', textAlign: 'center', width: '100%', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Computer</div>
            <span className="badge-pill badge-purple" style={{ position: 'absolute', bottom: '-9px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', height: '18px', padding: '0 8px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', zIndex: 10 }}>PRO</span>
          </div>

          {/* Card 4: Contact Lenses */}
          <div
            className="category-card"
            style={{ 
              background: `linear-gradient(to bottom, rgba(15,21,53,0) 40%, rgba(15,21,53,0.95) 100%), url('assets/category_contacts_1783260215985.png') center/cover no-repeat`, 
              border: '1px solid rgba(41,182,246,0.4)',
              justifyContent: 'flex-end',
              paddingBottom: '16px'
            }}
            onClick={() => onSelectTab('shop')}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', textAlign: 'center', width: '100%', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Contact Lenses</div>
          </div>

          {/* Card 5: Kids */}
          <div
            className="category-card"
            style={{ 
              background: `linear-gradient(to bottom, rgba(15,21,53,0) 40%, rgba(15,21,53,0.95) 100%), url('assets/category_kids_1783260226602.png') center/cover no-repeat`, 
              border: '1px solid rgba(41,182,246,0.4)',
              justifyContent: 'flex-end',
              paddingBottom: '16px'
            }}
            onClick={() => onSelectTab('shop')}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', textAlign: 'center', width: '100%', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Kids</div>
            <span className="badge-pill badge-cyan" style={{ position: 'absolute', bottom: '-9px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', height: '18px', padding: '0 8px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', zIndex: 10 }}>KIDS</span>
          </div>

          {/* Card 6: Sale */}
          <div
            className="category-card"
            style={{ 
              background: `linear-gradient(to bottom, rgba(15,21,53,0) 40%, rgba(15,21,53,0.95) 100%), url('assets/category_sale_1783260237737.png') center/cover no-repeat`, 
              border: '1px solid rgba(255,77,141,0.4)',
              justifyContent: 'flex-end',
              paddingBottom: '16px'
            }}
            onClick={() => onSelectTab('shop')}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', textAlign: 'center', width: '100%', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Sale</div>
            <span className="badge-pill badge-pink" style={{ position: 'absolute', bottom: '-9px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', height: '18px', padding: '0 8px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', zIndex: 10 }}>60% OFF</span>
          </div>
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
              style={{ height: '42px', padding: '0 20px', fontSize: '14px', background: 'linear-gradient(135deg, #FF7A30, #FF4D8D)' }}
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
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#7C4DFF', letterSpacing: '1.5px' }}>
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
            style={{ height: '44px', padding: '0 22px', fontSize: '14px', background: 'linear-gradient(135deg, #7C4DFF, #FF4D8D)' }}
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
          <i data-lucide="camera" style={{ width: '26px', height: '26px', color: '#FF4D8D' }} />
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
          <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', borderRadius: '16px 0 0 16px', background: '#7C4DFF' }} />
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
          <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', borderRadius: '16px 0 0 16px', background: '#7C4DFF' }} />
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
          <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', borderRadius: '16px 0 0 16px', background: '#7C4DFF' }} />
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
