/* ==========================================================================
   LENSMAKERS - Complete Cart & Checkout Flow JS
   ========================================================================== */

let activeCoupon = null;
const GST_RATE = 0.18; // 18% GST

// State tracking
const steps = {
  'cart': { index: 0, showProgress: false },
  'address': { index: 1, showProgress: true, stepNum: 1 },
  'lens': { index: 2, showProgress: true, stepNum: 2 },
  'payment': { index: 3, showProgress: true, stepNum: 3 },
  'review': { index: 4, showProgress: true, stepNum: 4 },
  'success': { index: 5, showProgress: false }
};

let currentStep = 'cart';

// Initialize events
document.addEventListener('DOMContentLoaded', () => {
  recalculateTotals();
  setupSwipeToDelete();
  updateSavedCount();
  setupFormTabListener();
  
  // Close any delete confirms if clicked elsewhere
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.trash-btn')) {
      document.querySelectorAll('.trash-btn.confirm').forEach(btn => {
        btn.classList.remove('confirm');
      });
    }
  });
});

// Horizontal Slide Navigation
window.goToStep = function(stepName) {
  const stepInfo = steps[stepName];
  if (!stepInfo) return;

  currentStep = stepName;
  const track = document.getElementById('sliderTrack');
  const translateAmount = -(stepInfo.index * 16.6666);
  track.style.transform = `translateX(${translateAmount}%)`;

  // Progress Bar Visibility & State
  const progressBar = document.getElementById('checkoutProgressBar');
  const cartNav = document.getElementById('cartBottomNav');
  if (stepInfo.showProgress) {
    progressBar.classList.remove('hidden');
    updateProgressBar(stepInfo.stepNum);
    if (cartNav) cartNav.style.display = 'none';
  } else {
    progressBar.classList.add('hidden');
    if (cartNav) {
      if (stepName === 'cart') cartNav.style.display = 'block';
      else cartNav.style.display = 'none';
    }
  }

  // Handle Review Step Preparation
  if (stepName === 'review') {
    populateReviewDetails();
  }

  // Handle Success Panel Animation trigger
  if (stepName === 'success') {
    const successPanel = document.getElementById('panelSuccess');
    successPanel.classList.add('active-state');
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Update progress indicator segments
function updateProgressBar(activeStepNum) {
  const nodes = document.querySelectorAll('.step-node');
  const fill = document.getElementById('progressTrackFill');

  // Width fill calculation (4 steps -> 0%, 33.3%, 66.6%, 100%)
  const percentage = ((activeStepNum - 1) / 3) * 100;
  fill.style.width = `${percentage}%`;

  nodes.forEach(node => {
    const stepNum = parseInt(node.dataset.step);
    node.classList.remove('active', 'completed');
    
    if (stepNum === activeStepNum) {
      node.classList.add('active');
    } else if (stepNum < activeStepNum) {
      node.classList.add('completed');
    }
  });
}

// Stepper Quantity Increments
window.changeQty = function(itemId, change) {
  const card = document.getElementById(itemId);
  if (!card) return;

  const qtyValEl = card.querySelector('.qty-val');
  let qty = parseInt(qtyValEl.textContent) + change;

  if (qty < 1) {
    confirmDelete(itemId);
    return;
  }

  // Scale-pop micro-animation
  qtyValEl.classList.add('pop-effect');
  setTimeout(() => qtyValEl.classList.remove('pop-effect'), 200);

  qtyValEl.textContent = qty;
  
  // Recalculate line total
  const basePrice = parseInt(card.dataset.price);
  const lineTotalEl = card.querySelector('.line-total');
  
  // Total update tween simulation
  const targetTotal = basePrice * qty;
  lineTotalEl.classList.add('pop-effect');
  setTimeout(() => lineTotalEl.classList.remove('pop-effect'), 200);
  lineTotalEl.textContent = `₹${targetTotal.toLocaleString('en-IN')}`;

  recalculateTotals();
};

// Accidental removal prevention (Confirm tap pattern)
window.confirmDelete = function(itemId) {
  const card = document.getElementById(itemId);
  if (!card) return;

  const trashBtn = card.querySelector('.trash-btn');
  if (trashBtn.classList.contains('confirm')) {
    removeItem(itemId);
  } else {
    // Cancel other open confirms first
    document.querySelectorAll('.trash-btn.confirm').forEach(btn => btn.classList.remove('confirm'));
    trashBtn.classList.add('confirm');
  }
};

window.removeItem = function(itemId) {
  const card = document.getElementById(itemId);
  if (!card) return;

  // Slide-out and collapse animation
  card.style.opacity = '0';
  card.style.transform = 'translateX(100px) scale(0.9)';
  
  setTimeout(() => {
    card.style.height = `${card.offsetHeight}px`;
    card.style.padding = '0';
    card.style.margin = '0';
    card.style.borderWidth = '0';
    card.offsetHeight; // trigger reflow
    card.style.height = '0';
    
    setTimeout(() => {
      card.remove();
      recalculateTotals();
      checkCartEmptyState();
    }, 300);
  }, 150);
};

// Save for Later
window.saveForLater = function(itemId) {
  const card = document.getElementById(itemId);
  if (!card) return;

  const list = document.getElementById('savedItemsList');
  const name = card.querySelector('.item-name').textContent;
  const brand = card.querySelector('.item-brand').textContent;
  const meta = card.querySelector('.item-meta').textContent;
  const price = card.dataset.price;
  const thumbSrc = card.querySelector('.item-thumb').src;

  // Append to saved list
  const savedCard = document.createElement('div');
  savedCard.className = 'cart-item-card';
  savedCard.id = `saved-${itemId}`;
  savedCard.innerHTML = `
    <div class="card-content-wrapper" style="padding: 12px;">
      <div class="item-left">
        <div class="item-thumb-wrapper" style="width: 50px; height: 35px;">
          <img src="${thumbSrc}" alt="${name}" class="item-thumb">
        </div>
      </div>
      <div class="item-center" style="margin-left: 12px;">
        <h3 class="item-name" style="font-size: 13px;">${name}</h3>
        <p class="item-meta" style="font-size: 10px; margin: 2px 0;">${meta}</p>
        <span class="line-total" style="font-size: 13px;">₹${parseInt(price).toLocaleString('en-IN')}</span>
      </div>
      <div class="item-right" style="gap: 4px;">
        <button class="save-later-link" onclick="moveToCart('${itemId}', '${name}', '${brand}', '${meta}', '${price}', '${thumbSrc}')">Move to Cart</button>
      </div>
    </div>
  `;
  list.appendChild(savedCard);

  // Remove from active cart
  card.remove();
  recalculateTotals();
  checkCartEmptyState();
  updateSavedCount();
};

window.moveToCart = function(itemId, name, brand, meta, price, thumbSrc) {
  const savedCard = document.getElementById(`saved-${itemId}`);
  if (savedCard) savedCard.remove();

  const cartList = document.getElementById('activeCartList');
  const card = document.createElement('div');
  card.className = 'cart-item-card';
  card.id = itemId;
  card.dataset.price = price;
  card.innerHTML = `
    <div class="swipe-background-delete">Remove</div>
    <div class="card-content-wrapper">
      <div class="item-left">
        <div class="item-thumb-wrapper">
          <img src="${thumbSrc}" alt="${name}" class="item-thumb">
        </div>
      </div>
      <div class="item-center">
        <h3 class="item-name">${name}</h3>
        <span class="item-brand">${brand}</span>
        <p class="item-meta">${meta}</p>
        <div class="item-price-info">
          <span class="unit-price">₹${parseInt(price).toLocaleString('en-IN')}</span>
          <span class="line-total" id="total-${itemId}">₹${parseInt(price).toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div class="item-right">
        <div class="quantity-selector">
          <button class="qty-btn minus" onclick="changeQty('${itemId}', -1)">−</button>
          <span class="qty-val">1</span>
          <button class="qty-btn plus" onclick="changeQty('${itemId}', 1)">+</button>
        </div>
        <div class="item-actions">
          <button class="save-later-link" onclick="saveForLater('${itemId}')">Save for Later</button>
          <button class="trash-btn" onclick="confirmDelete('${itemId}')" aria-label="Remove Item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            <span class="trash-text">Remove?</span>
          </button>
        </div>
      </div>
    </div>
  `;
  cartList.appendChild(card);
  
  recalculateTotals();
  checkCartEmptyState();
  updateSavedCount();
  setupSwipeToDelete();
};

function updateSavedCount() {
  const count = document.getElementById('savedItemsList').children.length;
  document.getElementById('savedCount').textContent = count;
}

window.toggleSavedAccordion = function() {
  const section = document.getElementById('savedItemsSection');
  section.classList.toggle('expanded');
};

// Recalculate bill prices
function recalculateTotals() {
  const cards = document.querySelectorAll('#activeCartList .cart-item-card');
  let subtotal = 0;

  cards.forEach(card => {
    const qty = parseInt(card.querySelector('.qty-val').textContent);
    const price = parseInt(card.dataset.price);
    subtotal += price * qty;
  });

  // Coupon discount
  let discount = 0;
  if (activeCoupon === 'CLEAR20') {
    discount = Math.round(subtotal * 0.20);
    document.getElementById('couponRow').classList.remove('hidden');
    document.getElementById('couponDiscountVal').textContent = `-₹${discount.toLocaleString('en-IN')}`;
  } else {
    document.getElementById('couponRow').classList.add('hidden');
  }

  // Trade-In Credit
  let tradeInCredit = 0;
  const storedCredit = localStorage.getItem('tradein_credit');
  if (storedCredit) {
    tradeInCredit = parseInt(storedCredit, 10);
    const tradeInRow = document.getElementById('tradeInRow');
    if (tradeInRow) {
      tradeInRow.classList.remove('hidden');
      document.getElementById('tradeInVal').textContent = `-₹${tradeInCredit.toLocaleString('en-IN')}`;
    }
  } else {
    const tradeInRow = document.getElementById('tradeInRow');
    if (tradeInRow) tradeInRow.classList.add('hidden');
  }

  // Tax and Grand Total
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * GST_RATE);
  const total = Math.max(0, taxableAmount + tax - tradeInCredit);

  // DOM Updates
  document.getElementById('subtotalVal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('taxVal').textContent = `₹${tax.toLocaleString('en-IN')}`;
  document.getElementById('totalVal').textContent = `₹${total.toLocaleString('en-IN')}`;
  document.getElementById('miniSummaryTotal').textContent = `₹${total.toLocaleString('en-IN')}`;
  document.getElementById('finalPayBtnLabel').textContent = `Place Order — ₹${total.toLocaleString('en-IN')}`;

  // Header count update
  document.getElementById('cartHeaderTitle').textContent = `My Cart (${cards.length} items)`;
}

// Swipe to delete on mobile
function setupSwipeToDelete() {
  const cards = document.querySelectorAll('.cart-item-card');
  cards.forEach(card => {
    const content = card.querySelector('.card-content-wrapper');
    let startX = 0;
    let currentX = 0;

    content.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    content.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      if (diff < 0 && diff > -120) {
        content.style.transform = `translateX(${diff}px)`;
      }
    });

    content.addEventListener('touchend', (e) => {
      const diff = currentX - startX;
      content.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
      if (diff < -60) {
        content.style.transform = 'translateX(-80px)';
        // Tapping the exposed remove area triggers deletion
        const swipeDel = card.querySelector('.swipe-background-delete');
        swipeDel.onclick = () => removeItem(card.id);
      } else {
        content.style.transform = 'translateX(0px)';
      }
      setTimeout(() => content.style.transition = '', 200);
    });
  });
}

function checkCartEmptyState() {
  const cards = document.querySelectorAll('#activeCartList .cart-item-card');
  const emptyState = document.getElementById('emptyCartState');
  const activeList = document.getElementById('activeCartList');
  const coupon = document.getElementById('couponSection');
  const summary = document.getElementById('pricingSummary');
  const footer = document.getElementById('checkoutFooter');

  if (cards.length === 0) {
    emptyState.classList.remove('hidden');
    activeList.classList.add('hidden');
    coupon.classList.add('hidden');
    summary.classList.add('hidden');
    footer.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    activeList.classList.remove('hidden');
    coupon.classList.remove('hidden');
    summary.classList.remove('hidden');
    footer.classList.remove('hidden');
  }
}

// Promo code logic
window.applyCouponCode = function() {
  const input = document.getElementById('couponCode');
  const status = document.getElementById('couponStatus');
  const section = document.getElementById('couponSection');
  const code = input.value.trim().toUpperCase();

  if (code === 'CLEAR20') {
    activeCoupon = 'CLEAR20';
    status.textContent = 'Coupon applied successfully! 20% discount applied.';
    status.className = 'coupon-status-text success';
    recalculateTotals();
    
    // Confetti animation burst
    createConfettiBurst(input);
  } else {
    activeCoupon = null;
    status.textContent = 'Invalid code. Try "CLEAR20"';
    status.className = 'coupon-status-text error';
    recalculateTotals();

    // Shake animation
    section.classList.remove('shake');
    void section.offsetWidth; // trigger reflow
    section.classList.add('shake');
  }
};

function createConfettiBurst(target) {
  const rect = target.getBoundingClientRect();
  const colors = ['#FF4D8D', '#C2185B', '#1E88E5', '#66BB6A'];
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = `${Math.random() * 8 + 4}px`;
    particle.style.height = `${Math.random() * 8 + 4}px`;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    particle.style.zIndex = '9999';
    particle.style.pointerEvents = 'none';
    
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 120 + 30;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity - 50;

    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY}px) scale(0.2)`, opacity: 0 }
    ], {
      duration: Math.random() * 600 + 400,
      easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
    }).onfinish = () => particle.remove();
  }
}

// Address Management
window.toggleNewAddressForm = function() {
  const wrapper = document.getElementById('newAddressFormWrapper');
  wrapper.classList.toggle('expanded');
};

window.saveNewAddress = function(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[placeholder="Full Name"]').value;
  const phone = form.querySelector('input[placeholder="Phone Number"]').value;
  const pincode = form.querySelector('input[placeholder="Pincode"]').value;
  const city = form.querySelector('input[placeholder="City"]').value;
  const address1 = form.querySelector('input[placeholder="Address Line 1"]').value;
  const address2 = form.querySelector('input[placeholder="Address Line 2"]').value;
  const state = form.querySelector('input[placeholder="State"]').value;

  const container = document.querySelector('.address-options');
  const dashedBtn = document.querySelector('.add-address-dashed-btn');

  // Insert address card
  const card = document.createElement('label');
  card.className = 'address-card';
  card.innerHTML = `
    <input type="radio" name="delivery_address" value="custom" checked>
    <div class="address-details">
      <div class="address-tag-row">
        <span class="address-tag">Other</span>
      </div>
      <p class="address-text">${name}, ${phone}<br>${address1}, ${address2}, ${city}, ${state} - ${pincode}</p>
    </div>
  `;

  container.insertBefore(card, dashedBtn);
  form.reset();
  document.getElementById('newAddressFormWrapper').classList.remove('expanded');
};

// Prescription Upload
window.triggerFileUpload = function(id) {
  document.getElementById(id).click();
};

window.handleFileSelected = function(input, textId) {
  const display = document.getElementById(textId);
  if (input.files.length > 0) {
    display.textContent = `Selected: ${input.files[0].name}`;
  } else {
    display.textContent = '';
  }
};

// Payment Expandable Sumary
window.toggleMiniSummary = function() {
  const details = document.getElementById('miniSummaryDetails');
  details.classList.toggle('hidden');
  
  if (!details.classList.contains('hidden')) {
    // Populate details dynamically
    const cards = document.querySelectorAll('#activeCartList .cart-item-card');
    let itemsHtml = '';
    cards.forEach(card => {
      const name = card.querySelector('.item-name').textContent;
      const price = card.querySelector('.line-total').textContent;
      const qty = card.querySelector('.qty-val').textContent;
      itemsHtml += `<div class="price-row" style="font-size:12px;"><span>${name} (x${qty})</span><span>${price}</span></div>`;
    });
    details.innerHTML = itemsHtml;
  }
};

// Reused Payment Tabs Switcher
let activePaymentTab = 'card';
function setupFormTabListener() {
  // Form slider support
  window.switchFormTab = function(tabName) {
    activePaymentTab = tabName;
    const track = document.getElementById('formsTrack');
    const indicator = document.getElementById('activeIndicator');
    
    const cardBtn = document.getElementById('tabCardBtn');
    const upiBtn = document.getElementById('tabUpiBtn');
    const netBtn = document.getElementById('tabNetBtn');
    const walletBtn = document.getElementById('tabWalletBtn');
    const tabs = [cardBtn, upiBtn, netBtn, walletBtn];
    
    tabs.forEach(t => t.classList.remove('active'));
    
    const label = document.getElementById('savePaymentBtn');

    if (tabName === 'card') {
      track.style.transform = 'translateX(0%)';
      indicator.style.transform = 'translateX(0%)';
      cardBtn.classList.add('active');
      label.textContent = 'Save Payment Method';
    } else if (tabName === 'upi') {
      track.style.transform = 'translateX(-25%)';
      indicator.style.transform = 'translateX(100%)';
      upiBtn.classList.add('active');
      label.textContent = 'Save UPI ID';
    } else if (tabName === 'net') {
      track.style.transform = 'translateX(-50%)';
      indicator.style.transform = 'translateX(200%)';
      netBtn.classList.add('active');
      label.textContent = 'Proceed to Bank';
    } else if (tabName === 'wallet') {
      track.style.transform = 'translateX(-75%)';
      indicator.style.transform = 'translateX(300%)';
      walletBtn.classList.add('active');
      label.textContent = 'Link Wallet';
    }
  };
}

window.toggleAddPaymentForm = function() {
  const wrapper = document.getElementById('addPaymentFormWrapper');
  wrapper.classList.toggle('expanded');
};

window.saveNewPayment = function() {
  const wrapper = document.getElementById('addPaymentFormWrapper');
  const container = document.querySelector('.methods-list');
  const dashed = document.querySelector('.add-method-dashed-btn');

  let title = 'Saved Method';
  let subtitle = 'Linked account';
  let type = 'visa';

  if (activePaymentTab === 'card') {
    const cardNum = document.getElementById('cardNumber').value.trim();
    const lastFour = cardNum.substring(cardNum.length - 4) || '1111';
    title = `•••• •••• •••• ${lastFour}`;
    subtitle = 'Visa card';
  } else if (activePaymentTab === 'upi') {
    const upi = document.getElementById('upiId').value.trim();
    title = upi || 'user@upi';
    subtitle = 'UPI address';
    type = 'upi';
  }

  const card = document.createElement('label');
  card.className = 'method-card';
  card.innerHTML = `
    <input type="radio" name="payment_method" value="custom" checked>
    <div class="method-left">
      <div class="card-icon ${type}"><span>${type.toUpperCase()}</span></div>
    </div>
    <div class="method-center">
      <div class="method-title">${title}</div>
      <div class="method-subtitle">${subtitle}</div>
    </div>
  `;

  container.insertBefore(card, dashed);
  wrapper.classList.remove('expanded');
};

// Form formats
window.formatCardNum = function(input) {
  let val = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  let formatted = '';
  for (let i = 0; i < val.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += val[i];
  }
  input.value = formatted.substring(0, 19);
};

window.formatExp = function(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length > 2) {
    input.value = val.substring(0, 2) + '/' + val.substring(2, 4);
  } else {
    input.value = val;
  }
};

window.verifyUPI = function() {
  alert('UPI ID verified successfully!');
};

window.selectBank = function(bank) {
  alert(`Selected ${bank} bank`);
};

window.selectWallet = function(wallet) {
  alert(`Linked ${wallet} Wallet`);
};

// Review details preparation
function populateReviewDetails() {
  // Address
  const activeAddressInput = document.querySelector('input[name="delivery_address"]:checked');
  const details = activeAddressInput.closest('.address-card').querySelector('.address-text').innerHTML;
  document.getElementById('reviewAddress').innerHTML = details;

  // Items
  const items = document.querySelectorAll('#activeCartList .cart-item-card');
  let listHtml = '';
  items.forEach(card => {
    const name = card.querySelector('.item-name').textContent;
    const price = card.querySelector('.line-total').textContent;
    const qty = card.querySelector('.qty-val').textContent;
    listHtml += `
      <div class="review-item-row">
        <span>${name} (x${qty})</span>
        <span>${price}</span>
      </div>
    `;
  });
  document.getElementById('reviewItemsList').innerHTML = listHtml;

  // Payment
  const activePayment = document.querySelector('input[name="payment_method"]:checked');
  const pMethod = activePayment.closest('.method-card').querySelector('.method-title').textContent;
  document.getElementById('reviewPayment').textContent = pMethod;
}

// Final Order Submit
window.placeOrder = function() {
  const btn = document.querySelector('.final-place-btn');
  const text = btn.querySelector('.btn-text');
  
  if (!document.getElementById('termsCheckbox').checked) {
    alert('Please agree to terms and conditions first.');
    return;
  }

  btn.style.opacity = '0.8';
  btn.style.pointerEvents = 'none';
  text.textContent = 'Processing Payment...';

  setTimeout(() => {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    goToStep('success');
  }, 1500);
};

window.trackOrder = function() {
  alert('Tracking information sent to your registered email.');
};
