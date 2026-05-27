/**
 * Header behaviour: condense-on-scroll, scroll-progress bar, active-section
 * highlighting, and the mobile menu toggle.
 */
export function initNav() {
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-scroll-progress]');
  const links = Array.from(document.querySelectorAll('[data-nav-link]'));
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.dataset.scrolled = String(y > 24);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.transform = `scaleX(${pct / 100})`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
    };
    menuToggle.addEventListener('click', () => {
      setOpen(mobileMenu.dataset.open !== 'true');
    });
    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => setOpen(false))
    );
  }
}
