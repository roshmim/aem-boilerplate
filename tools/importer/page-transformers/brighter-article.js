/**
 * Page transformer for CommBank Brighter Article pages.
 * Orchestrates hero and cards block parsers to produce an EDS-compatible page structure.
 *
 * @param {Document} document - The parsed HTML document
 * @param {Object} metadata - Page metadata (title, description, og:*, canonical)
 * @param {Object} imageMapping - Map of original image URLs to local paths
 * @returns {Object} Structured page representation with ordered sections
 */
import parseHero from '../block-parsers/hero.js';
import parseCards from '../block-parsers/cards.js';

function extractArticleBody(document) {
  const sections = [];
  const mainCol = document.querySelector('.col-12.col-md-8') || document.querySelector('.column-control');
  if (!mainCol) return sections;

  // Key points (.key-points or first list before article body)
  const keyPoints = mainCol.querySelector('.key-points');
  if (keyPoints) {
    const items = [];
    keyPoints.querySelectorAll('li').forEach((li) => {
      items.push(li.textContent.trim());
    });
    if (items.length) {
      sections.push({
        type: 'default-content',
        name: 'Key Points',
        sectionMetadata: { style: 'highlight' },
        content: { list: items },
      });
    }
  }

  // Article body headings and paragraphs
  const bodyContainer = mainCol.querySelector('.article-body') || mainCol;
  const headings = [];
  bodyContainer.querySelectorAll('h2').forEach((h2) => {
    headings.push(h2.textContent.trim());
  });
  if (headings.length) {
    sections.push({
      type: 'default-content',
      name: 'Article Body',
      sectionMetadata: {},
      content: {
        headings,
        note: 'Full article text with paragraphs, bullet lists, and inline links',
      },
    });
  }

  return sections;
}

function extractDisclaimer(document) {
  const howTo = document.querySelector('.how-to');
  if (!howTo) return null;
  const heading = howTo.querySelector('h6, h5, h4, h3, h2');
  const paragraphs = [];
  howTo.querySelectorAll('p').forEach((p) => {
    const text = p.textContent.trim();
    if (text) paragraphs.push(text);
  });
  if (!paragraphs.length) return null;
  return {
    type: 'default-content',
    name: 'Things You Should Know',
    sectionMetadata: { style: 'disclaimer' },
    content: {
      heading: heading?.textContent?.trim() || 'Things you should know',
      paragraphs,
    },
  };
}

function remapImages(obj, imageMapping) {
  if (!obj || !imageMapping) return obj;
  if (typeof obj === 'string') {
    return imageMapping[obj] || obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => remapImages(item, imageMapping));
  }
  if (typeof obj === 'object') {
    const result = {};
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = key === 'image' || key === 'src'
        ? (imageMapping[value] || value)
        : remapImages(value, imageMapping);
    });
    return result;
  }
  return obj;
}

export default function transform(document, metadata = {}, imageMapping = {}) {
  const heroes = parseHero(document);
  const cards = parseCards(document);
  const articleSections = extractArticleBody(document);
  const disclaimer = extractDisclaimer(document);

  // Build ordered page sections matching the Brighter Article template
  const sections = [];

  // Section 1: Article Hero
  const mainHero = heroes.find((h) => h.type === 'article-hero');
  if (mainHero) {
    sections.push({
      type: 'block',
      blockName: 'hero',
      name: 'Hero',
      sectionMetadata: {},
      content: remapImages(mainHero, imageMapping),
    });
  }

  // Section 2: Section Navigation
  if (cards.sectionNav.length) {
    sections.push({
      type: 'block',
      blockName: 'cards',
      name: 'Section Navigation',
      sectionMetadata: { style: 'light-gray-bg' },
      content: { cards: remapImages(cards.sectionNav, imageMapping) },
    });
  }

  // Sections 3-4: Key Points and Article Body Part 1
  const ctaHeroes = heroes.filter((h) => h.type === 'inline-cta');
  let bodyInserted = false;
  articleSections.forEach((section) => {
    sections.push(section);
    // Insert first CTA after first article body chunk
    if (section.name === 'Article Body' && !bodyInserted && ctaHeroes.length > 0) {
      bodyInserted = true;
      sections.push({
        type: 'block',
        blockName: 'hero',
        name: 'Mid-Article CTA 1',
        sectionMetadata: {},
        content: remapImages(ctaHeroes[0], imageMapping),
      });
    }
  });

  // Insert remaining CTA heroes (CTA 2, etc.)
  ctaHeroes.slice(1).forEach((cta, i) => {
    sections.push({
      type: 'block',
      blockName: 'hero',
      name: `Mid-Article CTA ${i + 2}`,
      sectionMetadata: {},
      content: remapImages(cta, imageMapping),
    });
  });

  // Section 8: Related Articles
  if (cards.relatedArticles.length) {
    sections.push({
      type: 'default-content',
      name: 'Related Articles Heading',
      sectionMetadata: {},
      content: { heading: 'Related' },
    });
    sections.push({
      type: 'block',
      blockName: 'cards',
      name: 'Related Articles',
      sectionMetadata: {},
      content: { cards: remapImages(cards.relatedArticles, imageMapping) },
    });
  }

  // Section 9: More in Investing
  if (cards.moreCards.length) {
    sections.push({
      type: 'default-content',
      name: 'More in Investing Heading',
      sectionMetadata: { style: 'bottom-divider' },
      content: { heading: 'More in Investing' },
    });
    sections.push({
      type: 'block',
      blockName: 'cards',
      name: 'More in Investing',
      sectionMetadata: { style: 'bottom-divider' },
      content: { cards: remapImages(cards.moreCards, imageMapping) },
    });
  }

  // Section 10: Latest Stories
  if (cards.latestStories.length) {
    sections.push({
      type: 'default-content',
      name: 'Latest Stories Heading',
      sectionMetadata: { style: 'bottom-divider' },
      content: { heading: 'Latest stories from Brighter' },
    });
    sections.push({
      type: 'block',
      blockName: 'cards',
      name: 'Latest Stories from Brighter',
      sectionMetadata: { style: 'bottom-divider' },
      content: { cards: remapImages(cards.latestStories, imageMapping) },
    });
  }

  // Section 11: Disclaimer
  if (disclaimer) {
    sections.push(disclaimer);
  }

  return {
    template: 'Brighter Article',
    url: metadata.canonical || '',
    metadata: {
      title: metadata.title || '',
      description: metadata.description || '',
      'og:title': metadata['og:title'] || metadata.title || '',
      'og:type': metadata['og:type'] || 'article',
      'og:description': metadata['og:description'] || metadata.description || '',
      'og:image': metadata['og:image'] || '',
      canonical: metadata.canonical || '',
    },
    sections,
    blockSummary: {
      hero: { instances: heroes.length },
      cards: {
        instances: cards.sectionNav.length + cards.relatedArticles.length
          + cards.moreCards.length + cards.latestStories.length,
      },
    },
  };
}
