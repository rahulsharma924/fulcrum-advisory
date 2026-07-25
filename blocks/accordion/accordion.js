/**
 * Content model: an "Accordion" table. Each row = one FAQ item:
 *   cell 1: question
 *   cell 2: answer
 * Built with real button/aria semantics so it's keyboard operable and
 * screen-reader friendly, not just a mouse-driven div.
 */
export default function decorate(block) {
  const rows = [...block.children];

  block.textContent = '';

  rows.forEach((row, i) => {
    const [qCell, aCell] = [...row.children];
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const headId = `accordion-head-${i}`;
    const bodyId = `accordion-body-${i}`;

    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'accordion-head';
    head.id = headId;
    head.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
    head.setAttribute('aria-controls', bodyId);
    head.innerHTML = `<span>${qCell?.innerHTML || ''}</span><span class="accordion-icon" aria-hidden="true">+</span>`;

    const body = document.createElement('div');
    body.className = 'accordion-body';
    body.id = bodyId;
    body.setAttribute('role', 'region');
    body.setAttribute('aria-labelledby', headId);
    body.innerHTML = aCell?.innerHTML || '';
    if (i === 0) item.classList.add('open');

    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      block.querySelectorAll('.accordion-item').forEach((el) => {
        el.classList.remove('open');
        el.querySelector('.accordion-head').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
      }
    });

    item.append(head, body);
    block.append(item);
  });
}
