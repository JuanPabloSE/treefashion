// =============================================
// CONFIG — URLs externas centralizadas
// =============================================
const EXTERNAL_LINKS = {
  whatsapp: 'https://wa.me/55',
  instagram: 'https://www.instagram.com/treefashion16/',
};

// =============================================
// LINKS EXTERNOS — WhatsApp e Instagram
// Abre sempre em nova aba, sem vazar referrer
// =============================================
function openExternal(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

document.querySelectorAll('[data-action]').forEach(el => {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const action = this.dataset.action;
    if (EXTERNAL_LINKS[action]) {
      openExternal(EXTERNAL_LINKS[action]);
    }
  });
});

// =============================================
// MOBILE MENU
// =============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});
mobileClose.addEventListener('click', closeMobile);

function closeMobile() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobile();
  }
});

// =============================================
// SCROLL REVEAL
// =============================================
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// =============================================
// COUNTER ANIMATION
// =============================================
const counterEls = document.querySelectorAll('[data-target]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    if (isDecimal) {
      el.textContent = (value / 10).toFixed(1);
    } else {
      el.textContent = value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value + (el.dataset.suffix || '');
    }
    if (progress < 1) requestAnimationFrame(update);
    else {
      if (isDecimal) el.textContent = (target / 10).toFixed(1);
      else el.textContent = target >= 1000 ? (target / 1000).toFixed(1) + 'k' : target;
    }
  }
  requestAnimationFrame(update);
}

// =============================================
// COUNTDOWN TIMER
// =============================================
(function() {
  const stored = sessionStorage.getItem('tfCountdown');
  const end = stored ? parseInt(stored) : Date.now() + (8 * 3600 + 47 * 60 + 23) * 1000;
  if (!stored) sessionStorage.setItem('tfCountdown', end);

  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
    if (diff > 0) setTimeout(tick, 1000);
  }
  tick();
})();

// =============================================
// NEWSLETTER FORM
// =============================================
function handleSubscribe(e) {
  e.preventDefault();
  const input = document.getElementById('emailInput');
  const btn = e.target.querySelector('button[type="submit"]');
  if (!input.value || !input.value.includes('@')) {
    input.style.borderColor = '#DC2626';
    input.focus();
    return;
  }
  input.style.borderColor = '';
  btn.textContent = '✓ Enviado!';
  btn.style.background = 'var(--green)';
  btn.style.color = '#fff';
  btn.disabled = true;
  input.value = '';
}

// =============================================
// FAVORITE BUTTONS (toggle)
// =============================================
document.querySelectorAll('.product-fav').forEach(btn => {
  btn.addEventListener('click', function() {
    const svg = this.querySelector('svg');
    const active = this.dataset.active === '1';
    if (!active) {
      svg.style.fill = '#DC2626';
      svg.style.stroke = '#DC2626';
      this.dataset.active = '1';
      this.style.background = 'rgba(220,38,38,.15)';
      this.style.borderColor = '#DC2626';
    } else {
      svg.style.fill = 'none';
      svg.style.stroke = 'currentColor';
      this.dataset.active = '0';
      this.style.background = '';
      this.style.borderColor = '';
    }
  });
});

// =============================================
// PREFERS REDUCED MOTION
// =============================================
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) {
  document.documentElement.style.setProperty('--trans', 'none');
  document.querySelectorAll('.hero-shirt-main, .hero-shirt-side').forEach(el => {
    el.style.animation = 'none';
  });
}
