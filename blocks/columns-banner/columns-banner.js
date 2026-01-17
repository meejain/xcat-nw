export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-banner-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-banner-img-col');
        }
      }
    });
  });

  // Fix Call Checker section: move button from list item to after the list
  const list = block.querySelector('ul');
  if (list) {
    const listItems = list.querySelectorAll('li');
    listItems.forEach((li) => {
      const strongLink = li.querySelector('strong a');
      if (strongLink) {
        // Extract just the text before the strong tag
        const textNode = Array.from(li.childNodes).find(node => node.nodeType === 3);
        if (textNode) {
          li.textContent = textNode.textContent.trim();
        }
        
        // Create button paragraph after the list
        const buttonP = document.createElement('p');
        buttonP.className = 'button-container';
        const newLink = document.createElement('a');
        newLink.href = strongLink.href;
        newLink.textContent = strongLink.textContent;
        newLink.className = 'button';
        buttonP.appendChild(newLink);
        
        // Insert after the list
        list.parentNode.insertBefore(buttonP, list.nextSibling);
      }
    });
  }
}
