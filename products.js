/* ============================================
   LENS MART — Product Listing Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. URL CATEGORY CHECK
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const isSpecialCategory = category === 'special';

  // 2. MOCK DATA
  const shapesData = [
    { id: 'rectangle', label: 'Rectangle', svg: '<rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" stroke-width="2"/><line x1="21" y1="8" x2="23" y2="8" stroke="currentColor" stroke-width="2"/>' },
    { id: 'round', label: 'Round', svg: '<circle cx="7" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="17" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 12h0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="2" y1="12" x2="2" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
    { id: 'cat-eye', label: 'Cat Eye', svg: '<path d="M3 14c0-3.5 2-6 5-7 2.5 1 4 4 4 7s-4 4-9 0z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 14c0-3.5 2-6 5-7 2.5 1 4 4 4 7s-4 4-9 0z" stroke="currentColor" stroke-width="1.5" fill="none"/>' },
    { id: 'wayfarer', label: 'Wayfarer', svg: '<path d="M4 8h5l1 6H5l-1-6z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M14 8h5l1 6h-5l-1-6z" stroke="currentColor" stroke-width="2" fill="none"/>' },
    { id: 'aviator', label: 'Aviator', svg: '<path d="M4 10c0-2 2-3 4-3s4 3 4 7-3 4-6 2-2-4-2-6z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 10c0-2 2-3 4-3s4 3 4 7-3 4-6 2-2-4-2-6z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 7h8" stroke="currentColor" stroke-width="1.5"/>' },
    { id: 'hexagonal', label: 'Hexagon', svg: '<polygon points="7,8 10,12 7,16 4,16 1,12 4,8" stroke="currentColor" stroke-width="1.5" fill="none"/><polygon points="17,8 20,12 17,16 14,16 11,12 14,8" stroke="currentColor" stroke-width="1.5" fill="none"/>' },
  ];

  const productsData = [
    { id: 1, name: 'Air Flex Zero', brand: 'Lens Mart Air', price: 49, oldPrice: 99, shape: 'rectangle', saved: false, colors: ['#333', '#1e88e5'], img: 'images/glasses-1.png', requirePresc: true },
    { id: 2, name: 'Retro Classic', brand: 'Vincent Chase', price: 65, oldPrice: 120, shape: 'round', saved: true, colors: ['#e0b162', '#333'], img: 'images/glasses-2.png', requirePresc: true },
    { id: 3, name: 'Glamour Cat', brand: 'Vogue', price: 85, oldPrice: null, shape: 'cat-eye', saved: false, colors: ['#c2185b', '#000'], img: 'images/glasses-3.png', requirePresc: false },
    { id: 4, name: 'Wayfarer Core', brand: 'Ray-Ban', price: 120, oldPrice: 150, shape: 'wayfarer', saved: false, colors: ['#000', '#555'], img: 'images/glasses-4.png', requirePresc: true },
    { id: 5, name: 'Sky Pilot', brand: 'John Jacobs', price: 75, oldPrice: 110, shape: 'aviator', saved: false, colors: ['#cfd8dc', '#ffe082'], img: 'images/glasses-5.png', requirePresc: false },
    { id: 6, name: 'Hexa Pro', brand: 'Lens Mart Air', price: 55, oldPrice: 85, shape: 'hexagonal', saved: false, colors: ['#212121', '#8e24aa'], img: 'images/glasses-6.png', requirePresc: true },
    { id: 7, name: 'Business Smart', brand: 'Vincent Chase', price: 45, oldPrice: null, shape: 'rectangle', saved: false, colors: ['#000'], img: 'images/glasses-1.png', requirePresc: false },
    { id: 8, name: 'Round Minimal', brand: 'John Jacobs', price: 90, oldPrice: 130, shape: 'round', saved: false, colors: ['#ffd700', '#c0c0c0'], img: 'images/glasses-2.png', requirePresc: true }
  ];

  let currentShapeFilter = null;
  const plpGrid = document.getElementById('plpGrid');
  const shapeRow = document.getElementById('shapeRow');
  const plpCount = document.getElementById('plpCount');

  // Handle Special Category Hero & Header Details
  if (isSpecialCategory) {
    const plpTitle = document.getElementById('plpTitle');
    if (plpTitle) plpTitle.textContent = "Special Power & Blue-Light";
    
    // Inject Special Power Category Explainer Header Card
    const plpMain = document.querySelector('.plp-main');
    if (plpMain) {
      const explainer = document.createElement('section');
      explainer.className = 'promo-section';
      explainer.style.padding = '0 16px';
      explainer.style.marginBottom = '20px';
      explainer.innerHTML = `
        <div class="promo-card" style="background: rgba(0, 229, 255, 0.05); border-color: rgba(0, 229, 255, 0.2); padding: 16px;">
          <div class="promo-card__bg-glow" style="background: rgba(0, 229, 255, 0.1);"></div>
          <h3 class="promo-title" style="font-size:15px; color:#fff;">Special Power & Blue-Light Glasses</h3>
          <p class="promo-desc" style="font-size:12px; color:var(--text-lavender); line-height:1.4; margin-top:4px;">
            Premium protection for heavy screen users. Select your preferred frames and configure power lenses or computer blue-filters.
          </p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px;">
            <div style="text-align:center; flex:1;"><span style="color:var(--primary-pink); font-size:12px; font-weight:700;">1. Test Eye</span></div>
            <div style="text-align:center; flex:1; border-left:1px solid rgba(255,255,255,0.05);"><span style="color:var(--primary-pink); font-size:12px; font-weight:700;">2. Choose Frame</span></div>
            <div style="text-align:center; flex:1; border-left:1px solid rgba(255,255,255,0.05);"><span style="color:var(--primary-pink); font-size:12px; font-weight:700;">3. Fit Lenses</span></div>
          </div>
        </div>
      `;
      plpMain.insertBefore(explainer, plpMain.querySelector('.plp-grid-section'));
    }
  }

  // 3. RENDER SHAPES
  function renderShapes() {
    shapeRow.innerHTML = shapesData.map(shape => `
      <button class="shape-btn" data-shape="${shape.id}">
        <div class="shape-btn__circle">
          <svg width="24" height="24" viewBox="0 0 24 24">${shape.svg}</svg>
        </div>
        <span class="shape-btn__label">${shape.label}</span>
      </button>
    `).join('');

    // Attach shape click handlers
    document.querySelectorAll('.shape-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const shapeId = btn.dataset.shape;
        
        if (currentShapeFilter === shapeId) {
          currentShapeFilter = null; // toggle off
          btn.classList.remove('active');
        } else {
          document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
          currentShapeFilter = shapeId;
          btn.classList.add('active');
          // Scroll center
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        
        filterAndRenderProducts();
      });
    });
  }

  // 4. RENDER PRODUCTS
  function renderProducts(products) {
    if(!plpGrid) return;
    
    // Fade out current items for smooth reflow
    const currentCards = plpGrid.querySelectorAll('.plp-card');
    currentCards.forEach(card => card.classList.add('fade-out'));

    setTimeout(() => {
      plpGrid.innerHTML = products.map((p, index) => {
        const delay = index * 50; // stagger entrance
        const oldPriceHtml = p.oldPrice ? `<span class="plp-card__old-price">$${p.oldPrice}</span>` : '';
        const swatchesHtml = p.colors.map((c, i) => `<div class="color-swatch ${i===0?'active':''}" style="background-color: ${c};"></div>`).join('');
        
        // Amber Prescription Badge
        const prescBadge = (isSpecialCategory || p.requirePresc) ? `<span style="position:absolute; top:8px; left:8px; background:rgba(255, 179, 0, 0.15); color:#FFB300; font-size:8px; font-weight:800; padding:3px 8px; border-radius:999px; letter-spacing:0.5px;">Prescription Required</span>` : '';

        return `
          <div class="plp-card" style="animation-delay: ${delay}ms;" onclick="handleProductTap(${p.id}, ${p.requirePresc})">
            <div class="plp-card__img-wrap">
              <img src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=400&h=400" alt="${p.name}" class="plp-card__img">
              ${prescBadge}
              <button class="plp-card__heart ${p.saved ? 'saved' : ''}" aria-label="Save" onclick="event.stopPropagation()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="${p.saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
            <div class="plp-card__info">
              <div class="plp-card__brand">${p.brand}</div>
              <div class="plp-card__name">${p.name}</div>
              <div class="plp-card__price-row">
                <span class="plp-card__price">$${p.price}</span>
                ${oldPriceHtml}
              </div>
              <div class="plp-card__swatches">${swatchesHtml}</div>
            </div>
          </div>
        `;
      }).join('');

      if(plpCount) {
        plpCount.textContent = `${products.length} frames found`;
      }

      attachCardInteractions();
    }, 200); // Wait for fade out
  }

  // Product Tap Redirect & Context alert
  window.handleProductTap = function(productId, requirePresc) {
    if (isSpecialCategory || requirePresc) {
      // Mock checking prescription
      const hasPresc = localStorage.getItem('has_prescription') === 'true';
      if (!hasPresc) {
        alert("Add your prescription to continue");
        window.location.href = 'prescriptions.html?context=special';
        return;
      }
    }
    // Proceed to details
    window.location.href = `product.html?id=${productId}`;
  };

  function attachCardInteractions() {
    // Heart toggle
    document.querySelectorAll('.plp-card__heart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const svg = btn.querySelector('svg');
        btn.classList.toggle('saved');
        
        if (btn.classList.contains('saved')) {
          svg.setAttribute('fill', 'currentColor');
          btn.classList.remove('bounce');
          void btn.offsetWidth; // trigger reflow
          btn.classList.add('bounce');
        } else {
          svg.setAttribute('fill', 'none');
          btn.classList.remove('bounce');
        }
      });
    });

    // Swatches
    document.querySelectorAll('.plp-card').forEach(card => {
      const swatches = card.querySelectorAll('.color-swatch');
      const img = card.querySelector('.plp-card__img');
      swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
          e.preventDefault();
          swatches.forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          // Simulate image switch
          img.style.opacity = '0';
          setTimeout(() => {
            img.style.opacity = '1';
          }, 150);
        });
      });
    });
  }

  function filterAndRenderProducts() {
    let filtered = productsData;
    if (currentShapeFilter) {
      filtered = productsData.filter(p => p.shape === currentShapeFilter);
    }
    renderProducts(filtered);
  }

  // 5. FILTER PANEL SHEET LOGIC
  const filterSheet = document.getElementById('filterSheet');
  const filterOverlay = document.getElementById('filterOverlay');
  const btnFilter = document.getElementById('btnFilter');
  const btnCloseFilter = document.getElementById('btnCloseFilter');

  function openFilter() {
    if(!filterSheet) return;
    filterOverlay.classList.add('active');
    filterSheet.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeFilter() {
    if(!filterSheet) return;
    filterOverlay.classList.remove('active');
    filterSheet.classList.remove('active');
    document.body.style.overflow = '';
  }

  if(btnFilter) btnFilter.addEventListener('click', openFilter);
  if(btnCloseFilter) btnCloseFilter.addEventListener('click', closeFilter);
  if(filterOverlay) filterOverlay.addEventListener('click', closeFilter);

  // Accordions
  document.querySelectorAll('.filter-accordion__header').forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      parent.classList.toggle('expanded');
    });
  });

  // Gender chips
  document.querySelectorAll('.gender-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  // 6. INFINITE SCROLL
  const trigger = document.getElementById('infiniteScrollTrigger');
  const skeletons = document.getElementById('plpSkeletons');
  let page = 1;
  let isLoading = false;

  if (trigger && skeletons) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && page < 3) {
        isLoading = true;
        skeletons.style.display = 'grid';
        
        setTimeout(() => {
          skeletons.style.display = 'none';
          const moreProducts = productsData.slice(0, 4);
          const currentHtml = plpGrid.innerHTML;
          
          const newHtml = moreProducts.map((p, index) => {
            const delay = index * 50; 
            const oldPriceHtml = p.oldPrice ? `<span class="plp-card__old-price">$${p.oldPrice}</span>` : '';
            const swatchesHtml = p.colors.map((c, i) => `<div class="color-swatch ${i===0?'active':''}" style="background-color: ${c};"></div>`).join('');
            
            // Amber Prescription Badge
            const prescBadge = (isSpecialCategory || p.requirePresc) ? `<span style="position:absolute; top:8px; left:8px; background:rgba(255, 179, 0, 0.15); color:#FFB300; font-size:8px; font-weight:800; padding:3px 8px; border-radius:999px; letter-spacing:0.5px;">Prescription Required</span>` : '';

            return `
              <div class="plp-card" style="animation-delay: ${delay}ms;" onclick="handleProductTap(${p.id}, ${p.requirePresc})">
                <div class="plp-card__img-wrap">
                  <img src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=400&h=400" alt="${p.name}" class="plp-card__img">
                  ${prescBadge}
                  <button class="plp-card__heart ${p.saved ? 'saved' : ''}" aria-label="Save" onclick="event.stopPropagation()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="${p.saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
                <div class="plp-card__info">
                  <div class="plp-card__brand">${p.brand}</div>
                  <div class="plp-card__name">${p.name}</div>
                  <div class="plp-card__price-row">
                    <span class="plp-card__price">$${p.price}</span>
                    ${oldPriceHtml}
                  </div>
                  <div class="plp-card__swatches">${swatchesHtml}</div>
                </div>
              </div>
            `;
          }).join('');
          
          plpGrid.innerHTML = currentHtml + newHtml;
          attachCardInteractions();
          
          page++;
          isLoading = false;
        }, 1500);
      }
    }, { rootMargin: '100px' });
    
    setTimeout(() => {
        observer.observe(trigger);
    }, 1000);
  }

  // Initialize
  if(shapeRow) {
    renderShapes();
    filterAndRenderProducts();
  }

});
