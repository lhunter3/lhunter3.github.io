/**
 * Pointer-reactive tilt + glow for cards marked with [data-tilt].
 * A radial highlight follows the cursor via the --mx/--my custom properties.
 * Skipped entirely on touch devices and under reduced-motion.
 */
export function initTilt() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (reduce || !fine) return;

  const MAX = 6; // degrees

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    let raf = 0;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);

      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rx = (0.5 - py) * MAX * 2;
        const ry = (px - 0.5) * MAX * 2;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        raf = 0;
      });
    };

    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      card.style.transform = '';
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', reset);
  });
}
