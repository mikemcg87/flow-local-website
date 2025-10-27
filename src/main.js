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

  if (!introOverlay) {
    finalizeIntro(null, header);
    return;
  }

  if (prefersReducedMotion.matches) {
    finalizeIntro(introOverlay, header);
    return;
  }

  anime.set('.intro-logo-container', { opacity: 0, scale: 0.85 });

  anime.timeline({ easing: 'easeOutQuad' })
    .add({
      targets: '.intro-logo-container',
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: 520
    })
    .add({
      targets: '#intro-logo',
      scale: [1, 1.06],
      duration: 320,
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: 2
    })
    .add({
      targets: '.intro-logo-container',
      scale: [1, 0.92],
      opacity: [1, 0],
      duration: 260,
      easing: 'easeInOutQuad'
    })
    .add({
      targets: introOverlay,
      opacity: [1, 0],
      duration: 360,
      easing: 'easeInOutQuad',
      complete: () => finalizeIntro(introOverlay, header)
    }, '-=200');
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
    const isVoiceButton = button.classList.contains('demo-voice');

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
      event.preventDefault();

      // Create ripple effect
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

      // Handle voice button clicks by triggering GHL widget
      if (isVoiceButton) {
        console.log('🎤 Triggering GHL WebVoice widget...');
        // Trigger the GHL widget if it's loaded
        if (window.ghlInit && typeof window.ghlInit === 'function') {
          window.ghlInit();
        } else if (window.ghlChat) {
          window.ghlChat.open();
        } else {
          console.log('GHL Widget not yet loaded, opening fallback...');
          // Fallback if widget hasn't loaded yet
          window.open('https://www.flow-local.com', '_blank');
        }
      } else {
        console.log('Flow Local demo button clicked:', button.textContent.trim());
        alert(`Flow Local demo via ${button.textContent.trim()}\n\n${pricingMessage}\n\n(Replace this alert with the live demo link.)`);
      }
    });
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

  initIntroSequence();
  initDemoPanel();
  initSmoothScroll();
  initDemoButtons();
  handleResize();
  initPerformanceOptimizations();

  if (prefersReducedMotion.matches) {
    // Ensure sections are visible if intro sequence short-circuited.
    initScrollEffects();
  }

  console.log('✅ Flow Local - Ready');
}

init();
