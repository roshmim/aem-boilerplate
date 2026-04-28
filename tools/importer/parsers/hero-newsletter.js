/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-newsletter
 * Base block: hero
 * Source: https://www.queensland.com/in/en/home
 * Selector: section.sc-abVJb
 * Generated: 2026-04-28
 *
 * Target structure (from block library):
 *   Row 1: background image
 *   Row 2: heading + description + CTA link
 */
export default function parse(element, { document }) {
  // --- Extract background image ---
  // Source has nested img elements inside figure; the inner one (with alt/title) is the real image
  const bgImage = element.querySelector('figure img[alt]')
    || element.querySelector('figure img');

  // --- Extract content area ---
  // Content lives in a sibling div after the figure, identifiable by containing h3 + p + a
  const heading = element.querySelector('h3')
    || element.querySelector('h2, h1, [class*="title"]');

  const description = element.querySelector('p')
    || element.querySelector('[class*="description"], [class*="subtitle"]');

  const ctaLink = element.querySelector('a[href]');

  // --- Build cells array matching block library structure ---
  const cells = [];

  // Row 1: Background image (optional - only add if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Heading + description + CTA (all in a single cell)
  // Wrap in an extra array so createBlock treats it as one cell with multiple elements
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLink) contentCell.push(ctaLink);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-newsletter', cells });
  element.replaceWith(block);
}
