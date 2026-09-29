import sanitizeHtml from "sanitize-html";

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
      /* A link the Department's editor never filled in — `href="PLACEHOLDER_URL_1"` on
         NCBC's Judgments page (29 Sep 2026) — goes nowhere. Its label stays, as text. */
      a: (tagName, attribs) =>
        /^\s*PLACEHOLDER/i.test(attribs.href ?? "")
          ? { tagName: "span", attribs: {} }
          : {
              tagName: "a",
              attribs: { ...attribs, ...(attribs.href?.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {}) },
            },
    },
  });
}
