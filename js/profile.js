/* ==========================================================================
   LENSMAKERS - Profile Integration & Session Management
   ========================================================================== */

const SESSION_KEY = 'lensmakers_current_user';
const DB_USERS_KEY = 'lensmakers_users';

// 1. Check and Load Session Data on Page Load
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem(SESSION_KEY) ? JSON.parse(localStorage.getItem(SESSION_KEY)) : null;
  
  const nameEl = document.getElementById('userDisplayName');
  const metaEl = document.getElementById('userDisplayMeta');
  const premiumBadge = document.getElementById('premiumBadge');
  const loginCtaBtn = document.getElementById('loginCtaBtn');
  const destructiveSection = document.getElementById('destructiveSection');

  if (currentUser) {
    // Authenticated User State
    if (nameEl) nameEl.textContent = currentUser.name;
    if (metaEl) metaEl.textContent = currentUser.email || currentUser.phone || 'Member';
    
    // Show premium member badge
    if (premiumBadge) premiumBadge.classList.remove('hidden');
    if (loginCtaBtn) loginCtaBtn.classList.add('hidden');
    
    // Show logout options
    if (destructiveSection) destructiveSection.classList.remove('hidden');
    
  } else {
    // Guest User State
    if (nameEl) nameEl.textContent = 'Guest User';
    if (metaEl) metaEl.textContent = 'Log in to sync records & settings';
    
    // Swap premium badge with Login CTA
    if (premiumBadge) premiumBadge.classList.add('hidden');
    if (loginCtaBtn) loginCtaBtn.classList.remove('hidden');
    
    // Hide destructive options
    if (destructiveSection) destructiveSection.classList.add('hidden');
  }
});

// 2. Redirect to Payment Methods page
function navigateToPayment() {
  window.location.href = 'payment.html';
}

// 3. Redirect to login
function redirectToLogin() {
  window.location.href = 'login.html';
}

// 4. Logout modal triggers
function openLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) modal.classList.add('open');
}

function closeLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) modal.classList.remove('open');
}

function confirmLogout() {
  const modal = document.getElementById('logoutModal');
  if (modal) modal.classList.remove('open');
  
  // Clear user session
  localStorage.removeItem(SESSION_KEY);
  
  // Slide exit animation on body before loading homepage
  document.body.style.opacity = '0';
  document.body.style.transform = 'scale(0.96)';
  document.body.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  
  setTimeout(() => {
    window.location.href = 'index.html'; // Load main dashboard
  }, 400);
}

// 5. Account Deletion Logic
function confirmDeleteAccount() {
  const confirmFirst = confirm("Warning! Are you sure you want to permanently delete your Lensmakers account? This action cannot be undone.");
  if (!confirmFirst) return;
  
  const currentUser = localStorage.getItem(SESSION_KEY) ? JSON.parse(localStorage.getItem(SESSION_KEY)) : null;
  if (!currentUser) return;
  
  // Delete user from LocalStorage DB list
  const usersData = localStorage.getItem(DB_USERS_KEY);
  if (usersData) {
    let usersList = JSON.parse(usersData);
    usersList = usersList.filter(u => u.email !== currentUser.email);
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(usersList));
  }
  
  // Clear active session
  localStorage.removeItem(SESSION_KEY);
  
  alert("Your account has been successfully deleted from our records.");
  
  // Page zoom redirect
  document.body.style.opacity = '0';
  document.body.style.transform = 'scale(0.96)';
  document.body.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 400);
}
