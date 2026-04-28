/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Queensland homepage cleanup.
 * Removes non-authorable site chrome and tracking elements.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie consent SDK (line 2992 in cleaned.html: <div id="onetrust-consent-sdk">)
    // Search container (line 3158: <div id="search-container">)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#search-container',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header with main and utility navigation (line 9: <header id="header-menu2">)
    // Footer with links, social icons, acknowledgement (line 2713: <footer class="sc-erbPVk iWWWfW">)
    // Skip link (line 151: <a href="#hero-banner-slider" class="... skip-link">)
    // Adobe ID Syncing iframe (line 2984: <iframe id="destination_publishing_iframe_queensland_0">)
    // Tracking/ad iframes from doubleclick.net (lines 3229, 3237)
    // OneTrust text-resize iframe (line 3215)
    // Noscript elements with tracking pixels (lines 2960, 2977)
    // Clientlib link element (line 2944: <link href="/etc.clientlibs/teq/clientlibs/teq-react.min.css">)
    // Tracking pixel images from yieldoptimizer (lines 3219-3220) and Yahoo analytics (line 3231)
    WebImporter.DOMUtils.remove(element, [
      'header#header-menu2',
      'footer.sc-erbPVk',
      'a.skip-link',
      '#destination_publishing_iframe_queensland_0',
      'iframe',
      'noscript',
      'link',
      'img[src*="yieldoptimizer"]',
      'img[src*="sp.analytics.yahoo.com"]',
    ]);
  }
}
