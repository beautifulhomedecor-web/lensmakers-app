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
      header.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      header.style.opacity = '1';
      header.style.transform = 'translate(-50%, 0)';
    }
    if (bottomNav) {
      bottomNav.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s';
      bottomNav.style.opacity = '1';
      bottomNav.style.transform = 'translate(-50%, 0) scale(1)';
    }
    
    // Start observing sections for scroll animations AFTER splash finishes
    startScrollObservers();
  }, 2000);

  /* ---- Bottom Navigation Tab Switching ---- */
  const navItems = document.querySelectorAll('.bottom-nav__item');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from all
      navItems.forEach(n => n.classList.remove('bottom-nav__item--active'));
      // Add active to clicked (except center which stays pink)
      item.classList.add('bottom-nav__item--active');
    });
  });

  /* ---- Search Bar Focus Enhancement ---- */
  const searchInput = document.getElementById('searchInput');
  const searchBar = document.getElementById('searchBar');

  if (searchInput && searchBar) {
    searchInput.addEventListener('focus', () => {
      searchBar.style.transform = 'scale(1.01)';
    });
    searchInput.addEventListener('blur', () => {
      searchBar.style.transform = 'scale(1)';
    });
  }

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
  
  let ticking = false;
  const handleMove = (e, card) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        
        const x = clientX - rect.left; 
        const y = clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg tilt
        const rotateY = ((x - centerX) / centerX) * 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';
        ticking = false;
      });
      ticking = true;
    }
  };

  const handleLeave = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease';
  };

  interactiveCards.forEach(card => {
    // Only bind mouse events (Disable 3D tilt on mobile touch to prevent scroll lag)
    card.addEventListener('mousemove', (e) => handleMove(e, card));
    card.addEventListener('mouseleave', () => handleLeave(card));
  });

  /* ---- Custom Cursor & Spotlight Hover ---- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  
  if (cursorDot && cursorGlow) {
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      
      // Instantly move the dot
      cursorDot.style.left = `${cursorX}px`;
      cursorDot.style.top = `${cursorY}px`;
    });
    
    // Smooth animation loop for the magnetic glow
    const animateGlow = () => {
      // Ease glow position towards cursor
      glowX += (cursorX - glowX) * 0.15;
      glowY += (cursorY - glowY) * 0.15;
      
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
    
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
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ---- Virtual Try-On trigger ---- */
  const tryNowTrigger = document.getElementById('tryNowBtn');
  if (tryNowTrigger) {
    tryNowTrigger.addEventListener('click', () => {
      if (window.openTryOnModal) window.openTryOnModal();
    });
  }

});
