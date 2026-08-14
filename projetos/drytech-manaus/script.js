(() => {
  const navbar = document.getElementById('navbar');
  const navLogoSlot = document.getElementById('navLogoSlot');
  const heroLogoSpacer = document.getElementById('heroLogoSpacer');
  const flyingLogo = document.getElementById('flyingLogo');
  const hero = document.getElementById('hero');
  const progressBar = document.getElementById('progressBar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let ticking = false;

  function updateLogoPosition() {
    const scrollY = window.scrollY || window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    const rawProgress = clamp(scrollY / (heroHeight * 0.62), 0, 1);
    const progress = easeInOutCubic(rawProgress);

    const liveHeroRect = heroLogoSpacer.getBoundingClientRect();
    const liveNavRect = navLogoSlot.getBoundingClientRect();

    const fromCenterX = liveHeroRect.left + liveHeroRect.width / 2;
    const fromCenterY = liveHeroRect.top + liveHeroRect.height / 2;
    const fromW = liveHeroRect.width;
    const fromH = liveHeroRect.height;

    const toCenterX = liveNavRect.left + liveNavRect.width / 2;
    const toCenterY = liveNavRect.top + liveNavRect.height / 2;
    const toW = liveNavRect.width;
    const toH = liveNavRect.height;

    const w = lerp(fromW, toW, progress);
    const h = lerp(fromH, toH, progress);
    const cx = lerp(fromCenterX, toCenterX, progress);
    const cy = lerp(fromCenterY, toCenterY, progress);
    const radius = lerp(14, 10, progress);

    flyingLogo.style.width = `${w}px`;
    flyingLogo.style.height = `${h}px`;
    flyingLogo.style.borderRadius = `${radius}px`;
    flyingLogo.style.transform = `translate3d(${cx - w / 2}px, ${cy - h / 2}px, 0)`;

    if (progress > 0.05) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateLogoPosition);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateLogoPosition);

  document.addEventListener('DOMContentLoaded', updateLogoPosition);
  window.addEventListener('load', () => {
    updateLogoPosition();
    setTimeout(() => flyingLogo.classList.add('entered'), 250);
  });

  /* ---------- scroll progress bar ---------- */
  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }
  window.addEventListener('scroll', updateProgressBar, { passive: true });

  /* ---------- mobile nav toggle ---------- */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
