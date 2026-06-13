import { test } from "node:test";
import assert from "node:assert/strict";
import { transformRecord, transformFileRecord } from "./transform.mjs";

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
