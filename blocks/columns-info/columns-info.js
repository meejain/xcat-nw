export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-info-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-info-img-col');
        }
      }

      // Add search box to "Search for help" section
      const heading = col.querySelector('h2');
      if (heading && heading.textContent.trim() === 'Search for help') {
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search-box-container');
        
        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = 'Search';
        searchInput.setAttribute('aria-label', 'Search');
        
        // Create search button
        const searchButton = document.createElement('button');
        searchButton.classList.add('search-button');
        searchButton.setAttribute('aria-label', 'Search');
        searchButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
        
        // Append elements
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        
        // Insert after heading
        heading.after(searchContainer);
      }

      // Fix "Internet banking" paragraph structure - split into multiple paragraphs
      if (heading && heading.textContent.trim() === 'Internet banking') {
        const paragraph = col.querySelector('p');
        if (paragraph) {
          // Check if the paragraph contains all the text in one go
          const hasHelp = paragraph.textContent.includes('Need any help');
          const hasLogIn = paragraph.querySelector('strong a');
          
          if (hasHelp && hasLogIn) {
            // Split the content into proper paragraphs
            const textBefore = paragraph.childNodes[0].textContent.trim();
            
            // Create first paragraph with initial text
            const p1 = document.createElement('p');
            p1.textContent = textBefore.split('Need any help')[0].trim();
            
            // Create second paragraph with help text and link
            const p2 = document.createElement('p');
            const helpText = document.createTextNode('Need any help logging in or registering? ');
            p2.appendChild(helpText);
            
            // Find and move the "Visit our online banking help page" link
            const helpLink = paragraph.querySelector('a[href*="online-banking-help"]');
            if (helpLink) {
              p2.appendChild(helpLink.cloneNode(true));
              const period = document.createTextNode('.');
              p2.appendChild(period);
            }
            
            // Create button container paragraph for the buttons
            const buttonPara = document.createElement('p');
            
            // Find all the button links
            const strongLink = paragraph.querySelector('strong a');
            const secondaryLink = paragraph.querySelector('strong + a');
            
            if (strongLink) {
              const strongWrapper = document.createElement('strong');
              strongWrapper.appendChild(strongLink.cloneNode(true));
              buttonPara.appendChild(strongWrapper);
              buttonPara.appendChild(document.createTextNode(' '));
            }
            
            if (secondaryLink) {
              buttonPara.appendChild(secondaryLink.cloneNode(true));
            }
            
            // Replace original paragraph with new structure
            paragraph.parentNode.insertBefore(p1, paragraph);
            paragraph.parentNode.insertBefore(p2, paragraph);
            paragraph.parentNode.insertBefore(buttonPara, paragraph);
            paragraph.remove();
          }
        }
      }
    });
  });
}
