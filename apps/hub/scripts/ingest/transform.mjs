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

// ── Rich collections ─────────────────────────────────────────────────────────
// Each takes the REST row plus `ctx`:
//   terms  — { "<taxonomy rest base>": string[] } resolved term names
//   detail — fields parsed from the record's public page (detail-extract.mjs)
//   media  — Map(mediaId -> { url, thumbnailUrl? }) for featured/ACF images
// Keys with no value are omitted, so a record's JSON only carries what it has.

function compactRecord(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

function baseRecord(raw) {
  return {
    slug: raw.slug,
    title: decodeEntities(raw.title?.rendered ?? ""),
    sourceUrl: raw.link,
    date: raw.date ? String(raw.date).slice(0, 10) : undefined,
  };
}

const first = (arr) => (arr && arr.length ? arr[0] : undefined);
const many = (arr) => (arr && arr.length > 1 ? arr : undefined);

// Documents, scheme documents and suo-moto disclosures share one row shape.
export function transformDocumentRecord(raw, ctx = {}) {
  const t = ctx.terms ?? {};
  const d = ctx.detail ?? {};
  const types = t["documents-type"] ?? [];
  const prefer = ctx.preferCategories;
  const orgs = t.organisation_cat ?? [];
  return compactRecord({
    ...baseRecord(raw),
    category: (prefer && types.find((c) => prefer.includes(c))) || first(types),
    types,
    organisation: first(orgs) ?? d.organisation,
    organisations: many(orgs),
    year: d.year,
    fileUrl: d.fileUrl,
    fileType: d.fileType,
    fileSize: d.fileSize,
    externalUrl: d.externalUrl,
    fileUrlHi: d.fileUrlHi,
    fileSizeHi: d.fileSizeHi,
    publishStart: d.publishStart,
    publishEnd: d.publishEnd,
    scheme: d.scheme,
    schemeUrl: d.schemeUrl,
    commission: first(t.commission),
    states: t.states,
    status: first(t.component_status),
    serialNumber: first(t["serial-number"]),
    tags: t.tags,
  });
}

export function transformEventRecord(raw, ctx = {}) {
  const t = ctx.terms ?? {};
  const d = ctx.detail ?? {};
  const featured = ctx.media?.get(raw.featured_media);
  return compactRecord({
    ...baseRecord(raw),
    categories: t["event-category"],
    galleryCategories: t["gallery-category"],
    organisation: first(t.organisation_cat),
    startDate: d.startDate,
    endDate: d.endDate,
    when: d.when,
    location: d.location,
    mode: d.mode,
    status: d.status,
    organizer: d.organizer,
    email: d.email,
    mobile: d.mobile,
    totalHours: d.totalHours,
    descriptionHtml: d.descriptionHtml,
    pdfUrl: d.pdfUrl,
    pdfUrlHi: d.pdfUrlHi,
    imageUrl: featured?.url ?? d.photos?.[0]?.url,
    photos: d.photos,
    videos: d.videos,
    links: d.links,
  });
}

export function transformGalleryRecord(raw, ctx = {}) {
  const t = ctx.terms ?? {};
  const d = ctx.detail ?? {};
  const featured = ctx.media?.get(raw.featured_media);
  return compactRecord({
    ...baseRecord(raw),
    type: first(t["gallery-type"]),
    categories: t["gallery-category"],
    organisation: first(t.organisation_cat),
    description: d.description,
    source: d.source,
    sourceLink: d.sourceUrl,
    imageUrl: featured?.url ?? d.images?.[0]?.url,
    thumbnailUrl: featured?.thumbnailUrl ?? d.images?.[0]?.thumbnailUrl,
    images: d.images,
    videos: d.videos,
  });
}

export function transformOfficialRecord(raw, ctx = {}) {
  const t = ctx.terms ?? {};
  const d = ctx.detail ?? {};
  const featured = ctx.media?.get(raw.featured_media);
  return compactRecord({
    ...baseRecord(raw),
    officialType: first(t["officials-type"]),
    organisation: first(t.organisation_cat),
    organisationName: d.organisation,
    organisationUrl: d.organisationUrl,
    designation: d.designation ?? first(t.designation),
    designationTerms: t.designation,
    group: first(t["group-type"]),
    commission: first(t.commission),
    imageUrl: d.imageUrl ?? featured?.url,
    tenure: d.tenure,
    intercom: d.intercom,
    phoneOffice: d.phoneOffice,
    phoneResidence: d.phoneResidence,
    email: d.email,
    address: d.address,
    socialLinks: d.socialLinks,
    workAllocationHtml: d.workAllocationHtml,
    additionalInfoHtml: d.additionalInfoHtml,
    menuOrder: raw.menu_order || undefined,
  });
}

export function transformCpioRecord(raw, ctx = {}) {
  const t = ctx.terms ?? {};
  const d = ctx.detail ?? {};
  return compactRecord({
    ...baseRecord(raw),
    organisation: first(t.organisation_cat) ?? d.organisation,
    office: d.office,
    name: d.name,
    designation: d.designation,
    email: d.email,
  });
}

export function transformBookingRecord(raw, ctx = {}) {
  const t = ctx.terms ?? {};
  const d = ctx.detail ?? {};
  const acf = raw.acf && !Array.isArray(raw.acf) ? raw.acf : {};
  const featured = ctx.media?.get(raw.featured_media);
  const acfImages = (acf.item_images ?? []).map((id) => ctx.media?.get(id)?.url).filter(Boolean);
  const text = decodeEntities((raw.content?.rendered ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
  return compactRecord({
    ...baseRecord(raw),
    category: first(t["booking-category"]),
    description: text || undefined,
    rating: acf.rating || undefined,
    rates: (acf.categories_and_rates ?? [])
      .map((r) => compactRecord({ label: r.label ? decodeEntities(r.label) : undefined, rate: r.rates }))
      .filter((r) => r.label || r.rate),
    note: acf.note_text || undefined,
    contacts: (acf.contact_for_booking ?? [])
      .map((c) => compactRecord({ email: c.email, phone: c.phone }))
      .filter((c) => c.email || c.phone),
    imageUrl: featured?.url,
    images: acfImages.length ? acfImages : d.images,
    documents: d.documents,
  });
}

export function transformUpdateRecord(raw, ctx = {}) {
  const t = ctx.terms ?? {};
  const d = ctx.detail ?? {};
  return compactRecord({
    ...baseRecord(raw),
    status: first(t.component_status),
    organisation: first(t.organisation_cat),
    bodyHtml: d.bodyHtml,
    attachments: d.attachments,
    videos: d.videos,
  });
}

export function transformSewerCaseRecord(raw, ctx = {}) {
  const t = ctx.terms ?? {};
  const d = ctx.detail ?? {};
  return compactRecord({
    ...baseRecord(raw),
    name: d.name ?? decodeEntities(raw.title?.rendered ?? ""),
    state: first(t.sewer_state) ?? d.state,
    district: first(t.sewer_district) ?? d.district,
    dateOfDeath: d.dateOfDeath,
    paymentStatus: d.paymentStatus,
    amount: d.amount,
    amountInr: d.amountInr,
  });
}
