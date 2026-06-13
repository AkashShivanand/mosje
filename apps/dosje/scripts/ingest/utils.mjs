// Decode the small set of HTML entities WordPress emits in titles/term names.
export function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&#038;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘").replace(/&nbsp;/g, " ").trim();
}
