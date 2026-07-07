// Shop Screen & PDP Component — Prompt 4 of 10
// Studio-Grade Product Listing Page (PLP) & Product Detail Page (PDP)
// Apple Liquid Glass UI, Live Total Price Calculation, AR Try-On Launch, Combinable Filtering
const { useState, useEffect, useMemo } = React;

// MOCK EYEWEAR CATALOG (10 Studio-Crafted Products with Accurate Color Variants & Specs)
const PRODUCTS_DATA = [
  {
    id: '101',
    name: 'Aerospace Lite Titanium #101',
    brand: 'LENS MAKERS AIR',
    category: 'Eyeglasses',
    shape: 'Rectangle',
    material: 'Titanium',
    frameType: 'Rimless',
    gender: 'Men',
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviews: 1204,
    discount: '28% OFF',
    bogo: true,
    sale: false,
    image: '👓',
    colors: ['#1E88E5', '#37474F', '#D4AF37'],
    specs: { material: 'Beta-Titanium', frameType: 'Rimless', shape: 'Rectangle', weight: '11g (Ultra-light)', lensWidth: '54mm', templeLength: '142mm' },
    desc: 'Crafted from Japanese aerospace-grade beta-titanium, Aerospace Lite weights just 11 grams. Featuring screwless hinges and memory-metal bridges that flex without breaking.'
  },
  {
    id: '204',
    name: 'Milan Aviator Gold #204',
    brand: 'LENS MAKERS CLASSIC',
    category: 'Sunglasses',
    shape: 'Aviator',
    material: 'Stainless Steel',
    frameType: 'Full Rim',
    gender: 'Unisex',
    price: 3499,
    originalPrice: 4999,
    rating: 4.7,
    reviews: 842,
    discount: '30% OFF',
    bogo: false,
    sale: true,
    image: '🕶️',
    colors: ['#D4AF37', '#212121', '#5D4037'],
    specs: { material: 'Stainless Steel', frameType: 'Full Rim', shape: 'Aviator', weight: '22g', lensWidth: '58mm', templeLength: '140mm' },
    desc: 'Timeless Italian aviator styling updated with modern corrosion-resistant stainless steel and Category 3 polarized lenses with 100% UV400 protection.'
  },
  {
    id: '305',
    name: 'Tortoise Classic TR90 #305',
    brand: 'LENS MAKERS STUDIO',
    category: 'Eyeglasses',
    shape: 'Round',
    material: 'TR90',
    frameType: 'Full Rim',
    gender: 'Unisex',
    price: 2499,
    originalPrice: 3999,
    rating: 4.6,
    reviews: 615,
    discount: '37% OFF',
    bogo: true,
    sale: true,
    image: '👓',
    colors: ['#5D4037', '#000000', '#1E88E5'],
    specs: { material: 'Swiss TR90 Polymer', frameType: 'Full Rim', shape: 'Round', weight: '16g', lensWidth: '50mm', templeLength: '145mm' },
    desc: 'Ultra-durable Swiss TR90 memory polymer in rich Havana tortoise shell. Resistant to impact, extreme temperatures, and skin oils.'
  },
  {
    id: '409',
    name: 'Neo Wayfarer Carbon #409',
    brand: 'LENS MAKERS CLASSIC',
    category: 'Sunglasses',
    shape: 'Wayfarer',
    material: 'Acetate',
    frameType: 'Full Rim',
    gender: 'Men',
    price: 3999,
    originalPrice: 5499,
    rating: 4.9,
    reviews: 1840,
    discount: '27% OFF',
    bogo: false,
    sale: false,
    image: '🕶️',
    colors: ['#212121', '#1E88E5', '#43A047'],
    specs: { material: 'Mazzucchelli Acetate', frameType: 'Full Rim', shape: 'Wayfarer', weight: '28g', lensWidth: '52mm', templeLength: '145mm' },
    desc: 'Hand-polished Mazzucchelli Italian acetate reinforced with internal carbon fiber core wires. Includes anti-reflective inner lens coating.'
  },
  {
    id: '512',
    name: 'Cat-Eye Luxe Gold #512',
    brand: 'LENS MAKERS STUDIO',
    category: 'Eyeglasses',
    shape: 'Cat Eye',
    material: 'Stainless Steel',
    frameType: 'Half Rim',
    gender: 'Women',
    price: 3899,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 920,
    discount: '22% OFF',
    bogo: true,
    sale: false,
    image: '👓',
    colors: ['#FF7873', '#D4AF37', '#8140DC'],
    specs: { material: 'Monel & Stainless', frameType: 'Half Rim', shape: 'Cat Eye', weight: '19g', lensWidth: '53mm', templeLength: '138mm' },
    desc: 'Sophisticated brow-line accentuating cat-eye silhouette with 18k rose gold plating and adjustable hypoallergenic silicone nose pads.'
  },
  {
    id: '618',
    name: 'Hexagonal Retro Metal #618',
    brand: 'LENS MAKERS AIR',
    category: 'Sunglasses',
    shape: 'Hexagonal',
    material: 'Stainless Steel',
    frameType: 'Full Rim',
    gender: 'Unisex',
    price: 3299,
    originalPrice: 4499,
    rating: 4.5,
    reviews: 430,
    discount: '26% OFF',
    bogo: false,
    sale: true,
    image: '🕶️',
    colors: ['#D4AF37', '#78909C', '#212121'],
    specs: { material: 'Coin-edge Stainless', frameType: 'Full Rim', shape: 'Hexagonal', weight: '24g', lensWidth: '51mm', templeLength: '140mm' },
    desc: 'Geometric 6-sided crystal lenses housed in thin coin-edge embossed wireframes. A striking statement piece with 100% UV protection.'
  },
  {
    id: '725',
    name: 'Clubmaster Browline #725',
    brand: 'LENS MAKERS CLASSIC',
    category: 'Eyeglasses',
    shape: 'Clubmaster',
    material: 'Acetate',
    frameType: 'Half Rim',
    gender: 'Men',
    price: 2999,
    originalPrice: 4299,
    rating: 4.7,
    reviews: 550,
    discount: '30% OFF',
    bogo: false,
    sale: false,
    image: '👓',
    colors: ['#000000', '#5D4037', '#1E88E5'],
    specs: { material: 'Acetate & Steel', frameType: 'Half Rim', shape: 'Clubmaster', weight: '25g', lensWidth: '51mm', templeLength: '142mm' },
    desc: 'Mid-century intellectual styling featuring thick acetate upper brow bars anchored to lower metal lens rims.'
  },
  {
    id: '831',
    name: 'Kids Flexible TR90 Blue #831',
    brand: 'LENS MAKERS KIDS',
    category: 'Kids',
    shape: 'Oval',
    material: 'TR90',
    frameType: 'Full Rim',
    gender: 'Kids',
    price: 1499,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 310,
    discount: '40% OFF',
    bogo: true,
    sale: true,
    image: '👓',
    colors: ['#29B6F6', '#FF7873', '#43A047'],
    specs: { material: '180-deg Bendable TR90', frameType: 'Full Rim', shape: 'Oval', weight: '12g', lensWidth: '46mm', templeLength: '130mm' },
    desc: 'Virtually indestructible 180-degree bendable frames designed specifically for active children. BPA-free, non-toxic, and lightweight.'
  },
  {
    id: '944',
    name: 'Oasis Polarized Square #944',
    brand: 'LENS MAKERS STUDIO',
    category: 'Sunglasses',
    shape: 'Square',
    material: 'Aluminium',
    frameType: 'Full Rim',
    gender: 'Men',
    price: 4499,
    originalPrice: 6499,
    rating: 4.8,
    reviews: 780,
    discount: '30% OFF',
    bogo: false,
    sale: false,
    image: '🕶️',
    colors: ['#37474F', '#212121', '#1E88E5'],
    specs: { material: 'Magnesium-Aluminium', frameType: 'Full Rim', shape: 'Square', weight: '21g', lensWidth: '56mm', templeLength: '142mm' },
    desc: 'Precision-machined magnesium-aluminium alloy providing unmatched strength-to-weight ratio. Includes spring hinges and high-contrast TAC lenses.'
  },
  {
    id: '1055',
    name: 'Hydro-Gel Daily Contact Lenses (30 Pack)',
    brand: 'LENS MAKERS AIR',
    category: 'Contact Lenses',
    shape: 'Round',
    material: 'TR90',
    frameType: 'Rimless',
    gender: 'Unisex',
    price: 1299,
    originalPrice: 1999,
    rating: 4.9,
    reviews: 2410,
    discount: '35% OFF',
    bogo: true,
    sale: true,
    image: '👁️',
    colors: ['#29B6F6'],
    specs: { material: 'Senofilcon A Hydro-Gel', frameType: 'Disposable', shape: 'Spherical', weight: '0.05g', lensWidth: '14.2mm', templeLength: 'N/A' },
    desc: 'Breathable silicone hydrogel daily disposable contact lenses with HYDRACLEAR moisture-lock technology for 16 hours of continuous comfort.'
  }
];

const FRAME_SHAPES = [
  { name: 'Rectangle', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="18" height="12" rx="2" />
      <rect x="28" y="6" width="18" height="12" rx="2" />
      <path d="M 20 12 Q 24 8 28 12" />
    </svg>
  ) },
  { name: 'Round', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="12" r="8" />
      <circle cx="37" cy="12" r="8" />
      <path d="M 19 12 Q 24 8 29 12" />
    </svg>
  ) },
  { name: 'Cat Eye', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 2 8 L 16 6 C 16 16 10 18 6 18 C 3 18 2 12 2 8 Z" />
      <path d="M 46 8 L 32 6 C 32 16 38 18 42 18 C 45 18 46 12 46 8 Z" />
      <path d="M 16 10 Q 24 8 32 10" />
    </svg>
  ) },
  { name: 'Wayfarer', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 2 8 L 19 8 L 17 18 C 12 20 6 20 4 18 Z" />
      <path d="M 46 8 L 29 8 L 31 18 C 36 20 42 20 44 18 Z" />
      <path d="M 19 10 Q 24 8 29 10" />
    </svg>
  ) },
  { name: 'Aviator', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 18,12 C 18,20 12,22 8,22 C 4,22 2,18 2,12 C 2,6 6,4 10,4 C 15,4 18,7 18,12 Z" />
      <path d="M 46,12 C 46,20 40,22 36,22 C 32,22 30,18 30,12 C 30,6 34,4 38,4 C 43,4 46,7 46,12 Z" />
      <path d="M 17 9 Q 24 7 31 9" />
      <path d="M 18 5 Q 24 3 30 5" />
    </svg>
  ) },
  { name: 'Hexagonal', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6,6 16,6 20,12 16,18 6,18 2,12" />
      <polygon points="32,6 42,6 46,12 42,18 32,18 28,12" />
      <path d="M 20 12 Q 24 8 28 12" />
    </svg>
  ) },
  { name: 'Clubmaster', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 2 8 C 8 4 16 6 19 8" strokeWidth="4" />
      <path d="M 46 8 C 40 4 32 6 29 8" strokeWidth="4" />
      <path d="M 2 8 L 4 18 C 10 20 17 18 19 8" strokeWidth="1.5" />
      <path d="M 46 8 L 44 18 C 38 20 31 18 29 8" strokeWidth="1.5" />
      <path d="M 19 10 Q 24 8 29 10" />
    </svg>
  ) },
  { name: 'Square', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <rect x="31" y="4" width="14" height="16" rx="2" />
      <path d="M 17 12 Q 24 8 31 12" />
    </svg>
  ) },
  { name: 'Oval', icon: (
    <svg viewBox="0 0 48 24" width="1em" height="0.5em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="11" cy="12" rx="9" ry="6" />
      <ellipse cx="37" cy="12" rx="9" ry="6" />
      <path d="M 20 12 Q 24 8 28 12" />
    </svg>
  ) }
];

const LENS_OPTIONS = [
  { name: 'Zero Power (Sunglass/Fashion)', desc: 'No prescription needed', price: 0 },
  { name: 'Single Vision (Stock Range)', desc: 'For near or far correction · Sph -6 to +4, Cyl up to -3', price: 499 },
  { name: 'Blue Light Block (Stock Range)', desc: 'Reduces digital eye strain · Sph -6 to +4, Cyl up to -3', price: 699 },
  { name: 'Progressive (No-Line Bifocal)', desc: 'See at all distances · Stock Sph -4 to +4, Cyl up to -3', price: 1299 },
  { name: 'Computer Glasses', desc: 'Optimized contrast for screens · Stock range available', price: 899 }
];

const ShopScreen = ({ onSelectTab }) => {
  // Navigation & Filtering State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedShape, setSelectedShape] = useState(null);
  const [sortOption, setSortOption] = useState('Popularity');
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Filter Panel Accordion & Selections State
  const [activeAccordion, setActiveAccordion] = useState('price');
  const [priceMax, setPriceMax] = useState(15000);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [minRating, setMinRating] = useState(null);

  // Card Interactive States
  const [wishlist, setWishlist] = useState(['101', '409']); // demo default saved
  const [activeColors, setActiveColors] = useState({ '101': '#1E88E5', '204': '#D4AF37', '305': '#5D4037', '409': '#212121', '512': '#FF7873', '618': '#D4AF37', '725': '#000000', '831': '#29B6F6', '944': '#37474F', '1055': '#29B6F6' });

  // PDP (Product Detail Page) State
  const [pdpItem, setPdpItem] = useState(null);
  const [pdpActiveColor, setPdpActiveColor] = useState(null);
  const [pdpSelectedFit, setPdpSelectedFit] = useState('Standard');
  const [pdpSelectedLensIdx, setPdpSelectedLensIdx] = useState(0);
  const [pdpActiveThumbIdx, setPdpActiveThumbIdx] = useState(0);
  const [pdpAccordion, setPdpAccordion] = useState('desc');
  const [addedBtnState, setAddedBtnState] = useState(false);

  // Cart Fly Animation State
  const [flyingParticles, setFlyingParticles] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Re-initialize Lucide icons & Check search selection
  useEffect(() => {
    if (window._selectedPdpName) {
      const target = PRODUCTS_DATA.find(p => p.name === window._selectedPdpName);
      if (target) {
        setPdpItem(target);
      }
      window._selectedPdpName = null;
    }
    if (window.lucide && window.lucide.createIcons) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }, [selectedCategory, selectedShape, showFilterSheet, showSortSheet, pdpItem, pdpAccordion]);

  // Filtered & Sorted Products Calculation
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((item) => {
      // 1. Category tab filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Sale') {
          if (!item.sale && !item.discount) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }
      // 2. Shape filter (combinable!)
      if (selectedShape && item.shape !== selectedShape) {
        return false;
      }
      // 3. Price slider filter
      if (item.price > priceMax) return false;
      // 4. Material filter
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(item.material)) return false;
      // 5. Frame type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(item.frameType)) return false;
      // 6. Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) return false;
      // 7. Gender filter
      if (selectedGenders.length > 0 && !selectedGenders.includes(item.gender)) return false;
      // 8. Rating filter
      if (minRating && item.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'Price: Low to High') return a.price - b.price;
      if (sortOption === 'Price: High to Low') return b.price - a.price;
      if (sortOption === 'Best Rated') return b.rating - a.rating;
      if (sortOption === 'Newest') return parseInt(b.id) - parseInt(a.id);
      return b.reviews - a.reviews; // Popularity default
    });
  }, [selectedCategory, selectedShape, sortOption, priceMax, selectedMaterials, selectedTypes, selectedBrands, selectedGenders, minRating]);

  // Toggle Wishlist Heart with animation (Prompt 2 Section 4)
  const handleToggleWishlist = (e, itemId) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    setWishlist((prev) => {
      const exists = prev.includes(itemId);
      if (exists) {
        showToast('💔 Removed from Wishlist');
        if (btn) {
          btn.classList.add('unsaving');
          setTimeout(() => btn.classList.remove('unsaving'), 300);
        }
        return prev.filter((id) => id !== itemId);
      } else {
        showToast('❤️ Saved to Wishlist!');
        if (btn) {
          btn.classList.add('saving');
          setTimeout(() => btn.classList.remove('saving'), 500);
          if (window.burstHeartParticles) window.burstHeartParticles(btn);
        }
        return [...prev, itemId];
      }
    });
  };

  // Trigger Cart Fly Particle Animation (Prompt 2 Section 5)
  const handleAddToCart = (e, item) => {
    if (e) e.stopPropagation();
    if (window.animateAddToCart && e && e.currentTarget) {
      window.animateAddToCart(e.currentTarget);
    } else {
      const id = Date.now();
      setFlyingParticles((prev) => [...prev, id]);
      setTimeout(() => {
        setFlyingParticles((prev) => prev.filter((p) => p !== id));
      }, 600);
    }

    showToast(`🛍️ Added "${item.name}" to Cart!`);
    // Notify window if badge update needed
    try {
      const prevCart = parseInt(localStorage.getItem('lensmakers_cart_count') || '2', 10);
      localStorage.setItem('lensmakers_cart_count', String(prevCart + 1));
    } catch (err) {}
  };

  // Open PDP
  const handleOpenPdp = (item) => {
    setPdpItem(item);
    setPdpActiveColor(activeColors[item.id] || item.colors[0]);
    setPdpSelectedFit('Standard');
    setPdpSelectedLensIdx(0);
    setPdpActiveThumbIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Live Total Price on PDP
  const pdpTotalPrice = pdpItem ? pdpItem.price + LENS_OPTIONS[pdpSelectedLensIdx].price : 0;

  // Multi-select helper for filters
  const toggleFilterArray = (array, setArray, val) => {
    if (array.includes(val)) {
      setArray(array.filter((x) => x !== val));
    } else {
      setArray([...array, val]);
    }
  };

  return (
    <div className="screen-transition-enter" style={{ minHeight: '100vh', paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 24px)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="lens-toast" style={{ zIndex: 9999 }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cart Flying Particles */}
      {flyingParticles.map((pid) => (
        <div key={pid} className="cart-flying-particle" style={{ bottom: '80px', right: '30px' }}>
          🛒
        </div>
      ))}

      {/* ==========================================================================
         PART 1: SHOP HOME / CATEGORY LANDING PAGE (PLP)
         ========================================================================== */}
      {!pdpItem && (
        <>
          {/* HEADER BAR */}
          <div className="flex-between" style={{ padding: '16px var(--screen-padding) 8px' }}>
            <div>
              <span className="badge-pill badge-pink mb-1">CATALOG & FILTERS</span>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                {selectedCategory === 'All' ? 'Lens Makers Shop' : selectedCategory}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#A0A4C8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setShowFilterSheet(true)}
                title="Open Filters"
              >
                <i data-lucide="sliders" style={{ width: '18px', height: '18px', color: '#FF7A30' }} />
              </button>
            </div>
          </div>

          {/* GENDER/CATEGORY TABS (Horizontal Scrollable Pill Row) */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '10px var(--screen-padding) 14px', scrollbarWidth: 'none' }}>
            {['All', 'Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Kids', 'Sale'].map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  style={{
                    padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', flexShrink: 0,
                    background: isActive ? 'linear-gradient(135deg, #FF7873 0%, #E22F80 100%)' : 'rgba(255,240,224, 0.65)',
                    color: isActive ? '#FFFFFF' : '#A0A4C8',
                    border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: isActive ? '0 4px 14px rgba(226,47,128, 0.5)' : 'none',
                    cursor: 'pointer', transition: 'all 200ms var(--spring-bezier)'
                  }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'Sale' ? '🔥 ' + cat : cat}
                </button>
              );
            })}
          </div>

          {/* FRAME SHAPE SELECTOR (Below Tabs) */}
          <div style={{ padding: '0 var(--screen-padding) 16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
              Filter by Frame Shape {selectedShape && <span style={{ color: '#FF7873', cursor: 'pointer' }} onClick={() => setSelectedShape(null)}>(Clear ✕)</span>}
            </div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              {FRAME_SHAPES.map((shape) => {
                const isSel = selectedShape === shape.name;
                return (
                  <div
                    key={shape.name}
                    className={`shape-circle-btn ${isSel ? 'active' : ''}`}
                    onClick={() => setSelectedShape(isSel ? null : shape.name)}
                  >
                    <span style={{ fontSize: '32px', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSel ? '#FF7873' : '#A0A4C8' }}>{shape.icon}</span>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: isSel ? '#FF7873' : '#A0A4C8', marginTop: '4px' }}>{shape.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SORT ROW */}
          <div className="flex-between" style={{ padding: '4px var(--screen-padding) 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#A0A4C8', fontWeight: '600' }}>
              <strong style={{ color: '#FFFFFF' }}>{filteredProducts.length}</strong> frames found
            </span>
            <button
              type="button"
              style={{
                padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,240,224, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
              }}
              onClick={() => setShowSortSheet(true)}
            >
              <span>Sort: {sortOption}</span>
              <span style={{ color: '#FF7873' }}>▾</span>
            </button>
          </div>

          {/* PRODUCT GRID (2 Columns) */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <span style={{ fontSize: '48px' }}>🔍</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginTop: '16px' }}>No matching eyewear found</h3>
              <p style={{ fontSize: '13px', color: '#A0A4C8', marginTop: '8px' }}>Try relaxing your shape or price filters.</p>
              <button
                type="button"
                className="btn-primary-pill mt-3"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedShape(null);
                  setPriceMax(15000);
                  setSelectedMaterials([]);
                  setSelectedTypes([]);
                  setSelectedBrands([]);
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid-2col">
              {filteredProducts.map((item) => {
                const isSaved = wishlist.includes(item.id);
                const activeColor = activeColors[item.id] || item.colors[0];
                const memberPrice = Math.round(item.price * 0.75);

                return (
                  <div key={item.id} className="product-card-glass" onClick={() => handleOpenPdp(item)}>
                    {/* TOP IMAGE AREA (1:1 White Inset) */}
                    <div className="white-surface-inset">
                      {/* Discount / BOGO Badges */}
                      <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 5 }}>
                        {item.discount && (
                          <span style={{ background: '#FF7A30', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: '900', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                            {item.discount}
                          </span>
                        )}
                        {(item.bogo || item.price >= 1699) && (
                          <span style={{ background: '#43A047', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: '900', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                            BOGO FREE
                          </span>
                        )}
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        type="button"
                        className={`wishlist-circle-btn heart-btn ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => handleToggleWishlist(e, item.id)}
                      >
                        <span className="heart-icon" style={{ fontSize: '16px', color: isSaved ? '#FF7873' : '#FFFFFF', transition: 'all 200ms ease' }}>
                          {isSaved ? '♥' : '♡'}
                        </span>
                      </button>

                      {/* Product Visual (Emoji/Thumbnail simulated with tint) */}
                      <div style={{ fontSize: '64px', filter: `drop-shadow(0 8px 12px rgba(0,0,0,0.15))` }}>
                        {item.image}
                      </div>

                      {/* Sale Ribbon Corner */}
                      {item.sale && (
                        <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(226,47,128, 0.15)', color: '#E22F80', padding: '2px 6px', borderRadius: '6px', fontSize: '9px', fontWeight: '800' }}>
                          SALE ITEM
                        </div>
                      )}
                    </div>

                    {/* BOTTOM INFO AREA */}
                    <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {item.brand}
                        </div>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 8px', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px' }}>
                          {item.name}
                        </h3>

                        {/* Color Swatches Row */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', alignItems: 'center', minHeight: '18px' }}>
                          {item.colors.map((hex, idx) => (
                            <span
                              key={idx}
                              className={`swatch-dot ${activeColor === hex ? 'selected' : ''}`}
                              style={{ background: hex }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveColors((prev) => ({ ...prev, [item.id]: hex }));
                              }}
                              title={`Switch to color variant ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Price Row & Add to Cart */}
                      <div className="flex-between" style={{ alignItems: 'flex-end', marginTop: '4px' }}>
                        <div>
                          {window.userIsMember !== false ? (
                            <>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                <span style={{ fontSize: '16px', fontWeight: '900', color: '#8140DC' }}>₹{memberPrice}</span>
                                <span style={{ fontSize: '12px', color: '#6B6E9A', textDecoration: 'line-through' }}>₹{item.price}</span>
                              </div>
                              <div style={{ fontSize: '10px', fontWeight: '800', color: '#43A047', background: 'rgba(67,160,71,0.15)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                                ★ YOUR VIP PRICE
                              </div>
                            </>
                          ) : (
                            <>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                <span style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF' }}>₹{item.price}</span>
                                {item.originalPrice && (
                                  <span style={{ fontSize: '12px', color: '#6B6E9A', textDecoration: 'line-through' }}>₹{item.originalPrice}</span>
                                )}
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#8140DC', marginTop: '2px' }}>
                                Members: ₹{memberPrice}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Small Pink Glass Cart Button */}
                        <button
                          type="button"
                          style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF7873 0%, #E22F80 100%)',
                            border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(226,47,128,0.4)'
                          }}
                          onClick={(e) => handleAddToCart(e, item)}
                          title="Add to Cart"
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* INFINITE SCROLL SUBTLE FOOTER */}
          <div style={{ textAlign: 'center', paddingBottom: '30px', color: '#6B6E9A', fontSize: '13px', fontWeight: '600' }}>
            <span>✨ Showing all {filteredProducts.length} premium frames</span>
          </div>
        </>
      )}

      {/* ==========================================================================
         PART 2: PRODUCT DETAIL PAGE (PDP) — FULL SCREEN SLIDE-IN
         ========================================================================== */}
      {pdpItem && (
        <div className="pdp-full-page">
          {/* BACK + SHARE HEADER */}
          <div className="flex-between" style={{ padding: '16px var(--screen-padding)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,245,236,0.8)', backdropFilter: 'blur(20px)' }}>
            <button
              type="button"
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
              onClick={() => setPdpItem(null)}
              title="Back to Catalog"
            >
              ←
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="wishlist-circle-btn"
                style={{ position: 'relative', top: 0, right: 0, width: '40px', height: '40px' }}
                onClick={(e) => handleToggleWishlist(e, pdpItem.id)}
              >
                <span style={{ fontSize: '18px', color: wishlist.includes(pdpItem.id) ? '#FF7873' : '#FFFFFF' }}>
                  {wishlist.includes(pdpItem.id) ? '♥' : '♡'}
                </span>
              </button>
              <button
                type="button"
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => showToast('📤 Share link copied to clipboard!')}
                title="Share Product"
              >
                <i data-lucide="share-2" style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>

          {/* IMAGE GALLERY (320px White Panel) */}
          <div className="pdp-gallery-panel">
            {/* Top Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 5 }}>
              {pdpItem.discount && (
                <span style={{ background: '#FF7A30', color: '#FFFFFF', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '900' }}>
                  {pdpItem.discount}
                </span>
              )}
              {pdpItem.bogo && (
                <span style={{ background: '#43A047', color: '#FFFFFF', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '900' }}>
                  BOGO FREE
                </span>
              )}
            </div>

            {/* Simulated 3D Angle visual (rotates slightly on thumbnail switch) */}
            <div style={{ fontSize: '130px', filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.2))', transform: `scale(${1 + pdpActiveThumbIdx * 0.08}) rotate(${pdpActiveThumbIdx * 8}deg)`, transition: 'all 300ms var(--spring-bezier)' }}>
              {pdpItem.image}
            </div>

            {/* FLOATING "TRY IN 3D" CONVERSION CTA */}
            <button
              type="button"
              className="pulse-glow-circle"
              style={{
                position: 'absolute', bottom: '16px', right: '16px', zIndex: 10,
                width: 'auto', height: '42px', borderRadius: '999px', padding: '0 16px',
                background: 'rgba(226,47,128, 0.2)', border: '1.5px solid #FF7873',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
              }}
              onClick={() => {
                showToast('🚀 Launching Apple AR Kit 3D Try-On...');
                if (onSelectTab) onSelectTab('tryon');
              }}
            >
              <i data-lucide="camera" style={{ width: '18px', height: '18px', color: '#FF7873' }} />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#FF7873' }}>Try in 3D</span>
            </button>
          </div>

          {/* THUMBNAIL STRIP BELOW GALLERY */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '16px 0' }}>
            {['Front View', 'Side Angle', 'Temple Detail', 'Case & Kit'].map((label, idx) => (
              <div
                key={idx}
                style={{
                  width: '56px', height: '56px', borderRadius: '10px', background: '#FFFFFF',
                  border: `2.5px solid ${pdpActiveThumbIdx === idx ? '#FF7873' : 'transparent'}`,
                  boxShadow: pdpActiveThumbIdx === idx ? '0 0 12px rgba(226,47,128,0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onClick={() => setPdpActiveThumbIdx(idx)}
                title={label}
              >
                <span style={{ fontSize: '24px', transform: `rotate(${idx * 8}deg)` }}>{pdpItem.image}</span>
              </div>
            ))}
          </div>

          {/* PRODUCT INFO CARD (Glass surface) */}
          <div className="glass-card-elevated fade-up-item" style={{ margin: '0 var(--screen-padding) 20px', padding: '24px 20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#A0A4C8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              {pdpItem.brand}
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', margin: '6px 0 10px', letterSpacing: '-0.3px' }}>
              {pdpItem.name}
            </h1>

            {/* Rating Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' }} onClick={() => setPdpAccordion('reviews')}>
              <span style={{ color: '#C9A876', fontSize: '14px', letterSpacing: '2px' }}>★★★★☆</span>
              <span style={{ fontSize: '13px', color: '#A0A4C8', fontWeight: '600' }}>
                <strong style={{ color: '#FFFFFF' }}>{pdpItem.rating}</strong> · {pdpItem.reviews} reviews
              </span>
            </div>

            {/* Price Block */}
            <div style={{ background: 'rgba(255,240,224,0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {window.userIsMember !== false ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '900', color: '#8140DC' }}>₹{Math.round(pdpItem.price * 0.75)}</span>
                    <span style={{ fontSize: '18px', color: '#6B6E9A', textDecoration: 'line-through' }}>₹{pdpItem.price}</span>
                    <span className="badge-pill badge-green" style={{ marginLeft: 'auto' }}>★ YOUR VIP PRICE</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed rgba(255,255,255,0.15)' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#43A047' }}>
                      ⚡ You save ₹{pdpItem.price - Math.round(pdpItem.price * 0.75)} with your VIP Membership!
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#FFFFFF' }}>₹{pdpItem.price}</span>
                    {pdpItem.originalPrice && (
                      <span style={{ fontSize: '16px', color: '#6B6E9A', textDecoration: 'line-through' }}>₹{pdpItem.originalPrice}</span>
                    )}
                    {pdpItem.discount && (
                      <span className="badge-pill badge-orange" style={{ marginLeft: 'auto' }}>{pdpItem.discount}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed rgba(255,255,255,0.15)' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#8140DC' }}>
                      ⚡ Members pay ₹{Math.round(pdpItem.price * 0.75)} — Save ₹{pdpItem.price - Math.round(pdpItem.price * 0.75)}
                    </span>
                    <span 
                      style={{ fontSize: '12px', color: '#8140DC', fontWeight: '800', textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => { if (onSelectTab) onSelectTab('membership'); }}
                    >
                      Join for ₹99/mo →
                    </span>
                  </div>
                </>
              )}
              {(pdpItem.bogo || pdpItem.price >= 1699) && (
                <div style={{ fontSize: '13px', color: '#43A047', fontWeight: '800', marginTop: '10px', padding: '8px 12px', background: 'rgba(67,160,71,0.15)', borderRadius: '8px', border: '1px solid rgba(67,160,71,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>🎁 BOGO ELIGIBLE: Buy this frame & get a 2nd pair FREE!</span>
                  <span style={{ fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { if (onSelectTab) onSelectTab('cart'); }}>See Offer →</span>
                </div>
              )}
            </div>

            {/* COLOR SELECTOR */}
            <div style={{ marginTop: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#A0A4C8', fontWeight: '700' }}>Select Frame Color:</span>
                <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: '600' }}>{pdpActiveColor || pdpItem.colors[0]}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {pdpItem.colors.map((hex, idx) => {
                  const isSel = pdpActiveColor === hex;
                  return (
                    <div
                      key={idx}
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%', background: hex,
                        border: `2px solid ${isSel ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}`,
                        boxShadow: isSel ? `0 0 14px ${hex}` : 'none',
                        cursor: 'pointer', transition: 'all 200ms var(--spring-bezier)',
                        transform: isSel ? 'scale(1.15)' : 'scale(1)'
                      }}
                      onClick={() => setPdpActiveColor(hex)}
                    />
                  );
                })}
              </div>
            </div>

            {/* SIZE/FIT SELECTOR */}
            <div style={{ marginTop: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#A0A4C8', fontWeight: '700' }}>Select Fit Size:</span>
                <span 
                  style={{ fontSize: '12px', color: '#FF7873', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => showToast('📐 Fit Guide: Standard fits 90% of faces')}
                >
                  Fit Guide 📏
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Narrow', 'Standard', 'Wide'].map((fit) => {
                  const isSel = pdpSelectedFit === fit;
                  return (
                    <button
                      key={fit}
                      type="button"
                      style={{
                        flex: 1, height: '40px', borderRadius: '999px', fontSize: '13px', fontWeight: '700',
                        background: isSel ? 'linear-gradient(135deg, #FF7873 0%, #E22F80 100%)' : 'rgba(255,240,224,0.6)',
                        color: isSel ? '#FFFFFF' : '#A0A4C8',
                        border: isSel ? 'none' : '1px solid rgba(255,255,255,0.2)',
                        boxShadow: isSel ? '0 4px 12px rgba(226,47,128,0.4)' : 'none',
                        cursor: 'pointer', transition: 'all 200ms var(--spring-bezier)'
                      }}
                      onClick={() => setPdpSelectedFit(fit)}
                    >
                      {fit}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SPECIFICATION MINI-GRID (2x3 Glass Cells) */}
          <div style={{ margin: '0 var(--screen-padding) 24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px' }}>Technical Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Material', value: pdpItem.specs.material, icon: 'shield' },
                { label: 'Frame Type', value: pdpItem.specs.frameType, icon: 'glasses' },
                { label: 'Shape', value: pdpItem.specs.shape, icon: 'circle' },
                { label: 'Weight', value: pdpItem.specs.weight, icon: 'feather' },
                { label: 'Lens Width', value: pdpItem.specs.lensWidth, icon: 'maximize-2' },
                { label: 'Temple Length', value: pdpItem.specs.templeLength, icon: 'ruler' }
              ].map((spec, idx) => (
                <div key={idx} className="glass-card-standard" style={{ padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#A0A4C8', fontWeight: '600', marginBottom: '4px' }}>{spec.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LENS CUSTOMIZATION SECTION (Radio List) */}
          <div className="glass-card-elevated" style={{ margin: '0 var(--screen-padding) 24px', padding: '22px 18px' }}>
            <div className="flex-between" style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>Choose Your Lenses</h3>
              <span 
                style={{ fontSize: '12px', color: '#FF7873', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => showToast('🔬 Lens Guide: Blue Light filters screen glare!')}
              >
                What's the difference?
              </span>
            </div>

            {LENS_OPTIONS.map((lens, idx) => {
              const isSel = pdpSelectedLensIdx === idx;
              return (
                <div
                  key={idx}
                  className={`lens-radio-row ${isSel ? 'selected' : ''}`}
                  onClick={() => setPdpSelectedLensIdx(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #FF7873', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSel ? '#FF7873' : 'transparent' }}>
                      {isSel && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>{lens.name}</div>
                      <div style={{ fontSize: '12px', color: '#A0A4C8', marginTop: '2px' }}>{lens.desc}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: isSel ? '#FF7873' : '#FFFFFF', whiteSpace: 'nowrap' }}>
                    {lens.price === 0 ? '+₹0' : `+₹${lens.price}`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESCRIPTION & ACCORDIONS */}
          <div style={{ margin: '0 var(--screen-padding) 30px' }}>
            {[
              { id: 'desc', title: 'Product Description', content: pdpItem.desc },
              { id: 'care', title: 'Material & Care Instructions', content: 'Clean lenses daily using the provided microfiber cloth and lens solution. Never use hot water, paper towels, or household glass cleaners as they can scratch proprietary anti-reflective coatings.' },
              { id: 'shipping', title: 'Shipping & Free 14-Day Returns', content: 'Free express shipping on all orders over ₹999. If you are not 100% satisfied with the fit or prescription, return within 14 days for a full refund or free home replacement.' }
            ].map((acc) => {
              const isOpen = pdpAccordion === acc.id;
              return (
                <div key={acc.id} className="glass-card-standard mb-2" style={{ padding: '16px 18px', cursor: 'pointer' }} onClick={() => setPdpAccordion(isOpen ? null : acc.id)}>
                  <div className="flex-between">
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>{acc.title}</span>
                    <span className={`chevron-rotate ${isOpen ? 'expanded' : ''}`} style={{ color: '#FF7873', fontWeight: 'bold' }}>▼</span>
                  </div>
                  {isOpen && (
                    <p style={{ fontSize: '13px', color: '#A0A4C8', lineHeight: '1.6', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                      {acc.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* REVIEWS SECTION */}
          <div className="glass-card-elevated" style={{ margin: '0 var(--screen-padding) 30px', padding: '24px 20px' }}>
            <div className="flex-between mb-3">
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>Customer Reviews</h3>
              <button 
                type="button" 
                className="btn-secondary-pill" 
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => showToast('✍️ Write Review modal opening...')}
              >
                Write a Review
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#FFFFFF', lineHeight: '1' }}>{pdpItem.rating}</div>
                <div style={{ color: '#C9A876', fontSize: '14px', margin: '4px 0' }}>★★★★☆</div>
                <div style={{ fontSize: '11px', color: '#A0A4C8' }}>Based on {pdpItem.reviews} reviews</div>
              </div>

              {/* Distribution bars */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { stars: '5★', pct: '78%' },
                  { stars: '4★', pct: '16%' },
                  { stars: '3★', pct: '4%' },
                  { stars: '2★', pct: '1%' },
                  { stars: '1★', pct: '1%' }
                ].map((bar, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#A0A4C8', fontWeight: '700' }}>
                    <span style={{ width: '20px' }}>{bar.stars}</span>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: bar.pct, height: '100%', background: 'linear-gradient(90deg, #FF7873, #43A047)' }} />
                    </div>
                    <span style={{ width: '28px', textAlign: 'right' }}>{bar.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            {[
              { name: 'Rohan Mehta', date: '2 days ago', stars: '★★★★★', text: 'Incredibly lightweight! The titanium build feels premium and the progressive lens clarity is sharper than my optical shop pair.' },
              { name: 'Priya Sharma', date: '1 week ago', stars: '★★★★★', text: 'Loved the 3D try-on feature! The rose gold accent on these frames looks super stylish in professional meetings.' }
            ].map((rev, idx) => (
              <div key={idx} className="glass-card-standard mb-2" style={{ padding: '14px' }}>
                <div className="flex-between mb-1">
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>{rev.name}</span>
                  <span style={{ fontSize: '11px', color: '#6B6E9A' }}>{rev.date}</span>
                </div>
                <div style={{ color: '#C9A876', fontSize: '12px', marginBottom: '6px' }}>{rev.stars}</div>
                <p style={{ fontSize: '12px', color: '#A0A4C8', lineHeight: '1.4' }}>{rev.text}</p>
              </div>
            ))}
          </div>

          {/* RELATED PRODUCTS HORIZONTAL SCROLL */}
          <div style={{ padding: '0 var(--screen-padding) 40px' }}>
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF' }}>You Might Also Like</h3>
              <span style={{ fontSize: '12px', color: '#FF7873', fontWeight: '700', cursor: 'pointer' }} onClick={() => setPdpItem(null)}>See All →</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
              {PRODUCTS_DATA.filter((x) => x.id !== pdpItem.id).slice(0, 4).map((rel) => (
                <div
                  key={rel.id}
                  className="product-card-glass"
                  style={{ minWidth: '180px', maxWidth: '180px' }}
                  onClick={() => handleOpenPdp(rel)}
                >
                  <div className="white-surface-inset" style={{ margin: '6px' }}>
                    <span style={{ fontSize: '48px' }}>{rel.image}</span>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#A0A4C8' }}>{rel.brand}</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF', margin: '2px 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rel.name}</div>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF' }}>₹{rel.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STICKY LIVE TOTAL PRICE BAR */}
          <div className="pdp-live-price-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#A0A4C8', fontWeight: '700' }}>Live Total:</span>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF' }}>₹{pdpTotalPrice}</span>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#43A047' }}>
              Includes {LENS_OPTIONS[pdpSelectedLensIdx].name.split('(')[0]}
            </div>
          </div>

          {/* STICKY BOTTOM ACTION BAR (Replaces normal nav on PDP) */}
          <div className="pdp-sticky-action-bar">
            <button
              type="button"
              className="btn-secondary-pill"
              style={{ flex: 1, height: '52px', fontSize: '15px', fontWeight: '800', border: '1.5px solid #FF7873', color: '#FFFFFF', background: 'rgba(255,240,224,0.8)' }}
              onClick={(e) => {
                handleAddToCart(e, pdpItem);
                setAddedBtnState(true);
                setTimeout(() => setAddedBtnState(false), 1500);
              }}
            >
              <span>{addedBtnState ? '✓ Added to Cart!' : '🛒 Add to Cart'}</span>
            </button>

            <button
              type="button"
              className="btn-primary-pill"
              style={{ flex: 1, height: '52px', fontSize: '15px', fontWeight: '800' }}
              onClick={(e) => {
                handleAddToCart(e, pdpItem);
                if (onSelectTab) onSelectTab('cart');
              }}
            >
              <span>⚡ Buy Now</span>
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================================
         PART 3: FILTER PANEL (BOTTOM SHEET MODAL)
         ========================================================================== */}
      {showFilterSheet && (
        <div className="modal-backdrop screen-transition-enter" onClick={() => setShowFilterSheet(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ padding: '24px var(--screen-padding) 100px', maxHeight: '85vh', overflowY: 'auto' }}>
            {/* Header */}
            <div className="flex-between mb-3">
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>Refine Catalog</h2>
              <span
                style={{ fontSize: '13px', color: '#FF7873', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => {
                  setPriceMax(15000);
                  setSelectedMaterials([]);
                  setSelectedTypes([]);
                  setSelectedBrands([]);
                  setSelectedGenders([]);
                  setMinRating(null);
                  showToast('🔄 Filters cleared!');
                }}
              >
                Clear All
              </span>
            </div>

            {/* Accordion 1: Price Range */}
            <div className="glass-card-standard mb-2" style={{ padding: '16px' }}>
              <div className="flex-between cursor-pointer" onClick={() => setActiveAccordion(activeAccordion === 'price' ? null : 'price')}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Price Range</span>
                <span className={`chevron-rotate ${activeAccordion === 'price' ? 'expanded' : ''}`} style={{ color: '#FF7873' }}>▼</span>
              </div>
              {activeAccordion === 'price' && (
                <div style={{ marginTop: '16px' }}>
                  <div className="flex-between mb-1">
                    <span style={{ fontSize: '12px', color: '#A0A4C8' }}>Max Price:</span>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: '#FF7873' }}>₹{priceMax}</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="15000"
                    step="100"
                    value={priceMax}
                    onChange={(e) => setPriceMax(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#FF7873', cursor: 'pointer' }}
                  />
                  <div className="flex-between mt-1" style={{ fontSize: '11px', color: '#6B6E9A' }}>
                    <span>₹400 (Min)</span>
                    <span>₹15,000 (Max)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Frame Material */}
            <div className="glass-card-standard mb-2" style={{ padding: '16px' }}>
              <div className="flex-between cursor-pointer" onClick={() => setActiveAccordion(activeAccordion === 'material' ? null : 'material')}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Frame Material ({selectedMaterials.length || 'All'})</span>
                <span className={`chevron-rotate ${activeAccordion === 'material' ? 'expanded' : ''}`} style={{ color: '#FF7873' }}>▼</span>
              </div>
              {activeAccordion === 'material' && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Titanium', 'Stainless Steel', 'TR90', 'Acetate', 'Aluminium'].map((mat) => {
                    const checked = selectedMaterials.includes(mat);
                    return (
                      <div key={mat} className="flex-between" style={{ cursor: 'pointer' }} onClick={() => toggleFilterArray(selectedMaterials, setSelectedMaterials, mat)}>
                        <span style={{ fontSize: '13px', color: checked ? '#FFFFFF' : '#A0A4C8', fontWeight: checked ? '700' : '500' }}>{mat}</span>
                        <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: checked ? '#FF7873' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '11px', fontWeight: 'bold' }}>
                          {checked && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 3: Frame Type */}
            <div className="glass-card-standard mb-2" style={{ padding: '16px' }}>
              <div className="flex-between cursor-pointer" onClick={() => setActiveAccordion(activeAccordion === 'type' ? null : 'type')}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Frame Type ({selectedTypes.length || 'All'})</span>
                <span className={`chevron-rotate ${activeAccordion === 'type' ? 'expanded' : ''}`} style={{ color: '#FF7873' }}>▼</span>
              </div>
              {activeAccordion === 'type' && (
                <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                  {['Full Rim', 'Half Rim', 'Rimless'].map((type) => {
                    const checked = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        style={{
                          flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
                          background: checked ? '#FF7873' : 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: 'none', cursor: 'pointer'
                        }}
                        onClick={() => toggleFilterArray(selectedTypes, setSelectedTypes, type)}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 4: House Brands */}
            <div className="glass-card-standard mb-2" style={{ padding: '16px' }}>
              <div className="flex-between cursor-pointer" onClick={() => setActiveAccordion(activeAccordion === 'brand' ? null : 'brand')}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>House Brands</span>
                <span className={`chevron-rotate ${activeAccordion === 'brand' ? 'expanded' : ''}`} style={{ color: '#FF7873' }}>▼</span>
              </div>
              {activeAccordion === 'brand' && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['LENS MAKERS AIR', 'LENS MAKERS CLASSIC', 'LENS MAKERS STUDIO', 'LENS MAKERS KIDS'].map((b) => {
                    const checked = selectedBrands.includes(b);
                    return (
                      <div key={b} className="flex-between" style={{ cursor: 'pointer' }} onClick={() => toggleFilterArray(selectedBrands, setSelectedBrands, b)}>
                        <span style={{ fontSize: '13px', color: checked ? '#FFFFFF' : '#A0A4C8', fontWeight: checked ? '700' : '500' }}>{b}</span>
                        <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: checked ? '#FF7873' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '11px', fontWeight: 'bold' }}>
                          {checked && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sticky Bottom Area of Filter Sheet */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px var(--screen-padding)', background: 'rgba(255,245,236,0.95)', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
                Matching {filteredProducts.length} frames
              </span>
              <button
                type="button"
                className="btn-primary-pill"
                style={{ padding: '12px 28px', fontSize: '14px' }}
                onClick={() => {
                  setShowFilterSheet(false);
                  showToast(`✅ Applied filters (${filteredProducts.length} found)`);
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         PART 4: SORT OPTIONS (BOTTOM SHEET MODAL)
         ========================================================================== */}
      {showSortSheet && (
        <div className="modal-backdrop screen-transition-enter" onClick={() => setShowSortSheet(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ padding: '24px var(--screen-padding) 36px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '16px' }}>Sort Catalog By</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rated'].map((opt) => {
                const isSel = sortOption === opt;
                return (
                  <div
                    key={opt}
                    className="glass-card-standard"
                    style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderColor: isSel ? '#FF7873' : 'rgba(255,255,255,0.15)' }}
                    onClick={() => {
                      setSortOption(opt);
                      setShowSortSheet(false);
                      showToast(`↕ Sorted by: ${opt}`);
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: isSel ? '800' : '600', color: isSel ? '#FFFFFF' : '#A0A4C8' }}>{opt}</span>
                    {isSel && <span style={{ color: '#FF7873', fontSize: '16px', fontWeight: 'bold' }}>●</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.ShopScreen = ShopScreen;
