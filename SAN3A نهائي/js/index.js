/* SAN3A — Landing Page Animations */
(function() {
  'use strict';

  // ─── STATS COUNTER ──────────────────────────────────────────────
  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('ar-EG') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  let started = false;

  const statsSection = document.getElementById('stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        statNumbers.forEach(el => {
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix;
          animateCounter(el, target, suffix, 1800);
        });
      }
    }, { threshold: 0.4 });
    observer.observe(statsSection);
  }

  // ─── STATS REVEAL ───────────────────────────────────────────────
  const statItems = document.querySelectorAll('.stat-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), idx * 150);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    statItems.forEach(item => revealObserver.observe(item));
  } else {
    statItems.forEach(item => item.classList.add('visible'));
  }

})();