// Store Locator Screen Component — Prompt 9 Part A (Complete Feature)
const { useState, useEffect, useMemo } = React;

const STORES_DATA = [
  {
    id: 'store-1',
    name: 'Lens Makers Flagship Studio',
    city: 'Bengaluru',
    area: 'Indiranagar 100ft Road',
    pincode: '560038',
    address: 'Plot 42, Ground Floor, 100ft Road, Metro Pillar 54, Indiranagar, Bengaluru, Karnataka 560038',
    phone: '+91 80 4123 8899',
    distance: '1.2 km away',
    distanceNum: 1.2,
    rating: 4.9,
    reviews: 412,
    isOpen: true,
    hoursText: 'Open · Closes 9:30 PM',
    mapCoords: { x: 38, y: 42 }, // percentage coordinates on our illustrated map
    image: '🏬',
    services: ['Eye Test', 'AR Try-On', 'Frame Repair', 'Lens Fitting', 'Contact Lens Consultation', 'Home Delivery'],
    hours: [
      { day: 'Mon - Fri', time: '10:00 AM – 9:30 PM', isToday: true },
      { day: 'Saturday', time: '10:00 AM – 10:00 PM', isToday: false },
      { day: 'Sunday', time: '11:00 AM – 8:30 PM', isToday: false }
    ]
  },
  {
    id: 'store-2',
    name: 'Lens Makers Eye Clinic & Lounge',
    city: 'Bengaluru',
    area: 'Koramangala 4th Block',
    pincode: '560034',
    address: '80ft Road, Opposite Sony World Signal, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    phone: '+91 80 4123 7766',
    distance: '3.8 km away',
    distanceNum: 3.8,
    rating: 4.8,
    reviews: 298,
    isOpen: true,
    hoursText: 'Open · Closes 9:00 PM',
    mapCoords: { x: 65, y: 72 },
    image: '🏪',
    services: ['Eye Test', 'AR Try-On', 'Lens Fitting', 'Contact Lens Consultation', 'Home Delivery'], // missing Frame Repair
    hours: [
      { day: 'Mon - Fri', time: '10:00 AM – 9:00 PM', isToday: true },
      { day: 'Saturday', time: '10:00 AM – 9:30 PM', isToday: false },
      { day: 'Sunday', time: '11:00 AM – 8:00 PM', isToday: false }
    ]
  },
  {
    id: 'store-3',
    name: 'Lens Makers Express Optical Hub',
    city: 'Mumbai',
    area: 'Bandra West Linking Road',
    pincode: '400050',
    address: 'Shop 12, Linking Road, Near Patwardhan Park, Bandra West, Mumbai, Maharashtra 400050',
    phone: '+91 22 2640 1122',
    distance: '14.5 km away',
    distanceNum: 14.5,
    rating: 4.7,
    reviews: 184,
    isOpen: false,
    hoursText: 'Closed · Opens 10:30 AM Tomorrow',
    mapCoords: { x: 22, y: 28 },
    image: '🏢',
    services: ['Eye Test', 'AR Try-On', 'Frame Repair', 'Home Delivery'],
    hours: [
      { day: 'Mon - Fri', time: '10:30 AM – 9:00 PM', isToday: true },
      { day: 'Saturday', time: '10:30 AM – 9:30 PM', isToday: false },
      { day: 'Sunday', time: 'Closed', isToday: false }
    ]
  },
  {
    id: 'store-4',
    name: 'Lens Makers Vision Center',
    city: 'Delhi',
    area: 'Connaught Place Inner Circle',
    pincode: '110001',
    address: 'Block B, Radial Road 3, Connaught Place, New Delhi 110001',
    phone: '+91 11 2331 4455',
    distance: '21.0 km away',
    distanceNum: 21.0,
    rating: 4.9,
    reviews: 520,
    isOpen: true,
    hoursText: 'Open · Closes 10:00 PM',
    mapCoords: { x: 80, y: 35 },
    image: '🏬',
    services: ['Eye Test', 'AR Try-On', 'Frame Repair', 'Lens Fitting', 'Contact Lens Consultation', 'Home Delivery'],
    hours: [
      { day: 'Mon - Sun', time: '10:00 AM – 10:00 PM', isToday: true }
    ]
  }
];

const ALL_SERVICES_SYSTEM = [
  { id: 'Eye Test', label: 'Eye Test', icon: 'eye', color: '#29B6F6' },
  { id: 'AR Try-On', label: 'AR Try-On', icon: 'camera', color: '#FF4D8D' },
  { id: 'Frame Repair', label: 'Frame Repair', icon: 'wrench', color: '#FF7A30' },
  { id: 'Lens Fitting', label: 'Lens Fitting', icon: 'disc', color: '#7C4DFF' },
  { id: 'Contact Lens Consultation', label: 'Contact Lenses', icon: 'smile', color: '#43A047' },
  { id: 'Home Delivery', label: 'Home Delivery', icon: 'truck', color: '#66BB6A' }
];

const StoreLocatorScreen = ({ onSelectTab }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState('store-1');
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showHoursTable, setShowHoursTable] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initialize Lucide icons
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }, [viewMode, selectedStoreId, showHoursTable]);

  // Filtered stores
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return STORES_DATA;
    const q = searchQuery.toLowerCase();
    return STORES_DATA.filter(st => 
      st.name.toLowerCase().includes(q) ||
      st.city.toLowerCase().includes(q) ||
      st.area.toLowerCase().includes(q) ||
      st.pincode.includes(q) ||
      st.address.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeStore = useMemo(() => {
    return STORES_DATA.find(st => st.id === selectedStoreId) || STORES_DATA[0];
  }, [selectedStoreId]);

  const handleUseMyLocation = () => {
    setIsDetectingLoc(true);
    showToast("🛰️ Detecting GPS coordinates...");
    setTimeout(() => {
      setIsDetectingLoc(false);
      setSelectedStoreId('store-1');
      setSearchQuery('');
      setMapZoom(1.15);
      showToast("📍 Centered map on: Indiranagar, Bengaluru (1.2 km)");
    }, 1000);
  };

  const handleSelectPin = (storeId) => {
    setSelectedStoreId(storeId);
    setMapZoom(1.08);
    // Smooth scroll to store list item
    const el = document.getElementById(`store-row-${storeId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="screen-transition-enter" style={{ padding: '16px var(--screen-padding)', paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="glass-card-glow-pink" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: '999px', fontSize: '13px', fontWeight: '800', color: '#FFFFFF', whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(255,77,141,0.5)', animation: 'fadeIn 200ms ease' }}>
          {toastMessage}
        </div>
      )}

      {/* ==========================================================================
         VIEW MODE 1: MAIN STORE LOCATOR & ILLUSTRATED MAP
         ========================================================================== */}
      {viewMode === 'list' && (
        <div>
          {/* HEADER */}
          <div className="flex-between mb-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => { if (onSelectTab) onSelectTab('home'); }}
              >
                ←
              </button>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>Find a Store</h1>
            </div>
            <button
              type="button"
              style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #29B6F6, #0288D1)', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 16px rgba(41,182,246,0.4)' }}
              onClick={handleUseMyLocation}
              title="Auto-detect current location"
            >
              <i data-lucide="navigation" style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* SEARCH BAR */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#FF7A30' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by city, area, or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', height: '46px', paddingLeft: '44px', paddingRight: '14px', borderRadius: '14px', background: 'rgba(27,31,74,0.75)', border: '1.5px solid rgba(255,122,48,0.3)', color: '#FFFFFF', fontSize: '13px', outline: 'none', backdropFilter: 'blur(10px)' }}
            />
          </div>

          {/* USE MY LOCATION PILL BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              type="button"
              style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(41,182,246,0.15)', border: '1px solid #29B6F6', color: '#29B6F6', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={handleUseMyLocation}
            >
              {isDetectingLoc ? (
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>📍</span>
              ) : (
                <span>📍</span>
              )}
              <span>{isDetectingLoc ? 'Detecting Location...' : 'Use My Location'}</span>
            </button>
          </div>

          {/* ILLUSTRATED STYLIZED MAP VIEW (Large Glass Container ~300px) */}
          <div
            className="glass-card-elevated mb-4"
            style={{
              position: 'relative', height: '300px', borderRadius: '20px', overflow: 'hidden',
              background: '#FAFAF9', border: '1.5px solid rgba(255,255,255,0.15)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            {/* Illustrated Map Background Grid & Roads */}
            <div
              style={{
                position: 'absolute', inset: 0,
                transform: `scale(${mapZoom})`,
                transition: 'transform 400ms var(--spring-bezier)',
                backgroundImage: `
                  linear-gradient(rgba(27,31,74,0.7) 2px, transparent 2px),
                  linear-gradient(90deg, rgba(27,31,74,0.7) 2px, transparent 2px),
                  linear-gradient(rgba(255,255,255,0.08) 4px, transparent 4px),
                  linear-gradient(90deg, rgba(255,255,255,0.08) 4px, transparent 4px)
                `,
                backgroundSize: '40px 40px, 40px 40px, 160px 160px, 160px 160px',
                backgroundPosition: 'center'
              }}
            >
              {/* Stylized Park & Water Zones */}
              <div style={{ position: 'absolute', top: '15%', left: '10%', width: '35%', height: '30%', background: 'rgba(102,187,106,0.12)', borderRadius: '16px', border: '1px dashed rgba(102,187,106,0.3)' }} />
              <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '40%', height: '35%', background: 'rgba(41,182,246,0.12)', borderRadius: '20px', border: '1px dashed rgba(41,182,246,0.3)' }} />
              <div style={{ position: 'absolute', top: '55%', left: '20%', width: '25%', height: '20%', background: 'rgba(124,77,255,0.1)', borderRadius: '12px' }} />
              
              {/* Diagonal Express Road */}
              <div style={{ position: 'absolute', top: '-10%', left: '0%', width: '120%', height: '8px', background: 'rgba(255,255,255,0.12)', transform: 'rotate(18deg)', transformOrigin: 'top left' }} />
            </div>

            {/* Store Pin Markers on Map */}
            {filteredStores.map((st) => {
              const isSel = st.id === selectedStoreId;
              return (
                <div
                  key={st.id}
                  style={{
                    position: 'absolute',
                    left: `${st.mapCoords.x}%`,
                    top: `${st.mapCoords.y}%`,
                    transform: 'translate(-50%, -100%)',
                    zIndex: isSel ? 20 : 10,
                    cursor: 'pointer'
                  }}
                  onClick={(e) => { e.stopPropagation(); handleSelectPin(st.id); }}
                >
                  {/* Floating Preview Card if Selected */}
                  {isSel && (
                    <div
                      style={{
                        position: 'absolute', bottom: '38px', left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(15,21,53,0.95)', border: '1.5px solid #FF4D8D', borderRadius: '12px',
                        padding: '10px 14px', minWidth: '170px', boxShadow: '0 8px 24px rgba(255,77,141,0.4)',
                        animation: 'fadeIn 200ms ease', backdropFilter: 'blur(10px)', zIndex: 30
                      }}
                      onClick={(e) => { e.stopPropagation(); setViewMode('detail'); }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {st.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#A0A4C8', marginBottom: '4px' }}>
                        {st.distance}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: st.isOpen ? '#66BB6A' : '#EF5350', marginBottom: '6px' }}>
                        {st.hoursText}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#FF4D8D', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>View Store Details</span>
                        <span>→</span>
                      </div>
                      {/* Triangle Pointer */}
                      <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '10px', height: '10px', background: 'rgba(15,21,53,0.95)', borderRight: '1.5px solid #FF4D8D', borderBottom: '1.5px solid #FF4D8D' }} />
                    </div>
                  )}

                  {/* Teardrop Pin Marker */}
                  <div
                    style={{
                      width: isSel ? '36px' : '28px',
                      height: isSel ? '44px' : '34px',
                      background: isSel
                        ? 'linear-gradient(135deg, #FF4D8D 0%, #C2185B 100%)'
                        : 'linear-gradient(135deg, #C9A876 0%, #B8935E 100%)',
                      borderRadius: '50% 50% 50% 0',
                      transform: 'rotate(-45deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSel
                        ? '0 6px 20px rgba(255,77,141,0.6)'
                        : '0 4px 12px rgba(0,0,0,0.5)',
                      transition: 'all 250ms var(--spring-bezier)'
                    }}
                  >
                    <span
                      style={{
                        transform: 'rotate(45deg)',
                        fontSize: isSel ? '12px' : '10px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        letterSpacing: '0.5px'
                      }}
                    >
                      LM
                    </span>
                  </div>
                  {/* Pin Base Shadow Pulse */}
                  {isSel && (
                    <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '18px', height: '6px', background: 'rgba(255,77,141,0.5)', borderRadius: '50%', filter: 'blur(2px)' }} />
                  )}
                </div>
              );
            })}

            {/* Map Controls Corner */}
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 15 }}>
              <button
                type="button"
                style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(27,31,74,0.9)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
              >
                +
              </button>
              <button
                type="button"
                style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(27,31,74,0.9)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
              >
                -
              </button>
            </div>

            {/* Map Legend Tag */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15,21,53,0.85)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '10px', fontWeight: '700', color: '#A0A4C8', backdropFilter: 'blur(6px)' }}>
              📍 4 Verified Flagship Eye Clinics
            </div>
          </div>

          {/* STORE LIST (Scrollable, Synced to Map) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>Nearby Optical Studios</h2>
            <span style={{ fontSize: '12px', color: '#6B6E9A' }}>{filteredStores.length} Stores Found</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredStores.map((st) => {
              const isSel = st.id === selectedStoreId;
              return (
                <div
                  key={st.id}
                  id={`store-row-${st.id}`}
                  className="glass-card-standard"
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    border: isSel ? '2px solid #FF4D8D' : '1px solid rgba(255,255,255,0.1)',
                    background: isSel ? 'rgba(255,77,141,0.06)' : 'transparent',
                    boxShadow: isSel ? '0 0 20px rgba(255,77,141,0.25)' : 'none',
                    transition: 'all 200ms ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                  onClick={() => {
                    handleSelectPin(st.id);
                    setViewMode('detail');
                  }}
                >
                  {/* LEFT: Thumbnail + Open/Closed Dot */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                      {st.image}
                    </div>
                    <div
                      style={{
                        position: 'absolute', bottom: '-2px', right: '-2px',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: st.isOpen ? '#66BB6A' : '#EF5350',
                        border: '2px solid #FFFFFF'
                      }}
                      title={st.isOpen ? 'Open Now' : 'Closed'}
                    />
                  </div>

                  {/* MIDDLE: Name, Address, Distance & Service Chips */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex-between" style={{ marginBottom: '2px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {st.name}
                      </h3>
                    </div>
                    <div style={{ fontSize: '12px', color: '#A0A4C8', marginBottom: '8px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {st.address}
                    </div>

                    {/* Distance Badge & Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span className="badge-pill" style={{ background: 'rgba(41,182,246,0.15)', color: '#29B6F6', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>📍</span>
                        <span>{st.distance}</span>
                      </span>
                      <span className="badge-pill" style={{ background: 'rgba(201,168,118,0.15)', color: '#C9A876', fontSize: '10px', fontWeight: '800' }}>
                        ★ {st.rating} ({st.reviews})
                      </span>
                    </div>

                    {/* Service Chips Row */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {st.services.slice(0, 3).map((srv, i) => {
                        const srvInfo = ALL_SERVICES_SYSTEM.find(s => s.id === srv) || { color: '#FFF' };
                        return (
                          <span
                            key={i}
                            style={{
                              padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: '700',
                              background: `rgba(${parseInt(srvInfo.color.slice(1,3),16)}, ${parseInt(srvInfo.color.slice(3,5),16)}, ${parseInt(srvInfo.color.slice(5,7),16)}, 0.15)`,
                              color: srvInfo.color, border: `1px solid ${srvInfo.color}33`
                            }}
                          >
                            {srv}
                          </span>
                        );
                      })}
                      {st.services.length > 3 && (
                        <span style={{ padding: '2px 6px', borderRadius: '999px', fontSize: '10px', background: 'rgba(255,255,255,0.06)', color: '#A0A4C8' }}>
                          +{st.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Status Pill & Chevron */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch', flexShrink: 0 }}>
                    <span className={`badge-pill ${st.isOpen ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {st.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                    <span style={{ color: isSel ? '#FF4D8D' : '#6B6E9A', fontWeight: '800', fontSize: '16px' }}>
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================================================
         VIEW MODE 2: STORE DETAIL PAGE (Slide-In from Right)
         ========================================================================== */}
      {viewMode === 'detail' && activeStore && (
        <div className="screen-transition-enter">
          {/* HEADER */}
          <div className="flex-between mb-3">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('list')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>{activeStore.name}</h1>
            <span style={{ width: '36px' }} />
          </div>

          {/* TOP PHOTO BANNER (160px height, rounded corners, overlays) */}
          <div
            style={{
              position: 'relative', height: '160px', borderRadius: '20px', marginBottom: '18px', overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.65)', border: '1.5px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ fontSize: '64px', opacity: 0.8 }}>{activeStore.image}</div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,21,53,0.8) 0%, transparent 60%)' }} />

            {/* Top Left Pill: Status & Hours */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
              <span className={`badge-pill ${activeStore.isOpen ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', backdropFilter: 'blur(8px)' }}>
                {activeStore.isOpen ? '● Open Now' : '● Closed'} · {activeStore.hoursText.split('·')[1] || activeStore.hoursText}
              </span>
            </div>

            {/* Top Right Pill: Star Rating */}
            <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
              <span className="badge-pill" style={{ background: 'rgba(201,168,118,0.2)', border: '1px solid #C9A876', color: '#C9A876', fontSize: '11px', fontWeight: '800', padding: '4px 10px', backdropFilter: 'blur(8px)' }}>
                ★ {activeStore.rating} ({activeStore.reviews} reviews)
              </span>
            </div>

            {/* Bottom Overlay Title */}
            <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', zIndex: 2 }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {activeStore.name}
              </div>
              <div style={{ fontSize: '12px', color: '#29B6F6', fontWeight: '700' }}>
                📍 {activeStore.area}, {activeStore.city} · {activeStore.distance}
              </div>
            </div>
          </div>

          {/* INFO CARDS (Stacked Glass Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {/* Address Card */}
            <div className="glass-card-standard" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '20px', color: '#29B6F6', marginTop: '2px' }}>📍</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', uppercase: 'true' }}>STUDIO ADDRESS</div>
                  <div style={{ fontSize: '13px', color: '#FFFFFF', lineHeight: '1.4', marginTop: '2px' }}>{activeStore.address}</div>
                </div>
              </div>
              <button
                type="button"
                style={{ padding: '8px 14px', borderRadius: '999px', background: 'linear-gradient(135deg, #29B6F6, #0288D1)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(41,182,246,0.4)' }}
                onClick={() => showToast(`🗺️ Opening GPS directions to ${activeStore.name}...`)}
              >
                Get Directions
              </button>
            </div>

            {/* Phone Card */}
            <div className="glass-card-standard" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '20px', color: '#66BB6A' }}>📞</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8' }}>STUDIO CONTACT</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginTop: '2px' }}>{activeStore.phone}</div>
                </div>
              </div>
              <button
                type="button"
                style={{ padding: '8px 16px', borderRadius: '999px', background: 'linear-gradient(135deg, #43A047, #2E7D32)', border: 'none', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(67,160,71,0.4)' }}
                onClick={() => showToast(`📞 Calling optical reception desk at ${activeStore.phone}...`)}
              >
                Call Now
              </button>
            </div>

            {/* Hours Card (Expandable Mon-Sun Table) */}
            <div className="glass-card-standard" style={{ padding: '16px' }}>
              <div
                className="flex-between"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowHoursTable(!showHoursTable)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px', color: '#C9A876' }}>⏰</span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8' }}>OPERATING HOURS</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: activeStore.isOpen ? '#66BB6A' : '#EF5350' }}>
                      {activeStore.hoursText}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#29B6F6', fontSize: '12px', fontWeight: '700' }}>
                  <span>{showHoursTable ? 'Hide Schedule' : 'View 7-Day Schedule'}</span>
                  <span style={{ transform: showHoursTable ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>▼</span>
                </div>
              </div>

              {/* Expandable Table */}
              {showHoursTable && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 200ms ease' }}>
                  {activeStore.hours.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex-between"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: row.isToday ? 'rgba(255,77,141,0.15)' : 'rgba(255,255,255,0.03)',
                        border: row.isToday ? '1px solid #FF4D8D' : '1px solid transparent'
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: row.isToday ? '800' : '600', color: row.isToday ? '#FF4D8D' : '#FFFFFF' }}>
                        {row.day} {row.isToday && ' (Today)'}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: row.time === 'Closed' ? '#EF5350' : '#FFFFFF' }}>
                        {row.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SERVICES AVAILABLE IN THIS STORE */}
          <div className="glass-card-elevated mb-4" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>
              Services Available in Studio
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', textAlign: 'center' }}>
              {ALL_SERVICES_SYSTEM.map((srv, idx) => {
                const isAvail = activeStore.services.includes(srv.id);
                return (
                  <div
                    key={idx}
                    style={{
                      opacity: isAvail ? 1 : 0.3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '22px',
                        background: isAvail ? `rgba(${parseInt(srv.color.slice(1,3),16)}, ${parseInt(srv.color.slice(3,5),16)}, ${parseInt(srv.color.slice(5,7),16)}, 0.2)` : 'rgba(255,255,255,0.05)',
                        border: isAvail ? `1.5px solid ${srv.color}` : '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i data-lucide={srv.icon} style={{ width: '20px', height: '20px', color: isAvail ? srv.color : '#6B6E9A' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: isAvail ? '700' : '500', color: isAvail ? '#FFFFFF' : '#6B6E9A', lineHeight: '1.2' }}>
                      {srv.label}
                    </span>
                    {isAvail && (
                      <span style={{ fontSize: '9px', color: '#66BB6A', fontWeight: '800' }}>✓ Available</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOOK IN-STORE EYE TEST (Large Glass CTA Card with Cyan Glow) */}
          <div
            className="rx-card-cyan mb-4"
            style={{ padding: '22px', textAlign: 'center', border: '1.5px solid #29B6F6', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(41,182,246,0.2)', borderRadius: '50%', filter: 'blur(20px)' }} />

            <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: 'rgba(41,182,246,0.2)', color: '#29B6F6', fontSize: '11px', fontWeight: '800', marginBottom: '10px' }}>
              👁️ CLINICALLY VERIFIED TEST
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', marginBottom: '6px' }}>
              Visit {activeStore.name} for an In-Person Eye Test
            </h3>
            <p style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '18px', maxWidth: '320px', marginX: 'auto' }}>
              Our certified senior optometrists conduct a 12-step computerized vision exam using Zeiss optical instrumentation.
            </p>

            <button
              type="button"
              className="btn-primary-pill w-100"
              style={{ height: '52px', fontSize: '15px', fontWeight: '900', background: 'linear-gradient(135deg, #FF4D8D, #7C4DFF)', boxShadow: '0 0 24px rgba(255,77,141,0.5)' }}
              onClick={() => {
                showToast(`🏥 Pre-selecting ${activeStore.name} for your clinic appointment...`);
                setTimeout(() => {
                  if (onSelectTab) onSelectTab('eyetest');
                }, 800);
              }}
            >
              📅 Book In-Store Appointment — FREE →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

window.StoreLocatorScreen = StoreLocatorScreen;
