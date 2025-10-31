import anime from 'animejs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ============================================================================
// INTRO SEQUENCE
// ============================================================================

function finalizeIntro(introOverlay, header) {
  if (introOverlay) {
    introOverlay.style.opacity = '0';
    introOverlay.style.pointerEvents = 'none';
    introOverlay.style.display = 'none';
  }

  if (header) {
    header.classList.add('visible');
  }

  if (!prefersReducedMotion.matches) {
    initHeaderAnimation();
  }

  initScrollEffects();
}

function initIntroSequence() {
  const introOverlay = document.getElementById('intro');
  const header = document.getElementById('header');
  const introLogo = document.getElementById('intro-logo');
  const path = introLogo?.querySelector('path');

  if (!introOverlay) {
    finalizeIntro(null, header);
    return;
  }

  if (prefersReducedMotion.matches) {
    finalizeIntro(introOverlay, header);
    return;
  }

  anime.set('.intro-logo-container', { opacity: 0, scale: 0.85 });

  // Set up the path for stroke animation (drawing effect)
  let pathLength = 0;
  if (path) {
    pathLength = path.getTotalLength();
    anime.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      strokeWidth: 6,
      stroke: 'currentColor',
      fill: 'none'
    });
  }

  const timeline = anime.timeline({ easing: 'easeOutQuad' });

  // Fade in container
  timeline.add({
    targets: '.intro-logo-container',
    opacity: [0, 1],
    scale: [0.85, 1],
    duration: 300
  });

  // Animate the stroke drawing (the "fuse being lit" effect)
  if (path && pathLength > 0) {
    timeline.add({
      targets: path,
      strokeDashoffset: [pathLength, 0],
      duration: 2800,
      easing: 'easeInOutQuad'
    }, '-=300');

    // Build up glow while drawing
    timeline.add({
      targets: '#intro-logo',
      filter: [
        'drop-shadow(0 0 8px rgba(0, 102, 204, 0.3))',
        'drop-shadow(0 0 25px rgba(0, 102, 204, 0.5))',
        'drop-shadow(0 0 50px rgba(0, 102, 204, 0.8))',
        'drop-shadow(0 0 60px rgba(0, 102, 204, 1))'
      ],
      duration: 2800,
      easing: 'easeInOutQuad'
    }, '-=2800');
  }

  // Transition to fill (remove stroke, keep glow)
  timeline.add({
    targets: path,
    strokeWidth: [6, 0],
    fill: 'currentColor',
    duration: 200,
    easing: 'easeOutQuad'
  });

  // Pulse effect
  timeline.add({
    targets: '#intro-logo',
    scale: [1, 1.06],
    duration: 200,
    direction: 'alternate',
    easing: 'easeInOutSine',
    loop: 2
  });

  // Fade out
  timeline.add({
    targets: '.intro-logo-container',
    scale: [1, 0.92],
    opacity: [1, 0],
    duration: 150,
    easing: 'easeInOutQuad'
  })
  .add({
    targets: introOverlay,
    opacity: [1, 0],
    duration: 200,
    easing: 'easeInOutQuad',
    complete: () => finalizeIntro(introOverlay, header)
  }, '-=100');
}

// ============================================================================
// HEADER ANIMATION
// ============================================================================

function initHeaderAnimation() {
  const headerLogo = document.getElementById('header-logo');
  if (!headerLogo) return;

  anime({
    targets: headerLogo,
    scale: [1, 1.08, 1],
    opacity: [1, 0.9, 1],
    duration: 2800,
    easing: 'easeInOutSine',
    loop: true
  });
}

// ============================================================================
// DEMO PANEL
// ============================================================================

function initDemoPanel() {
  const demoPanel = document.getElementById('demo-panel');
  const demoToggle = document.getElementById('demo-toggle');

  if (!demoPanel || !demoToggle) return;

  const setExpanded = (isOpen) => {
    demoToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  demoPanel.classList.add('ready');
  setExpanded(false);

  demoToggle.addEventListener('click', () => {
    demoPanel.classList.toggle('open');
    const isOpen = demoPanel.classList.contains('open');
    setExpanded(isOpen);
  });
}

// ============================================================================
// SCROLL EFFECTS
// ============================================================================

function initScrollEffects() {
  const sections = document.querySelectorAll('.section');

  if (!sections.length) {
    return;
  }

  if (prefersReducedMotion.matches) {
    sections.forEach(section => section.classList.add('section--visible'));
    document.querySelectorAll('.feature').forEach(feature => {
      feature.style.opacity = '1';
      feature.style.transform = 'none';
    });
    return;
  }

  sections.forEach((section, index) => {
    if (index === 0) {
      section.classList.add('section--visible');
      return;
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => section.classList.add('section--visible'),
      onEnterBack: () => section.classList.add('section--visible'),
      onLeave: () => section.classList.remove('section--visible'),
      onLeaveBack: () => section.classList.remove('section--visible')
    });
  });

  gsap.utils.toArray('.feature').forEach((feature) => {
    gsap.fromTo(feature,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: feature,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

// ============================================================================
// SMOOTH SCROLL & MOBILE OPTIMIZATIONS
// ============================================================================

function initSmoothScroll() {
  if ('ontouchstart' in window) {
    document.body.style.overscrollBehavior = 'none';
  }
}

// ============================================================================
// DEMO BUTTON INTERACTIONS
// ============================================================================

function initDemoButtons() {
  const demoButtons = document.querySelectorAll('.demo-button, .demo-button-large');
  const pricingMessage = 'Professional £300/mo (setup waived for first 10 Belfast businesses). Premium £450/mo with unlimited AI and WhatsApp.';

  demoButtons.forEach(button => {
    const icon = button.querySelector('.demo-icon, .demo-icon-large');

    button.addEventListener('mouseenter', () => {
      if (!icon || prefersReducedMotion.matches) return;
      anime({
        targets: icon,
        scale: [1, 1.15, 1],
        duration: 400,
        easing: 'easeOutElastic(1, .6)'
      });
    });

    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.3)';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'scale(0)';

      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);

      anime({
        targets: ripple,
        scale: [0, 2.2],
        opacity: [0.5, 0],
        duration: 600,
        easing: 'easeOutQuad',
        complete: () => ripple.remove()
      });

      console.log('Flow Local demo button clicked:', button.textContent.trim());
    });
  });
}

// ============================================================================
// HERO CTA SCROLL
// ============================================================================

function initHeroCTA() {
  const tryDemoBtn = document.getElementById('try-demo-btn');

  if (!tryDemoBtn) return;

  tryDemoBtn.addEventListener('click', () => {
    const demoSection = document.querySelector('[data-section="5"]');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================

function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item');
      const isOpen = faqItem.classList.contains('open');

      // Close all other items
      document.querySelectorAll('.faq-item.open').forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove('open');
          item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        faqItem.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
      } else {
        faqItem.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ============================================================================
// COOKIE CONSENT
// ============================================================================

function initCookieConsent() {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const COOKIE_CONSENT_KEY = 'flow-local-cookie-consent';

  // Check if user has already made a choice
  const userConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

  if (userConsent === null) {
    // Show the banner if no prior decision
    setTimeout(() => {
      if (cookieBanner) {
        cookieBanner.style.display = 'block';
      }
    }, 2000); // Show after 2 seconds
  } else if (userConsent === 'accepted') {
    // Load tracking scripts if previously accepted
    loadAnalyticsScripts();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
      if (cookieBanner) {
        cookieBanner.style.display = 'none';
      }
      loadAnalyticsScripts();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
      if (cookieBanner) {
        cookieBanner.style.display = 'none';
      }
    });
  }
}

function loadAnalyticsScripts() {
  // Load Google Analytics
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-MHTNLMYV7K';
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-MHTNLMYV7K');

  // Load Meta Pixel
  const fbqScript = document.createElement('script');
  fbqScript.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3674064329567447');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(fbqScript);
}

// ============================================================================
// PRIVACY POLICY MODAL
// ============================================================================

function initPrivacyModal() {
  const privacyToggle = document.getElementById('privacy-toggle');
  const privacyModal = document.getElementById('privacy-modal');
  const privacyClose = document.getElementById('privacy-close');

  if (!privacyToggle || !privacyModal || !privacyClose) return;

  privacyToggle.addEventListener('click', (event) => {
    event.preventDefault();
    privacyModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  privacyClose.addEventListener('click', () => {
    privacyModal.style.display = 'none';
    document.body.style.overflow = '';
  });

  privacyModal.addEventListener('click', (event) => {
    if (event.target === privacyModal) {
      privacyModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}

// ============================================================================
// BOOKING MODAL
// ============================================================================

function initBookingModal() {
  const bookingModal = document.getElementById('booking-modal');
  const bookingClose = document.getElementById('booking-close');
  const heroBookCallLink = document.getElementById('hero-book-call-link');
  const pricingBookBtn = document.getElementById('pricing-book-btn');

  if (!bookingModal || !bookingClose) {
    console.warn('Booking modal or close button not found');
    return;
  }

  const openBookingModal = () => {
    bookingModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeBookingModal = () => {
    bookingModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Booking modal handlers
  if (heroBookCallLink) {
    heroBookCallLink.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  }

  if (pricingBookBtn) {
    pricingBookBtn.addEventListener('click', openBookingModal);
  }

  bookingClose.addEventListener('click', closeBookingModal);

  // Close when clicking outside the modal
  bookingModal.addEventListener('click', (event) => {
    if (event.target === bookingModal) {
      closeBookingModal();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (bookingModal.style.display !== 'none') {
        closeBookingModal();
      }
    }
  });
}

// ============================================================================
// RESPONSIVE HANDLING
// ============================================================================

function handleResize() {
  if (prefersReducedMotion.matches) return;

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
}

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

function initPerformanceOptimizations() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  if (prefersReducedMotion.matches) {
    document.documentElement.classList.add('reduce-motion');
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }

  console.log('🚀 Flow Local - Initializing...');

  initCookieConsent();
  initHeroCTA();
  initFAQ();
  initIntroSequence();
  initDemoPanel();
  initSmoothScroll();
  initDemoButtons();
  initPrivacyModal();
  initBookingModal();
  handleResize();
  initPerformanceOptimizations();

  if (prefersReducedMotion.matches) {
    // Ensure sections are visible if intro sequence short-circuited.
    initScrollEffects();
  }

  console.log('✅ Flow Local - Ready');
}

init();
