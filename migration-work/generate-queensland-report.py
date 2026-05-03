#!/usr/bin/env python3
"""Generate Queensland.com EDS Migration Analysis Word Document."""

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

doc = Document()
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(10)

for level in range(1, 5):
    doc.styles[f'Heading {level}'].font.color.rgb = RGBColor(0x00, 0x6E, 0x8C)

def set_cell_shading(cell, color):
    shading_elm = OxmlElement('w:shd')
    shading_elm.set(qn('w:fill'), color)
    shading_elm.set(qn('w:val'), 'clear')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def create_table(doc, headers, rows):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        set_cell_shading(hdr_cells[i], '006E8C')
        for p in hdr_cells[i].paragraphs:
            for r in p.runs:
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                r.bold = True
                r.font.size = Pt(9)
    for row_data in rows:
        row = table.add_row()
        for i, val in enumerate(row_data):
            row.cells[i].text = str(val)
            for p in row.cells[i].paragraphs:
                for r in p.runs:
                    r.font.size = Pt(9)
    return table

def add_screenshot(doc, path, caption, width=5.0):
    if os.path.exists(path):
        doc.add_picture(path, width=Inches(width))
        last_paragraph = doc.paragraphs[-1]
        last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap = doc.add_paragraph(caption)
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if cap.runs:
            cap.runs[0].italic = True
            cap.runs[0].font.size = Pt(8)

# ============ TITLE PAGE ============
doc.add_paragraph()
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run('Queensland.com\nEdge Delivery Services\nMigration Analysis Report')
run.font.size = Pt(26)
run.font.color.rgb = RGBColor(0x00, 0x6E, 0x8C)
run.bold = True

doc.add_paragraph()
subtitle = doc.add_paragraph()
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = subtitle.add_run('Comparative Analysis of 4 Page Types\nfor EDS Migration Feasibility')
run.font.size = Pt(13)
run.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

doc.add_paragraph()
date_p = doc.add_paragraph()
date_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = date_p.add_run('Date: May 3, 2026\nSite: https://www.queensland.com/')
run.font.size = Pt(11)

doc.add_paragraph()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run('Pages Analyzed:\n1. Homepage (/au/en/home)\n2. Road Trip Itinerary (Matilda Way)\n3. Accommodation Detail (Saltbush Retreat)\n4. Events Listing (Gold Coast Events)')
run.font.size = Pt(10)

doc.add_page_break()

# ============ SECTION 1: TEMPLATES INVENTORY ============
doc.add_heading('1. Templates Inventory', level=1)
doc.add_paragraph('Four distinct page templates were identified across the analyzed URLs. Each represents a unique content pattern requiring separate template development.')

templates = [
    ['1', 'Homepage', 'High', 'Hero banner slider (3 slides), editorial intro, seasonal info cards, "What\'s on" carousel, roadtrip carousel, CTA banner (image+text), YouTube video embed, regions map carousel (12 items), masonry category grid (7 items), events carousel (6 items), article masonry grid (7 items), destinations carousel (11 items), newsletter signup banner', 'https://www.queensland.com/au/en/home'],
    ['2', 'Road Trip / Itinerary Page', 'High', 'Hero image with author byline, YouTube video embed, editorial introduction with trip stats, interactive Mapbox route map with experience pins, multi-day tabbed itinerary (8 days/16 stops), experience cards with "View in Map", FAQ accordion, related content grid, newsletter banner', 'https://www.queensland.com/au/en/plan-your-holiday/road-trips/matilda-way-road-trip'],
    ['3', 'ATDW Product Detail (Accommodation)', 'Medium-High', 'Multi-image gallery carousel with modal lightbox, product header (title/rating/location/category), breadcrumb, contact action bar, pricing & booking CTA, rich text description, room cards with sub-galleries, amenities grid, accessibility info, Mapbox location map', 'https://www.queensland.com/au/en/plan-your-holiday/accommodation/p-5cf9ed1f42775eca113d78d9-saltbush-retreat'],
    ['4', 'Events Listing / Search Results', 'High', 'Hero slider, breadcrumb, editorial intro with "Read More", search input, category filter tabs with counts, advanced filter panel, sort dropdown, map view toggle, event listing cards with external booking CTAs, "Load More" pagination, newsletter banner', 'https://www.queensland.com/au/en/things-to-do/events/gold-coast-events'],
]

create_table(doc, ['#', 'Template Name', 'Complexity', 'Key Sections & Components', 'Reference URL'], templates)

doc.add_paragraph()
doc.add_heading('1.1 Template Complexity Summary', level=2)

complexity_summary = [
    ['Total Templates Identified', '4'],
    ['High Complexity', '3 (Homepage, Road Trip, Events Listing)'],
    ['Medium-High Complexity', '1 (Accommodation Detail)'],
    ['Reason for High Ratings', 'Interactive maps (Mapbox), dynamic ATDW data feeds, multi-slide carousels, YouTube embeds, tabbed itineraries, search/filter with pagination, and multiple API integrations'],
]
create_table(doc, ['Metric', 'Value'], complexity_summary)

doc.add_page_break()

# ============ SECTION 2: BLOCKS / COMPONENTS CATALOG ============
doc.add_heading('2. Blocks / Components Catalog', level=1)
doc.add_paragraph('The following reusable blocks were identified. Design variations of the same content model are grouped as variants rather than separate blocks.')

doc.add_heading('2.1 Global Blocks (All Pages)', level=2)

global_blocks = [
    ['1', 'header-navigation', 'Medium', 'Global nav with logo, bookmarks, search button, hamburger menu. Design variants: transparent (homepage/roadtrip/events), white (accommodation detail). Includes mobile drawer.'],
    ['2', 'footer', 'Medium', 'Two link columns, language/region selector dropdown (13 markets), social media icons (5), Acknowledgement of Country text, TEQ + QLD Government logos.'],
    ['3', 'newsletter-signup-banner', 'Low', '"Ready to ROAM?" full-width banner with heading, description text, and "Sign up now" CTA linking to Adobe Campaign form.'],
    ['4', 'bunji-chatbot', 'Medium', 'AI chatbot widget (floating bottom-right). Welcome message, toggle visibility, close button. Third-party service integration.'],
    ['5', 'cookie-consent', 'Low', 'OneTrust cookie consent banner. Standard third-party embed.'],
    ['6', 'breadcrumb', 'Low', 'Page hierarchy navigation trail with linked segments.'],
]
create_table(doc, ['#', 'Block Name', 'Complexity', 'Description & Behaviour'], global_blocks)

doc.add_heading('2.2 Homepage Blocks', level=2)

homepage_blocks = [
    ['7', 'hero-banner-slider', 'High', 'Full-width image/video carousel (3 slides) with text overlay, CTA buttons, media controls (play/pause), and bookmark. Auto-advances.'],
    ['8', 'editorial-description', 'Low', 'Rich text section with heading, body paragraphs, and inline links.'],
    ['9', 'seasonal-info-cards', 'Low-Medium', 'Two side-by-side cards showing current season activity + temperature data with icons.'],
    ['10', 'category-cards-row', 'Medium', 'Horizontal row of 4 image cards (Events, What\'s New, Deals, Drive Holidays) with icon overlays and linked headings.'],
    ['11', 'content-carousel', 'Medium', 'Horizontal card carousel with prev/next navigation. Variants: roadtrip carousel (4 items), events carousel (6 items), destinations carousel (11 items). Same interaction pattern, different card content.'],
    ['12', 'region-map-carousel', 'High', 'Interactive carousel with 12 Queensland regions, each showing image, heading, description, and "Explore now" CTA. Includes indigenous artwork display panel and region navigation.'],
    ['13', 'masonry-grid', 'Medium', 'Responsive grid layout. Variants: category grid (Beaches, GBR, etc. - 7 items) and article grid (7 items with category tags and bookmarks). Different card sizes create masonry effect.'],
    ['14', 'cta-banner', 'Medium', 'Full-width promotional section. Variants: (a) Image left + text right; (b) YouTube video left + text right. Same content model (heading, description, CTA link).'],
]
create_table(doc, ['#', 'Block Name', 'Complexity', 'Description & Behaviour'], homepage_blocks)

doc.add_heading('2.3 Road Trip / Itinerary Blocks', level=2)

roadtrip_blocks = [
    ['15', 'hero-editorial', 'Medium', 'Full-width hero image with category label ("ITINERARY"), H1 heading, bookmark button, and author byline (avatar, name, date).'],
    ['16', 'youtube-video-embed', 'Low', 'Responsive YouTube iframe embed with standard player controls.'],
    ['17', 'trip-stats-bar', 'Low', 'Three icon+stat cards in a row (Days, Stops, KM distance).'],
    ['18', 'itinerary-map', 'Very High', 'Mapbox GL interactive map showing full route path, clickable experience pins, filter controls, zoom. Powered by Mapbox API with custom style. Most complex single component.'],
    ['19', 'trip-timeline', 'High', 'Multi-day tabbed navigation (Trip Overview + Day 1-6). Each day contains: heading, distance/stops, hero thumbnails, rich editorial text, and experience cards. Complex state management.'],
    ['20', 'experience-card', 'Medium', 'Card with image, category label, title, address, and "View in map" button that highlights pin on itinerary map. Used within trip-timeline.'],
    ['21', 'faq-accordion', 'Low-Medium', 'Expandable Q&A sections with question headings and answer content.'],
    ['22', 'related-content-grid', 'Medium', 'Horizontal card carousel with article cards (image, category tag, title, bookmark). "Explore more" CTA link.'],
]
create_table(doc, ['#', 'Block Name', 'Complexity', 'Description & Behaviour'], roadtrip_blocks)

doc.add_heading('2.4 Accommodation Detail Blocks', level=2)

accommodation_blocks = [
    ['23', 'product-gallery-carousel', 'Medium-High', 'Multi-image carousel (9 images) with thumbnail navigation, modal lightbox view, and "Best of Queensland" quality badge overlay.'],
    ['24', 'product-header', 'Low-Medium', 'Product title (H1), star rating display, location link, category label, and bookmark button.'],
    ['25', 'contact-action-bar', 'Low', 'Row of action buttons: Email, Call, Website — each with icon.'],
    ['26', 'pricing-booking-cta', 'Low-Medium', '"Price from $X" display with "Go to site" CTA button linking through ATDW redirect to external booking engine.'],
    ['27', 'room-cards', 'Medium', 'Room type cards with sub-image gallery ("+N more images"), star rating, description text, and "Read More" expand button.'],
    ['28', 'amenities-grid', 'Low-Medium', 'Featured amenities with icons (top 3), then categorized expandable lists (Internet, Facilities, Accessibility).'],
    ['29', 'address-map-card', 'Medium', 'Property info card with image, name, full address, phone, "Get Directions" link (Google Maps), and Mapbox location pin map.'],
]
create_table(doc, ['#', 'Block Name', 'Complexity', 'Description & Behaviour'], accommodation_blocks)

doc.add_heading('2.5 Events Listing Blocks', level=2)

events_blocks = [
    ['30', 'search-filter-bar', 'High', 'Text search input + category radio filter tabs showing result counts per category (All, Attractions, Events, Accommodation, etc.). Dynamically updates results.'],
    ['31', 'advanced-filters', 'Medium-High', 'Expandable filter panel with additional filter criteria, "Clear filters" button. Works with search bar to refine results.'],
    ['32', 'sort-dropdown', 'Low-Medium', 'Dropdown select for sorting results (Relevance, Best of Queensland, A-Z, Deal Available, Newest).'],
    ['33', 'map-view-toggle', 'Medium', 'Button to switch between list view and map view of results. Map view shows Mapbox with pins.'],
    ['34', 'event-listing-card', 'Medium', 'Card with image, "EVENT" label, title (H3), date range, description snippet, "Go to site" CTA (ATDW redirect), "View more" link, bookmark button.'],
    ['35', 'load-more-pagination', 'Low', 'Button to load next page of results. Shows "Showing X results" count above.'],
]
create_table(doc, ['#', 'Block Name', 'Complexity', 'Description & Behaviour'], events_blocks)

doc.add_heading('2.6 Block Complexity Summary', level=2)
block_summary = [
    ['Total Unique Blocks', '35'],
    ['Very High', '1 (itinerary-map)'],
    ['High', '5 (hero-banner-slider, region-map-carousel, trip-timeline, search-filter-bar, advanced-filters — combined with map view)'],
    ['Medium-High', '3 (product-gallery-carousel, advanced-filters, itinerary map interactions)'],
    ['Medium', '13'],
    ['Low-Medium', '7'],
    ['Low', '6'],
]
create_table(doc, ['Metric', 'Value'], block_summary)

doc.add_page_break()

# ============ SECTION 3: PAGE COUNTS BY TEMPLATE ============
doc.add_heading('3. Page Counts by Template', level=1)
doc.add_paragraph('Estimated page counts based on site structure analysis, navigation patterns, and content categories observed across queensland.com.')

page_counts = [
    ['Homepage', '1 (+ 12 market variants: AU, IN, NZ, SG, UK, US, DE, FR, TW, JP, HK, KR)', '~13', 'Automated (template reuse, localized content)', '0'],
    ['Road Trip / Itinerary', 'Matilda Way + 15-20 other road trips visible in navigation and carousels', '~20', 'Semi-Automated (CMS content, but complex map data and day-by-day content)', '~5 (map route data, custom itinerary content)'],
    ['ATDW Product Detail (Accommodation)', 'Thousands of accommodation listings sourced from ATDW', '~5,000+', 'Automated (API-driven, standardized data structure from ATDW feed)', '~50 (edge cases, custom badges)'],
    ['Events Listing / Search', 'Gold Coast Events + ~12 destination event pages + category pages', '~25', 'Semi-Automated (template reuse, dynamic content from ATDW API)', '~5 (custom editorial intros)'],
    ['Destination Pages', 'Brisbane, Gold Coast, Sunshine Coast, Whitsundays, Cairns, etc. (observed in carousels)', '~50', 'Semi-Automated (CMS-authored editorial + ATDW listings)', '~20 (custom editorial, unique sections)'],
    ['Experience/Category Pages', 'Beaches, Islands, Nature, Reef, Cities, etc.', '~30', 'Semi-Automated', '~10'],
    ['News/Articles', 'Blog articles, guides, how-tos (observed in grids)', '~200+', 'Automated (standard article template)', '~20 (custom rich media)'],
    ['ATDW Product Detail (Tours/Attractions)', 'Similar to accommodation but for tours and attractions', '~3,000+', 'Automated (API-driven)', '~30'],
    ['Info/Utility Pages', 'About, Privacy, Terms, Cookies, Preferences', '~15', 'Automated', '0'],
]
create_table(doc, ['Template Type', 'Description', 'Est. Page Count', 'Migration Type (Auto/Semi/Manual)', 'Manual Pages'], page_counts)

doc.add_paragraph()
doc.add_heading('3.1 Migration Summary', level=2)
migration_summary = [
    ['Automated (API-driven ATDW products)', '~8,000+', '~85%', 'Accommodation, tours, attractions, events from ATDW feed. Standardized data structure.'],
    ['Semi-Automated (CMS templates with content)', '~300', '~10%', 'Destination pages, itineraries, event listings, category pages. Template reuse but unique content.'],
    ['Manual (Custom/unique layouts)', '~110', '~5%', 'Homepage variants, complex itineraries with custom maps, unique editorial features.'],
    ['Total Estimated', '~8,400+', '100%', ''],
]
create_table(doc, ['Type', 'Pages', '% of Total', 'Notes'], migration_summary)

doc.add_page_break()

# ============ SECTION 4: INTEGRATIONS ANALYSIS ============
doc.add_heading('4. Integrations Analysis', level=1)
doc.add_paragraph('All four analyzed pages share a common integration stack. The following third-party services were identified.')

doc.add_heading('4.1 Core Platform Integrations', level=2)
core_integrations = [
    ['1', 'Adobe Experience Manager (AEM)', 'Platform/CMS', 'High', 'Current CMS. React-based SPA frontend (teq-react). Custom components under teq/components/* namespace.', 'All pages'],
    ['2', 'Australian Tourism Data Warehouse (ATDW)', 'API', 'Very High', 'Primary content source for accommodation, tours, events, attractions. Product IDs, images, descriptions, pricing, booking links all sourced from ATDW. Redirect service for booking CTAs.', 'Accommodation, Events, Search results'],
    ['3', 'Mapbox GL JS', 'API/Embed', 'High', 'Interactive maps for itinerary routes (with pins, filters) and product location pins. Custom map style (cmk1ts9yx001q01slb16893it). Account: teqplatforms.', 'Road trip, Accommodation, Events (map view)'],
    ['4', 'YouTube iframe API', 'Embed', 'Low', 'Embedded video players for promotional content. Standard iframe embed.', 'Homepage, Road trip'],
    ['5', 'Adobe Campaign', 'API/External Link', 'Medium', 'Email newsletter signup forms. Links to external Adobe Campaign landing pages (queensland-mkt-prod1-m.adobe-campaign.com).', 'All pages (newsletter banner)'],
    ['6', 'Bunji Chatbot', 'Embed', 'Medium-High', 'AI-powered conversational assistant widget. Floating chat interface with welcome messages.', 'All pages'],
]
create_table(doc, ['#', 'Integration', 'Type', 'Complexity', 'Description', 'Pages Used'], core_integrations)

doc.add_heading('4.2 Analytics & Marketing', level=2)
analytics = [
    ['7', 'Adobe Launch (DTM)', 'Embed', 'Medium', 'Tag management system orchestrating all Adobe and third-party tags.', 'All pages'],
    ['8', 'Adobe Analytics (AppMeasurement)', 'Embed', 'Medium', 'Site analytics with Activity Map and Audience Management modules.', 'All pages'],
    ['9', 'Adobe Helix RUM', 'Embed', 'Low', 'Real User Monitoring via rum.hlx.page (Edge Delivery performance monitoring).', 'All pages'],
    ['10', 'Google Analytics (UA + GA4)', 'Embed', 'Low', 'UA-55765301-6 + G-YG4XWKYJJ6. Dual tracking.', 'All pages'],
    ['11', 'Google Ads / DoubleClick', 'Embed', 'Low', 'DC-8929611 conversion tracking + remarketing pixels.', 'All pages'],
    ['12', 'Facebook/Meta Pixel', 'Embed', 'Low', 'Social ad tracking and remarketing.', 'All pages'],
    ['13', 'TikTok Pixel', 'Embed', 'Low', 'D2LQL9BC77U0CGBH9GFG — social ad tracking.', 'All pages'],
    ['14', 'Pinterest Tag', 'Embed', 'Low', 'Ad tracking and conversion measurement.', 'All pages'],
    ['15', 'StackAdapt', 'Embed', 'Low', 'Programmatic advertising tracking.', 'All pages'],
    ['16', 'Yahoo/Verizon Media Pixel', 'Embed', 'Low', 'Ad tracking.', 'All pages'],
    ['17', 'Hotjar', 'Embed', 'Low', 'Heatmaps, session recordings, user feedback. ID: 1178680.', 'All pages'],
    ['18', 'OneTrust', 'Embed', 'Medium', 'Cookie consent management (GDPR/privacy compliance). AU CDN.', 'All pages'],
]
create_table(doc, ['#', 'Integration', 'Type', 'Complexity', 'Description', 'Pages Used'], analytics)

doc.add_heading('4.3 Integration Complexity Summary', level=2)
int_summary = [
    ['Core Platform & Data', '6', 'Very High to Medium', 'AEM, ATDW, Mapbox, YouTube, Adobe Campaign, Chatbot'],
    ['Analytics & Marketing', '12', 'Low to Medium', 'All manageable via GTM/Adobe Launch in delayed.js'],
    ['Total Integrations', '18', '', ''],
]
create_table(doc, ['Category', 'Count', 'Complexity Range', 'Notes'], int_summary)

doc.add_page_break()

# ============ SECTION 5: COMPLEX USE CASES ============
doc.add_heading('5. Complex Use Cases & Observations', level=1)
doc.add_paragraph('The following complex behaviours require special attention during migration.')

complex_cases = [
    ['1', 'ATDW Dynamic Product Feed', '~8,000+ pages', 'Accommodation, Tours, Events detail pages', 'Very High', 'All product listings are sourced from ATDW API. Content includes images, descriptions, pricing, rooms, amenities, coordinates, booking links. Must integrate ATDW feed or replicate data in EDS authoring model.'],
    ['2', 'Mapbox Interactive Route Maps', '~20 road trip pages', 'Itinerary pages (Matilda Way, Pacific Coast Way, etc.)', 'Very High', 'Custom Mapbox GL maps with drawn route paths, clickable experience pins, day-by-day filtering, and "View in map" interactions from experience cards. Requires Mapbox API key, custom styles, and GeoJSON route data.'],
    ['3', 'Search & Filter with ATDW API', '~25+ listing pages', 'Events listings, accommodation search, attractions search', 'High', 'Dynamic search with text input, category filter tabs (showing live result counts), advanced filters, sort options, map view toggle, and "Load More" pagination. All powered by ATDW search API returning paginated results.'],
    ['4', 'Multi-Market Localization', '13 market variants', 'All pages (AU, IN, NZ, SG, UK, US, DE, FR, TW, JP, HK, KR)', 'High', 'Same content served across 13 regional variants with language/locale switching. URL structure: /{market}/{lang}/path. Affects navigation, footer, currency, and potentially content prioritization.'],
    ['5', 'React SPA Architecture', 'Entire site', 'All pages', 'High', 'Current site is a React SPA rendered client-side (teq-react.min.js). Components load progressively. Migration to EDS requires converting from SPA to server-rendered HTML with progressive enhancement.'],
    ['6', 'Booking Redirect Chain', '~8,000+ product pages', 'All ATDW product pages', 'Medium', 'Booking CTAs route through ATDW redirect service (redirect.atdw-online.com.au) to third-party booking engines (RMS Cloud, Eventbrite, Ticketek, etc.). Must preserve redirect logic.'],
    ['7', 'Bunji AI Chatbot', 'All pages', 'Global component', 'Medium', 'Custom chatbot requiring separate integration. Likely requires embed code or API connection to conversational AI service.'],
    ['8', 'YouTube Video + Hero Slider Combination', '~20+ pages', 'Homepage, Road trips, Destination pages', 'Medium', 'Hero sliders with mixed media (images + video backgrounds) and overlay content. Video autoplay, mute controls, and responsive behaviour.'],
]
create_table(doc, ['#', 'Use Case', 'Instances', 'Where Found', 'Complexity', 'Description & Why Complex'], complex_cases)

doc.add_heading('5.1 EDS Migration Feasibility Comparison', level=2)
doc.add_paragraph('Comparing the four page types for EDS migration suitability:')

feasibility = [
    ['Homepage', 'Medium', 'High (many sections, carousels, video)', 'Large (entry point for 13 markets)', 'Feasible with custom blocks. Hero slider and carousels need JS. YouTube embed straightforward. Region carousel is the most complex piece.', 'RECOMMENDED for Phase 1 — high visibility, demonstrates EDS capability'],
    ['Road Trip / Itinerary', 'Medium-High', 'Very High (Mapbox map, tabbed timeline)', 'Small (~20 pages)', 'Feasible but Mapbox integration is complex. Day-by-day timeline requires custom block with significant JS. Map interaction with cards adds complexity.', 'Phase 2 — complex but limited page count. Good candidate for custom block development.'],
    ['Accommodation Detail (ATDW)', 'Low-Medium', 'Medium-High (API-driven, gallery, map)', 'Very Large (~5,000+ pages)', 'Highly feasible for automation. Standardized data from ATDW means one template serves thousands of pages. Gallery and map are proven EDS patterns.', 'BEST CANDIDATE for migration — massive scale benefit. Single template + ATDW feed = 5,000+ pages automated.'],
    ['Events Listing', 'Medium-High', 'High (search, filters, pagination, API)', 'Medium (~25 pages)', 'Feasible but search/filter requires client-side JS or API proxy. Filter tabs with live counts need dynamic behaviour. "Load More" pagination is standard.', 'Phase 2 — search/filter pattern reusable across accommodation/tours listings too.'],
]
create_table(doc, ['Page Type', 'Risk Level', 'Complexity', 'Size', 'Feasibility Assessment', 'Recommendation'], feasibility)

doc.add_page_break()

# ============ SECTION 6: MIGRATION ESTIMATES ============
doc.add_heading('6. Migration Estimates', level=1)

doc.add_heading('6.1 T-Shirt Sizing Assessment', level=2)
doc.add_paragraph('Based on the AEM EDS T-Shirt sizing framework:')

tshirt = [
    ['No of pages & Environments', '~8,400+ pages, 13 market variants', 'LARGE (2,500-5,000+)'],
    ['Project duration', '7-9 months estimated', 'LARGE (7-9+ months)'],
    ['Templates', '4 core + ~6 additional (destinations, articles, categories)', 'LARGE (7-10+)'],
    ['Core Blocks', '35 identified', 'MEDIUM (20-50)'],
    ['Style Variations', '12-15 (hero variants, card variants, carousel variants)', 'LARGE (12-18)'],
    ['Integrations', '6 core (AEM, ATDW, Mapbox, YouTube, Campaign, Chatbot) + 12 analytics', 'LARGE (4-5 Adobe + 9-12 REST)'],
    ['Multi-Site / Localization', '13 market/language variants', 'LARGE (10 additional regions)'],
    ['Content/Assets Migration', '~8,000+ ATDW products automated + 400 editorial pages', 'LARGE (complex migration, high volume)'],
    ['Quality Testing', 'ATDW data validation, map functionality, search/filter, 3 viewports', 'LARGE'],
    ['SIT/UAT/Go-Live', '13 weeks (SIT 2wk, UAT 6wk, Go-Live 1wk, Support 4wk)', 'LARGE'],
]
create_table(doc, ['Driver', 'Queensland.com Value', 'T-Shirt Size'], tshirt)

doc.add_paragraph()
p = doc.add_paragraph()
run = p.add_run('Overall T-Shirt Size: LARGE')
run.bold = True
run.font.size = Pt(14)
run.font.color.rgb = RGBColor(0x00, 0x6E, 0x8C)
p2 = doc.add_paragraph()
run2 = p2.add_run('Estimated Investment: $600,000 - $1,000,000')
run2.bold = True
run2.font.size = Pt(12)

doc.add_heading('6.2 Effort Breakdown by Phase', level=2)

phases = [
    ['Phase 1: Foundation & Design System', '3 weeks', 'Design tokens (colors, typography, spacing), global header/footer, responsive framework, EDS project setup, 13-market URL structure planning'],
    ['Phase 2: Core Block Development', '8 weeks', 'Build 35 blocks: hero-banner-slider, content-carousel, masonry-grid, cta-banner, faq-accordion, itinerary-map (Mapbox), trip-timeline, product-gallery, search-filter-bar, event-listing-card, etc.'],
    ['Phase 3: Template Assembly', '4 weeks', 'Assemble 4 core templates + additional page types from blocks. Configure section layouts, responsive behaviour, and variant logic.'],
    ['Phase 4: ATDW Integration', '6 weeks', 'Build ATDW API connector for product data (accommodation, tours, events). Map ATDW data model to EDS content structure. Implement booking redirect logic. Handle ~8,000+ product pages.'],
    ['Phase 5: Mapbox & Search Integration', '4 weeks', 'Mapbox map block with route rendering, interactive pins, and location maps. Search/filter functionality with ATDW API. Category tabs, pagination, sort, map view.'],
    ['Phase 6: Content Migration', '4 weeks', 'Automated import of editorial content (articles, destinations, road trips). Manual QA of complex pages. Multi-market content variants.'],
    ['Phase 7: Multi-Market Deployment', '3 weeks', 'Configure 13 market variants. Localization of navigation, footer, and market-specific content. URL structure and redirect mapping.'],
    ['Phase 8: QA & Testing', '5 weeks', 'Cross-browser testing (3 viewports, 2-3 browsers), ATDW data validation, map functionality, search/filter accuracy, accessibility audit, performance (Lighthouse 100).'],
    ['Phase 9: UAT & Go-Live', '5 weeks', 'Stakeholder UAT (Tourism QLD teams), go-live preparation, DNS cutover, 301 redirects for ~8,400+ URLs, post-launch monitoring and support.'],
]
create_table(doc, ['Phase', 'Duration', 'Details'], phases)

doc.add_heading('6.3 Effort Summary', level=2)

effort = [
    ['Block Development (35 blocks)', '40 days', '~8 weeks'],
    ['Template Assembly (10 templates)', '20 days', '~4 weeks'],
    ['ATDW Integration (API + 8,000+ pages)', '30 days', '~6 weeks'],
    ['Mapbox & Search Integration', '20 days', '~4 weeks'],
    ['Content Migration (Automated + Manual)', '20 days', '~4 weeks'],
    ['Multi-Market Configuration', '15 days', '~3 weeks'],
    ['Design System & Global Styles', '15 days', '~3 weeks'],
    ['Integrations (Analytics + Marketing)', '10 days', '~2 weeks'],
    ['QA & Testing', '25 days', '~5 weeks'],
    ['UAT & Go-Live', '25 days', '~5 weeks'],
    ['Total', '~220 days', '~44 person-weeks'],
]
create_table(doc, ['Work Type', 'Effort (Days)', 'Duration'], effort)

doc.add_heading('6.4 Resource Recommendation', level=2)
resources = [
    ['Senior EDS Developer (Lead)', '1', 'Full (9 months)', 'Architecture, Mapbox integration, ATDW API, complex blocks'],
    ['EDS Developer', '2', 'Full (9 months)', 'Block development, templates, content carousel, search/filter'],
    ['Integration Engineer', '1', 'Months 3-7', 'ATDW API connector, Mapbox route data, booking redirects'],
    ['Content/Import Engineer', '1', 'Months 5-8', 'Bulk content migration, multi-market variants, QA'],
    ['Design/CSS Specialist', '1', 'Months 1-4', 'Design system, Queensland brand compliance, responsive polish'],
    ['QA Engineer', '1', 'Months 6-9', 'Automated testing, ATDW data validation, accessibility'],
    ['Project Manager', '1', 'Full (9 months)', 'Tourism QLD stakeholder coordination, sprint planning'],
]
create_table(doc, ['Role', 'Count', 'Duration', 'Responsibilities'], resources)

doc.add_heading('6.5 Key Risk Factors', level=2)
risks = [
    ['ATDW API Dependency', 'Very High', '~8,000+ product pages depend on ATDW data feed. API availability, rate limits, and data model changes are critical risks.', 'Early API prototyping; define data contract; implement caching layer; fallback to static data if needed'],
    ['Mapbox Route Complexity', 'High', '~20 itinerary pages have custom route data, experience pins, and interactive filtering. GeoJSON route data must be sourced/created.', 'Prototype map block early; determine route data source; consider simplified static map fallback for initial launch'],
    ['React SPA to EDS Conversion', 'High', 'Entire site is client-rendered React SPA. Migration requires fundamental architecture change to server-rendered HTML + progressive enhancement.', 'Component-by-component conversion; maintain React patterns where EDS supports; prioritize critical user journeys'],
    ['13 Market Variants', 'Medium-High', 'Each market has different content priorities, languages (EN, DE, FR, TW, JP, HK, KR), and potentially different navigation.', 'Start with AU market; template localization framework; phased market rollout'],
    ['Search/Filter Functionality', 'High', 'Events and accommodation listings require live search, filtering with counts, sorting, and pagination. Core user experience.', 'Evaluate client-side search (Algolia/Coveo) vs. ATDW API proxy; prototype filter interactions early'],
    ['Chatbot (Bunji) Integration', 'Medium', 'AI chatbot present on all pages. Requires separate service integration.', 'Treat as embed/widget; minimal EDS impact; coordinate with chatbot vendor'],
]
create_table(doc, ['Risk Area', 'Impact', 'Description', 'Mitigation Strategy'], risks)

doc.add_heading('6.6 Recommended Migration Approach', level=2)
doc.add_paragraph('Based on the analysis, a phased migration approach is recommended:')

approach = [
    ['Phase 1 (Month 1-3)', 'Foundation + Accommodation Template', 'Build EDS foundation, design system, ATDW integration. Launch accommodation product detail pages (~5,000) — highest volume, most standardized, best ROI.'],
    ['Phase 2 (Month 3-5)', 'Events Listing + Search', 'Build search/filter pattern, event listing template. Reusable for accommodation and tours search pages. ~25 event listing pages + search functionality.'],
    ['Phase 3 (Month 5-7)', 'Homepage + Road Trips', 'Build complex blocks (hero slider, carousels, masonry grids, Mapbox maps, trip timeline). Homepage + ~20 itinerary pages.'],
    ['Phase 4 (Month 7-9)', 'Remaining Templates + Multi-Market', 'Destination pages, articles, category pages. Configure 13 market variants. Full QA and go-live.'],
]
create_table(doc, ['Phase', 'Focus', 'Details'], approach)

doc.add_page_break()

# ============ APPENDIX ============
doc.add_heading('Appendix: Page Screenshots', level=1)

screenshots = [
    ('/tmp/playwright/qld-01-homepage.png', 'Homepage — queensland.com/au/en/home'),
    ('/tmp/playwright/qld-02-roadtrip.png', 'Road Trip — Matilda Way Itinerary'),
    ('/tmp/playwright/qld-03-accommodation.png', 'Accommodation Detail — Saltbush Retreat'),
    ('/tmp/playwright/qld-04-events.png', 'Events Listing — Gold Coast Events'),
]

for path, caption in screenshots:
    add_screenshot(doc, path, caption, 3.5)
    doc.add_paragraph()

# Save
output_path = '/workspace/migration-work/Queensland-EDS-Migration-Analysis.docx'
doc.save(output_path)
print(f'Document saved to {output_path}')
print(f'Size: {os.path.getsize(output_path) / 1024 / 1024:.1f} MB')
