/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsDestinationParser from './parsers/cards-destination.js';
import columnsCtaParser from './parsers/columns-cta.js';
import heroNewsletterParser from './parsers/hero-newsletter.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/queensland-cleanup.js';
import sectionsTransformer from './transformers/queensland-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-destination': cardsDestinationParser,
  'columns-cta': columnsCtaParser,
  'hero-newsletter': heroNewsletterParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Queensland tourism homepage with hero video/image slider, destination carousels, editorial sections, events, and newsletter signup',
  urls: [
    'https://www.queensland.com/in/en/home',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['#hero-banner-slider'],
    },
    {
      name: 'cards-destination',
      instances: [
        'section.sc-fRfEKy',
        'section.sc-flkahu',
        '#region-map-carousel-container',
        '#masonry-grid-category-wrapper',
        '#masonry-grid-article-wrapper',
      ],
    },
    {
      name: 'columns-cta',
      instances: ['#image-cta_757096332'],
    },
    {
      name: 'hero-newsletter',
      instances: ['section.sc-abVJb'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner Slider',
      selector: '#hero-banner-slider',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Discover Queenslands Icons',
      selector: ["[id='editorial-description-wrapper']:nth-of-type(1)"],
      style: null,
      blocks: [],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-3',
      name: 'Explore Our Destinations',
      selector: 'section#---wrapper',
      style: null,
      blocks: ['cards-destination'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-4',
      name: 'Whats On in Queensland',
      selector: 'section.sc-flkahu',
      style: null,
      blocks: ['cards-destination'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-5',
      name: 'Roadtrips Popular Now',
      selector: 'section#--wrapper:nth-of-type(1)',
      style: null,
      blocks: ['cards-destination'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-6',
      name: 'That Holiday Feeling CTA',
      selector: '#image-cta_757096332',
      style: null,
      blocks: ['columns-cta'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Let Us Show You Around',
      selector: '#region-map-carousel-container',
      style: null,
      blocks: ['cards-destination'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-8',
      name: 'What Holiday Feeling Are You',
      selector: '#masonry-grid-category-wrapper',
      style: null,
      blocks: ['cards-destination'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-9',
      name: 'Be Our Plus One Events',
      selector: 'section#--wrapper:nth-of-type(2)',
      style: null,
      blocks: ['cards-destination'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-10',
      name: 'Unlock More Queensland Magic',
      selector: '#masonry-grid-article-wrapper',
      style: null,
      blocks: ['cards-destination'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-11',
      name: 'Newsletter Signup',
      selector: 'section#-',
      style: 'teal',
      blocks: ['hero-newsletter'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
