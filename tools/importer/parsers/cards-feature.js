/* global WebImporter */

/**
 * Parser for cards-feature block
 *
 * Source: https://www.nationwide.co.uk/
 * Base Block: cards
 *
 * Block Structure:
 * - Row N: [feature image | heading + paragraphs + link] (one row per card)
 *
 * Source HTML Pattern:
 * <div class="feature-cards">
 *   <div class="card">
 *     <img src="feature.png"/>
 *     <h3>Feature Title</h3>
 *     <p>Description...</p>
 *     <a href="/link">Learn more</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-15
 */
export default function parse(element, { document }) {
  // Find all card items
  const cards = Array.from(element.querySelectorAll('[class*="card"], [class*="feature"], article, li'));

  const cells = [];

  cards.forEach(card => {
    const image = card.querySelector('img, picture img');
    const heading = card.querySelector('h2, h3, h4, [class*="title"], [class*="heading"]');
    const paragraphs = Array.from(card.querySelectorAll('p:not([class*="link"])'));
    const link = card.querySelector('a[href]:not([class*="image"])');

    if (image || heading) {
      // Column 1: Feature image
      const col1 = [];
      if (image) {
        col1.push(image.cloneNode(true));
      }

      // Column 2: Content (heading, paragraphs, link)
      const col2 = [];
      if (heading) {
        const h = document.createElement('strong');
        h.textContent = heading.textContent;
        col2.push(h);
      }
      paragraphs.forEach(p => col2.push(p.cloneNode(true)));
      if (link) col2.push(link.cloneNode(true));

      cells.push([col1, col2]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Feature', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
