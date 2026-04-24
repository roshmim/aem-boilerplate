# CommBank Website (commbank.com.au) — Migration Analysis Report

**Date:** February 2026
**Source:** https://www.commbank.com.au
**Current CMS:** Adobe Experience Manager (AEM)
**Target:** Adobe Edge Delivery Services (AEM Sites)

---

## 1. Templates Inventory

| # | Template Name | Complexity | Reasoning | Reference URLs |
|---|--------------|-----------|-----------|----------------|
| 1 | **Homepage** | High | Unique layout with hero carousel, product navigation grid (6 categories with icons + sub-links), promotional banners, editorial card grid (4-up), financial support CTA, multi-format content hub section, support/FAQ grid, and comprehensive footer. Complex layout with multiple custom component patterns. | https://www.commbank.com.au/ |
| 2 | **Product Category Landing** | Medium | Hero banner with description, icon-based sub-category navigation grid (8 items), promotional split-content section, life-stage card grid, tools/guidance card row (4-up), app promotion split section, access channel list, advantage cards (3-up), and help section. Reusable pattern across Banking, Insurance, Home Loans. | https://www.commbank.com.au/banking.html, https://www.commbank.com.au/home-loans.html, https://www.commbank.com.au/insurance.html |
| 3 | **Product Listing/Comparison** | High | Hero with filtering, product cards with features/rates/fees comparison, interactive rate display widgets, promotional banners between products, expandable T&Cs. Heavy interactive elements and dynamic rate data. | https://www.commbank.com.au/credit-cards.html, https://www.commbank.com.au/home-loans/interest-rates.html |
| 4 | **Product Detail** | Medium | Hero with key selling points and CTA buttons, promotional offer section, audience-segmented cards (6-up grid), app features list with logos, split-content promotional sections, feature highlights (3-up icons), existing customer help section, extensive T&Cs accordion. Reused across all product types. | https://www.commbank.com.au/banking/everyday-accounts.html, https://www.commbank.com.au/home-loans/digi-home-loan.html |
| 5 | **Article/Editorial (Brighter)** | Low | Breadcrumb navigation, article header with author byline, hero image, social share buttons, structured body content (paragraphs, blockquotes, headings, lists), highlighted tip box, related articles list, tags section. Clean content-focused template. | https://www.commbank.com.au/brighter/financial-education/online-dating-scams.html |
| 6 | **Content Hub/Listing (Brighter)** | Medium | Hero banner, category filters, editorial card grid with images, article teasers with metadata, pagination. Dynamic content listing with filtering. | https://www.commbank.com.au/brighter.html, https://www.commbank.com.au/brighter/financial-education.html |
| 7 | **Support/FAQ** | Medium | Search functionality, categorized FAQ sections, accordion-style Q&A, quick-help card grid, contact/locate CTA cards, deep link structure for individual support topics. | https://www.commbank.com.au/support.html |
| 8 | **Support Topic Detail** | Low | Breadcrumb, heading, body content with structured guidance, contact CTAs, related topic links. Straightforward informational layout. | https://www.commbank.com.au/support/financial-support/financial-hardship.html, https://www.commbank.com.au/support/security.html |
| 9 | **Calculator/Digital Tool (SPA)** | High | React-based single-page applications under `/digital/` path. Interactive calculators with sliders, inputs, dynamic results, charts. Completely separate from AEM template system — requires custom development. | https://www.commbank.com.au/digital/home-buying/calculator/home-loan-repayments, https://www.commbank.com.au/digital/locate-us/ |
| 10 | **Corporate/About** | Medium | Hero, leadership profiles, company information, annual report links, sustainability content, stakeholder sections. Mixed content types. | https://www.commbank.com.au/about-us.html, https://www.commbank.com.au/sustainability.html |
| 11 | **Investor Relations** | Medium | Financial results, ASX announcements, report downloads, presentation embeds, calendar of events. Data-heavy with document management. | https://www.commbank.com.au/about-us/investors.html, https://www.commbank.com.au/about-us/investors/results.html |
| 12 | **Newsroom/Media** | Medium | Press release listing with date filtering, article detail pages, media contact information, image gallery. Listing + detail pattern. | https://www.commbank.com.au/newsroom.html |
| 13 | **Careers** | High | Job search integration (Workday), career category pages, application process guides, employee stories, benefits information. External system integration. | https://www.commbank.com.au/about-us/careers.html |
| 14 | **Business Landing** | Medium | Similar to Product Category Landing but tailored for business audience. Industry-specific navigation, business product cards, business tools section. | https://www.commbank.com.au/business.html, https://www.commbank.com.au/business/banking-and-cards.html |
| 15 | **404 Error** | Low | Custom error illustration, helpful links grid (personal banking, business banking, rates, tools), "We can help" CTA cards (FAQ, contact, branch finder). | https://www.commbank.com.au/404 |

---

## 2. Blocks / Components Catalog

### Global Components

| # | Block Name | Complexity | Description | Reference URLs |
|---|-----------|-----------|-------------|----------------|
| 1 | **Global Header/Navigation** | High | Sticky header with hamburger menu, logo, search dialog, login dropdown with multiple service options (NetBank, CommBiz, etc.). Mega-menu with multi-level navigation, product categories, and promotional tiles. Complex responsive behavior. | All pages |
| 2 | **Global Footer** | Medium | Three-column link navigation (Quick Links, About Us, Important Information), back-to-top button, Acknowledgment of Country, copyright/legal. Consistent across site. | All pages |
| 3 | **Login Dialog** | High | Overlay dialog with multiple login service links (NetBank, CommBank App, CommBiz, CommSec). Session management integration. | All pages (header) |
| 4 | **Search Dialog** | Medium | Full-screen search overlay with predictive/autocomplete search functionality. | All pages (header) |

### Hero Components

| # | Block Name | Complexity | Description | Reference URLs |
|---|-----------|-----------|-------------|----------------|
| 5 | **Hero Banner (Full-width Image)** | Low | Full-width background image with overlaid heading, description text, and CTA button. Used on homepage and category pages. | https://www.commbank.com.au/, https://www.commbank.com.au/banking.html |
| 6 | **Hero Banner (Product)** | Medium | Image with bullet-point feature list, dual CTAs ("Open now" + "Find out more"), and superscript legal references. Variant of hero with richer content. | https://www.commbank.com.au/banking/everyday-accounts.html |
| 7 | **Hero Banner (Article)** | Low | Breadcrumb path, large heading, description, author byline, hero image below title. Content-focused variant. | https://www.commbank.com.au/brighter/financial-education/online-dating-scams.html |
| 8 | **Hero Banner (Error/404)** | Low | Illustration image with error message heading and description text. | https://www.commbank.com.au/404 |

### Card Components

| # | Block Name | Complexity | Description | Reference URLs |
|---|-----------|-----------|-------------|----------------|
| 9 | **Product Navigation Card Grid** | Medium | Icon-based category cards in a grid layout (6 items). Each card has an icon, heading with arrow link, and sub-links list. Used for main product navigation on homepage and category pages. | https://www.commbank.com.au/ (Products & Services), https://www.commbank.com.au/ (Support & FAQs) |
| 10 | **Editorial Card (Image + Text)** | Low | Image thumbnail, heading, description paragraph, "Read more" link. Used in 4-up or 2-up grid layouts. Same content model, different visual layout for grid vs. list view. | https://www.commbank.com.au/ (editorial section) |
| 11 | **Audience/Segment Card** | Medium | Card with heading targeting a specific audience segment (e.g., "Under 30", "Moving to Australia"), bullet list of features, and CTA link. Used in horizontal scrollable carousel. | https://www.commbank.com.au/banking/everyday-accounts.html |
| 12 | **Feature Highlight Card (Icon)** | Low | SVG icon/pictogram, heading, description paragraph. Used in 3-up layouts for key features (e.g., "$0 Monthly Fees", "Award-winning app", "World class security"). | https://www.commbank.com.au/banking/everyday-accounts.html |
| 13 | **Help/Support Card** | Low | Icon, heading, description, link. Used in 4-up row for "We're here to help" sections (Contact, Message, FAQs, Find a Branch). Consistent pattern across most pages. | https://www.commbank.com.au/banking.html (bottom) |
| 14 | **Promotional Card (Large)** | Medium | Larger format card with image, heading, description, and CTA. Used for featured promotions like AFC Women's Cup, cashback offers. | https://www.commbank.com.au/ (AFC Women's Cup section) |
| 15 | **Content Hub Tile (Carousel)** | Medium | Mixed-format content tiles in a horizontal carousel: large feature tile + smaller link tiles with thumbnail images and titles. Used in "More from CommBank" section. | https://www.commbank.com.au/ (bottom) |

### Content Components

| # | Block Name | Complexity | Description | Reference URLs |
|---|-----------|-----------|-------------|----------------|
| 16 | **Split Content (50/50)** | Low | Two-column layout with text content on one side and image on the other. Reversible orientation. Used extensively for promotional content, app showcases, and feature highlights. | https://www.commbank.com.au/banking.html (cashback section), https://www.commbank.com.au/banking/everyday-accounts.html |
| 17 | **App Promotion Block** | Medium | Split layout showcasing mobile app with app store download badges (Apple/Google), bullet feature list, and phone mockup image. | https://www.commbank.com.au/banking.html |
| 18 | **Bullet List with CTAs** | Low | Structured list of features/benefits with inline links, superscript legal references, followed by payment method logos. | https://www.commbank.com.au/banking/everyday-accounts.html |
| 19 | **Blockquote/Pull Quote** | Low | Styled quote block with attribution. Used in articles for expert quotes. | https://www.commbank.com.au/brighter/financial-education/online-dating-scams.html |
| 20 | **Related Articles List** | Low | Simple linked list of related article titles. | https://www.commbank.com.au/brighter/financial-education/online-dating-scams.html |
| 21 | **Social Share Bar** | Low | Row of social media share icons (Twitter, Facebook, LinkedIn, Email) with pre-populated share URLs. | Article pages (Brighter) |
| 22 | **Tags Block** | Low | Label ("Tags") followed by linked tag chips for article categorization. | Article pages (Brighter) |
| 23 | **Financial Difficulty CTA** | Low | Full-width yellow banner with heading and "Get help" CTA button. Support-oriented call-to-action. | https://www.commbank.com.au/ |
| 24 | **Terms & Conditions Accordion** | Medium | Expandable sections containing detailed legal text, footnotes with superscript references, and embedded links. Often very long content blocks. | Most product pages |
| 25 | **Breadcrumb Navigation** | Low | Path-based navigation showing page hierarchy (e.g., Brighter > Financial Education > Article). | Article pages, support sub-pages |
| 26 | **Two-Column Link List** | Low | Two adjacent columns with heading and bulleted link lists. Used for "Already bank with us?" sections and existing customer resources. | https://www.commbank.com.au/banking/everyday-accounts.html |
| 27 | **Life-Stage Card Grid** | Medium | Cards targeted at different life stages (Kids, Students, Travellers, Business) with descriptions and CTAs. Mixed linking patterns. | https://www.commbank.com.au/banking.html |
| 28 | **Tools/Guidance Card Row** | Low | 4-up horizontal card layout with image thumbnails, headings, descriptions, and CTA links for tools and guidance resources. | https://www.commbank.com.au/banking.html |
| 29 | **Rate Display Widget** | High | Dynamic interest rate display cards showing current rates (variable, fixed) with comparison formatting. Pulls live rate data. | https://www.commbank.com.au/home-loans.html |

### Interactive/Complex Components

| # | Block Name | Complexity | Description | Reference URLs |
|---|-----------|-----------|-------------|----------------|
| 30 | **Loan Repayment Calculator** | High | React SPA — slider inputs for loan amount, interest rate, term; toggle for repayment frequency; dynamic results with chart visualization. Completely client-side rendered. | https://www.commbank.com.au/digital/home-buying/calculator/home-loan-repayments |
| 31 | **Branch/ATM Locator** | High | React SPA — map integration (Google Maps), address search, service filters (ATM, Branch, Smart ATM), results list with details. Geolocation support. | https://www.commbank.com.au/digital/locate-us/ |
| 32 | **Product Comparison Table** | Medium | Interactive comparison of product features, rates, and fees across multiple products. Responsive table with feature rows. | https://www.commbank.com.au/credit-cards.html |
| 33 | **AEM ContextHub Personalization** | High | Server-side segmentation engine delivering personalized content based on user profile, browsing behavior, and session data. | All pages (via contexthub.kernel.js) |

---

## 3. Page Counts by Template

| Template | Est. Page Count | Auto-Migratable | Manual Migration | Notes |
|----------|:--------------:|:---------------:|:----------------:|-------|
| Homepage | 1 | No | Yes | Unique layout, dynamic content |
| Product Category Landing | ~15 | Partial | Partial | Pattern-based but with custom content per category |
| Product Listing/Comparison | ~10 | No | Yes | Dynamic rate data, interactive elements |
| Product Detail | ~80-120 | Yes (mostly) | Some | Standardized layout, but many have custom offer sections |
| Article/Editorial (Brighter) | ~500-800 | Yes | Minimal | Highly standardized content structure |
| Content Hub/Listing | ~15-20 | Partial | Partial | Dynamic filtering and pagination |
| Support/FAQ | ~50-80 | Yes (mostly) | Some | Structured Q&A format |
| Support Topic Detail | ~150-200 | Yes | Minimal | Standard informational pages |
| Calculator/Digital Tool (SPA) | ~15-20 | No | Yes | React apps requiring full redevelopment |
| Corporate/About | ~30-50 | Yes (mostly) | Some | Mix of standard and custom content |
| Investor Relations | ~50-80 | Partial | Partial | Document management, financial data |
| Newsroom/Media | ~200-400 | Yes | Minimal | Standardized press release format |
| Careers | ~30-50 | No | Yes | Workday integration dependency |
| Business Landing | ~200-300 | Yes (mostly) | Some | Similar to personal product pages |
| 404 Error | 1 | Yes | No | Static template |
| **TOTAL** | **~1,350-2,200** | | | |

### Migration Approach Summary

| Approach | Page Count | % of Total |
|----------|:---------:|:----------:|
| **Automated migration** (standardized templates) | ~1,000-1,500 | ~65-70% |
| **Semi-automated** (pattern-based with customization) | ~200-400 | ~15-20% |
| **Manual/Custom** (unique layouts, SPAs, integrations) | ~150-300 | ~10-15% |

---

## 4. Integrations Analysis

| # | Integration | Type | Complexity | Purpose | Reference URLs |
|---|------------|------|-----------|---------|----------------|
| 1 | **Adobe Experience Manager (AEM)** | CMS Platform | High | Content management, authoring, delivery. Core CMS powering all `.html` pages. Evidence: `/etc.clientlibs/cba/commbank/`, `/content/dam/`, Granite/jQuery client libraries, ContextHub. | All `.html` pages |
| 2 | **Adobe Experience Platform (AEP)** | API / SDK | High | Customer data platform, event collection, identity management. Edge network integration for real-time personalization. Evidence: `edge.adobedc.net/ee/va6/v1/`, config ID `e7bc0093-86d9-4ef2-bbab-97dad608dd34`. | All pages |
| 3 | **Adobe Launch (Tags)** | Tag Management | Medium | Tag management for all marketing/analytics pixels. Evidence: `commbankaep-launch.min.js`, Launch rule containers loaded dynamically. | All pages |
| 4 | **AEM ContextHub** | Personalization | High | Client-side personalization and segmentation. Loads user context data and applies segment-based content variations. Evidence: `contexthub.kernel.js`, `segmentation.segment.js`, `.pagedata.json` endpoints. | All AEM pages |
| 5 | **Google Analytics 4 (GA4)** | Analytics | Medium | Web analytics tracking. Property ID: `G-Q0L2EZBGEH`. Loaded via Google Tag Manager. | All pages |
| 6 | **Google Tag Manager / Google Ads** | Tag Management / Advertising | Medium | Campaign tracking, conversion measurement. Floodlight tag ID: `DC-10099469`. Evidence: `googletagmanager.com/gtag/js`, `googlesyndication.com`, `ade.googlesyndication.com/ddm/activity`. | All pages |
| 7 | **Facebook Pixel** | Advertising | Medium | Facebook/Meta conversion tracking and audience building. Pixel ID: `1235518430285150`. Evidence: `connect.facebook.net/en_US/fbevents.js`, Facebook Privacy Sandbox integration. | All pages |
| 8 | **Custom Data Layer** | Analytics | Medium | CommBank-specific data layer (`edatalayer.min.js`) pushing page and event data. Powers all downstream analytics. Custom implementation separate from standard `dataLayer`. | All pages |
| 9 | **Adobe Dynamic Media (Scene7)** | Asset CDN | Medium | Image optimization and dynamic rendering. Serves responsive images with URL-based transformations. Evidence: `assets.commbank.com.au/is/image/commbank/`, `assets.commbank.com.au/s7viewers/`. | Product and editorial pages |
| 10 | **AppDynamics (Cisco)** | APM | Low | Application performance monitoring, real-user monitoring (RUM). Evidence: `adrum-ext.*.js` loaded on pages. | All pages |
| 11 | **Adobe Helix RUM** | Analytics | Low | Real User Monitoring from Adobe. Evidence: `rum.hlx.page/.rum/@adobe/helix-rum-js`. Indicates potential EDS/Helix exploration or hybrid setup. | All pages |
| 12 | **Workday** | Recruitment | High | External careers platform for job search and applications. Evidence: Links to `cba.wd3.myworkdayjobs.com/CommBank_Careers`. | Careers pages |
| 13 | **React (Embedded SPAs)** | Framework | High | Client-side React applications for calculators, branch locator, and digital tools under `/digital/` path. Evidence: `clientlib-react.min.js`, React CSS bundles. | `/digital/*` paths |
| 14 | **jQuery + Granite** | Framework | Low | Legacy frontend framework from AEM. jQuery 1.x/2.x with Adobe Granite UI utilities. Evidence: `granite/jquery.min.js`, `granite/utils.min.js`. | All AEM pages |
| 15 | **Lottie Animations** | Animation | Low | Vector animation library for micro-interactions. Evidence: `lottie.js` bundle loaded. | Select pages |
| 16 | **jsPDF** | Document | Low | Client-side PDF generation for rate comparisons, summaries. Evidence: `jspdf.umd.min.js`. | Product/rates pages |
| 17 | **Google Floodlight** | Advertising | Low | Campaign Manager 360 conversion tracking. Evidence: Floodlight tags in DoubleClick activity calls. | All pages |
| 18 | **Google Maps API** | Embed | Medium | Map rendering for branch/ATM locator. | https://www.commbank.com.au/digital/locate-us/ |
| 19 | **NetBank / CommBiz / CommSec** | Authentication | High | Custom authentication systems for online banking, business banking, and share trading. Separate applications hosted on subdomains. | Login dialog on all pages |
| 20 | **Ceba (Virtual Assistant)** | Chat / AI | High | CommBank's AI-powered virtual assistant accessible via the CommBank app and web. Links redirect to `mobile-app-redirect.commbank.com.au/support/messaging`. | Support pages, all pages via nav |

---

## 5. Complex Use Cases & Observations

### 5.1 React Single-Page Applications (SPAs)

| Aspect | Detail |
|--------|--------|
| **Description** | CommBank hosts multiple React-based SPAs under the `/digital/` path. These include loan calculators, budget tools, branch locator, and account opening flows. They are completely separate from the AEM template system. |
| **Instances** | ~15-20 distinct applications |
| **Where Found** | `/digital/home-buying/calculator/`, `/digital/locate-us/`, `/digital/eosmartaccess/`, other `/digital/*` paths |
| **Why Complex** | These cannot be migrated through content migration. They require either: (a) redevelopment as EDS blocks/components, (b) embedding via iframes, or (c) maintaining as separate micro-frontends. Each has its own data APIs and state management. |

### 5.2 AEM ContextHub Personalization

| Aspect | Detail |
|--------|--------|
| **Description** | CommBank uses AEM ContextHub for server-side and client-side content personalization. Pages load user segment data and dynamically swap content components based on visitor profiles. |
| **Instances** | Active on all AEM pages (~1,500+) |
| **Where Found** | Every AEM-rendered page loads ContextHub kernel, segment definitions, and page data JSON |
| **Why Complex** | Edge Delivery Services does not have native ContextHub support. Personalization logic would need to be rebuilt using EDS experimentation/personalization framework or Adobe Target integration. |

### 5.3 Dynamic Rate Data

| Aspect | Detail |
|--------|--------|
| **Description** | Product pages display live interest rates and fee data that updates independently of page content. Rate display widgets pull from backend APIs. |
| **Instances** | ~30-50 pages with live rate data |
| **Where Found** | Home loans, savings, credit cards, business loan pages |
| **Why Complex** | Requires a data integration strategy — either scheduled content updates, API-driven client-side rendering, or a combination. Stale rate data has regulatory implications. |

### 5.4 Multi-Service Authentication

| Aspect | Detail |
|--------|--------|
| **Description** | The login dialog provides access to multiple distinct banking services (NetBank, CommBiz, CommSec) each with separate authentication backends and session management. |
| **Instances** | 1 global component (all pages) |
| **Where Found** | Header navigation, persistent across entire site |
| **Why Complex** | Authentication flows are deeply integrated with proprietary banking systems. The login dialog must maintain session state, handle MFA, and route to correct service. Likely out of scope for content migration but header must integrate. |

### 5.5 Extensive Legal/Compliance Content

| Aspect | Detail |
|--------|--------|
| **Description** | Product pages contain extremely long Terms & Conditions sections with numbered superscript footnote references throughout the page that anchor-link to detailed legal text at the bottom. |
| **Instances** | ~200+ product and promotional pages |
| **Where Found** | All product detail, comparison, and promotional pages |
| **Why Complex** | Content has complex internal linking (superscript to footnote), must be legally accurate, and is frequently updated by compliance teams. Automated migration must preserve all anchor references and superscript formatting. |

### 5.6 Adobe Dynamic Media Integration

| Aspect | Detail |
|--------|--------|
| **Description** | Images are served via Adobe Dynamic Media (Scene7) with URL-based transformations for responsive sizing. Image URLs use patterns like `assets.commbank.com.au/is/image/commbank/{name}?$W728_H432$&fit=crop`. |
| **Instances** | Hundreds of images across all pages |
| **Where Found** | Product images, editorial images, promotional banners |
| **Why Complex** | Image URLs include transformation parameters. Migration must either replicate this dynamic serving or pre-render images at required sizes. EDS has its own image optimization pipeline which may need configuration. |

### 5.7 Mixed Content Architecture

| Aspect | Detail |
|--------|--------|
| **Description** | The site uses a hybrid architecture: traditional AEM-rendered pages (`.html` extension) coexist with React SPAs (`/digital/` paths), and the Brighter content hub uses a different AEM template set with its own header/footer variation. |
| **Instances** | 3 distinct front-end architectures |
| **Where Found** | (1) Main AEM pages, (2) `/digital/` React apps, (3) Brighter content hub |
| **Why Complex** | Requires a phased migration strategy that handles each architecture separately. The Brighter section has a simplified footer and different navigation pattern from the main site. |

---

## 6. Migration Estimates

### Effort Breakdown

| Phase | Scope | Est. Effort | Notes |
|-------|-------|:-----------:|-------|
| **1. Discovery & Planning** | Template mapping, block design, content model | 3-4 weeks | Define EDS block library, content models, metadata structure |
| **2. Design System Migration** | CSS custom properties, typography, colors, spacing | 2-3 weeks | Extract tokens from AEM clientlibs, implement in EDS `styles.css` |
| **3. Block Development** | Build EDS blocks for all 29+ identified components | 6-8 weeks | ~15 unique blocks + variants. Includes hero, cards, navigation, T&Cs, etc. |
| **4. Global Components** | Header, footer, navigation, login integration | 3-4 weeks | Header mega-menu is the most complex component |
| **5. Automated Content Migration** | Articles, support, newsroom, standard product pages | 3-4 weeks | Build import scripts, bulk migrate ~1,000-1,500 pages |
| **6. Semi-Automated Migration** | Category pages, customized product pages | 2-3 weeks | Template-based with manual content review |
| **7. Manual/Custom Pages** | Homepage, unique layouts, specialized pages | 2-3 weeks | Hand-crafted content and custom blocks |
| **8. SPA/Integration Work** | Calculator, locator, rate widgets as EDS blocks or embeds | 4-6 weeks | May require React-to-EDS conversion or iframe embedding |
| **9. Personalization Migration** | Rebuild ContextHub logic in EDS/Target | 2-3 weeks | Define new personalization strategy |
| **10. QA & Testing** | Visual regression, functional testing, accessibility, performance | 4-6 weeks | Concurrent with development phases |
| **11. UAT & Go-Live** | Stakeholder review, content freeze, DNS cutover | 2-3 weeks | Phased rollout recommended |

### Summary Estimates

| Category | Effort (Person-Weeks) |
|----------|:--------------------:|
| **Automated migration development** | 6-8 weeks |
| **Block & template development** | 12-16 weeks |
| **Manual/Custom migration** | 4-6 weeks |
| **Integration & SPA work** | 6-9 weeks |
| **QA & Testing** | 6-8 weeks |
| **Project management & coordination** | 4-6 weeks |
| **Total effort** | **38-53 person-weeks** |

### Recommended Team

| Role | Count | Duration |
|------|:-----:|:--------:|
| Technical Lead / Architect | 1 | Full engagement |
| EDS Developer (Block/Frontend) | 2-3 | 16-20 weeks |
| Content Migration Engineer | 1-2 | 8-12 weeks |
| QA Engineer | 1 | 12-16 weeks |
| Project Manager | 1 | Full engagement |

### Recommended Phased Approach

| Phase | Duration | Scope |
|-------|:--------:|-------|
| **Phase 1: Foundation** | Weeks 1-6 | Design system, global components (header/footer), core blocks, EDS boilerplate |
| **Phase 2: Content Migration** | Weeks 5-12 | Import scripts, bulk article/editorial migration, support pages |
| **Phase 3: Product Pages** | Weeks 8-16 | Product templates, rate integration, category pages |
| **Phase 4: SPA & Integrations** | Weeks 10-18 | Calculator/locator embedding, personalization, login integration |
| **Phase 5: QA & Launch** | Weeks 14-22 | Full regression, accessibility audit, performance optimization, go-live |

### Risk Factors

| Risk | Impact | Mitigation |
|------|--------|-----------|
| React SPA redevelopment scope | High | Consider iframe embedding as interim solution |
| Live rate data integration | Medium | Build server-side rendering pipeline for rate widgets |
| Personalization parity | Medium | Start with simplified rules, iterate post-launch |
| Legal/compliance content accuracy | High | Automated validation of footnote/anchor integrity |
| Large content volume | Medium | Prioritize high-traffic pages, defer low-traffic archival content |

---

## Screenshots Reference

| Page Type | File |
|-----------|------|
| Homepage (full page) | `commbank-homepage-full.png` |
| Home Loans (category) | `commbank-home-loans.png` |
| Credit Cards (listing) | `commbank-credit-cards.png` |
| Banking (category) | `commbank-banking-category.png` |
| Everyday Accounts (product detail) | `commbank-product-detail.png` |
| Article/Editorial | `commbank-article.png` |

---

*Report generated from live site analysis on February 24, 2026*
