/* ============================================
   LENS MART — Product Detail Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. GALLERY THUMBNAILS
  const thumbnails = document.querySelectorAll('.pdp-thumb');
  const mainImg = document.getElementById('pdpMainImg');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Cross-fade image
      const newSrc = thumb.dataset.img;
      if (mainImg.src !== newSrc) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 200); // matches CSS transition
      }
    });
  });

  // 2. WISHLIST HEART
  const wishlistBtn = document.getElementById('pdpWishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      wishlistBtn.classList.toggle('saved');
    });
  }

  // 3. COLOR SWATCHES
  const colorSwatches = document.querySelectorAll('.pdp-color-swatch');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      
      // Simulate main image update for color change
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.style.opacity = '1';
      }, 200);
    });
  });

  // 4. SIZE PILLS
  const sizePills = document.querySelectorAll('.size-pill');
  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sizePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // 5. LIVE LENS PRICE CALCULATION
  const lensOptions = document.querySelectorAll('.lens-option');
  const totalPriceEl = document.getElementById('pdpTotalPrice');
  const basePrice = 65; // Vagabond base price
  let currentDisplayPrice = basePrice;

  lensOptions.forEach(option => {
    const radio = option.querySelector('input[type="radio"]');
    
    // Allow clicking the label/div to select
    option.addEventListener('click', () => {
      lensOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      radio.checked = true;

      // Calculate new price
      const extraCost = parseInt(radio.value, 10);
      const targetPrice = basePrice + extraCost;
      
      animatePrice(currentDisplayPrice, targetPrice, 300);
    });
  });

  // Price Count-up Animation
  function animatePrice(start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuad
      const easeProgress = progress * (2 - progress);
      
      currentDisplayPrice = Math.floor(start + (end - start) * easeProgress);
      totalPriceEl.textContent = `$${currentDisplayPrice}`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        currentDisplayPrice = end;
        totalPriceEl.textContent = `$${end}`;
      }
    }
    requestAnimationFrame(update);
  }

  // 6. ACCORDIONS
  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      // Optional: close others
      // accordions.forEach(acc => { if(acc !== item) acc.classList.remove('expanded'); });
      item.classList.toggle('expanded');
    });
  });

  // 7. ADD TO CART ANIMATION
  const btnAddToCart = document.getElementById('btnAddToCart');
  const flyingCartIcon = document.getElementById('flyingCartIcon');

  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', (e) => {
      // Change Button State
      const btnText = btnAddToCart.querySelector('.btn-text');
      const checkIcon = btnAddToCart.querySelector('.check-icon');
      
      const originalText = btnText.textContent;
      btnText.textContent = 'Added!';
      checkIcon.style.display = 'block';
      btnAddToCart.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
      btnAddToCart.style.borderColor = '#4CAF50';
      btnAddToCart.style.color = '#4CAF50';

      // Flying Cart Animation
      // Get button coordinates
      const rect = btnAddToCart.getBoundingClientRect();
      flyingCartIcon.style.left = `${rect.left + rect.width/2 - 20}px`;
      flyingCartIcon.style.top = `${rect.top}px`;
      
      // Trigger animation by removing/adding class
      flyingCartIcon.classList.remove('fly');
      void flyingCartIcon.offsetWidth; // reflow
      flyingCartIcon.classList.add('fly');

      // Revert Button State after 1.5s
      setTimeout(() => {
        btnText.textContent = originalText;
        checkIcon.style.display = 'none';
        btnAddToCart.style.backgroundColor = '';
        btnAddToCart.style.borderColor = '';
        btnAddToCart.style.color = '';
      }, 1500);
      
      // Remove fly class after animation completes
      setTimeout(() => {
        flyingCartIcon.classList.remove('fly');
      }, 800);
    });
  }

});
