/* ==========================================================================
   LENSMAKERS - Login / Signup Interaction Logic
   ========================================================================== */

// Switch tabs between Login and Signup (Sliding App Style)
function switchTab(targetTab) {
  const formsTrack = document.getElementById('formsTrack');
  const activeIndicator = document.getElementById('activeIndicator');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabSignupBtn = document.getElementById('tabSignupBtn');
  const authFooter = document.getElementById('authFooter');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (targetTab === 'login') {
    if (formsTrack) formsTrack.style.transform = 'translateX(0%)';
    if (activeIndicator) activeIndicator.style.transform = 'translateX(0%)';
    
    if (loginForm) loginForm.classList.add('active');
    if (signupForm) signupForm.classList.remove('active');
    
    tabLoginBtn.classList.add('active');
    tabSignupBtn.classList.remove('active');
    authFooter.innerHTML = `Don't have an account? <span class="footer-action" onclick="switchTab('signup')">Sign Up</span>`;
  } else {
    if (formsTrack) formsTrack.style.transform = 'translateX(-50%)';
    if (activeIndicator) activeIndicator.style.transform = 'translateX(100%)';
    
    if (loginForm) loginForm.classList.remove('active');
    if (signupForm) signupForm.classList.add('active');
    
    tabLoginBtn.classList.remove('active');
    tabSignupBtn.classList.add('active');
    authFooter.innerHTML = `Already have an account? <span class="footer-action" onclick="switchTab('login')">Log In</span>`;
  }
}

// Toggle password visibility (show/hide)
function togglePasswordVisibility(inputId, element) {
  const passwordInput = document.getElementById(inputId);
  if (!passwordInput) return;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    // Change eye icon to slashed eye representation
    element.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="eye-closed">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`;
  } else {
    passwordInput.type = 'password';
    // Change back to open eye
    element.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="eye-open">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
  }
}

/* --------------------------------------------------------------------------
   VALIDATION HELPERS
   -------------------------------------------------------------------------- */

function showInvalid(groupId, message) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.remove('valid');
  group.classList.add('invalid');
  const helper = group.querySelector('.helper-text');
  if (helper) helper.textContent = message;
}

function showValid(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.remove('invalid');
  group.classList.add('valid');
  const helper = group.querySelector('.helper-text');
  if (helper) helper.textContent = '';
}

function clearValidation(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.remove('invalid', 'valid');
  const helper = group.querySelector('.helper-text');
  if (helper) helper.textContent = '';
}

// Regex Patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 phone check or general phone length

/* --------------------------------------------------------------------------
   LOG IN FORM VALIDATION
   -------------------------------------------------------------------------- */

function validateLoginEmail() {
  const emailInput = document.getElementById('loginEmail');
  const val = emailInput.value.trim();
  
  if (val === '') {
    clearValidation('loginEmailGroup');
    return false;
  }
  
  // Accept either valid email or simple phone validation
  if (emailRegex.test(val) || (val.length >= 8 && !isNaN(val.replace(/[+\-\s()]/g, '')))) {
    showValid('loginEmailGroup');
    return true;
  } else {
    showInvalid('loginEmailGroup', 'Please enter a valid email or phone number.');
    return false;
  }
}

function validateLoginPassword() {
  const passInput = document.getElementById('loginPassword');
  const val = passInput.value;
  
  if (val === '') {
    clearValidation('loginPasswordGroup');
    return false;
  }
  
  if (val.length >= 6) {
    showValid('loginPasswordGroup');
    return true;
  } else {
    showInvalid('loginPasswordGroup', 'Password must be at least 6 characters.');
    return false;
  }
}

/* --------------------------------------------------------------------------
   SIGN UP FORM VALIDATION
   -------------------------------------------------------------------------- */

function validateSignupName() {
  const nameInput = document.getElementById('signupName');
  const val = nameInput.value.trim();
  
  if (val === '') {
    clearValidation('signupNameGroup');
    return false;
  }
  
  if (val.length >= 2) {
    showValid('signupNameGroup');
    return true;
  } else {
    showInvalid('signupNameGroup', 'Please enter your full name.');
    return false;
  }
}

function validateSignupEmail() {
  const emailInput = document.getElementById('signupEmail');
  const val = emailInput.value.trim();
  
  if (val === '') {
    clearValidation('signupEmailGroup');
    return false;
  }
  
  if (emailRegex.test(val)) {
    showValid('signupEmailGroup');
    return true;
  } else {
    showInvalid('signupEmailGroup', 'Please enter a valid email address.');
    return false;
  }
}

function validateSignupPhone() {
  const phoneInput = document.getElementById('signupPhone');
  const val = phoneInput.value.trim();
  
  if (val === '') {
    clearValidation('signupPhoneGroup');
    return false;
  }
  
  // Check if starts with a code and has digits
  if (phoneRegex.test(val.replace(/[\s\-()]/g, ''))) {
    showValid('signupPhoneGroup');
    return true;
  } else {
    showInvalid('signupPhoneGroup', 'Enter a valid phone number (e.g. +91 9876543210).');
    return false;
  }
}

function validateSignupPassword() {
  const passInput = document.getElementById('signupPassword');
  const val = passInput.value;
  
  if (val === '') {
    clearValidation('signupPasswordGroup');
    return false;
  }
  
  if (val.length >= 6) {
    showValid('signupPasswordGroup');
    // Also trigger confirm password check if it already has value
    validateSignupConfirmPassword();
    return true;
  } else {
    showInvalid('signupPasswordGroup', 'Password must be at least 6 characters.');
    return false;
  }
}

function validateSignupConfirmPassword() {
  const passInput = document.getElementById('signupPassword');
  const confirmInput = document.getElementById('signupConfirmPassword');
  const pVal = passInput.value;
  const cVal = confirmInput.value;
  
  if (cVal === '') {
    clearValidation('signupConfirmPasswordGroup');
    return false;
  }
  
  if (pVal === cVal && cVal.length >= 6) {
    showValid('signupConfirmPasswordGroup');
    return true;
  } else {
    showInvalid('signupConfirmPasswordGroup', 'Passwords do not match.');
    return false;
  }
}

function validateTerms() {
  const termsCheckbox = document.getElementById('termsCheckbox');
  return termsCheckbox.checked;
}

/* --------------------------------------------------------------------------
   REAL LOCALSTORAGE USER AUTHENTICATION DATABASE
   -------------------------------------------------------------------------- */
const DB_USERS_KEY = 'lensmakers_users';
const SESSION_KEY = 'lensmakers_current_user';

// Pre-seeded demo account credentials
const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@lensmakers.com',
  phone: '9876543210',
  password: 'password123'
};

// Retrieve registered users from LocalStorage
function getLocalUsers() {
  const data = localStorage.getItem(DB_USERS_KEY);
  let users = data ? JSON.parse(data) : [];
  
  // Ensure the demo user is always seeded
  const hasDemo = users.some(u => u.email === DEMO_USER.email);
  if (!hasDemo) {
    users.push(DEMO_USER);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  }
  return users;
}

// Save users array to LocalStorage
function saveLocalUsers(users) {
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
}

// Handle Form Submission with Real Local DB checks
function handleAuthSubmit(event, mode) {
  event.preventDefault();
  
  let isValid = false;
  let btnId = '';
  
  // 1. Run formatting and structural validations first
  if (mode === 'login') {
    const isEmailValid = validateLoginEmail();
    const isPassValid = validateLoginPassword();
    isValid = isEmailValid && isPassValid;
    btnId = 'loginSubmitBtn';
  } else {
    const isNameValid = validateSignupName();
    const isEmailValid = validateSignupEmail();
    const isPhoneValid = validateSignupPhone();
    const isPassValid = validateSignupPassword();
    const isConfirmValid = validateSignupConfirmPassword();
    const isTermsChecked = validateTerms();
    
    isValid = isNameValid && isEmailValid && isPhoneValid && isPassValid && isConfirmValid && isTermsChecked;
    btnId = 'signupSubmitBtn';
    
    if (!isTermsChecked) {
      alert("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }
  }
  
  if (!isValid) return; // Block submission if inputs are invalid format
  
  const submitBtn = document.getElementById(btnId);
  if (!submitBtn) return;
  
  const usersList = getLocalUsers();
  
  // 2. Perform Real Authentication Database Queries
  if (mode === 'login') {
    const loginInputVal = document.getElementById('loginEmail').value.trim().toLowerCase();
    const loginPasswordVal = document.getElementById('loginPassword').value;
    
    // Find matching user (checks both email or phone handles)
    const matchingUser = usersList.find(u => u.email === loginInputVal || u.phone === loginInputVal);
    
    if (!matchingUser) {
      showInvalid('loginEmailGroup', 'This email/phone is not registered.');
      return;
    }
    
    if (matchingUser.password !== loginPasswordVal) {
      showInvalid('loginPasswordGroup', 'Incorrect password.');
      return;
    }
    
    // Credentials match! Link session
    localStorage.setItem(SESSION_KEY, JSON.stringify(matchingUser));
    
  } else {
    // Sign Up Mode
    const signupNameVal = document.getElementById('signupName').value.trim();
    const signupEmailVal = document.getElementById('signupEmail').value.trim().toLowerCase();
    const signupPhoneVal = document.getElementById('signupPhone').value.trim();
    const signupPasswordVal = document.getElementById('signupPassword').value;
    
    // Check if email already exists
    const emailExists = usersList.some(u => u.email === signupEmailVal);
    if (emailExists) {
      showInvalid('signupEmailGroup', 'This email is already registered.');
      return;
    }
    
    // Check if phone already exists
    const phoneExists = usersList.some(u => u.phone === signupPhoneVal);
    if (phoneExists) {
      showInvalid('signupPhoneGroup', 'This phone number is already registered.');
      return;
    }
    
    // Create new account
    const newUser = {
      name: signupNameVal,
      email: signupEmailVal,
      phone: signupPhoneVal,
      password: signupPasswordVal
    };
    
    usersList.push(newUser);
    saveLocalUsers(usersList);
    
    // Automatically log user in upon signing up
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  }
  
  // 3. Trigger submit load spinner and page entrance animation
  submitBtn.classList.add('loading');
  
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    
    // Page zoom exit animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.96)';
    document.body.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      window.location.href = 'index.html'; // Load dashboard
    }, 400);
  }, 1000);
}

// Seed the DB on page load so demo user is immediately valid
window.addEventListener('DOMContentLoaded', () => {
  getLocalUsers();
});

// Real Social OAuth Login Simulation (Google, Apple, Facebook)
function handleSocialLogin(provider) {
  if (provider === 'google') {
    // Open Google Account Chooser Modal
    const modal = document.getElementById('googleChooserModal');
    if (modal) modal.classList.add('open');
    return;
  }
  
  // Facebook and Apple flow
  const targetBtn = document.getElementById(`btnSocial${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
  if (!targetBtn) return;
  
  targetBtn.classList.add('social-loading');
  
  let socialUser = {};
  if (provider === 'apple') {
    socialUser = {
      name: 'Apple User',
      email: 'user.apple@icloud.com',
      phone: '+1 408-996-1010',
      password: 'apple_oauth_pass'
    };
  } else {
    socialUser = {
      name: 'Facebook User',
      email: 'user.facebook@fb.com',
      phone: '+1 650-543-4800',
      password: 'facebook_oauth_pass'
    };
  }
  
  saveAndRedirectSocial(socialUser);
}

// Close Google Chooser Modal
function closeGoogleChooser() {
  const modal = document.getElementById('googleChooserModal');
  if (modal) modal.classList.remove('open');
}

// Select a Google Account inside the Chooser Modal
function selectGoogleAccount(name, email, initial) {
  closeGoogleChooser();
  
  const googleBtn = document.getElementById('btnSocialGoogle');
  if (googleBtn) googleBtn.classList.add('social-loading');
  
  const socialUser = {
    name: name,
    email: email,
    phone: '+1 650-253-0000',
    password: 'google_oauth_pass'
  };
  
  saveAndRedirectSocial(socialUser);
}

// Shared helper to register user & redirect
function saveAndRedirectSocial(socialUser) {
  const usersList = getLocalUsers();
  const alreadyExists = usersList.some(u => u.email === socialUser.email);
  if (!alreadyExists) {
    usersList.push(socialUser);
    saveLocalUsers(usersList);
  }
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(socialUser));
  
  setTimeout(() => {
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.96)';
    document.body.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  }, 1000);
}
