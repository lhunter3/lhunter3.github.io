/**
 * Count-up numbers when they enter the viewport.
 * Markup: <span data-count-to="22" data-count-suffix="+">0</span>
 */
export function initCounters() {
  const els = Array.from(document.querySelectorAll('[data-count-to]'));
  if (!els.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render = (el, value) => {
    el.textContent = `${value}${el.dataset.countSuffix || ''}`;
  };

  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => render(el, Number(el.dataset.countTo)));
    return;
  }

  const animate = (el) => {
    const target = Number(el.dataset.countTo);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      render(el, Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  els.forEach((el) => observer.observe(el));
}
