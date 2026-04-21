// ============================================================
//  AISB CCA Department — Main JS
//  "Once a Vampire, Always a Vampire"
// ============================================================

// ============================================================
//  PAGE TRANSITION OVERLAY
//  Green sweep: starts covering the page on load, slides off.
//  On internal link click: slides in, then navigates.
// ============================================================

(function () {
  'use strict';

  // Create overlay element
  var overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(overlay, document.body.firstChild);

  // Start visible (covering page), then slide up off-screen
  overlay.style.transform = 'translateY(0)';
  overlay.style.transition = 'none';

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.style.transition = 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)';
      overlay.style.transform = 'translateY(-100%)';
    });
  });

  // Intercept internal link clicks
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    // Skip: anchors, external, new-tab, non-HTML
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || link.target === '_blank') return;

    e.preventDefault();
    var dest = link.href;

    overlay.style.transition = 'transform 0.32s cubic-bezier(0.76, 0, 0.24, 1)';
    overlay.style.transform = 'translateY(0)';

    setTimeout(function () {
      window.location.href = dest;
    }, 340);
  });

})();

// ============================================================
//  NAVIGATION — scroll state, smart hide/show, hamburger
// ============================================================

(function () {
  'use strict';

  var nav       = document.getElementById('site-nav');
  var hamburger = document.getElementById('nav-hamburger');
  var navLinks  = document.getElementById('nav-links');

  if (!nav) return;

  var hasHero    = !!document.querySelector('.hero');
  var lastScrollY = window.scrollY;
  var ticking     = false;

  function updateNavState () {
    if (!hasHero) {
      nav.classList.add('scrolled');
      return;
    }
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else if (!nav.classList.contains('nav--open')) {
      nav.classList.remove('scrolled');
    }
  }

  // Smart hide on scroll-down, reveal on scroll-up
  function handleScroll () {
    if (!ticking) {
      requestAnimationFrame(function () {
        var currentY = window.scrollY;

        if (!nav.classList.contains('nav--open')) {
          if (currentY > lastScrollY && currentY > 120) {
            nav.classList.add('nav--hidden');
          } else {
            nav.classList.remove('nav--hidden');
          }
        }

        lastScrollY = currentY;
        updateNavState();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  updateNavState();

  // Hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('nav--open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      nav.classList.remove('nav--hidden'); // always show when opening
      if (isOpen) {
        nav.classList.add('scrolled');
      } else {
        updateNavState();
      }
    });

    // Close drawer on link click
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        updateNavState();
      });
    });

    // Close drawer on outside click
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('nav--open') && !nav.contains(e.target)) {
        nav.classList.remove('nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        updateNavState();
      }
    });
  }

  // Active link highlighting
  var page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.nav__link[data-page="' + page + '"]').forEach(function (el) {
      el.classList.add('nav__link--active');
      el.setAttribute('aria-current', 'page');
    });
  }

})();

// ============================================================
//  HERO — floating bats + headline word-split spring animation
// ============================================================

(function () {
  'use strict';

  // Inject floating bats into hero
  var hero = document.querySelector('.hero');
  if (hero) {
    var batConfig = [
      { top: '18%', duration: '22s', delay: '0s'  },
      { top: '44%', duration: '29s', delay: '5s'  },
      { top: '28%', duration: '18s', delay: '10s' },
      { top: '62%', duration: '26s', delay: '15s' },
    ];

    batConfig.forEach(function (cfg) {
      var bat = document.createElement('div');
      bat.className = 'hero__bat';
      bat.style.cssText =
        'top:' + cfg.top + ';' +
        '--bat-duration:' + cfg.duration + ';' +
        '--bat-delay:' + cfg.delay + ';';
      // Insert before hero__content so z-index stacking is correct
      var content = hero.querySelector('.hero__content');
      hero.insertBefore(bat, content || null);
    });
  }

  // Split hero headline into word spans for spring entrance
  var headline = document.querySelector('.hero__headline');
  if (headline) {
    var raw = headline.textContent.trim();
    var words = raw.split(/\s+/);

    // Remove hero-anim from headline (words animate individually)
    headline.classList.remove('hero-anim');
    headline.style.removeProperty('--delay');
    headline.style.opacity = '1';
    headline.style.transform = 'none';

    headline.innerHTML = words.map(function (word, i) {
      return '<span class="hero__word" style="--wi:' + i + '">' + word + '</span>';
    }).join('\u00a0'); // non-breaking space between words
  }

})();

// ============================================================
//  SCROLL REVEAL — IntersectionObserver
//  Elements in viewport on load are made visible immediately.
// ============================================================

(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });

})();

// ============================================================
//  FAQ ACCORDION
// ============================================================

(function () {
  'use strict';

  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq__item');
      var isOpen = item.classList.contains('is-open');

      // Close all
      document.querySelectorAll('.faq__item').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
