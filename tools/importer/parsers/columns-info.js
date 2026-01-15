/* global WebImporter */

/**
 * Parser for columns-info block
 *
 * Source: https://www.nationwide.co.uk/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: [left column content | right column content]
 *
 * Source HTML Pattern:
 * <div class="two-column">
 *   <div class="col">
 *     <h3>Column 1 Title</h3>
 *     <p>Content...</p>
 *     <img src="chart.png"/>
 *     <a href="/link">Link</a>
 *   </div>
 *   <div class="col">
 *     <h3>Column 2 Title</h3>
 *     <p>Content...</p>
 *     <img src="chart.png"/>
 *     <a href="/link">Link</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-15
 */
export default function parse(element, { document }) {
  // Find column containers - look for direct child divs
  const columns = Array.from(element.querySelectorAll(':scope > div, :scope > section, [class*="col"]'));

  // If no explicit columns, try to split content
  if (columns.length < 2) {
    // Fallback: treat entire element as single-column content
    const content = [];
    const allContent = element.querySelectorAll('h2, h3, h4, p, img, ul, ol, a[class*="button"]');
    allContent.forEach(el => content.push(el.cloneNode(true)));

    const cells = [[content]];
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Info', cells });
    element.replaceWith(block);
    return;
  }

  // Build column content arrays
  const col1 = [];
  const col2 = [];

  // Process first column
  const firstCol = columns[0];
  if (firstCol) {
    const heading1 = firstCol.querySelector('h2, h3, h4, [class*="title"]');
    const paragraphs1 = Array.from(firstCol.querySelectorAll('p'));
    const image1 = firstCol.querySelector('img');
    const links1 = Array.from(firstCol.querySelectorAll('a'));
    const lists1 = Array.from(firstCol.querySelectorAll('ul, ol'));

    if (heading1) {
      const h = document.createElement('h3');
      h.textContent = heading1.textContent;
      col1.push(h);
    }
    if (image1) col1.push(image1.cloneNode(true));
    paragraphs1.forEach(p => col1.push(p.cloneNode(true)));
    lists1.forEach(l => col1.push(l.cloneNode(true)));
    links1.forEach(link => col1.push(link.cloneNode(true)));
  }

  // Process second column
  const secondCol = columns[1];
  if (secondCol) {
    const heading2 = secondCol.querySelector('h2, h3, h4, [class*="title"]');
    const paragraphs2 = Array.from(secondCol.querySelectorAll('p'));
    const image2 = secondCol.querySelector('img');
    const links2 = Array.from(secondCol.querySelectorAll('a'));
    const lists2 = Array.from(secondCol.querySelectorAll('ul, ol'));

    if (heading2) {
      const h = document.createElement('h3');
      h.textContent = heading2.textContent;
      col2.push(h);
    }
    if (image2) col2.push(image2.cloneNode(true));
    paragraphs2.forEach(p => col2.push(p.cloneNode(true)));
    lists2.forEach(l => col2.push(l.cloneNode(true)));
    links2.forEach(link => col2.push(link.cloneNode(true)));
  }

  const cells = [[col1, col2]];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Info', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
