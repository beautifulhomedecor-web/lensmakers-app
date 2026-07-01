/* ==========================================================================
   LENSMAKERS - Payment Methods Screen Logic
   ========================================================================== */

let activeFormTab = 'card';
let selectedOptionTarget = null;
let isCheckoutFlow = false;

// 1. Toggle Add Payment Form
function toggleAddPaymentForm() {
  const wrapper = document.getElementById('addPaymentFormWrapper');
  if (wrapper) {
    wrapper.classList.toggle('expanded');
    // Scroll down to the form after transition starts
    if (wrapper.classList.contains('expanded')) {
      setTimeout(() => {
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    }
  }
}

// 2. Tab switching inside Add Payment
function switchFormTab(tabName) {
  activeFormTab = tabName;
  const formsTrack = document.getElementById('formsTrack');
  const activeIndicator = document.getElementById('activeIndicator');
  
  // Toggles
  const tabCardBtn = document.getElementById('tabCardBtn');
  const tabUpiBtn = document.getElementById('tabUpiBtn');
  const tabNetBtn = document.getElementById('tabNetBtn');
  const tabWalletBtn = document.getElementById('tabWalletBtn');
  const tabs = [tabCardBtn, tabUpiBtn, tabNetBtn, tabWalletBtn];
  
  tabs.forEach(t => { if (t) t.classList.remove('active'); });

  // Update track slider and active state classes
  const forms = document.querySelectorAll('.payment-form');
  forms.forEach(f => f.classList.remove('active'));

  if (tabName === 'card') {
    if (formsTrack) formsTrack.style.transform = 'translateX(0%)';
    if (activeIndicator) activeIndicator.style.transform = 'translateX(0%)';
    if (tabCardBtn) tabCardBtn.classList.add('active');
    forms[0].classList.add('active');
    updateCTAButtonLabel('Save Payment Method');
  } else if (tabName === 'upi') {
    if (formsTrack) formsTrack.style.transform = 'translateX(-25%)';
    if (activeIndicator) activeIndicator.style.transform = 'translateX(100%)';
    if (tabUpiBtn) tabUpiBtn.classList.add('active');
    forms[1].classList.add('active');
    updateCTAButtonLabel('Save UPI Details');
  } else if (tabName === 'netbanking') {
    if (formsTrack) formsTrack.style.transform = 'translateX(-50%)';
    if (activeIndicator) activeIndicator.style.transform = 'translateX(200%)';
    if (tabNetBtn) tabNetBtn.classList.add('active');
    forms[2].classList.add('active');
    updateCTAButtonLabel('Proceed to Bank Page');
  } else if (tabName === 'wallet') {
    if (formsTrack) formsTrack.style.transform = 'translateX(-75%)';
    if (activeIndicator) activeIndicator.style.transform = 'translateX(300%)';
    if (tabWalletBtn) tabWalletBtn.classList.add('active');
    forms[3].classList.add('active');
    updateCTAButtonLabel('Link Wallet');
  }
}

function updateCTAButtonLabel(label) {
  const btnLabel = document.getElementById('btnTextLabel');
  if (btnLabel && !isCheckoutFlow) {
    btnLabel.textContent = label;
  }
}

/* --------------------------------------------------------------------------
   INPUT FIELD AUTO-FORMATTERS & VALIDATIONS
   -------------------------------------------------------------------------- */

// Format Card Number (space every 4 digits) & Brand detection
function formatCardNumber(input) {
  let val = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  let formatted = '';
  for (let i = 0; i < val.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += val[i];
  }
  input.value = formatted.substring(0, 19); // Max 16 digits + 3 spaces

  // Card brand detection
  const brandIcon = document.getElementById('cardBrandIcon');
  if (!brandIcon) return;

  if (val.startsWith('4')) {
    brandIcon.textContent = 'Visa';
    brandIcon.style.color = '#1E88E5';
    showValidGroup('cardNumGroup');
  } else if (/^5[1-5]/.test(val)) {
    brandIcon.textContent = 'MC';
    brandIcon.style.color = '#FF9900';
    showValidGroup('cardNumGroup');
  } else if (/^3[47]/.test(val)) {
    brandIcon.textContent = 'Amex';
    brandIcon.style.color = '#00B0FF';
    showValidGroup('cardNumGroup');
  } else if (val === '') {
    brandIcon.textContent = '';
    clearGroupValidation('cardNumGroup');
  } else {
    brandIcon.textContent = 'Card';
    brandIcon.style.color = '#A0A4C8';
    if (val.length >= 13) {
      showValidGroup('cardNumGroup');
    } else {
      clearGroupValidation('cardNumGroup');
    }
  }
}

// Format Expiry Date (MM/YY)
function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length > 2) {
    input.value = val.substring(0, 2) + '/' + val.substring(2, 4);
  } else {
    input.value = val;
  }
  
  if (input.value.length === 5) {
    const month = parseInt(val.substring(0, 2));
    if (month >= 1 && month <= 12) {
      showValidGroup('cardExpiryGroup');
    } else {
      showInvalidGroup('cardExpiryGroup', 'Invalid Expiry Month');
    }
  } else if (input.value === '') {
    clearGroupValidation('cardExpiryGroup');
  } else {
    clearGroupValidation('cardExpiryGroup');
  }
}

// Validate Cardholder Name
function validateCardName() {
  const input = document.getElementById('cardName');
  if (input.value.trim().length >= 3) {
    showValidGroup('cardNameGroup');
    return true;
  } else if (input.value === '') {
    clearGroupValidation('cardNameGroup');
    return false;
  } else {
    showInvalidGroup('cardNameGroup', 'Name is too short.');
    return false;
  }
}

// Validate CVV
function validateCvv() {
  const input = document.getElementById('cardCvv');
  if (input.value.length === 3) {
    showValidGroup('cardCvvGroup');
    return true;
  } else if (input.value === '') {
    clearGroupValidation('cardCvvGroup');
    return false;
  } else {
    clearGroupValidation('cardCvvGroup');
    return false;
  }
}

// Validate UPI Format
function validateUpiInput() {
  const input = document.getElementById('upiId');
  const val = input.value.trim();
  if (val.includes('@') && val.length > 3) {
    showValidGroup('upiIdGroup');
    return true;
  } else if (val === '') {
    clearGroupValidation('upiIdGroup');
    return false;
  } else {
    clearGroupValidation('upiIdGroup');
    return false;
  }
}

// Verify UPI click
function verifyUPI() {
  const input = document.getElementById('upiId');
  const val = input.value.trim();
  const verifyBtn = document.getElementById('verifyUpiBtn');

  if (val.includes('@') && val.length > 3) {
    verifyBtn.textContent = 'Verifying...';
    verifyBtn.disabled = true;
    setTimeout(() => {
      verifyBtn.textContent = 'Verified';
      verifyBtn.style.color = '#66BB6A';
      verifyBtn.style.borderColor = '#66BB6A';
      showValidGroup('upiIdGroup');
    }, 1200);
  } else {
    showInvalidGroup('upiIdGroup', 'Please enter a valid UPI ID (e.g. name@bank)');
  }
}

/* --------------------------------------------------------------------------
   VALIDATION HELPERS
   -------------------------------------------------------------------------- */
function showValidGroup(id) {
  const group = document.getElementById(id);
  if (group) {
    group.classList.remove('invalid');
    group.classList.add('valid');
    const helper = group.querySelector('.helper-text');
    if (helper) helper.textContent = '';
  }
}

function showInvalidGroup(id, msg) {
  const group = document.getElementById(id);
  if (group) {
    group.classList.remove('valid');
    group.classList.add('invalid');
    const helper = group.querySelector('.helper-text');
    if (helper) helper.textContent = msg;
  }
}

function clearGroupValidation(id) {
  const group = document.getElementById(id);
  if (group) group.classList.remove('invalid', 'valid');
}

/* --------------------------------------------------------------------------
   OPTIONS MODAL/SHEET (SAVED METHODS LIST)
   -------------------------------------------------------------------------- */
function openOptionsModal(targetName) {
  selectedOptionTarget = targetName;
  document.getElementById('sheetTargetName').textContent = targetName;
  const modal = document.getElementById('optionsModal');
  if (modal) modal.classList.add('open');
}

function closeOptionsModal() {
  const modal = document.getElementById('optionsModal');
  if (modal) modal.classList.remove('open');
}

function setDefaultMethod() {
  alert(`"${selectedOptionTarget}" is now set as your default payment method.`);
  closeOptionsModal();
}

function removeMethod() {
  alert(`"${selectedOptionTarget}" has been removed from saved payment options.`);
  closeOptionsModal();
}

/* --------------------------------------------------------------------------
   CHECKOUT VARIANT TOGGLE
   -------------------------------------------------------------------------- */
function toggleCheckoutFlow() {
  const toggle = document.getElementById('checkoutFlowToggle');
  const summary = document.getElementById('checkoutSummary');
  const submitBtn = document.getElementById('paymentSubmitBtn');
  const btnLabel = document.getElementById('btnTextLabel');
  const screen = document.querySelector('.payment-screen');

  isCheckoutFlow = toggle.checked;

  if (isCheckoutFlow) {
    summary.classList.remove('hidden');
    btnLabel.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right: 6px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Pay ₹1,499`;
    submitBtn.style.boxShadow = '0 4px 16px rgba(255, 77, 141, 0.4)';
    screen.classList.add('has-sticky-footer');
    
    // Add checkout-footer style
    const actionArea = document.querySelector('.action-btn-area');
    actionArea.classList.add('checkout-sticky-footer');
  } else {
    summary.classList.add('hidden');
    screen.classList.remove('has-sticky-footer');
    const actionArea = document.querySelector('.action-btn-area');
    actionArea.classList.remove('checkout-sticky-footer');
    switchFormTab(activeFormTab); // reset labels
  }
}

/* --------------------------------------------------------------------------
   SUBMISSION
   -------------------------------------------------------------------------- */
function triggerSubmit() {
  const submitBtn = document.getElementById('paymentSubmitBtn');
  
  if (isCheckoutFlow) {
    submitBtn.classList.add('loading');
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      alert("Payment Successful! Your order has been placed successfully.");
      window.location.href = 'index.html';
    }, 2000);
    return;
  }

  // Handle saving new method
  if (activeFormTab === 'card') {
    const cardNumVal = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const isNameValid = validateCardName();
    const isCvvValid = validateCvv();
    
    if (cardNumVal.length >= 13 && isNameValid && isCvvValid) {
      submitBtn.classList.add('loading');
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        alert("Success! Card has been securely saved to your account.");
        toggleAddPaymentForm();
      }, 1500);
    } else {
      alert("Please check and fill all card fields properly.");
    }
  } else if (activeFormTab === 'upi') {
    const isUpiValid = validateUpiInput();
    if (isUpiValid) {
      submitBtn.classList.add('loading');
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        alert("Success! UPI Handle has been securely linked.");
        toggleAddPaymentForm();
      }, 1500);
    } else {
      alert("Please check and fill your UPI Handle.");
    }
  } else {
    submitBtn.classList.add('loading');
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      alert(`Success! Linked ${activeFormTab.toUpperCase()} payment details.`);
      toggleAddPaymentForm();
    }, 1500);
  }
}

// Catch form submits
function handlePaymentSubmit(event, mode) {
  event.preventDefault();
  triggerSubmit();
}

function selectBank(bankName) {
  alert(`Redirecting to Net Banking login page for ${bankName}...`);
}

function selectWallet(walletName) {
  alert(`Connecting your ${walletName} account...`);
}

// Auto-trigger Checkout Flow if parameter checkout=true is in URL
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('checkout') === 'true') {
    const toggle = document.getElementById('checkoutFlowToggle');
    if (toggle) {
      toggle.checked = true;
      toggleCheckoutFlow();
    }
  }
});
