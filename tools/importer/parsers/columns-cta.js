/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta
 * Base block: columns
 * Source: https://www.queensland.com/in/en/home
 * Selector: #image-cta_757096332
 * Generated: 2026-04-28
 *
 * Target structure (from library example):
 *   | Columns-CTA |
 *   | --- | --- |
 *   | media (image/video) | heading + paragraph + CTA link |
 *
 * Source structure: Two side-by-side divs inside a wrapper.
 *   Left: YouTube video iframe embedded via plyr player
 *   Right: h1 heading, paragraph text, and a CTA link
 */
export default function parse(element, { document }) {
  // --- Left cell: media (video/image) ---
  // Source has a YouTube iframe; extract it as a link for the importer
  const iframe = element.querySelector('iframe[src*="youtube"]');
  let mediaCell;
  if (iframe) {
    // Extract the YouTube video URL from the iframe src
    const iframeSrc = iframe.getAttribute('src') || '';
    const videoIdMatch = iframeSrc.match(/youtube\.com\/embed\/([^?&]+)/);
    const videoUrl = videoIdMatch
      ? `https://www.youtube.com/watch?v=${videoIdMatch[1]}`
      : iframeSrc;
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    mediaCell = videoLink;
  } else {
    // Fallback: look for an image if no iframe is present
    const img = element.querySelector('img[src]:not([src^="data:"])');
    mediaCell = img || '';
  }

  // --- Right cell: heading + description + CTA ---
  const contentElements = [];

  // Heading: source uses h1, fall back to h2/h3
  const heading = element.querySelector('h1, h2, h3, [class*="title"]:not(iframe)');
  if (heading) {
    contentElements.push(heading);
  }

  // Description paragraph(s): inside the description div or direct p tags
  const descriptionDiv = element.querySelector('div[class*="dNFkOE"], div[class*="description"]');
  if (descriptionDiv) {
    const paragraphs = descriptionDiv.querySelectorAll('p');
    paragraphs.forEach((p) => contentElements.push(p));
  } else {
    // Fallback: grab p elements near the heading
    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach((p) => contentElements.push(p));
  }

  // CTA link(s): the anchor element(s) in the CTA area
  const ctaContainer = element.querySelector('div[class*="bMQLwG"], div[class*="cta"]');
  let ctaLinks;
  if (ctaContainer) {
    ctaLinks = Array.from(ctaContainer.querySelectorAll('a[href]'));
  } else {
    // Fallback: any anchor links that are not inside the video area
    ctaLinks = Array.from(element.querySelectorAll('a[href]:not([class*="video"])'));
  }
  ctaLinks.forEach((link) => {
    // Clean up CTA link text: remove embedded SVG icons, keep text
    const iconSpan = link.querySelector('div[class*="iIvHqT"], span[class*="blIAwI"]');
    if (iconSpan) {
      iconSpan.remove();
    }
    contentElements.push(link);
  });

  // Build cells: one row with two columns matching the library example
  const cells = [
    [mediaCell, contentElements],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
