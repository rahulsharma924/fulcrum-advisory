/**
 * Content model: a "Testimonial" table. Each row = one quote:
 *   cell 1: quote text
 *   cell 2: attribution (name, title)
 * Rotates automatically every 5s; pauses if the user prefers reduced motion.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const quotes = rows.map((row) => {
    const [quoteCell, attrCell] = [...row.children];
    return { quoteHTML: quoteCell?.innerHTML || '', attrHTML: attrCell?.innerHTML || '' };
  });

  block.textContent = '';

  const box = document.createElement('div');
  box.className = 'testimonial-box';

  quotes.forEach((q, i) => {
    const p = document.createElement('p');
    p.className = `testimonial-quote${i === 0 ? ' active' : ''}`;
    p.innerHTML = `${q.quoteHTML}<span class="testimonial-attr">${q.attrHTML}</span>`;
    box.append(p);
  });

  const dots = document.createElement('div');
  dots.className = 'testimonial-dots';

  const items = box.querySelectorAll('.testimonial-quote');
  let current = 0;
  let timer;

  function show(i) {
    items.forEach((el, idx) => el.classList.toggle('active', idx === i));
    [...dots.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
    current = i;
  }

  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    dot.addEventListener('click', () => {
      show(i);
      resetTimer();
    });
    dots.append(dot);
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resetTimer() {
    if (prefersReducedMotion || items.length < 2) return;
    clearInterval(timer);
    timer = setInterval(() => show((current + 1) % items.length), 5000);
  }

  block.append(box, dots);
  resetTimer();
}
