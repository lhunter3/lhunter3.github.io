/**
 * Subtle pointer parallax on the hero aurora blobs, plus a gentle
 * scroll-driven fade/rise on the hero content. Pure ambient polish —
 * disabled under reduced-motion.
 */
export function initHeroBackground() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const blobs = Array.from(hero.querySelectorAll('[data-parallax]'));
  const content = hero.querySelector('[data-hero-content]');

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
        blobs.forEach((b) => {
          const depth = Number(b.dataset.parallax) || 20;
          b.style.translate = `${tx * depth}px ${ty * depth}px`;
        });
        raf = 0;
      });
    });
  }

  // Scroll fade on hero content
  if (content) {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const p = Math.min(y / (vh * 0.8), 1);
      content.style.opacity = String(1 - p * 0.9);
      content.style.transform = `translateY(${p * 40}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}
