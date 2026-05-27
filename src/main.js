import './style.css';
import { initReveal } from './lib/reveal.js';
import { initNav } from './lib/nav.js';
import { initCounters } from './lib/counters.js';
import { initTilt } from './lib/tilt.js';
import { initHeroBackground } from './lib/heroBackground.js';

function init() {
  initNav();
  initReveal();
  initCounters();
  initTilt();
  initHeroBackground();

  // Footer year
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
