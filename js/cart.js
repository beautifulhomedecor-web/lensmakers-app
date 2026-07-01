/* ==========================================================================
   LENSMAKERS - Cart Interaction & Pricing Logic
   ========================================================================== */

let activeCoupon = null;
const GST_RATE = 0.18; // 18% Goods Tax

// 1. Update quantities in cart items
function updateQuantity(itemId, change) {
  const card = document.getElementById(itemId);
  if (!card) return;

  const qtyValEl = card.querySelector('.qty-val');
  let qty = parseInt(qtyValEl.textContent) + change;

  if (qty < 1) {
    removeItem(itemId);
    return;
  }

  // Update DOM quantity label
  qtyValEl.textContent = qty;

  // Update item total price display
  const priceEl = card.querySelector('.item-price');
  const basePrice = parseInt(priceEl.dataset.basePrice);
  priceEl.textContent = `₹${(basePrice * qty).toLocaleString('en-IN')}`;

  // Add micro-interaction pop effect classes
  qtyValEl.classList.add('pop-effect');
  priceEl.classList.add('pop-effect');
  const totalValEl = document.getElementById('totalVal');
  if (totalValEl) totalValEl.classList.add('pop-effect');

  setTimeout(() => {
    qtyValEl.classList.remove('pop-effect');
    priceEl.classList.remove('pop-effect');
    if (totalValEl) totalValEl.classList.remove('pop-effect');
  }, 200);

  // Recalculate bill
  recalculateBillDetails();
}

// 2. Remove items from cart (Refined slide-out & collapse)
function removeItem(itemId) {
  const card = document.getElementById(itemId);
  if (!card) return;

  // Slide out + fade out
  card.style.opacity = '0';
  card.style.transform = 'translateX(80px) scale(0.9)';
  card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

  setTimeout(() => {
    // Smoothly collapse height to 0 so other elements slide up
    card.style.height = card.offsetHeight + 'px'; // Lock current height
    card.style.padding = '0';
    card.style.margin = '0';
    card.style.borderWidth = '0';
    
    // Trigger layout recalculation
    card.offsetHeight; 
    
    card.style.height = '0';
    card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

    setTimeout(() => {
      card.remove();
      recalculateBillDetails();
      checkEmptyState();
    }, 400);
  }, 150);
}

// 3. Recalculate billing values
function recalculateBillDetails() {
  const items = document.querySelectorAll('.cart-item-card');
  let subtotal = 0;

  items.forEach(card => {
    const qty = parseInt(card.querySelector('.qty-val').textContent);
    const basePrice = parseInt(card.querySelector('.item-price').dataset.basePrice);
    subtotal += basePrice * qty;
  });

  // Calculate discount
  let discount = 0;
  if (activeCoupon === 'CLEAR20') {
    discount = Math.round(subtotal * 0.20);
    const discountRow = document.getElementById('couponRow');
    const discountVal = document.getElementById('couponDiscountVal');
    if (discountRow && discountVal) {
      discountRow.classList.remove('hidden');
      discountVal.textContent = `-₹${discount.toLocaleString('en-IN')}`;
    }
  } else {
    const discountRow = document.getElementById('couponRow');
    if (discountRow) discountRow.classList.add('hidden');
  }

  // Calculate Tax (GST) based on subtotal after discount
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * GST_RATE);
  const grandTotal = taxableAmount + tax;

  // Update DOM labels
  const subtotalEl = document.getElementById('subtotalVal');
  const taxEl = document.getElementById('taxVal');
  const totalEl = document.getElementById('totalVal');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (taxEl) taxEl.textContent = `₹${tax.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
}

// 4. Verify and Apply Promo Code
function applyCoupon() {
  const codeInput = document.getElementById('couponCode');
  const statusEl = document.getElementById('couponStatus');
  const code = codeInput.value.trim().toUpperCase();

  if (code === '') {
    statusEl.textContent = '';
    statusEl.className = 'coupon-status-text';
    activeCoupon = null;
    recalculateBillDetails();
    return;
  }

  if (code === 'CLEAR20') {
    activeCoupon = 'CLEAR20';
    statusEl.textContent = 'Coupon applied successfully! 20% discount applied.';
    statusEl.className = 'coupon-status-text success';
    recalculateBillDetails();
  } else {
    activeCoupon = null;
    statusEl.textContent = 'Invalid Coupon Code. Try "CLEAR20".';
    statusEl.className = 'coupon-status-text error';
    recalculateBillDetails();
  }
}

// 5. Check if cart is empty and show empty state
function checkEmptyState() {
  const items = document.querySelectorAll('.cart-item-card');
  const emptyState = document.getElementById('emptyCartState');
  const itemsSection = document.getElementById('cartItemsList');
  const couponSection = document.getElementById('couponSection');
  const summarySection = document.getElementById('pricingSummary');
  const footerSection = document.getElementById('checkoutFooter');

  if (items.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (itemsSection) itemsSection.classList.add('hidden');
    if (couponSection) couponSection.classList.add('hidden');
    if (summarySection) summarySection.classList.add('hidden');
    if (footerSection) footerSection.classList.add('hidden');
  }
}

// 6. Proceed to checkout link
function proceedToCheckout() {
  const checkoutBtn = document.querySelector('.checkout-footer .submit-btn');
  if (!checkoutBtn) return;

  checkoutBtn.classList.add('loading');

  // Simulate server communication
  setTimeout(() => {
    checkoutBtn.classList.remove('loading');
    // Redirect to payments screen with checkout mode enabled
    window.location.href = 'payment.html?checkout=true';
  }, 1200);
}

// Initialize calculations
window.addEventListener('DOMContentLoaded', () => {
  recalculateBillDetails();
});
