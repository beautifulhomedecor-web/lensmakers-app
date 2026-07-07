// Membership (₹99/Month Club) & BOGO Offer System — Prompt 7 of 10
// VIP 25% Off All Eyewear, Free Monthly Eye Checkup, Shimmer 3D Card, Confetti Welcome, Manage Club
const { useState, useEffect, useMemo, useRef } = React;

const MembershipScreen = ({ onSelectTab, initialViewMode = 'landing', onUpdateMembership }) => {
  const [viewMode, setViewMode] = useState(initialViewMode); // 'landing' | 'payment' | 'welcome' | 'manage'
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' | 'annual'
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Tilt gyroscope simulation state for VIP Card
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12; // -6 to +6 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setCardTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const handleStartPayment = (plan) => {
    setSelectedPlan(plan);
    setViewMode('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompletePayment = () => {
    setIsPaymentLoading(true);
    showToast("💳 Processing encrypted VIP membership activation...");
    setTimeout(() => {
      setIsPaymentLoading(false);
      setViewMode('welcome');
      window.userIsMember = true;
      if (onUpdateMembership) onUpdateMembership(true);
      showToast("🎉 Welcome to the Lens Makers Club!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1600);
  };

  const handleCancelMembership = () => {
    if (window.confirm("⚠️ Are you sure you want to cancel your Lens Makers VIP Club Membership? You will lose your flat 25% discount and priority AR try-on privileges at the end of your billing cycle.")) {
      window.userIsMember = false;
      if (onUpdateMembership) onUpdateMembership(false);
      showToast("ℹ️ Membership cancelled. Rejoin anytime for ₹99/mo!");
      setViewMode('landing');
    }
  };

  // Re-initialize Lucide icons
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }, [viewMode, selectedPlan, openFaqIdx]);

  return (
    <div className="screen-transition-enter" style={{ minHeight: '100vh', paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="lens-toast" style={{ zIndex: 9999 }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUB-NAV MODE SWITCHER (Allows testing Landing vs Welcome vs Manage directly) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px var(--screen-padding) 8px', scrollbarWidth: 'none', background: 'rgba(255,245,236,0.9)', position: 'sticky', top: '0', zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { id: 'landing', label: '👑 Club Overview', badge: '₹99/MO' },
          { id: 'welcome', label: '🎉 Welcome Card Demo', badge: 'ACTIVE' },
          { id: 'manage', label: '⚙️ Manage Plan', badge: window.userIsMember ? 'VIP' : 'OFF' }
        ].map((tab) => {
          const isActive = viewMode === tab.id || (viewMode === 'payment' && tab.id === 'landing');
          return (
            <button
              key={tab.id}
              type="button"
              style={{
                padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', flexShrink: 0,
                background: isActive ? 'linear-gradient(135deg, #8140DC 0%, #FF7873 100%)' : 'rgba(255,240,224,0.65)',
                color: isActive ? '#FFFFFF' : '#A0A4C8',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 200ms ease'
              }}
              onClick={() => setViewMode(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{ background: isActive ? 'rgba(0,0,0,0.25)' : '#8140DC', color: '#FFFFFF', padding: '2px 6px', borderRadius: '999px', fontSize: '9px', fontWeight: '900' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==========================================================================
         SECTION 1: MEMBERSHIP LANDING PAGE
         ========================================================================== */}
      {viewMode === 'landing' && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => { if (onSelectTab) onSelectTab('home'); }}
              >
                ←
              </button>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>Lens Makers Club</h1>
            </div>
            <span className="badge-pill badge-purple">VIP PRIVILEGE</span>
          </div>

          {/* HERO VIP CARD VISUAL (360x200 Metaphor with Shimmer & 3D Tilt) */}
          <div
            ref={cardRef}
            className="vip-card-visual mb-4"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transform: `perspective(800px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Shimmer sweep animation overlay */}
            <div className="vip-card-shimmer" />

            {/* Top Row: Logo & Club Name */}
            <div className="flex-between" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '16px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid #1E88E5' }} />
                  <div style={{ position: 'absolute', right: 0, width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid #43A047' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '1px' }}>LENS MAKERS</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '900', color: '#8140DC', letterSpacing: '3px', textTransform: 'uppercase' }}>CLUB VIP</span>
            </div>

            {/* Center: Large Pricing Display */}
            <div style={{ position: 'relative', zIndex: 2, margin: '14px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '46px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-1px' }}>₹99</span>
                <span style={{ fontSize: '20px', color: '#A0A4C8', fontWeight: '600' }}>/ month</span>
              </div>
            </div>

            {/* Watermark "MEMBER" */}
            <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', fontSize: '72px', fontWeight: '900', color: 'rgba(255,255,255,0.05)', transform: 'rotate(-15deg)', pointerEvents: 'none', zIndex: 1 }}>
              MEMBER
            </div>

            {/* Bottom Row: Benefit Highlight & Status */}
            <div className="flex-between" style={{ position: 'relative', zIndex: 2 }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#29B6F6', background: 'rgba(41,182,246,0.15)', padding: '4px 12px', borderRadius: '999px', border: '1px solid rgba(41,182,246,0.3)' }}>
                ⚡ 25% OFF EVERYTHING
              </span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8' }}>VALID WORLDWIDE</span>
            </div>
          </div>

          {/* Headline Below Card */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Everything You Love, 25% Cheaper.
            </h2>
            <p style={{ fontSize: '14px', color: '#A0A4C8', lineHeight: '1.5', maxWidth: '330px', margin: '0 auto' }}>
              Join thousands of Lens Makers members who save big on every purchase, get free clinical eye tests, and priority try-on access.
            </p>
          </div>

          {/* BENEFIT LIST (Stacked rows with left accents) */}
          <div className="glass-card-standard mb-4" style={{ padding: '8px 16px' }}>
            {[
              { icon: '🏷️', color: '#FF7873', title: 'Flat 25% Off All Eyewear', desc: 'Every frame, every order — no minimum, no exceptions.' },
              { icon: '👁️', color: '#29B6F6', title: '1 Free Online Eye Check-Up/Month', desc: 'Book your monthly vision check — completely free.' },
              { icon: '📸', color: '#8140DC', title: 'Priority AR Try-On Slots', desc: 'Get first access to new frames before general release.' },
              { icon: '🎁', color: '#FF7A30', title: 'Exclusive Member-Only Offers', desc: 'Special BOGO deals, flash sales, and birthday offers.' },
              { icon: '📞', color: '#43A047', title: 'Dedicated Support Line', desc: 'Skip the queue — member-only priority 24/7 support.' }
            ].map((ben, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '22px', background: `${ben.color}22`, border: `1.5px solid ${ben.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {ben.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginBottom: '3px' }}>{ben.title}</div>
                  <div style={{ fontSize: '12px', color: '#A0A4C8', lineHeight: '1.4' }}>{ben.desc}</div>
                </div>
                <div style={{ color: '#43A047', fontSize: '18px', fontWeight: '900' }}>✓</div>
              </div>
            ))}
          </div>

          {/* PRICING SECTION (2 Side-by-Side Options) */}
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px', textAlign: 'center' }}>
            Choose Your Savings Plan
          </h3>
          <div className="grid-2 mb-3" style={{ gap: '14px' }}>
            {/* Left: Monthly Plan */}
            <div className="glass-card-standard" style={{ padding: '18px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: selectedPlan === 'monthly' ? '2px solid #FF7873' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }} onClick={() => setSelectedPlan('monthly')}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#A0A4C8', uppercase: 'true' }}>MONTHLY PLAN</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '8px 0' }}>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#FFFFFF' }}>₹99</span>
                  <span style={{ fontSize: '13px', color: '#A0A4C8' }}>/ month</span>
                </div>
                <div style={{ fontSize: '11px', color: '#6B6E9A', marginBottom: '4px' }}>Billed monthly</div>
                <div style={{ fontSize: '11px', color: '#43A047', fontWeight: '700' }}>✓ Cancel anytime</div>
              </div>
              <button
                type="button"
                className="btn-secondary-pill w-100 mt-3"
                style={{ height: '40px', fontSize: '12px', borderColor: '#FF7873', color: '#FF7873' }}
                onClick={(e) => { e.stopPropagation(); handleStartPayment('monthly'); }}
              >
                Join Monthly →
              </button>
            </div>

            {/* Right: Annual Plan (BEST VALUE) */}
            <div className="glass-card-glow-pink" style={{ padding: '18px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid #FF7873', position: 'relative', cursor: 'pointer' }} onClick={() => setSelectedPlan('annual')}>
              <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#FF7A30', color: '#FFFFFF', padding: '3px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: '900', letterSpacing: '0.5px' }}>
                BEST VALUE 🔥
              </span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#FF7873', uppercase: 'true' }}>ANNUAL PLAN</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '8px 0' }}>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#FFFFFF' }}>₹799</span>
                  <span style={{ fontSize: '13px', color: '#A0A4C8' }}>/ year</span>
                </div>
                <div style={{ fontSize: '12px', color: '#43A047', fontWeight: '800', marginBottom: '2px' }}>Save ₹389 vs monthly!</div>
                <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Effective ₹66.58 / month</div>
              </div>
              <button
                type="button"
                className="btn-primary-pill w-100 mt-3"
                style={{ height: '40px', fontSize: '12px', background: 'linear-gradient(135deg, #FF7A30, #FF7873)' }}
                onClick={(e) => { e.stopPropagation(); handleStartPayment('annual'); }}
              >
                Join Annual →
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#6B6E9A', marginBottom: '32px' }}>
            No lock-in on monthly plan · Cancel anytime directly in app settings
          </div>

          {/* COMPARISON TABLE */}
          <div className="glass-card-standard mb-4" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '16px' }}>
              Why Members Save 5x More
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr', paddingBottom: '10px', borderBottom: '1.5px solid rgba(255,255,255,0.15)', fontWeight: '800', color: '#FF7873' }}>
                <span>Feature</span>
                <span>Non-Member</span>
                <span style={{ color: '#43A047' }}>VIP Member</span>
              </div>
              {/* Rows */}
              {[
                { feat: 'All Eyewear Frames', std: 'Full Price', vip: '-25% OFF', highlight: true },
                { feat: 'Clinical Eye Check-Up', std: '₹199 / test', vip: 'FREE ₹0', highlight: true },
                { feat: 'Buy 1 Get 1 Free Deals', std: 'Standard', vip: 'Priority Access', highlight: false },
                { feat: '24/7 Dedicated Support', std: 'Standard Queue', vip: 'VIP Direct Line', highlight: false }
              ].map((row, idx) => (
                <div
                  key={idx}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr', padding: '12px 0', borderBottom: idx < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: idx % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent', alignItems: 'center' }}
                >
                  <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{row.feat}</span>
                  <span style={{ color: '#A0A4C8' }}>{row.std}</span>
                  <span style={{ color: row.highlight ? '#43A047' : '#FF7873', fontWeight: '900' }}>{row.vip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TESTIMONIALS (Scrollable Quotes) */}
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>
            Loved by 15,000+ Club Members
          </h3>
          <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '32px', scrollbarWidth: 'none' }}>
            {[
              { quote: "I save ₹600+ every order on my family's glasses. The free monthly eye checkup is a blessing!", author: "Priya R.", since: "Member since 2025", initials: "PR", color: "#FF7873" },
              { quote: "Got 2 premium titanium frames at 25% off plus BOGO. Paid less than half of what optical shops charge.", author: "Rahul M.", since: "Member since 2024", initials: "RM", color: "#8140DC" },
              { quote: "Priority AR Try-on and instant delivery tracking makes Lens Makers feel like an Apple product.", author: "Vikram S.", since: "Member since 2026", initials: "VS", color: "#29B6F6" }
            ].map((t, idx) => (
              <div key={idx} className="glass-card-standard" style={{ minWidth: '260px', padding: '18px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#C9A876', fontSize: '14px', marginBottom: '8px' }}>★★★★★</div>
                  <p style={{ fontSize: '13px', color: '#FFFFFF', fontStyle: 'italic', lineHeight: '1.5', marginBottom: '16px' }}>
                    "{t.quote}"
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: t.color, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>{t.author}</div>
                    <div style={{ fontSize: '11px', color: '#A0A4C8' }}>{t.since}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ ACCORDION */}
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>
            Frequently Asked Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
            {[
              { q: "Can I cancel my membership anytime?", a: "Yes! There is zero lock-in on our monthly plan. You can cancel with a single tap in your App Profile settings at any time." },
              { q: "Does the 25% discount apply to sale items too?", a: "Yes, the club 25% discount is applied on top of standard site discounts, giving you guaranteed lowest prices." },
              { q: "How does the free eye check-up work?", a: "As a member, you get 1 free digital video consultation every month with AIOC-certified optometrists. Book instantly via the app." },
              { q: "When does the Buy 1 Get 1 Free (BOGO) offer apply?", a: "Any frame priced ₹1,699 or more automatically qualifies for a free second frame of equal or lesser value!" },
              { q: "Is the annual plan auto-renewed?", a: "We will send you an SMS and email reminder 7 days before your annual renewal date so you are always in complete control." }
            ].map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="glass-card-standard"
                  style={{ padding: '16px', cursor: 'pointer', transition: 'all 200ms ease' }}
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                >
                  <div className="flex-between">
                    <span style={{ fontSize: '14px', fontWeight: '800', color: isOpen ? '#FF7873' : '#FFFFFF' }}>{faq.q}</span>
                    <span style={{ fontSize: '16px', color: '#A0A4C8', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>▼</span>
                  </div>
                  {isOpen && (
                    <div style={{ fontSize: '13px', color: '#A0A4C8', lineHeight: '1.5', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 200ms ease' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* STICKY BOTTOM JOIN CTA */}
          <div style={{ position: 'sticky', bottom: '16px', zIndex: 20 }}>
            <button
              type="button"
              className="btn-primary-pill w-100"
              style={{ height: '56px', fontSize: '16px', fontWeight: '900', background: 'linear-gradient(135deg, #8140DC, #FF7873)', boxShadow: '0 8px 28px rgba(226,47,128,0.6)' }}
              onClick={() => handleStartPayment(selectedPlan)}
            >
              <span>🚀 Join Club for {selectedPlan === 'annual' ? '₹799/year' : '₹99/month'} →</span>
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SECTION 2: MEMBERSHIP JOIN & PAYMENT FLOW
         ========================================================================== */}
      {viewMode === 'payment' && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setViewMode('landing')}
            >
              ←
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>Activate VIP Club</h1>
            <span style={{ width: '36px' }} />
          </div>

          {/* Pre-filled Order Context Card */}
          <div className="glass-card-glow-pink mb-4" style={{ padding: '20px', borderLeft: '4px solid #FF7873' }}>
            <div className="flex-between mb-1">
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', uppercase: 'true' }}>SUBSCRIPTION ORDER SUMMARY</span>
              <span className="badge-pill badge-green">INSTANT ACCESS</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF' }}>
              Lens Makers Club — {selectedPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
            </div>
            <div style={{ fontSize: '13px', color: '#A0A4C8', margin: '4px 0 12px' }}>
              {selectedPlan === 'annual' ? 'Billed once at ₹799/year (Save ₹389!)' : 'Billed monthly at ₹99/month. Cancel anytime.'}
            </div>
            <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
              <span>Total Amount Due:</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#FF7873' }}>{selectedPlan === 'annual' ? '₹799' : '₹99'}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>
            Select Payment Method
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {[
              { id: 'upi', label: '⚡ UPI (GPay, PhonePe, Paytm, BHIM)', desc: 'Instant 1-click activation' },
              { id: 'card', label: '💳 Credit / Debit Card', desc: 'Visa, Mastercard, RuPay, Amex' },
              { id: 'net', label: '🏦 Net Banking / Apple Pay', desc: 'All major Indian & international banks' }
            ].map((m) => {
              const isSel = paymentMethod === m.id;
              return (
                <div
                  key={m.id}
                  className="glass-card-standard"
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: isSel ? '1.5px solid #FF7873' : '1px solid rgba(255,255,255,0.15)', background: isSel ? 'rgba(226,47,128,0.08)' : 'transparent', cursor: 'pointer' }}
                  onClick={() => setPaymentMethod(m.id)}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>{m.label}</div>
                    <div style={{ fontSize: '12px', color: '#A0A4C8' }}>{m.desc}</div>
                  </div>
                  <div style={{ width: '20px', height: '20px', borderRadius: '10px', border: `2px solid ${isSel ? '#FF7873' : '#A0A4C8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isSel && <div style={{ width: '10px', height: '10px', borderRadius: '5px', background: '#FF7873' }} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Confirm Payment Button */}
          <div style={{ position: 'sticky', bottom: '16px', zIndex: 20 }}>
            <button
              type="button"
              className="btn-primary-pill w-100"
              style={{ height: '54px', fontSize: '16px', fontWeight: '800' }}
              disabled={isPaymentLoading}
              onClick={handleCompletePayment}
            >
              <span>{isPaymentLoading ? '⌛ Activating VIP Status...' : `🔒 Confirm Payment of ${selectedPlan === 'annual' ? '₹799' : '₹99'}`}</span>
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SECTION 3: MEMBER WELCOME SCREEN (Confetti Burst & Card Flip)
         ========================================================================== */}
      {viewMode === 'welcome' && (
        <div style={{ padding: '24px var(--screen-padding)', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* Confetti Particles */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            {[...Array(24)].map((_, i) => {
              const colors = ['#FF7873', '#8140DC', '#29B6F6', '#43A047', '#C9A876'];
              const col = colors[i % colors.length];
              const left = Math.random() * 95;
              const delay = Math.random() * 0.8;
              return (
                <div
                  key={i}
                  className="confetti-particle"
                  style={{ background: col, left: `${left}%`, animationDelay: `${delay}s`, width: `${8 + (i % 6)}px`, height: `${8 + (i % 6)}px` }}
                />
              );
            })}
          </div>

          {/* Animated Membership Card (Flips in from above) */}
          <div
            className="vip-card-visual mb-4"
            style={{ width: '320px', height: '190px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'slideInDown 600ms var(--spring-bezier)', boxShadow: '0 20px 50px rgba(129,64,220,0.6)' }}
          >
            <div className="flex-between">
              <span style={{ fontSize: '12px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '1px' }}>LENS MAKERS CLUB</span>
              <span className="badge-pill badge-green" style={{ padding: '4px 10px', fontSize: '10px' }}>ACTIVE MEMBER ✓</span>
            </div>

            <div style={{ textAlign: 'left', margin: '10px 0' }}>
              <div style={{ fontSize: '11px', color: '#A0A4C8', uppercase: 'true' }}>MEMBER NAME</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.5px' }}>Alex Rivera</div>
            </div>

            <div className="flex-between">
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#29B6F6' }}>⚡ 25% OFF ALL ORDERS</span>
              <span style={{ fontSize: '11px', color: '#A0A4C8' }}>ID: LM-VIP-9821</span>
            </div>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#FFFFFF', marginBottom: '8px', zIndex: 10 }}>
            Welcome to Lens Makers Club! 🎉
          </h1>
          <p style={{ fontSize: '15px', color: '#A0A4C8', maxWidth: '300px', margin: '0 auto 28px', lineHeight: '1.5', zIndex: 10 }}>
            Your 25% flat discount is now active across all eyewear collections, plus your free monthly eye checkup is ready to book!
          </p>

          <button
            type="button"
            className="btn-primary-pill"
            style={{ width: '280px', height: '54px', fontSize: '16px', fontWeight: '900', background: 'linear-gradient(135deg, #8140DC, #FF7873)', zIndex: 10 }}
            onClick={() => {
              showToast("🛍️ Applying 25% VIP savings to shop catalog...");
              if (onSelectTab) onSelectTab('shop');
            }}
          >
            <span>Start Shopping (25% Off) →</span>
          </button>
        </div>
      )}

      {/* ==========================================================================
         SECTION 4: MANAGE MEMBERSHIP DASHBOARD
         ========================================================================== */}
      {viewMode === 'manage' && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-4">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => { if (onSelectTab) onSelectTab('profile'); else setViewMode('landing'); }}
            >
              ←
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>Manage Club Membership</h1>
            <span style={{ width: '36px' }} />
          </div>

          {/* Active Status Card */}
          <div className="glass-card-glow-purple mb-4" style={{ padding: '20px' }}>
            <div className="flex-between mb-2">
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#8140DC', letterSpacing: '1px' }}>VIP PRIVILEGE STATUS</span>
              <span className={`badge-pill ${window.userIsMember ? 'badge-green' : 'badge-orange'}`}>
                {window.userIsMember ? 'ACTIVE MEMBER ✓' : 'INACTIVE ✕'}
              </span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', marginBottom: '4px' }}>
              Lens Makers Club — {selectedPlan === 'annual' ? 'Annual Tier' : 'Monthly Tier'}
            </div>
            <div style={{ fontSize: '13px', color: '#A0A4C8', marginBottom: '14px' }}>
              {window.userIsMember ? 'Next renewal: July 28, 2026 · Auto-billing active' : 'Your VIP discount is currently disabled.'}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary-pill"
                style={{ flex: 1, height: '40px', fontSize: '13px', background: window.userIsMember ? 'rgba(255,255,255,0.1)' : '#8140DC', border: window.userIsMember ? '1px solid rgba(255,255,255,0.2)' : 'none' }}
                onClick={() => {
                  window.userIsMember = !window.userIsMember;
                  if (onUpdateMembership) onUpdateMembership(window.userIsMember);
                  showToast(window.userIsMember ? "⚡ VIP Membership re-activated!" : "ℹ️ VIP Membership paused.");
                  setViewMode('manage'); // re-render
                }}
              >
                {window.userIsMember ? '⏸️ Pause Membership' : '⚡ Reactivate Now'}
              </button>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ flex: 1, height: '40px', fontSize: '13px', borderColor: '#FF7873', color: '#FF7873' }}
                onClick={() => showToast('💳 Opening encrypted payment method updater...')}
              >
                💳 Change Card
              </button>
            </div>
          </div>

          {/* Member Benefits Accordion */}
          <div className="glass-card-standard mb-4" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>
              Your Active Member Privileges
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#A0A4C8' }}>
              <div className="flex-between"><span>🏷️ Flat 25% Off All Eyewear</span><span style={{ color: '#43A047', fontWeight: '800' }}>ACTIVE ✓</span></div>
              <div className="flex-between"><span>👁️ 1 Free Monthly Eye Check-Up</span><span style={{ color: '#43A047', fontWeight: '800' }}>1 SLOT READY</span></div>
              <div className="flex-between"><span>📸 Priority AR Try-On Slots</span><span style={{ color: '#43A047', fontWeight: '800' }}>ACTIVE ✓</span></div>
              <div className="flex-between"><span>🎁 Buy 1 Get 1 Free Offers</span><span style={{ color: '#43A047', fontWeight: '800' }}>ELIGIBLE ✓</span></div>
            </div>
          </div>

          {/* Cancellation Section */}
          <div className="glass-card-standard" style={{ padding: '18px', textAlign: 'center', border: '1px solid rgba(244,67,54,0.3)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FF5252', marginBottom: '6px' }}>
              Danger Zone
            </h3>
            <p style={{ fontSize: '12px', color: '#A0A4C8', marginBottom: '14px' }}>
              Cancelling will immediately terminate your 25% store discount and free optometry slots.
            </p>
            <button
              type="button"
              style={{ padding: '10px 20px', borderRadius: '999px', background: 'rgba(244,67,54,0.15)', border: '1.5px solid #FF5252', color: '#FF5252', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              onClick={handleCancelMembership}
            >
              Cancel VIP Subscription ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

window.MembershipScreen = MembershipScreen;
