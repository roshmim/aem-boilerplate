/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-destination
 * Base block: cards
 * Source: https://www.queensland.com/in/en/home
 * Generated: 2026-04-28
 *
 * Extracts destination cards from swiper carousels, masonry grids, and region maps.
 * Each card contains an image, title, optional subtitle, and a link.
 * Target: 2-column table — image (col 1) + title/description/CTA (col 2).
 *
 * Handles variations:
 * - Swiper carousel slides (destinations, roadtrips, events)
 * - Masonry grid items (categories, articles)
 * - Region map carousel items
 * - Cards with/without images (lazy-loaded)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all card links — these are the primary card containers across all layouts.
  // Exclude prev/next navigation buttons and scrollbar elements.
  const cardLinks = Array.from(
    element.querySelectorAll('a[href]:not([class*="button-prev"]):not([class*="button-next"]):not([class*="arrow"]):not([class*="scrollbar"])')
  ).filter((a) => {
    // Exclude links that are purely navigational (no visible text or image content)
    const text = a.textContent.trim();
    const hasImage = a.querySelector('img, picture, [style*="background-image"]');
    return text.length > 0 || hasImage;
  });

  cardLinks.forEach((link) => {
    // Extract image — try multiple strategies for lazy-loaded images
    const img = link.querySelector('img');
    const picture = link.querySelector('picture');

    // Build image cell (column 1)
    const imageCell = [];
    if (img) {
      // Determine the best image source — check src, data-src, data-lazy
      const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-lazy');
      if (src && !src.startsWith('data:')) {
        const imgEl = document.createElement('img');
        imgEl.src = src;
        const alt = img.getAttribute('alt') || '';
        if (alt) imgEl.alt = alt;
        imageCell.push(imgEl);
      }
    } else if (picture) {
      const pictureImg = picture.querySelector('img');
      if (pictureImg) {
        imageCell.push(pictureImg.cloneNode(true));
      }
    }

    // Fallback: check for background-image on child divs
    if (imageCell.length === 0) {
      const bgDiv = link.querySelector('[style*="background-image"]');
      if (bgDiv) {
        const style = bgDiv.getAttribute('style') || '';
        const urlMatch = style.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch) {
          const imgEl = document.createElement('img');
          imgEl.src = urlMatch[1];
          imageCell.push(imgEl);
        }
      }
    }

    // Extract title — h5 primary in source, with broad fallbacks including span
    const titleEl = link.querySelector('h5, h4, h3, h2, h1, h6, strong, [class*="title"], [class*="heading"], [class*="name"]');

    // Extract subtitle/description — p tag with label text like "Visit", "Event", etc.
    const descEl = link.querySelector('p');

    // Determine title text — from heading element, or fall back to overall link text
    let titleText = '';
    if (titleEl) {
      titleText = titleEl.textContent.trim();
    } else {
      // Fall back to the link's own text content, excluding image alt text noise
      const clonedLink = link.cloneNode(true);
      // Remove img elements from clone to avoid alt text contamination
      clonedLink.querySelectorAll('img, picture, svg').forEach((el) => el.remove());
      titleText = clonedLink.textContent.trim();
    }

    // Skip cards with no meaningful content
    if (!titleText && imageCell.length === 0) return;

    // Build content cell (column 2): title, description, CTA link
    const contentCell = [];

    if (titleText) {
      // Title as bold text
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      contentCell.push(strong);
    }

    // Description/subtitle if different from title
    if (descEl) {
      const descText = descEl.textContent.trim();
      if (descText && descText !== titleText) {
        const p = document.createElement('p');
        p.textContent = descText;
        contentCell.push(p);
      }
    }

    // CTA link
    if (link.href) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = titleText || link.href;
      contentCell.push(cta);
    }

    if (contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-destination', cells });
  element.replaceWith(block);
}
