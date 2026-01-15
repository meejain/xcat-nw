export default function decorate(block) {
  const content = block.querySelector(':scope > div > div');
  if (!content) return;

  // Add class to description paragraph (first p without picture and not button-container)
  const paragraphs = content.querySelectorAll(':scope > p');
  paragraphs.forEach((p) => {
    if (!p.classList.contains('button-container') && !p.querySelector('picture')) {
      p.classList.add('hero-promo-description');
    }
  });

  // Create badges container for the award images
  const badgeImages = content.querySelectorAll(':scope > p:has(picture)');
  if (badgeImages.length > 0) {
    const badgesContainer = document.createElement('div');
    badgesContainer.className = 'hero-promo-badges';
    badgeImages.forEach((badge) => {
      badgesContainer.appendChild(badge);
    });
    content.appendChild(badgesContainer);
  }
}
