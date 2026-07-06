// Lens Makers Main Application Orchestrator — Prompt 1 App Shell & Foundation
const { useState, useEffect } = React;

window.App = function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState('home'); // home, shop, tryon, cart, profile
  const [prevTab, setPrevTab] = useState('home');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Flow states
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState({ name: 'Alex Rivera', member: true });

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1400);
  };

  // Check localStorage for onboarding and auth on startup
  useEffect(() => {
    try {
      const isComplete = localStorage.getItem('onboardingComplete');
      if (!isComplete) {
        setShowOnboarding(true);
      } else {
        const token = localStorage.getItem('lensmakers_token');
        const guest = localStorage.getItem('guest_mode');
        if (!token && !guest) {
          setShowAuthModal(true);
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Lucide icons re-initializer whenever tab changes
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => {
        window.lucide.createIcons();
      }, 50);
    }
  }, [activeTab, showSplash, showOnboarding, showAuthModal]);

  const handleSelectTab = (tabId) => {
    setPrevTab(activeTab);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelectorAll('.screen-container, .screen-transition-enter').forEach(c => {
      c.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const container = document.querySelector('.screen-container') || document.querySelector('.screen-transition-enter');
    document.querySelectorAll('.screen-container, .screen-transition-enter').forEach(c => {
      c.scrollTo({ top: 0, behavior: 'instant' });
    });
    if (container) {
      if (window.EdgeSwipeBack && !container._edgeSwipeBound) {
        new window.EdgeSwipeBack(container, () => {
          if (prevTab) handleSelectTab(prevTab);
        });
        container._edgeSwipeBound = true;
      }
      if (window.PullToRefresh && !container._ptrBound) {
        new window.PullToRefresh(container, (done) => {
          handleRefresh();
          setTimeout(done, 1200);
        });
        container._ptrBound = true;
      }
    }
    setTimeout(() => {
      if (window.initListAnimations) window.initListAnimations();
    }, 100);
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSplashFinish = () => {
    setShowSplash(false);
    // If onboarding is not complete, show Onboarding next, else go straight to Home
    if (!showOnboarding) {
      // User is ready
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Transition to login/signup screen as required by Section 5
    setShowAuthModal(true);
  };

  const handleReplaySplash = () => {
    setShowSplash(true);
  };

  const handleReplayOnboarding = () => {
    setShowOnboarding(true);
  };

  return (
    <div className="app-shell">
      {/* 1. AMBIENT BACKGROUND GLOW BLOBS (Prompt 4 Section 4) */}
      {/* Only use .glow-blob-N classes — the old .ambient-blob-1/2 still exist but
          are now redundant; the new glow-blob classes have richer multi-point drift animations */}
      <div className="ambient-container">
        <div className="glow-blob glow-blob-1" />
        <div className="glow-blob glow-blob-2" />
        <div className="glow-blob glow-blob-3" />
      </div>

      {/* 2. SPLASH SCREEN (Section 4) */}
      {showSplash && (
        <window.Splash onFinish={handleSplashFinish} />
      )}

      {/* 3. ONBOARDING FLOW (Section 5) */}
      {!showSplash && showOnboarding && (
        <window.Onboarding onComplete={handleOnboardingComplete} />
      )}

      {/* 4. LOGIN / SIGNUP SCREEN AFTER ONBOARDING */}
      {!showSplash && !showOnboarding && showAuthModal && (
        <window.AuthModal
          onLoginSuccess={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
            setActiveTab('home');
          }}
          onExploreGuest={() => {
            try { localStorage.setItem('guest_mode', 'true'); } catch(e) {}
            setShowAuthModal(false);
            setActiveTab('home');
          }}
        />
      )}

      {/* 5. MAIN APP SHELL (Section 6) */}
      {!showSplash && !showOnboarding && !showAuthModal && (
        <>
          {/* Scrollable Screen Container */}
          <main className="screen-container">
            {/* Top Header */}
            <div 
              className="top-header-outer-wrapper"
              onClick={handleRefresh} 
              title="Double click header or pull down to refresh content"
              style={{ display: 'contents' }}
            >
              <window.Header
                onLogoClick={() => handleSelectTab('home')}
                onSelectTab={handleSelectTab}
                onNotificationClick={() => alert('🔔 No new notifications. Your ₹99 Club membership is active!')}
              />
            </div>

            {/* PULL TO REFRESH is handled natively by PullToRefresh class in spring.js */}
            {/* The native PTR indicator appears above the scroll container automatically */}
            <window.ErrorBoundary onReturnHome={() => handleSelectTab('home')}>
              {activeTab === 'home' && (
                <window.HomeScreen
                  onSelectTab={handleSelectTab}
                  onReplaySplash={handleReplaySplash}
                  onReplayOnboarding={handleReplayOnboarding}
                  onOpenAuth={() => setShowAuthModal(true)}
                />
              )}
              {activeTab === 'shop' && (
                <window.ShopScreen onSelectTab={handleSelectTab} />
              )}
              {activeTab === 'tryon' && (
                <window.TryOnScreen onSelectTab={handleSelectTab} />
              )}
              {activeTab === 'cart' && (
                <window.CartScreen onSelectTab={handleSelectTab} />
              )}
              {activeTab === 'profile' && (
                <window.ProfileScreen
                  onLogout={() => setShowAuthModal(true)}
                  onReplayOnboarding={handleReplayOnboarding}
                  onSelectTab={handleSelectTab}
                />
              )}
              {activeTab === 'eyetest' && (
                <window.EyeCheckupScreen onSelectTab={handleSelectTab} initialViewMode="landing" />
              )}
              {activeTab === 'trackorder' && (
                <window.EyeCheckupScreen onSelectTab={handleSelectTab} initialViewMode="order_tracking" />
              )}
              {activeTab === 'trackappt' && (
                <window.EyeCheckupScreen onSelectTab={handleSelectTab} initialViewMode="appointment_tracking" />
              )}
              {activeTab === 'membership' && (
                <window.MembershipScreen onSelectTab={handleSelectTab} initialViewMode="landing" />
              )}
              {activeTab === 'manageclub' && (
                <window.MembershipScreen onSelectTab={handleSelectTab} initialViewMode="manage" />
              )}
              {activeTab === 'welcomeclub' && (
                <window.MembershipScreen onSelectTab={handleSelectTab} initialViewMode="welcome" />
              )}
              {activeTab === 'prescription' && (
                <window.PrescriptionScreen onSelectTab={handleSelectTab} initialViewMode="list" />
              )}
              {activeTab === 'rx_add' && (
                <window.PrescriptionScreen onSelectTab={handleSelectTab} initialViewMode="add" />
              )}
              {activeTab === 'rx_checkout' && (
                <window.PrescriptionScreen onSelectTab={handleSelectTab} initialViewMode="checkout_demo" />
              )}
              {activeTab === 'stores' && (
                <window.StoreLocatorScreen onSelectTab={handleSelectTab} />
              )}
              {activeTab === 'settings' && (
                <window.ProfileScreen
                  onLogout={() => setShowAuthModal(true)}
                  onReplayOnboarding={handleReplayOnboarding}
                  onSelectTab={handleSelectTab}
                  initialViewMode="settings"
                />
              )}
            </window.ErrorBoundary>
          </main>

          {/* Persistent Fixed Bottom Navigation Bar (Hidden during immersive Try-On Studio) */}
          {activeTab !== 'tryon' && (
            <window.BottomNav
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              cartCount={2}
            />
          )}
        </>
      )}
    </div>
  );
};
