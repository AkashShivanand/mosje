import sanitizeHtml from "sanitize-html";

/** An href that is a CMS token, not an address: upper case, digits and underscores only. */
const DEAD_HREF = /^[A-Z][A-Z0-9_]*$/;

export function sanitize(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "h5", "h6", "div", "p", "a", "ul", "ol", "li", "strong", "em", "b", "i",
      "br", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "img", "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "width", "height", "class"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: {
      a: (tagName, attribs) =>
        // An anchor with no address, or one the CMS left as a token ("PLACEHOLDER_URL_1"
        // on NCBC's Judgments page), is a control that does nothing: keep its label as text.
        !attribs.href?.trim() || DEAD_HREF.test(attribs.href.trim())
          ? { tagName: "span", attribs: {} }
          : {
              tagName: "a",
              attribs: { ...attribs, ...(attribs.href.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {}) },
            },
    },
  });
}
