/**
 * Hero block parser for CommBank Brighter Article pages.
 * Extracts hero content from .fifty-split and .article-cta elements.
 * @param {Document} document - The parsed HTML document
 * @returns {Array<Object>} Array of hero block content objects
 */
export default function parseHero(document) {
  const heroes = [];

  // Parse main article hero (.fifty-split)
  const fiftySplit = document.querySelector('.fifty-split');
  if (fiftySplit) {
    const heading = fiftySplit.querySelector('h2, h1');
    const description = fiftySplit.querySelector('.item p');
    const img = fiftySplit.querySelector('.image-wrapper img');
    heroes.push({
      type: 'article-hero',
      heading: heading?.textContent?.trim() || '',
      description: description?.textContent?.trim() || '',
      image: img?.getAttribute('src') || '',
      imageAlt: img?.getAttribute('alt') || '',
    });
  }

  // Parse inline CTA heroes (.article-cta)
  document.querySelectorAll('.article-cta').forEach((cta) => {
    const img = cta.querySelector('.cta-image img');
    const heading = cta.querySelector('.heading p, h3, h5');
    const description = cta.querySelector('.cta-wrapper > p:not(:last-child)');
    const button = cta.querySelector('.cta-button-wrapper a');
    heroes.push({
      type: 'inline-cta',
      heading: heading?.textContent?.trim() || '',
      description: description?.textContent?.trim() || '',
      image: img?.getAttribute('src') || '',
      imageAlt: img?.getAttribute('alt') || '',
      ctaText: button?.textContent?.trim() || '',
      ctaLink: button?.getAttribute('href') || '',
    });
  });

  return heroes;
}
