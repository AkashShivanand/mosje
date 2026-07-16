import { parse } from "node-html-parser";

// Elementor/structure noise to remove before extraction.
const DROP_SELECTORS = [
  ".elementor-swiper-button", ".swiper-pagination", ".swiper-button-next",
  ".swiper-button-prev", "script", "style", "noscript", "nav",
  ".elementor-widget-google_maps", "iframe",
];
const HEADING_TAGS = new Set(["h1", "h2", "h3"]);

function cleanRoot(html) {
  const root = parse(html, { blockTextElements: { script: false, style: false } });
  for (const sel of DROP_SELECTORS) root.querySelectorAll(sel).forEach((n) => n.remove());
  return root;
}

// Returns [{ heading: string|null, html: string }], skipping empty sections.
export function extractSections(html) {
  const root = cleanRoot(html);
  const matched = root.querySelectorAll("h1,h2,h3,p,ul,ol,table,blockquote");
  const matchedSet = new Set(matched);
  // Keep only outermost matches (a node with a matched ancestor is contained in that ancestor's outerHTML).
  const nodes = matched.filter((n) => {
    for (let p = n.parentNode; p; p = p.parentNode) {
      if (matchedSet.has(p)) return false;
    }
    return true;
  });
  const sections = [];
  let current = { heading: null, parts: [] };
  const flush = () => {
    const inner = current.parts.join("").trim();
    if (current.heading || inner) sections.push({ heading: current.heading, html: inner });
  };
  for (const node of nodes) {
    if (HEADING_TAGS.has(node.tagName.toLowerCase())) {
      flush();
      current = { heading: node.text.trim().replace(/\s+/g, " "), parts: [] };
    } else {
      const t = node.outerHTML.trim();
      if (t) current.parts.push(t);
    }
  }
  flush();
  return sections.filter((s) => s.heading || s.html);
}

export function collectImageUrls(html) {
  const root = cleanRoot(html);
  return root
    .querySelectorAll("img")
    .map((n) => n.getAttribute("src"))
    .filter((src) => src && /^https?:\/\//.test(src));
}
