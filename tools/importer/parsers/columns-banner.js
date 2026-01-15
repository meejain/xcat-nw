/* global WebImporter */

/**
 * Parser for columns-banner block
 *
 * Source: https://www.nationwide.co.uk/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: [image column | content column with heading, text, list, CTA]
 *
 * Source HTML Pattern:
 * <section class="app-promo dark">
 *   <div class="image-col"><img src="app-screenshot.png"/></div>
 *   <div class="content-col">
 *     <h2>Introducing Call Checker</h2>
 *     <p>Description...</p>
 *     <ul><li>Feature 1</li>...</ul>
 *     <a href="/app">Download app</a>
 *   </div>
 * </section>
 *
 * Generated: 2026-01-15
 */
export default function parse(element, { document }) {
  // Find image column
  const imageEl = element.querySelector('img, picture img');

  // Find content elements
  const heading = element.querySelector('h2, h3, [class*="title"], [class*="heading"]');
  const paragraphs = Array.from(element.querySelectorAll('p'));
  const list = element.querySelector('ul, ol');
  const cta = element.querySelector('a[class*="cta"], a[class*="button"], a[href*="app"]');

  // Build columns
  const col1 = [];
  if (imageEl) {
    col1.push(imageEl.cloneNode(true));
  }

  const col2 = [];
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent;
    col2.push(h);
  }
  paragraphs.forEach(p => col2.push(p.cloneNode(true)));
  if (list) col2.push(list.cloneNode(true));
  if (cta) col2.push(cta.cloneNode(true));

  const cells = [[col1, col2]];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Banner', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
