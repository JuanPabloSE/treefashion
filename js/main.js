// =============================================
// CONFIG — centralized external URLs
// To update WhatsApp or Instagram, edit here.
// =============================================
const CONFIG = {
  whatsapp:  'https://wa.me/557591058887',
  instagram: 'https://www.instagram.com/treefashion16/',
};

// =============================================
// ROUTER — single handler for all links
// =============================================
document.addEventListener('click', function (e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;

  const action = el.dataset.action;

  if (action === 'whatsapp') {
    e.preventDefault();
    const msg = el.dataset.msg;
    const url = msg
      ? `${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`
      : CONFIG.whatsapp;
    openExternal(url);
    return;
  }

  if (action === 'instagram') {
    e.preventDefault();
    openExternal(CONFIG.instagram);
    return;
  }

  if (action === 'scroll') {
    e.preventDefault();
    scrollToSection(el.dataset.target);
    return;
  }
});

function openExternal(url) {
  window.open(url, '_blank', 'noopener noreferrer');
}

function scrollToSection(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  closeMobile();
}

// =============================================
// MOBILE MENU
// =============================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

mobileClose.addEventListener('click', closeMobile);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobile();
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// =============================================
// SCROLL REVEAL
// =============================================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// =============================================
// COUNTER ANIMATION
// =============================================
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObs.observe(el));

function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = Math.round(eased * target);

    el.textContent = isDecimal
      ? (value / 10).toFixed(1)
      : value >= 1000
        ? (value / 1000).toFixed(1) + 'k'
        : value + (el.dataset.suffix || '');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isDecimal
        ? (target / 10).toFixed(1)
        : target >= 1000 ? (target / 1000).toFixed(1) + 'k' : target;
    }
  }

  requestAnimationFrame(update);
}

// =============================================
// COUNTDOWN TIMER
// =============================================
(function () {
  const stored = sessionStorage.getItem('tfCountdown');
  const end    = stored ? parseInt(stored) : Date.now() + (8 * 3600 + 47 * 60 + 23) * 1000;
  if (!stored) sessionStorage.setItem('tfCountdown', end);

  function tick() {
    const diff = Math.max(0, end - Date.now());
    document.getElementById('cdHours').textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
    document.getElementById('cdMins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cdSecs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    if (diff > 0) setTimeout(tick, 1000);
  }

  tick();
})();

// =============================================
// FAVORITE BUTTONS (toggle)
// =============================================
document.querySelectorAll('.product-fav').forEach(btn => {
  btn.addEventListener('click', function () {
    const svg    = this.querySelector('svg');
    const active = this.dataset.active === '1';

    svg.style.fill         = active ? 'none'                    : '#DC2626';
    svg.style.stroke       = active ? 'currentColor'            : '#DC2626';
    this.dataset.active    = active ? '0'                       : '1';
    this.style.background  = active ? ''                        : 'rgba(220,38,38,.15)';
    this.style.borderColor = active ? ''                        : '#DC2626';
  });
});

// =============================================
// PREFERS REDUCED MOTION
// =============================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--trans', 'none');
  document.querySelectorAll('.hero-shirt-main, .hero-shirt-side').forEach(el => {
    el.style.animation = 'none';
  });
}
