import { extractSections } from "./html-extract.mjs";
import { sanitize } from "./sanitize.mjs";

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&#038;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘").replace(/&nbsp;/g, " ").trim();
}

function firstGovLink(sections) {
  for (const s of sections) {
    const m = s.html.match(/href="(https?:\/\/[^"]*(?:\.nic\.in|\.gov\.in)[^"]*)"/);
    if (m) return m[1];
  }
  return undefined;
}

export function transformRecord(raw, ctx = {}) {
  const rawSections = extractSections(raw.content?.rendered ?? "");
  const sections = rawSections
    .map((s) => ({ heading: s.heading ? decodeEntities(s.heading) : null, html: sanitize(s.html) }))
    .filter((s) => s.heading || s.html);
  const rec = {
    slug: raw.slug,
    title: decodeEntities(raw.title?.rendered ?? ""),
    sourceUrl: raw.link,
    sections,
  };
  const tax = ctx.taxonomyNames ?? {};
  if (tax.category?.length) rec.category = tax.category[0];
  if (tax.targetGroup?.length) rec.targetGroup = tax.targetGroup;
  const website = firstGovLink(sections);
  if (website) rec.website = website;
  return rec;
}
