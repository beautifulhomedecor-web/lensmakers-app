// Splash Screen Component — Section 4
const { useState, useEffect } = React;

const Splash = ({ onFinish }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Ultra-fast 1.0s launch time (fade out starts at 750ms for 250ms smooth exit)
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 750);

    // After exactly 1.0s, trigger onFinish callback to reveal the app instantly
    const finishTimer = setTimeout(() => {
      if (typeof onFinish === 'function') {
        try {
          onFinish();
        } catch (e) {
          console.warn('Splash onFinish error:', e);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className="splash-container"
      style={{
        opacity: fadingOut ? 0 : 1,
        pointerEvents: fadingOut ? 'none' : 'auto',
        transition: 'opacity 250ms ease'
      }}
    >
      <div className="splash-logo-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 2 }}>
        <div className="splash-glow-behind" />
        {/* Full logo: icon + wordmark */}
        <window.Logo size={52} iconOnly={false} />
      </div>

      <div className="splash-company-branding" style={{ 
        marginTop: '24px', 
        textAlign: 'center', 
        opacity: 0, 
        transform: 'translate3d(0, 12px, 0)', 
        animation: 'splashTaglineFade 400ms var(--spring-primary) 150ms both',
        zIndex: 2
      }}>
        <div style={{ 
          fontSize: '13px', 
          fontWeight: 800, 
          letterSpacing: '3.5px', 
          color: '#A0A4C8', 
          textTransform: 'uppercase', 
          marginBottom: '6px'
        }}>
          LENS MAKERS® COMPANY
        </div>
        <div className="splash-tagline" style={{ marginTop: 0, fontSize: '15px', color: '#FFFFFF', fontWeight: 500, letterSpacing: '0.5px' }}>
          See Clearly. Look Great.
        </div>
      </div>
    </div>
  );
};

window.Splash = Splash;
