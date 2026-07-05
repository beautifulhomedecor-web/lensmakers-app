// Splash Screen Component — Section 4
const { useState, useEffect } = React;

const Splash = ({ onFinish }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // After 1.7s, start fade out animation (300ms) so total time is exactly 2.0s
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1700);

    // After 2.0s total, trigger onFinish callback to remove splash and show Home/Onboarding
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2000);

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
        pointerEvents: fadingOut ? 'none' : 'auto'
      }}
    >
      <div className="splash-logo-wrap">
        <div className="splash-glow-behind" />
        {/* Full logo: icon + wordmark */}
        <window.Logo size={42} iconOnly={false} />
      </div>

      <div className="splash-tagline">
        See Clearly. Look Great.
      </div>
    </div>
  );
};

window.Splash = Splash;
