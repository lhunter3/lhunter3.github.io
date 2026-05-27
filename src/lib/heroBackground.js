/**
 * Pointer parallax on the hero glows + a scroll-driven fade/rise on the hero
 * content. Both are rAF-batched, and the scroll fade only runs while the hero
 * is on screen. Disabled under reduced-motion.
 */
export function initHeroBackground() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const blobs = Array.from(hero.querySelectorAll('[data-parallax]'));
  const content = hero.querySelector('[data-hero-content]');

  let heroVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    ).observe(hero);
  }

  // Pointer parallax (fine pointers only)
  if (window.matchMedia('(pointer: fine)').matches && blobs.length) {
    let raf = 0;
    let tx = 0;
    let ty = 0;
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width - 0.5;
      ty = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        for (const b of blobs) {
          const depth = Number(b.dataset.parallax) || 20;
          b.style.translate = `${tx * depth}px ${ty * depth}px`;
        }
        raf = 0;
      });
    });
  }

  // Scroll fade on hero content (only while hero is visible)
  if (content) {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!heroVisible) return;
      const p = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      content.style.opacity = String(1 - p * 0.9);
      content.style.transform = `translateY(${p * 36}px)`;
    };
    update();
    window.addEventListener(
      'scroll',
      () => {
        if (!raf) raf = requestAnimationFrame(update);
      },
      { passive: true }
    );
  }
}
