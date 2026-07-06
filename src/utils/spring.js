// spring.js — Apple UIKit spring simulation & core animation engine
class Spring {
  constructor({ mass = 1, stiffness = 200,
                damping = 20, initialVelocity = 0 } = {}) {
    this.mass       = mass;
    this.stiffness  = stiffness;
    this.damping    = damping;
    this.velocity   = initialVelocity;
  }

  // Simulate one timestep (dt in seconds)
  step(current, target, dt) {
    const springForce = -this.stiffness * (current - target);
    const dampForce   = -this.damping   * this.velocity;
    const force       = springForce + dampForce;
    const accel       = force / this.mass;

    this.velocity += accel * dt;
    return current + this.velocity * dt;
  }

  // Run spring to completion, return array of values
  simulate(from, to, fps = 60) {
    const dt     = 1 / fps;
    const values = [];
    let   pos    = from;
    const threshold = 0.001;

    for (let i = 0; i < fps * 5; i++) { // max 5 seconds
      pos = this.step(pos, to, dt);
      values.push(pos);
      if (Math.abs(pos - to) < threshold &&
          Math.abs(this.velocity) < threshold) break;
    }
    return values;
  }
}

// Preset spring configs matching Apple UIKit presets
const SpringPresets = {
  // UISpringTimingParameters defaults
  default: new Spring({ mass:1, stiffness:200, damping:20 }),

  // Interactive — snappy, minimal overshoot
  interactive: new Spring({ mass:1, stiffness:400, damping:35 }),

  // Bouncy — visible overshoot, delightful
  bouncy: new Spring({ mass:1, stiffness:200, damping:12 }),

  // Stiff — fast settle, used for micro-interactions
  stiff: new Spring({ mass:1, stiffness:600, damping:40 }),

  // Gentle — smooth, graceful, for exits
  gentle: new Spring({ mass:1, stiffness:120, damping:20 }),
};

// Animate a value using spring physics via RAF
function animateSpring({
  from, to, preset = 'default',
  onUpdate, onComplete, fps = 60
}) {
  const spring = SpringPresets[preset];
  const values = spring.simulate(from, to, fps);
  let   frame  = 0;
  let   rafId;

  const tick = () => {
    if (frame >= values.length) {
      if (onUpdate) onUpdate(to);
      if (onComplete) onComplete();
      return;
    }
    if (onUpdate) onUpdate(values[frame]);
    frame++;
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId); // cancel fn
}

// Lerp helper for smooth interpolation
const lerp = (a, b, t) => a + (b - a) * t;

// Clamp helper
const clamp = (val, min, max) =>
  Math.min(Math.max(val, min), max);

// Reduced motion system respect
const REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Global Ripple listener via pointerdown (handles dynamically mounted React components)
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn-primary, .btn-primary-pill, .btn-secondary-pill, .btn-destructive-pill');
    if (!btn || btn.classList.contains('loading') || btn.classList.contains('disabled')) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px; height:${size}px; left:${x - size/2}px; top:${y - size/2}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }, { passive: true });
}

// Particle burst — runs on wishlist heart save (Prompt 2 Section 4)
function burstHeartParticles(heartBtn) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!heartBtn) return;
  const colors = ['#FF4D8D','#FF85AD','#FF4D8D','#FFC2D4','#FF4D8D','#C2185B','#FF85AD','#FF4D8D'];
  const rect = heartBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  colors.forEach((color, i) => {
    const angle = (i / colors.length) * 360;
    const distance = 20 + Math.random() * 12;
    const rad = angle * Math.PI / 180;
    const tx = Math.cos(rad) * distance;
    const ty = Math.sin(rad) * distance;
    const size = 4 + Math.random() * 3;

    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${color};
      left: ${cx - size/2}px;
      top: ${cy - size/2}px;
      pointer-events: none;
      z-index: 9999;
      animation: particle-fly 500ms ease-out forwards;
      --tx: ${tx}px; --ty: ${ty}px;
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 520);
  });
}

// Add to Cart — item flies in parabolic arc to nav badge (Prompt 2 Section 5)
function bumpBadge(badge) {
  if (!badge) return;
  badge.classList.remove('bumping');
  void badge.offsetWidth; // force reflow
  badge.classList.add('bumping');
}

function animateAddToCart(sourceElement, cartBadge) {
  if (!cartBadge) {
    cartBadge = document.querySelector('.bottom-nav-badge') || document.querySelector('.cart-badge');
  }
  if (!cartBadge || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    if (cartBadge) bumpBadge(cartBadge);
    return;
  }

  const sourceRect = sourceElement ? sourceElement.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 48, height: 48 };
  const targetRect = cartBadge.getBoundingClientRect();

  // Get product thumbnail inside the card
  const thumbEl = sourceElement && sourceElement.closest ? sourceElement.closest('.product-card, .premium-special-card, .glass-card-standard')?.querySelector('.product-image, img') : null;
  let thumbSrc = null;
  if (thumbEl) {
    if (thumbEl.tagName && thumbEl.tagName.toLowerCase() === 'img') {
      thumbSrc = `url('${thumbEl.src}')`;
    } else {
      thumbSrc = window.getComputedStyle(thumbEl).backgroundImage;
      if (thumbSrc && thumbSrc === 'none') thumbSrc = null;
    }
  }

  const flyer = document.createElement('div');
  flyer.style.cssText = `
    position: fixed;
    width: 48px; height: 48px;
    border-radius: 12px;
    background: ${thumbSrc ? thumbSrc : 'linear-gradient(135deg,#FF4D8D,#7C4DFF)'};
    background-size: cover;
    background-position: center;
    left: ${sourceRect.left + sourceRect.width/2 - 24}px;
    top: ${sourceRect.top + sourceRect.height/2 - 24}px;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    transition: none;
  `;
  document.body.appendChild(flyer);

  const startX = sourceRect.left + sourceRect.width/2 - 24;
  const startY = sourceRect.top + sourceRect.height/2 - 24;
  const endX = targetRect.left + targetRect.width/2 - 24;
  const endY = targetRect.top + targetRect.height/2 - 24;
  const arcY = Math.min(startY, endY) - 80;

  const pathD = `M ${startX},${startY} Q ${(startX+endX)/2},${arcY} ${endX},${endY}`;

  flyer.style.cssText += `
    offset-path: path('${pathD}');
    offset-distance: 0%;
    animation: fly-arc 600ms cubic-bezier(0.4, 0.0, 0.8, 1) forwards;
  `;

  if (!CSS.supports('offset-path', `path('${pathD}')`)) {
    flyer.style.transition = 'all 600ms cubic-bezier(0.4, 0.0, 0.8, 1)';
    setTimeout(() => {
      flyer.style.left = `${endX}px`;
      flyer.style.top = `${endY}px`;
      flyer.style.transform = 'scale(0.2)';
      flyer.style.opacity = '0';
    }, 20);
  }

  flyer.addEventListener('animationend', () => {
    flyer.remove();
    bumpBadge(cartBadge);
  });
  setTimeout(() => {
    if (flyer && flyer.parentNode) {
      flyer.remove();
      bumpBadge(cartBadge);
    }
  }, 650);
}

// Section 5: EDGE SWIPE — iOS-STYLE BACK GESTURE (Prompt 3)
class EdgeSwipeBack {
  constructor(container, onComplete) {
    this.container  = container;
    this.onComplete = onComplete;
    this.startX     = 0;
    this.currentX   = 0;
    this.isDragging = false;
    this.EDGE_ZONE  = 24; /* px from left edge to trigger */

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;
    this.container.addEventListener('touchstart',
      this.onStart.bind(this), { passive: true });
    this.container.addEventListener('touchmove',
      this.onMove.bind(this), { passive: false });
    this.container.addEventListener('touchend',
      this.onEnd.bind(this), { passive: true });
  }

  onStart(e) {
    /* Only activate from the left edge */
    if (!e.touches || !e.touches[0] || e.touches[0].clientX > this.EDGE_ZONE) return;
    this.startX     = e.touches[0].clientX;
    this.isDragging = true;
    this.startTime  = e.timeStamp;

    /* Get current and previous screens */
    this.currentScreen  = this.container.querySelector('.screen.active, .screen-transition-enter, .pdp-full-page');
    this.previousScreen = this.container.querySelector('.screen.previous, .main-app-content');

    if (this.previousScreen && this.currentScreen) {
      /* Show previous screen immediately, offset left */
      this.previousScreen.style.transform =
        'translateX(-30%) scale(0.94)';
      this.previousScreen.style.opacity   = '0.65';
      this.previousScreen.style.display   = 'block';
      this.previousScreen.style.transition = 'none';
    }
  }

  onMove(e) {
    if (!this.isDragging || !this.currentScreen) return;
    e.preventDefault(); /* prevent scroll during swipe */

    this.currentX = e.touches[0].clientX - this.startX;
    if (this.currentX < 0) return;
    const progress = Math.max(0, Math.min(1,
      this.currentX / window.innerWidth));

    /* Current screen slides right with finger */
    this.currentScreen.style.transform =
      `translateX(${this.currentX}px)`;
    this.currentScreen.style.transition = 'none';

    /* Previous screen slides in from left proportionally */
    if (this.previousScreen) {
      const prevX = -30 + (30 * progress);
      const prevScale = 0.94 + (0.06 * progress);
      const prevOpacity = 0.65 + (0.35 * progress);
      this.previousScreen.style.transform =
        `translateX(${prevX}%) scale(${prevScale})`;
      this.previousScreen.style.opacity = prevOpacity;
    }
  }

  onEnd(e) {
    if (!this.isDragging || !this.currentScreen) return;
    this.isDragging = false;

    const finalX   = e.changedTouches[0].clientX - this.startX;
    const velocity = finalX / Math.max(1, e.timeStamp - (this.startTime || e.timeStamp - 100));
    const shouldComplete = finalX > window.innerWidth * 0.4
                        || velocity > 0.5;

    const durNormal = window.getComputedStyle(document.documentElement).getPropertyValue('--dur-normal').trim() || '300ms';
    const easeOut = window.getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim() || 'ease-out';
    const springGentle = window.getComputedStyle(document.documentElement).getPropertyValue('--spring-gentle').trim() || 'cubic-bezier(0.2, 0.8, 0.2, 1)';

    if (shouldComplete) {
      /* Complete the pop */
      this.currentScreen.style.transition =
        `transform ${durNormal} ${easeOut},
         opacity   ${durNormal} ${easeOut}`;
      this.currentScreen.style.transform = 'translateX(100%)';
      this.currentScreen.style.opacity   = '0.85';

      if (this.previousScreen) {
        this.previousScreen.style.transition =
          `transform ${durNormal} ${springGentle},
           opacity   ${durNormal} ${easeOut}`;
        this.previousScreen.style.transform = 'translateX(0) scale(1)';
        this.previousScreen.style.opacity   = '1';
      }
      setTimeout(() => {
        if (this.onComplete) this.onComplete();
      }, 380);
    } else {
      /* Cancel — spring back */
      this.currentScreen.style.transition =
        `transform ${durNormal} ${springGentle}`;
      this.currentScreen.style.transform = 'translateX(0)';

      if (this.previousScreen) {
        this.previousScreen.style.transition =
          `transform ${durNormal} ${easeOut},
           opacity   ${durNormal} ${easeOut}`;
        this.previousScreen.style.transform =
          'translateX(-30%) scale(0.94)';
        this.previousScreen.style.opacity = '0.65';
        setTimeout(() => {
          this.previousScreen.style.display = '';
        }, 380);
      }
    }
  }
}

// Section 6: BOTTOM SHEET ENTRANCE — DRAG-AWARE (Prompt 3)
class BottomSheet {
  constructor(element, backdrop, onDismiss) {
    this.sheet     = element;
    this.backdrop  = backdrop;
    this.onDismiss = onDismiss;
    this.startY    = 0;
    this.isDragging= false;
    this.DISMISS_THRESHOLD = 0.35;
  }

  show() {
    if (!this.sheet || !this.backdrop) return;
    const easeOut = window.getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim() || 'ease-out';
    const springPrimary = window.getComputedStyle(document.documentElement).getPropertyValue('--spring-primary').trim() || 'cubic-bezier(0.175, 0.885, 0.32, 1.1)';

    /* Backdrop fades in */
    this.backdrop.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0);
      z-index: 900;
      transition: background 350ms ${easeOut};
    `;
    void this.backdrop.offsetWidth;
    this.backdrop.style.background = 'rgba(0,0,0,0.65)';

    /* Sheet springs up */
    this.sheet.style.transform = 'translateY(100%)';
    this.sheet.style.transition = 'none';
    void this.sheet.offsetWidth;
    this.sheet.style.transition =
      `transform 450ms ${springPrimary}`;
    this.sheet.style.transform = 'translateY(0)';

    /* Drag-to-dismiss handle */
    this.bindDrag();
  }

  hide() {
    if (!this.sheet || !this.backdrop) return;
    const easeIn = window.getComputedStyle(document.documentElement).getPropertyValue('--ease-in').trim() || 'ease-in';
    this.backdrop.style.background = 'rgba(0,0,0,0)';
    this.sheet.style.transition =
      `transform 300ms ${easeIn}`;
    this.sheet.style.transform = 'translateY(100%)';

    setTimeout(() => {
      this.onDismiss?.();
      if (this.backdrop.parentNode) this.backdrop.remove();
    }, 300);
  }

  bindDrag() {
    if (!this.sheet) return;
    const handle = this.sheet.querySelector('.drag-handle') || this.sheet.querySelector('.modal-sheet-header') || this.sheet;
    const target = handle || this.sheet;

    target.addEventListener('touchstart', e => {
      this.startY    = e.touches[0].clientY;
      this.isDragging = true;
      this.sheet.style.transition = 'none';
    }, { passive: true });

    target.addEventListener('touchmove', e => {
      if (!this.isDragging) return;
      const dy = Math.max(0, e.touches[0].clientY - this.startY);
      this.sheet.style.transform = `translateY(${dy}px)`;
      /* Fade backdrop proportionally */
      const progress = dy / Math.max(1, this.sheet.offsetHeight);
      const opacity  = 0.65 * (1 - progress);
      if (this.backdrop) this.backdrop.style.background = `rgba(0,0,0,${Math.max(0, opacity)})`;
    }, { passive: true });

    target.addEventListener('touchend', e => {
      if (!this.isDragging) return;
      this.isDragging = false;
      const dy = e.changedTouches[0].clientY - this.startY;
      const progress = dy / Math.max(1, this.sheet.offsetHeight);

      if (progress > this.DISMISS_THRESHOLD) {
        this.hide();
      } else {
        const easeOut = window.getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim() || 'ease-out';
        const springPrimary = window.getComputedStyle(document.documentElement).getPropertyValue('--spring-primary').trim() || 'cubic-bezier(0.175, 0.885, 0.32, 1.1)';
        /* Spring back into position */
        this.sheet.style.transition =
          `transform 380ms ${springPrimary}`;
        this.sheet.style.transform = 'translateY(0)';
        if (this.backdrop) {
          this.backdrop.style.transition =
            `background 300ms ${easeOut}`;
          this.backdrop.style.background = 'rgba(0,0,0,0.65)';
        }
      }
    }, { passive: true });
  }
}

// Section 1: LIST ENTRANCE — STAGGERED FADE-UP (Prompt 4)
function initListAnimations() {
  if (typeof window === 'undefined' || !window.IntersectionObserver) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        /* Remove the data-animate marker so the hidden state is lifted */
        entry.target.removeAttribute('data-animate');
        /* Add visible class to trigger animation */
        entry.target.classList.add('visible');
        /* Once animated, never animate again */
        observer.unobserve(entry.target);
      });
    },
    {
      threshold:   0.08,     /* trigger at 8% visible */
      rootMargin: '0px 0px -24px 0px' /* slight delay */
    }
  );

  /* Apply stagger delays to all animate-items in lists and cards */
  document.querySelectorAll('.animate-list, .product-grid, .product-grid-2col, .category-grid, .orders-list, .address-list, .prescription-list, .grid-container, .cards-grid, .screen-container, .section, .home-screen, .shop-screen, .tryon-screen, .profile-screen, .cart-screen, .orders-screen, .store-locator-screen, .prescription-screen').forEach(list => {
    const items = list.querySelectorAll('.animate-item, .product-card, .product-card-glass, .category-card, .promo-card, .location-card, .bogo-rotating-card, .premium-special-card, .order-card, .address-card, .prescription-card, .glass-card-glow-cyan, .glass-card-glow-pink, .glass-card-glow-green, .rx-card-cyan, .purple-shimmer-card, .glass-card-elevated, .glass-card-standard, .fade-up-item');
    items.forEach((item, index) => {
      if (item.classList.contains('visible')) return;
      /* Stagger: 45ms per item, max 350ms total stagger */
      const delay = Math.min(index * 45, 350);
      item.style.setProperty('--stagger', `${delay}ms`);
      if (!item.classList.contains('animate-item')) item.classList.add('animate-item');
      /* Mark with data-animate BEFORE observing — CSS only hides items with this attr */
      item.setAttribute('data-animate', 'true');
      observer.observe(item);
    });
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initListAnimations);
  window.initListAnimations = initListAnimations;
}

// Section 3: PULL TO REFRESH (Prompt 4)
class PullToRefresh {
  constructor(scrollContainer, onRefresh) {
    this.container   = scrollContainer;
    this.onRefresh   = onRefresh;
    this.startY      = 0;
    this.pulling     = false;
    this.refreshing  = false;
    this.MAX_PULL    = 80;  /* px of max pull distance */
    this.TRIGGER     = 64;  /* px to trigger refresh */

    this.createIndicator();
    this.bindEvents();
  }

  createIndicator() {
    if (!this.container || !this.container.parentElement) return;
    /* Clean up any orphaned indicators from previous renders or screen switches */
    const existing = this.container.parentElement.querySelectorAll('.ptr-indicator');
    existing.forEach(el => el.remove());

    this.indicator = document.createElement('div');
    this.indicator.innerHTML = `
      <div class="ptr-logo">
        <svg width="28" height="18" viewBox="0 0 28 18">
          <!-- Lens Makers logo icon -->
          <circle cx="9"  cy="9" r="8" fill="none"
                  stroke="#1E88E5" stroke-width="2.5"/>
          <circle cx="19" cy="9" r="8" fill="none"
                  stroke="#43A047" stroke-width="2.5"/>
        </svg>
      </div>
      <span class="ptr-label">Pull to refresh</span>
    `;
    this.indicator.className = 'ptr-indicator';
    this.indicator.style.cssText = `
      position: absolute;
      top: -80px; left: 50%;
      transform: translateX(-50%) translateY(0);
      display: flex; flex-direction: column;
      align-items: center; gap: 8px;
      opacity: 0; pointer-events: none;
      z-index: 100;
      transition: none;
    `;
    if (window.getComputedStyle(this.container.parentElement).position === 'static') {
      this.container.parentElement.style.position = 'relative';
    }
    this.container.parentElement.appendChild(this.indicator);
  }

  reset() {
    this.pulling = false;
    this.refreshing = false;
    if (this.container) {
      this.container.style.transition = `transform 380ms var(--spring-primary)`;
      this.container.style.transform = 'translateY(0)';
    }
    if (this.indicator) {
      this.indicator.style.transition = `opacity 200ms var(--ease-out), transform 200ms var(--ease-out)`;
      this.indicator.style.opacity = '0';
      this.indicator.style.transform = 'translateX(-50%) translateY(0)';
      const logoEl = this.indicator.querySelector('.ptr-logo');
      if (logoEl) logoEl.style.animation = 'none';
    }
  }

  bindEvents() {
    if (!this.container || !this.indicator) return;
    this.container.addEventListener('touchstart', e => {
      /* Only pull when at the very top */
      if (this.container.scrollTop > 0 || this.refreshing || !e.touches || !e.touches[0])
        return;
      this.startY  = e.touches[0].clientY;
      this.pulling = true;
    }, { passive: true });

    this.container.addEventListener('touchmove', e => {
      if (!this.pulling || !e.touches || !e.touches[0]) return;
      const dy = e.touches[0].clientY - this.startY;
      if (dy <= 0) return;

      /* Rubber-band resistance: diminishing returns */
      const pull = Math.min(
        this.MAX_PULL,
        dy * (1 - (dy / (this.MAX_PULL * 3)))
      );

      /* Show indicator */
      const progress = pull / this.TRIGGER;
      this.indicator.style.transform =
        `translateX(-50%) translateY(${pull + 80}px)`;
      this.indicator.style.opacity = Math.min(1, progress * 1.5);

      /* Rotate logo as pull progresses */
      const rotation = progress * 180;
      const logoEl = this.indicator.querySelector('.ptr-logo');
      if (logoEl) logoEl.style.transform = `rotate(${rotation}deg)`;

      /* Update label */
      const labelEl = this.indicator.querySelector('.ptr-label');
      if (labelEl) {
        labelEl.textContent =
          pull >= this.TRIGGER
            ? 'Release to refresh'
            : 'Pull to refresh';
      }

      /* Push content down with rubber-band */
      this.container.style.transform =
        `translateY(${pull * 0.4}px)`;
      this.container.style.transition = 'none';
    }, { passive: true });

    this.container.addEventListener('touchend', e => {
      if (!this.pulling || !e.changedTouches || !e.changedTouches[0]) return;
      this.pulling = false;

      const dy   = e.changedTouches[0].clientY - this.startY;
      const pull = Math.min(this.MAX_PULL, dy * 0.4);

      if (pull >= this.TRIGGER * 0.4) {
        /* Trigger refresh */
        this.refreshing = true;
        const labelEl = this.indicator.querySelector('.ptr-label');
        if (labelEl) labelEl.textContent = 'Refreshing...';
        /* Spin the logo during refresh using ptr-spin */
        const logoEl = this.indicator.querySelector('.ptr-logo');
        if (logoEl) logoEl.style.animation = 'ptr-spin 1s linear infinite';

        /* Spring content back up slightly */
        this.container.style.transition =
          `transform 350ms var(--spring-gentle)`;
        this.container.style.transform = 'translateY(24px)';

        let isDone = false;
        /* Execute refresh callback */
        const doneCallback = () => {
          if (isDone) return;
          isDone = true;
          this.reset();
        };

        /* Failsafe safety timer: ensure indicator never stays stuck on screen! */
        setTimeout(doneCallback, 2000);

        if (this.onRefresh) {
          this.onRefresh(doneCallback);
        } else {
          setTimeout(doneCallback, 1000);
        }
      } else {
        /* Snap back */
        this.reset();
      }
    }, { passive: true });

    /* Handle touch cancellation (e.g., interrupted gesture or system notification) */
    this.container.addEventListener('touchcancel', () => {
      this.reset();
    }, { passive: true });
  }
}

// Attach to window for global standalone usage across all app components
window.Spring = Spring;
window.SpringPresets = SpringPresets;
window.animateSpring = animateSpring;
window.lerp = lerp;
window.clamp = clamp;
window.REDUCED_MOTION = REDUCED_MOTION;
window.burstHeartParticles = burstHeartParticles;
window.animateAddToCart = animateAddToCart;
window.bumpBadge = bumpBadge;
window.EdgeSwipeBack = EdgeSwipeBack;
window.BottomSheet = BottomSheet;
window.initListAnimations = initListAnimations;
window.PullToRefresh = PullToRefresh;

// Support ES module exports if imported in modular builds
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Spring, SpringPresets, animateSpring, lerp, clamp, REDUCED_MOTION, burstHeartParticles, animateAddToCart, bumpBadge, EdgeSwipeBack, BottomSheet, initListAnimations, PullToRefresh };
}
