// Profile & Settings Screen Component — Prompt 9 Part B & Part C (Complete Ecosystem)
const { useState, useEffect } = React;

const ProfileScreen = ({ onLogout, onReplayOnboarding, onSelectTab, initialViewMode = 'profile' }) => {
  const [viewMode, setViewMode] = useState(initialViewMode); // 'profile', 'settings', 'addresses', 'payments', 'tryon_history', 'notifications', 'support'
  const [isMember, setIsMember] = useState(window.userIsMember !== false);
  const [toastMessage, setToastMessage] = useState(null);

  // User Profile States
  const [userProfile, setUserProfile] = useState({
    name: 'Loki Reddy',
    email: 'loki.reddy@lensmakers.in',
    phone: '+91 98765 43210',
    avatar: 'LR',
    avatarImg: null,
    ordersCount: 14,
    savedFramesCount: 6,
    reviewsCount: 8
  });

  // Modals & Interactive States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsType, setTermsType] = useState('Terms of Service');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);

  // Settings Toggles State
  const [settingsState, setSettingsState] = useState({
    twoFactor: true,
    language: 'English',
    currency: '₹ INR (Default)',
    reduceAnimations: false,
    defaultLens: 'Blue Light Block (Stock Range)',
    cameraPerm: 'Granted ✓',
    locationPerm: 'While Using App ✓',
    analyticsAds: true,
    crashReports: true,
    arScanCache: true
  });

  // Temporary form states for Edit Profile
  const [editForm, setEditForm] = useState({ ...userProfile });
  const [pwdForm, setPwdForm] = useState({ curr: '', next: '', confirm: '' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Re-initialize Lucide icons when viewMode or modal changes
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }, [viewMode, showLogoutModal, showEditProfileModal, showPasswordModal, showLanguageModal, showDataModal, showDeleteModal, showTermsModal, showRatingModal]);

  const handleToggleMembership = () => {
    const nextVal = !isMember;
    setIsMember(nextVal);
    window.userIsMember = nextVal;
    showToast(nextVal ? "⚡ VIP Club Privileges Activated (₹99/mo)!" : "✕ Membership disabled for test");
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editForm });
    setShowEditProfileModal(false);
    showToast("✓ Profile information updated successfully!");
  };

  const handleChangeAvatar = () => {
    const emojis = ['👓', '🕶️', '👨‍💻', '🚀', '🌟', 'LR'];
    const currIdx = emojis.indexOf(userProfile.avatar);
    const nextVal = emojis[(currIdx + 1) % emojis.length];
    setUserProfile(prev => ({ ...prev, avatar: nextVal }));
    showToast(`📸 Switched avatar icon to "${nextVal}"`);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    showToast("🔒 Clearing session credentials...");
    setTimeout(() => {
      if (onLogout) onLogout();
    }, 800);
  };

  return (
    <div className="screen-transition-enter" style={{ padding: '16px var(--screen-padding)', paddingBottom: '90px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="glass-card-glow-pink" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: '999px', fontSize: '13px', fontWeight: '800', color: '#FFFFFF', whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(255,77,141,0.5)', animation: 'fadeIn 200ms ease' }}>
          {toastMessage}
        </div>
      )}

      {/* ==========================================================================
         PART B: PROFILE DASHBOARD VIEW (`viewMode === 'profile'`)
         ========================================================================== */}
      {viewMode === 'profile' && (
        <div>
          {/* HEADER */}
          <div className="flex-between mb-4">
            <span style={{ width: '36px' }} /> {/* spacer for balance */}
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.5px' }}>
              Profile
            </h1>
            <button
              type="button"
              style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
              onClick={() => showToast("🔔 No new alerts. You have 3 saved eye prescriptions ready for checkout!")}
            >
              <i data-lucide="bell" style={{ width: '18px', height: '18px' }} />
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '4px', background: '#FF4D8D', boxShadow: '0 0 8px #FF4D8D' }} />
            </button>
          </div>

          {/* USER IDENTITY CARD (Elevated Glass Card, Full-Width) */}
          <div
            className="glass-card-elevated mb-3"
            style={{ padding: '24px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
          >
            {/* Background Ambient Blob */}
            <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(255,77,141,0.25) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />

            {/* Circular Avatar (88px) with Pink Glow Ring */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <div
                style={{
                  width: '88px', height: '88px', borderRadius: '44px',
                  background: 'linear-gradient(135deg, #1B1F4A 0%, #2D1B4A 50%, #7C4DFF 100%)',
                  border: '2.5px solid #FF4D8D',
                  boxShadow: '0 0 24px rgba(255,77,141,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', fontWeight: '900', color: '#FFFFFF'
                }}
              >
                {userProfile.avatar}
              </div>

              {/* Edit Camera Badge */}
              <button
                type="button"
                style={{
                  position: 'absolute', bottom: '0px', right: '0px',
                  width: '28px', height: '28px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FF4D8D, #C2185B)',
                  border: '2px solid #0F1535', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 10px rgba(255,77,141,0.6)'
                }}
                onClick={handleChangeAvatar}
                title="Change Avatar"
              >
                <i data-lucide="camera" style={{ width: '14px', height: '14px' }} />
              </button>
            </div>

            {/* User Name & Contact Details */}
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', marginBottom: '4px' }}>
              {userProfile.name}
            </h2>
            <div style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '16px' }}>
              {userProfile.email} • {userProfile.phone}
            </div>

            {/* Membership Badge Toggle */}
            {isMember ? (
              <div
                className="badge-pill badge-green"
                style={{ padding: '6px 16px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 0 16px rgba(67,160,71,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => { if (onSelectTab) onSelectTab('manageclub'); }}
              >
                <span>👑 ACTIVE MEMBER (₹99/mo Club) ✓</span>
                <span style={{ opacity: 0.7 }}>→</span>
              </div>
            ) : (
              <div
                style={{ padding: '6px 16px', borderRadius: '999px', background: 'rgba(124,77,255,0.15)', border: '1.5px solid #7C4DFF', color: '#FFFFFF', fontSize: '11px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 0 16px rgba(124,77,255,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => { if (onSelectTab) onSelectTab('membership'); }}
              >
                <span>👑 Join Club ₹99/mo (Flat 25% Off)</span>
                <span style={{ color: '#7C4DFF' }}>→</span>
              </div>
            )}
          </div>

          {/* STATS ROW (3 Equal Sections in Glass Card Strip) */}
          <div className="glass-card-standard mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', padding: '16px 8px' }}>
            {/* Orders */}
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => { if (onSelectTab) onSelectTab('trackorder'); }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#FFFFFF' }}>{userProfile.ordersCount}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', marginTop: '2px' }}>Orders</div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

            {/* Saved Frames */}
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => { if (onSelectTab) onSelectTab('shop'); }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF4D8D' }}>{userProfile.savedFramesCount}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', marginTop: '2px' }}>Saved Frames</div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

            {/* Reviews */}
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowRatingModal(true)}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#FBC02D' }}>{userProfile.reviewsCount}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', marginTop: '2px' }}>Reviews ★</div>
            </div>
          </div>

          {/* iOS-GROUPED MENU SECTIONS */}

          {/* SECTION 1: SHOPPING */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              SHOPPING
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" onClick={() => { if (onSelectTab) onSelectTab('trackorder'); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(255,77,141,0.2)', border: '1px solid #FF4D8D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4D8D' }}>
                    <i data-lucide="shopping-bag" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>My Orders & Tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge-pill badge-green" style={{ fontSize: '9px' }}>1 IN TRANSIT</span>
                  <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
                </div>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => showToast("💖 You have 6 frames saved to your wishlist!")}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(229,57,53,0.2)', border: '1px solid #E53935', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E53935' }}>
                    <i data-lucide="heart" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Saved Frames</span>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { if (onSelectTab) onSelectTab('membership'); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(124,77,255,0.2)', border: '1px solid #7C4DFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C4DFF' }}>
                    <i data-lucide="star" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Lens Makers Club</div>
                    <div style={{ fontSize: '11px', color: '#7C4DFF', fontWeight: '700' }}>{isMember ? 'VIP Active · Flat 25% Off' : 'Join for ₹99/mo'}</div>
                  </div>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { if (onSelectTab) onSelectTab('welcomeclub'); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(255,122,48,0.2)', border: '1px solid #FF7A30', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7A30' }}>
                    <i data-lucide="gift" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>BOGO Offer Mechanics</span>
                </div>
                <span className="badge-pill badge-orange" style={{ fontSize: '9px' }}>BUY 1 GET 1</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: EYE HEALTH */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              EYE HEALTH
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" onClick={() => { if (onSelectTab) onSelectTab('prescription'); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(41,182,246,0.2)', border: '1px solid #29B6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#29B6F6' }}>
                    <i data-lucide="eye" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>My Prescriptions</div>
                    <div style={{ fontSize: '11px', color: '#29B6F6' }}>3 verified medical records stored</div>
                  </div>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { if (onSelectTab) onSelectTab('trackappt'); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(30,136,229,0.2)', border: '1px solid #1E88E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E88E5' }}>
                    <i data-lucide="calendar" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Eye Check-Up History</span>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: ACCOUNT */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              ACCOUNT & ADDRESSES
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" onClick={() => setViewMode('addresses')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(251,192,45,0.2)', border: '1px solid #FBC02D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBC02D' }}>
                    <i data-lucide="map-pin" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Delivery Addresses</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#A0A4C8' }}>2 Saved</span>
                  <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
                </div>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => setViewMode('payments')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(142,36,170,0.2)', border: '1px solid #8E24AA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E24AA' }}>
                    <i data-lucide="credit-card" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Payment Methods</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#A0A4C8' }}>UPI / Cards</span>
                  <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PERSONALIZATION */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              PERSONALIZATION
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" onClick={() => setViewMode('tryon_history')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(255,77,141,0.2)', border: '1px solid #FF4D8D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4D8D' }}>
                    <i data-lucide="camera" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Try-On Face Mesh History</span>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => setViewMode('notifications')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(67,160,71,0.2)', border: '1px solid #43A047', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43A047' }}>
                    <i data-lucide="bell" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Notification Settings</span>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: SUPPORT & SETTINGS */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              SUPPORT & SETTINGS
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" onClick={() => setViewMode('support')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(102,187,106,0.2)', border: '1px solid #66BB6A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#66BB6A' }}>
                    <i data-lucide="message-circle" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Help & VIP 24/7 Support</span>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => setViewMode('settings')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(84,110,122,0.3)', border: '1px solid #90A4AE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CFD8DC' }}>
                    <i data-lucide="settings" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Settings (App, Privacy, Security)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge-pill badge-purple" style={{ fontSize: '9px' }}>CONFIG</span>
                  <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* LOGOUT (Separated with extra 24px spacing) */}
          <div style={{ marginTop: '24px', marginBottom: '20px' }}>
            <div
              className="glass-card-standard"
              style={{
                padding: '16px', cursor: 'pointer', border: '1.5px solid rgba(239,83,80,0.3)',
                background: 'rgba(239,83,80,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', transition: 'all 200ms ease'
              }}
              onClick={() => setShowLogoutModal(true)}
            >
              <i data-lucide="log-out" style={{ width: '18px', height: '18px', color: '#EF5350' }} />
              <span style={{ fontSize: '15px', fontWeight: '900', color: '#EF5350' }}>Log Out</span>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         PART C: SETTINGS SCREEN (`viewMode === 'settings'`)
         ========================================================================== */}
      {viewMode === 'settings' && (
        <div className="screen-transition-enter">
          {/* HEADER */}
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('profile')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>Settings</h1>
            <span style={{ width: '36px' }} />
          </div>

          {/* 1. ACCOUNT SECTION (Grouped Glass Card) */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              ACCOUNT & SECURITY
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" onClick={() => { setEditForm({ ...userProfile }); setShowEditProfileModal(true); }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Edit Profile Information</span>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => setShowPasswordModal(true)}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Change Password</span>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => showToast("🔗 Linked Social Accounts: Google (Connected ✓) · Apple ID (Connected ✓)")}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Linked Accounts</span>
                <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>2 Connected</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => {
                setSettingsState(prev => ({ ...prev, twoFactor: !prev.twoFactor }));
                showToast(`🛡️ Two-Factor Authentication (2FA) is now ${!settingsState.twoFactor ? 'ENABLED ✓' : 'DISABLED ✕'}`);
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Biometric Face ID & OTP login protection</div>
                </div>
                <div style={{ width: '42px', height: '24px', borderRadius: '12px', background: settingsState.twoFactor ? '#43A047' : 'rgba(255,255,255,0.15)', position: 'relative', transition: 'background 200ms ease' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '9px', background: '#FFF', position: 'absolute', top: '3px', left: settingsState.twoFactor ? '21px' : '3px', transition: 'left 200ms ease' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. APP PREFERENCES (Grouped Glass Card) */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              APP PREFERENCES
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" onClick={() => setShowLanguageModal(true)}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Language</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#29B6F6', fontWeight: '700' }}>{settingsState.language}</span>
                  <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
                </div>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => showToast("💡 ₹ INR is default for India. USD & EUR support coming next release!")}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Currency</span>
                <span style={{ fontSize: '13px', color: '#A0A4C8', fontWeight: '600', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  {settingsState.currency}
                </span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => {
                setSettingsState(prev => ({ ...prev, reduceAnimations: !prev.reduceAnimations }));
                showToast(`⚡ Reduce Animations set to ${!settingsState.reduceAnimations ? 'ON' : 'OFF'}`);
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Reduce Animations</div>
                  <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Simpler motion for accessibility</div>
                </div>
                <div style={{ width: '42px', height: '24px', borderRadius: '12px', background: settingsState.reduceAnimations ? '#43A047' : 'rgba(255,255,255,0.15)', position: 'relative', transition: 'background 200ms ease' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '9px', background: '#FFF', position: 'absolute', top: '3px', left: settingsState.reduceAnimations ? '21px' : '3px', transition: 'left 200ms ease' }} />
                </div>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => {
                const types = ['Single Vision (Stock Range)', 'Blue Light Block (Stock Range)', 'Progressive (No-Line Bifocal)'];
                const nextIdx = (types.indexOf(settingsState.defaultLens) + 1) % types.length;
                setSettingsState(prev => ({ ...prev, defaultLens: types[nextIdx] }));
                showToast(`🔬 Default Lens Type set to: ${types[nextIdx]}`);
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Default Lens Type</div>
                  <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Auto-selects during checkout</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#FF4D8D', fontWeight: '700' }}>{settingsState.defaultLens.split('(')[0]}</span>
                  <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. PRIVACY & DATA (Grouped Glass Card) */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              PRIVACY & DATA
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" onClick={() => showToast("📸 Camera Permission: Granted for AR Virtual Try-On & OCR Scan.")}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Camera Permissions</span>
                <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>{settingsState.cameraPerm}</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => showToast("📍 Location Permission: Granted while using Store Locator & Express Delivery.")}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Location Permissions</span>
                <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>{settingsState.locationPerm}</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => setShowDataModal(true)}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Data & Personalization</div>
                  <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Analytics, crash reports & AR cache</div>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => showToast(`📥 Compiling JSON data export... We will email your full data package to ${userProfile.email} within 2 hours!`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>📥</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#29B6F6' }}>Download My Data</span>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => setShowDeleteModal(true)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>⚠️</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#EF5350' }}>Delete Account Permanently</span>
                </div>
                <span style={{ color: '#EF5350', fontWeight: '800' }}>→</span>
              </div>
            </div>
          </div>

          {/* 4. ABOUT (Grouped Glass Card) */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '4px' }}>
              ABOUT LENS MAKERS
            </h3>
            <div className="glass-card-standard" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="menu-row-item" style={{ cursor: 'default' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>App Version</span>
                <span style={{ fontSize: '12px', color: '#A0A4C8', fontFamily: 'monospace', fontWeight: '700' }}>v1.0.0 · Build 2026.07</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { setTermsType('Terms of Service'); setShowTermsModal(true); }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Terms of Service</span>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { setTermsType('Privacy Policy'); setShowTermsModal(true); }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Privacy Policy</span>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => setShowRatingModal(true)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>⭐</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#FBC02D' }}>Rate Lens Makers 5 Stars</span>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>

              <div className="menu-row-item" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onClick={() => showToast("📤 Invite link copied to clipboard: https://lensmakers.app/invite/LOKI25 (Give ₹500, Get ₹500!)")}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>📤</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Share the App with Friends</span>
                </div>
                <span style={{ color: '#6B6E9A', fontWeight: '800' }}>→</span>
              </div>
            </div>
          </div>

          {/* LOGOUT (Bottom, Red text) */}
          <div style={{ marginBottom: '20px' }}>
            <div
              className="glass-card-standard"
              style={{
                padding: '16px', cursor: 'pointer', border: '1.5px solid rgba(239,83,80,0.3)',
                background: 'rgba(239,83,80,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', transition: 'all 200ms ease'
              }}
              onClick={() => setShowLogoutModal(true)}
            >
              <i data-lucide="log-out" style={{ width: '18px', height: '18px', color: '#EF5350' }} />
              <span style={{ fontSize: '15px', fontWeight: '900', color: '#EF5350' }}>Log Out of Account</span>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SUBVIEW: DELIVERY ADDRESSES (`viewMode === 'addresses'`)
         ========================================================================== */}
      {viewMode === 'addresses' && (
        <div className="screen-transition-enter">
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('profile')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>Delivery Addresses</h1>
            <button
              type="button"
              style={{ padding: '6px 14px', borderRadius: '999px', background: 'linear-gradient(135deg, #FF4D8D, #7C4DFF)', border: 'none', color: '#FFFFFF', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
              onClick={() => showToast("➕ Opening new GPS address auto-locator modal...")}
            >
              + Add New
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="glass-card-standard" style={{ padding: '18px', borderLeft: '4px solid #66BB6A' }}>
              <div className="flex-between mb-2">
                <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>HOME · DEFAULT ✓</span>
                <span style={{ fontSize: '12px', color: '#FF4D8D', fontWeight: '700', cursor: 'pointer' }} onClick={() => showToast("✏️ Editing Home address...")}>Edit</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>{userProfile.name}</div>
              <div style={{ fontSize: '13px', color: '#A0A4C8', lineHeight: '1.4' }}>
                Flat 402, Prestige Highridge Towers, 100ft Road, Metro Pillar 54, Indiranagar, Bengaluru, Karnataka 560038
              </div>
            </div>

            <div className="glass-card-standard" style={{ padding: '18px', borderLeft: '4px solid #29B6F6' }}>
              <div className="flex-between mb-2">
                <span className="badge-pill" style={{ background: 'rgba(41,182,246,0.15)', color: '#29B6F6', fontSize: '10px', fontWeight: '800' }}>OFFICE</span>
                <span style={{ fontSize: '12px', color: '#FF4D8D', fontWeight: '700', cursor: 'pointer' }} onClick={() => showToast("✏️ Editing Office address...")}>Edit</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>{userProfile.name} (Tech Hub)</div>
              <div style={{ fontSize: '13px', color: '#A0A4C8', lineHeight: '1.4' }}>
                Level 5, Embassy GolfLinks Business Park, Off Intermediate Ring Road, Domlur, Bengaluru 560071
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SUBVIEW: PAYMENT METHODS (`viewMode === 'payments'`)
         ========================================================================== */}
      {viewMode === 'payments' && (
        <div className="screen-transition-enter">
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('profile')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>Saved Payment Methods</h1>
            <button
              type="button"
              style={{ padding: '6px 14px', borderRadius: '999px', background: 'linear-gradient(135deg, #7C4DFF, #FF4D8D)', border: 'none', color: '#FFFFFF', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
              onClick={() => showToast("💳 Opening UPI & card verification gateway...")}
            >
              + Add Card/UPI
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="glass-card-glow-purple" style={{ padding: '18px', border: '1px solid #7C4DFF' }}>
              <div className="flex-between mb-3">
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF' }}>GPay / PhonePe UPI</span>
                <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>FASTEST ✓</span>
              </div>
              <div style={{ fontSize: '14px', fontFamily: 'monospace', color: '#29B6F6', fontWeight: '800' }}>loki.reddy@okaxis</div>
            </div>

            <div className="glass-card-standard" style={{ padding: '18px' }}>
              <div className="flex-between mb-3">
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>💳 HDFC Regalia Gold Credit Card</span>
                <span style={{ fontSize: '12px', color: '#6B6E9A' }}>Expires 08/29</span>
              </div>
              <div style={{ fontSize: '15px', fontFamily: 'monospace', color: '#A0A4C8', fontWeight: '700' }}>•••• •••• •••• 4289</div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SUBVIEW: TRY-ON HISTORY (`viewMode === 'tryon_history'`)
         ========================================================================== */}
      {viewMode === 'tryon_history' && (
        <div className="screen-transition-enter">
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('profile')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>Try-On Face Mesh History</h1>
            <span style={{ width: '36px' }} />
          </div>

          <div className="rx-card-cyan mb-4" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>468-Point AI Facial Mesh Active</h3>
            <p style={{ fontSize: '12px', color: '#A0A4C8', marginBottom: '16px' }}>
              Your face dimensions (PD: 63mm, Nose bridge width: 18mm) are encrypted locally for instant AR glass fitting without recalibration.
            </p>
            <button
              type="button"
              className="btn-primary-pill w-100"
              style={{ height: '46px', background: 'linear-gradient(135deg, #FF4D8D, #7C4DFF)' }}
              onClick={() => { if (onSelectTab) onSelectTab('tryon'); }}
            >
              📸 Launch 3D AR Mirror Now →
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SUBVIEW: NOTIFICATION SETTINGS (`viewMode === 'notifications'`)
         ========================================================================== */}
      {viewMode === 'notifications' && (
        <div className="screen-transition-enter">
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('profile')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>Notification Settings</h1>
            <span style={{ width: '36px' }} />
          </div>

          <div className="glass-card-standard" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Order Status & Delivery Updates', 'Prescription Expiry Clinical Reminders', 'VIP Club Exclusive Offers & BOGO Drops', 'New Frame Arrivals in Your Style'].map((label, i) => (
              <div key={i} className="flex-between" style={{ paddingBottom: i < 3 ? '12px' : '0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>{label}</span>
                <div style={{ width: '42px', height: '24px', borderRadius: '12px', background: '#43A047', position: 'relative', cursor: 'pointer' }} onClick={() => showToast(`🔔 Toggled preference: ${label}`)}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '9px', background: '#FFF', position: 'absolute', top: '3px', left: '21px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================================================
         SUBVIEW: HELP & SUPPORT (`viewMode === 'support'`)
         ========================================================================== */}
      {viewMode === 'support' && (
        <div className="screen-transition-enter">
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('profile')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>VIP 24/7 Support Line</h1>
            <span style={{ width: '36px' }} />
          </div>

          <div className="glass-card-glow-green mb-4" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>💬</div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', marginBottom: '6px' }}>Priority Optical Assistance</h3>
            <p style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '18px' }}>
              As an active club member, your inquiries are routed directly to certified senior optometrists with <strong style={{ color: '#66BB6A' }}>under 60s response time</strong>.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary-pill"
                style={{ flex: 1, height: '46px', fontSize: '13px', background: 'linear-gradient(135deg, #43A047, #2E7D32)' }}
                onClick={() => showToast("💬 Connecting to AI Optical Assistant & Live Optometrist...")}
              >
                💬 Live Chat Now
              </button>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ flex: 1, height: '46px', fontSize: '13px', borderColor: '#29B6F6', color: '#29B6F6' }}
                onClick={() => showToast("📞 Calling VIP Hotline: 1800-LENS-VIP...")}
              >
                📞 Call Helpline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL 1: LOGOUT CONFIRMATION (Standard Glass Modal Pattern)
         ========================================================================== */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,21,53,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 200ms ease' }}>
          <div className="glass-card-elevated" style={{ width: '100%', maxWidth: '360px', padding: '24px', textAlign: 'center', border: '1.5px solid rgba(239,83,80,0.5)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', animation: 'scaleUp 250ms var(--spring-bezier)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '28px', background: 'rgba(239,83,80,0.15)', border: '1.5px solid #EF5350', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EF5350' }}>
              <i data-lucide="log-out" style={{ width: '26px', height: '26px' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', marginBottom: '8px' }}>Log Out of Lens Makers?</h3>
            <p style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '24px', lineHeight: '1.5' }}>
              Your saved prescriptions, AR facial mesh measurements, and active ₹99 VIP Club discounts will remain safely stored on our cloud.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                style={{ flex: 1, height: '46px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ flex: 1, height: '46px', borderRadius: '999px', background: '#EF5350', border: 'none', color: '#FFFFFF', fontSize: '14px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 0 16px rgba(239,83,80,0.5)' }}
                onClick={handleConfirmLogout}
              >
                Log Out Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL 2: EDIT PROFILE FORM
         ========================================================================== */}
      {showEditProfileModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,21,53,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 200ms ease' }}>
          <div className="glass-card-elevated" style={{ width: '100%', maxWidth: '380px', padding: '24px', border: '1.5px solid #FF4D8D', animation: 'scaleUp 250ms var(--spring-bezier)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', marginBottom: '16px' }}>✏️ Edit Profile Information</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '4px' }}>FULL NAME</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} className="glass-input" style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '10px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '4px' }}>EMAIL ADDRESS</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} className="glass-input" style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '10px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '4px' }}>PHONE NUMBER</label>
                <input type="tel" inputMode="tel" value={editForm.phone} onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))} className="glass-input" style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '10px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-secondary-pill" style={{ flex: 1, height: '44px', fontSize: '13px' }} onClick={() => setShowEditProfileModal(false)}>Cancel</button>
              <button type="button" className="btn-primary-pill" style={{ flex: 1, height: '44px', fontSize: '13px', background: 'linear-gradient(135deg, #FF4D8D, #7C4DFF)' }} onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL 3: CHANGE PASSWORD FORM (3-Step)
         ========================================================================== */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,21,53,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 200ms ease' }}>
          <div className="glass-card-elevated" style={{ width: '100%', maxWidth: '380px', padding: '24px', border: '1.5px solid #29B6F6', animation: 'scaleUp 250ms var(--spring-bezier)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', marginBottom: '16px' }}>🔐 Change Account Password</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input type="password" placeholder="Current Password" value={pwdForm.curr} onChange={(e) => setPwdForm(prev => ({ ...prev, curr: e.target.value }))} className="glass-input" style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '10px' }} />
              <input type="password" placeholder="New Password (8+ characters)" value={pwdForm.next} onChange={(e) => setPwdForm(prev => ({ ...prev, next: e.target.value }))} className="glass-input" style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '10px' }} />
              <input type="password" placeholder="Confirm New Password" value={pwdForm.confirm} onChange={(e) => setPwdForm(prev => ({ ...prev, confirm: e.target.value }))} className="glass-input" style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '10px' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-secondary-pill" style={{ flex: 1, height: '44px', fontSize: '13px' }} onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button type="button" className="btn-primary-pill" style={{ flex: 1, height: '44px', fontSize: '13px', background: 'linear-gradient(135deg, #29B6F6, #0288D1)' }} onClick={() => { setShowPasswordModal(false); showToast("✓ Password changed successfully! Session secured."); }}>Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL 4: LANGUAGE SELECTOR
         ========================================================================== */}
      {showLanguageModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,21,53,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 200ms ease' }}>
          <div className="glass-card-elevated" style={{ width: '100%', maxWidth: '340px', padding: '24px', border: '1.5px solid #7C4DFF', animation: 'scaleUp 250ms var(--spring-bezier)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', marginBottom: '16px', textAlign: 'center' }}>🌐 Select App Language</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {['English', 'हिंदी (Hindi)', 'తెలుగు (Telugu)', 'Tamil (தமிழ்)', 'Kannada (ಕನ್ನಡ)'].map((lang, i) => (
                <button
                  key={i}
                  type="button"
                  style={{
                    padding: '12px 16px', borderRadius: '12px', textAlign: 'left', fontWeight: '800', fontSize: '14px', cursor: 'pointer',
                    background: settingsState.language === lang.split(' ')[0] ? 'rgba(124,77,255,0.25)' : 'rgba(255,255,255,0.04)',
                    border: settingsState.language === lang.split(' ')[0] ? '1.5px solid #7C4DFF' : '1px solid rgba(255,255,255,0.1)',
                    color: settingsState.language === lang.split(' ')[0] ? '#FFFFFF' : '#A0A4C8'
                  }}
                  onClick={() => {
                    setSettingsState(prev => ({ ...prev, language: lang.split(' ')[0] }));
                    setShowLanguageModal(false);
                    showToast(`🌐 App display language switched to: ${lang}`);
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button type="button" className="btn-secondary-pill w-100" style={{ height: '42px', fontSize: '13px' }} onClick={() => setShowLanguageModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL 5: DATA & PERSONALIZATION TOGGLES
         ========================================================================== */}
      {showDataModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,21,53,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 200ms ease' }}>
          <div className="glass-card-elevated" style={{ width: '100%', maxWidth: '380px', padding: '24px', border: '1.5px solid #43A047', animation: 'scaleUp 250ms var(--spring-bezier)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', marginBottom: '16px' }}>🛡️ Data & Personalization</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div className="flex-between">
                <div><div style={{ fontSize: '14px', fontWeight: '700', color: '#FFF' }}>Personalized Eyewear Recommendations</div><div style={{ fontSize: '11px', color: '#A0A4C8' }}>Based on face shape & purchase history</div></div>
                <div style={{ width: '42px', height: '24px', borderRadius: '12px', background: settingsState.analyticsAds ? '#43A047' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer' }} onClick={() => setSettingsState(p => ({ ...p, analyticsAds: !p.analyticsAds }))}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '9px', background: '#FFF', position: 'absolute', top: '3px', left: settingsState.analyticsAds ? '21px' : '3px' }} />
                </div>
              </div>

              <div className="flex-between">
                <div><div style={{ fontSize: '14px', fontWeight: '700', color: '#FFF' }}>Anonymous Diagnostic Crash Reports</div><div style={{ fontSize: '11px', color: '#A0A4C8' }}>Helps improve AR Try-On engine stability</div></div>
                <div style={{ width: '42px', height: '24px', borderRadius: '12px', background: settingsState.crashReports ? '#43A047' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer' }} onClick={() => setSettingsState(p => ({ ...p, crashReports: !p.crashReports }))}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '9px', background: '#FFF', position: 'absolute', top: '3px', left: settingsState.crashReports ? '21px' : '3px' }} />
                </div>
              </div>

              <div className="flex-between">
                <div><div style={{ fontSize: '14px', fontWeight: '700', color: '#FFF' }}>Local AR 3D Model Caching</div><div style={{ fontSize: '11px', color: '#A0A4C8' }}>Stores frame meshes for offline virtual try-on</div></div>
                <div style={{ width: '42px', height: '24px', borderRadius: '12px', background: settingsState.arScanCache ? '#43A047' : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer' }} onClick={() => setSettingsState(p => ({ ...p, arScanCache: !p.arScanCache }))}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '9px', background: '#FFF', position: 'absolute', top: '3px', left: settingsState.arScanCache ? '21px' : '3px' }} />
                </div>
              </div>
            </div>
            <button type="button" className="btn-primary-pill w-100" style={{ height: '44px', fontSize: '13px', background: 'linear-gradient(135deg, #43A047, #2E7D32)' }} onClick={() => { setShowDataModal(false); showToast("✓ Privacy & analytics preferences saved."); }}>Save Preferences</button>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL 6: DELETE ACCOUNT CONFIRMATION FLOW
         ========================================================================== */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,21,53,0.9)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 200ms ease' }}>
          <div className="glass-card-elevated" style={{ width: '100%', maxWidth: '380px', padding: '26px', textAlign: 'center', border: '2px solid #EF5350', boxShadow: '0 20px 60px rgba(239,83,80,0.4)', animation: 'scaleUp 250ms var(--spring-bezier)' }}>
            <div style={{ fontSize: '42px', marginBottom: '10px' }}>⚠️</div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#EF5350', marginBottom: '8px' }}>Permanent Account Deletion</h3>
            <p style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '20px', lineHeight: '1.5' }}>
              You are about to permanently delete <strong style={{ color: '#FFF' }}>{userProfile.email}</strong>. This action will immediately erase your stored digital prescriptions, facial AR measurements, and forfeit your remaining ₹99/month club privileges.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-secondary-pill" style={{ flex: 1, height: '46px', fontSize: '13px' }} onClick={() => setShowDeleteModal(false)}>Keep My Account</button>
              <button type="button" style={{ flex: 1, height: '46px', borderRadius: '999px', background: '#EF5350', border: 'none', color: '#FFF', fontWeight: '900', fontSize: '13px', cursor: 'pointer', boxShadow: '0 0 20px rgba(239,83,80,0.6)' }} onClick={() => { setShowDeleteModal(false); showToast("🗑️ Account deletion request scheduled. You have 14 days to cancel via email link."); }}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL 7: TERMS / PRIVACY WEBVIEW SIMULATION
         ========================================================================== */}
      {showTermsModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,21,53,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 200ms ease' }}>
          <div className="glass-card-elevated" style={{ width: '100%', maxWidth: '420px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', border: '1.5px solid #29B6F6', animation: 'scaleUp 250ms var(--spring-bezier)' }}>
            <div className="flex-between" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>📜 {termsType}</h3>
              <button type="button" style={{ background: 'transparent', border: 'none', color: '#A0A4C8', fontSize: '18px', cursor: 'pointer' }} onClick={() => setShowTermsModal(false)}>✕</button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', fontSize: '13px', color: '#CFD8DC', lineHeight: '1.6' }}>
              <h4 style={{ color: '#29B6F6', marginBottom: '8px' }}>1. Medical & Optical Disclaimer</h4>
              <p style={{ marginBottom: '12px' }}>Lens Makers provides digital AI OCR scanning and computerized vision assessments as an adjunct to professional optometry. Lenses manufactured within standard catalog ranges (Sph -6 to +4, Cyl up to -3) are certified under ISO 8980 ophthalmic standards.</p>
              <h4 style={{ color: '#29B6F6', marginBottom: '8px' }}>2. VIP Club & BOGO Terms</h4>
              <p style={{ marginBottom: '12px' }}>The ₹99/month club membership grants flat 25% discount and buy-one-get-one privileges across all stock eyeglasses and sunglasses. Membership renews automatically unless cancelled 24 hours prior to billing cycle.</p>
              <h4 style={{ color: '#29B6F6', marginBottom: '8px' }}>3. Biometric Privacy</h4>
              <p>AR Virtual Try-On facial triangulation meshes are processed locally on device hardware and are never sold or shared with third-party advertisers.</p>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>
              <button type="button" className="btn-primary-pill" style={{ height: '40px', padding: '0 24px', fontSize: '13px', background: 'linear-gradient(135deg, #29B6F6, #0288D1)' }} onClick={() => setShowTermsModal(false)}>Got It</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         MODAL 8: RATE LENS MAKERS (5 Stars Confetti)
         ========================================================================== */}
      {showRatingModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,21,53,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 200ms ease' }}>
          <div className="glass-card-elevated" style={{ width: '100%', maxWidth: '340px', padding: '26px', textAlign: 'center', border: '1.5px solid #FBC02D', animation: 'scaleUp 250ms var(--spring-bezier)' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', marginBottom: '6px' }}>Enjoying Lens Makers?</h3>
            <p style={{ fontSize: '12px', color: '#A0A4C8', marginBottom: '20px' }}>Tap a star to rate your AI Virtual Try-On & shopping experience!</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  style={{ fontSize: '32px', cursor: 'pointer', color: star <= ratingStars ? '#FBC02D' : 'rgba(255,255,255,0.2)', transition: 'transform 150ms ease', transform: star <= ratingStars ? 'scale(1.15)' : 'scale(1)' }}
                  onClick={() => setRatingStars(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-secondary-pill" style={{ flex: 1, height: '44px', fontSize: '13px' }} onClick={() => setShowRatingModal(false)}>Later</button>
              <button type="button" className="btn-primary-pill" style={{ flex: 1, height: '44px', fontSize: '13px', background: 'linear-gradient(135deg, #FBC02D, #F57F17)', color: '#0F1535' }} onClick={() => { setShowRatingModal(false); showToast(`🌟 Thank you for rating us ${ratingStars} stars! Your feedback fuels our optometry team.`); }}>Submit Rating</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.ProfileScreen = ProfileScreen;
