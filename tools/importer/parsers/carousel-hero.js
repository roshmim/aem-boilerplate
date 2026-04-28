/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero
 * Base block: carousel
 * Source: https://www.queensland.com/in/en/home
 * Selector: #hero-banner-slider
 * Generated: 2026-04-28
 *
 * Source structure:
 *   section#hero-banner-slider
 *     .swiper-wrapper
 *       .swiper-slide (multiple)
 *         figure > div > div > div > img (slide background image with alt/title)
 *         .sc-kcoZcm h1 > span (slide heading text)
 *
 * Target table structure (from library-example.md):
 *   Each row = 1 slide: [image (col 1), heading + description + CTA (col 2)]
 *   Image is mandatory; text content is optional.
 */
export default function parse(element, { document }) {
  // Find all swiper slides
  const slides = element.querySelectorAll('.swiper-slide');
  const cells = [];

  slides.forEach((slide) => {
    // Column 1: Slide image
    // Each slide has a figure containing the background image with a real src (scene7 URL)
    // Select only images with a meaningful src (not empty, not data: URIs used for icons)
    const images = slide.querySelectorAll('figure img');
    let slideImage = null;
    for (const img of images) {
      const src = img.getAttribute('src') || '';
      if (src && !src.startsWith('data:') && src !== '') {
        slideImage = img;
        break;
      }
    }

    // Skip slides that have no meaningful image
    if (!slideImage) return;

    // Column 2: Text content (heading, description, CTA)
    const contentCell = [];

    // Heading: h1 > span within the slide overlay area
    const headingSpan = slide.querySelector('h1 span');
    if (headingSpan && headingSpan.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = headingSpan.textContent.trim();
      contentCell.push(h2);
    }

    // Description: look for paragraph text within the slide (not present in current source, but handle variation)
    const descriptions = slide.querySelectorAll('p');
    descriptions.forEach((p) => {
      if (p.textContent.trim()) {
        contentCell.push(p);
      }
    });

    // CTA links: look for anchor elements within the slide (not present in current source, but handle variation)
    const ctaLinks = slide.querySelectorAll('a[href]');
    ctaLinks.forEach((link) => {
      if (link.textContent.trim()) {
        contentCell.push(link);
      }
    });

    // Build the row: [image, text content]
    // If there is text content, add as second column; otherwise just the image
    if (contentCell.length > 0) {
      cells.push([slideImage, contentCell]);
    } else {
      cells.push([slideImage]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
