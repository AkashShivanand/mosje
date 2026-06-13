import sanitizeHtml from "sanitize-html";

export function sanitize(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "a", "ul", "ol", "li", "strong", "em", "b", "i",
      "br", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "img", "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: { ...attribs, ...(attribs.href?.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {}) },
      }),
    },
  });
}
