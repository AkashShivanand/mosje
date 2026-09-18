import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseSiteDate, present, fileTypeOf, parseEventWhen,
  parseDocumentListing, parseDocumentPage, parseCpioPage, parseSewerCasePage,
  parseOfficialPage, parseEventPage, parseGalleryPage, parseBookingPage, parseUpdateContent,
} from "./detail-extract.mjs";

// Fixtures are trimmed copies of the live markup (2026-09-17), header/footer kept
// only as the markers mainRoot() slices between.
const page = (body) => `<html><body><header>nav <h1>not me</h1></header>${body}<footer>foot</footer></body></html>`;

const DOC_ROW = `<tr>
  <td><div class="heading-label title-label">Title</div><div class="text-truncate-3"><a href="https://www.dosje.gov.in/documents/annual-report-2024-25-4/">Annual Report 2024-25</a></div></td>
  <td><div class="heading-label">Organisation</div><a href="https://www.dosje.gov.in/organisation/nisd/">NISD</a></td>
  <td><div class="heading-label">Year</div> 2026 </td>
  <td><div class="heading-label">Size</div><span class="doc-lang-size" data-size-en="116.85 MB" data-size-hi="2.00 MB"> 116.85 MB </span></td>
  <td><div class="heading-label">Start Publish Date</div> 01/01/2026 </td>
  <td><div class="heading-label">End Publish Date</div> NA </td>
  <td><a href="https://cdn.example/uploads/ar.pdf" data-url-en="https://cdn.example/uploads/ar.pdf" data-url-hi="https://cdn.example/uploads/ar-hi.pdf">Download</a></td>
</tr>`;

test("parseSiteDate normalises the site's date shapes", () => {
  assert.equal(parseSiteDate("08/12/2011"), "2011-12-08");
  assert.equal(parseSiteDate("20260604"), "2026-06-04");
  assert.equal(parseSiteDate("Sep 1st, 2026 • 01:16 PM"), "2026-09-01");
  assert.equal(parseSiteDate("NA"), undefined);
  assert.equal(parseSiteDate("sometime"), undefined);
});

test("present treats NA / N/A / blanks as absent and decodes entities", () => {
  assert.equal(present(" N/A "), undefined);
  assert.equal(present(""), undefined);
  assert.equal(present("A &amp; B"), "A & B");
});

test("fileTypeOf reads the document extension", () => {
  assert.equal(fileTypeOf("https://x/a.PDF?v=1"), "PDF");
  assert.equal(fileTypeOf("https://x/page/"), undefined);
});

test("parseDocumentListing reads bare listing rows (no table wrapper)", () => {
  const rows = parseDocumentListing(DOC_ROW + `<nav><a class="page-link" data-page="602">602</a></nav>`);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0], {
    title: "Annual Report 2024-25",
    recordUrl: "https://www.dosje.gov.in/documents/annual-report-2024-25-4/",
    organisation: "NISD",
    organisationUrl: "https://www.dosje.gov.in/organisation/nisd/",
    year: "2026",
    fileUrl: "https://cdn.example/uploads/ar.pdf",
    fileType: "PDF",
    fileSize: "116.85 MB",
    fileUrlHi: "https://cdn.example/uploads/ar-hi.pdf",
    fileSizeHi: "2.00 MB",
    publishStart: "2026-01-01",
  });
});

test("parseDocumentPage reads a scheme document's row and scheme link, ignoring the header", () => {
  const html = page(`<h1 id="activeTitle">Dr. Ambedkar Medical Aid Scheme</h1>
    <p> Scheme: <a href="https://www.dosje.gov.in/schemes-and-services/damas/">Dr. Ambedkar Medical Aid Scheme (Revised in 2026)</a></p>
    <table><thead><tr><th>Title</th><th>Organisation</th><th>Size</th><th>Start Publish Date</th><th>Action</th></tr></thead>
    <tbody><tr><td><div class="heading-label">Title</div><div>Dr. Ambedkar Medical Aid Scheme</div></td>
    <td><div class="heading-label">Organisation</div> DAF </td>
    <td><div class="heading-label">Size</div><span data-size-en="N/A" data-size-hi="N/A"> N/A </span></td>
    <td><div class="heading-label">Start Publish Date</div> 20260604 </td>
    <td><a href="https://cdn.example/damas.pdf" data-url-en="https://cdn.example/damas.pdf" data-url-hi="" download>Download</a></td></tr></tbody></table>`);
  const d = parseDocumentPage(html);
  assert.equal(d.fileUrl, "https://cdn.example/damas.pdf");
  assert.equal(d.fileSize, undefined);
  assert.equal(d.fileUrlHi, undefined);
  assert.equal(d.publishStart, "2026-06-04");
  assert.equal(d.scheme, "Dr. Ambedkar Medical Aid Scheme (Revised in 2026)");
  assert.equal(d.schemeUrl, "https://www.dosje.gov.in/schemes-and-services/damas/");
});

test("parseDocumentPage falls back to a plain download link (suo-moto markup)", () => {
  const html = page(`<table><tbody><tr>
    <td><div class="heading-label">Title</div><div>MOA of NISD</div></td>
    <td><div class="heading-label">Size</div><div>16.97 MB</div></td>
    <td><a href="https://cdn.example/MoA_of_NISD.pdf" download>Download</a></td></tr></tbody></table>`);
  const d = parseDocumentPage(html);
  assert.equal(d.fileUrl, "https://cdn.example/MoA_of_NISD.pdf");
  assert.equal(d.fileSize, "16.97 MB");
});

test("parseCpioPage reads the officer row", () => {
  const html = page(`<table><tbody><tr>
    <td><div class="heading-label">Office/Division</div><div> NCBC, Trikoot-1, New Delhi</div></td>
    <td><div class="heading-label">Name</div><div>NODAL OFFICER &#038; FAA</div></td>
    <td><div class="heading-label">Organisation</div><div>NCBC</div></td>
    <td><div class="heading-label">Designation</div><div>Deputy Secretary</div></td>
    <td><div class="heading-label">Email</div><div> dysecy-1[at]ncbc[dot]nic[dot]in</div></td></tr></tbody></table>`);
  assert.deepEqual(parseCpioPage(html), {
    office: "NCBC, Trikoot-1, New Delhi", name: "NODAL OFFICER & FAA", organisation: "NCBC",
    designation: "Deputy Secretary", email: "dysecy-1[at]ncbc[dot]nic[dot]in",
  });
});

test("parseSewerCasePage reads the case row by column header", () => {
  const html = page(`<table><thead><tr><th>S.No.</th><th>State</th><th>District</th><th>Name of Deceased</th><th>Date of Death</th><th>Payment Status</th><th>Amount (₹)</th></tr></thead>
    <tbody><tr><td>1</td><td>Uttar Pradesh</td><td>Prayagraj</td><td>Sh Sohan Lal</td><td>01/01/2016</td><td>Paid</td><td>1,000,000</td></tr></tbody></table>`);
  assert.deepEqual(parseSewerCasePage(html), {
    state: "Uttar Pradesh", district: "Prayagraj", name: "Sh Sohan Lal", dateOfDeath: "2016-01-01",
    paymentStatus: "Paid", amount: "1,000,000", amountInr: 1000000,
  });
});

test("parseOfficialPage reads portrait (largest srcset), designation and contact card", () => {
  const html = page(`<img src="https://cdn.example/wp-content/uploads/v-223x300.jpeg" srcset="https://cdn.example/wp-content/uploads/v-223x300.jpeg 223w, https://cdn.example/wp-content/uploads/v.jpeg 402w">
    <h1>Shri V</h1><p><strong>Designation:</strong> Director , BJRNF </p>
    <p><strong>Organisation:</strong> <a href="https://www.dosje.gov.in/organisation/bjrnf/">Babu Jagjivan Ram National Foundation (BJRNF)</a></p>
    <p><strong>Tenure:</strong> NA </p>
    <div><h4>Contact Information</h4><p><strong>Intercom:</strong> NA</p><p><strong>Email:</strong> v@nic.in</p><p><strong>Address:</strong> 6, Krishna Menon Marg</p></div>
    <div><h4>Work Allocation</h4><ul><li>Scheme A</li></ul></div>`);
  const d = parseOfficialPage(html);
  assert.equal(d.imageUrl, "https://cdn.example/wp-content/uploads/v.jpeg");
  assert.equal(d.designation, "Director , BJRNF");
  assert.equal(d.organisation, "Babu Jagjivan Ram National Foundation (BJRNF)");
  assert.equal(d.organisationUrl, "https://www.dosje.gov.in/organisation/bjrnf/");
  assert.equal(d.tenure, undefined);
  assert.equal(d.email, "v@nic.in");
  assert.equal(d.address, "6, Krishna Menon Marg");
  assert.equal(d.workAllocationHtml, "<ul><li>Scheme A</li></ul>");
});

test("parseEventWhen splits a range into ISO start/end", () => {
  assert.deepEqual(parseEventWhen("Sep 1st, 2026 • 01:16 PM to Sep 3rd, 2026 • 02:22 PM"), { startDate: "2026-09-01", endDate: "2026-09-03" });
  assert.deepEqual(parseEventWhen("Jun 21st, 2026 • 10:00 AM - 02:00 PM"), { startDate: "2026-06-21" });
});

test("parseEventPage reads tags, description, organiser, venue, photos, videos and PDF", () => {
  const html = page(`<div class="scheme-tags-buttons"><span>Ministry</span><span>Central Events</span></div>
    <div class="col-md-8"><div class="event-description ck-content"><p>International Yoga Day</p></div>
      <div id="wpdfv-1" class="wpdfv-wrapper" data-pdf-en="https://cdn.example/e.pdf"><span class="badge">100%</span></div></div>
    <div class="col-md-4"><h5>Mode</h5><div> Offline</div>
      <div><div class="label-2 text-hint fw-medium">Organizer</div><div class="body-1">DoSJE</div></div>
      <div><div class="label-2 text-hint fw-medium">Mobile</div><div class="body-1">9971350240</div></div>
      <span class="badge text-bg-success">Declared</span>
      <div><div class="label-2 text-hint fw-medium">Date and Time</div><div class="body-1">Jun 21st, 2026 • 10:00 AM - 02:00 PM</div></div>
      <div><div class="label-2 text-hint fw-medium mt-2">Location</div><div class="body-1">Bharat Mandapam, New Delhi</div></div></div>
    <div class="card"><a data-fancybox="event-photos-scw-658" href="https://img.example/1.jpg" data-thumb="https://img.example/1t.jpg"><img src="https://img.example/1.jpg"></a>
      <div class="card-body"><div><span class="label-2">21/06/2026</span></div><div class="title-2">Yoga session</div></div></div>
    <div class="card"><video controls><source src="https://img.example/v.mp4" type="video/mp4"></video><div class="card-body"><span>15/06/2026</span></div></div>`);
  const d = parseEventPage(html);
  assert.deepEqual(d.tags, ["Ministry", "Central Events"]);
  assert.equal(d.descriptionHtml, "<p>International Yoga Day</p>");
  assert.equal(d.pdfUrl, "https://cdn.example/e.pdf");
  assert.equal(d.mode, "Offline");
  assert.equal(d.organizer, "DoSJE");
  assert.equal(d.mobile, "9971350240");
  assert.equal(d.status, "Declared");
  assert.equal(d.startDate, "2026-06-21");
  assert.equal(d.location, "Bharat Mandapam, New Delhi");
  assert.deepEqual(d.photos, [{ url: "https://img.example/1.jpg", thumbnailUrl: "https://img.example/1t.jpg", date: "2026-06-21", caption: "Yoga session" }]);
  assert.deepEqual(d.videos, [{ url: "https://img.example/v.mp4", date: "2026-06-15" }]);
});

test("parseGalleryPage reads category, description, source, full and thumbnail images", () => {
  const html = page(`<h3 id="activeTitle">Independence Day Celebration 2026</h3>
    <div>View other Photos in this category: <a href="https://www.dosje.gov.in/gallery/?category=central-events">Central Events</a></div>
    <div><p>Union Minister holds interaction with beneficiaries</p></div>
    <p> <span>Source: AIR News</span> <a href="https://newsonair.gov.in/x/" target="_blank"> Visit Link </a></p>
    <a data-fancybox="single-gallery" href="https://cdn.example/Pic1.jpeg"><img src="https://cdn.example/Pic1-1024x681.jpeg" alt="Celebration"></a>
    <iframe src="https://www.youtube.com/embed/abc"></iframe>`);
  const d = parseGalleryPage(html);
  assert.equal(d.category, "Central Events");
  assert.equal(d.description, "Union Minister holds interaction with beneficiaries");
  assert.equal(d.source, "AIR News");
  assert.equal(d.sourceUrl, "https://newsonair.gov.in/x/");
  assert.deepEqual(d.images, [{ url: "https://cdn.example/Pic1.jpeg", thumbnailUrl: "https://cdn.example/Pic1-1024x681.jpeg", alt: "Celebration" }]);
  assert.deepEqual(d.videos, [{ url: "https://www.youtube.com/embed/abc", kind: "youtube" }]);
});

test("parseBookingPage reads venue images and labelled documents", () => {
  const html = page(`<div><img src="https://cdn.example/wp-content/uploads/conf1.jpg" alt=""></div>
    <ul><li><strong>Booking Form &amp; SOP:</strong> <a href="https://cdn.example/sop.pdf" download>Download File</a></li></ul>`);
  assert.deepEqual(parseBookingPage(html), {
    images: ["https://cdn.example/wp-content/uploads/conf1.jpg"],
    documents: [{ label: "Booking Form & SOP", url: "https://cdn.example/sop.pdf", fileType: "PDF" }],
  });
});

test("parseUpdateContent reads attachments (deduped), videos and body", () => {
  const d = parseUpdateContent(`<div><a href="https://cdn.example/NALSA.pdf" aria-label="NALSA Annexure"><i></i></a>
    <h5><a href="https://cdn.example/NALSA.pdf">NALSA Annexure</a></h5>
    <video src="https://cdn.example/jingle.mp4" poster="https://cdn.example/poster.png"></video></div>`);
  assert.deepEqual(d.attachments, [{ label: "NALSA Annexure", url: "https://cdn.example/NALSA.pdf", fileType: "PDF" }]);
  assert.deepEqual(d.videos, [{ url: "https://cdn.example/jingle.mp4", poster: "https://cdn.example/poster.png" }]);
  assert.match(d.bodyHtml, /NALSA Annexure/);
  assert.equal(parseUpdateContent("").bodyHtml, undefined);
});

test("documentRowFields falls back to the external \"View\" link when nothing is uploaded", () => {
  const rows = parseDocumentListing(`<tr>
    <td><div class="heading-label title-label">Title</div><div><a href="https://www.dosje.gov.in/documents/ar-2021-2022/">Annual Report 2021-2022</a></div></td>
    <td><div class="heading-label">Size</div><span data-size-en="N/A" data-size-hi="N/A"> N/A </span></td>
    <td><a href="https://drive.usercontent.google.com/download?id=1W7" target="_blank">View</a></td></tr>`);
  assert.equal(rows[0].fileUrl, undefined);
  assert.equal(rows[0].externalUrl, "https://drive.usercontent.google.com/download?id=1W7");
});
