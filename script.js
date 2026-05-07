/* ============================================================
   OMKAR Deshmukh PORTFOLIO — MAIN JAVASCRIPT
   Handles: Loading, Theme, Nav, Scroll, Animations, Modal
   ============================================================ */

/* ---- 1. LOADING SCREEN ---- */
function hideLoader() {
  const loader = document.getElementById('loading-screen');
  if (!loader || loader.classList.contains('hide')) return;
  setTimeout(() => loader.classList.add('hide'), 2200);
}
// Fires normally when all resources load (online)
window.addEventListener('load', hideLoader);
// Guaranteed fallback after 3s — handles local file:// and slow/blocked fonts
setTimeout(hideLoader, 3000);

/* ---- 2. DARK / LIGHT MODE TOGGLE ---- */
const THEME_KEY = 'ayush-portfolio-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const icon = document.getElementById('theme-icon');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
    if (icon) icon.textContent = '☀️';
  } else {
    document.body.classList.remove('light-mode');
    if (icon) icon.textContent = '🌙';
  }
}

function toggleTheme() {
  const icon = document.getElementById('theme-icon');
  if (document.body.classList.toggle('light-mode')) {
    localStorage.setItem(THEME_KEY, 'light');
    if (icon) icon.textContent = '☀️';
  } else {
    localStorage.setItem(THEME_KEY, 'dark');
    if (icon) icon.textContent = '🌙';
  }
}

// Also sync mobile toggle
function toggleThemeMobile() { toggleTheme(); }

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  /* ---- 3. HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ---- 4. ACTIVE NAV LINK ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- 5. SCROLL PROGRESS BAR ---- */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ---- 6. REVEAL ON SCROLL (IntersectionObserver) ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Also trigger skill bars
          const bar = entry.target.querySelector('.skill-bar');
          if (bar) bar.style.transformOrigin = 'left';
          // Remove observer after reveal (one-shot)
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- 7. SKILL BAR WIDTHS ---- */
  // Applied via CSS custom property set in HTML, handled by IntersectionObserver above
  // The bars animate via CSS when .visible is added to parent .skill-card

  /* ---- 8. CERTIFICATE MODAL ---- */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalEmoji = document.getElementById('modal-emoji');
  const modalCertName = document.getElementById('modal-cert-name');
  const modalCertIssuer = document.getElementById('modal-cert-issuer');

  function openModal(name, issuer, emoji) {
    if (!modalOverlay) return;
    if (modalEmoji) modalEmoji.textContent = emoji;
    if (modalCertName) modalCertName.textContent = name;
    if (modalCertIssuer) modalCertIssuer.textContent = 'Issued by: ' + issuer;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Expose globally for inline onclick
  window.openCertModal = openModal;
  window.closeCertModal = closeModal;

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---- 9. CONTACT FORM ---- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate form submission
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'SENDING...';
        btn.disabled = true;
      }
      setTimeout(() => {
        if (formSuccess) formSuccess.style.display = 'block';
        contactForm.reset();
        if (btn) {
          btn.textContent = 'SEND MESSAGE';
          btn.disabled = false;
        }
        setTimeout(() => {
          if (formSuccess) formSuccess.style.display = 'none';
        }, 4000);
      }, 1500);
    });
  }

  /* ---- 10. COUNTER ANIMATION (Home stats) ---- */
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const update = () => {
      start += step;
      if (start < target) {
        el.textContent = Math.floor(start) + (el.dataset.suffix || '');
        requestAnimationFrame(update);
      } else {
        el.textContent = target + (el.dataset.suffix || '');
      }
    };
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.target));
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---- 11. CURSOR GLOW EFFECT (Desktop) ---- */
  if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.id = 'cursor-glow';
    cursor.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9998;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: transform 0.05s linear;
      top: -999px; left: -999px;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }
});

/* ---- 12. PARTICLES BACKGROUND (canvas, home page) ---- */
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  const resizeObserver = new ResizeObserver(() => {
    resize();
    createParticles();
  });
  resizeObserver.observe(canvas);
}

// Auto-init particles on home page
document.addEventListener('DOMContentLoaded', () => {
  initParticles('particles-canvas');
});
