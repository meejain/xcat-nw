/* global WebImporter */

/**
 * Parser for cards-icon block
 *
 * Source: https://www.nationwide.co.uk/
 * Base Block: cards
 *
 * Block Structure:
 * - Row N: [icon image | link text] (one row per card)
 *
 * Source HTML Pattern:
 * <ul class="product-links">
 *   <li><a href="/current-accounts"><img src="icon.svg"/><span>Current accounts</span></a></li>
 *   ...
 * </ul>
 *
 * Generated: 2026-01-15
 */
export default function parse(element, { document }) {
  // Find all icon link items
  const items = Array.from(element.querySelectorAll('li, [class*="product-link"], [class*="nav-item"]'));

  const cells = [];

  items.forEach(item => {
    const icon = item.querySelector('img, svg, [class*="icon"]');
    const link = item.querySelector('a');
    const text = item.querySelector('span, p, [class*="label"]') || (link ? link : null);

    if (icon || link) {
      const row = [];

      // Column 1: Icon image
      if (icon) {
        row.push(icon.cloneNode(true));
      } else {
        row.push('');
      }

      // Column 2: Link with text
      if (link) {
        const linkClone = link.cloneNode(true);
        // Clean link text if needed
        if (linkClone.querySelector('img')) {
          linkClone.querySelector('img').remove();
        }
        row.push(linkClone);
      } else if (text) {
        row.push(text.cloneNode(true));
      }

      cells.push(row);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Icon', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
