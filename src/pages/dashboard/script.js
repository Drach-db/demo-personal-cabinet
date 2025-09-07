import '../../components/layout/layout.js';
import '../../components/navbar/navbar.js';
import '../../components/header/header.js';

const state = {
  activeSlide: 0,
};

function setupIndicators() {
  const cardsContainer = document.querySelector('.dash-cards');
  if (!cardsContainer) return;

  // Only on mobile layout
  if (window.innerWidth > 450) {
    const existing = document.querySelector('.dash-indicators');
    if (existing) existing.remove();
    return;
  }

  // Prevent duplicates
  const prev = document.querySelector('.dash-indicators');
  if (prev) prev.remove();

  const cards = cardsContainer.querySelectorAll('.dash-card');
  if (!cards.length) return;

  const indicators = document.createElement('div');
  indicators.className = 'dash-indicators';
  indicators.innerHTML = Array.from(cards).map((_, i) => `
    <button class="indicator ${i === state.activeSlide ? 'active' : ''}" data-idx="${i}"></button>
  `).join('');
  cardsContainer.insertAdjacentElement('afterend', indicators);

  indicators.addEventListener('click', (e) => {
    const btn = e.target.closest('.indicator');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    scrollToSlide(idx);
  });

  // Sync on scroll
  cardsContainer.addEventListener('scroll', () => {
    const cardWidth = cards[0].offsetWidth; // 280px on mobile
    const gap = 12; // 0.75rem
    const idx = Math.round(cardsContainer.scrollLeft / (cardWidth + gap));
    if (idx !== state.activeSlide) {
      state.activeSlide = Math.max(0, Math.min(cards.length - 1, idx));
      document.querySelectorAll('.dash-indicators .indicator').forEach((el, i) => {
        el.classList.toggle('active', i === state.activeSlide);
      });
    }
  }, { passive: true });
}

function scrollToSlide(index) {
  const cardsContainer = document.querySelector('.dash-cards');
  const cards = cardsContainer?.querySelectorAll('.dash-card');
  if (!cardsContainer || !cards || !cards.length) return;
  const cardWidth = cards[0].offsetWidth; // 280 on mobile
  const gap = 12;
  cardsContainer.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
  state.activeSlide = index;
  document.querySelectorAll('.dash-indicators .indicator').forEach((el, i) => {
    el.classList.toggle('active', i === state.activeSlide);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupIndicators();
  window.addEventListener('resize', () => {
    setupIndicators();
  });
});
