import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Content model (authored as a table in the doc):
 * Row 1 (optional): plain text eyebrow label, e.g. "Operations & Manufacturing Advisory"
 * Row 2: image
 * Row 3: heading + body paragraph + CTA links
 *   - a link wrapped in bold -> primary button (handled globally by decorateButtons)
 *   - a link wrapped in italic -> secondary button (handled globally by decorateButtons)
 */
export default function decorate(block) {
  const rows = [...block.children];

  // detect an eyebrow row: a row whose only content is plain text (no image, no heading)
  let eyebrowText = null;
  if (rows.length > 1) {
    const firstRow = rows[0];
    const hasImage = firstRow.querySelector('img');
    const hasHeading = firstRow.querySelector('h1, h2, h3');
    const text = firstRow.textContent.trim();
    if (!hasImage && !hasHeading && text.length > 0 && text.length < 80) {
      eyebrowText = text;
      firstRow.remove();
    }
  }

  // optimize the hero image, and mark the block so CSS knows a photo is present
  const hasImage = block.querySelector('picture > img');
  if (hasImage) {
    block.classList.add('has-image');
  }
  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, true, [{ width: '1600' }]),
    );
  });

  // build the visual mesh background (pure decoration, no content dependency)
  const mesh = document.createElement('div');
  mesh.className = 'hero-mesh';
  block.prepend(mesh);

  // wrap remaining textual content for layout control
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-content';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero-eyebrow';
    eyebrow.textContent = eyebrowText;
    contentWrapper.append(eyebrow);
  }

  [...block.children].forEach((child) => {
    if (child === mesh) return;
    if (child.querySelector('picture')) {
      child.classList.add('hero-media');
      return;
    }
    contentWrapper.append(child);
  });

  block.append(contentWrapper);
}
