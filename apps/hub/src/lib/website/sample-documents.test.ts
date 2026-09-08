// Every document link on the website resolves to a local sample, and the sample
// has to be the RIGHT KIND — a newsletter card must not open a memorandum.
//
// The rows below are REAL titles from the estate's own content: the NMBA
// record's six document shelves and the categories `documents.json` carries. A
// kind resolver tested against invented titles proves nothing, because the
// defect it exists to prevent is a real departmental title matching the wrong
// rule — which is exactly what "Committee formation" did on the first run,
// resolving to a FORM because `format` is a substring of `formation`.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  isDocumentUrl,
  localiseDocumentLinks,
  localiseDocumentUrl,
  sampleDocumentKind,
} from "./sample-documents.ts";

test("a real departmental title resolves to the right kind of sample", () => {
  const cases: [string, string, string][] = [
    // The one that caught the bug.
    ["Circulars", "Committee formation — letter to all States, with enclosure", "circular"],
    ["Citizen Corner", "Citizen Charter", "charter"],
    ["Newsletter", "Nasha Mukt Bharat Abhiyaan Newsletter, August 2025", "newsletter"],
    ["IEC Materials", "User Manual for Patient Monitoring System", "manual"],
    ["Publications", "Magnitude of Substance Use in India", "publication"],
    ["IEC Materials", "Compendium (English)", "publication"],
    ["IEC Materials", "NMBA Impact Assessment Report 2021 by UNDP", "report"],
    ["Annual Reports", "Annual Report 2025-26 (English)", "report"],
    ["Resources", "NAPPDR (National Action Plan for Drug Demand Reduction) Revised Guidelines", "guideline"],
    ["Resources", "Norms for Drugs De-Addiction Centre (DDAC)", "guideline"],
    ["Forms & Templates", "Utilization certificate format (GFR 12-C)", "form"],
    ["Notice", "Applications are invited for online submission of 1st installment", "circular"],
  ];
  for (const [category, title, kind] of cases) {
    assert.equal(sampleDocumentKind(category, title), kind, `${title} → ${kind}`);
  }
});

test("an unrecognised title falls back to a report rather than throwing", () => {
  assert.equal(sampleDocumentKind("Best Practices"), "report");
  assert.equal(sampleDocumentKind(), "report");
});

test("a FILE is replaced", () => {
  for (const href of [
    "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/0006_August_2025-1.pdf",
    "https://example.gov.in/files/report.PDF",
    "https://example.gov.in/files/format.docx?v=2",
    // No extension, but it is the Department's document CDN.
    "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/06/47211779688755",
  ]) {
    assert.equal(isDocumentUrl(href), true, href);
  }
});

test("a PLACE is not — sending a reader to a sample PDF instead would be the worse lie", () => {
  for (const href of [
    "https://www.dosje.gov.in/tag/addiction/",
    "https://nashamukt.dosje.gov.in/epledge",
    "https://www.instagram.com/msjegoi",
    "https://www.dosje.gov.in/publications/?org=nmba",
    // Already ours: the campaign mark, the mascot, the two QR codes.
    "/website/content/organisation/nmba-logo-large.png",
    "/website/sample-documents/report.pdf",
    "",
  ]) {
    assert.equal(isDocumentUrl(href), false, href);
  }
});

test("localiseDocumentUrl swaps a document and leaves a page alone", () => {
  assert.equal(
    localiseDocumentUrl(
      "https://durwo6bhtjtqt.cloudfront.net/x/0006_August_2025-1.pdf",
      "Nasha Mukt Bharat Abhiyaan Newsletter, August 2025",
      "Newsletter",
    ),
    "/website/sample-documents/newsletter.pdf",
  );
  const page = "https://nashamukt.dosje.gov.in/nasha-mukti-mitr";
  assert.equal(localiseDocumentUrl(page, "Register Now"), page);
});

test("ingested prose: the link TEXT is the hint, and a page survives untouched", () => {
  assert.ok(
    localiseDocumentLinks(
      `<p>See the <a href="https://durwo6bhtjtqt.cloudfront.net/a/b.pdf">Citizen Charter</a>.</p>`,
    ).includes('href="/website/sample-documents/charter.pdf"'),
  );

  const untouched =
    `<a href="https://www.dosje.gov.in/tag/addiction/">Addiction</a>` +
    `<img src="/content/x.jpg" alt="">` +
    `<a href="mailto:usdp1-dosje@gov.in">Write</a>`;
  assert.equal(localiseDocumentLinks(untouched), untouched);
});

test("several links in one run each get their own kind", () => {
  const out = localiseDocumentLinks(
    `<a href="https://x.gov.in/a.pdf">Annual Report</a><a href="https://x.gov.in/b.pdf">Newsletter</a>`,
  );
  assert.ok(out.includes("/website/sample-documents/report.pdf"));
  assert.ok(out.includes("/website/sample-documents/newsletter.pdf"));
});
