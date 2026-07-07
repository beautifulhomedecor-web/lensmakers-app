// Cart & Checkout Screen Component — Prompt 10 Complete Implementation
const { useState, useEffect, useMemo, useRef } = React;

const INITIAL_CART_ITEMS = [
  {
    id: 'cart-101',
    name: 'Aerospace Titanium Lite #204',
    brand: 'LENS MAKERS HERITAGE',
    price: 4999,
    originalPrice: 5999,
    specs: 'Matte Navy · Full Rim · Titanium',
    lensType: 'Single Vision — Blue Cut Anti-Glare',
    prescription: '-2.25 (Both Eyes · Stock Sph -6 to +4)',
    image: '👓',
    qty: 1,
    isBogoEligible: true
  }
];

const INITIAL_SAVED_ITEMS = [
  {
    id: 'saved-201',
    name: 'Ray-Ban Classic Gold Aviator #302',
    brand: 'LENS MAKERS LUXE',
    price: 6499,
    specs: 'Gold · Double Bridge · Polarized',
    image: '🕶️'
  },
  {
    id: 'saved-202',
    name: 'Oakley Shield Sport #881',
    brand: 'LENS MAKERS ATHLETICS',
    price: 7999,
    specs: 'Neon Green · Rimless · High Contrast',
    image: '🥽'
  }
];

const BOGO_AVAILABLE_FRAMES = [
  { id: 'bogo-1', name: 'Classic Black Acetate #102', brand: 'LENS MAKERS STUDIO', category: 'Eyeglasses', originalPrice: 3899, image: '👓', rating: 4.8 },
  { id: 'bogo-2', name: 'Neo Wayfarer Polarized #505', brand: 'LENS MAKERS STUDIO', category: 'Sunglasses', originalPrice: 4299, image: '🕶️', rating: 4.9 },
  { id: 'bogo-3', name: 'Kids Flexible TR90 Blue #831', brand: 'LENS MAKERS KIDS', category: 'Kids', originalPrice: 2499, image: '👓', rating: 4.7 },
  { id: 'bogo-4', name: 'Clubmaster Acetate Half Rim #612', brand: 'LENS MAKERS HERITAGE', category: 'Eyeglasses', originalPrice: 4499, image: '👓', rating: 4.9 },
  { id: 'bogo-5', name: 'Oasis Polarized Square #944', brand: 'LENS MAKERS STUDIO', category: 'Sunglasses', originalPrice: 3499, image: '🕶️', rating: 4.6 }
];

const SAVED_ADDRESSES = [
  { id: 'addr-1', label: 'Home 🏠', name: 'Loki Reddy', address: 'Plot 42, Jubilee Hills, Near Metro Station', city: 'Hyderabad, Telangana 500033', phone: '+91 98765 43210', isDefault: true },
  { id: 'addr-2', label: 'Work 🏢', name: 'Loki Reddy', address: 'Google India, Divyasree Omega, Kondapur', city: 'Hyderabad, Telangana 500084', phone: '+91 98765 43210', isDefault: false }
];

const PAYMENT_METHODS = [
  { id: 'upi', title: 'UPI Express (GPay / PhonePe / Paytm)', sub: 'Instant 1-tap zero-fee payment', icon: '⚡', badge: 'FASTEST' },
  { id: 'card', title: 'HDFC Regalia Gold Credit Card', sub: '•••• •••• •••• 8812 · Expires 09/28', icon: '💳', badge: '10% CASHBACK' },
  { id: 'apple', title: 'Apple Pay / Google Wallet', sub: 'Biometric Face ID verification required', icon: '🍏', badge: 'SECURE' },
  { id: 'cod', title: 'Pay on Delivery / Cash on Delivery', sub: 'Pay via UPI or Cash when courier arrives', icon: '💵', badge: 'FREE' }
];

const CartScreen = ({ onSelectTab }) => {
  // Mode: 'cart' | 'checkout' | 'success'
  const [viewMode, setViewMode] = useState('cart');

  // Cart & Saved State
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [savedItems, setSavedItems] = useState(INITIAL_SAVED_ITEMS);
  const [freeItem, setFreeItem] = useState(null);
  const [showSavedSection, setShowSavedSection] = useState(false);

  // Stepper flip animation tracking
  const [animatingId, setAnimatingId] = useState(null);
  const [swipedItemId, setSwipedItemId] = useState(null);

  // Promo Code
  const [promoInput, setPromoInput] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState('idle');
  const [showConfetti, setShowConfetti] = useState(false);

  // BOGO Modal
  const [showBogoModal, setShowBogoModal] = useState(false);
  const [bogoSearch, setBogoSearch] = useState('');
  const [bogoFilter, setBogoFilter] = useState('All');
  const [selectedFreeCandidate, setSelectedFreeCandidate] = useState(null);

  // Checkout Flow
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedPaymentId, setSelectedPaymentId] = useState('upi');
  const [showOrderSummaryMini, setShowOrderSummaryMini] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Toast System
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const isMember = window.userIsMember !== false;

  const showToast = (message, type = 'info', undoCb = null) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type, undoCb });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Cleanup toast timer on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }, [cartItems]);

  const memberDiscount = isMember ? Math.round(subtotal * 0.25) : 0;
  const bogoSaving = freeItem ? freeItem.originalPrice : 0;
  const shipping = subtotal >= 1500 ? 0 : 49;
  const totalDue = Math.max(0, subtotal - memberDiscount - promoDiscount + shipping);
  const totalSavings = memberDiscount + promoDiscount + bogoSaving + (shipping === 0 ? 49 : 0);

  // Quantity Handlers
  const handleQtyChange = (id, delta) => {
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 250);

    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(1, item.qty + delta);
        if (nextQty !== item.qty) {
          showToast(`Updated quantity to ${nextQty}`, 'info');
        }
        return { ...item, qty: nextQty };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id) => {
    const itemToRemove = cartItems.find(i => i.id === id);
    setCartItems(prev => prev.filter(i => i.id !== id));
    setSwipedItemId(null);

    showToast(`Removed "${itemToRemove?.name.split('#')[0]}" from cart`, 'error', () => {
      if (itemToRemove) {
        setCartItems(prev => [...prev, itemToRemove]);
        showToast("Restored item to cart!", 'success');
      }
    });
  };

  const handleMoveToSaved = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    setCartItems(prev => prev.filter(i => i.id !== id));
    setSavedItems(prev => [...prev, {
      id: `saved-${Date.now()}`,
      name: item.name,
      brand: item.brand,
      price: item.price,
      specs: item.specs,
      image: item.image
    }]);
    showToast(`Saved "${item.name.split('#')[0]}" for later`, 'success');
  };

  const handleMoveToCart = (id) => {
    const item = savedItems.find(i => i.id === id);
    if (!item) return;
    setSavedItems(prev => prev.filter(i => i.id !== id));
    setCartItems(prev => [...prev, {
      id: `cart-${Date.now()}`,
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.price + 1000,
      specs: item.specs,
      lensType: 'Single Vision — Anti-Reflective',
      prescription: '-1.50 (Both Eyes · Stock Sph)',
      image: item.image,
      qty: 1,
      isBogoEligible: true
    }]);
    showToast(`Moved "${item.name.split('#')[0]}" into cart!`, 'success');
  };

  const handleClearAll = () => {
    /* Replace window.confirm (blocks on iOS PWA) with toast + undo pattern */
    const backup = [...cartItems];
    setCartItems([]);
    setFreeItem(null);
    showToast("Cart cleared — tap Undo to restore", 'error', () => {
      setCartItems(backup);
      showToast("Restored shopping cart!", 'success');
    });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'SUMMER20' || code === 'VIP10' || code === 'LENS2026' || code === 'BOGO') {
      const discountVal = Math.round(subtotal * 0.20);
      setPromoDiscount(discountVal);
      setPromoStatus('success');
      setShowConfetti(true);
      showToast(`🎉 Promo code ${code} applied — saved ₹${discountVal}!`, 'success');
      setTimeout(() => setShowConfetti(false), 800);
    } else {
      setPromoStatus('error');
      showToast("❌ Invalid promo code. Try SUMMER20 or VIP10", 'error');
      setTimeout(() => setPromoStatus('idle'), 1200);
    }
  };

  const filteredBogoFrames = useMemo(() => {
    return BOGO_AVAILABLE_FRAMES.filter(item => {
      if (bogoFilter !== 'All' && item.category !== bogoFilter) return false;
      if (bogoSearch && !item.name.toLowerCase().includes(bogoSearch.toLowerCase())) return false;
      return true;
    });
  }, [bogoFilter, bogoSearch]);

  const handleConfirmFreeFrame = () => {
    if (!selectedFreeCandidate) return;
    setFreeItem(selectedFreeCandidate);
    setShowBogoModal(false);
    showToast(`🎁 Added "${selectedFreeCandidate.name}" for FREE!`, 'success');
  };

  const handleStartCheckout = () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty!", 'warning');
      return;
    }
    setViewMode('checkout');
    setCheckoutStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    if (!agreedTerms) {
      showToast("Please agree to the Terms of Service to continue", 'warning');
      return;
    }
    showToast("🔒 Encrypting payment & authenticating biometric Face ID...", 'info');
    setTimeout(() => {
      setViewMode('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast("🎉 Order Placed Successfully! Ref #LM-20491", 'success');
    }, 1600);
  };

  // SUCCESS SCREEN
  if (viewMode === 'success') {
    return (
      <div className="screen-transition-enter" style={{ padding: '24px var(--screen-padding)', paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)', minHeight: '90vh', position: 'relative', overflow: 'hidden' }}>
        {toast && (
          <div className="lens-toast-container">
            <div className={`lens-toast-item toast-${toast.type}`}>
              <span>{toast.message}</span>
              {toast.undoCb && (
                <button type="button" onClick={toast.undoCb} style={{ background: 'transparent', border: 'none', color: '#FF7873', fontWeight: '900', cursor: 'pointer', textDecoration: 'underline' }}>
                  Undo
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(226,47,128,0.22) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px', margin: '20px auto 0', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(67,160,71,0.3) 0%, transparent 70%)', animation: 'pulseExpiring 2.5s infinite' }} />
            <div style={{ width: '92px', height: '92px', borderRadius: '46px', background: 'linear-gradient(135deg, #43A047, #2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 36px rgba(67,160,71,0.5)', border: '3px solid #FFFFFF' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'toastSlideUp 400ms var(--spring-bezier)' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#FFFFFF', marginBottom: '8px', animation: 'toastSlideUp 450ms var(--spring-bezier)' }}>
            Order Placed! 🎉
          </h1>
          <p style={{ fontSize: '15px', color: '#A0A4C8', marginBottom: '28px', lineHeight: '1.5' }}>
            Thank you for shopping with Lens Makers. Your prescription lenses are entering computerized lab processing!
          </p>

          <div className="glass-card-standard mb-3" style={{ padding: '18px 20px', textAlign: 'left' }}>
            <div className="flex-between mb-1">
              <span style={{ fontSize: '11px', color: '#A0A4C8', textTransform: 'uppercase', fontWeight: '800' }}>ORDER REFERENCE</span>
              <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>PAID ✓</span>
            </div>
            <div className="flex-between" style={{ alignItems: 'center', margin: '6px 0 8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '1px' }}>#LM-20491</span>
              <button
                type="button"
                style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#29B6F6', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                onClick={() => showToast("📋 Copied Order Ref #LM-20491 to clipboard!", 'success')}
              >
                📋 Copy
              </button>
            </div>
            <div style={{ fontSize: '12px', color: '#A0A4C8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
              📧 Confirmation sent to <strong style={{ color: '#FFFFFF' }}>loki.reddy@lensmakers.in</strong> & SMS
            </div>
          </div>

          <div className="glass-card-glow-cyan mb-3" style={{ padding: '16px 20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', border: '1.5px solid #29B6F6' }}>
            <div style={{ fontSize: '32px' }}>📦</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF' }}>Estimated Delivery: July 8-10, 2026</div>
              <div style={{ fontSize: '12px', color: '#29B6F6', marginTop: '2px', fontWeight: '600' }}>
                🚀 Express Zeiss Optical Lab Processing & Insured Courier
              </div>
            </div>
          </div>

          {freeItem && (
            <div className="glass-card-glow-green mb-4" style={{ padding: '14px 18px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', border: '1.5px solid #43A047' }}>
              <div style={{ fontSize: '24px' }}>🎁</div>
              <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '700' }}>
                Your FREE BOGO frame (<strong style={{ color: '#43A047' }}>{freeItem.name.split('#')[0]}</strong>) is packaged with this order!
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button
              type="button"
              className="btn-secondary-pill"
              style={{ flex: 1, height: '52px', fontSize: '14px', borderColor: '#29B6F6', color: '#29B6F6' }}
              onClick={() => { if (onSelectTab) onSelectTab('trackorder'); }}
            >
              📍 Track Order
            </button>
            <button
              type="button"
              className="btn-primary-pill"
              style={{ flex: 1, height: '52px', fontSize: '14px', background: 'linear-gradient(135deg, #FF7A30, #FF7873)' }}
              onClick={() => {
                setCartItems([]);
                setFreeItem(null);
                setViewMode('cart');
                if (onSelectTab) onSelectTab('home');
              }}
            >
              <span>🛍️ Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT FLOW
  if (viewMode === 'checkout') {
    return (
      <div className="screen-transition-enter" style={{ padding: '16px var(--screen-padding)', paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)', minHeight: '90vh', maxWidth: '520px', margin: '0 auto' }}>
        {toast && (
          <div className="lens-toast-container">
            <div className={`lens-toast-item toast-${toast.type}`}>
              <span>{toast.message}</span>
              {toast.undoCb && (
                <button type="button" onClick={toast.undoCb} style={{ background: 'transparent', border: 'none', color: '#FF7873', fontWeight: '900', cursor: 'pointer' }}>
                  Undo
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex-between mb-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => {
                if (checkoutStep > 1) setCheckoutStep(checkoutStep - 1);
                else setViewMode('cart');
              }}
            >
              ←
            </button>
            <h1 className="hero-heading" style={{ fontSize: '22px' }}>
              {checkoutStep === 1 && 'Step 1: Delivery Address'}
              {checkoutStep === 2 && 'Step 2: Lens & Prescription'}
              {checkoutStep === 3 && 'Step 3: Payment Method'}
              {checkoutStep === 4 && 'Step 4: Review & Confirm'}
            </h1>
          </div>
          <span className="badge-pill badge-purple" style={{ fontSize: '11px' }}>
            STEP {checkoutStep} OF 4
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '0 4px' }}>
          {['Address', 'Lens Details', 'Payment', 'Review'].map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < checkoutStep;
            const isCurrent = stepNum === checkoutStep;
            return (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <div style={{
                    width: '100%', height: '6px', borderRadius: '3px',
                    background: isDone || isCurrent ? 'linear-gradient(90deg, #FF7873, #8140DC)' : 'rgba(255,255,255,0.12)',
                    position: 'relative', transition: 'all 400ms ease'
                  }}>
                    {isCurrent && (
                      <span style={{ position: 'absolute', right: 0, top: '-3px', width: '12px', height: '12px', borderRadius: '6px', background: '#FF7873', boxShadow: '0 0 10px #FF7873' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: isCurrent ? '800' : '600', color: isCurrent ? '#FFFFFF' : isDone ? '#FF7873' : '#A0A4C8', whiteSpace: 'nowrap' }}>
                    {isDone ? '✓ ' : ''}{label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {checkoutStep === 1 && (
          <div className="fade-up-item">
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>Select Shipping Address</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {SAVED_ADDRESSES.map(addr => {
                const isSel = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    className="glass-card-standard"
                    style={{
                      padding: '16px', cursor: 'pointer',
                      border: isSel ? '2px solid #FF7873' : '1px solid rgba(255,255,255,0.12)',
                      background: isSel ? 'rgba(226,47,128,0.1)' : 'rgba(255,240,224,0.6)',
                      transition: 'all 200ms ease'
                    }}
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      showToast(`Selected "${addr.label}" address`, 'success');
                    }}
                  >
                    <div className="flex-between mb-1">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '900', color: '#FFFFFF' }}>{addr.label} — {addr.name}</span>
                        {addr.isDefault && <span className="badge-pill badge-green" style={{ fontSize: '9px' }}>DEFAULT</span>}
                      </div>
                      <div style={{ width: '20px', height: '20px', borderRadius: '10px', border: isSel ? '6px solid #FF7873' : '2px solid #A0A4C8', background: 'rgba(255, 255, 255, 0.95)' }} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#A0A4C8', lineHeight: '1.4', margin: '6px 0 8px' }}>
                      {addr.address}, {addr.city}
                    </div>
                    <div style={{ fontSize: '12px', color: '#29B6F6', fontWeight: '700' }}>📞 {addr.phone}</div>
                  </div>
                );
              })}

              <div
                className="rx-dropzone"
                style={{ padding: '16px', borderRadius: '14px', border: '1.5px dashed rgba(255,255,255,0.25)', cursor: 'pointer' }}
                onClick={() => showToast("📝 Opening New Address Form Modal...", 'info')}
              >
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FF7873' }}>+ Add New Delivery Address</span>
              </div>
            </div>

            <div className="glass-card-standard mb-4" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '700' }}>📦 Use same address for all BOGO / multiple pairs</span>
              <input
                type="checkbox"
                checked={useSameAddress}
                onChange={(e) => setUseSameAddress(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#FF7873', cursor: 'pointer' }}
              />
            </div>

            <div style={{ position: 'sticky', bottom: '16px', zIndex: 30 }}>
              <button
                type="button"
                className="btn-primary-pill w-100"
                style={{ height: '54px', fontSize: '16px', fontWeight: '900', background: 'linear-gradient(135deg, #FF7A30, #FF7873)' }}
                onClick={() => {
                  setCheckoutStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Continue to Lens Details →</span>
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 2 && (
          <div className="fade-up-item">
            <div className="bogo-glow-banner mb-4" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>🔬</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF' }}>Verify Optical Prescription & Lenses</div>
                <div style={{ fontSize: '12px', color: '#A0A4C8' }}>Our Zeiss computerized lab will cut lenses strictly based on these verified values.</div>
              </div>
            </div>

            {cartItems.map((item, index) => (
              <div key={item.id} className="glass-card-standard mb-3" style={{ padding: '16px' }}>
                <div className="flex-between mb-2">
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase' }}>PAIR #{index + 1} ({item.brand})</span>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: '#FF7873', fontSize: '12px', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => showToast(`Editing lens specs for ${item.name.split('#')[0]}`, 'info')}
                  >
                    ✏️ Edit Lenses
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                    {item.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 4px' }}>{item.name}</h4>
                    <div style={{ fontSize: '12px', color: '#29B6F6', fontWeight: '700', marginBottom: '4px' }}>
                      👁️ Rx: {item.prescription}
                    </div>
                    <div style={{ fontSize: '11px', color: '#A0A4C8' }}>
                      ✨ Lens Type: <strong style={{ color: '#FFFFFF' }}>{item.lensType || 'Single Vision — Blue Cut Anti-Glare'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {freeItem && (
              <div className="glass-card-glow-green mb-4" style={{ padding: '16px', border: '1.5px solid #43A047' }}>
                <div className="flex-between mb-2">
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#43A047' }}>🎁 PAIR #2: FREE BOGO FRAME</span>
                  <span className="badge-pill badge-green" style={{ fontSize: '9px' }}>100% FREE</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                    {freeItem.image}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 4px' }}>{freeItem.name}</h4>
                    <div style={{ fontSize: '12px', color: '#43A047', fontWeight: '700' }}>
                      🕶️ Included: 100% UV400 Polarized Sunglass Lenses
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card-standard mb-4" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>📄 Need to attach a doctor's prescription photo?</div>
                <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Upload JPG/PDF or take a photo with your mobile camera</div>
              </div>
              <button
                type="button"
                className="btn-secondary-pill"
                style={{ padding: '8px 14px', fontSize: '11px', borderColor: '#29B6F6', color: '#29B6F6' }}
                onClick={() => showToast("📸 Camera Scanner activated! Prescription verified.", 'success')}
              >
                📸 Upload Rx
              </button>
            </div>

            <div style={{ position: 'sticky', bottom: '16px', zIndex: 30 }}>
              <button
                type="button"
                className="btn-primary-pill w-100"
                style={{ height: '54px', fontSize: '16px', fontWeight: '900', background: 'linear-gradient(135deg, #FF7A30, #FF7873)' }}
                onClick={() => {
                  setCheckoutStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Continue to Payment →</span>
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 3 && (
          <div className="fade-up-item">
            <div
              className="glass-card-standard mb-4"
              style={{ padding: '14px 16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.18)' }}
              onClick={() => setShowOrderSummaryMini(!showOrderSummaryMini)}
            >
              <div className="flex-between">
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🛒 Order Summary ({cartItems.length + (freeItem ? 1 : 0)} items)</span>
                  <span style={{ fontSize: '12px', color: '#A0A4C8' }}>{showOrderSummaryMini ? '▲' : '▼'}</span>
                </span>
                <span style={{ fontSize: '16px', fontWeight: '900', color: '#FF7873' }}>₹{totalDue}</span>
              </div>
              {showOrderSummaryMini && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex-between">
                      <span style={{ color: '#A0A4C8' }}>{item.name.split('#')[0]} (x{item.qty})</span>
                      <span style={{ color: '#FFFFFF' }}>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  {freeItem && (
                    <div className="flex-between">
                      <span style={{ color: '#43A047' }}>🎁 BOGO 2nd Pair ({freeItem.name.split('#')[0]})</span>
                      <span style={{ color: '#43A047', fontWeight: '800' }}>FREE</span>
                    </div>
                  )}
                  <div className="flex-between">
                    <span style={{ color: '#8140DC' }}>👑 VIP Club Discount & Promo</span>
                    <span style={{ color: '#43A047', fontWeight: '800' }}>- ₹{memberDiscount + promoDiscount}</span>
                  </div>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>Choose Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {PAYMENT_METHODS.map(pay => {
                const isSel = selectedPaymentId === pay.id;
                return (
                  <div
                    key={pay.id}
                    className="glass-card-standard"
                    style={{
                      padding: '16px', cursor: 'pointer',
                      border: isSel ? '2px solid #FF7873' : '1px solid rgba(255,255,255,0.12)',
                      background: isSel ? 'rgba(226,47,128,0.1)' : 'rgba(255,240,224,0.6)',
                      transition: 'all 200ms ease'
                    }}
                    onClick={() => {
                      setSelectedPaymentId(pay.id);
                      showToast(`Selected ${pay.title.split('(')[0]}`, 'success');
                    }}
                  >
                    <div className="flex-between mb-1">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '22px' }}>{pay.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF' }}>{pay.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge-pill badge-purple" style={{ fontSize: '9px' }}>{pay.badge}</span>
                        <div style={{ width: '20px', height: '20px', borderRadius: '10px', border: isSel ? '6px solid #FF7873' : '2px solid #A0A4C8', background: 'rgba(255, 255, 255, 0.95)' }} />
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#A0A4C8', paddingLeft: '32px' }}>{pay.sub}</div>
                  </div>
                );
              })}

              <div
                className="rx-dropzone"
                style={{ padding: '14px', borderRadius: '14px', border: '1.5px dashed rgba(255,255,255,0.2)', cursor: 'pointer' }}
                onClick={() => showToast("💳 Opening Bank / UPI Gateway Setup...", 'info')}
              >
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#29B6F6' }}>+ Add New Debit/Credit Card or Net Banking</span>
              </div>
            </div>

            <div style={{ position: 'sticky', bottom: '16px', zIndex: 30 }}>
              <button
                type="button"
                className="btn-primary-pill w-100"
                style={{ height: '54px', fontSize: '16px', fontWeight: '900', background: 'linear-gradient(135deg, #FF7A30, #FF7873)' }}
                onClick={() => {
                  setCheckoutStep(4);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Continue to Final Review →</span>
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 4 && (
          <div className="fade-up-item">
            <div className="glass-card-glow-cyan mb-4" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', border: '1.5px solid #29B6F6' }}>
              <span style={{ fontSize: '32px' }}>📦</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#FFFFFF' }}>Estimated Delivery: July 8-10, 2026</div>
                <div style={{ fontSize: '12px', color: '#29B6F6', marginTop: '2px', fontWeight: '600' }}>
                  🚀 100% Free Zeiss Computerized Surfacing & Home Delivery
                </div>
              </div>
            </div>

            <div className="glass-card-standard mb-3" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                1. Ordered Eyewear ({cartItems.length + (freeItem ? 1 : 0)} pairs)
              </h3>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                    {item.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex-between">
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>{item.name} (x{item.qty})</span>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF' }}>₹{item.price * item.qty}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#29B6F6' }}>👁️ Rx: {item.prescription.split('•')[0]}</div>
                  </div>
                </div>
              ))}
              {freeItem && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                    {freeItem.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex-between">
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#43A047' }}>🎁 {freeItem.name} (BOGO Pair)</span>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: '#43A047' }}>FREE ₹0</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#A0A4C8' }}>🕶️ 100% UV Protection Lenses</div>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card-standard mb-3" style={{ padding: '16px' }}>
              <div className="flex-between mb-1">
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>2. Shipping Address</h3>
                <button type="button" style={{ background: 'transparent', border: 'none', color: '#FF7873', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }} onClick={() => setCheckoutStep(1)}>
                  Change
                </button>
              </div>
              <div style={{ fontSize: '13px', color: '#A0A4C8', lineHeight: '1.4', marginTop: '6px' }}>
                <strong style={{ color: '#FFFFFF' }}>Loki Reddy</strong> · Plot 42, Jubilee Hills, Hyderabad, Telangana 500033
              </div>
            </div>

            <div className="glass-card-standard mb-4" style={{ padding: '16px' }}>
              <div className="flex-between mb-1">
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>3. Payment Method</h3>
                <button type="button" style={{ background: 'transparent', border: 'none', color: '#FF7873', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }} onClick={() => setCheckoutStep(3)}>
                  Change
                </button>
              </div>
              <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡ UPI Express (GPay / PhonePe / Paytm)</span>
                <span className="badge-pill badge-green" style={{ fontSize: '9px' }}>INSTANT</span>
              </div>
            </div>

            <div className="glass-card-glow-pink mb-4" style={{ padding: '18px', border: '1.5px solid #FF7873' }}>
              <div className="flex-between mb-2" style={{ fontSize: '14px' }}>
                <span style={{ color: '#A0A4C8' }}>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                <span style={{ color: '#FFFFFF', fontWeight: '700' }}>₹{subtotal}</span>
              </div>
              {isMember && (
                <div className="flex-between mb-2" style={{ fontSize: '14px' }}>
                  <span style={{ color: '#8140DC', fontWeight: '700' }}>👑 Member Discount (25% Off)</span>
                  <span style={{ color: '#43A047', fontWeight: '800' }}>- ₹{memberDiscount}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex-between mb-2" style={{ fontSize: '14px' }}>
                  <span style={{ color: '#43A047', fontWeight: '700' }}>🎉 Promo Code Discount</span>
                  <span style={{ color: '#43A047', fontWeight: '800' }}>- ₹{promoDiscount}</span>
                </div>
              )}
              <div className="flex-between mb-3" style={{ fontSize: '14px' }}>
                <span style={{ color: '#A0A4C8' }}>Insured Home Delivery</span>
                <span style={{ color: '#43A047', fontWeight: '800' }}>FREE</span>
              </div>
              <div className="flex-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '20px', fontWeight: '900' }}>
                <span style={{ color: '#FFFFFF' }}>Total Payable:</span>
                <span style={{ color: '#FF7873', fontSize: '26px' }}>₹{totalDue}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#43A047', fontWeight: '700', textAlign: 'right', marginTop: '4px' }}>
                You save ₹{totalSavings} total on this order! 🎉
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '0 4px' }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#FF7873', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '11px', color: '#A0A4C8', lineHeight: '1.4' }}>
                By placing this order you agree to our <strong style={{ color: '#FFFFFF' }}>Terms of Service</strong> and <strong style={{ color: '#FFFFFF' }}>30-Day Free Return Policy</strong>.
              </span>
            </div>

            <div style={{ position: 'sticky', bottom: '16px', zIndex: 30 }}>
              <button
                type="button"
                className="btn-primary-pill w-100"
                style={{ height: '60px', fontSize: '18px', fontWeight: '900', background: 'linear-gradient(135deg, #FF7A30, #FF7873)', boxShadow: '0 10px 36px rgba(226,47,128,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                onClick={handlePlaceOrder}
              >
                <span>🔒 Place Order · ₹{totalDue}</span>
              </button>
              <div style={{ fontSize: '11px', color: '#A0A4C8', textAlign: 'center', marginTop: '8px' }}>
                🛡️ 256-Bit SSL Encrypted Checkout · 100% Satisfaction Guaranteed
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CART MAIN SCREEN
  return (
    <div className="screen-transition-enter" style={{ padding: '16px var(--screen-padding)', paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)', minHeight: '90vh' }}>
      {toast && (
        <div className="lens-toast-container">
          <div className={`lens-toast-item toast-${toast.type}`}>
            <span>{toast.message}</span>
            {toast.undoCb && (
              <button type="button" onClick={toast.undoCb} style={{ background: 'transparent', border: 'none', color: '#FF7873', fontWeight: '900', cursor: 'pointer', textDecoration: 'underline' }}>
                Undo
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex-between mb-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => { if (onSelectTab) onSelectTab('shop'); }}
          >
            ←
          </button>
          <h1 className="hero-heading" style={{ fontSize: '24px' }}>
            My Cart <span style={{ fontSize: '16px', color: '#A0A4C8', fontWeight: '600' }}>({cartItems.reduce((a,c) => a+c.qty, 0) + (freeItem ? 1 : 0)} items)</span>
          </h1>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            style={{ background: 'transparent', border: 'none', color: '#EF5350', fontSize: '13px', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={handleClearAll}
          >
            Clear All
          </button>
        )}
      </div>

      {cartItems.length === 0 && !freeItem ? (
        <div className="glass-card-standard fade-up-item" style={{ padding: '48px 24px', textAlign: 'center', margin: '40px 0' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            🛒
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>Your cart is empty</h2>
          <p style={{ fontSize: '14px', color: '#A0A4C8', maxWidth: '280px', margin: '0 auto 24px', lineHeight: '1.4' }}>
            Add frames you love and they'll appear here ready for custom ZEISS lab surfacing!
          </p>
          <button
            type="button"
            className="btn-primary-pill"
            style={{ padding: '0 32px', height: '48px', fontSize: '15px' }}
            onClick={() => { if (onSelectTab) onSelectTab('shop'); }}
          >
            <span>Browse Frames →</span>
          </button>
        </div>
      ) : (
        <>
          {!freeItem && subtotal >= 1699 && (
            <div className="bogo-glow-banner mb-4 fade-up-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', border: '1.5px solid #43A047', background: 'linear-gradient(135deg, rgba(67,160,71,0.15), rgba(255,240,224,0.8))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '23px', background: 'rgba(67,160,71,0.2)', border: '1.5px solid #43A047', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  🎁
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#FFFFFF' }}>Pick your FREE frame!</div>
                  <div style={{ fontSize: '12px', color: '#A0A4C8', marginTop: '2px' }}>
                    You're eligible for a free frame with your order.
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary-pill"
                style={{ padding: '8px 16px', height: '38px', fontSize: '12px', fontWeight: '900', background: 'linear-gradient(135deg, #FF7873, #E22F80)', whiteSpace: 'nowrap' }}
                onClick={() => {
                  setSelectedFreeCandidate(filteredBogoFrames[0] || null);
                  setShowBogoModal(true);
                }}
              >
                <span>Choose Free Frame →</span>
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {cartItems.map(item => {
              const isSwiped = swipedItemId === item.id;
              const isAnim = animatingId === item.id;
              const itemSubtotal = item.price * item.qty;
              const itemMemberPrice = isMember ? Math.round(itemSubtotal * 0.75) : null;

              return (
                <div key={item.id} style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px' }}>
                  <div style={{
                    position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 40%, #EF5350)',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20px',
                    borderRadius: '18px', zIndex: 1
                  }}>
                    <button
                      type="button"
                      style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '13px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      onClick={() => handleRemoveCartItem(item.id)}
                    >
                      <span>🗑️ Remove</span>
                    </button>
                  </div>

                  <div
                    className="glass-card-standard"
                    style={{
                      padding: '16px', position: 'relative', zIndex: 2,
                      transform: isSwiped ? 'translateX(-80px)' : 'translateX(0)',
                      transition: 'transform 250ms var(--spring-bezier)',
                      background: 'rgba(255,240,224, 0.85)'
                    }}
                    onClick={() => setSwipedItemId(isSwiped ? null : item.id)}
                  >
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        {item.image}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase' }}>
                          {item.brand}
                        </div>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', margin: '2px 0 4px', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.name}
                        </h3>
                        <div style={{ fontSize: '12px', color: '#A0A4C8', marginBottom: '8px' }}>
                          {item.specs}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF' }}>
                            ₹{itemSubtotal}
                          </span>
                          {isMember && (
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#8140DC' }}>
                              Your price: ₹{itemMemberPrice}
                            </span>
                          )}
                        </div>
                        {item.isBogoEligible && (
                          <div style={{ fontSize: '12px', color: '#43A047', fontWeight: '700', marginTop: '4px' }}>
                            Part of your BOGO offer 🎁
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          style={{ width: '28px', height: '28px', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#A0A4C8', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => handleRemoveCartItem(item.id)}
                          title="Remove item"
                        >
                          ✕
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
                          <button
                            type="button"
                            style={{ width: '28px', height: '28px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FF7873', fontSize: '16px', fontWeight: '900', cursor: 'pointer' }}
                            onClick={() => handleQtyChange(item.id, -1)}
                          >
                            −
                          </button>
                          <span className={isAnim ? 'animate-flip-num' : ''} style={{ width: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            style={{ width: '28px', height: '28px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FF7873', fontSize: '16px', fontWeight: '900', cursor: 'pointer' }}
                            onClick={() => handleQtyChange(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        style={{ background: 'transparent', border: 'none', color: '#29B6F6', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                        onClick={() => handleMoveToSaved(item.id)}
                      >
                        ♡ Save for Later
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {freeItem && (
              <div className="glass-card-glow-pink" style={{ padding: '16px', border: '1.5px solid #43A047', position: 'relative', background: 'linear-gradient(135deg, rgba(67,160,71,0.12), rgba(255,240,224,0.8))' }}>
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#43A047', color: '#FFFFFF', padding: '3px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: '900' }}>
                  🎁 FREE BOGO PAIR
                </span>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', flexShrink: 0 }}>
                    {freeItem.image}
                  </div>
                  <div style={{ flex: 1, paddingRight: '70px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#A0A4C8', textTransform: 'uppercase' }}>{freeItem.brand}</div>
                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', margin: '2px 0 4px' }}>{freeItem.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '900', color: '#43A047' }}>FREE ₹0</span>
                      <span style={{ fontSize: '13px', color: '#A0A4C8', textDecoration: 'line-through' }}>₹{freeItem.originalPrice}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-between mt-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }}>
                  <span style={{ color: '#A0A4C8' }}>✨ 100% UV Protection Lenses Included</span>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: '#EF5350', fontSize: '12px', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      setFreeItem(null);
                      showToast("Removed free BOGO pair", 'info');
                    }}
                  >
                    ✕ Remove Free Pair
                  </button>
                </div>
              </div>
            )}
          </div>

          {savedItems.length > 0 && (
            <div className="glass-card-standard mb-4" style={{ padding: '14px 16px' }}>
              <div
                className="flex-between"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowSavedSection(!showSavedSection)}
              >
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔖 Saved Items ({savedItems.length})</span>
                </span>
                <span style={{ fontSize: '14px', color: '#A0A4C8' }}>{showSavedSection ? '▲' : '▼'}</span>
              </div>

              {showSavedSection && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedItems.map(item => (
                    <div key={item.id} className="flex-between" style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                          {item.image}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>{item.name.split('#')[0]}</div>
                          <div style={{ fontSize: '12px', color: '#FF7873', fontWeight: '700' }}>₹{item.price}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-secondary-pill"
                        style={{ padding: '6px 14px', fontSize: '11px', height: '32px', borderColor: '#43A047', color: '#43A047' }}
                        onClick={() => handleMoveToCart(item.id)}
                      >
                        + Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="glass-card-standard mb-4" style={{ padding: '16px', position: 'relative' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', marginBottom: '10px' }}>Have a promo code?</h3>
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '10px', position: 'relative' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Enter code (e.g., SUMMER20, VIP10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    width: '100%', height: '42px', padding: '0 14px', borderRadius: '999px',
                    background: promoStatus === 'success' ? 'rgba(67,160,71,0.15)' : promoStatus === 'error' ? 'rgba(239,83,80,0.15)' : 'rgba(255,240,224,0.8)',
                    border: promoStatus === 'success' ? '1.5px solid #43A047' : promoStatus === 'error' ? '1.5px solid #EF5350' : '1px solid rgba(255,255,255,0.2)',
                    color: '#FFFFFF', fontSize: '13px', outline: 'none', textTransform: 'uppercase', fontFamily: 'monospace',
                    transition: 'all 200ms ease'
                  }}
                />
                {showConfetti && (
                  <div style={{ position: 'absolute', top: '50%', right: '20px', pointerEvents: 'none' }}>
                    <span className="confetti-dot" style={{ background: '#FF7873', '--dx': '-25px', '--dy': '-25px' }} />
                    <span className="confetti-dot" style={{ background: '#43A047', '--dx': '20px', '--dy': '-30px' }} />
                    <span className="confetti-dot" style={{ background: '#C9A876', '--dx': '25px', '--dy': '15px' }} />
                    <span className="confetti-dot" style={{ background: '#29B6F6', '--dx': '-20px', '--dy': '20px' }} />
                    <span className="confetti-dot" style={{ background: '#8140DC', '--dx': '0px', '--dy': '-35px' }} />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn-secondary-pill"
                style={{ height: '42px', padding: '0 20px', fontSize: '13px', borderColor: '#FF7873', color: '#FF7873' }}
              >
                Apply
              </button>
            </form>
            {promoStatus === 'success' && (
              <div style={{ fontSize: '12px', color: '#43A047', fontWeight: '800', marginTop: '8px' }}>
                🎉 SUMMER20 applied — 20% off!
              </div>
            )}
            {promoStatus === 'error' && (
              <div style={{ fontSize: '12px', color: '#EF5350', fontWeight: '800', marginTop: '8px' }}>
                ❌ Invalid code. Try again.
              </div>
            )}
          </div>

          <div className="glass-card-standard mb-4" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <div className="flex-between">
                <span style={{ color: '#A0A4C8' }}>Subtotal:</span>
                <span style={{ color: '#FFFFFF', fontWeight: '700' }}>₹{subtotal}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex-between">
                  <span style={{ color: '#43A047', fontWeight: '700' }}>Promo Discount:</span>
                  <span style={{ color: '#43A047', fontWeight: '800' }}>- ₹{promoDiscount}</span>
                </div>
              )}
              {isMember && (
                <div className="flex-between">
                  <span style={{ color: '#8140DC', fontWeight: '700' }}>Member Discount (25%):</span>
                  <span style={{ color: '#43A047', fontWeight: '800' }}>- ₹{memberDiscount}</span>
                </div>
              )}
              {freeItem && (
                <div className="flex-between">
                  <span style={{ color: '#43A047', fontWeight: '700' }}>BOGO Saving:</span>
                  <span style={{ color: '#43A047', fontWeight: '800' }}>- ₹{bogoSaving} (FREE)</span>
                </div>
              )}
              <div className="flex-between">
                <span style={{ color: '#A0A4C8' }}>Shipping:</span>
                <span style={{ color: shipping === 0 ? '#43A047' : '#FFFFFF', fontWeight: '800' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #FF7873, transparent)', margin: '6px 0' }} />

              <div className="flex-between" style={{ fontSize: '20px', fontWeight: '900' }}>
                <span style={{ color: '#FFFFFF' }}>TOTAL:</span>
                <span style={{ color: '#FF7873', fontSize: '26px' }}>₹{totalDue}</span>
              </div>

              {totalSavings > 0 && (
                <div style={{ fontSize: '13px', color: '#43A047', fontWeight: '800', textAlign: 'right', marginTop: '2px' }}>
                  You save ₹{totalSavings} total on this order! 🎁
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '24px', marginBottom: '80px' }}>
            <button
              type="button"
              className="btn-primary-pill w-100"
              style={{ height: '54px', fontSize: '17px', fontWeight: '900', background: 'linear-gradient(135deg, #FF7A30, #FF7873)', boxShadow: '0 8px 32px rgba(226,47,128,0.6)' }}
              onClick={handleStartCheckout}
            >
              <span>Proceed to Checkout · ₹{totalDue} →</span>
            </button>
            <div style={{ fontSize: '11px', color: '#A0A4C8', textAlign: 'center', marginTop: '8px' }}>
              🔒 Secure checkout · Free returns in 30 days
            </div>
          </div>
        </>
      )}

      {showBogoModal && (
        <div className="modal-backdrop screen-transition-enter" style={{ zIndex: 200 }} onClick={() => setShowBogoModal(false)}>
          <div
            className="modal-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '24px var(--screen-padding) 30px', maxHeight: '88vh', overflowY: 'auto', borderTop: '2px solid #43A047', boxShadow: '0 -20px 60px rgba(67,160,71,0.4)' }}
          >
            <div className="flex-between mb-3">
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Choose Your FREE Frame 🎁</span>
                </h2>
                <div style={{ fontSize: '13px', color: '#A0A4C8', marginTop: '2px' }}>
                  Select any frame valued up to ₹{cartItems[0]?.price || 4999} (100% Free!)
                </div>
              </div>
              <button
                type="button"
                style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF', fontSize: '16px', cursor: 'pointer' }}
                onClick={() => setShowBogoModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search eligible free frames..."
                value={bogoSearch}
                onChange={(e) => setBogoSearch(e.target.value)}
                style={{ width: '100%', height: '44px', paddingLeft: '42px', paddingRight: '14px', borderRadius: '999px', background: 'rgba(255,240,224,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', scrollbarWidth: 'none' }}>
              {['All', 'Eyeglasses', 'Sunglasses'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  style={{
                    padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: '700',
                    background: bogoFilter === cat ? 'linear-gradient(135deg, #FF7873, #E22F80)' : 'rgba(255,255,255,0.06)',
                    color: '#FFFFFF', border: bogoFilter === cat ? 'none' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer'
                  }}
                  onClick={() => setBogoFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="product-grid-2col mb-4" style={{ gap: '12px' }}>
              {filteredBogoFrames.map(item => {
                const isSelected = selectedFreeCandidate && selectedFreeCandidate.id === item.id;
                return (
                  <div
                    key={item.id}
                    className="glass-card-standard"
                    style={{
                      padding: '12px', cursor: 'pointer', position: 'relative',
                      border: isSelected ? '2.5px solid #FF7873' : '1px solid rgba(255,255,255,0.12)',
                      background: isSelected ? 'rgba(226,47,128,0.12)' : 'rgba(255,240,224,0.6)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)', transition: 'all 200ms ease'
                    }}
                    onClick={() => setSelectedFreeCandidate(item)}
                  >
                    {isSelected && (
                      <span style={{ position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px', borderRadius: '11px', background: '#FF7873', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', zIndex: 10 }}>
                        ✓
                      </span>
                    )}
                    <div style={{ width: '100%', height: '100px', borderRadius: '10px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '10px' }}>
                      {item.image}
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#A0A4C8' }}>{item.brand}</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', margin: '2px 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div className="flex-between" style={{ alignItems: 'baseline' }}>
                      <span style={{ fontSize: '15px', fontWeight: '900', color: '#43A047' }}>FREE ₹0</span>
                      <span style={{ fontSize: '11px', color: '#A0A4C8', textDecoration: 'line-through' }}>₹{item.originalPrice}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="btn-primary-pill w-100"
              style={{ height: '52px', fontSize: '15px', fontWeight: '900', background: selectedFreeCandidate ? 'linear-gradient(135deg, #43A047, #2E7D32)' : 'rgba(255,255,255,0.1)', cursor: selectedFreeCandidate ? 'pointer' : 'not-allowed' }}
              disabled={!selectedFreeCandidate}
              onClick={handleConfirmFreeFrame}
            >
              <span>{selectedFreeCandidate ? `🎉 Add "${selectedFreeCandidate.name.split('#')[0]}" for FREE!` : 'Select a frame above to claim'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

window.CartScreen = CartScreen;
