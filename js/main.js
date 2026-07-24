/**
 * Marnus de Beer - Portfolio JavaScript
 * Handles particles, scroll animations, mobile nav, and interactions
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    revealThreshold: 0.1,
    skillBarThreshold: 0.5,
    navOffset: 200,
    statCountDuration: 2000
  };

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const elements = {
    navToggle: document.querySelector('.nav-toggle'),
    navLinks: document.querySelector('.nav-links'),
    navLinksItems: document.querySelectorAll('.nav-links a'),
    revealElements: document.querySelectorAll('.reveal'),
    skillBars: document.querySelectorAll('.skill-bar-fill'),
    statNumbers: document.querySelectorAll('.stat-number'),
    sections: document.querySelectorAll('section[id]')
  };

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  function initMobileNav() {
    if (!elements.navToggle || !elements.navLinks) return;

    elements.navToggle.addEventListener('click', () => {
      const isExpanded = elements.navToggle.getAttribute('aria-expanded') === 'true';
      elements.navToggle.setAttribute('aria-expanded', !isExpanded);
      elements.navLinks.classList.toggle('open');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu when clicking a link
    elements.navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        elements.navToggle.setAttribute('aria-expanded', 'false');
        elements.navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  function initScrollReveal() {
    if (!elements.revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { 
      threshold: CONFIG.revealThreshold,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // SKILL BAR ANIMATIONS
  // ============================================
  function initSkillBars() {
    if (!elements.skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width');
          if (width) {
            entry.target.style.width = width + '%';
          }
        }
      });
    }, { threshold: CONFIG.skillBarThreshold });

    elements.skillBars.forEach(bar => observer.observe(bar));
  }

  // ============================================
  // STAT NUMBER COUNTER ANIMATION
  // ============================================
  function initStatCounters() {
    if (!elements.statNumbers.length) return;

    const animateCounter = (el, target, suffix = '', duration = CONFIG.statCountDuration) => {
      const startTime = performance.now();
      const isDecimal = target % 1 !== 0;

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;

        if (isDecimal) {
          el.textContent = current.toFixed(2) + suffix;
        } else {
          el.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';

          const target = parseFloat(entry.target.getAttribute('data-count'));
          const suffix = entry.target.getAttribute('data-suffix') || '';

          if (!isNaN(target)) {
            animateCounter(entry.target, target, suffix);
          }
        }
      });
    }, { threshold: 0.5 });

    elements.statNumbers.forEach(stat => observer.observe(stat));
  }

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  function initActiveNav() {
    if (!elements.sections.length || !elements.navLinksItems.length) return;

    let ticking = false;

    const updateActiveNav = () => {
      const scrollY = window.scrollY + CONFIG.navOffset;
      let current = '';

      elements.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      elements.navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveNav);
        ticking = true;
      }
    });

    // Initial call
    updateActiveNav();
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // KEYBOARD NAVIGATION SUPPORT
  // ============================================
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Escape closes mobile menu
      if (e.key === 'Escape' && elements.navLinks?.classList.contains('open')) {
        elements.navToggle.setAttribute('aria-expanded', 'false');
        elements.navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  function init() {
    initMobileNav();
    initScrollReveal();
    initSkillBars();
    initStatCounters();
    initActiveNav();
    initSmoothScroll();
    initKeyboardNav();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
