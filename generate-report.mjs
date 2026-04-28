import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ImageRun,
  PageBreak, ShadingType, Header, Footer, PageNumber, NumberFormat,
  TableOfContents, StyleLevel, TabStopPosition, TabStopType
} from 'docx';
import fs from 'fs';
import path from 'path';

const TEAL = '00A0A0';
const DARK = '333333';
const LIGHT_GRAY = 'F2F2F2';
const WHITE = 'FFFFFF';
const BORDER_COLOR = 'CCCCCC';

const screenshotDir = '/tmp/playwright/screenshots';

function loadImage(filename) {
  const filepath = path.join(screenshotDir, filename);
  if (fs.existsSync(filepath)) return fs.readFileSync(filepath);
  return null;
}

function cellBorders() {
  const b = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
  return { top: b, bottom: b, left: b, right: b };
}

function headerCell(text) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: WHITE, size: 20, font: 'Calibri' })], alignment: AlignmentType.LEFT, spacing: { before: 40, after: 40 } })],
    shading: { type: ShadingType.SOLID, color: TEAL },
    borders: cellBorders(),
    width: { size: 100, type: WidthType.AUTO },
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
  });
}

function dataCell(text, opts = {}) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: text || '', size: 18, font: 'Calibri', ...opts })], alignment: AlignmentType.LEFT, spacing: { before: 20, after: 20 } })],
    borders: cellBorders(),
    width: { size: 100, type: WidthType.AUTO },
    margins: { top: 20, bottom: 20, left: 80, right: 80 },
  });
}

function sectionHeading(text) {
  return new Paragraph({ children: [new TextRun({ text, bold: true, color: TEAL, size: 32, font: 'Calibri' })], heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });
}

function subHeading(text) {
  return new Paragraph({ children: [new TextRun({ text, bold: true, color: DARK, size: 26, font: 'Calibri' })], heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } });
}

function bodyText(text) {
  return new Paragraph({ children: [new TextRun({ text, size: 20, font: 'Calibri', color: DARK })], spacing: { before: 60, after: 60 } });
}

function bulletText(text) {
  return new Paragraph({ children: [new TextRun({ text, size: 20, font: 'Calibri', color: DARK })], bullet: { level: 0 }, spacing: { before: 40, after: 40 } });
}

function addImage(filename, w, h) {
  const data = loadImage(filename);
  if (!data) return new Paragraph({ children: [new TextRun({ text: `[Screenshot: ${filename}]`, italics: true, size: 18, color: '999999' })] });
  return new Paragraph({
    children: [new ImageRun({ data, transformation: { width: w || 500, height: h || 700 }, type: 'png' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 100 }
  });
}

function makeTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map(h => headerCell(h)), tableHeader: true }),
      ...rows.map(row => new TableRow({ children: row.map(c => dataCell(c)) })),
    ],
  });
}

// ============================================
// BUILD DOCUMENT
// ============================================
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 20 } },
    },
  },
  sections: [
    // ===== COVER PAGE =====
    {
      properties: {},
      children: [
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({ children: [new TextRun({ text: 'QUEENSLAND.COM', bold: true, color: TEAL, size: 56, font: 'Calibri' })], alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [new TextRun({ text: 'Site Migration Analysis Report', bold: true, color: DARK, size: 44, font: 'Calibri' })], alignment: AlignmentType.CENTER, spacing: { before: 200 } }),
        new Paragraph({ spacing: { before: 200 } }),
        new Paragraph({ children: [new TextRun({ text: 'Prepared for: Adobe Edge Delivery Services Migration', size: 24, color: '666666', font: 'Calibri' })], alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [new TextRun({ text: 'Date: April 28, 2026', size: 24, color: '666666', font: 'Calibri' })], alignment: AlignmentType.CENTER, spacing: { before: 100 } }),
        new Paragraph({ children: [new TextRun({ text: 'Source: https://www.queensland.com', size: 22, color: '666666', font: 'Calibri' })], alignment: AlignmentType.CENTER, spacing: { before: 100 } }),
        new Paragraph({ spacing: { before: 400 } }),
        addImage('queensland-homepage-full.png', 420, 580),
        new Paragraph({ children: [new TextRun({ text: 'CONFIDENTIAL', bold: true, color: 'CC0000', size: 22, font: 'Calibri' })], alignment: AlignmentType.CENTER, spacing: { before: 300 } }),
      ],
    },

    // ===== TABLE OF CONTENTS =====
    {
      properties: {},
      children: [
        sectionHeading('Table of Contents'),
        bodyText('1. Executive Summary'),
        bodyText('2. Templates Inventory'),
        bodyText('3. Blocks / Components Catalog'),
        bodyText('4. Page Counts by Template'),
        bodyText('5. Integrations Analysis'),
        bodyText('6. Complex Use Cases & Observations'),
        bodyText('7. Migration Estimates'),
        bodyText('8. Screenshots Appendix'),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },

    // ===== MAIN CONTENT =====
    {
      properties: {},
      children: [
        // -----------------------------------------------
        // 1. EXECUTIVE SUMMARY
        // -----------------------------------------------
        sectionHeading('1. Executive Summary'),
        bodyText('Queensland.com (www.queensland.com) is the official tourism website for Tourism and Events Queensland (TEQ). The site is currently built on Adobe Experience Manager (AEM) as a Cloud Service with a React-based front-end. It serves 12 international markets with localized content in 7 languages.'),
        bodyText('The site comprises approximately 2,500+ AEM-authored editorial pages and an estimated 15,000–20,000+ ATDW (Australian Tourism Data Warehouse) dynamically-sourced listing pages for attractions, tours, accommodation, events, and food & drink operators.'),
        bodyText('Key findings:'),
        bulletText('12 regional market variants (au, in, nz, sg, us, gb, fr, tw, hk, de, jp, kr) with 2 content sources each (AEM + ATDW)'),
        bulletText('8 distinct page templates identified across the site'),
        bulletText('20+ reusable blocks/components cataloged'),
        bulletText('14+ third-party integrations detected'),
        bulletText('Heavy reliance on ATDW API for dynamic listing content — the single most complex migration challenge'),
        bodyText(''),

        // -----------------------------------------------
        // 2. TEMPLATES INVENTORY
        // -----------------------------------------------
        sectionHeading('2. Templates Inventory'),
        bodyText('The following unique page templates have been identified across the site. Each template represents a distinct page layout and content structure.'),
        bodyText(''),
        makeTable(
          ['#', 'Template Name', 'Complexity', 'Description', 'Reference URL(s)'],
          [
            ['1', 'Homepage', 'High', 'Hero video/image slider, icon grid, destination carousel, events carousel, editorial cards, holiday finder widget, YouTube embed, newsletter signup. Unique one-off page per market.', 'https://www.queensland.com/in/en/home'],
            ['2', 'Category / Hub Page', 'Medium', 'Hero banner with breadcrumbs, intro text with anchor links, carousel of subcategories, rich-text editorial sections, article card grid, FAQ accordion, newsletter CTA. Used for top-level sections.', 'https://www.queensland.com/in/en/things-to-do\nhttps://www.queensland.com/in/en/places-to-see\nhttps://www.queensland.com/in/en/plan-your-holiday'],
            ['3', 'Destination Page', 'High', 'Hero banner, intro text, sub-destination carousel, things-to-do carousel, editorial sections, weather widget, interactive map, ATDW deals integration, events calendar integration, travel planning section, FAQ accordion.', 'https://www.queensland.com/in/en/places-to-see/destinations/brisbane\nhttps://www.queensland.com/in/en/places-to-see/destinations/gold-coast'],
            ['4', 'Article / Editorial Page', 'Medium', 'Hero image with title/category badge, author byline with avatar, anchor-link navigation, long-form rich text with inline images, embedded ATDW links, related article grid at bottom. Used for guides, lists, how-tos.', 'https://www.queensland.com/in/en/places-to-see/experiences/beaches/secret-queensland-beaches'],
            ['5', 'Itinerary Page', 'Medium', 'Hero image, author byline, day-by-day structured content with H2/H3 headings, inline images, ATDW product links, newsletter CTA. Similar to article but with day-based structure.', 'https://www.queensland.com/in/en/plan-your-holiday/itineraries/48-hours-on-magnetic-island'],
            ['6', 'ATDW Listing Page (Attraction/Tour)', 'High', 'Image gallery carousel, title with bookmark, location badge, contact icons (phone/email/web), long description, amenities icons grid, interactive Google Map, "You May Also Like" carousel. Dynamically generated from ATDW API.', 'https://www.queensland.com/in/en/things-to-do/attractions/p-5732903eac497a7464aa4fb5-grays-bay'],
            ['7', 'ATDW Listing Page (Accommodation)', 'High', 'Image gallery, title with price/booking CTA, location, contact icons, description, room types with images, amenities grid, accessibility info, Google Map, "You May Also Like" carousel. Includes booking/deal integration.', 'https://www.queensland.com/in/en/plan-your-holiday/accommodation/p-57342d0894cdc27568dd9149-thala-beach-nature-reserve'],
            ['8', 'Search / Listing Results Page', 'High', 'Hero banner, intro text, search bar with filters (category radio buttons, region/town dropdowns, date pickers), sort dropdown, paginated card grid with thumbnails/descriptions/CTAs, "Go to Site" and "View More" buttons per result.', 'https://www.queensland.com/in/en/things-to-do/events/queensland-events\nhttps://www.queensland.com/in/en/plan-your-holiday/holiday-deals'],
          ]
        ),
        bodyText(''),

        // -----------------------------------------------
        // 3. BLOCKS / COMPONENTS CATALOG
        // -----------------------------------------------
        sectionHeading('3. Blocks / Components Catalog'),
        bodyText('The following reusable blocks and components have been identified across all templates. Design variations of the same content model are noted rather than treated as separate blocks.'),
        bodyText(''),

        subHeading('3.1 Global Components'),
        makeTable(
          ['Block Name', 'Complexity', 'Description / Behavior', 'Reference URL(s)'],
          [
            ['Navigation Header', 'High', 'Sticky top navigation with logo, bookmarks icon, search icon, hamburger menu. Two variants: "transparent" (overlays hero on landing pages) and "white" (solid background on detail pages). Mega-menu dropdown with multi-level categories. Market/language selector.', 'All pages'],
            ['Footer', 'Medium', 'Two-column link lists, language/region selector dropdown (12 markets), social media icons (Instagram, Facebook, Twitter, YouTube, Email), Aboriginal acknowledgement text, TEQ + Queensland Government logos, copyright.', 'All pages'],
            ['Newsletter Signup Banner', 'Low', 'Full-width teal banner with envelope icon, heading ("Ready to ROAM?"), description text, and CTA button linking to Adobe Campaign signup form. Appears above footer on most pages. Variant: "Love what you\'re reading?" on article pages.', 'All pages'],
            ['Breadcrumb', 'Low', 'Horizontal breadcrumb trail with ">" separators. Dynamic based on page hierarchy. Appears below hero banner.', 'All pages except homepage'],
            ['Bunji Chat Widget', 'Medium', 'Floating AI chatbot widget (bottom-right). Toggle button, expandable chat window with avatar ("Bunji"), welcome message. Third-party integration.', 'All pages'],
            ['Cookie Consent Banner', 'Low', 'OneTrust cookie consent banner with accept/manage preferences. Appears on first visit.', 'All pages'],
          ]
        ),
        bodyText(''),

        subHeading('3.2 Hero & Banner Components'),
        makeTable(
          ['Block Name', 'Complexity', 'Description / Behavior', 'Reference URL(s)'],
          [
            ['Hero Banner Slider', 'High', 'Full-width image/video carousel with multiple slides, auto-play/pause controls, overlay text (H1 + H2), bookmark button. Fade/slide transitions. Video variant embeds YouTube. Used on homepage, category, events, and listing result pages.', 'https://www.queensland.com/in/en/home\nhttps://www.queensland.com/in/en/things-to-do/events'],
            ['Hero Banner (Static)', 'Medium', 'Full-width single hero image with overlay heading, category badge (LIST/GUIDE/ITINERARY/EVENT), and bookmark button. Used on article and itinerary pages.', 'https://www.queensland.com/in/en/places-to-see/experiences/beaches/secret-queensland-beaches'],
            ['Image Gallery (ATDW)', 'Medium', 'Horizontal image carousel/gallery with navigation arrows and modal lightbox on click. Used on ATDW listing detail pages for attraction/accommodation/tour images.', 'https://www.queensland.com/in/en/things-to-do/attractions/p-5732903eac497a7464aa4fb5-grays-bay'],
          ]
        ),
        bodyText(''),

        subHeading('3.3 Content Components'),
        makeTable(
          ['Block Name', 'Complexity', 'Description / Behavior', 'Reference URL(s)'],
          [
            ['Rich Text / Editorial Section', 'Low', 'Standard rich text block with headings (H2, H3), paragraphs, inline links, bold/italic. Most common block across all editorial pages. Used in article body and destination descriptions.', 'All editorial pages'],
            ['Anchor Link Navigation', 'Low', 'Inline "Jump to:" or "Pick a region:" text with pipe-separated anchor links for in-page navigation. Appears at top of long-form articles.', 'https://www.queensland.com/in/en/things-to-do\nhttps://www.queensland.com/in/en/places-to-see/experiences/beaches/secret-queensland-beaches'],
            ['Author Byline', 'Low', 'Author avatar image, name, and publish date. Appears below hero on article/itinerary pages.', 'https://www.queensland.com/in/en/places-to-see/experiences/beaches/secret-queensland-beaches'],
            ['FAQ Accordion', 'Medium', 'Expandable Q&A section with H3 question headings and paragraph answers. Collapsible accordion behavior. Used for SEO-rich FAQ sections.', 'https://www.queensland.com/in/en/things-to-do'],
            ['Full-Width Image', 'Low', 'Full-width landscape image between editorial sections. Used as visual separator in article pages.', 'https://www.queensland.com/in/en/places-to-see/experiences/beaches/secret-queensland-beaches'],
            ['YouTube Video Embed', 'Low', 'Embedded YouTube player via iframe with custom controls. Used on homepage.', 'https://www.queensland.com/in/en/home'],
          ]
        ),
        bodyText(''),

        subHeading('3.4 Card & Grid Components'),
        makeTable(
          ['Block Name', 'Complexity', 'Description / Behavior', 'Reference URL(s)'],
          [
            ['Article Card Grid', 'Medium', 'Masonry/featured grid layout: 1 large featured card + 6 smaller cards. Each card has image, title, category badge (LIST/GUIDE/ITINERARY/HOW TO/EVENT), and bookmark button. "See more" CTA link at bottom.', 'https://www.queensland.com/in/en/things-to-do\nhttps://www.queensland.com/in/en/plan-your-holiday'],
            ['Category Card Grid', 'Medium', 'Grid of category cards with icon overlay on image, heading, and link. Used for "Explore events by genre" and "Choose what moves you" sections. 1 large + 6 small layout variant.', 'https://www.queensland.com/in/en/things-to-do/events\nhttps://www.queensland.com/in/en/plan-your-holiday'],
            ['ATDW Deal/Result Card', 'High', 'Search result card with image, title, location, description, date range (for events), "Go to Site" and "View More" CTA buttons, deal badge. Displayed in 2-column grid. Used in listing results and deals pages. Includes dynamic data from ATDW API.', 'https://www.queensland.com/in/en/plan-your-holiday/holiday-deals\nhttps://www.queensland.com/in/en/things-to-do/events/queensland-events'],
            ['"You May Also Like" Carousel', 'Medium', 'Horizontal scrollable carousel of related ATDW product cards with image, title, "Go to Site" and "View More" buttons. Previous/next arrow navigation.', 'https://www.queensland.com/in/en/things-to-do/attractions/p-5732903eac497a7464aa4fb5-grays-bay'],
          ]
        ),
        bodyText(''),

        subHeading('3.5 Carousel Components'),
        makeTable(
          ['Block Name', 'Complexity', 'Description / Behavior', 'Reference URL(s)'],
          [
            ['Destination/Category Carousel', 'Medium', 'Horizontal scrollable carousel with image cards showing overlay text (paragraph + H5 heading). Previous/next arrow buttons. Multiple design variants: "Visit [Region]", "Discover [Category]", category tiles. Used across hub/category pages.', 'https://www.queensland.com/in/en/things-to-do (Start Planning)\nhttps://www.queensland.com/in/en/plan-your-holiday (Get to Know Our Regions)\nhttps://www.queensland.com/in/en/things-to-do/events (Explore by Region)'],
            ['Icon Carousel (Explore Destinations)', 'Medium', 'Carousel of square image cards for destinations with text overlay. Larger card format than category carousel. Used on homepage for "Explore Our Destinations".', 'https://www.queensland.com/in/en/home'],
          ]
        ),
        bodyText(''),

        subHeading('3.6 Interactive & Functional Components'),
        makeTable(
          ['Block Name', 'Complexity', 'Description / Behavior', 'Reference URL(s)'],
          [
            ['Search & Filter Panel', 'High', 'Complex search interface with: text search box, category radio filters (All/Attractions & Tours/Events/Accommodation/News & Articles/Food & Drink/Itineraries & Hire), date range pickers, region/town toggle with dropdown, sort-by dropdown (Relevance/A-Z/Best of Queensland/Deal Available/Newest), result count display. Asynchronous results loading.', 'https://www.queensland.com/in/en/things-to-do/events/queensland-events'],
            ['Event Calendar Search', 'Medium', 'Date From/To pickers, Region/Town radio toggle with dropdown, keyword search box, "Find Events" CTA button. Simpler variant of full search panel, used on events hub page.', 'https://www.queensland.com/in/en/things-to-do/events'],
            ['Holiday Finder Widget', 'High', 'Interactive widget for personalized trip recommendations. Referenced in console as teq/components/holiday-finder. Appears on homepage and category pages (component not fully mapped in React bundle, suggesting it may be a newer or external integration).', 'https://www.queensland.com/in/en/home'],
            ['Bookmark System', 'Medium', 'Heart/bookmark icon on hero banners and article cards. Persists bookmarks to user session/local storage. Dedicated "My Bookmarks" page. Count badge on nav icon.', 'All pages with cards'],
            ['Interactive Map (Google Maps)', 'Medium', 'Embedded Google Map with location pin, "Get Directions" CTA link. Used on ATDW listing detail pages.', 'ATDW listing pages'],
            ['Amenities/Accessibility Grid', 'Low', 'Icon + label grid showing amenities (Carpark, BBQ, Boating, etc.) and accessibility features. "Show more" toggle. Used on ATDW accommodation and attraction pages.', 'ATDW listing pages'],
            ['Room Types Section', 'Medium', 'Image + description cards for accommodation room types with "Book Now" CTA. Used on ATDW accommodation pages.', 'https://www.queensland.com/in/en/plan-your-holiday/accommodation/p-57342d0894cdc27568dd9149-thala-beach-nature-reserve'],
            ['Contact Bar (Get In Touch)', 'Low', 'Row of icons for Website, Email, Phone contact methods. Links to external operator site. Used on ATDW listing pages.', 'ATDW listing pages'],
            ['Price Badge / Booking CTA', 'Low', 'Price display ("From $430") with "Book Now" green CTA button on accommodation listings.', 'ATDW accommodation pages'],
          ]
        ),
        bodyText(''),

        // -----------------------------------------------
        // 4. PAGE COUNTS BY TEMPLATE
        // -----------------------------------------------
        sectionHeading('4. Page Counts by Template'),
        bodyText('Page counts are estimated based on sitemap analysis and site structure exploration. The site has 24 sub-sitemaps across 12 markets, each with AEM (authored) and ATDW (data-sourced) content.'),
        bodyText(''),

        subHeading('4.1 Per-Market Page Counts (India/en as representative)'),
        makeTable(
          ['Template', 'Estimated Pages', 'Migration Approach', 'Notes'],
          [
            ['Homepage', '1', 'Manual', 'Unique composition per market; heavy customization with video, interactive widgets'],
            ['Category / Hub Pages', '25–35', 'Semi-Automated', 'Consistent structure but unique editorial content per page; ~5 top-level hubs + 20–30 sub-category hubs'],
            ['Destination Pages', '30–50', 'Semi-Automated', 'Each region + sub-destination; includes dynamic ATDW integrations for deals/events'],
            ['Article / Editorial Pages', '200–350', 'Automated', 'Most standardized template; rich text with inline images. Consistent structure makes bulk migration feasible'],
            ['Itinerary Pages', '30–50', 'Automated', 'Subset of editorial; day-based structure. Consistent format enables automation'],
            ['ATDW Attraction/Tour Listings', '5,000–8,000', 'Requires Custom Integration', 'Dynamically generated from ATDW API. Cannot be statically migrated; need API integration or data feed approach'],
            ['ATDW Accommodation Listings', '3,000–5,000', 'Requires Custom Integration', 'Similar to attraction listings but with room types, pricing, and booking CTAs'],
            ['Search/Listing Results Pages', '10–15', 'Manual/Custom', 'Dynamic pages with API-driven search; need custom search implementation'],
          ]
        ),
        bodyText(''),

        subHeading('4.2 Total Site Scale (All 12 Markets)'),
        makeTable(
          ['Content Type', 'Per Market', 'Total (×12)', 'Migration Type'],
          [
            ['AEM Authored Pages', '~300–500', '~3,600–6,000', 'Automated / Semi-Automated'],
            ['ATDW Listing Pages', '~8,000–13,000', '~15,000–20,000+ (shared pool)', 'Custom API Integration'],
            ['Total Unique Content', '', '~18,000–26,000', 'Mixed approach required'],
          ]
        ),
        bodyText('Note: ATDW listings are largely shared across markets (same attractions/operators), with localized URLs and potential translation. The actual unique ATDW content pool is estimated at 15,000–20,000 listings, presented with localized wrappers per market.'),
        bodyText(''),

        // -----------------------------------------------
        // 5. INTEGRATIONS ANALYSIS
        // -----------------------------------------------
        sectionHeading('5. Integrations Analysis'),
        bodyText('The following third-party integrations and external services have been identified through script analysis, network monitoring, and DOM inspection.'),
        bodyText(''),

        subHeading('5.1 Analytics & Tracking'),
        makeTable(
          ['Integration', 'Type', 'Complexity', 'Details'],
          [
            ['Adobe Experience Platform (Launch/DTM)', 'Tag Management', 'High', 'Primary tag manager via assets.adobedtm.com. Manages all analytics, audience management, and marketing pixels. 20+ rule/extension scripts loaded.'],
            ['Adobe Analytics (AppMeasurement)', 'Analytics', 'High', 'Full Adobe Analytics implementation including Activity Map and Audience Management modules. Deep integration with AEM.'],
            ['Google Analytics 4 (GA4)', 'Analytics', 'Medium', 'Property ID: G-YG4XWKYJJ6. Loaded via Google Tag Manager.'],
            ['Google Analytics Universal', 'Analytics', 'Low', 'Legacy property: UA-55765301-6. Likely in sunset mode.'],
            ['Hotjar', 'Heatmaps/Session Recording', 'Low', 'Site ID: 1178680. Behavior analytics and heatmaps.'],
            ['Adobe Helix RUM', 'Real User Monitoring', 'Low', 'rum.hlx.page — Adobe\'s Edge Delivery real user monitoring. Indicates potential EDS evaluation already underway.'],
          ]
        ),
        bodyText(''),

        subHeading('5.2 Advertising & Marketing Pixels'),
        makeTable(
          ['Integration', 'Type', 'Complexity', 'Details'],
          [
            ['Meta (Facebook) Pixel', 'Ad Tracking', 'Medium', 'Pixel ID: 527373699483702. Full event tracking with JSON-LD parsing. connect.facebook.net/en_US/fbevents.js'],
            ['Pinterest Tag', 'Ad Tracking', 'Low', 'Pin tracking via ct.pinterest.com and s.pinimg.com.'],
            ['TikTok Pixel', 'Ad Tracking', 'Low', 'SDK ID: D2LQL9BC77U0CGBH9GFG. Event tracking via analytics.tiktok.com.'],
            ['StackAdapt', 'Programmatic Ads', 'Low', 'Event tracking via tags.srv.stackadapt.com.'],
            ['Yahoo/Verizon Media', 'Ad Tracking', 'Low', 'Tracking via s.yimg.com/wi/ytc.js.'],
          ]
        ),
        bodyText(''),

        subHeading('5.3 Consent & Privacy'),
        makeTable(
          ['Integration', 'Type', 'Complexity', 'Details'],
          [
            ['OneTrust', 'Cookie Consent', 'Medium', 'Cookie consent management platform via cdn-au.onetrust.com. Manages GDPR/privacy compliance across all 12 markets.'],
          ]
        ),
        bodyText(''),

        subHeading('5.4 Content & Functionality'),
        makeTable(
          ['Integration', 'Type', 'Complexity', 'Details'],
          [
            ['ATDW (Australian Tourism Data Warehouse)', 'API / Data Feed', 'High', 'Core content source for all attraction, tour, accommodation, event, and food/drink listings. Drives ~80% of site page volume. Provides images, descriptions, amenities, location data, pricing, and deals.'],
            ['Google Maps', 'Embed / API', 'Medium', 'Interactive maps on ATDW listing detail pages with location pins and direction links.'],
            ['YouTube', 'Video Embed', 'Low', 'Embedded video player on homepage via iframe_api. Channel: Queensland, Australia.'],
            ['Adobe Campaign (Email)', 'Marketing Automation', 'Medium', 'Newsletter signup form hosted at queensland-mkt-prod1-m.adobe-campaign.com/lp/signUpForm. "Ready to ROAM?" newsletter CTA across all pages.'],
            ['Bunji AI Chatbot', 'Chat Widget', 'High', 'AI-powered tourism chatbot assistant. Custom-built chat interface with floating toggle. Appears on all pages.'],
            ['iframe-resizer', 'Utility Library', 'Low', 'Used for responsive iframe sizing (v5, now @iframe-resizer/react).'],
          ]
        ),
        bodyText(''),

        // -----------------------------------------------
        // 6. COMPLEX USE CASES
        // -----------------------------------------------
        sectionHeading('6. Complex Use Cases & Observations'),
        bodyText('The following complex behaviors, edge cases, and functionality require special attention during migration.'),
        bodyText(''),

        makeTable(
          ['#', 'Use Case', 'Instances', 'Location', 'Why It\'s Complex'],
          [
            ['1', 'ATDW Dynamic Listing Pages', '15,000–20,000+', 'All /attractions/, /tours/, /accommodation/, /events/ detail URLs with p-{id} pattern', 'Content is dynamically sourced from the ATDW API, not authored in AEM. Requires building a custom data integration layer in EDS to fetch, cache, and render ATDW product data. Includes images, amenities, maps, pricing, and deals. This is the single largest migration complexity.'],
            ['2', 'Multi-Market Localization (12 markets, 7 languages)', 'All pages × 12', 'Every URL has /{market}/{language}/ prefix (e.g., /in/en/, /fr/fr/, /jp/ja/)', 'Each market has its own content tree, URL structure, navigation, and potentially different page compositions. Translation workflows for 7 languages (EN, FR, DE, ZH, JA, KO + regional EN variants). Must preserve SEO equity across all market URLs.'],
            ['3', 'Search & Filter System', '10–15 search result pages', 'Event listing, holiday deals, accommodation search, attraction search', 'React-based SPA with asynchronous ATDW API calls, faceted filtering (category, region/town, date range, keyword), sorting, and pagination. Must be rebuilt as custom EDS functionality or headless search service.'],
            ['4', 'Holiday Finder Widget', '~5 pages', 'Homepage, category pages', 'Interactive recommendation engine (teq/components/holiday-finder). Currently unmapped React component, suggesting it may use a separate API/service. Needs investigation and potential rebuild.'],
            ['5', 'Bunji AI Chatbot', 'All pages (global)', 'Floating widget on every page', 'Custom AI chatbot with tourism knowledge base. Likely backed by an AI/NLP service. Must be integrated as an external embed or rebuilt in EDS context.'],
            ['6', 'Bookmark / Favourites System', 'All pages with cards', 'Hero banners, article cards, ATDW listings, dedicated /my-bookmarks page', 'Client-side bookmark persistence (likely localStorage or session). Heart icon UI across 20+ block variants. Dedicated bookmarks aggregation page. Needs custom JS implementation in EDS.'],
            ['7', 'Dynamic Deals & Pricing', '3,000–5,000 accommodation + deals pages', 'Accommodation listings, holiday deals page', 'Real-time pricing ("From $430"), availability, and deal badges sourced from ATDW. "Book Now" CTAs link to external operator booking engines. Requires live data feed integration.'],
            ['8', 'Adobe Analytics Deep Integration', 'All pages', 'Global — 20+ DTM scripts loaded', 'Extensive Adobe Analytics implementation with Activity Map, Audience Management, and multiple custom event rules. Must be reconfigured for EDS architecture where page loads differ fundamentally.'],
            ['9', 'React SPA Architecture', 'All pages', 'teq-react.min.js renders all page components', 'Current site is a React SPA served by AEM. Components are loaded dynamically via loadable components pattern. Migration to EDS vanilla JS requires complete front-end rebuild, not just content transfer.'],
            ['10', 'SEO Structured Data / JSON-LD', 'All pages', 'Head metadata', 'JSON-LD structured data for tourism entities. Facebook Pixel already reports parsing errors with current JSON-LD. Must be correctly reimplemented for each template type in EDS.'],
          ]
        ),
        bodyText(''),

        // -----------------------------------------------
        // 7. MIGRATION ESTIMATES
        // -----------------------------------------------
        sectionHeading('7. Migration Estimates'),
        bodyText('The following estimates assume a phased migration approach with a core team of 4–6 developers, 1 content strategist, and 1 QA engineer. Estimates are for ONE market (English) as a pilot, with subsequent markets following a streamlined process.'),
        bodyText(''),

        subHeading('7.1 Phase 1: Foundation & Design System (Weeks 1–4)'),
        makeTable(
          ['Task', 'Effort (Days)', 'Notes'],
          [
            ['EDS project setup, boilerplate configuration', '2–3', 'Standard EDS project init, CI/CD setup'],
            ['Design system migration (CSS tokens, typography, colors)', '5–7', 'Extract Queensland brand design tokens, teal/dark palette, responsive breakpoints'],
            ['Global components (Header, Footer, Cookie Consent)', '8–10', 'Navigation mega-menu is the most complex piece; footer relatively straightforward'],
            ['Newsletter signup banner', '1–2', 'Simple CTA block with Adobe Campaign link'],
            ['Breadcrumb component', '1', 'Standard EDS pattern'],
            ['Total Phase 1', '17–23 days', '~4–5 weeks'],
          ]
        ),
        bodyText(''),

        subHeading('7.2 Phase 2: Core Templates & Blocks (Weeks 5–10)'),
        makeTable(
          ['Task', 'Effort (Days)', 'Notes'],
          [
            ['Hero Banner Slider (with video variant)', '5–7', 'Multi-slide carousel with auto-play, video embed support'],
            ['Article/Editorial page template + blocks', '5–7', 'Rich text, author byline, anchor nav, inline images, related grid'],
            ['Itinerary page template', '2–3', 'Variant of article template with day structure'],
            ['Category/Hub page template', '5–7', 'Carousel, card grids, FAQ accordion, editorial sections'],
            ['Destination page template', '7–10', 'Most complex authored template; combines multiple block types + dynamic content areas'],
            ['Card components (Article, Category, Deal)', '5–7', 'Multiple card variants with bookmark integration'],
            ['Carousel component (all variants)', '5–7', 'Destination, category, and related items carousels'],
            ['FAQ Accordion', '1–2', 'Standard accordion pattern'],
            ['Total Phase 2', '35–50 days', '~6–8 weeks'],
          ]
        ),
        bodyText(''),

        subHeading('7.3 Phase 3: ATDW Integration & Dynamic Pages (Weeks 11–18)'),
        makeTable(
          ['Task', 'Effort (Days)', 'Notes'],
          [
            ['ATDW API integration layer', '10–15', 'Data fetching, caching, transformation layer for EDS. This is the core technical challenge.'],
            ['ATDW Listing Detail template (Attraction/Tour)', '7–10', 'Image gallery, description, amenities, map, related items'],
            ['ATDW Listing Detail template (Accommodation)', '5–7', 'Extension of attraction template with rooms, pricing, booking'],
            ['Search & Filter system', '15–20', 'Faceted search with ATDW API, category/region/date filters, sort, pagination. Most complex interactive component.'],
            ['Google Maps integration', '2–3', 'Embed maps on listing pages'],
            ['Holiday Deals page', '3–5', 'Deal cards with dynamic ATDW data'],
            ['Event Calendar integration', '3–5', 'Date-based event search and filtering'],
            ['Total Phase 3', '45–65 days', '~8–12 weeks'],
          ]
        ),
        bodyText(''),

        subHeading('7.4 Phase 4: Advanced Features & Integrations (Weeks 19–22)'),
        makeTable(
          ['Task', 'Effort (Days)', 'Notes'],
          [
            ['Bookmark/Favourites system', '3–5', 'Client-side localStorage + UI across all card types'],
            ['Bunji AI Chatbot integration', '3–5', 'External service embed, likely iframe or JS widget'],
            ['Holiday Finder widget', '5–10', 'Depends on underlying service; may need custom rebuild or embed'],
            ['Analytics migration (Adobe Launch + GA4)', '5–7', 'Reconfigure tag management for EDS page lifecycle'],
            ['Advertising pixel migration', '2–3', 'Facebook, Pinterest, TikTok, StackAdapt, Yahoo pixels'],
            ['OneTrust consent management', '2–3', 'Configure for EDS architecture'],
            ['SEO: redirects, meta, structured data', '5–7', 'Preserve URL equity, implement JSON-LD per template'],
            ['Total Phase 4', '25–40 days', '~4–6 weeks'],
          ]
        ),
        bodyText(''),

        subHeading('7.5 Phase 5: Content Migration & QA (Weeks 23–28)'),
        makeTable(
          ['Task', 'Effort (Days)', 'Notes'],
          [
            ['Import script development for editorial pages', '5–7', 'Automated content extraction and transformation'],
            ['Bulk content migration (~300–500 pages)', '5–10', 'Run import scripts, verify output, fix edge cases'],
            ['ATDW content pipeline setup', '3–5', 'Configure data feed processing for dynamic listing pages'],
            ['Cross-browser / device testing', '5–7', 'Chrome, Safari, Firefox, Edge; mobile/tablet/desktop'],
            ['Accessibility testing (WCAG 2.1 AA)', '3–5', 'Screen reader, keyboard nav, contrast checks'],
            ['Performance testing (Lighthouse 100 target)', '3–5', 'EDS standard; optimize LCP, CLS, TBT'],
            ['UAT and stakeholder review', '5–10', 'Content author review, design QA, functionality sign-off'],
            ['Total Phase 5', '29–49 days', '~5–8 weeks'],
          ]
        ),
        bodyText(''),

        subHeading('7.6 Phase 6: Multi-Market Rollout (Weeks 29–40)'),
        makeTable(
          ['Task', 'Effort (Days)', 'Notes'],
          [
            ['Market localization framework', '5–7', 'URL structure, locale switching, content adaptation'],
            ['Content migration per additional market (×11)', '33–55', '3–5 days per market for content adaptation'],
            ['Translation integration', '5–10', 'Non-English markets (FR, DE, ZH, JA, KO)'],
            ['Market-specific QA (×11)', '11–22', '1–2 days per market'],
            ['Total Phase 6', '54–94 days', '~10–16 weeks'],
          ]
        ),
        bodyText(''),

        subHeading('7.7 Overall Migration Summary'),
        makeTable(
          ['Category', 'Effort Estimate', 'Calendar Duration'],
          [
            ['Phase 1: Foundation & Design', '17–23 person-days', '4–5 weeks'],
            ['Phase 2: Core Templates & Blocks', '35–50 person-days', '6–8 weeks'],
            ['Phase 3: ATDW Integration & Dynamic Pages', '45–65 person-days', '8–12 weeks'],
            ['Phase 4: Advanced Features', '25–40 person-days', '4–6 weeks'],
            ['Phase 5: Content Migration & QA (1 market)', '29–49 person-days', '5–8 weeks'],
            ['Phase 6: Multi-Market Rollout', '54–94 person-days', '10–16 weeks'],
            ['TOTAL (All Phases)', '205–321 person-days', '~37–55 weeks (9–14 months)'],
          ]
        ),
        bodyText(''),

        subHeading('7.8 Cost Estimate'),
        makeTable(
          ['Item', 'Low Estimate', 'High Estimate', 'Assumptions'],
          [
            ['Development (205–321 person-days)', '$164,000', '$320,000', 'Blended rate $800–$1,000/day for 4–6 developers'],
            ['Design/UX', '$20,000', '$40,000', 'Design system adaptation, component design review'],
            ['Content Strategy & Migration', '$15,000', '$30,000', 'Content audit, mapping, migration QA'],
            ['Project Management', '$25,000', '$45,000', '~15% of development effort'],
            ['QA & Testing', '$20,000', '$40,000', 'Dedicated QA across all phases'],
            ['Contingency (15%)', '$36,600', '$71,250', 'Risk buffer for unknowns'],
            ['TOTAL ESTIMATED COST', '$280,600', '$546,250', 'Full 12-market migration'],
          ]
        ),
        bodyText(''),
        bodyText('Key Risks & Assumptions:'),
        bulletText('ATDW API access and documentation availability is the primary risk factor. If API access is restricted or poorly documented, Phase 3 estimates could increase by 50–100%.'),
        bulletText('The Bunji AI chatbot integration depends on the underlying service being available as an embeddable widget.'),
        bulletText('Multi-market rollout assumes content structure is largely shared across markets with localized text.'),
        bulletText('Estimates assume an experienced EDS development team. Ramp-up time for AEM-to-EDS skills transition may add 2–4 weeks.'),
        bulletText('The current React SPA architecture means this is a complete front-end rebuild, not a lift-and-shift migration.'),

        new Paragraph({ children: [new PageBreak()] }),

        // -----------------------------------------------
        // 8. SCREENSHOTS APPENDIX
        // -----------------------------------------------
        sectionHeading('8. Screenshots Appendix'),
        bodyText('The following screenshots document the current state of key page templates on queensland.com.'),
        bodyText(''),

        subHeading('8.1 Homepage'),
        addImage('queensland-homepage-full.png', 450, 620),
        bodyText(''),

        subHeading('8.2 Category / Hub Page (Places to See)'),
        addImage('queensland-places-to-see.png', 450, 680),
        bodyText(''),

        subHeading('8.3 Category / Hub Page (Things to Do)'),
        addImage('queensland-things-to-do.png', 450, 750),
        bodyText(''),

        subHeading('8.4 Destination Page (Brisbane)'),
        addImage('queensland-brisbane-destination.png', 450, 800),
        bodyText(''),

        subHeading('8.5 Events Hub Page'),
        addImage('queensland-events.png', 450, 700),
        bodyText(''),

        subHeading('8.6 Search / Listing Results Page'),
        addImage('queensland-event-listing.png', 450, 750),
        bodyText(''),

        subHeading('8.7 ATDW Attraction Listing Page'),
        addImage('queensland-atdw-attraction.png', 450, 650),
        bodyText(''),

        subHeading('8.8 ATDW Accommodation Listing Page'),
        addImage('queensland-accommodation-listing.png', 450, 700),
        bodyText(''),

        subHeading('8.9 Article / Editorial Page'),
        bodyText('See Itinerary page below for representative editorial layout.'),
        bodyText(''),

        subHeading('8.10 Itinerary Page'),
        addImage('queensland-itinerary.png', 450, 700),
        bodyText(''),

        subHeading('8.11 Holiday Deals Page'),
        addImage('queensland-holiday-deals.png', 450, 750),
        bodyText(''),

        // END
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({ children: [new TextRun({ text: '— End of Report —', bold: true, color: TEAL, size: 24, font: 'Calibri' })], alignment: AlignmentType.CENTER }),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
const outputPath = '/workspace/Queensland_Migration_Analysis_Report.docx';
fs.writeFileSync(outputPath, buffer);
console.log(`Report generated: ${outputPath}`);
console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
