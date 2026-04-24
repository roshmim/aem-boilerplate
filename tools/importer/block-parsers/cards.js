/**
 * Cards block parser for CommBank Brighter Article pages.
 * Extracts card content from section navigation, related articles, and article feeds.
 * @param {Document} document - The parsed HTML document
 * @returns {Object} Object with categorized card arrays
 */
export default function parseCards(document) {
  const result = { sectionNav: [], relatedArticles: [], moreCards: [], latestStories: [] };

  // Parse section navigation (.section-navigation)
  const sectionNav = document.querySelector('.section-navigation');
  if (sectionNav) {
    sectionNav.querySelectorAll('.hyperlink-list li').forEach((li) => {
      const link = li.querySelector('a');
      const img = li.querySelector('img');
      const label = li.querySelector('span');
      result.sectionNav.push({
        image: img?.getAttribute('src') || '',
        label: label?.textContent?.trim() || link?.textContent?.trim() || '',
        link: link?.getAttribute('href') || '',
      });
    });
  }

  // Parse sidebar related articles (.content-module within col-md-4)
  const sidebar = document.querySelector('.col-12.col-md-4');
  if (sidebar) {
    sidebar.querySelectorAll('.content-module').forEach((module) => {
      const img = module.querySelector('.image-section img');
      const title = module.querySelector('h3');
      const desc = module.querySelector('.item-inner div p');
      const link = module.querySelector('.button_tertiary');
      result.relatedArticles.push({
        image: img?.getAttribute('src') || '',
        title: title?.textContent?.trim() || '',
        description: desc?.textContent?.trim() || '',
        linkText: link?.textContent?.trim() || '',
        link: link?.getAttribute('href') || '',
      });
    });
  }

  // Parse "More in" cards (four-column layout)
  const fourCol = document.querySelector('.four-column');
  if (fourCol) {
    fourCol.querySelectorAll('.content-module').forEach((module) => {
      const img = module.querySelector('.image-section img');
      const title = module.querySelector('h3');
      const link = module.querySelector('.button_tertiary');
      result.moreCards.push({
        image: img?.getAttribute('src') || '',
        title: title?.textContent?.trim() || '',
        linkText: link?.textContent?.trim() || '',
        link: link?.getAttribute('href') || '',
      });
    });
  }

  // Parse latest stories feed (.article-cards-section)
  document.querySelectorAll('.article-cards').forEach((card) => {
    const img = card.querySelector('.article-cards-image img');
    const tag = card.querySelector('.article-cards-tag a');
    const title = card.querySelector('.artcile-cards-content h4 a');
    const excerpt = card.querySelector('.artcile-cards-content div');
    const link = card.querySelector('.article-cards-image a');
    result.latestStories.push({
      image: img?.getAttribute('src') || '',
      tag: tag?.textContent?.trim() || '',
      title: title?.textContent?.trim() || '',
      excerpt: excerpt?.textContent?.trim() || '',
      link: link?.getAttribute('href') || '',
    });
  });

  return result;
}
