/* global WebImporter */

/**
 * Parser for hero-promo block
 *
 * Source: https://www.nationwide.co.uk/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Content (heading, paragraph, CTA, badge images)
 *
 * Source HTML Pattern:
 * <section class="hero-section">
 *   <h1>Gain 175 pounds <em>this January</em></h1>
 *   <p>Switch your current account...</p>
 *   <a href="/switch">Get £175 when you switch</a>
 *   <img src="which-badge.png" alt="Which? Banking Brand of the Year"/>
 *   <img src="switch-guarantee.png" alt="Switch guarantee"/>
 * </section>
 *
 * Generated: 2026-01-15
 */
export default function parse(element, { document }) {
  // Extract heading - look for h1 or h2 with emphasis
  const heading = element.querySelector('h1, h2, [class*="heading"], [class*="title"]');

  // Extract description paragraph
  const description = element.querySelector('p:not([class*="link"]), [class*="description"], [class*="subtitle"]');

  // Extract CTA button/link
  const ctaLinks = Array.from(element.querySelectorAll('a[class*="cta"], a[class*="button"], a[href*="switch"]'));

  // Extract badge/award images
  const badges = Array.from(element.querySelectorAll('img[alt*="Which"], img[alt*="Brand"], img[alt*="guarantee"], img[alt*="Switch"]'));

  // Build cells array - single content row
  const contentCell = [];

  if (heading) contentCell.push(heading.cloneNode(true));
  if (description) contentCell.push(description.cloneNode(true));
  ctaLinks.forEach(cta => contentCell.push(cta.cloneNode(true)));
  badges.forEach(badge => contentCell.push(badge.cloneNode(true)));

  const cells = [contentCell];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Promo', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
