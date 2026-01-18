import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Check if content is flattened (published version) and restructure if needed
  const firstSection = footer.querySelector('.default-content-wrapper');
  if (firstSection) {
    const h2Elements = firstSection.querySelectorAll('h2');
    
    // If we have multiple h2s in one wrapper, it's flattened - need to restructure
    if (h2Elements.length > 1) {
      const columnsWrapper = document.createElement('div');
      columnsWrapper.classList.add('footer-columns');
      
      // Group each h2 with its following ul into separate column divs
      h2Elements.forEach((h2) => {
        const columnDiv = document.createElement('div');
        const innerDiv = document.createElement('div');
        
        innerDiv.appendChild(h2.cloneNode(true));
        
        // Find the next ul sibling
        let nextEl = h2.nextElementSibling;
        while (nextEl && nextEl.tagName === 'UL') {
          innerDiv.appendChild(nextEl.cloneNode(true));
          nextEl = nextEl.nextElementSibling;
          break; // Only take the first UL
        }
        
        columnDiv.appendChild(innerDiv);
        columnsWrapper.appendChild(columnDiv);
      });
      
      // Replace the flattened content with structured columns
      firstSection.replaceWith(columnsWrapper);
    } else {
      // Already structured, just add the class
      if (footer.firstElementChild) {
        footer.firstElementChild.classList.add('footer-columns');
      }
    }
  } else {
    // No default-content-wrapper, add class to first child
    if (footer.firstElementChild) {
      footer.firstElementChild.classList.add('footer-columns');
    }
  }

  // Create a wrapper for the bottom section with regulatory text and social links
  const bottomSection = document.createElement('div');
  bottomSection.className = 'footer-social-copyright';

  // Move the last div (regulatory text) into the bottom section
  const regulatoryText = footer.lastElementChild;
  if (regulatoryText) {
    regulatoryText.classList.add('footer-regulatory');
    bottomSection.appendChild(regulatoryText);
  }

  // Add social links section
  const socialSection = createSocialSection();
  bottomSection.appendChild(socialSection);

  // Append the bottom section to footer
  footer.appendChild(bottomSection);

  block.append(footer);
}

function createSocialSection() {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-social-wrapper';

  // Social media data
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/NationwideBuildingSociety',
      label: 'Like us on Facebook (this link will open in a new window)',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><g mask="url(#mask0_466_10052)"><path fill="#FFFFFE" fill-rule="evenodd" d="M30.5 15.84C30.5 7.644 23.896 1 15.75 1S1 7.644 1 15.84c0 7.407 5.394 13.547 12.445 14.66V20.13H9.7v-4.29h3.745v-3.27c0-3.719 2.202-5.773 5.572-5.773 1.613 0 3.301.29 3.301.29v3.652h-1.86c-1.832 0-2.403 1.144-2.403 2.317v2.784h4.09l-.653 4.29h-3.437V30.5C25.106 29.387 30.5 23.247 30.5 15.84" clip-rule="evenodd"></path></g></svg>'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/nationwide-building-society',
      label: 'LinkedIn (this link will open in a new window)',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><g mask="url(#mask0_466_10056)"><path fill="#FFFFFE" fill-rule="evenodd" d="M24.546 17.14c0-3.966-2.504-5.318-4.822-5.318-2.143 0-3.546 1.364-3.947 2.164h-.053v-1.8h-3.995v12.986h4.154v-7.04c0-1.878 1.208-2.79 2.44-2.79 1.166 0 2.07.645 2.07 2.737v7.093h4.153zM9.552 8.032c0-1.355-1.072-2.347-2.394-2.347-1.323 0-2.395.992-2.395 2.347 0 1.356 1.072 2.346 2.395 2.346 1.322 0 2.394-.99 2.394-2.346m-4.471 17.13h4.153V12.177H5.081zM28.627 4.007V27.18c0 1.109-.913 2.008-2.04 2.008H3.04C1.913 29.188 1 28.289 1 27.18V4.008C1 2.899 1.913 2 3.04 2h23.548c1.126 0 2.04.899 2.04 2.007m.716 20.47h.28v.695h.144v-.694h.28v-.122h-.704zM31 24.357v.816h-.143v-.54l-.223.54h-.098l-.221-.549v.549h-.144v-.816h.164l.25.62.251-.62z" clip-rule="evenodd"></path></g></svg>'
    },
    {
      name: 'X',
      url: 'https://twitter.com/AskNationwide',
      label: 'Follow us on X (this link will open in a new window)',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#fff" fill-rule="evenodd" d="M18.7 13.7 29.5 1.2H27L17.7 12 10.2 1.2H1.6l11.3 16.4L1.6 30.8h2.5L14 19.3l7.9 11.5h8.6zm-3.4 4.1-1.1-1.6L5 3.2h3.9l7.3 10.5 1.1 1.6 9.5 13.6H23z" clip-rule="evenodd"></path></svg>'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/user/nationwidebsocietyuk',
      label: 'YouTube (this link will open in a new window)',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><g mask="url(#mask0_466_10060)"><path fill="#fff" fill-rule="evenodd" d="M15.89 5.994h.08l.33.001c2.027.012 9.014.09 10.974.618a3.704 3.704 0 0 1 2.61 2.62c.553 2.075.61 6.172.615 6.99v.289c-.005.819-.062 4.916-.616 6.99a3.704 3.704 0 0 1-2.609 2.62c-.895.242-2.837.389-4.877.479l-.585.024c-2.538.098-5.086.114-5.843.117h-.449c-1.425-.005-9.216-.057-11.304-.62a3.704 3.704 0 0 1-2.61-2.62c-.521-1.956-.601-5.71-.614-6.818l-.001-.172V16.224l.001-.172c.013-1.109.093-4.863.615-6.819a3.704 3.704 0 0 1 2.609-2.62c1.96-.528 8.947-.606 10.974-.618l.33-.001h.08zm-3.163 5.995v8.758l7.713-4.38z" clip-rule="evenodd"></path></g></svg>'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/nationwidebuildingsociety/',
      label: 'Instagram (this link will open in a new window)',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><g mask="url(#mask0_466_10054)"><path fill="#fff" fill-rule="evenodd" d="M15.75 1c-4.006 0-4.508.017-6.081.089-1.57.071-2.643.32-3.58.685a7.23 7.23 0 0 0-2.613 1.702 7.23 7.23 0 0 0-1.702 2.613c-.364.938-.614 2.01-.685 3.58C1.017 11.244 1 11.746 1 15.753c0 4.006.017 4.509.089 6.082.071 1.57.32 2.642.685 3.58a7.23 7.23 0 0 0 1.702 2.614 7.23 7.23 0 0 0 2.612 1.701c.938.365 2.01.614 3.58.686 1.574.072 2.076.088 6.082.088s4.508-.017 6.081-.088c1.57-.072 2.643-.321 3.58-.686a7.23 7.23 0 0 0 2.613-1.701 7.233 7.233 0 0 0 1.702-2.613c.364-.939.614-2.011.685-3.581.072-1.573.089-2.076.089-6.082 0-4.007-.017-4.509-.089-6.082-.071-1.57-.32-2.643-.685-3.581a7.232 7.232 0 0 0-1.702-2.613 7.23 7.23 0 0 0-2.612-1.702c-.938-.364-2.01-.614-3.58-.685C20.257 1.017 19.755 1 15.75 1m0 2.658c3.938 0 4.405.015 5.96.086 1.438.066 2.22.306 2.74.508a4.57 4.57 0 0 1 1.695 1.103 4.57 4.57 0 0 1 1.104 1.697c.202.52.442 1.3.507 2.739.071 1.555.086 2.022.086 5.96 0 3.94-.015 4.406-.086 5.962-.065 1.438-.305 2.22-.508 2.739a4.57 4.57 0 0 1-1.103 1.696 4.57 4.57 0 0 1-1.696 1.104c-.52.202-1.3.442-2.739.508-1.555.07-2.021.085-5.96.085s-4.405-.014-5.96-.085c-1.438-.066-2.22-.306-2.74-.508a4.57 4.57 0 0 1-1.695-1.104 4.57 4.57 0 0 1-1.103-1.696c-.202-.52-.443-1.301-.508-2.74-.071-1.555-.086-2.021-.086-5.96 0-3.94.015-4.406.086-5.961.065-1.439.306-2.22.508-2.74a4.57 4.57 0 0 1 1.103-1.696A4.57 4.57 0 0 1 7.05 4.252c.52-.202 1.3-.442 2.739-.508 1.555-.071 2.022-.086 5.96-.086" clip-rule="evenodd"></path></g><path fill="#fff" fill-rule="evenodd" d="M15.98 20.917a4.937 4.937 0 1 1 0-9.873 4.937 4.937 0 0 1 0 9.873m0-12.542a7.606 7.606 0 1 0 0 15.211 7.606 7.606 0 0 0 0-15.211M25.43 7.914a1.844 1.844 0 1 1-3.688 0 1.844 1.844 0 0 1 3.688 0" clip-rule="evenodd"></path></svg>'
    }
  ];

  // Create social media area
  const socialArea = document.createElement('div');
  socialArea.className = 'footer-social-area';

  const heading = document.createElement('h2');
  heading.textContent = 'Social links';
  socialArea.appendChild(heading);

  const ul = document.createElement('ul');
  ul.className = 'footer-social-links';

  socialLinks.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', link.label);
    
    const screenReaderText = document.createElement('span');
    screenReaderText.className = 'sr-only';
    screenReaderText.textContent = link.label;
    
    a.innerHTML = screenReaderText.outerHTML + link.svg;
    li.appendChild(a);
    ul.appendChild(li);
  });

  socialArea.appendChild(ul);
  wrapper.appendChild(socialArea);

  // Add copyright
  const copyright = document.createElement('div');
  copyright.className = 'footer-copyright';
  copyright.innerHTML = '<small>©2026 Nationwide Building Society</small>';
  wrapper.appendChild(copyright);

  return wrapper;
}
