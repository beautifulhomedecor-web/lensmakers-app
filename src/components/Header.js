// Top Header Bar Component — Exact Mobile App Layout (Image 3)
const { useState, useEffect } = React;

const Header = ({ onLogoClick, onSelectTab, onNotificationClick, onLogout, activeTab, selectedLocation = 'Hyderabad', onOpenLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => window.lucide.createIcons(), 30);
    }
  }, [isListening, searchQuery, activeTab]);



  // Sample catalog & services for live autocomplete
  const autocompleteSource = [
    { type: 'product', name: 'Aerospace Lite Titanium #101', sub: 'Eyeglasses • ₹4,999', thumb: '🕶️', tab: 'shop' },
    { type: 'product', name: 'Milan Aviator Gold #204', sub: 'Sunglasses • ₹3,499', thumb: '🥽', tab: 'shop' },
    { type: 'product', name: 'Tortoise Classic #305', sub: 'Premium • ₹3,899', thumb: '👓', tab: 'shop' },
    { type: 'product', name: 'Carbon Square #09', sub: 'Eyeglasses • ₹5,499', thumb: '🕶️', tab: 'shop' },
    { type: 'category', name: 'Eyeglasses (340+ Frames)', sub: 'Category • Blue Filter & Prescription', icon: 'glasses', tab: 'shop' },
    { type: 'category', name: 'Sunglasses (UV400 Luxury)', sub: 'Category • Polarized & Aviator', icon: 'sun', tab: 'shop' },
    { type: 'category', name: 'Contact Lenses & Care', sub: 'Category • Daily & Monthly Disposable', icon: 'eye', tab: 'shop' },
    { type: 'service', name: '3D AR Virtual Try-On', sub: 'Service • Real-time AI Face Scan', icon: 'camera', tab: 'tryon' },
    { type: 'service', name: 'Free Online Eye Check-Up', sub: 'Service • Certified Optometrist Consult', icon: 'profile' },
    { type: 'service', name: 'Lensmakers VIP Club Membership', sub: 'Service • Flat 25% Off Everything for ₹99', icon: 'award', tab: 'profile' }
  ];

  // Filter matched results
  const matchedResults = debouncedQuery
    ? autocompleteSource.filter(item =>
        item.name.toLowerCase().includes(debouncedQuery) ||
        item.sub.toLowerCase().includes(debouncedQuery)
      ).slice(0, 7)
    : [];

  const handleSelectResult = (item) => {
    setSearchQuery('');
    if (item.type === 'product') {
      window._selectedPdpName = item.name;
    }
    if (onSelectTab) onSelectTab(item.tab || 'shop');
  };

  return (
    <>
      <header
        className="top-header-wrapper dark-anchor"
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          right: 0,
          margin: 0,
          width: '100%',
          maxWidth: '100%',
          zIndex: 100,
          background: activeTab === 'home' ? '#070A13' : 'linear-gradient(180deg, #070A13 0%, #0B1026 100%)',
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          padding: activeTab === 'home' ? '16px var(--screen-padding) 4px var(--screen-padding)' : '16px var(--screen-padding) 12px var(--screen-padding)',
          transition: 'all 300ms var(--spring-bezier)'
        }}
      >
        {/* =========================================================================
            TOP HEADER ASSETS (Row 1: Hamburger, Logo, Bell per Section 1)
            ========================================================================= */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '14px' }}>
          {/* Top-left hamburger menu bars (Solid white #FFFFFF) */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('explore')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '5px',
              width: '36px',
              height: '36px',
              flexShrink: 0
            }}
            title="Menu / Explore"
          >
            <span style={{ width: '22px', height: '2.5px', background: '#FFFFFF', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '16px', height: '2.5px', background: '#FFFFFF', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '22px', height: '2.5px', background: '#FFFFFF', borderRadius: '2px', display: 'block' }} />
          </button>

          {/* Centered Logo */}
          <div onClick={onLogoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <window.Logo size={26} />
          </div>

          {/* Top-right notification bell (Solid white #FFFFFF with lime badge '2') */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {onLogout && (
              <button
                type="button"
                style={{
                  width: '32px', height: '32px', borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 200ms ease'
                }}
                onClick={onLogout}
                title="Log Out"
              >
                <i data-lucide="log-out" style={{ width: '15px', height: '15px', color: '#FFFFFF' }} />
              </button>
            )}
            <button
              type="button"
              style={{
                position: 'relative', width: '36px', height: '36px',
                borderRadius: '18px', background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => {
                setHasUnreadNotifs(false);
                if (onNotificationClick) onNotificationClick();
              }}
              title="Notifications"
            >
              <i data-lucide="bell" style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
              {hasUnreadNotifs && (
                <span
                  style={{
                    position: 'absolute', top: '-2px', right: '-2px',
                    minWidth: '18px', height: '18px', borderRadius: '9px',
                    background: '#9CCC65', color: '#000000',
                    fontSize: '11px', fontWeight: '900',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px', boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                    lineHeight: 1
                  }}
                >
                  2
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            LOCATION DROPDOWN (Centered below logo per Section 1)
            ========================================================================= */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button
            type="button"
            onClick={() => onOpenLocation && onOpenLocation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
          >
            <i data-lucide="map-pin" style={{ width: '14px', height: '14px', color: '#FFFFFF' }} />
            <span>{selectedLocation || 'Hyderabad'}</span>
            <i data-lucide="chevron-down" style={{ width: '14px', height: '14px', color: '#FFFFFF' }} />
          </button>
        </div>
      </header>

      {/* STANDALONE SEARCH BAR (Scrolls with page, shown on Explore/Shop tabs) */}
      {activeTab !== 'home' && (
        <div className="standalone-search-container fade-up-item" style={{ padding: '0 20px', marginTop: '6px', marginBottom: '24px', position: 'relative', zIndex: 90 }}>
          <div style={{ position: 'relative', width: '100%', height: '48px', display: 'flex', alignItems: 'center' }}>
            <i
              data-lucide="search"
              style={{
                position: 'absolute', left: '16px', width: '18px', height: '18px',
                color: '#FF7A30', pointerEvents: 'none', zIndex: 2
              }}
            />
            <input
              type="text"
              style={{
                width: '100%',
                height: '48px',
                paddingLeft: '44px',
                paddingRight: searchQuery ? '110px' : '82px',
                margin: 0,
                borderRadius: '999px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: isListening ? '1.5px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                outline: 'none',
            boxShadow: isListening ? '0 0 16px rgba(0, 229, 255, 0.3), inset 0 2px 4px rgba(0,0,0,0.2)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 280ms var(--spring-bezier)'
          }}
          placeholder={isListening ? "🎙️ Listening for voice commands..." : "Search eyeglasses, sunglasses, brands"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            style={{
              position: 'absolute', right: '84px', width: '22px', height: '22px',
              borderRadius: '11px', background: 'rgba(255,255,255,0.18)', border: 'none',
              color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', zIndex: 3
            }}
            onClick={() => setSearchQuery('')}
            title="Clear Search"
          >
            ✕
          </button>
        )}

        {/* Voice Search Microphone Icon Button */}
        <button
          className="liquid-btn"
          style={{
            position: 'absolute', right: '50px', top: '8px', width: '32px', height: '32px',
            borderRadius: '16px',
            background: isListening ? 'linear-gradient(135deg, #FF4D8D 0%, #00E5FF 100%)' : 'linear-gradient(135deg, rgba(0, 229, 255, 0.22) 0%, rgba(255, 77, 141, 0.22) 100%)',
            border: isListening ? '1.5px solid #FFFFFF' : '1px solid rgba(0, 229, 255, 0.55)',
            boxShadow: isListening ? '0 0 18px rgba(0, 229, 255, 0.9)' : '0 0 10px rgba(0, 229, 255, 0.35)',
            color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 280ms var(--spring-bezier)', zIndex: 3,
            animation: isListening ? 'breatheGlow 1.5s infinite ease-in-out' : 'none'
          }}
          onClick={() => {
            const nextListening = !isListening;
            setIsListening(nextListening);
            if (nextListening) {
              setVoiceTranscript('🎙️ Listening... Say an eyewear brand, style, or command');
              setTimeout(() => {
                if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
              }, 20);
              setTimeout(() => setVoiceTranscript('“Show Titanium Aviators...”'), 1600);
              setTimeout(() => {
                setSearchQuery('titanium');
                setIsListening(false);
                setVoiceTranscript('');
              }, 3400);
            } else {
              setVoiceTranscript('');
            }
          }}
          title="Voice Search Navigation"
        >
          <i data-lucide="mic" style={{ width: '16px', height: '16px', color: isListening ? '#FFFFFF' : '#00E5FF', transition: 'color 200ms ease' }} />
        </button>

        {/* Right side: notification bell in its own glass-circle (36px diameter) positioned 8px from right inside the bar */}
        <button
          className="liquid-btn"
          style={{
            position: 'absolute', right: '8px', top: '6px', width: '36px', height: '36px',
            borderRadius: '18px', background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 3
          }}
          onClick={() => {
            setHasUnreadNotifs(false);
            if (onNotificationClick) onNotificationClick();
          }}
          title="Notifications"
        >
          <i data-lucide="bell" style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
          {hasUnreadNotifs && (
            <span
              style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '8px', height: '8px', borderRadius: '4px',
                background: '#FF4D8D', boxShadow: '0 0 8px rgba(255,77,141,0.9)'
              }}
            />
          )}
        </button>
      </div>

      {/* AI VOICE NAVIGATION HUD OVERLAY */}
      {isListening && (
        <div 
          className="voice-search-hud fade-up-item"
          style={{
            position: 'absolute', top: '100%', left: 'var(--screen-padding)', right: 'var(--screen-padding)',
            background: 'linear-gradient(135deg, rgba(15, 21, 53, 0.98) 0%, rgba(27, 31, 74, 0.98) 100%)',
            border: '1.5px solid #00E5FF', borderRadius: '18px', padding: '16px', marginTop: '10px',
            boxShadow: '0 16px 48px rgba(0, 229, 255, 0.3), 0 8px 24px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(30px)', zIndex: 300, animation: 'screenFadeSlideIn 300ms forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00E5FF', fontWeight: '800', fontSize: '12px', letterSpacing: '0.6px' }}>
              AI VOICE NAVIGATION ACTIVE
            </div>
            <button
              onClick={() => setIsListening(false)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#A0A4C8', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: '14px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', textAlign: 'center', fontWeight: '700', marginBottom: '14px', border: '1px dashed rgba(0, 229, 255, 0.4)', boxShadow: 'inset 0 2px 8px rgba(0, 229, 255, 0.15)' }}>
            {voiceTranscript || '🎙️ Listening... Say your command'}
          </div>
          <div style={{ fontSize: '11px', color: '#A0A4C8', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Try saying or tapping an instant voice command:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { label: '🕶️ "Show Titanium Aviators"', query: 'titanium' },
              { label: '👓 "Try on Blue Light glasses"', tab: 'tryon' },
              { label: '👑 "Join ₹99 VIP Club"', tab: 'profile' },
              { label: '📍 "Find Nearby Stores"', tab: 'home' }
            ].map((cmd, i) => (
              <button
                key={i}
                style={{
                  padding: '8px 14px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)', color: '#FFFFFF', fontSize: '12px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 200ms ease', display: 'flex', alignItems: 'center', gap: '6px'
                }}
                onClick={() => {
                  setIsListening(false);
                  if (cmd.tab && onSelectTab) onSelectTab(cmd.tab);
                  else if (cmd.query) setSearchQuery(cmd.query);
                }}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LIVE AUTOCOMPLETE DROPDOWN */}
      {debouncedQuery.length > 0 && (
        <div 
          className="autocomplete-dropdown"
          style={{
            position: 'absolute', top: '100%', left: 'var(--screen-padding)', right: 'var(--screen-padding)',
            background: '#0F1535',
            border: '1px solid #00E5FF',
            borderRadius: '16px',
            marginTop: '8px',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 229, 255, 0.35)',
            overflow: 'hidden',
            zIndex: 999999
          }}
        >
          <div style={{ padding: '8px 16px', fontSize: '11px', color: '#6B6E9A', fontWeight: '700', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            SEARCH RESULTS FOR "{debouncedQuery.toUpperCase()}"
          </div>
          {matchedResults.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#A0A4C8', fontSize: '13px' }}>
              No exact matches found. Try searching for "Titanium", "VIP", or "Try-On".
            </div>
          ) : (
            matchedResults.map((item, index) => (
              <div
                key={index}
                className="autocomplete-item fade-up-item"
                style={{ 
                  padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: index < matchedResults.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectResult(item)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.thumb ? (
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {item.thumb}
                    </div>
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(30,136,229,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E88E5', fontWeight: 'bold' }}>
                      ★
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#A0A4C8' }}>{item.sub}</div>
                  </div>
                </div>
                <span style={{ fontSize: '14px', color: '#FF7A30', fontWeight: '700' }}>→</span>
              </div>
            ))
          )}
        </div>
      )}
      </div>
      )}
    </>
  );
};

window.Header = Header;
