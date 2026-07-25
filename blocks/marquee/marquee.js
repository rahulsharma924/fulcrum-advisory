/**
 * Content model: a "Marquee" table, one client/name per row (single column).
 * The block duplicates the list once so the CSS animation can loop seamlessly.
 */
export default function decorate(block) {
  const items = [...block.children].map((row) => row.textContent.trim());

  block.textContent = '';

  const track = document.createElement('div');
  track.className = 'marquee-track';

  // duplicate the list so the -50% translateX loop in CSS is seamless
  [...items, ...items].forEach((text) => {
    const span = document.createElement('span');
    span.textContent = text;
    track.append(span);
  });

  block.append(track);
}
