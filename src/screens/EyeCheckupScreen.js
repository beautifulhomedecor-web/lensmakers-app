// Eye Check-Up & Online Tracking System — Prompt 6 of 10
// Free 15-min Optometry Consult Booking, 3-Step Flow, Live Order Tracking #LM-20482, Appointment Status
const { useState, useEffect, useMemo } = React;

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"
];

const BOOKED_SLOTS = ["11:30 AM", "3:30 PM", "5:30 PM"];

const EyeCheckupScreen = ({ onSelectTab, initialViewMode = 'landing' }) => {
  // Navigation & Flow State
  const [viewMode, setViewMode] = useState(initialViewMode); // 'landing' | 'booking' | 'order_tracking' | 'appointment_tracking'
  const [bookingStep, setBookingStep] = useState(1); // 1 | 2 | 3 | 'success'
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Step 1: Date & Time Selection
  const [selectedDateIdx, setSelectedDateIdx] = useState(0); // Default to Today
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM");

  // Step 2: Patient Details Form
  const [formData, setFormData] = useState({
    fullName: "Alex Rivera",
    mobile: "+91 98765 43210",
    email: "alex.rivera@lensmakers.in",
    age: "28",
    wearGlasses: true,
    currentRx: "-1.50 SPH Both Eyes (Antigravity Blue Light)",
    reason: "Routine check-up",
    conditions: "",
    language: "English"
  });

  // Step 3: Confirmation Checkbox
  const [termsChecked, setTermsChecked] = useState(false);

  // Generate 14 upcoming days
  const datesList = useMemo(() => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const list = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const isBookedDay = (i === 4 || i === 9); // Demonstrate fully booked days

      list.push({
        idx: i,
        dayName: days[d.getDay()],
        dateNum: d.getDate(),
        monthName: months[d.getMonth()],
        fullString: `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, 2026`,
        isBooked: isBookedDay,
        isToday: i === 0
      });
    }
    return list;
  }, []);

  const selectedDateObj = datesList[selectedDateIdx] || datesList[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyText = (text, label) => {
    try {
      navigator.clipboard.writeText(text);
      showToast(`📋 Copied ${label} to clipboard!`);
    } catch (err) {
      showToast(`📋 ${label}: ${text}`);
    }
  };

  const handleConfirmBooking = () => {
    if (!termsChecked) {
      showToast("⚠️ Please agree to the consultation terms to proceed.");
      return;
    }
    setIsBookingLoading(true);
    showToast("🔄 Connecting to clinic scheduling server...");
    setTimeout(() => {
      setIsBookingLoading(false);
      setBookingStep('success');
      showToast("🎉 Appointment Confirmed!");
    }, 1500);
  };

  // Re-initialize Lucide icons
  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }, [viewMode, bookingStep, selectedDateIdx, selectedTimeSlot, termsChecked]);

  return (
    <div className="screen-transition-enter" style={{ minHeight: '100vh', paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="lens-toast" style={{ zIndex: 9999 }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUB-NAV MODE SWITCHER BAR (Allows user to switch between Booking, Order Tracking & Appointment Tracking) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px var(--screen-padding) 8px', scrollbarWidth: 'none', background: 'rgba(255,245,236,0.9)', position: 'sticky', top: '0', zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { id: 'landing', label: '👁️ Free Eye Test', badge: 'FREE' },
          { id: 'order_tracking', label: '📦 Order #LM-20482', badge: 'LIVE' },
          { id: 'appointment_tracking', label: '📅 My Appointment', badge: 'TODAY' }
        ].map((tab) => {
          const isActive = (viewMode === tab.id || (viewMode === 'booking' && tab.id === 'landing'));
          return (
            <button
              key={tab.id}
              type="button"
              style={{
                padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', flexShrink: 0,
                background: isActive ? 'linear-gradient(135deg, #FF7873 0%, #E22F80 100%)' : 'rgba(255,240,224,0.65)',
                color: isActive ? '#FFFFFF' : '#A0A4C8',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 200ms ease'
              }}
              onClick={() => {
                setViewMode(tab.id);
                if (tab.id === 'landing') setBookingStep(1);
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{ background: isActive ? 'rgba(0,0,0,0.25)' : '#43A047', color: '#FFFFFF', padding: '2px 6px', borderRadius: '999px', fontSize: '9px', fontWeight: '900' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==========================================================================
         SECTION 1: EYE CHECK-UP LANDING PAGE
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
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>Free Eye Check-Up</h1>
            </div>
            <span className="badge-pill badge-green">AIOC CERTIFIED</span>
          </div>

          {/* HERO CARD (Cyan Glow Variant) */}
          <div className="glass-card-glow-cyan mb-3" style={{ padding: '32px 20px', textAlign: 'center', position: 'relative' }}>
            {/* 100% FREE pill badge */}
            <span style={{ background: '#43A047', color: '#FFFFFF', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '900', boxShadow: '0 4px 12px rgba(67,160,71,0.4)', display: 'inline-block', marginBottom: '20px' }}>
              100% FREE FOREVER
            </span>

            {/* Illustration: Laptop Screen + Doctor Avatar Circle */}
            <div style={{ position: 'relative', width: '180px', height: '120px', margin: '0 auto 24px', background: 'rgba(41,182,246,0.1)', border: '2px solid rgba(41,182,246,0.4)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(41,182,246,0.2)' }}>
              {/* Snellen Eye Chart Simulation */}
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '8px' }}>E</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#29B6F6', letterSpacing: '6px', margin: '2px 0' }}>F P</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', letterSpacing: '4px' }}>T O Z</div>
              <div style={{ fontSize: '9px', fontWeight: '600', color: '#6B6E9A', letterSpacing: '2px' }}>L P E D</div>

              {/* Doctor Avatar Circle Badge */}
              <div style={{ position: 'absolute', bottom: '-14px', right: '-14px', width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #43A047, #1E88E5)', border: '2.5px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                👨‍⚕️
              </div>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', marginBottom: '10px', letterSpacing: '-0.5px' }}>
              Check Your Vision From Home
            </h2>
            <p style={{ fontSize: '14px', color: '#A0A4C8', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto' }}>
              Our certified optometrists conduct your eye test via video call. Takes only 15-20 minutes. Get your digital prescription instantly.
            </p>
          </div>

          {/* BENEFIT TILES (2x2 Grid) */}
          <div className="grid-2 mb-4" style={{ gap: '12px' }}>
            {[
              { icon: '📋', title: 'Digital Prescription', desc: 'Sent to your phone instantly' },
              { icon: '👨‍⚕️', title: 'Certified Optometrist', desc: 'AIOC-certified professionals' },
              { icon: '⏱️', title: '15-20 Minutes', desc: 'Quick, thorough assessment' },
              { icon: '🏠', title: 'From Home', desc: 'No travel, no waiting room' }
            ].map((tile, idx) => (
              <div key={idx} className="glass-card-standard" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '30px' }}>{tile.icon}</span>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>{tile.title}</div>
                <div style={{ fontSize: '11px', color: '#A0A4C8', lineHeight: '1.4' }}>{tile.desc}</div>
              </div>
            ))}
          </div>

          {/* PRIMARY CTA & FOOTNOTE */}
          <button
            type="button"
            className="btn-primary-pill w-100 mb-2"
            style={{ height: '54px', fontSize: '16px', fontWeight: '800' }}
            onClick={() => {
              setViewMode('booking');
              setBookingStep(1);
              showToast("📅 Step 1: Select your preferred date and time slot");
            }}
          >
            <span>Book My Free Eye Test</span>
          </button>
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#6B6E9A', fontWeight: '600' }}>
            No credit card required · Completely free forever
          </div>
        </div>
      )}

      {/* ==========================================================================
         SECTION 2: BOOKING FLOW (3-Step with Progress Indicator)
         ========================================================================== */}
      {viewMode === 'booking' && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-3">
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => {
                if (bookingStep === 1) setViewMode('landing');
                else if (bookingStep === 'success') setViewMode('landing');
                else setBookingStep(bookingStep - 1);
              }}
            >
              ←
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>
              {bookingStep === 'success' ? 'Appointment Confirmed' : `Step ${bookingStep} of 3`}
            </h1>
            <span style={{ width: '36px' }} />
          </div>

          {/* PROGRESS INDICATOR BAR (Hidden on success screen) */}
          {bookingStep !== 'success' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 10px 24px', position: 'relative' }}>
              {[
                { step: 1, label: 'Choose Time' },
                { step: 2, label: 'Your Details' },
                { step: 3, label: 'Confirm' }
              ].map((item, idx) => {
                const isCompleted = bookingStep > item.step;
                const isCurrent = bookingStep === item.step;
                const color = (isCompleted || isCurrent) ? '#FF7873' : 'rgba(255,255,255,0.25)';

                return (
                  <React.Fragment key={item.step}>
                    {/* Dot + Label */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: (isCompleted || isCurrent) ? '#FF7873' : 'rgba(11, 42, 107, 0.15)',
                          border: `2px solid ${color}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#FFFFFF', fontSize: '11px', fontWeight: '800',
                          boxShadow: isCurrent ? '0 0 16px rgba(226,47,128,0.8)' : 'none',
                          animation: isCurrent ? 'pulseGlowAnim 1.5s infinite ease-in-out' : 'none'
                        }}
                      >
                        {isCompleted ? '✓' : item.step}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: color, marginTop: '6px', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                    </div>

                    {/* Connecting Line between dots */}
                    {idx < 2 && (
                      <div style={{ flex: 1, height: '3px', background: bookingStep > idx + 1 ? '#FF7873' : 'rgba(255,255,255,0.15)', margin: '0 8px', transform: 'translateY(-10px)', transition: 'background 300ms ease' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* STEP 1: CHOOSE DATE & TIME */}
          {bookingStep === 1 && (
            <div className="fade-up-item">
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>
                Select Date (Next 14 Days)
              </h2>
              {/* Horizontal Scrollable Date Chips */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px', scrollbarWidth: 'none' }}>
                {datesList.map((dt) => {
                  const isSel = selectedDateIdx === dt.idx;
                  return (
                    <div
                      key={dt.idx}
                      className={`date-chip ${isSel ? 'selected' : ''} ${dt.isBooked ? 'booked' : ''}`}
                      onClick={() => {
                        if (dt.isBooked) {
                          showToast(`🚫 No slots available on ${dt.dayName}, ${dt.monthName} ${dt.dateNum}. Please choose another date.`);
                        } else {
                          setSelectedDateIdx(dt.idx);
                          showToast(`📅 Date selected: ${dt.fullString}`);
                        }
                      }}
                    >
                      {dt.isToday && (
                        <span style={{ fontSize: '9px', fontWeight: '900', color: isSel ? '#FFFFFF' : '#29B6F6', marginBottom: '2px', textTransform: 'uppercase' }}>
                          Today
                        </span>
                      )}
                      <span style={{ fontSize: '10px', fontWeight: '700', color: isSel ? '#FFFFFF' : '#A0A4C8' }}>{dt.dayName}</span>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', margin: '2px 0' }}>{dt.dateNum}</span>
                      <span style={{ fontSize: '10px', fontWeight: '600', color: isSel ? '#FFFFFF' : '#A0A4C8' }}>{dt.monthName}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex-between mb-2">
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>
                  Select Time Slot ({selectedDateObj.dayName}, {selectedDateObj.monthName} {selectedDateObj.dateNum})
                </h2>
                <span style={{ fontSize: '11px', color: '#43A047', fontWeight: '700' }}>● All times in IST</span>
              </div>

              {/* Time Slot Grid (3 columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '32px' }}>
                {TIME_SLOTS.map((slot, idx) => {
                  const isBooked = BOOKED_SLOTS.includes(slot);
                  const isSel = selectedTimeSlot === slot;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`time-slot-pill ${isSel ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                      disabled={isBooked}
                      onClick={() => {
                        setSelectedTimeSlot(slot);
                        showToast(`⏰ Time slot selected: ${slot}`);
                      }}
                    >
                      {slot} {isBooked && ' (Full)'}
                    </button>
                  );
                })}
              </div>

              {/* Sticky Bottom Continue Button */}
              <div style={{ position: 'sticky', bottom: '16px', zIndex: 20 }}>
                <button
                  type="button"
                  className="btn-primary-pill w-100"
                  style={{ height: '52px', fontSize: '15px', fontWeight: '800', opacity: (!selectedTimeSlot || selectedDateObj.isBooked) ? 0.5 : 1, transition: 'all 200ms ease' }}
                  disabled={!selectedTimeSlot || selectedDateObj.isBooked}
                  onClick={() => {
                    setBookingStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Continue to Patient Details →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: YOUR DETAILS */}
          {bookingStep === 2 && (
            <div className="fade-up-item">
              <div className="glass-card-elevated" style={{ padding: '22px 18px', marginBottom: '24px' }}>
                <div className="flex-between mb-3">
                  <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>Patient Information</h2>
                  <span className="badge-pill badge-purple">PRE-FILLED</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="glass-input"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  {/* Mobile Number & Age row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>Mobile Number</label>
                      <input
                        type="tel"
                        className="glass-input"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="+91..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>Age 📅</label>
                      <input
                        type="number"
                        className="glass-input"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="Age"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>Email Address (For Google Meet link)</label>
                    <input
                      type="email"
                      className="glass-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Wear Glasses Toggle */}
                  <div className="flex-between" style={{ background: 'rgba(255,240,224,0.5)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>Do you currently wear glasses?</div>
                      <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Helps optometrist calibrate baseline power</div>
                    </div>
                    <button
                      type="button"
                      style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '800', background: formData.wearGlasses ? '#FF7873' : 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', cursor: 'pointer', transition: 'all 200ms ease' }}
                      onClick={() => setFormData({ ...formData, wearGlasses: !formData.wearGlasses })}
                    >
                      {formData.wearGlasses ? 'YES ✓' : 'NO ✕'}
                    </button>
                  </div>

                  {/* Expandable Current Prescription field */}
                  {formData.wearGlasses && (
                    <div style={{ background: 'rgba(255,235,210,0.6)', padding: '14px', borderRadius: '14px', border: '1px dashed rgba(226,47,128,0.4)', animation: 'slideInRight 300ms ease' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#FF7873', display: 'block', marginBottom: '6px' }}>Current Prescription (Optional)</label>
                      <input
                        type="text"
                        className="glass-input mb-2"
                        value={formData.currentRx}
                        onChange={(e) => setFormData({ ...formData, currentRx: e.target.value })}
                        placeholder="-1.50 SPH / +0.50 CYL..."
                      />
                      <button
                        type="button"
                        className="btn-secondary-pill w-100"
                        style={{ height: '36px', fontSize: '12px' }}
                        onClick={() => showToast('📸 Opening camera to scan paper prescription...')}
                      >
                        📸 Scan or Upload Paper Prescription
                      </button>
                    </div>
                  )}

                  {/* Reason for Eye Test Segmented Radio */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '8px' }}>Reason for Eye Test</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {["Routine check-up", "Vision seems blurry", "Eye strain / headaches", "Updating prescription", "First time check"].map((rs, idx) => {
                        const isSel = formData.reason === rs;
                        return (
                          <button
                            key={idx}
                            type="button"
                            style={{ padding: '8px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', background: isSel ? '#FF7873' : 'rgba(255,255,255,0.06)', color: '#FFFFFF', border: isSel ? 'none' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
                            onClick={() => setFormData({ ...formData, reason: rs })}
                          >
                            {rs}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Language Dropdown */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', display: 'block', marginBottom: '6px' }}>Preferred Consultation Language</label>
                    <select
                      className="glass-input"
                      style={{ background: 'rgba(255, 255, 255, 0.95)', color: '#FFFFFF', cursor: 'pointer' }}
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    >
                      <option value="English">English</option>
                      <option value="हिंदी">हिंदी (Hindi)</option>
                      <option value="తెలుగు">తెలుగు (Telugu)</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Kannada">Kannada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Continue Button */}
              <div style={{ position: 'sticky', bottom: '16px', zIndex: 20 }}>
                <button
                  type="button"
                  className="btn-primary-pill w-100"
                  style={{ height: '52px', fontSize: '15px', fontWeight: '800' }}
                  onClick={() => {
                    setBookingStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Continue to Confirmation →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRM & BOOK */}
          {bookingStep === 3 && (
            <div className="fade-up-item">
              {/* Summary Card */}
              <div className="glass-card-elevated mb-3" style={{ padding: '22px 18px', borderLeft: '4px solid #43A047' }}>
                <div className="flex-between mb-2">
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    APPOINTMENT SUMMARY
                  </span>
                  <span className="badge-pill badge-green">VERIFIED SLOT</span>
                </div>

                <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', marginBottom: '8px' }}>
                  📅 {selectedDateObj.fullString} at {selectedTimeSlot}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#A0A4C8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Patient:</span> {formData.fullName} ({formData.age} yrs)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Doctor:</span> Dr. Ananya Sharma, AIOC Certified Optometrist
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Mode:</span> 🎥 Video Call (Google Meet link via SMS & Email)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Language:</span> {formData.language}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Total Consultation Fee:</span>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#43A047' }}>FREE ₹0</span>
                  </div>
                </div>
              </div>

              {/* What to prepare accordion */}
              <div className="glass-card-standard mb-3" style={{ padding: '18px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>
                  💡 What to Prepare Before Your Call
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#A0A4C8' }}>
                  <div>✓ Be in a well-lit room without window glare behind you</div>
                  <div>✓ Have your existing glasses and previous prescriptions ready</div>
                  <div>✓ Use a computer/laptop or stable tablet stand for best experience</div>
                  <div>✓ Test your camera and microphone 5 minutes beforehand</div>
                </div>
              </div>

              {/* Terms Checkbox Line */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '0 4px', marginBottom: '28px' }}>
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#FF7873', marginTop: '2px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', color: '#A0A4C8', lineHeight: '1.5' }}>
                  I agree to receive reminders via SMS/Email and understand this is a free digital screening and consultation, not a substitute for an emergency hospital visit.
                </span>
              </label>

              {/* Sticky Bottom Confirm Button */}
              <div style={{ position: 'sticky', bottom: '16px', zIndex: 20 }}>
                <button
                  type="button"
                  className="btn-primary-pill w-100"
                  style={{ height: '54px', fontSize: '16px', fontWeight: '800', opacity: !termsChecked ? 0.5 : 1 }}
                  disabled={!termsChecked || isBookingLoading}
                  onClick={handleConfirmBooking}
                >
                  <span>{isBookingLoading ? '⌛ Confirming Your Slot...' : '🎉 Confirm Free Booking Now'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS SCREEN */}
          {bookingStep === 'success' && (
            <div className="fade-up-item" style={{ textAlign: 'center', padding: '20px 0' }}>
              {/* Checkmark Animation Circle */}
              <div style={{ width: '96px', height: '96px', borderRadius: '48px', background: 'linear-gradient(135deg, #43A047, #1E88E5)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#FFFFFF', boxShadow: '0 8px 32px rgba(67,160,71,0.5)', animation: 'pulseGlowAnim 2s infinite ease-in-out' }}>
                ✓
              </div>

              <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#FFFFFF', marginBottom: '8px' }}>
                Booking Confirmed! 🎉
              </h1>
              <p style={{ fontSize: '14px', color: '#A0A4C8', marginBottom: '24px' }}>
                Your appointment is locked in with Dr. Ananya Sharma.
              </p>

              {/* Booking Reference Card */}
              <div className="glass-card-elevated mb-3" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', textAlign: 'left' }}>BOOKING REFERENCE</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '1px', marginTop: '2px' }}>Ref: LM-EC-20482</div>
                </div>
                <button
                  type="button"
                  className="btn-secondary-pill"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                  onClick={() => handleCopyText('LM-EC-20482', 'Booking Ref')}
                >
                  📋 Copy Ref
                </button>
              </div>

              {/* Meeting Link Card */}
              <div className="glass-card-glow-cyan mb-4" style={{ padding: '20px', textAlign: 'left' }}>
                <div className="flex-between mb-2">
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>🎥 Video Consultation Room</span>
                  <span className="badge-pill badge-green">ACTIVE LINK</span>
                </div>
                <div style={{ fontSize: '13px', color: '#29B6F6', fontWeight: '700', wordBreak: 'break-all', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', marginBottom: '14px' }}>
                  https://meet.google.com/lms-eye-2026
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-primary-pill"
                    style={{ flex: 1, height: '42px', fontSize: '13px', background: 'linear-gradient(135deg, #1E88E5, #1565C0)' }}
                    onClick={() => showToast('📅 Added July 10 at 10:00 AM to your Apple/Google Calendar!')}
                  >
                    📅 Add to Calendar
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-pill"
                    style={{ flex: 1, height: '42px', fontSize: '13px' }}
                    onClick={() => handleCopyText('https://meet.google.com/lms-eye-2026', 'Video Meet Link')}
                  >
                    🔗 Copy Link
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#6B6E9A', marginBottom: '30px' }}>
                * You will receive an automated reminder SMS and email 30 mins prior.
              </div>

              {/* Bottom Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                  type="button"
                  className="btn-secondary-pill"
                  style={{ flex: 1, height: '48px', fontSize: '14px' }}
                  onClick={() => {
                    setBookingStep(1);
                    setSelectedTimeSlot("11:00 AM");
                  }}
                >
                  Book Another
                </button>
                <button
                  type="button"
                  className="btn-primary-pill"
                  style={{ flex: 1, height: '48px', fontSize: '14px' }}
                  onClick={() => {
                    setViewMode('appointment_tracking');
                    showToast("📅 Switched to Appointment Status View");
                  }}
                >
                  Track My Appointment →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================================================
         SECTION 3: ONLINE ORDER TRACKING (#LM-20482)
         ========================================================================== */}
      {viewMode === 'order_tracking' && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setViewMode('landing')}
              >
                ←
              </button>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>Track Order #LM-20482</h1>
            </div>
            <span className="badge-pill badge-pink">OUT FOR DELIVERY</span>
          </div>

          {/* ORDER SUMMARY MINI-CARD */}
          <div className="glass-card-elevated mb-4" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              🕶️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#A0A4C8', uppercase: 'true' }}>LENS MAKERS CLASSIC</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', margin: '2px 0' }}>Milan Aviator Gold #204</div>
              <div className="flex-between" style={{ fontSize: '12px', color: '#6B6E9A', marginTop: '4px' }}>
                <span>Ordered: June 28, 2026</span>
                <span style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF' }}>₹3,499</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#29B6F6', marginTop: '6px' }}>
                🚚 Estimated delivery: Today by 6:00 PM
              </div>
            </div>
          </div>

          {/* LIVE TRACKING TIMELINE CARD */}
          <div className="glass-card-standard mb-4" style={{ padding: '24px 20px', position: 'relative' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '20px' }}>
              Real-Time Shipment Progress
            </h3>

            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              {/* Vertical Background Line */}
              <div className="tracking-timeline-line" />
              {/* Animated Progress Line */}
              <div className="tracking-timeline-progress" />

              {/* STEP 1: Order Placed */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                <div className="tracking-dot completed" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>✓</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Order Placed</div>
                  <div style={{ fontSize: '12px', color: '#A0A4C8' }}>June 28 · 9:30 AM</div>
                </div>
              </div>

              {/* STEP 2: Order Confirmed & Packed */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                <div className="tracking-dot completed" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>✓</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Order Confirmed & Lenses Crafted</div>
                  <div style={{ fontSize: '12px', color: '#A0A4C8' }}>June 28 · 2:15 PM</div>
                </div>
              </div>

              {/* STEP 3: Picked Up by Courier */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                <div className="tracking-dot completed" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>✓</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Picked Up by Courier Facility</div>
                  <div style={{ fontSize: '12px', color: '#A0A4C8' }}>June 29 · 10:00 AM</div>
                </div>
              </div>

              {/* STEP 4: Out for Delivery (CURRENT STEP - PULSING PINK DOT) */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '28px', position: 'relative' }}>
                <div className="tracking-dot current" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>●</div>
                <div style={{ width: '100%' }}>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#FF7873' }}>Out for Delivery 🚀</div>
                  <div style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: '600', marginBottom: '12px' }}>
                    July 3 · Expected arrival between 2:00 PM - 6:00 PM
                  </div>

                  {/* Courier Info Sub-Card */}
                  <div style={{ background: 'rgba(255,240,224,0.8)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>Courier: Bluedart Express</div>
                      <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Tracking ID: BD-7829310</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        style={{ padding: '6px 12px', borderRadius: '999px', background: '#1E88E5', color: '#FFFFFF', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => alert('📞 Calling delivery executive Vikram (9876543210)...')}
                      >
                        📞 Call Courier
                      </button>
                      <button
                        type="button"
                        style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                        onClick={() => handleCopyText('BD-7829310', 'Tracking Number')}
                      >
                        🔗 Copy ID
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 5: Delivered */}
              <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                <div className="tracking-dot upcoming" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>○</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#A0A4C8' }}>Delivered</div>
                  <div style={{ fontSize: '12px', color: '#6B6E9A' }}>Expected: Today by evening</div>
                </div>
              </div>
            </div>
          </div>

          {/* NEED HELP CARD */}
          <div className="glass-card-elevated" style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>
              Need Help With This Order?
            </h3>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                style={{ padding: '8px 14px', borderRadius: '999px', background: 'rgba(244, 67, 54, 0.15)', border: '1px solid rgba(244, 67, 54, 0.4)', color: '#FF5252', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => alert('⚠️ Order Cancellation: Package is already out for delivery. You may refuse delivery at the doorstep for instant return processing.')}
              >
                Cancel Order
              </button>
              <button
                type="button"
                style={{ padding: '8px 14px', borderRadius: '999px', background: 'rgba(201, 168, 118, 0.15)', border: '1px solid rgba(201, 168, 118, 0.4)', color: '#C9A876', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => showToast('🛠️ Issue reported to priority escalation team')}
              >
                Report Issue
              </button>
              <button
                type="button"
                style={{ padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#A0A4C8', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => showToast('🔄 14-Day Free Exchange portal opening...')}
              >
                Return / Exchange
              </button>
            </div>
            <button
              type="button"
              className="btn-secondary-pill w-100"
              style={{ height: '46px', fontSize: '14px', border: '1.5px solid #FF7873', color: '#FFFFFF' }}
              onClick={() => showToast('💬 Opening live chat with Lens Makers Support Agent...')}
            >
              💬 Chat with Support (24/7)
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================================
         SECTION 4: APPOINTMENT TRACKING (For Eye Check-Up Bookings)
         ========================================================================== */}
      {viewMode === 'appointment_tracking' && (
        <div style={{ padding: '16px var(--screen-padding)' }}>
          {/* Header */}
          <div className="flex-between mb-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setViewMode('landing')}
              >
                ←
              </button>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>Appointment #LM-EC-20482</h1>
            </div>
            <span className="badge-pill badge-green">LIVE ROOM READY</span>
          </div>

          {/* DOCTOR & MEET CARD */}
          <div className="glass-card-glow-cyan mb-4" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'linear-gradient(135deg, #43A047, #1E88E5)', border: '2.5px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
              👨‍⚕️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#29B6F6', uppercase: 'true' }}>OPTOMETRY SPECIALIST</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', margin: '2px 0' }}>Dr. Ananya Sharma</div>
              <div style={{ fontSize: '12px', color: '#A0A4C8' }}>AIOC Certified · 12 yrs clinical exp</div>
              <div style={{ color: '#C9A876', fontSize: '12px', marginTop: '4px' }}>★ 4.9 (1,420 consults)</div>
            </div>
          </div>

          {/* LIVE CONSULTATION ACTION BUTTON */}
          <button
            type="button"
            className="btn-primary-pill w-100 mb-4"
            style={{ height: '54px', fontSize: '16px', fontWeight: '800', background: 'linear-gradient(135deg, #43A047, #1E88E5)', boxShadow: '0 8px 24px rgba(67,160,71,0.5)', animation: 'pulseGlowAnim 2s infinite ease-in-out' }}
            onClick={() => {
              showToast("🎥 Joining Google Meet encrypted consultation room...");
              window.open("https://meet.google.com/lms-eye-2026", "_blank");
            }}
          >
            <span>🎥 Join Video Consultation Now →</span>
          </button>

          {/* APPOINTMENT TRACKING TIMELINE CARD */}
          <div className="glass-card-standard mb-4" style={{ padding: '24px 20px', position: 'relative' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '20px' }}>
              Consultation Status Timeline
            </h3>

            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              <div className="tracking-timeline-line" />
              <div className="tracking-timeline-progress" style={{ height: '55%' }} />

              {/* STEP 1: Booking Confirmed */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                <div className="tracking-dot completed" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>✓</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Booking Confirmed</div>
                  <div style={{ fontSize: '12px', color: '#A0A4C8' }}>July 1, 2026 · 11:00 AM</div>
                </div>
              </div>

              {/* STEP 2: Reminder Sent */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                <div className="tracking-dot completed" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>✓</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Automated Reminder SMS & Email Sent</div>
                  <div style={{ fontSize: '12px', color: '#A0A4C8' }}>Today · 9:30 AM (30 mins prior)</div>
                </div>
              </div>

              {/* STEP 3: Video Call Active (PULSING PINK DOT) */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                <div className="tracking-dot current" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>●</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#FF7873' }}>Video Call Room Active 🎥</div>
                  <div style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: '600' }}>
                    Doctor is in the room waiting for you to join.
                  </div>
                </div>
              </div>

              {/* STEP 4: Consultation Complete */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                <div className="tracking-dot upcoming" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>○</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#A0A4C8' }}>Consultation Assessment Complete</div>
                  <div style={{ fontSize: '12px', color: '#6B6E9A' }}>Pending video check-up</div>
                </div>
              </div>

              {/* STEP 5: Prescription Sent */}
              <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                <div className="tracking-dot upcoming" style={{ position: 'absolute', left: '-32px', top: '-2px' }}>○</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#A0A4C8' }}>Digital Prescription Issued</div>
                  <div style={{ fontSize: '12px', color: '#FF7873', fontWeight: '700', cursor: 'pointer', marginTop: '2px', textDecoration: 'underline' }} onClick={() => showToast('📋 Prescription will appear here immediately after your call!')}>
                    View Digital Prescription →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.EyeCheckupScreen = EyeCheckupScreen;
