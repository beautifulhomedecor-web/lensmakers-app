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
  const [user, setUser] = useState(null); // Default to null to enforce strict authentication policy
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1400);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('lensmakers_token');
      localStorage.removeItem('guest_mode');
      localStorage.removeItem('user_session');
      window.userIsMember = false;
    } catch (e) {}
    setUser(null);
    setShowAuthModal(true);
  };

  // Enforce strict authentication policy on startup & disable auto-login from shared links
  useEffect(() => {
    try {
      const urlSearch = window.location.search || '';
      const urlHash = window.location.hash || '';
      const isSharedLink = urlSearch.length > 1 || urlHash.includes('share') || urlHash.includes('ref') || urlHash.includes('product');
      
      // If accessed via shared link or query param, strictly disable automatic login / guest persistence!
      if (isSharedLink) {
        localStorage.removeItem('lensmakers_token');
        localStorage.removeItem('guest_mode');
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

      const token = localStorage.getItem('lensmakers_token');
      const guest = localStorage.getItem('guest_mode');
      const isComplete = localStorage.getItem('onboardingComplete');

      if (!token && !guest) {
        setUser(null); // Enforce no automatic login on new devices or shared links
        setShowAuthModal(true);
      } else if (guest) {
        setUser({ name: 'Guest User', member: false, isGuest: true });
        window.userIsMember = false;
      } else {
        setUser({ name: 'Alex Rivera', member: true });
        window.userIsMember = true;
      }

      if (!isComplete) {
        setShowOnboarding(true);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
      setShowAuthModal(true);
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
            try { localStorage.setItem('lensmakers_token', 'valid_token_' + Date.now()); } catch(e) {}
            setUser(userData);
            window.userIsMember = userData.member !== false;
            setShowAuthModal(false);
            setActiveTab('home');
          }}
          onExploreGuest={() => {
            try { localStorage.setItem('guest_mode', 'true'); } catch(e) {}
            setUser({ name: 'Guest User', member: false, isGuest: true });
            window.userIsMember = false;
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
              onLogout={handleLogout}
              activeTab={activeTab}
              selectedLocation={selectedLocation}
              onOpenLocation={() => setShowLocationModal(true)}
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
                selectedLocation={selectedLocation}
                onOpenLocation={() => setShowLocationModal(true)}
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
                  onLogout={handleLogout}
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
                  onLogout={handleLogout}
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

      {/* GLOBAL LOCATION SELECTOR MODAL */}
      {showLocationModal && (
        <div className="modal-backdrop" onClick={() => setShowLocationModal(false)} style={{ zIndex: 99999 }}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ background: '#FAFAF9', color: '#1C1917', zIndex: 100000 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1C1917', margin: 0 }}>Select Delivery Location</h3>
              <button
                style={{ background: 'transparent', border: 'none', color: '#64748B', fontSize: '20px', cursor: 'pointer' }}
                onClick={() => setShowLocationModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                'Hyderabad, Telangana (Default)',
                'Bangalore, Karnataka • Indiranagar 100ft Rd',
                'Mumbai, Maharashtra • Bandra West',
                'New Delhi, NCR • Connaught Place',
                'Chennai, Tamil Nadu • T. Nagar'
              ].map((loc, idx) => (
                <div
                  key={idx}
                  className="glass-card-standard"
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: selectedLocation.startsWith(loc.split(' ')[0]) ? 'rgba(156, 204, 101, 0.15)' : '#FFFFFF',
                    border: selectedLocation.startsWith(loc.split(' ')[0]) ? '1.5px solid #9CCC65' : '1px solid #EAEAEA',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onClick={() => {
                    setSelectedLocation(loc.split(' (')[0]);
                    setShowLocationModal(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i data-lucide="map-pin" style={{ width: '18px', height: '18px', color: selectedLocation.startsWith(loc.split(' ')[0]) ? '#9CCC65' : '#64748B' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1C1917' }}>{loc}</span>
                  </div>
                  {selectedLocation.startsWith(loc.split(' ')[0]) && (
                    <span style={{ background: '#9CCC65', color: '#000000', fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '999px' }}>ACTIVE</span>
                  )}
                </div>
              ))}
            </div>

            <button
              className="btn-primary-pill"
              style={{ width: '100%', background: '#FFF5EC', color: '#FFFFFF', border: 'none', height: '48px', borderRadius: '999px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              onClick={() => {
                alert('📍 GPS Auto-detection enabled! Using current device coordinates.');
                setShowLocationModal(false);
              }}
            >
              📍 Use Current GPS Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
