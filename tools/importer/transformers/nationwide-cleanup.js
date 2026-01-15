/* global WebImporter */

/**
 * Transformer for Nationwide website cleanup
 * Purpose: Remove non-content elements and fix DOM issues
 * Applies to: www.nationwide.co.uk (all templates)
 * Generated: 2026-01-15
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow
 * - Page structure analysis from Nationwide homepage
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (OneTrust)
    // EXTRACTED: Found in captured DOM <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
      '[class*="cookie"]',
      '[id*="cookie"]'
    ]);

    // Remove header and navigation (handled separately)
    // EXTRACTED: Found <header> and <nav> elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header',
      'nav[aria-label="main navigation"]',
      '[class*="nav-menu"]',
      '[class*="header"]'
    ]);

    // Remove footer (handled separately)
    // EXTRACTED: Found <footer> element in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '[class*="footer"]'
    ]);

    // Remove skip links and accessibility overlays
    WebImporter.DOMUtils.remove(element, [
      '[class*="skip-link"]',
      '[class*="sr-only"]'
    ]);

    // Re-enable scrolling if disabled by modals
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove tracking and analytics elements
    WebImporter.DOMUtils.remove(element, [
      'script',
      'noscript',
      'link[rel="preload"]',
      'link[rel="prefetch"]',
      '[data-analytics]',
      '[data-tracking]'
    ]);

    // Clean up tracking attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-track');
      el.removeAttribute('data-testid');
      el.removeAttribute('onclick');
    });

    // Remove empty elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'svg:not([class*="icon"])',
      'source'
    ]);
  }
}
