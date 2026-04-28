var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".swiper-slide");
    const cells = [];
    slides.forEach((slide) => {
      const images = slide.querySelectorAll("figure img");
      let slideImage = null;
      for (const img of images) {
        const src = img.getAttribute("src") || "";
        if (src && !src.startsWith("data:") && src !== "") {
          slideImage = img;
          break;
        }
      }
      if (!slideImage) return;
      const contentCell = [];
      const headingSpan = slide.querySelector("h1 span");
      if (headingSpan && headingSpan.textContent.trim()) {
        const h2 = document.createElement("h2");
        h2.textContent = headingSpan.textContent.trim();
        contentCell.push(h2);
      }
      const descriptions = slide.querySelectorAll("p");
      descriptions.forEach((p) => {
        if (p.textContent.trim()) {
          contentCell.push(p);
        }
      });
      const ctaLinks = slide.querySelectorAll("a[href]");
      ctaLinks.forEach((link) => {
        if (link.textContent.trim()) {
          contentCell.push(link);
        }
      });
      if (contentCell.length > 0) {
        cells.push([slideImage, contentCell]);
      } else {
        cells.push([slideImage]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-destination.js
  function parse2(element, { document }) {
    const cells = [];
    const cardLinks = Array.from(
      element.querySelectorAll('a[href]:not([class*="button-prev"]):not([class*="button-next"]):not([class*="arrow"]):not([class*="scrollbar"])')
    ).filter((a) => {
      const text = a.textContent.trim();
      const hasImage = a.querySelector('img, picture, [style*="background-image"]');
      return text.length > 0 || hasImage;
    });
    cardLinks.forEach((link) => {
      const img = link.querySelector("img");
      const picture = link.querySelector("picture");
      const imageCell = [];
      if (img) {
        const src = img.getAttribute("src") || img.getAttribute("data-src") || img.getAttribute("data-lazy");
        if (src && !src.startsWith("data:")) {
          const imgEl = document.createElement("img");
          imgEl.src = src;
          const alt = img.getAttribute("alt") || "";
          if (alt) imgEl.alt = alt;
          imageCell.push(imgEl);
        }
      } else if (picture) {
        const pictureImg = picture.querySelector("img");
        if (pictureImg) {
          imageCell.push(pictureImg.cloneNode(true));
        }
      }
      if (imageCell.length === 0) {
        const bgDiv = link.querySelector('[style*="background-image"]');
        if (bgDiv) {
          const style = bgDiv.getAttribute("style") || "";
          const urlMatch = style.match(/url\(["']?([^"')]+)["']?\)/);
          if (urlMatch) {
            const imgEl = document.createElement("img");
            imgEl.src = urlMatch[1];
            imageCell.push(imgEl);
          }
        }
      }
      const titleEl = link.querySelector('h5, h4, h3, h2, h1, h6, strong, [class*="title"], [class*="heading"], [class*="name"]');
      const descEl = link.querySelector("p");
      let titleText = "";
      if (titleEl) {
        titleText = titleEl.textContent.trim();
      } else {
        const clonedLink = link.cloneNode(true);
        clonedLink.querySelectorAll("img, picture, svg").forEach((el) => el.remove());
        titleText = clonedLink.textContent.trim();
      }
      if (!titleText && imageCell.length === 0) return;
      const contentCell = [];
      if (titleText) {
        const strong = document.createElement("strong");
        strong.textContent = titleText;
        contentCell.push(strong);
      }
      if (descEl) {
        const descText = descEl.textContent.trim();
        if (descText && descText !== titleText) {
          const p = document.createElement("p");
          p.textContent = descText;
          contentCell.push(p);
        }
      }
      if (link.href) {
        const cta = document.createElement("a");
        cta.href = link.href;
        cta.textContent = titleText || link.href;
        contentCell.push(cta);
      }
      if (contentCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-destination", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse3(element, { document }) {
    const iframe = element.querySelector('iframe[src*="youtube"]');
    let mediaCell;
    if (iframe) {
      const iframeSrc = iframe.getAttribute("src") || "";
      const videoIdMatch = iframeSrc.match(/youtube\.com\/embed\/([^?&]+)/);
      const videoUrl = videoIdMatch ? `https://www.youtube.com/watch?v=${videoIdMatch[1]}` : iframeSrc;
      const videoLink = document.createElement("a");
      videoLink.href = videoUrl;
      videoLink.textContent = videoUrl;
      mediaCell = videoLink;
    } else {
      const img = element.querySelector('img[src]:not([src^="data:"])');
      mediaCell = img || "";
    }
    const contentElements = [];
    const heading = element.querySelector('h1, h2, h3, [class*="title"]:not(iframe)');
    if (heading) {
      contentElements.push(heading);
    }
    const descriptionDiv = element.querySelector('div[class*="dNFkOE"], div[class*="description"]');
    if (descriptionDiv) {
      const paragraphs = descriptionDiv.querySelectorAll("p");
      paragraphs.forEach((p) => contentElements.push(p));
    } else {
      const paragraphs = element.querySelectorAll("p");
      paragraphs.forEach((p) => contentElements.push(p));
    }
    const ctaContainer = element.querySelector('div[class*="bMQLwG"], div[class*="cta"]');
    let ctaLinks;
    if (ctaContainer) {
      ctaLinks = Array.from(ctaContainer.querySelectorAll("a[href]"));
    } else {
      ctaLinks = Array.from(element.querySelectorAll('a[href]:not([class*="video"])'));
    }
    ctaLinks.forEach((link) => {
      const iconSpan = link.querySelector('div[class*="iIvHqT"], span[class*="blIAwI"]');
      if (iconSpan) {
        iconSpan.remove();
      }
      contentElements.push(link);
    });
    const cells = [
      [mediaCell, contentElements]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-newsletter.js
  function parse4(element, { document }) {
    const bgImage = element.querySelector("figure img[alt]") || element.querySelector("figure img");
    const heading = element.querySelector("h3") || element.querySelector('h2, h1, [class*="title"]');
    const description = element.querySelector("p") || element.querySelector('[class*="description"], [class*="subtitle"]');
    const ctaLink = element.querySelector("a[href]");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-newsletter", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/queensland-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#search-container"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#header-menu2",
        "footer.sc-erbPVk",
        "a.skip-link",
        "#destination_publishing_iframe_queensland_0",
        "iframe",
        "noscript",
        "link",
        'img[src*="yieldoptimizer"]',
        'img[src*="sp.analytics.yahoo.com"]'
      ]);
    }
  }

  // tools/importer/transformers/queensland-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElement(root, selector) {
    const sel = Array.isArray(selector) ? selector[0] : selector;
    if (!sel) return null;
    const nthMatch = sel.match(/^(.+):nth-of-type\((\d+)\)$/);
    if (nthMatch) {
      const baseSelector = nthMatch[1];
      const nthIndex = parseInt(nthMatch[2], 10);
      const allMatches = root.querySelectorAll(baseSelector);
      return allMatches.length >= nthIndex ? allMatches[nthIndex - 1] : null;
    }
    const idMatch = sel.match(/^([a-z]*)#(.+)$/i);
    if (idMatch) {
      const tag = idMatch[1] || "";
      const idVal = idMatch[2];
      const attrSel = tag ? `${tag}[id="${idVal}"]` : `[id="${idVal}"]`;
      try {
        return root.querySelector(attrSel);
      } catch (e) {
        return null;
      }
    }
    try {
      return root.querySelector(sel);
    } catch (e) {
      return null;
    }
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSectionElement(element, section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metadataBlock);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-destination": parse2,
    "columns-cta": parse3,
    "hero-newsletter": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Queensland tourism homepage with hero video/image slider, destination carousels, editorial sections, events, and newsletter signup",
    urls: [
      "https://www.queensland.com/in/en/home"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: ["#hero-banner-slider"]
      },
      {
        name: "cards-destination",
        instances: [
          "section.sc-fRfEKy",
          "section.sc-flkahu",
          "#region-map-carousel-container",
          "#masonry-grid-category-wrapper",
          "#masonry-grid-article-wrapper"
        ]
      },
      {
        name: "columns-cta",
        instances: ["#image-cta_757096332"]
      },
      {
        name: "hero-newsletter",
        instances: ["section.sc-abVJb"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner Slider",
        selector: "#hero-banner-slider",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Discover Queenslands Icons",
        selector: ["[id='editorial-description-wrapper']:nth-of-type(1)"],
        style: null,
        blocks: [],
        defaultContent: ["h2", "p"]
      },
      {
        id: "section-3",
        name: "Explore Our Destinations",
        selector: "section#---wrapper",
        style: null,
        blocks: ["cards-destination"],
        defaultContent: ["h2"]
      },
      {
        id: "section-4",
        name: "Whats On in Queensland",
        selector: "section.sc-flkahu",
        style: null,
        blocks: ["cards-destination"],
        defaultContent: ["h2"]
      },
      {
        id: "section-5",
        name: "Roadtrips Popular Now",
        selector: "section#--wrapper:nth-of-type(1)",
        style: null,
        blocks: ["cards-destination"],
        defaultContent: ["h2"]
      },
      {
        id: "section-6",
        name: "That Holiday Feeling CTA",
        selector: "#image-cta_757096332",
        style: null,
        blocks: ["columns-cta"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Let Us Show You Around",
        selector: "#region-map-carousel-container",
        style: null,
        blocks: ["cards-destination"],
        defaultContent: ["h2"]
      },
      {
        id: "section-8",
        name: "What Holiday Feeling Are You",
        selector: "#masonry-grid-category-wrapper",
        style: null,
        blocks: ["cards-destination"],
        defaultContent: ["h2"]
      },
      {
        id: "section-9",
        name: "Be Our Plus One Events",
        selector: "section#--wrapper:nth-of-type(2)",
        style: null,
        blocks: ["cards-destination"],
        defaultContent: ["h2"]
      },
      {
        id: "section-10",
        name: "Unlock More Queensland Magic",
        selector: "#masonry-grid-article-wrapper",
        style: null,
        blocks: ["cards-destination"],
        defaultContent: ["h2"]
      },
      {
        id: "section-11",
        name: "Newsletter Signup",
        selector: "section#-",
        style: "teal",
        blocks: ["hero-newsletter"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
