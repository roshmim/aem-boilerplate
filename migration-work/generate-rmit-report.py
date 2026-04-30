#!/usr/bin/env python3
"""Generate RMIT University EDS Migration Analysis Word Document."""

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
    heading_style = doc.styles[f'Heading {level}']
    heading_style.font.color.rgb = RGBColor(0xE6, 0x00, 0x28)  # RMIT Red

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
        set_cell_shading(hdr_cells[i], 'E60028')
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

def add_screenshot(doc, path, caption, width=5.5):
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
doc.add_paragraph()
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run('RMIT University\nEdge Delivery Services\nMigration Analysis Report')
run.font.size = Pt(28)
run.font.color.rgb = RGBColor(0xE6, 0x00, 0x28)
run.bold = True

doc.add_paragraph()
subtitle = doc.add_paragraph()
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = subtitle.add_run('Comprehensive Site Analysis & Migration Estimation')
run.font.size = Pt(14)
run.font.color.rgb = RGBColor(0x00, 0x00, 0x66)

doc.add_paragraph()
date_p = doc.add_paragraph()
date_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = date_p.add_run('Date: April 28, 2026\nSite: https://www.rmit.edu.au/')
run.font.size = Pt(12)

doc.add_paragraph()
summary_box = doc.add_paragraph()
summary_box.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = summary_box.add_run('Total Pages: ~9,705  |  Templates: 12  |  Blocks: 22  |  Integrations: 18')
run.font.size = Pt(11)
run.bold = True

doc.add_page_break()

# ============ TABLE OF CONTENTS ============
doc.add_heading('Table of Contents', level=1)
for item in ['1. Templates Inventory', '2. Blocks / Components Catalog', '3. Page Counts by Template', '4. Integrations Analysis', '5. Complex Use Cases & Observations', '6. Migration Estimates']:
    doc.add_paragraph(item).style.font.size = Pt(11)
doc.add_page_break()

# ============ SECTION 1: TEMPLATES INVENTORY ============
doc.add_heading('1. Templates Inventory', level=1)
doc.add_paragraph('The following unique page templates were identified across the RMIT website (~9,705 pages). The site is built on Adobe Experience Manager (AEM) with consistent global header/footer components.')

templates_data = [
    ['1', 'Homepage', 'High', 'Unique layout with hero image/search, study area icon grid, stats section, scholarship promo, article cards, news feature, and acknowledgement of country. One-of-a-kind page.', 'https://www.rmit.edu.au/'],
    ['2', 'Section Landing Page', 'Medium-High', 'Image hero banner + section menu dropdown + mixed content: feature cards, article grids, promo banners, video embeds, logo grids. Used across major sections.', 'https://www.rmit.edu.au/research\nhttps://www.rmit.edu.au/partner\nhttps://www.rmit.edu.au/careers\nhttps://www.rmit.edu.au/online\nhttps://www.rmit.edu.au/about\nhttps://www.rmit.edu.au/life-at-rmit'],
    ['3', 'Study Hub / Level Landing', 'High', 'Course search with tabs, study area icon grids, feature cards, carousels, sticky CTA bar ("Contact Study@RMIT" + "Ready to Apply?"). Complex interactive elements.', 'https://www.rmit.edu.au/study-with-us\nhttps://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study'],
    ['4', 'Study Area Page', 'High', 'Image hero, discipline navigation grid, ranking callouts, video/course carousels, career outcomes, virtual tour promo, cross-links. Highly structured.', 'https://www.rmit.edu.au/study-with-us/engineering\nhttps://www.rmit.edu.au/study-with-us/business'],
    ['5', 'Course Detail Page', 'Very High', 'Most complex template. Domestic/International toggle, key facts panel, multiple accordion sections (entry requirements, fees, structure), career outcomes, scholarships, sticky bottom nav with section selector. ~1,304 pages.', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/honours-degrees/bachelor-of-engineering-honours-bh126'],
    ['6', 'News Listing Page', 'Medium', 'Featured news carousel hero, section menu, article card grid with category tags and dates, sidebar elements. Paginated listing.', 'https://www.rmit.edu.au/news'],
    ['7', 'News Article Page', 'Medium', 'Article title header, long-form body with inline media (images, video), metadata sidebar (category, date, share buttons), related news grid, topic tags.', 'https://www.rmit.edu.au/news/all-news/2026/apr/boas-treatment'],
    ['8', 'Events Listing Page', 'Medium', 'Image hero with topic filter dropdown, tabbed listing (Upcoming / Live streams), event cards with date/location info.', 'https://www.rmit.edu.au/events'],
    ['9', 'Contact Page', 'Medium-High', 'Multiple tabbed sections organized by audience/topic (7 tab sets), search inputs, address blocks. Unique layout.', 'https://www.rmit.edu.au/contact'],
    ['10', 'Scholarships Page', 'High', 'Nested tab interfaces (2 levels: audience type → sub-category), scholarship listing with load more, step-by-step process, featured carousel.', 'https://www.rmit.edu.au/scholarships'],
    ['11', 'Content/Information Page', 'Low-Medium', 'Generic content pages with heading, body text, optional images, accordions, link lists. Used for policies, about sub-pages, student support, etc.', 'https://www.rmit.edu.au/about/our-values\nhttps://www.rmit.edu.au/utilities/terms\nhttps://www.rmit.edu.au/utilities/privacy'],
    ['12', 'International Students Landing', 'High', 'Image hero with overlay CTA, feature cards, course search, ranking stats, promo banners, video embed, unique floating CTAs (Chat + Build brochure). Tailored for international audience.', 'https://www.rmit.edu.au/study-with-us/international-students'],
]

create_table(doc, ['#', 'Template Name', 'Complexity', 'Reasoning', 'Reference URL(s)'], templates_data)

doc.add_paragraph()
add_screenshot(doc, '/tmp/playwright/rmit-01-homepage.png', 'Figure 1: Homepage Template', 3.5)
doc.add_paragraph()
add_screenshot(doc, '/tmp/playwright/rmit-10-course-detail.png', 'Figure 2: Course Detail Page Template (Most Complex)', 3.5)
doc.add_paragraph()
add_screenshot(doc, '/tmp/playwright/rmit-04-research.png', 'Figure 3: Section Landing Template (Research)', 3.5)

doc.add_page_break()

# ============ SECTION 2: BLOCKS / COMPONENTS CATALOG ============
doc.add_heading('2. Blocks / Components Catalog', level=1)
doc.add_paragraph('The following reusable blocks/components were identified. Design variations of the same content model are tracked as variants rather than separate blocks.')

blocks_data = [
    ['1', 'header', 'Medium', 'Global header with RMIT logo, compare courses button, search button, hamburger menu. Consistent across all pages. Includes mobile responsive drawer navigation.', 'All pages'],
    ['2', 'footer', 'Medium', '5-section accordion footer with quick links row, Acknowledgement of Country section, legal/regulatory info, social media icons. Consistent globally.', 'All pages'],
    ['3', 'hero-banner', 'Medium', 'Multiple variants: (a) Full-width image + text overlay + CTA; (b) Text-only hero; (c) Image with course search overlay. All share same content model (image, heading, description, CTA).', 'Homepage, Study areas, Research, Partner, Careers, International'],
    ['4', 'cards', 'Medium', 'Most used component. Variants: (a) Article card (image + title + description + link); (b) Feature card (icon + heading + text); (c) Stat card (number + description); (d) Course card (title + key details). Same content model, different visual layouts.', 'All section pages, Listings, Course detail'],
    ['5', 'tabs', 'Medium-High', 'Tabbed panel component for switching content views. Variants: (a) Simple tabs; (b) Nested tabs (2 levels as in Scholarships); (c) Tab with search input. Most complex interactive component used site-wide.', 'Study hub, Contact, Scholarships, Events, International'],
    ['6', 'carousel', 'Medium', 'Horizontal scrolling card carousel with prev/next navigation and dot indicators. Used for courses, news, videos, and testimonials.', 'Study areas, News listing, Careers, Scholarships'],
    ['7', 'accordion', 'Medium', 'Expandable/collapsible content panels. Used extensively on course detail pages (entry requirements, fees, course structure) and contact page.', 'Course detail, Contact, Content pages'],
    ['8', 'course-search', 'High', 'Tabbed search interface with text input, study area icon grid browse option, and autocomplete. Integrates with course database. Most complex functional block.', 'Homepage, Study hub, Undergraduate, International, Life at RMIT'],
    ['9', 'section-menu', 'Low-Medium', 'Dropdown navigation listing page sections for in-page navigation. Appears below hero on section landing pages.', 'Research, Partner, Careers, RMIT Online, News, Events'],
    ['10', 'promo-banner', 'Low-Medium', 'Full-width promotional banner with image + text + CTA button. Variants: (a) Image left/text right; (b) Text overlay on image; (c) Background image with centered text.', 'Homepage, Study hub, Study areas, About, Partner'],
    ['11', 'video-embed', 'Low', 'Responsive video player embed with play button overlay and optional caption/description text.', 'Study areas, Research, Careers, News articles, International'],
    ['12', 'study-area-grid', 'Medium', 'Icon + label grid showing all 20 study areas. Clickable icons navigate to study area pages. Used as both navigation and content browsing.', 'Homepage, Study hub, Undergraduate, Life at RMIT'],
    ['13', 'sticky-cta-bar', 'Medium', 'Fixed bottom bar with action buttons. Variants: (a) "Contact Study@RMIT" + "Ready to apply?"; (b) "Chat" + "Build your brochure"; (c) Course page section nav + Compare + Apply.', 'Study pages, International, Course detail'],
    ['14', 'article-grid', 'Low-Medium', 'Grid layout of article/content cards (typically 3-4 columns). Used for news, events, related content, and cross-links. Variant: with "Load more" pagination.', 'News listing, Events, Scholarships, all section pages'],
    ['15', 'logo-grid', 'Low', 'Horizontal display of partner/accreditation logos. Optional carousel behaviour for many logos.', 'Partner, RMIT Online, Careers'],
    ['16', 'share-buttons', 'Low', 'Social sharing buttons (Facebook, LinkedIn, X/Twitter, Email) for news articles.', 'News articles'],
    ['17', 'key-facts-panel', 'Medium', 'Structured data display for course details (duration, ATAR, fees, intake dates, location). Switches content based on Domestic/International toggle.', 'Course detail pages (~1,304 pages)'],
    ['18', 'student-type-toggle', 'Medium-High', 'Radio button toggle (Domestic/International) that switches displayed content across multiple sections of the course detail page. Requires state management.', 'Course detail pages (~1,304 pages)'],
    ['19', 'breadcrumb', 'Low', 'Page hierarchy navigation trail. Shown on deeper content pages.', 'Course detail, Content pages, News articles'],
    ['20', 'contact-block', 'Low-Medium', 'Contact information display with phone, email, address, and hours. Variants: sidebar card, inline block, or full section.', 'Contact, News, Research, Scholarships'],
    ['21', 'step-process', 'Low', 'Numbered step-by-step process display with icons and descriptions. Used for "How to apply" flows.', 'Scholarships, Course detail'],
    ['22', 'ranking-callout', 'Low', 'Highlighted statistic/ranking with icon, number, and source attribution. Used for university rankings and achievements.', 'Homepage, Study areas, International, Course detail'],
]

create_table(doc, ['#', 'Block Name', 'Complexity', 'Description & Behaviour', 'Reference URL(s)'], blocks_data)

doc.add_paragraph()
add_screenshot(doc, '/tmp/playwright/rmit-02-study-hub.png', 'Figure 4: Study Hub showing course-search, tabs, study-area-grid blocks', 3.5)
doc.add_paragraph()
add_screenshot(doc, '/tmp/playwright/rmit-09-scholarships.png', 'Figure 5: Scholarships page showing nested tabs and article-grid', 3.5)

doc.add_page_break()

# ============ SECTION 3: PAGE COUNTS BY TEMPLATE ============
doc.add_heading('3. Page Counts by Template', level=1)
doc.add_paragraph('Based on sitemap analysis (9,705 total URLs), the following page count distribution was identified:')

page_counts = [
    ['Homepage', '1', 'Manual', 'Unique layout; custom build required'],
    ['Section Landing Page', '~30', 'Semi-Automated', 'Shared template; content varies significantly per section'],
    ['Study Hub / Level Landing', '~8', 'Semi-Automated', 'Complex interactive elements; limited count but high build effort'],
    ['Study Area Page', '~20', 'Semi-Automated', 'Consistent structure; content/media varies per area'],
    ['Course Detail Page', '~1,304', 'Automated', 'Highly structured; data-driven from course database. Largest single template category'],
    ['News Listing Page', '~15', 'Semi-Automated', 'Category-filtered views; shared template'],
    ['News Article Page', '~2,400', 'Automated', 'Consistent article template; bulk import candidate. Includes all-news + media releases'],
    ['Events Listing/Detail', '~223', 'Automated (with QA)', 'Event cards with structured date/location data'],
    ['Contact Page', '~5', 'Manual', 'Complex tabbed layout; audience-specific content'],
    ['Scholarships Page', '~332', 'Semi-Automated', 'Listing + detail pages; nested filtering'],
    ['Content/Information Page', '~5,200', 'Automated (with QA)', 'Largest category overall: includes about, students, alumni, library, staff, giving, schools/colleges sub-pages'],
    ['International Students Landing', '~10', 'Semi-Automated', 'Audience-specific with unique CTAs and chatbot'],
    ['TOTAL', '~9,705', '', ''],
]

create_table(doc, ['Template', 'Page Count', 'Migration Type', 'Notes'], page_counts)

doc.add_paragraph()
doc.add_heading('3.1 Migration Type Summary', level=2)

migration_summary = [
    ['Automated', '~8,900', '92%', 'Course details (1,304), News articles (2,400), Content pages (5,200), Events (223)'],
    ['Semi-Automated', '~750', '7%', 'Section landings (30), Study hubs (8), Study areas (20), Scholarships (332), International (10)'],
    ['Manual', '~55', '1%', 'Homepage (1), Contact (5), unique layouts, complex interactive pages'],
    ['Total', '~9,705', '100%', ''],
]

create_table(doc, ['Type', 'Pages', '% of Total', 'Includes'], migration_summary)

doc.add_page_break()

# ============ SECTION 4: INTEGRATIONS ANALYSIS ============
doc.add_heading('4. Integrations Analysis', level=1)
doc.add_paragraph('RMIT uses a substantial Adobe ecosystem stack alongside various marketing and analytics integrations.')

doc.add_heading('4.1 Core Platform & Adobe Integrations', level=2)

adobe_integrations = [
    ['1', 'Adobe Experience Manager (AEM)', 'Platform/CMS', 'High', 'Current CMS platform (AEM 6.x/Cloud). All content authored and managed here. Migration source system.', 'All pages (etc.clientlibs/rmit/)'],
    ['2', 'Adobe Experience Platform (AEP)', 'API/Embed', 'Medium', 'Customer data platform for unified profiles. Web SDK for event collection.', 'All pages'],
    ['3', 'Adobe Launch (DTM)', 'Embed', 'Medium', 'Tag management system orchestrating all Adobe and third-party tags.', 'All pages (assets.adobedtm.com)'],
    ['4', 'Adobe Analytics / Client Data Layer', 'Embed', 'Medium', 'ACDL v2.0.2 for structured analytics data. Page view and interaction tracking.', 'All pages'],
    ['5', 'Adobe Target', 'API/Embed', 'Medium', 'A/B testing and personalization engine. Likely used for content variations.', 'Study pages, Homepage'],
]

create_table(doc, ['#', 'Integration', 'Type', 'Complexity', 'Description', 'Reference'], adobe_integrations)

doc.add_heading('4.2 Analytics & Marketing', level=2)

marketing = [
    ['6', 'Google Tag Manager', 'Embed', 'Low', 'GTM container (GTM-5DJRNQ) managing Google tags', 'All pages'],
    ['7', 'Google Analytics 4', 'Embed', 'Low', 'GA4 property (G-NF0RBW86ZP) + multiple Google Ads conversion tags (7 AW- IDs)', 'All pages'],
    ['8', 'Google Ads / DoubleClick', 'Embed', 'Low', 'Multiple conversion tracking pixels (DC-5431224, DC-11366847, 7 AW- accounts)', 'All pages'],
    ['9', 'Facebook/Meta Pixel', 'Embed', 'Low', 'Facebook event tracking for remarketing', 'All pages'],
    ['10', 'TikTok Pixel', 'Embed', 'Low', 'TikTok analytics and conversion tracking (CABDOVRC77U9LQHLOU70)', 'All pages'],
    ['11', 'LinkedIn Insight Tag', 'Embed', 'Low', 'LinkedIn conversion tracking and audience building', 'All pages'],
    ['12', 'Snapchat Pixel', 'Embed', 'Low', 'Snapchat conversion tracking', 'All pages'],
    ['13', 'Reddit Pixel', 'Embed', 'Low', 'Reddit conversion tracking', 'All pages'],
    ['14', 'Spotify Pixel', 'Embed', 'Low', 'Spotify ad tracking (pixel.byspotify.com)', 'All pages'],
    ['15', 'Marketo Munchkin', 'Embed', 'Medium', 'Marketing automation tracking for lead nurture and email campaigns', 'All pages'],
    ['16', 'Everest.js (Adobe Advertising)', 'Embed', 'Low', 'Adobe Advertising Cloud search/display tracking', 'All pages'],
]

create_table(doc, ['#', 'Integration', 'Type', 'Complexity', 'Description', 'Reference'], marketing)

doc.add_heading('4.3 Functional & UX Integrations', level=2)

functional = [
    ['17', 'Dynatrace RUM', 'Embed', 'Medium', 'Real User Monitoring for performance analytics (ruxitagentjs). Multiple agent injections detected.', 'All pages'],
    ['18', 'Qualtrics Site Intercept', 'Embed', 'Medium', 'Survey and feedback collection (brand: rmitnonacademic). Pop-up intercept surveys.', 'All pages'],
    ['19', 'Privacy Manager (LiveRamp)', 'Embed', 'Medium', 'Cookie consent and privacy preference management (launchpad.privacymanager.io)', 'All pages'],
    ['20', 'RMIT Chatbot', 'Embed', 'High', 'AI-powered chatbot for student enquiries. Appears on study/international pages. Likely custom integration.', 'Study pages, International'],
    ['21', 'Course Database / Search API', 'API', 'Very High', 'Backend API powering course search, filtering, and detail page data. Core to the study experience.', 'Study hub, Course search, Course detail'],
    ['22', 'Academics Portal', 'External Link', 'Low', 'External researcher profiles (academics.rmit.edu.au). Linked but not embedded.', 'Research pages'],
    ['23', 'VTAC Integration', 'External Link', 'Low', 'Links to Victorian Tertiary Admissions Centre for applications.', 'Course detail, Apply pages'],
    ['24', 'Open Universities Australia', 'External Link', 'Low', 'Partnership link for online course delivery.', 'Footer, Online pages'],
]

create_table(doc, ['#', 'Integration', 'Type', 'Complexity', 'Description', 'Reference'], functional)

doc.add_heading('4.4 Integration Summary', level=2)
int_summary = [
    ['Adobe Ecosystem (Platform)', '5', '~20 days', 'AEM, AEP, Launch, Analytics, Target'],
    ['Analytics & Marketing Tags', '11', '~5 days (GTM-managed)', 'Google, Facebook, TikTok, LinkedIn, Snapchat, Reddit, Spotify, Marketo, Everest'],
    ['Functional & UX', '8', '~15 days', 'Dynatrace, Qualtrics, Privacy Manager, Chatbot, Course API, external portals'],
    ['Total', '24', '~40 days', ''],
]
create_table(doc, ['Category', 'Count', 'Estimated Effort', 'Details'], int_summary)

doc.add_page_break()

# ============ SECTION 5: COMPLEX USE CASES ============
doc.add_heading('5. Complex Use Cases & Observations', level=1)
doc.add_paragraph('The following complex behaviours require special attention during migration.')

complex_cases = [
    ['1', 'Course Database & Dynamic Content', '~1,304 pages', 'Course detail pages (/study-with-us/levels-of-study/*)', 'Very High', 'Course pages are data-driven from a structured course database. Content includes entry requirements, fees, intakes, ATAR scores, career outcomes, pathways. The Domestic/International toggle switches displayed content dynamically. Requires backend API or content feed integration.'],
    ['2', 'Domestic/International Content Toggle', '~1,304 pages', 'All course detail pages', 'High', 'A radio button toggles between Domestic and International student views, changing fees, entry requirements, intake dates, and application info. Requires client-side state management or server-side personalization.'],
    ['3', 'Course Search & Autocomplete', '~5 instances', 'Homepage, Study hub, Undergraduate, International, Life at RMIT', 'High', 'Real-time course search with autocomplete, tabbed interface (search by name / career), and study area browse grid. Requires search index API integration.'],
    ['4', 'Nested Tab Interfaces', '~3 pages', 'Scholarships, Contact, Course detail', 'Medium-High', 'Multi-level tabbed content panels (e.g., Scholarships has outer tabs International/Domestic/Research then inner tabs within each). Complex state management and accessibility requirements.'],
    ['5', 'Sticky Bottom Navigation (Course Pages)', '~1,304 pages', 'All course detail pages', 'Medium', 'Fixed bottom bar with page section selector dropdown, Compare button, and Apply CTA. Must stay synchronized with scroll position and page sections.'],
    ['6', 'News Article Bulk Content', '~2,400 articles', '/news/all-news/* and /news/media-releases/*', 'Medium', 'Large volume of editorial content with inline media, embedded videos, and varied layouts. Requires bulk import automation with media handling.'],
    ['7', 'Schools & Colleges Directory', '~1,344 pages', '/about/schools-colleges/*', 'Medium', 'Hierarchical content structure: colleges → schools → departments → staff profiles. Deep nesting with cross-references.'],
    ['8', 'RMIT Online Sub-Brand', '~237 pages', '/online/*', 'Medium', 'Separate visual identity (different branding, separate social links section) within same domain. Requires design variant handling.'],
    ['9', 'Scholarship Filtering & Load More', '~332 pages', '/scholarships/*', 'Medium', 'Dynamic filtering by student type, level, and country with progressive content loading. Requires client-side filtering or API pagination.'],
    ['10', 'Event Calendar Functionality', '~223 pages', '/events/*', 'Medium', 'Date-based event listings with topic filters, location metadata, and live stream recordings tab. Time-sensitive content requires automated publishing.'],
    ['11', 'Multi-Language/Region Considerations', 'Site-wide', 'RMIT Vietnam, global campuses', 'Low-Medium', 'While main site is English, references to Vietnam campus and international presence suggest potential multi-language needs. Currently handled via separate domains.'],
    ['12', 'Adobe Target Personalization', 'Unknown scope', 'Study pages, Homepage (likely)', 'Medium', 'A/B testing and content personalization through Adobe Target. Migration must preserve or replace personalization capability.'],
]

create_table(doc, ['#', 'Use Case', 'Instances', 'Where Found', 'Complexity', 'Description & Why Complex'], complex_cases)

doc.add_page_break()

# ============ SECTION 6: MIGRATION ESTIMATES ============
doc.add_heading('6. Migration Estimates', level=1)

doc.add_heading('6.1 T-Shirt Sizing Assessment', level=2)
doc.add_paragraph('Based on the standard AEM EDS T-Shirt sizing framework:')

tshirt = [
    ['No of pages & Environments', '~9,705 pages', 'LARGE (2,500-5,000+)', 'Exceeds Large threshold'],
    ['Project duration', '9-12 months estimated', 'LARGE (7-9+ months)', 'Complex integrations extend timeline'],
    ['Templates', '12', 'LARGE (7-10+)', 'Exceeds threshold with complex variants'],
    ['Core Blocks', '22', 'MEDIUM (20-50)', 'Within Medium range'],
    ['Style Variations', '15+', 'LARGE (12-18)', 'Multiple hero, card, tab, CTA variants'],
    ['Integrations', '24 (5 Adobe + 11 marketing + 8 functional)', 'LARGE (4-5 Adobe + 9-12 REST)', 'Heavy Adobe ecosystem + marketing stack'],
    ['Content/Assets migration', 'Helix Importer ~50-60% (6-10 template entities)', 'LARGE', 'Complex course data, 2,400+ news articles'],
    ['Multi Site Manager', 'Single site (sub-brand RMIT Online within same domain)', 'SMALL-MEDIUM', 'No multi-language but sub-brand variants'],
    ['Quality Testing', 'Automation + E2E for course pages, 3 viewports, 2-3 browsers', 'LARGE', 'Critical for course database accuracy'],
    ['SIT/UAT/Go-Live', '13+ weeks (SIT 2wk, UAT 6wk, Go-Live 1wk, Support 4wk)', 'LARGE', 'University stakeholder approval cycles'],
]

create_table(doc, ['Driver', 'RMIT Value', 'T-Shirt Size', 'Notes'], tshirt)

doc.add_paragraph()
p = doc.add_paragraph()
run = p.add_run('Overall T-Shirt Size: LARGE')
run.bold = True
run.font.size = Pt(14)
run.font.color.rgb = RGBColor(0xE6, 0x00, 0x28)

p = doc.add_paragraph()
run = p.add_run('Estimated Investment: $600,000 - $1,000,000')
run.bold = True
run.font.size = Pt(12)

doc.add_heading('6.2 Effort Breakdown by Phase', level=2)

phases = [
    ['Phase 1: Foundation & Design System', '4 weeks', 'Design token extraction, global header/footer, base styling, responsive framework, AEM EDS project setup'],
    ['Phase 2: Core Templates & Blocks', '8 weeks', 'Build 12 templates, 22 blocks with all variants. Course detail page is highest effort. Includes tabs, accordion, carousel, course-search, sticky-cta-bar.'],
    ['Phase 3: Course Database Integration', '6 weeks', 'Course API integration, search functionality, Domestic/International toggle, key facts panel, dynamic content population for ~1,304 course pages.'],
    ['Phase 4: Content Migration (Automated)', '4 weeks', 'Bulk import of ~8,900 pages (news articles, content pages, events, course data). Import script development, validation, and error handling.'],
    ['Phase 5: Content Migration (Semi-Auto + Manual)', '4 weeks', 'Section landings, study areas, scholarships, international pages. Manual QA and content refinement.'],
    ['Phase 6: Integrations', '5 weeks', 'Adobe ecosystem (AEP, Launch, Analytics, Target), GTM migration, Qualtrics, Chatbot, Privacy Manager, Dynatrace. Course search API.'],
    ['Phase 7: QA & Testing', '6 weeks', 'Automated accessibility testing, cross-browser (3 viewports, 2-3 browsers), course data validation, integration testing, performance (Lighthouse 100 target).'],
    ['Phase 8: UAT & Go-Live', '6 weeks', 'University stakeholder UAT (6 weeks), go-live preparation, URL redirect mapping (9,705 redirects), DNS cutover, post-launch support (4 weeks).'],
]

create_table(doc, ['Phase', 'Duration', 'Details'], phases)

doc.add_heading('6.3 Effort by Work Type', level=2)

effort_type = [
    ['Block Development (22 blocks)', '55 days', '~11 weeks', 'Complex blocks: course-search, tabs, student-type-toggle, key-facts-panel'],
    ['Template Infrastructure (12 templates)', '35 days', '~7 weeks', 'Course detail template is highest effort (Very High complexity)'],
    ['Course Database Integration', '30 days', '~6 weeks', 'API design, search index, Domestic/Intl toggle, data mapping'],
    ['Content Migration (Automated)', '20 days', '~4 weeks', '~8,900 pages via Helix Importer with custom parsers'],
    ['Content Migration (Semi-Auto + Manual)', '20 days', '~4 weeks', '~750 pages requiring human review + 55 manual builds'],
    ['Integrations (24 total)', '40 days', '~8 weeks', 'Adobe ecosystem + marketing + functional integrations'],
    ['Design System & Global Styles', '15 days', '~3 weeks', 'RMIT brand colors, typography, responsive breakpoints, icon library'],
    ['QA & Testing', '30 days', '~6 weeks', 'Automated + manual testing across viewports/browsers'],
    ['UAT & Go-Live Support', '30 days', '~6 weeks', 'Stakeholder UAT cycles, redirect mapping, post-launch'],
    ['Total', '~275 days', '~55 person-weeks', ''],
]

create_table(doc, ['Work Type', 'Effort (Days)', 'Duration', 'Notes'], effort_type)

doc.add_heading('6.4 Resource Recommendation', level=2)

resources = [
    ['Senior EDS Developer (Lead)', '1', 'Full (10 months)', 'Architecture, complex blocks, course integration, technical decisions'],
    ['EDS Developer', '2', 'Full (10 months)', 'Block development, template builds, import infrastructure'],
    ['Content/Import Engineer', '1', 'Months 4-9', 'Bulk import execution, content mapping, data validation'],
    ['Design/CSS Specialist', '1', 'Months 1-5', 'Design system, visual fidelity, RMIT brand compliance, accessibility'],
    ['Integration Engineer', '1', 'Months 5-9', 'Adobe ecosystem, course API, search, chatbot, analytics'],
    ['QA Engineer', '2', 'Months 7-10', 'Automated testing, accessibility audit, cross-browser, performance'],
    ['Project Manager', '1', 'Full (10 months)', 'University stakeholder management, sprint planning, delivery coordination'],
]

create_table(doc, ['Role', 'Count', 'Duration', 'Responsibilities'], resources)

doc.add_heading('6.5 Timeline Summary', level=2)

timeline = [
    ['Total Pages', '~9,705'],
    ['Unique Templates', '12'],
    ['Unique Blocks', '22'],
    ['Integrations', '24'],
    ['Total Effort', '~275 person-days (~55 person-weeks)'],
    ['Calendar Duration', '~10 months (43 weeks with team of 6-8)'],
    ['T-Shirt Size', 'LARGE'],
    ['Estimated Investment', '$600,000 - $1,000,000'],
    ['Automated Migration', '~8,900 pages (92%)'],
    ['Semi-Automated', '~750 pages (7%)'],
    ['Manual', '~55 pages (1%)'],
]

create_table(doc, ['Metric', 'Value'], timeline)

doc.add_heading('6.6 Key Risk Factors', level=2)

risks = [
    ['Course Database Integration', 'Very High', 'Core to the student experience; 1,304 pages depend on structured data feed. API design critical.', 'Early prototype; define data contract in Phase 1; fallback to static content if API delays'],
    ['Domestic/International Toggle', 'High', 'Content personalization embedded in template; affects fees, requirements, intakes across 1,304 pages', 'Implement as client-side state; test with both audiences; validate all switched content'],
    ['9,705 URL Redirects', 'High', 'Every existing URL must redirect correctly; SEO rankings depend on it', 'Automated redirect generation from sitemap; staged validation; 301 redirect monitoring'],
    ['University Stakeholder UAT', 'Medium-High', 'Multiple faculties, schools, and departments must sign off on their content', 'Phased UAT by faculty; early engagement; dedicated content owners per section'],
    ['Adobe Target Personalization', 'Medium', 'Existing personalization rules must be preserved or re-implemented in EDS', 'Audit current Target activities; determine which to keep vs. retire'],
    ['Course Search Functionality', 'High', 'Critical user journey; must support autocomplete, filtering, and career-based search', 'Evaluate Coveo/Algolia for EDS; prototype search early; performance test with full course catalog'],
]

create_table(doc, ['Risk Area', 'Impact', 'Description', 'Mitigation Strategy'], risks)

doc.add_page_break()

# ============ APPENDIX ============
doc.add_heading('Appendix: Additional Template Screenshots', level=1)

screenshots = [
    ('/tmp/playwright/rmit-03-study-area.png', 'Study Area Template (Engineering)'),
    ('/tmp/playwright/rmit-05-news-listing.png', 'News Listing Template'),
    ('/tmp/playwright/rmit-06-news-article.png', 'News Article Template'),
    ('/tmp/playwright/rmit-07-online.png', 'RMIT Online Section Landing'),
    ('/tmp/playwright/rmit-08-contact.png', 'Contact Page Template'),
    ('/tmp/playwright/rmit-11-international.png', 'International Students Landing'),
]

for path, caption in screenshots:
    add_screenshot(doc, path, caption, 3.5)
    doc.add_paragraph()

# Save
output_path = '/workspace/migration-work/RMIT-EDS-Migration-Analysis.docx'
doc.save(output_path)
print(f'Document saved to {output_path}')
print(f'Size: {os.path.getsize(output_path) / 1024 / 1024:.1f} MB')
