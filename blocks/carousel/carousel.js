/**
 * Content model: a "Carousel" table. Each row = one slide/card:
 *   cell 1: client/label (small text)
 *   cell 2: heading
 *   cell 3: description
 *   cell 4+ (optional, in pairs): stat number, stat label - as many pairs as needed
 */
export default function decorate(block) {
  const slides = [...block.children];
  block.textContent = '';

  const trackWrap = document.createElement('div');
  trackWrap.className = 'carousel-track-wrap';
  const track = document.createElement('div');
  track.className = 'carousel-track';
  trackWrap.append(track);

  slides.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'carousel-card';

    const [clientCell, headingCell, descCell, ...statCells] = cells;
    if (clientCell) {
      const client = document.createElement('div');
      client.className = 'carousel-client';
      client.append(...clientCell.childNodes);
      card.append(client);
    }
    if (headingCell) {
      const heading = document.createElement('h3');
      heading.append(...headingCell.childNodes);
      card.append(heading);
    }
    if (descCell) {
      const desc = document.createElement('p');
      desc.className = 'carousel-desc';
      desc.append(...descCell.childNodes);
      card.append(desc);
    }
    if (statCells.length) {
      const result = document.createElement('div');
      result.className = 'carousel-result';
      for (let i = 0; i < statCells.length; i += 2) {
        const statWrap = document.createElement('div');
        const num = document.createElement('div');
        num.className = 'carousel-stat-num';
        num.append(...(statCells[i]?.childNodes || []));
        const lbl = document.createElement('div');
        lbl.className = 'carousel-stat-lbl';
        lbl.append(...(statCells[i + 1]?.childNodes || []));
        statWrap.append(num, lbl);
        result.append(statWrap);
      }
      card.append(result);
    }
    track.append(card);
  });

  // controls
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'carousel-btn carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.textContent = '←';
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'carousel-btn carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.textContent = '→';
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  controls.append(prevBtn, nextBtn, dots);

  block.append(trackWrap, controls);

  const cards = track.children;
  let index = 0;
  const maxIndex = cards.length - 1;

  [...cards].forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dots.append(dot);
  });

  function cardStep() {
    const card = cards[0];
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return card.getBoundingClientRect().width + gap;
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${index * cardStep()}px)`;
    [...dots.children].forEach((d, i) => d.classList.toggle('active', i === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === maxIndex;
  }

  function goTo(i) {
    index = Math.max(0, Math.min(maxIndex, i));
    updateCarousel();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}
