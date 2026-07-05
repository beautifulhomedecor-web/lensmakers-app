// UI Primitives & Apple-like Animation System — Section 3
const { useState, useEffect, useRef } = React;

// 1. NUMBER COUNT-UP (Odometer feel over 600ms)
const AnimatedNumber = ({ value, prefix = "", suffix = "", duration = 600 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimestamp = useRef(null);
  const startValue = useRef(0);

  useEffect(() => {
    startValue.current = displayValue;
    startTimestamp.current = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp.current) startTimestamp.current = timestamp;
      const progress = Math.min((timestamp - startTimestamp.current) / duration, 1);
      // Apple easeOutCubic: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue.current + (value - startValue.current) * easeProgress);
      
      setDisplayValue(current);
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return (
    <span style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{displayValue.toLocaleString('en-IN')}{suffix}
    </span>
  );
};

// 2. SKELETON LOADING SHIMMER
const Skeleton = ({ width = '100%', height = '20px', borderRadius = '12px', style = {} }) => {
  return (
    <div
      className="skeleton-box"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

// 3. SUCCESS CHECKMARK ANIMATION
const SuccessCheckmark = ({ size = 80, onComplete }) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <div className="success-checkmark-container" style={{ width: size, height: size }}>
      <div className="success-glow-burst" />
      <svg className="checkmark-svg" viewBox="0 0 52 52">
        <circle className="checkmark-circle" cx="26" cy="26" r="24" />
        <path className="checkmark-check" d="M14 27 l7 7 l16 -16" />
      </svg>
    </div>
  );
};

// 4. GLASS CARD WRAPPER
const GlassCard = ({ variant = 'standard', className = "", style = {}, children, onClick, tappable = false }) => {
  const variantClass = `glass-card-${variant}`;
  const tapClass = (onClick || tappable) ? "tappable" : "";

  const handleClick = (e) => {
    if (onClick) {
      // Trigger brief glow pulse
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
      ripple.style.margin = `-${Math.max(rect.width, rect.height) / 2}px`;
      
      card.appendChild(ripple);
      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      }, 400);

      onClick(e);
    }
  };

  return (
    <div
      className={`${variantClass} ${tapClass} ${className}`}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

// 5. PILL BUTTON WRAPPER
const PillButton = ({ variant = 'primary', className = "", style = {}, children, onClick, icon: Icon, disabled = false, type = "button" }) => {
  const btnClass = `btn-${variant}-pill`;

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
      ripple.style.margin = `-${Math.max(rect.width, rect.height) / 2}px`;
      
      btn.appendChild(ripple);
      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      }, 400);

      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`${btnClass} ${className}`}
      style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto', ...style }}
      onClick={handleClick}
      disabled={disabled}
    >
      {Icon && <Icon size={18} strokeWidth={2.2} />}
      <span>{children}</span>
    </button>
  );
};

// 6. MODAL BOTTOM SHEET WRAPPER
const ModalSheet = ({ isOpen, onClose, title, children }) => {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    } else if (visible) {
      // Trigger exit animation, then unmount
      setClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setClosing(false);
        setVisible(false);
      }, 280);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div
      className={`modal-backdrop ${closing ? 'closing' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={`modal-sheet ${closing ? 'closing' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.25)' }} />
        </div>
        
        {title && (
          <div className="flex-between mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <h3 className="section-heading" style={{ fontSize: '18px' }}>{title}</h3>
            <div className="icon-btn-circle" onClick={handleClose} style={{ width: '32px', height: '32px' }}>
              <i data-lucide="x" style={{ width: '18px', height: '18px' }}>✕</i>
            </div>
          </div>
        )}

        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

window.AnimatedNumber = AnimatedNumber;
window.Skeleton = Skeleton;
window.SuccessCheckmark = SuccessCheckmark;
window.GlassCard = GlassCard;
window.PillButton = PillButton;
window.ModalSheet = ModalSheet;

// 7. SLEEK BRANDED ERROR BOUNDARY (Prompt 10 Part D)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Lens Makers Optical Glitch Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', textAlign: 'center', background: '#0F1535' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'rgba(255, 77, 141, 0.15)', border: '2px solid rgba(255, 77, 141, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', marginBottom: '20px', boxShadow: '0 0 30px rgba(255, 77, 141, 0.3)' }}>
            ⚠️
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
            We encountered an optical glitch.
          </h2>
          <p style={{ fontSize: '14px', color: '#A0A4C8', maxWidth: '320px', lineHeight: '1.5', marginBottom: '24px' }}>
            Don't worry, your cart and membership status are safe. Let's get your vision back in focus.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-primary-pill"
              style={{ height: '44px', padding: '0 24px', fontSize: '14px', background: 'linear-gradient(135deg, #7C4DFF, #FF4D8D)' }}
              onClick={() => window.location.reload()}
            >
              Reload Lens Makers
            </button>
            <button
              type="button"
              className="btn-secondary-pill"
              style={{ height: '44px', padding: '0 24px', fontSize: '14px', borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }}
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReturnHome) {
                  this.props.onReturnHome();
                } else {
                  window.location.href = '/';
                }
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

window.ErrorBoundary = ErrorBoundary;

