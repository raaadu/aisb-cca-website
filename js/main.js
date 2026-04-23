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
//  HERO — vampire atmosphere + headline word-split spring animation
// ============================================================

(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (hero) {
    var content = hero.querySelector('.hero__content');

    // --- Floating bats (varied sizes) ---
    var batConfig = [
      { top: '16%', duration: '22s', delay: '0s',   size: ''   },
      { top: '44%', duration: '31s', delay: '5s',   size: 'lg' },
      { top: '29%', duration: '18s', delay: '10s',  size: 'sm' },
      { top: '63%', duration: '27s', delay: '15s',  size: ''   },
      { top: '38%', duration: '36s', delay: '7s',   size: 'sm' },
      { top: '72%', duration: '23s', delay: '3s',   size: 'lg' },
      { top: '55%', duration: '19s', delay: '18s',  size: 'sm' },
    ];

    batConfig.forEach(function (cfg) {
      var bat = document.createElement('div');
      bat.className = 'hero__bat' + (cfg.size ? ' hero__bat--' + cfg.size : '');
      bat.style.cssText =
        'top:' + cfg.top + ';' +
        '--bat-duration:' + cfg.duration + ';' +
        '--bat-delay:' + cfg.delay + ';';
      hero.insertBefore(bat, content || null);
    });

    // --- Blood drips from the top ---
    var dripConfig = [
      { left: '6%',  height: '36px', width: '4px', duration: '5.5s', delay: '0s'   },
      { left: '18%', height: '54px', width: '3px', duration: '4.2s', delay: '1.7s' },
      { left: '34%', height: '28px', width: '5px', duration: '6.1s', delay: '0.5s' },
      { left: '52%', height: '46px', width: '3px', duration: '4.8s', delay: '3.1s' },
      { left: '69%', height: '22px', width: '4px', duration: '5.8s', delay: '1.1s' },
      { left: '82%', height: '40px', width: '3px', duration: '4.4s', delay: '2.5s' },
      { left: '93%', height: '32px', width: '4px', duration: '5.2s', delay: '4.0s' },
    ];

    dripConfig.forEach(function (cfg) {
      var drip = document.createElement('div');
      drip.className = 'hero__blood-drip';
      drip.style.cssText =
        'left:' + cfg.left + ';' +
        'height:' + cfg.height + ';' +
        'width:' + cfg.width + ';' +
        '--drip-duration:' + cfg.duration + ';' +
        '--drip-delay:' + cfg.delay + ';';
      hero.insertBefore(drip, content || null);
    });

    // --- Lightning flash overlay ---
    var lightning = document.createElement('div');
    lightning.className = 'hero__lightning';
    hero.insertBefore(lightning, content || null);
  }

  // Split hero headline into word spans for spring entrance, preserving <br> line breaks
  var headline = document.querySelector('.hero__headline');
  if (headline) {
    // Remove hero-anim (words animate individually)
    headline.classList.remove('hero-anim');
    headline.style.removeProperty('--delay');
    headline.style.opacity = '1';
    headline.style.transform = 'none';

    var rawHtml = headline.innerHTML.trim();
    var lines = rawHtml.split(/<br\s*\/?>/i);
    var wordIndex = 0;

    var processedLines = lines.map(function (line) {
      var words = line.trim().split(/\s+/).filter(Boolean);
      var spans = words.map(function (word) {
        return '<span class="hero__word" style="--wi:' + (wordIndex++) + '">' + word + '</span>';
      });
      return spans.join('\u00a0');
    });

    headline.innerHTML = processedLines.join('<br>');
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
