import { extractSections } from "./html-extract.mjs";
import { sanitize } from "./sanitize.mjs";
import { decodeEntities } from "./utils.mjs";

function firstGovLink(sections) {
  for (const s of sections) {
    const m = s.html.match(/href="(https?:\/\/[^"]*(?:\.nic\.in|\.gov\.in)[^"]*)"/);
    if (m) return m[1];
  }
  return undefined;
}

const DOC_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip)(?:[?#]|$)/i;

export function transformFileRecord(raw, ctx = {}) {
  const html = raw.content?.rendered ?? "";
  const links = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  const fileUrl = links.find((u) => DOC_EXT.test(u));
  const rec = {
    slug: raw.slug,
    title: decodeEntities(raw.title?.rendered ?? ""),
    sourceUrl: raw.link,
  };
  if (raw.date) rec.date = String(raw.date).slice(0, 10);
  const tax = ctx.taxonomyNames ?? {};
  if (tax.category?.length) {
    // When a preferred set is given (collections that fetch a subset of a multi-term
    // taxonomy), pick the first category that is in that set so a record carrying both a
    // wanted and an unwanted term lands in the right bucket. Else keep first term.
    const prefer = ctx.preferCategories;
    rec.category =
      (prefer && tax.category.find((c) => prefer.includes(c))) || tax.category[0];
  }
  if (fileUrl) rec.fileUrl = fileUrl;
  return rec;
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
