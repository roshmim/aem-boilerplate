/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Queensland homepage section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks where sections have a style.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Find the first element matching a section selector within the given root.
 * Handles special cases like nth-of-type pseudo-selectors on duplicate IDs.
 * @param {Element} root - The root element to search within
 * @param {string|string[]} selector - CSS selector or array of selectors
 * @returns {Element|null}
 */
function findSectionElement(root, selector) {
  // Handle array selectors (e.g. section-2 uses an array)
  const sel = Array.isArray(selector) ? selector[0] : selector;
  if (!sel) return null;

  // Handle nth-of-type selectors on duplicate IDs
  // e.g. "[id='editorial-description-wrapper']:nth-of-type(1)" or "section#--wrapper:nth-of-type(2)"
  const nthMatch = sel.match(/^(.+):nth-of-type\((\d+)\)$/);
  if (nthMatch) {
    const baseSelector = nthMatch[1];
    const nthIndex = parseInt(nthMatch[2], 10);
    const allMatches = root.querySelectorAll(baseSelector);
    // nth-of-type is 1-based
    return allMatches.length >= nthIndex ? allMatches[nthIndex - 1] : null;
  }

  // Handle IDs that are not valid CSS selectors (e.g. section#- where id="-")
  // Use attribute selector instead of # notation for safety
  const idMatch = sel.match(/^([a-z]*)#(.+)$/i);
  if (idMatch) {
    const tag = idMatch[1] || '';
    const idVal = idMatch[2];
    const attrSel = tag ? `${tag}[id="${idVal}"]` : `[id="${idVal}"]`;
    try {
      return root.querySelector(attrSel);
    } catch (e) {
      return null;
    }
  }

  // Standard querySelector for other selectors
  try {
    return root.querySelector(sel);
  } catch (e) {
    return null;
  }
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const doc = element.ownerDocument || document;
    const sections = template.sections;

    // Process sections in reverse order to avoid invalidating positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      // Section 11 (Newsletter Signup) has style: "teal"
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metadataBlock);
      }

      // Insert <hr> before every section except the first to create section breaks
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
