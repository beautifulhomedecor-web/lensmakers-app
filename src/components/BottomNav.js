// Bottom Navigation Bar Component — Section 11 (Floating Tablet Capsule Dock with Liquid Animation & No Cart Badge)
const { useState, useEffect } = React;

const BottomNav = ({ activeTab, onSelectTab, cartCount = 2 }) => {
  const [pressedTabId, setPressedTabId] = useState(null);
  const [liquidAnim, setLiquidAnim] = useState(false);

  // Map sub-routes / detail screens to their primary navigation tab (Part A6)
  const getMainTabId = (route) => {
    if (['home', 'stores', 'eyetest', 'membership', 'welcomeclub', 'manageclub'].includes(route)) return 'home';
    if (['shop'].includes(route)) return 'shop';
    if (['tryon'].includes(route)) return 'tryon';
    if (['cart', 'trackorder'].includes(route)) return 'cart';
    if (['profile', 'prescription', 'rx_add', 'rx_checkout', 'settings', 'trackappt'].includes(route)) return 'profile';
    return route;
  };

  const activeMainTab = getMainTabId(activeTab);

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'shop', label: 'Shop', icon: 'glasses' },
    { id: 'tryon', label: 'AI Try-On', icon: 'camera', isCenter: true },
    { id: 'cart', label: 'Cart', icon: 'shopping-cart', badge: cartCount > 0 ? cartCount : 2 }, // Clearly display item count!
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  useEffect(() => {
    setLiquidAnim(true);
    const timer = setTimeout(() => setLiquidAnim(false), 600);
    return () => clearTimeout(timer);
  }, [activeMainTab]);

  // Only run icon creation when the active main tab changes (NEVER on click/press animation ticks to prevent icon flickering/flashing!)
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
      setTimeout(() => {
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
      }, 15);
    }
  }, [activeMainTab]);

  const handleTabClick = (tabId) => {
    setPressedTabId(tabId);
    setTimeout(() => setPressedTabId(null), 250);
    if (onSelectTab) onSelectTab(tabId);
  };

  const handleTryOnTap = () => {
    setPressedTabId('tryon');
    setTimeout(() => setPressedTabId(null), 250);
    if (onSelectTab) onSelectTab('tryon');
  };

  return (
    <nav className={`bottom-nav nav-visible ${liquidAnim ? 'liquid-morph-bar' : ''} ${pressedTabId ? 'liquid-pulse' : ''}`}>
      {tabs.map((tab) => {
        const isActive = activeMainTab === tab.id;
        const isPressed = pressedTabId === tab.id;

        // CENTER RAISED BUTTON (AI TRY-ON - Protrudes above capsule with AI Radar Halo & Pedestal)
        if (tab.isCenter) {
          return (
            <div
              key={tab.id}
              className={`nav-center-tryon-wrapper ${isActive ? 'active' : ''}`}
              style={{
                transform: isPressed ? 'scale(0.88)' : 'scale(1)',
                transition: 'transform 280ms var(--spring-bezier)'
              }}
              onClick={handleTryOnTap}
            >
              <div className="tryon-dock-pedestal" />
              <div className="tryon-radar-ring" />
              <div className="nav-center-tryon-btn">
                <i data-lucide="camera" style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
              </div>
            </div>
          );
        }

        // STANDARD TABS (Home, Shop, Cart, Profile)
        return (
          <div
            key={tab.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={{
              transform: isPressed ? 'scale(0.88)' : 'scale(1)',
              transition: 'transform 280ms var(--spring-bezier)'
            }}
            onClick={() => handleTabClick(tab.id)}
          >
            <div className="nav-item-pill">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justify: 'center' }}>
                <i
                  data-lucide={tab.icon}
                  className="nav-icon"
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isActive ? '#FF4D8D' : '#A0A4C8',
                    transition: 'transform 350ms var(--spring-bezier), color 200ms ease',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    flexShrink: 0
                  }}
                />
                {tab.badge > 0 && (
                  <span
                    className="nav-badge"
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      background: 'linear-gradient(135deg, #FF4D8D 0%, #FF0055 100%)',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: '900',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '9px',
                      padding: '0 4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(255, 77, 141, 0.85), 0 0 0 2px #0F1535',
                      zIndex: 10,
                      animation: 'breatheGlow 2s infinite ease-in-out'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="nav-label">
                {tab.label}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

window.BottomNav = BottomNav;
