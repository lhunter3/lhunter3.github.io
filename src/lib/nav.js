/**
 * Header behaviour: condense-on-scroll, scroll-progress bar, active-section
 * highlighting, and the mobile menu toggle. Scroll work is rAF-batched and
 * reads layout metrics only on resize to avoid per-frame reflow.
 */
export function initNav() {
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-scroll-progress]');
  const links = Array.from(document.querySelectorAll('[data-nav-link]'));
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  let maxScroll = 1;
  const measure = () => {
    maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  };
  measure();
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure);

  let raf = 0;
  const update = () => {
    raf = 0;
    const y = window.scrollY;
    if (header) header.dataset.scrolled = String(y > 24);
    if (progress) progress.style.transform = `scaleX(${Math.min(y / maxScroll, 1)})`;
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!raf) raf = requestAnimationFrame(update);
    },
    { passive: true }
  );

  // Active-section highlight
  const sections = links
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          links.forEach((l) =>
            l.setAttribute('data-active', String(l.getAttribute('href') === id))
          );
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // Mobile menu
  if (menuToggle && mobileMenu) {
    const setOpen = (open) => {
      mobileMenu.dataset.open = String(open);
      menuToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      measure();
    };
    menuToggle.addEventListener('click', () => {
      setOpen(mobileMenu.dataset.open !== 'true');
    });
    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => setOpen(false))
    );
  }
}
