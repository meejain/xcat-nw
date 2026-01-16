import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (!navSections) return;
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  
  // Handle case where fragment is null (nav not found)
  if (!fragment) {
    console.warn(`Navigation fragment not found at ${navPath}`);
    block.innerHTML = '<div class="nav-wrapper"><nav id="nav"><p>Navigation not configured</p></nav></div>';
    return;
  }
  
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Handle 4-section nav: top-bar, brand (logo), sections (main nav), tools
  const navChildren = Array.from(nav.children);
  if (navChildren.length === 4) {
    const [topBar, brand, sections, tools] = navChildren;
    topBar.classList.add('nav-top-bar');
    brand.classList.add('nav-brand');
    sections.classList.add('nav-sections');
    tools.classList.add('nav-tools');
    
    // Create search bar
    const searchDiv = document.createElement('div');
    searchDiv.classList.add('nav-search');
    searchDiv.innerHTML = '<input type="search" placeholder="Search" aria-label="Search">';
    
    // Wrap brand, search, sections, and tools in a main row
    const mainRow = document.createElement('div');
    mainRow.classList.add('nav-main-row');
    mainRow.append(brand, searchDiv, sections, tools);
    nav.append(mainRow);
  } else {
    // Fallback to 3-section layout
    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });
  }

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }
    
    // Replace DA image with inline SVG logo from Nationwide site
    const brandPicture = navBrand.querySelector('picture');
    if (brandPicture) {
      // Create the SVG logo
      const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      logoSvg.setAttribute('viewBox', '0 0 240 32');
      logoSvg.setAttribute('fill', 'none');
      logoSvg.setAttribute('aria-label', 'nationwide');
      logoSvg.setAttribute('role', 'img');
      logoSvg.setAttribute('focusable', 'false');
      logoSvg.style.width = '180px';
      logoSvg.style.height = 'auto';
      logoSvg.style.display = 'block';
      
      logoSvg.innerHTML = `<g clip-path="url(#nbs_logo_full-inverted_icon_svg__a)"><path d="M24.912 11.701C24.517 5.186 19.066-.002 12.493-.002 5.598-.002.003 5.544.003 12.458c0 3.312 1.298 6.375 3.501 8.609l8.23-9.366h13.178Zm-7.909 19.805h15.848V21.134l-7.945-9.433-7.908 9.433v10.372h.005Z" fill="#F9383D"></path><path d="M194.046 31.464h-6.167V12.49h6.167v18.975ZM187.534 7.363c0-2.011 1.413-3.42 3.424-3.42s3.43 1.409 3.43 3.42-1.414 3.42-3.43 3.42-3.424-1.409-3.424-3.42ZM109.011 12.489v18.975h-6.167V12.49h6.167ZM102.501 7.363c0-2.01 1.414-3.42 3.43-3.42s3.429 1.41 3.429 3.42c0 2.011-1.413 3.421-3.429 3.421s-3.43-1.41-3.43-3.42ZM94.78 12.49V7.83h-3.965l-.472 1.922c-.473 1.752-1.045 2.737-2.93 3.08l-1.373.212v3.763h2.656v9.573c0 4.27 2.785 5.597 5.871 5.597 2.484 0 4.11-.596 5.528-1.669v-3.913c-1.158.513-2.14.767-3.086.767-1.455 0-2.229-.684-2.229-2.306V16.8h5.056v-4.317H94.78v.005ZM43.36 31.464h6.167V21.98c0-3.078 1.372-5.043 3.773-5.043 2.14 0 3.17 1.41 3.17 4.23v10.298h6.167v-12.05c0-4.83-2.526-7.438-6.682-7.438-3.471 0-5.653 1.84-6.428 4.66v-4.147H43.36v18.975Z" fill="#fff"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M121.886 11.976c-6.209 0-10.283 4.188-10.283 10.128s4.068 9.873 10.283 9.873c6.214 0 10.407-3.933 10.407-9.873 0-5.94-4.157-10.128-10.407-10.128Zm0 15.254c-2.614 0-4.24-1.882-4.24-5.126 0-3.245 1.626-5.386 4.24-5.386 2.613 0 4.369 2.136 4.369 5.386s-1.756 5.126-4.369 5.126Z" fill="#fff"></path><path d="M140.657 31.464h-6.168V12.49h6.168v4.147c.769-2.82 2.956-4.66 6.427-4.66 4.157 0 6.682 2.607 6.682 7.438v12.05h-6.167V21.166c0-2.82-1.029-4.23-3.17-4.23-2.4 0-3.772 1.965-3.772 5.043v9.485ZM176.882 24.882h-.171l-3.128-12.393h-5.825l-3.169 12.393h-.172l-3.299-12.393h-6.168l5.612 18.975h6.552l3.169-12.304h.172l3.169 12.304h6.552l5.653-18.975h-5.611l-3.341 12.393h.005Z" fill="#fff"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M205.356 11.976c-4.967 0-8.651 3.846-8.651 9.998 0 6.152 3.684 9.998 8.651 9.998 2.655 0 5.316-1.451 6.298-3.887v3.374h6.209V4.684h-6.209V15.91c-.941-2.436-3.601-3.934-6.298-3.934Zm1.969 4.872c2.614 0 4.329 1.923 4.329 4.914v.425c0 3.032-1.715 4.955-4.329 4.955-2.613 0-4.369-2.006-4.369-5.173 0-3.167 1.714-5.126 4.369-5.126v.005ZM239.523 26.4c-1.31 3.556-4.516 5.598-9.005 5.598-6.053 0-10.35-3.685-10.35-9.724 0-6.038 4.38-10.324 10.22-10.324 6.313 0 9.618 4.328 9.618 9.51v1.887h-13.738c.171 2.53 2.063 3.986 4.463 3.986 1.995 0 3.284-.7 4.006-2.208l4.78 1.28.006-.005Zm-13.167-6.354h7.685c-.13-1.887-1.33-3.597-3.694-3.597-2.489 0-3.648 1.586-3.991 3.597ZM71.801 20.735c-4.209.685-6.957 2.359-6.957 5.997 0 3.255 2.405 5.183 6.224 5.183 2.962 0 5.326-1.156 6.397-3.343.555 2.14 2.234 3.343 4.51 3.343 1.89 0 3.091-.554 4.037-1.244v-3.296a3.511 3.511 0 0 1-1.59.342c-.774 0-1.2-.43-1.2-1.415v-6.94c0-5.183-3.565-7.412-8.548-7.412-4.983 0-8.095 2.473-8.989 6.121l5.607 1.156c.353-1.56 1.252-2.648 3.04-2.648 1.89 0 2.79 1.072 2.79 2.871v.43l-5.326.855h.005Zm-.946 5.313c0-1.498 1.2-2.011 3.133-2.358l3.134-.555v.726c0 2.7-1.803 3.985-4.08 3.985-1.33 0-2.187-.684-2.187-1.798Z" fill="#fff"></path></g><defs><clipPath id="nbs_logo_full-inverted_icon_svg__a"><path fill="#fff" d="M0 0h240v32H0z"></path></clipPath></defs>`;
      
      // Replace the picture element with SVG
      brandPicture.replaceWith(logoSvg);
    }
  }

  // Remove button classes and paragraph wrappers from nav-tools links
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    navTools.querySelectorAll('.button').forEach((button) => {
      button.classList.remove('button');
    });
    navTools.querySelectorAll('.button-container').forEach((container) => {
      container.classList.remove('button-container');
    });
    // Remove paragraph wrappers from nav-tools links
    navTools.querySelectorAll(':scope .default-content-wrapper > ul > li > p').forEach((p) => {
      const link = p.querySelector('a');
      if (link) {
        // Preserve any nested ul (dropdown)
        const nestedUl = p.querySelector('ul');
        if (nestedUl) {
          p.parentElement.appendChild(nestedUl);
        }
        p.replaceWith(link);
      }
    });
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Remove button classes from nav-sections main links
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li > p').forEach((p) => {
      const link = p.querySelector('a');
      if (link) {
        link.classList.remove('button');
        p.replaceWith(link);
      }
    });
    
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      const hasDropdown = navSection.querySelector('ul');
      if (hasDropdown) {
        navSection.classList.add('nav-drop');
        // Prevent link navigation for dropdown items - toggle dropdown instead
        const mainLink = navSection.querySelector(':scope > a');
        if (mainLink) {
          mainLink.addEventListener('click', (e) => {
            if (isDesktop.matches) {
              e.preventDefault();
              e.stopPropagation();
              const expanded = navSection.getAttribute('aria-expanded') === 'true';
              toggleAllNavSections(navSections);
              navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            }
          });
        }
      } else {
        // Only add click handler for items without dropdowns
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      }
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  
  // Add hamburger to main row instead of prepending to nav
  const mainRow = nav.querySelector('.nav-main-row');
  if (mainRow) {
    mainRow.appendChild(hamburger);
  } else {
    nav.prepend(hamburger);
  }
  
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  // Move top-bar outside of nav element for proper layout
  const navTopBar = nav.querySelector('.nav-top-bar');
  if (navTopBar) {
    navWrapper.append(navTopBar);
  }

  navWrapper.append(nav);
  block.append(navWrapper);
}
