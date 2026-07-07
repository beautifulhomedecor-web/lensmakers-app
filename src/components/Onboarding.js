// Onboarding Flow Component — Section 5 (3 Screens, touch/swipe support, animated SVG illustrations)
const { useState, useRef } = React;

const Onboarding = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('next');
  const touchStartX = useRef(null);

  const slides = [
    {
      id: 'ar-tryon',
      heading: 'Try On Frames Instantly',
      subtext: 'Use our AI-powered AR Try-On to see exactly how any frame looks on your face — no store visit needed.',
      illustration: (
        <div className="onboarding-illustration-box">
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* AR Scan Brackets */}
            <path d="M 40 70 L 40 40 L 70 40" stroke="#FF7873" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 180 70 L 180 40 L 150 40" stroke="#FF7873" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 40 150 L 40 180 L 70 180" stroke="#FF7873" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 180 150 L 180 180 L 150 180" stroke="#FF7873" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Face Outline Line-art */}
            <ellipse cx="110" cy="115" rx="50" ry="60" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6 6" opacity="0.6" />
            {/* Stylish Eyeglasses on Face */}
            <g transform="translate(68, 95)">
              <rect x="0" y="0" width="36" height="26" rx="8" stroke="#FF7873" strokeWidth="3.5" fill="rgba(226,47,128, 0.15)" />
              <rect x="48" y="0" width="36" height="26" rx="8" stroke="#1E88E5" strokeWidth="3.5" fill="rgba(30, 136, 229, 0.15)" />
              <path d="M 36 10 C 42 6, 44 6, 48 10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <path d="M -14 6 L 0 8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <path d="M 84 8 L 98 6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Scanning Laser Line */}
            <line x1="50" y1="110" x2="170" y2="110" stroke="#29B6F6" strokeWidth="2" strokeDasharray="4 4">
              <animate attributeName="y1" values="60;160;60" dur="3s" repeatCount="indefinite" />
              <animate attributeName="y2" values="60;160;60" dur="3s" repeatCount="indefinite" />
            </line>
          </svg>
        </div>
      )
    },
    {
      id: 'membership',
      heading: '25% Off Everything, Always',
      subtext: 'Join Lens Makers Club for just ₹99/month and get flat 25% off on all eyewear, every single order.',
      illustration: (
        <div className="onboarding-illustration-box">
          {/* Stylized Glass Membership Card */}
          <div
            className="glass-card-glow-purple"
            style={{
              width: '230px',
              height: '145px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(129,64,220, 0.4) 0%, rgba(255,240,224, 0.8) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '18px',
              boxShadow: '0 12px 36px rgba(129,64,220, 0.3)',
              transform: 'rotate(-4deg)'
            }}
          >
            <div className="flex-between">
              <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', color: '#FFFFFF' }}>LENS MAKERS CLUB</span>
              <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>ACTIVE</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#FF7873', textShadow: '0 0 12px rgba(226,47,128,0.5)' }}>FLAT 25% OFF</div>
              <div style={{ fontSize: '11px', color: '#A0A4C8', marginTop: '4px' }}>VIP ALL-ACCESS PASS • ₹99/MO</div>
            </div>
            <div className="flex-between" style={{ fontSize: '10px', color: '#6B6E9A' }}>
              <span>MEMBER SINCE 2026</span>
              <span>★★★★★</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'checkup',
      heading: 'Check Your Vision From Home',
      subtext: 'Book a FREE online eye check-up with our certified optometrists. Get your prescription delivered digitally.',
      illustration: (
        <div className="onboarding-illustration-box">
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Laptop outline */}
            <rect x="40" y="55" width="140" height="95" rx="10" stroke="#FFFFFF" strokeWidth="3" fill="rgba(255,235,210, 0.6)" />
            <path d="M 25 150 L 195 150 L 205 165 C 205 168, 202 170, 198 170 L 22 170 C 18 170, 15 168, 15 165 L 25 150 Z" fill="#ECEAE3" stroke="#FFFFFF" strokeWidth="2" />
            {/* Eye Icon on screen */}
            <g transform="translate(110, 102)">
              <path d="M -35 0 C -20 -22, 20 -22, 35 0 C 20 22, -20 22, -35 0 Z" stroke="#29B6F6" strokeWidth="3.5" fill="rgba(41, 182, 246, 0.15)" />
              <circle cx="0" cy="0" r="12" stroke="#FF7873" strokeWidth="3" fill="#F4F3EF" />
              <circle cx="0" cy="0" r="5" fill="#29B6F6" />
            </g>
            {/* Free badge */}
            <g transform="translate(160, 45)">
              <rect x="-25" y="-12" width="50" height="24" rx="12" fill="#43A047" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle">FREE</text>
            </g>
          </svg>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection('next');
      setCurrentSlide(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('onboardingComplete', 'true');
    } catch (e) {
      console.warn('LocalStorage not accessible', e);
    }
    if (onComplete) onComplete();
  };

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 50 && currentSlide > 0) {
      // Swipe Right -> previous slide
      setDirection('prev');
      setCurrentSlide(prev => prev - 1);
    } else if (diffX < -50 && currentSlide < slides.length - 1) {
      // Swipe Left -> next slide
      setDirection('next');
      setCurrentSlide(prev => prev + 1);
    }
    touchStartX.current = null;
  };

  const currentData = slides[currentSlide];

  return (
    <div
      className="onboarding-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar with Skip link */}
      <div className="onboarding-top-bar">
        <span className="skip-link" onClick={handleFinish}>
          Skip
        </span>
      </div>

      {/* Center Animated Slide Area */}
      <div
        key={currentSlide}
        className="onboarding-slide-area"
        style={{
          animation: direction === 'next' ? 'slideInRight 350ms var(--spring-bezier)' : 'slideInLeft 350ms var(--spring-bezier)'
        }}
      >
        {currentData.illustration}

        <h1 className="onboarding-heading">
          {currentData.heading}
        </h1>

        <p className="onboarding-subtext">
          {currentData.subtext}
        </p>
      </div>

      {/* Bottom Bar: Dots & Buttons */}
      <div className="onboarding-bottom-bar">
        <div className="page-dots">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`page-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => {
                setDirection(idx > currentSlide ? 'next' : 'prev');
                setCurrentSlide(idx);
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>

        <div style={{ width: '100%', maxWidth: '280px' }}>
          {currentSlide < slides.length - 1 ? (
            <button
              type="button"
              className="btn-secondary-pill"
              style={{
                width: '100%',
                borderColor: 'rgba(226,47,128, 0.5)',
                color: '#FF7873',
                boxShadow: '0 0 15px rgba(226,47,128, 0.15)'
              }}
              onClick={handleNext}
            >
              <span>Next</span>
              <span style={{ fontSize: '18px', marginLeft: '4px' }}>→</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary-pill"
              style={{ width: '100%' }}
              onClick={handleFinish}
            >
              <span>Get Started</span>
              <span style={{ fontSize: '18px', marginLeft: '4px' }}>🚀</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

window.Onboarding = Onboarding;
