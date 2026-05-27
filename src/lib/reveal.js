/**
 * Reveal elements as they scroll into view.
 * Add class `reveal` to any element. Group a set with `data-reveal-group`
 * on a parent to stagger its direct `.reveal` children.
 */
export function initReveal() {
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (!items.length) return;

  // Stagger children inside any [data-reveal-group]
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const step = Number(group.dataset.revealGroup) || 90;
    group.querySelectorAll(':scope > .reveal').forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${i * step}ms`);
    });
  });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}
