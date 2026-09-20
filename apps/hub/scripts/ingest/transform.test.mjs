import { test } from "node:test";
import assert from "node:assert/strict";
import {
  transformRecord, transformFileRecord, transformDocumentRecord, transformEventRecord, transformGalleryRecord,
  transformOfficialRecord, transformCpioRecord, transformBookingRecord, transformUpdateRecord, transformSewerCaseRecord,
} from "./transform.mjs";

const RAW = {
  id: 5, slug: "ncsk", link: "https://www.dosje.gov.in/organisation/ncsk/",
  title: { rendered: "National Commission for Safai Karamcharis" },
  content: { rendered: `<h2>About</h2><div class="elementor-widget-text-editor"><p>Body <a href="https://ncsk.nic.in">site</a>.</p></div>` },
};

test("transformRecord produces slug,title,sourceUrl,sections,website", () => {
  const rec = transformRecord(RAW, { taxonomyNames: {} });
  assert.equal(rec.slug, "ncsk");
  assert.equal(rec.title, "National Commission for Safai Karamcharis");
  assert.equal(rec.sourceUrl, "https://www.dosje.gov.in/organisation/ncsk/");
  assert.equal(rec.sections[0].heading, "About");
  assert.match(rec.sections[0].html, /Body <a href="https:\/\/ncsk\.nic\.in"/);
  assert.equal(rec.website, "https://ncsk.nic.in");
});

test("decodes HTML entities in title", () => {
  const rec = transformRecord({ ...RAW, title: { rendered: "A &amp; B" } }, { taxonomyNames: {} });
  assert.equal(rec.title, "A & B");
});

const RAWFILE = {
  id: 9, slug: "security-guards-tender", link: "https://www.dosje.gov.in/tender/security-guards-tender/",
  date: "2026-05-06T10:00:00", title: { rendered: "Tender for Security &amp; Guards" },
  content: { rendered: `<p>See <a href="https://cdn.example/uploads/tender-47.pdf">notice</a> and <a href="https://x/page">more</a>.</p>` },
};

test("transformFileRecord extracts title,sourceUrl,date,fileUrl + category", () => {
  const rec = transformFileRecord(RAWFILE, { taxonomyNames: { category: ["Procurement"] } });
  assert.equal(rec.slug, "security-guards-tender");
  assert.equal(rec.title, "Tender for Security & Guards");
  assert.equal(rec.sourceUrl, "https://www.dosje.gov.in/tender/security-guards-tender/");
  assert.equal(rec.date, "2026-05-06");
  assert.equal(rec.fileUrl, "https://cdn.example/uploads/tender-47.pdf");
  assert.equal(rec.category, "Procurement");
});

test("transformFileRecord omits fileUrl when no document link present", () => {
  const rec = transformFileRecord({ ...RAWFILE, content: { rendered: `<p><a href="https://x/page">page</a></p>` } }, {});
  assert.equal(rec.fileUrl, undefined);
  assert.equal(rec.category, undefined);
});

test("transformFileRecord prefers a wanted category over an unwanted first term", () => {
  const raw = { slug: "d", link: "https://x/d", date: "2026-01-01", title: { rendered: "Doc" }, content: { rendered: "" } };
  const rec = transformFileRecord(raw, { taxonomyNames: { category: ["Central List of OBCs", "Annual Reports"] }, preferCategories: ["Annual Reports", "Notice"] });
  assert.equal(rec.category, "Annual Reports");
});
test("transformFileRecord falls back to first category when none preferred match", () => {
  const raw = { slug: "d", link: "https://x/d", date: "2026-01-01", title: { rendered: "Doc" }, content: { rendered: "" } };
  const rec = transformFileRecord(raw, { taxonomyNames: { category: ["Tour Reports"] }, preferCategories: ["Annual Reports"] });
  assert.equal(rec.category, "Tour Reports");
});

// ── Rich collections ─────────────────────────────────────────────────────────
const rest = (extra = {}) => ({
  id: 1, slug: "rec", link: "https://www.dosje.gov.in/x/rec/", date: "2026-09-14T08:44:05",
  modified_gmt: "2026-09-14T03:14:05", title: { rendered: "A &amp; B" }, featured_media: 0, ...extra,
});

test("transformDocumentRecord keeps every type, prefers a listing type as category, merges page fields", () => {
  const rec = transformDocumentRecord(rest(), {
    terms: { "documents-type": ["Central List of OBC's", "Annual Reports"], organisation_cat: ["NCBC"], component_status: [], states: [] },
    detail: { year: "2011", fileUrl: "https://cdn/x.pdf", fileType: "PDF", fileSize: "2.96 MB", publishStart: "2011-12-08", organisation: "IGNORED" },
    preferCategories: ["Annual Reports"],
  });
  assert.deepEqual(rec, {
    slug: "rec", title: "A & B", sourceUrl: "https://www.dosje.gov.in/x/rec/", date: "2026-09-14",
    category: "Annual Reports", types: ["Central List of OBC's", "Annual Reports"], organisation: "NCBC",
    year: "2011", fileUrl: "https://cdn/x.pdf", fileType: "PDF", fileSize: "2.96 MB", publishStart: "2011-12-08",
  });
});

test("transformDocumentRecord: no preferred type → first term; no terms → page organisation", () => {
  const a = transformDocumentRecord(rest(), { terms: { "documents-type": ["Tour Reports", "RTI"] }, preferCategories: ["Annual Reports"] });
  assert.equal(a.category, "Tour Reports");
  const b = transformDocumentRecord(rest(), { terms: {}, detail: { organisation: "DAF", scheme: "S", schemeUrl: "https://s/" } });
  assert.equal(b.category, undefined);
  assert.equal(b.organisation, "DAF");
  assert.equal(b.scheme, "S");
});

test("transformDocumentRecord keeps an external link where the record has no upload", () => {
  const rec = transformDocumentRecord(rest(), { terms: {}, detail: { externalUrl: "https://drive.usercontent.google.com/download?id=1W7" } });
  assert.equal(rec.externalUrl, "https://drive.usercontent.google.com/download?id=1W7");
  assert.equal(rec.fileUrl, undefined);
});

test("transformEventRecord combines terms, page fields and featured image fallback", () => {
  const rec = transformEventRecord(rest(), {
    terms: { "event-category": ["State Officer"], "gallery-category": ["State Events"], organisation_cat: ["SCW"] },
    detail: { startDate: "2026-09-01", endDate: "2026-09-03", location: "Jaisalmer", photos: [{ url: "https://img/1.jpg" }] },
    media: new Map(),
  });
  assert.equal(rec.organisation, "SCW");
  assert.deepEqual(rec.categories, ["State Officer"]);
  assert.equal(rec.startDate, "2026-09-01");
  assert.equal(rec.imageUrl, "https://img/1.jpg");
  assert.equal("modified_gmt" in rec, false);
});

test("transformGalleryRecord takes type and thumbnail from the featured image", () => {
  const rec = transformGalleryRecord(rest({ featured_media: 9 }), {
    terms: { "gallery-type": ["Videos"], "gallery-category": [], organisation_cat: ["NMBA"] },
    detail: { videos: [{ url: "https://v/1.mp4", kind: "file" }] },
    media: new Map([[9, { url: "https://img/full.png", thumbnailUrl: "https://img/t.png" }]]),
  });
  assert.equal(rec.type, "Videos");
  assert.equal(rec.imageUrl, "https://img/full.png");
  assert.equal(rec.thumbnailUrl, "https://img/t.png");
  assert.equal(rec.categories, undefined);
});

test("transformOfficialRecord prefers the page's designation over the taxonomy term", () => {
  const rec = transformOfficialRecord(rest(), {
    terms: { "officials-type": ["Member"], organisation_cat: ["NCSK"], designation: ["Member"], commission: ["Current Commission"] },
    detail: { designation: "PA to Member", email: "a@nic.in" },
  });
  assert.equal(rec.designation, "PA to Member");
  assert.equal(rec.officialType, "Member");
  assert.equal(rec.commission, "Current Commission");
  assert.equal(rec.email, "a@nic.in");
});

test("transformCpioRecord maps the officer row", () => {
  const rec = transformCpioRecord(rest(), { terms: { organisation_cat: ["NCBC"] }, detail: { name: "FAA", email: "x[at]y" } });
  assert.equal(rec.organisation, "NCBC");
  assert.equal(rec.name, "FAA");
});

test("transformBookingRecord reads rates and contacts from ACF, images via media ids", () => {
  const raw = rest({
    featured_media: 2911,
    content: { rendered: "<p>Conference Room No. 1 &amp; lounge</p><p></p>" },
    acf: { item_images: [6754], rating: "5", categories_and_rates: [{ label: "Government", rates: "9,440/-" }], note_text: "", contact_for_booking: [{ email: "b[at]gmail[dot]com", phone: "011-2347" }] },
  });
  const rec = transformBookingRecord(raw, {
    terms: { "booking-category": ["Conference Hall"] },
    detail: { documents: [{ label: "Rate List", url: "https://cdn/r.pdf", fileType: "PDF" }], images: ["https://cdn/html.jpg"] },
    media: new Map([[2911, { url: "https://cdn/cover.jpg" }], [6754, { url: "https://cdn/in1.jpg" }]]),
  });
  assert.equal(rec.category, "Conference Hall");
  assert.equal(rec.description, "Conference Room No. 1 & lounge");
  assert.deepEqual(rec.rates, [{ label: "Government", rate: "9,440/-" }]);
  assert.deepEqual(rec.contacts, [{ email: "b[at]gmail[dot]com", phone: "011-2347" }]);
  assert.equal(rec.imageUrl, "https://cdn/cover.jpg");
  assert.deepEqual(rec.images, ["https://cdn/in1.jpg"]);
  assert.equal(rec.note, undefined);
});

test("transformUpdateRecord carries status and parsed attachments", () => {
  const rec = transformUpdateRecord(rest(), { terms: { component_status: ["Active"], organisation_cat: [] }, detail: { attachments: [{ url: "https://cdn/a.pdf" }] } });
  assert.equal(rec.status, "Active");
  assert.equal(rec.organisation, undefined);
  assert.deepEqual(rec.attachments, [{ url: "https://cdn/a.pdf" }]);
});

test("transformSewerCaseRecord prefers taxonomy state/district and falls back to title for name", () => {
  const rec = transformSewerCaseRecord(rest({ title: { rendered: "Sh Sohan Lal" } }), {
    terms: { sewer_state: ["Uttar Pradesh"], sewer_district: ["Prayagraj"] },
    detail: { dateOfDeath: "2016-01-01", paymentStatus: "Paid", amount: "1,000,000", amountInr: 1000000 },
  });
  assert.deepEqual(rec, {
    slug: "rec", title: "Sh Sohan Lal", sourceUrl: "https://www.dosje.gov.in/x/rec/", date: "2026-09-14",
    name: "Sh Sohan Lal", state: "Uttar Pradesh", district: "Prayagraj", dateOfDeath: "2016-01-01",
    paymentStatus: "Paid", amount: "1,000,000", amountInr: 1000000,
  });
});
