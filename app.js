/* ============================================
   LENS MART — Interactive Behaviors
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- App Opening Animation Sequence ---- */
  const header = document.querySelector('.header');
  const bottomNav = document.querySelector('.bottom-nav');
  
  // Set initial hidden states for header and nav
  if (header) {
    header.style.opacity = '0';
    header.style.transform = 'translate(-50%, -40px)';
  }
  if (bottomNav) {
    bottomNav.style.opacity = '0';
    bottomNav.style.transform = 'translate(-50%, 40px) scale(0.9)';
  }

  // Handle Splash Screen and trigger open animation
  const splashScreen = document.getElementById('splashScreen');
  
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.classList.add('hidden');
      setTimeout(() => splashScreen.remove(), 1000); // remove from DOM
    }
    
    if (header) {
      header.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
      header.style.opacity = '1';
      header.style.transform = 'translate(-50%, 0)';
    }
    if (bottomNav) {
      bottomNav.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s';
      bottomNav.style.opacity = '1';
      bottomNav.style.transform = 'translate(-50%, 0) scale(1)';
    }
    
    // Start observing sections for scroll animations AFTER splash finishes
    startScrollObservers();
  }, 2000);

  /* ---- Session-based Profile & Greeting Initialization ---- */
  const SESSION_KEY = 'lensmakers_current_user';
  const currentUser = localStorage.getItem(SESSION_KEY) ? JSON.parse(localStorage.getItem(SESSION_KEY)) : null;

  const greetingName = document.getElementById('headerGreetingName');
  const avatarCircle = document.getElementById('headerAvatarCircle');
  if (currentUser) {
    if (greetingName) {
      const firstName = currentUser.name.split(' ')[0];
      greetingName.textContent = firstName;
    }
    if (avatarCircle) {
      const initial = currentUser.name.charAt(0).toUpperCase();
      avatarCircle.innerHTML = `<div class="user-avatar-pill">${initial}</div>`;
      avatarCircle.style.background = 'none';
      avatarCircle.style.border = 'none';
    }
  } else {
    if (greetingName) greetingName.textContent = 'Guest';
  }

  // Define global modal toggles
  window.openProfileModal = function() {
    if (!currentUser) return;
    const modal = document.getElementById('profileModal');
    if (modal) {
      document.getElementById('modalUserAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
      document.getElementById('modalUserName').textContent = currentUser.name;
      document.getElementById('modalUserEmail').textContent = currentUser.email;
      document.getElementById('modalUserPhone').textContent = currentUser.phone ? currentUser.phone : '+91 98765 43210';
      modal.classList.add('open');
    }
  };

  window.closeProfileModal = function() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.remove('open');
  };

  window.handleLogout = function() {
    localStorage.removeItem(SESSION_KEY);
    window.closeProfileModal();
    window.location.reload(); // Reload page to update header avatars
  };

  /* ---- E-Commerce Badge Counter Management ---- */
  const updateBadges = () => {
    // Read counts from storage or seed defaults (1 wishlist item, 2 cart items)
    const wishlistCount = localStorage.getItem('lensmakers_wishlist_count') || '1';
    const cartCount = localStorage.getItem('lensmakers_cart_count') || '2';
    
    const wBadge = document.getElementById('wishlistBadge');
    const cBadge = document.getElementById('cartBadge');
    
    if (wBadge) {
      const prevVal = wBadge.textContent;
      wBadge.textContent = wishlistCount;
      if (prevVal !== wishlistCount) {
        wBadge.classList.remove('badge-pop');
        wBadge.offsetWidth; // Reflow
        wBadge.classList.add('badge-pop');
      }
    }
    if (cBadge) {
      const prevVal = cBadge.textContent;
      cBadge.textContent = cartCount;
      if (prevVal !== cartCount) {
        cBadge.classList.remove('badge-pop');
        cBadge.offsetWidth; // Reflow
        cBadge.classList.add('badge-pop');
      }
    }
  };
  
  // Seed initial counts in localStorage so they show immediately
  if (!localStorage.getItem('lensmakers_wishlist_count')) localStorage.setItem('lensmakers_wishlist_count', '1');
  if (!localStorage.getItem('lensmakers_cart_count')) localStorage.setItem('lensmakers_cart_count', '2');
  
  updateBadges();
  window.addEventListener('storage', updateBadges);

  // Setup click triggers on badges to update for micro-interactions demo!
  const headerWishlistBtn = document.getElementById('headerWishlistBtn');
  if (headerWishlistBtn) {
    headerWishlistBtn.addEventListener('click', () => {
      let count = parseInt(localStorage.getItem('lensmakers_wishlist_count') || '1');
      count++;
      localStorage.setItem('lensmakers_wishlist_count', count.toString());
      updateBadges();
      // Apply brief glow effect on hover/active
      headerWishlistBtn.classList.add('active');
      setTimeout(() => headerWishlistBtn.classList.remove('active'), 300);
    });
  }

  /* ---- Expandable Search Bar System ---- */
  const searchTriggerBtn = document.getElementById('searchTriggerBtn');
  const searchExpandedBar = document.getElementById('searchExpandedBar');
  const searchExpandedInput = document.getElementById('searchExpandedInput');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchAutocompleteDropdown = document.getElementById('searchAutocompleteDropdown');

  if (searchTriggerBtn && searchExpandedBar && searchExpandedInput) {
    // Open expandable input on trigger click
    searchTriggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      searchExpandedBar.classList.add('active');
      setTimeout(() => searchExpandedInput.focus(), 150);
    });

    // Close expandable search on close button click
    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeExpandedSearch();
      });
    }

    // Close search if user clicks outside of container
    document.addEventListener('click', (e) => {
      const searchContainer = document.getElementById('headerSearchContainer');
      if (searchContainer && !searchContainer.contains(e.target)) {
        closeExpandedSearch();
      }
    });

    // Handle escape key to collapse
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeExpandedSearch();
    });
  }

  const closeExpandedSearch = () => {
    if (searchExpandedBar) searchExpandedBar.classList.remove('active');
    if (searchExpandedInput) {
      searchExpandedInput.value = '';
      searchExpandedInput.blur();
    }
    if (searchAutocompleteDropdown) searchAutocompleteDropdown.classList.remove('open');
  };

  /* ---- Search Autocomplete Logic ---- */
  const productSearchDataset = [
    { name: "Retro Square", price: "₹2,999", img: "images/sunglass_1.png", category: "sunglasses", sectionId: "trendingSection" },
    { name: "Elegant Cat-Eye", price: "₹3,499", img: "images/sunglass_2.png", category: "sunglasses", sectionId: "trendingSection" },
    { name: "Neon Sport", price: "₹4,199", img: "images/sunglass_3.png", category: "sunglasses", sectionId: "trendingSection" },
    { name: "Aviator Premium Frame", price: "₹4,499", img: "images/premium_frame_1.png", category: "eyeglasses", sectionId: "premiumSection" },
    { name: "Tortoise Classic Frame", price: "₹3,899", img: "images/premium_frame_2.png", category: "eyeglasses", sectionId: "premiumSection" },
    { name: "Round Titanium Lite", price: "₹5,299", img: "images/premium_frame_3.png", category: "eyeglasses", sectionId: "premiumSection" },
    { name: "Hexagon Thin Frame", price: "₹2,499", img: "images/premium_frame_1.png", category: "eyeglasses", sectionId: "premiumSection" },
    { name: "Wayfarer Classic", price: "₹3,199", img: "images/sunglass_1.png", category: "sunglasses", sectionId: "trendingSection" },
    { name: "Clear Acetate Square", price: "₹2,799", img: "images/premium_frame_2.png", category: "eyeglasses", sectionId: "premiumSection" },
    { name: "Ocean Blue Gradient", price: "₹4,599", img: "images/sunglass_2.png", category: "sunglasses", sectionId: "trendingSection" }
  ];

  if (searchExpandedInput && searchAutocompleteDropdown) {
    searchExpandedInput.addEventListener('input', () => {
      const query = searchExpandedInput.value.trim().toLowerCase();
      if (query.length === 0) {
        searchAutocompleteDropdown.classList.remove('open');
        return;
      }

      // Filter matched items
      const matches = productSearchDataset.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );

      renderAutocompleteMatches(matches);
    });
  }

  const renderAutocompleteMatches = (matches) => {
    if (!searchAutocompleteDropdown) return;
    
    if (matches.length === 0) {
      searchAutocompleteDropdown.innerHTML = `<div class="autocomplete-empty">No eyewear found matching that query.</div>`;
    } else {
      searchAutocompleteDropdown.innerHTML = matches.map(item => `
        <div class="autocomplete-item" onclick="handleAutocompleteItemClick('${item.sectionId}')">
          <div class="autocomplete-img-wrap">
            <img src="${item.img}" alt="${item.name}" class="autocomplete-img">
          </div>
          <div class="autocomplete-info">
            <span class="autocomplete-name">${item.name}</span>
            <span class="autocomplete-price">${item.price}</span>
          </div>
        </div>
      `).join('');
    }
    searchAutocompleteDropdown.classList.add('open');
  };

  window.handleAutocompleteItemClick = (sectionId) => {
    closeExpandedSearch();
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = 70; // Compressed height
      const targetPos = section.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
      // Highlight the targeted section with a subtle neon border pulse feedback
      section.style.boxShadow = '0 0 25px rgba(255, 77, 141, 0.4)';
      section.style.transition = 'box-shadow 0.3s ease';
      setTimeout(() => {
        section.style.boxShadow = 'none';
      }, 1500);
    }
  };

  /* ---- Location dropdown selector logic ---- */
  const headerPinBtn = document.getElementById('headerPinBtn');
  const locationDropdownModal = document.getElementById('locationDropdownModal');
  const locUseCurrentBtn = document.getElementById('locUseCurrentBtn');
  const locCurrentAddressText = document.getElementById('locCurrentAddressText');

  // Load saved address
  if (locCurrentAddressText) {
    const savedAddr = localStorage.getItem('lensmakers_saved_address');
    if (savedAddr) locCurrentAddressText.textContent = savedAddr;
  }

  if (headerPinBtn && locationDropdownModal) {
    headerPinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      locationDropdownModal.classList.toggle('open');
      headerPinBtn.classList.toggle('active');
    });

    // Close when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (locationDropdownModal.classList.contains('open') && !locationDropdownModal.contains(e.target) && e.target !== headerPinBtn) {
        locationDropdownModal.classList.remove('open');
        headerPinBtn.classList.remove('active');
      }
    });
  }

  if (locUseCurrentBtn) {
    locUseCurrentBtn.addEventListener('click', () => {
      locUseCurrentBtn.textContent = 'Detecting Location...';
      locUseCurrentBtn.style.opacity = '0.7';
      locUseCurrentBtn.style.pointerEvents = 'none';

      // Simulated location fetch for offline reliability
      setTimeout(() => {
        const mockAddress = 'Sector 18, Noida, Uttar Pradesh 201301';
        localStorage.setItem('lensmakers_saved_address', mockAddress);
        if (locCurrentAddressText) locCurrentAddressText.textContent = mockAddress;
        
        locUseCurrentBtn.textContent = 'Use Current Location';
        locUseCurrentBtn.style.opacity = '1';
        locUseCurrentBtn.style.pointerEvents = 'auto';

        // Brief success feedback glow
        const addressEl = document.querySelector('.loc-current-address');
        if (addressEl) {
          addressEl.style.borderColor = 'rgba(102, 187, 106, 0.6)';
          addressEl.style.boxShadow = '0 0 10px rgba(102, 187, 106, 0.2)';
          setTimeout(() => {
            addressEl.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            addressEl.style.boxShadow = 'none';
          }, 1500);
        }
      }, 1000);
    });
  }

  window.selectRecentAddress = (addressStr) => {
    localStorage.setItem('lensmakers_saved_address', addressStr);
    if (locCurrentAddressText) locCurrentAddressText.textContent = addressStr;
    if (locationDropdownModal) {
      locationDropdownModal.classList.remove('open');
      if (headerPinBtn) headerPinBtn.classList.remove('active');
    }
  };

  window.scrollToMapSection = () => {
    if (locationDropdownModal) {
      locationDropdownModal.classList.remove('open');
      if (headerPinBtn) headerPinBtn.classList.remove('active');
    }
    const section = document.getElementById('mapSection');
    if (section) {
      const headerHeight = 70;
      const targetPos = section.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  };



  /* ---- Bottom Navigation Tab Switching ---- */
  const navItems = document.querySelectorAll('.bottom-nav__item');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from all
      navItems.forEach(n => n.classList.remove('bottom-nav__item--active'));
      // Add active to clicked
      item.classList.add('bottom-nav__item--active');
      
      // If profile is clicked
      if (item.id === 'navProfile') {
        window.location.href = 'profile.html';
      }
      // If cart is clicked, navigate to cart page
      if (item.id === 'navCart') {
        window.location.href = 'cart.html';
      }
    });
  });

  /* ---- Category Cards Tap Feedback ---- */
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const label = card.querySelector('.category-card__tag')?.textContent || 'Category';
      card.style.opacity = '0.85';
      setTimeout(() => {
        card.style.opacity = '1';
      }, 200);
    });
  });

  /* ---- Premium Cards Tap Feedback ---- */
  const premiumCards = document.querySelectorAll('.premium-card');
  premiumCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.opacity = '0.85';
      setTimeout(() => {
        card.style.opacity = '1';
      }, 200);
    });
  });

  /* ---- Trending Cards Tap Feedback ---- */
  const trendingCards = document.querySelectorAll('.trending-card');
  trendingCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.opacity = '0.85';
      setTimeout(() => {
        card.style.opacity = '1';
      }, 200);
    });
  });

  /* ---- Try Now Button ---- */
  const tryNowBtn = document.getElementById('tryNowBtn');
  if (tryNowBtn) {
    tryNowBtn.addEventListener('click', () => {
      tryNowBtn.style.transform = 'scale(0.93)';
      setTimeout(() => {
        tryNowBtn.style.transform = 'scale(1)';
      }, 150);
    });
  }

  /* ---- Address Bar Tap ---- */
  const addressBar = document.getElementById('addressBar');
  if (addressBar) {
    addressBar.addEventListener('click', () => {
      const chevron = addressBar.querySelector('.map-card__chevron');
      if (chevron) {
        chevron.style.transform = 'rotate(180deg)';
        setTimeout(() => {
          chevron.style.transform = 'rotate(0deg)';
        }, 300);
      }
    });
  }

  /* ---- Smooth Entrance Cascade (Scroll & Load) ---- */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = '0s'; // Clear delay on scroll reveals
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply entrance cascade animation to sections
  const animateSections = [
    '.search-section',
    '.map-section',
    '.category-section',
    '.premium-section',
    '.tryon-section',
    '.promo-section',
    '.trending-section',
    '.glass-footer'
  ];

  animateSections.forEach((selector, index) => {
    const el = document.querySelector(selector);
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px) scale(0.98)';
      const delay = index * 0.15 + 0.2; 
      el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`;
    }
  });

  // Stagger premium cards initial state
  premiumCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
  });

  const premiumObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        premiumObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Function to start observers after splash screen
  const startScrollObservers = () => {
    animateSections.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) fadeInObserver.observe(el);
    });
    
    premiumCards.forEach(card => {
      premiumObserver.observe(card);
    });
  };

  /* ---- 3D Parallax Tilt Effect (Mouse & Touch) ---- */
  const interactiveCards = document.querySelectorAll('.map-card, .category-card, .premium-card, .tryon-card, .trending-card');
  
  const handleMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    // Get coordinates from either mouse or first touch point
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left; 
    const y = clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg tilt
    const rotateY = ((x - centerX) / centerX) * 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'transform 0.1s ease';
  };

  const handleLeave = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease';
  };

  interactiveCards.forEach(card => {
    // Mouse Events Only (Disabled Touch to fix severe mobile scrolling lag)
    card.addEventListener('mousemove', (e) => handleMove(e, card));
    card.addEventListener('mouseleave', () => handleLeave(card));
  });

  /* ---- Custom Cursor & Spotlight Hover ---- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  
  if (cursorDot && cursorGlow) {
    // Use CSS for the magnetic delay instead of thousands of setTimeouts
    cursorGlow.style.transition = 'left 0.08s ease-out, top 0.08s ease-out, width 0.2s, height 0.2s, background 0.2s';
    
    document.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
    
    // Magnetic snap on interactable elements
    const interactables = document.querySelectorAll('button, a, .category-card, .premium-card, .trending-card, .bottom-nav__item');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '60px';
        cursorGlow.style.height = '60px';
        cursorGlow.style.background = 'rgba(255, 77, 141, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '40px';
        cursorGlow.style.height = '40px';
        cursorGlow.style.background = 'transparent';
      });
    });
  }

  // Spotlight Effect for Cards
  const glassCards = document.querySelectorAll('.category-card, .premium-card, .tryon-card, .trending-card, .promo-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  /* ---- Glasses Carousel Selection ---- */
  const glassesThumbs = document.querySelectorAll('.glasses-thumb');
  const liveFrameName = document.getElementById('liveFrameName');
  
  if (glassesThumbs.length > 0) {
    glassesThumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        // Update active class
        glassesThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        // Update Name and Price label
        if (liveFrameName) {
            liveFrameName.textContent = `${thumb.dataset.name} — ${thumb.dataset.price}`;
        }
        
        // Push the new image to the tracking script
        if (typeof setGlasses === 'function') {
            setGlasses(thumb.dataset.model);
        }
      });
    });
  }

});

// ─── Lensmaker Unified Camera & Modal Triggers ───────────────────────────

// Define modal toggle functions globally so they can be called by triggers
window.openTryOnModal = () => {
    const tryonModal = document.getElementById("tryonModal");
    const tryonLive = document.getElementById("tryonLive");
    const tryonPermission = document.getElementById("tryonPermission");
    
    if (tryonModal) tryonModal.classList.remove("hidden");
    // Since we auto-start the camera, jump straight to the live view
    if (tryonPermission) tryonPermission.classList.add("hidden");
    if (tryonLive) tryonLive.classList.remove("hidden");
};

window.closeTryOnModal = () => {
    const tryonModal = document.getElementById("tryonModal");
    if (tryonModal) tryonModal.classList.add("hidden");
    if (typeof stopTryOn === "function") stopTryOn();
};

document.addEventListener("DOMContentLoaded", () => {
    const tryNowBtn = document.getElementById("tryNowBtn"); 
    const aiTryOnBtn = document.getElementById("navTryon");  
    const closeTryonBtn = document.getElementById("closeTryonBtn");
    const closePermissionBtn = document.getElementById("closePermissionBtn");

    // Bind close buttons
    if (closeTryonBtn) closeTryonBtn.addEventListener("click", window.closeTryOnModal);
    if (closePermissionBtn) closePermissionBtn.addEventListener("click", window.closeTryOnModal);

    const startVirtualTryOn = () => {
        console.log("[Lensmaker] Launching UI Modal and Camera tracking...");
        
        // 1. Open the visual modal window overlay
        if (window.openTryOnModal) {
            window.openTryOnModal();
        }

        // 2. Wait 300ms for layout transition to finish, then activate camera
        setTimeout(() => {
            if (typeof initTryOn === "function") {
                initTryOn("glasses-img"); 
            } else {
                console.error("[Lensmaker] Tracking script 'initTryOn' was not found.");
            }
        }, 300);
    };

    // Attach the master function to BOTH user triggers
    if (tryNowBtn) tryNowBtn.addEventListener("click", startVirtualTryOn);
    if (aiTryOnBtn) aiTryOnBtn.addEventListener("click", startVirtualTryOn);
});/* =========================================================
   SPA NAVIGATION & VIEW ROUTING
   ========================================================= */
function navTo(viewId) {
    // Hide all views
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('active');
    });
    // Show target view
    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    // Update bottom nav active state if applicable
    document.querySelectorAll('.bottom-nav__item').forEach(btn => {
        btn.classList.remove('bottom-nav__item--active');
        if (btn.dataset.nav === viewId) {
            btn.classList.add('bottom-nav__item--active');
        }
    });
}

// Attach nav click handlers
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.bottom-nav__item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const navTarget = item.dataset.nav;
            if (navTarget === 'tryon') return; // Handled by startVirtualTryOn
            // Map navTarget to views
            if (navTarget === 'profile') {
                // By default, showing Profile. To test login, user can click profile and see it.
                // In a real app we would check auth state.
                navTo('profile'); 
            } else if (navTarget === 'home') {
                navTo('home');
            }
        });
    });

    // Map the header profile button (top-right) to go to profile screen
    const headerProfileBtn = document.getElementById('profileBtn');
    if (headerProfileBtn) {
        headerProfileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }

    // Auth Segmented Control
    const authSegments = document.querySelectorAll('#view-login .segment-btn');
    authSegments.forEach(btn => {
        btn.addEventListener('click', () => {
            // reset active states
            authSegments.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#view-login .auth-form').forEach(f => f.classList.add('hidden'));
            
            // set active
            btn.classList.add('active');
            const targetId = btn.dataset.target;
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Simple Email Validation for visual effect
    const loginEmail = document.getElementById('loginEmail');
    if (loginEmail) {
        loginEmail.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.includes('@') && val.includes('.')) {
                loginEmail.classList.add('is-valid');
                loginEmail.classList.remove('is-invalid');
            } else if (val.length > 5) {
                loginEmail.classList.add('is-invalid');
                loginEmail.classList.remove('is-valid');
            } else {
                loginEmail.classList.remove('is-invalid');
                loginEmail.classList.remove('is-valid');
            }
        });
    }

    // Payment Segments
    const paySegments = document.querySelectorAll('#addPaymentForm .segment-btn');
    paySegments.forEach(btn => {
        btn.addEventListener('click', () => {
            paySegments.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    /* ---- Hero Carousel Auto-Advance & Controls ---- */
    const carouselTrack = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlideIndex = 0;
    let carouselInterval = null;
    let touchStartX = 0;
    let touchEndX = 0;

    const startCarouselAutoPlay = () => {
      carouselInterval = setInterval(() => {
        let nextIndex = (currentSlideIndex + 1) % slides.length;
        goToSlide(nextIndex);
      }, 5000);
    };

    const stopCarouselAutoPlay = () => {
      if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
      }
    };

    const goToSlide = (index) => {
      if (slides.length === 0) return;
      slides[currentSlideIndex].classList.remove('active');
      dots[currentSlideIndex].classList.remove('active');
      
      currentSlideIndex = index;
      
      slides[currentSlideIndex].classList.add('active');
      dots[currentSlideIndex].classList.add('active');
    };

    if (slides.length > 0) {
      startCarouselAutoPlay();

      // Pause/resume on touch/hover
      const carouselContainer = document.getElementById('heroCarousel');
      if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarouselAutoPlay);
        carouselContainer.addEventListener('mouseleave', startCarouselAutoPlay);
        carouselContainer.addEventListener('touchstart', (e) => {
          stopCarouselAutoPlay();
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        carouselContainer.addEventListener('touchend', (e) => {
          startCarouselAutoPlay();
          touchEndX = e.changedTouches[0].screenX;
          handleSwipeGesture();
        }, { passive: true });
      }

      // Dot click event handlers
      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          const index = parseInt(dot.dataset.slide);
          goToSlide(index);
        });
      });
    }

    const handleSwipeGesture = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped left, show next slide
        let nextIndex = (currentSlideIndex + 1) % slides.length;
        goToSlide(nextIndex);
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped right, show previous slide
        let prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
      }
    };

    /* ---- Staggered Entrance Reveal for Category Cards ---- */
    const categoryExpCards = document.querySelectorAll('.category-card-exp');
    const categorySection = document.getElementById('categorySection');
    
    if (categorySection && categoryExpCards.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            categoryExpCards.forEach(card => card.classList.add('show'));
            observer.unobserve(categorySection);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(categorySection);
    }
});

/* ---- Global Redirection & Scrolling Helpers ---- */
window.scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = 70;
    const targetPos = section.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({
      top: targetPos,
      behavior: 'smooth'
    });
  }
};

window.selectCategory = (categoryKey) => {
  // Update matching category nav pill active state
  const pill = document.querySelector(`.category-pill[data-category="${categoryKey}"]`);
  if (pill) {
    pill.click();
  }
};

function toggleAuth(targetId) {
    const btn = document.querySelector("#view-login .segment-btn[data-target='" + targetId + "']");
    if (btn) btn.click();
}

/* =========================================================
   MODALS & TOGGLES
   ========================================================= */
function showLogoutModal() {
    document.getElementById('logoutModal').classList.remove('hidden');
}
function closeLogoutModal() {
    document.getElementById('logoutModal').classList.add('hidden');
}
function confirmLogout() {
    closeLogoutModal();
    navTo('home');
}

function toggleAddPayment() {
    const form = document.getElementById('addPaymentForm');
    form.classList.toggle('hidden');
}
