// Parsers for the record pages of dosje.gov.in.
//
// The WordPress REST API exposes title, date and taxonomy terms for these post
// types, but NOT the theme/ACF fields (file URL, size, year, event venue, gallery
// images, an official's contact card): `acf` comes back empty for every type but
// `booking`. Those fields exist only in the rendered page, so each parser here
// takes the page HTML and returns plain fields. Pure functions — no network.
import { parse } from "node-html-parser";
import { decodeEntities } from "./utils.mjs";
import { sanitize } from "./sanitize.mjs";

const DOC_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|odt|ods|csv)(?:[?#]|$)/i;
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

/** Collapse whitespace and decode entities; "" for nullish. */
export function clean(s) {
  return decodeEntities(String(s ?? "").replace(/\s+/g, " "));
}

/** The site's "no value" markers → undefined. */
export function present(s) {
  const v = clean(s);
  return v === "" || /^(na|n\/a|-|--|null|none)$/i.test(v) ? undefined : v;
}

const pad = (n) => String(n).padStart(2, "0");
function iso(y, m, d) {
  if (!(y > 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 31)) return undefined;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/**
 * Normalise the date shapes the site prints to YYYY-MM-DD:
 * "01/01/2026" (dd/mm/yyyy), "08-12-2011", "20260604" (yyyymmdd),
 * "Sep 1st, 2026", "2026-06-04". Anything else → undefined.
 */
export function parseSiteDate(s) {
  const v = present(s);
  if (!v) return undefined;
  let m = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (m) return iso(+m[3], +m[2], +m[1]);
  m = v.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = v.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/);
  if (m && MONTHS[m[1].toLowerCase()]) return iso(+m[3], MONTHS[m[1].toLowerCase()], +m[2]);
  return undefined;
}

/** "PDF" from ".../file.pdf"; undefined when the URL has no document extension. */
export function fileTypeOf(url) {
  const m = url && String(url).match(DOC_EXT);
  return m ? m[1].toUpperCase() : undefined;
}

/** The page body between the site header and footer, parsed. */
export function mainRoot(html) {
  const s = String(html ?? "");
  const start = s.indexOf("</header>");
  const end = s.lastIndexOf("<footer");
  const body = s.slice(start === -1 ? 0 : start + 9, end > start ? end : s.length);
  return parse(body, { blockTextElements: { script: false, style: false, noscript: false } });
}

const absUrl = (u) => {
  const v = present(u);
  return v && /^https?:\/\//.test(v) ? v : undefined;
};

/** Drop undefined / empty-array keys so the JSON stays lean. */
export function compact(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

// ── Label/value table rows (documents, scheme documents, suo-moto, CPIO) ─────

/**
 * Every `<tbody><tr>` under `root` as { cells: {Label: node}, tr }. The label is
 * the cell's own `.heading-label` (the mobile label the theme prints in every
 * cell) or, failing that, the column's `<th>`.
 */
export function labelledRows(root) {
  const headers = root.querySelectorAll("thead th").map((th) => clean(th.text));
  return root.querySelectorAll("tbody tr").flatMap((tr) => {
    const tds = tr.querySelectorAll("td");
    if (!tds.length) return [];
    const cells = {};
    tds.forEach((td, i) => {
      const labelNode = td.querySelector(".heading-label");
      const label = labelNode ? clean(labelNode.text) : headers[i];
      if (label) cells[label] = td;
    });
    return [{ cells, tr }];
  });
}

/** A cell's value text, without its `.heading-label`. */
export function cellText(td) {
  if (!td) return undefined;
  const copy = parse(td.innerHTML);
  copy.querySelectorAll(".heading-label").forEach((n) => n.remove());
  return present(copy.text);
}

/** One document row → file metadata. Shared by the listing and the page. */
export function documentRowFields({ cells, tr }) {
  const titleCell = cells.Title;
  const titleLink = titleCell?.querySelector("a");
  const orgLink = cells.Organisation?.querySelector("a");
  const sizeSpan = tr.querySelector("[data-size-en]");
  const urlNode = tr.querySelector("[data-url-en]");
  const downloads = tr.querySelectorAll("a[href]").map((a) => a.getAttribute("href")).filter((h) => DOC_EXT.test(h ?? ""));
  const fileUrl = absUrl(urlNode?.getAttribute("data-url-en")) ?? absUrl(downloads[0]);
  const fileUrlHi = absUrl(urlNode?.getAttribute("data-url-hi"));
  const fileSize = present(sizeSpan?.getAttribute("data-size-en")) ?? cellText(cells.Size);
  const fileSizeHi = present(sizeSpan?.getAttribute("data-size-hi"));
  // Some records publish no upload at all and link an external host instead
  // (a Drive file, another department's site); the theme renders that as "View".
  const actionCell = cells.Action ?? tr.querySelectorAll("td").at(-1);
  const externalUrl = fileUrl
    ? undefined
    : absUrl(actionCell?.querySelectorAll("a[href]").map((a) => a.getAttribute("href")).find((h) => /^https?:\/\//.test(h ?? "")));
  return compact({
    title: cellText(titleCell),
    recordUrl: absUrl(titleLink?.getAttribute("href")),
    organisation: cellText(cells.Organisation),
    organisationUrl: absUrl(orgLink?.getAttribute("href")),
    year: cellText(cells.Year),
    fileUrl,
    fileType: fileTypeOf(fileUrl),
    fileSize,
    externalUrl,
    fileUrlHi: fileUrlHi && fileUrlHi !== fileUrl ? fileUrlHi : undefined,
    fileSizeHi: fileUrlHi && fileUrlHi !== fileUrl ? fileSizeHi : undefined,
    publishStart: parseSiteDate(cellText(cells["Start Publish Date"])) ?? cellText(cells["Start Publish Date"]),
    publishEnd: parseSiteDate(cellText(cells["End Publish Date"])) ?? cellText(cells["End Publish Date"]),
  });
}

/** The documents library listing fragment (admin-ajax) → rows keyed by record URL. */
export function parseDocumentListing(html) {
  // The fragment is bare <tr> rows (injected into the page's <tbody>), which an
  // HTML parser drops outside a table — so give them one.
  const s = String(html ?? "");
  const wrapped = /<tbody/i.test(s) ? s : `<table><tbody>${s}</tbody></table>`;
  return labelledRows(parse(wrapped)).map(documentRowFields).filter((r) => r.recordUrl);
}

/** A document / scheme-document / suo-moto page → its single row + scheme link. */
export function parseDocumentPage(html) {
  const root = mainRoot(html);
  const row = labelledRows(root)[0];
  const fields = row ? documentRowFields(row) : {};
  const schemeP = root.querySelectorAll("p").find((p) => /^\s*Scheme:/i.test(p.text));
  const schemeA = schemeP?.querySelector("a");
  return compact({
    ...fields,
    scheme: schemeA ? clean(schemeA.text) : undefined,
    schemeUrl: absUrl(schemeA?.getAttribute("href")),
  });
}

/** A CPIO page → office, officer, designation, email. */
export function parseCpioPage(html) {
  const row = labelledRows(mainRoot(html))[0];
  if (!row) return {};
  const c = row.cells;
  return compact({
    office: cellText(c["Office/Division"]),
    name: cellText(c.Name),
    organisation: cellText(c.Organisation),
    designation: cellText(c.Designation),
    email: cellText(c.Email),
  });
}

/** A sewer-death case page → the one row of its detail table. */
export function parseSewerCasePage(html) {
  const row = labelledRows(mainRoot(html))[0];
  if (!row) return {};
  const c = row.cells;
  const amount = cellText(c["Amount (₹)"] ?? c.Amount);
  const amountInr = amount ? Number(amount.replace(/[^\d.]/g, "")) : NaN;
  const dateText = cellText(c["Date of Death"]);
  return compact({
    state: cellText(c.State),
    district: cellText(c.District),
    name: cellText(c["Name of Deceased"]),
    dateOfDeath: parseSiteDate(dateText) ?? dateText,
    paymentStatus: cellText(c["Payment Status"]),
    amount,
    amountInr: Number.isFinite(amountInr) && amount ? amountInr : undefined,
  });
}

// ── Officials ────────────────────────────────────────────────────────────────

const SOCIAL = /(facebook|twitter|x\.com|linkedin|instagram|youtube|threads)\./i;

/** `<p><strong>Label:</strong> value</p>` pairs under `root`. */
export function strongPairs(root) {
  const out = {};
  for (const p of root.querySelectorAll("p, li")) {
    const strong = p.querySelector("strong");
    if (!strong) continue;
    const label = clean(strong.text).replace(/:\s*$/, "");
    if (!label) continue;
    const copy = parse(p.innerHTML);
    copy.querySelector("strong")?.remove();
    out[label] = { text: present(copy.text), node: p };
  }
  return out;
}

/** An official's page → portrait, designation, organisation, contact card. */
export function parseOfficialPage(html) {
  const root = mainRoot(html);
  const img = root.querySelectorAll("img").find((i) => /wp-content\/uploads/.test(i.getAttribute("src") ?? ""));
  const srcset = img?.getAttribute("srcset") ?? "";
  // The largest srcset candidate is the uploaded original.
  const largest = srcset
    .split(",")
    .map((c) => c.trim().split(/\s+/))
    .filter(([u, w]) => u && w)
    .sort((a, b) => parseInt(b[1], 10) - parseInt(a[1], 10))[0]?.[0];
  const p = strongPairs(root);
  const orgA = p.Organisation?.node.querySelector("a");
  const sections = {};
  for (const h of root.querySelectorAll("h4")) {
    const heading = clean(h.text);
    if (!heading || /^contact information$/i.test(heading)) continue;
    const parent = h.parentNode;
    const copy = parse(parent.innerHTML);
    copy.querySelector("h4")?.remove();
    const htmlOut = sanitize(copy.innerHTML).trim();
    if (clean(parse(htmlOut).text)) sections[heading] = htmlOut;
  }
  return compact({
    imageUrl: absUrl(largest) ?? absUrl(img?.getAttribute("src")),
    designation: p.Designation?.text,
    organisation: p.Organisation?.text,
    organisationUrl: absUrl(orgA?.getAttribute("href")),
    tenure: p.Tenure?.text,
    intercom: p.Intercom?.text,
    phoneOffice: p["Contact (Office)"]?.text,
    phoneResidence: p["Contact (Res)"]?.text,
    email: p.Email?.text,
    address: p.Address?.text,
    socialLinks: [...new Set(root.querySelectorAll("a[href]").map((a) => a.getAttribute("href")).filter((h) => SOCIAL.test(h ?? "")))],
    workAllocationHtml: sections["Work Allocation"],
    additionalInfoHtml: sections["Additional Information"] ?? sections["Additional Info"],
  });
}

// ── Events ───────────────────────────────────────────────────────────────────

/** Card caption beside a gallery thumbnail: the date span and the title line. */
function cardMeta(node) {
  const card = node.closest(".card") ?? node.parentNode;
  const body = card?.querySelector(".card-body");
  if (!body) return {};
  const dateText = present(body.querySelector("span")?.text);
  const caption = present(body.querySelector(".title-2, .title-3, .title-1")?.text);
  return compact({ date: parseSiteDate(dateText) ?? dateText, caption });
}

/**
 * The event page's "Date and Time" line → start/end dates.
 * "Sep 1st, 2026 • 01:16 PM to Sep 3rd, 2026 • 02:22 PM" → 2026-09-01 / 2026-09-03.
 */
export function parseEventWhen(text) {
  const v = present(text);
  if (!v) return {};
  const parts = v.split(/\s+to\s+/i);
  const startDate = parseSiteDate(parts[0]);
  const endDate = parts[1] ? parseSiteDate(parts[1]) : undefined;
  return compact({ startDate, endDate: endDate && endDate !== startDate ? endDate : undefined });
}

/** An event page → description, organiser, venue, when, photos, videos, PDF. */
export function parseEventPage(html) {
  const root = mainRoot(html);
  const tags = root.querySelectorAll(".scheme-tags-buttons span").map((s) => clean(s.text)).filter(Boolean);
  const desc = root.querySelector(".event-description");
  const descriptionHtml = desc ? sanitize(desc.innerHTML).trim() : undefined;

  const fields = {};
  for (const label of root.querySelectorAll(".label-2.text-hint")) {
    const value = label.nextElementSibling;
    const key = clean(label.text);
    if (key && value) fields[key] = present(value.text);
  }
  const modeH = root.querySelectorAll("h5").find((h) => /^mode$/i.test(clean(h.text)));
  const pdf = root.querySelector("[data-pdf-en]");
  const status = root
    .querySelectorAll("span.badge")
    .filter((b) => !b.closest(".wpdfv-wrapper"))
    .map((b) => clean(b.text))
    .find(Boolean);

  const photos = root.querySelectorAll('a[data-fancybox^="event-photos"]').map((a) =>
    compact({ url: absUrl(a.getAttribute("href")), thumbnailUrl: absUrl(a.getAttribute("data-thumb")), ...cardMeta(a) }),
  ).filter((p) => p.url);
  const videos = root.querySelectorAll("video").map((v) =>
    compact({ url: absUrl(v.getAttribute("src") ?? v.querySelector("source")?.getAttribute("src")), poster: absUrl(v.getAttribute("poster")), ...cardMeta(v) }),
  ).filter((v) => v.url);
  const left = root.querySelector(".col-md-8") ?? root;
  const links = [...new Set(
    left.querySelectorAll("a[href]")
      .map((a) => a.getAttribute("href"))
      .filter((h) => /^https?:\/\//.test(h ?? "") && !/dosje\.gov\.in\/(events|organisation)\//.test(h)),
  )];
  const when = fields["Date and Time"];
  return compact({
    tags,
    descriptionHtml: descriptionHtml && clean(parse(descriptionHtml).text) ? descriptionHtml : undefined,
    pdfUrl: absUrl(pdf?.getAttribute("data-pdf-en")),
    pdfUrlHi: absUrl(pdf?.getAttribute("data-pdf-hi")),
    mode: modeH ? present(modeH.nextElementSibling?.text) : undefined,
    organizer: fields.Organizer,
    email: fields.Email,
    mobile: fields.Mobile,
    totalHours: fields["Total Hours"],
    status,
    when,
    ...parseEventWhen(when),
    location: fields.Location,
    photos,
    videos,
    links,
  });
}

// ── Gallery ──────────────────────────────────────────────────────────────────

const YOUTUBE = /(youtube\.com|youtu\.be)\//i;

/** A gallery page → description, source, images, videos. */
export function parseGalleryPage(html) {
  const root = mainRoot(html);
  const catP = root.querySelectorAll("div, p").find((n) => /^\s*View other .* in this category:/i.test(n.childNodes.map((c) => c.rawText ?? "").join("")));
  const categoryA = catP?.querySelector("a");
  const paragraphs = root.querySelectorAll("p");
  const sourceSpan = root.querySelectorAll("span").find((s) => /^\s*Source:/i.test(s.text));
  const sourceP = sourceSpan?.closest("p");
  const visit = sourceP?.querySelectorAll("a").find((a) => /visit/i.test(a.text)) ??
    root.querySelectorAll("a").find((a) => /^\s*visit link\s*$/i.test(a.text));
  const description = paragraphs
    .filter((p) => p !== sourceP && !p.querySelector("span") && !/^\s*View (All|other)/i.test(p.text))
    .map((p) => clean(p.text))
    .filter(Boolean)
    .join("\n\n");
  const images = root.querySelectorAll('a[data-fancybox="single-gallery"]').map((a) => {
    const img = a.querySelector("img");
    return compact({ url: absUrl(a.getAttribute("href")), thumbnailUrl: absUrl(img?.getAttribute("src")), alt: present(img?.getAttribute("alt")) });
  }).filter((i) => i.url);
  const fileVideos = root.querySelectorAll("video").map((v) =>
    absUrl(v.getAttribute("src") ?? v.querySelector("source")?.getAttribute("src")));
  const embeds = [
    ...root.querySelectorAll("iframe").map((f) => f.getAttribute("src")),
    ...root.querySelectorAll("a[href]").map((a) => a.getAttribute("href")),
  ].filter((u) => YOUTUBE.test(u ?? ""));
  const videos = [
    ...fileVideos.filter(Boolean).map((url) => ({ url, kind: "file" })),
    ...[...new Set(embeds)].map((url) => ({ url, kind: "youtube" })),
  ];
  return compact({
    category: categoryA ? clean(categoryA.text) : undefined,
    description: description || undefined,
    source: sourceSpan ? present(clean(sourceSpan.text).replace(/^Source:\s*/i, "")) : undefined,
    sourceUrl: absUrl(visit?.getAttribute("href")),
    images,
    videos,
  });
}

// ── Booking (DAIC venues) ────────────────────────────────────────────────────

/** A venue page → images and downloadable documents (rates come from REST `acf`). */
export function parseBookingPage(html) {
  const root = mainRoot(html);
  const images = [...new Set(
    root.querySelectorAll("img").map((i) => absUrl(i.getAttribute("src"))).filter((u) => u && /wp-content\/uploads/.test(u)),
  )];
  const documents = root.querySelectorAll("li").flatMap((li) => {
    const a = li.querySelector("a[href]");
    const url = absUrl(a?.getAttribute("href"));
    if (!url || !DOC_EXT.test(url)) return [];
    const label = present(clean(li.querySelector("strong")?.text).replace(/:\s*$/, "")) ?? present(a.text);
    return [compact({ label, url, fileType: fileTypeOf(url) })];
  });
  return compact({ images, documents });
}

// ── Updates (Elementor body in REST `content`) ───────────────────────────────

/** An update's rendered content → sanitised body, attachments, videos. */
export function parseUpdateContent(contentHtml) {
  const root = parse(String(contentHtml ?? ""));
  const seen = new Set();
  const attachments = root.querySelectorAll("a[href]").flatMap((a) => {
    const url = absUrl(a.getAttribute("href"));
    if (!url || !DOC_EXT.test(url) || seen.has(url)) return [];
    seen.add(url);
    return [compact({ label: present(a.text) ?? present(a.getAttribute("aria-label")), url, fileType: fileTypeOf(url) })];
  });
  const videos = root.querySelectorAll("video").map((v) =>
    compact({ url: absUrl(v.getAttribute("src") ?? v.querySelector("source")?.getAttribute("src")), poster: absUrl(v.getAttribute("poster")) }),
  ).filter((v) => v.url);
  const bodyHtml = sanitize(String(contentHtml ?? "")).replace(/\s+/g, " ").trim();
  const hasText = clean(parse(bodyHtml).text) !== "";
  return compact({ bodyHtml: hasText ? bodyHtml : undefined, attachments, videos });
}
