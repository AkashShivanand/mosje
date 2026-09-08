/**
 * Sample documents for the WEBSITE half of the prototype.
 *
 * WHY THESE EXIST. Every document link on the website pointed off this estate —
 * at `durwo6bhtjtqt.cloudfront.net` or at `dosje.gov.in` — so a reader pressing
 * "Download PDF" on the prototype left the prototype, and a reviewer walking the
 * build on a laptop with no network got nothing at all. The estate's images have
 * been mirrored locally for months; its documents never were, on the reasoning
 * that a mirrored PDF is a snapshot presented as the Department's current file.
 * That reasoning is right and this is the other answer to it: not a mirror of the
 * Department's document, but an OBVIOUS SAMPLE that is honest about being one.
 *
 * WHAT THEY ARE NOT. Every page carries a SAMPLE watermark, a banner, and a
 * footer saying it is prototype demonstration material. Every organisation,
 * person, figure and date inside them is invented. They are not copies of
 * departmental documents, they do not reproduce departmental content, and none
 * of them should ever be presented as a record of anything.
 *
 * ── EIGHT KINDS, NOT FIFTEEN HUNDRED ────────────────────────────────────────
 *
 * The ingest carries 1,962 documents. Generating 1,962 PDFs would put roughly a
 * gigabyte of invented paper in the repository to demonstrate a download button.
 * What a reader needs is that the file they open LOOKS LIKE the kind of thing
 * they asked for — a newsletter looks like a newsletter, a circular like a
 * circular — so there is one sample per kind and `sample-documents.ts` picks the
 * kind from the document's own category and title.
 *
 *   node tools/website-sample-documents/generate.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../apps/hub/public/website/sample-documents",
);

/*
 * ONE INVENTED BODY, USED THROUGHOUT, so the eight documents read as a set
 * rather than eight unrelated fictions. Nothing here resolves: the district,
 * the society and the file numbers are all made up, and the telephone numbers
 * are in the 99999 reserved block.
 */
const FICTION = {
  division: "Sample Division",
  body: "Sample State Welfare Society",
  district: "Sample District",
  fileNo: "S-00000/0/0000-SAMPLE",
  officer: "A. Sample",
  designation: "Under Secretary (Sample)",
  phone: "011-99999999",
  fy: "0000-00",
};

const css = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Noto Sans", system-ui, sans-serif; color: #1e2124; font-size: 10.5pt; line-height: 1.55; }
  .page { position: relative; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  .watermark { position: fixed; inset: 0; display: grid; place-items: center; pointer-events: none; z-index: 10; }
  .watermark span { font-size: 96pt; font-weight: 700; color: rgba(30,33,36,0.07); transform: rotate(-28deg); letter-spacing: .06em; }
  .banner { background: #fff2ed; border: 1px solid #f3c4ab; color: #8a3a12; font-size: 8pt; font-weight: 600;
            letter-spacing: .04em; text-transform: uppercase; padding: 6px 10px; margin-bottom: 16px; }
  .crest { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
  .crest .org { font-size: 9pt; color: #3a3d41; }
  .crest .no { font-size: 9pt; color: #3a3d41; font-variant-numeric: tabular-nums; }
  h1 { font-size: 17pt; line-height: 1.2; margin: 8px 0 2px; letter-spacing: -.01em; }
  .sub { color: #3a3d41; font-size: 10pt; margin: 0 0 14px; }
  .rule { height: 2px; background: #005eb9; margin: 0 0 18px; }
  h2 { font-size: 11.5pt; margin: 18px 0 6px; }
  p { margin: 0 0 9px; }
  ol, ul { margin: 0 0 9px; padding-left: 20px; }
  li { margin-bottom: 5px; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0 14px; font-size: 9.5pt; }
  th, td { border: 1px solid #dcdee1; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #eef0f3; font-weight: 600; }
  td.n, th.n { text-align: right; font-variant-numeric: tabular-nums; }
  .kv th { width: 34%; background: #f7f8fa; }
  .sig { display: flex; justify-content: space-between; margin-top: 34px; font-size: 9.5pt; }
  .sig div { text-align: center; }
  .sig div::before { content: ""; display: block; width: 150px; border-top: 1px solid #6b727d; margin-bottom: 4px; }
  .foot { margin-top: 26px; padding-top: 8px; border-top: 1px solid #dcdee1; color: #6b727d; font-size: 7.5pt; line-height: 1.5; }
  .lede { background: #f7f8fa; border-left: 3px solid #005eb9; padding: 10px 14px; margin: 0 0 14px; }
  .cols { column-count: 2; column-gap: 22px; }
`;

const kv = (rows) =>
  `<table class="kv">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;
const tbl = (head, rows, numeric = []) =>
  `<table><tr>${head.map((h, i) => `<th class="${numeric.includes(i) ? "n" : ""}">${h}</th>`).join("")}</tr>` +
  rows
    .map((r) => `<tr>${r.map((c, i) => `<td class="${numeric.includes(i) ? "n" : ""}">${c}</td>`).join("")}</tr>`)
    .join("") +
  `</table>`;
const sign = (l, r) => `<div class="sig"><div>${l}</div><div>${r}</div></div>`;

/* ── The eight kinds ────────────────────────────────────────────────────────
   `kind` is what `sample-documents.ts` resolves a real document to. Keep the
   ids stable: they are written into that module and into every rendered href. */
const DOCS = [
  {
    kind: "report",
    title: "Sample Annual Report",
    subtitle: `Illustrative annual report for the ${FICTION.division}, ${FICTION.fy}`,
    pages: [
      `<h2>1. About this document</h2>
       <p class="lede">This is a <strong>sample document</strong> generated for the SAMAVESH
       prototype. It exists so a reader pressing a download button on the prototype receives a
       document rather than a broken link. It is not a departmental record, it reports on
       nothing, and every figure below is invented.</p>
       <h2>2. Coverage</h2>
       ${tbl(["Activity", "Units", "Beneficiaries", "Expenditure (₹ lakh)"], [
         ["Awareness programmes", "000", "0,000", "0.00"],
         ["Training of field staff", "000", "0,000", "0.00"],
         ["Grants released to institutions", "000", "0,000", "0.00"],
         ["Monitoring and evaluation", "000", "0,000", "0.00"],
       ], [1, 2, 3])}
       <h2>3. Observations</h2>
       <ol>
         <li>Every number on this page is a placeholder and adds up to nothing.</li>
         <li>The layout follows the shape of a departmental annual report so the prototype's
             document viewer, print path and download behaviour can be exercised honestly.</li>
         <li>The real report is published by the Department on its own site.</li>
       </ol>`,
      `<h2>4. Statement of expenditure</h2>
       ${tbl(["Head", "Sanctioned", "Released", "Utilised"], [
         ["Establishment", "0,00,000", "0,00,000", "0,00,000"],
         ["Programme", "0,00,000", "0,00,000", "0,00,000"],
         ["Capital", "0,00,000", "0,00,000", "0,00,000"],
       ], [1, 2, 3])}
       <p>The figures above are zeros by design. A sample document that carried plausible
       numbers would eventually be quoted as though it were real, and that is a worse failure
       than a document that is obviously a sample.</p>
       ${sign(FICTION.officer, FICTION.designation)}`,
    ],
  },
  {
    kind: "circular",
    title: "Sample Circular",
    subtitle: "Illustrative office memorandum",
    pages: [
      `${kv([
        ["File No.", FICTION.fileNo],
        ["Issued by", `${FICTION.division}, Government of India`],
        ["Date", "00 Month 0000"],
      ])}
       <h2>Subject: Sample circular issued for prototype demonstration — regarding.</h2>
       <p>This memorandum is a <strong>sample</strong>. It communicates no decision, conveys no
       sanction and creates no obligation on any State Government, Union Territory
       Administration or implementing agency.</p>
       <ol>
         <li>The prototype's document shelves link to this file wherever the Department
             publishes a circular, so the shelf can be read, filtered and downloaded without
             leaving the prototype.</li>
         <li>The Department's own circulars are published on its website and remain the only
             authoritative source.</li>
         <li>This document may not be cited, forwarded or relied upon.</li>
       </ol>
       ${sign(FICTION.officer, FICTION.designation)}`,
    ],
  },
  {
    kind: "newsletter",
    title: "Sample Newsletter",
    subtitle: "Illustrative monthly newsletter · Issue 00",
    pages: [
      `<h2>In this issue</h2>
       <div class="cols">
         <p><strong>A sample lead article.</strong> This newsletter is generated for the
         SAMAVESH prototype so that a reader opening a newsletter card receives something
         newsletter-shaped. Nothing in it happened.</p>
         <p><strong>Field notes.</strong> Placeholder copy standing in for the district
         reports a real issue would carry. No district, officer or event named here exists.</p>
         <p><strong>Numbers.</strong> A real issue prints the month's figures. This one prints
         none, because an invented figure in a newsletter is the most quotable kind.</p>
         <p><strong>Coming up.</strong> Placeholder copy standing in for the calendar a real
         issue would carry.</p>
       </div>
       ${tbl(["Month", "Activities", "Participants"], [
         ["Month 0000", "000", "0,000"],
         ["Month 0000", "000", "0,000"],
       ], [1, 2])}`,
    ],
  },
  {
    kind: "guideline",
    title: "Sample Guidelines",
    subtitle: "Illustrative scheme guidelines",
    pages: [
      `<h2>1. Scope</h2>
       <p class="lede">A <strong>sample</strong> guidelines document, generated for the SAMAVESH
       prototype. It states no eligibility, no entitlement and no procedure that anyone should
       follow.</p>
       <h2>2. Clauses</h2>
       <ol>
         <li>This clause is a placeholder.</li>
         <li>So is this one. A real guideline carries the scheme's qualifying conditions,
             its funding pattern and its reporting requirements.</li>
         <li>The Department publishes the operative guidelines on its own site.</li>
       </ol>
       <h2>3. Funding pattern</h2>
       ${tbl(["Component", "Centre", "State", "Total"], [
         ["Component A", "00%", "00%", "100%"],
         ["Component B", "00%", "00%", "100%"],
       ], [1, 2, 3])}
       ${sign(FICTION.officer, FICTION.designation)}`,
    ],
  },
  {
    kind: "charter",
    title: "Sample Citizen Charter",
    subtitle: "Illustrative statement of service standards",
    pages: [
      `<p class="lede">A <strong>sample</strong> citizen charter, generated for the SAMAVESH
       prototype. The commitments below are placeholders and bind nobody.</p>
       <h2>Services and standards</h2>
       ${tbl(["Service", "Standard", "Responsible office"], [
         ["Sample service one", "00 working days", FICTION.division],
         ["Sample service two", "00 working days", FICTION.division],
         ["Sample service three", "00 working days", FICTION.division],
       ])}
       <h2>If a standard is not met</h2>
       <p>A real charter names the grievance route and the officer who owns it. This one names
       neither, because a grievance route that does not work is worse than none.</p>`,
    ],
  },
  {
    kind: "manual",
    title: "Sample User Manual",
    subtitle: "Illustrative manual for a departmental system",
    pages: [
      `<h2>1. Before you begin</h2>
       <p class="lede">A <strong>sample</strong> user manual, generated for the SAMAVESH
       prototype. It documents no system and its steps lead nowhere.</p>
       <h2>2. Steps</h2>
       <ol>
         <li>Placeholder step. A real manual would name the screen and the field.</li>
         <li>Placeholder step.</li>
         <li>Placeholder step.</li>
       </ol>
       <h2>3. If something goes wrong</h2>
       ${kv([
         ["Helpdesk", `${FICTION.phone} (not a working number)`],
         ["Hours", "Placeholder"],
       ])}`,
    ],
  },
  {
    kind: "form",
    title: "Sample Form",
    subtitle: "Illustrative application form",
    pages: [
      `<p class="lede">A <strong>sample</strong> form, generated for the SAMAVESH prototype.
       Completing it achieves nothing; it is not submitted anywhere and reaches no office.</p>
       ${kv([
         ["Name of applicant", "&nbsp;"],
         ["Address", "&nbsp;"],
         ["District / State", "&nbsp;"],
         ["Registration number", "&nbsp;"],
         ["Financial year", "&nbsp;"],
       ])}
       <h2>Declaration</h2>
       <p>Placeholder declaration text. A real form carries the undertaking the applicant signs
       and the penalty for a false one.</p>
       ${sign("Signature of applicant", "For office use")}`,
    ],
  },
  {
    kind: "publication",
    title: "Sample Publication",
    subtitle: "Illustrative study or compendium",
    pages: [
      `<h2>Abstract</h2>
       <p class="lede">A <strong>sample</strong> publication, generated for the SAMAVESH
       prototype. It reports no study, cites no source and reaches no finding.</p>
       <h2>Method</h2>
       <p>Placeholder copy standing in for the method a real study would describe.</p>
       <h2>Findings</h2>
       ${tbl(["Indicator", "Sample A", "Sample B"], [
         ["Placeholder indicator one", "0.0", "0.0"],
         ["Placeholder indicator two", "0.0", "0.0"],
       ], [1, 2])}
       <p>Zeros, deliberately. See the note in the sample annual report.</p>`,
    ],
  },
];

const render = (d) => `<style>${css}</style>
<div class="watermark"><span>SAMPLE</span></div>
${d.pages
  .map(
    (body, i) => `
  <div class="page">
    <div class="banner">Sample document · SAMAVESH prototype · not a departmental record</div>
    <div class="crest">
      <span class="org">Government of India · Ministry of Social Justice &amp; Empowerment</span>
      <span class="no">${FICTION.fileNo}</span>
    </div>
    ${
      i === 0
        ? `<h1>${d.title}</h1><p class="sub">${d.subtitle}</p><div class="rule"></div>`
        : `<h1 style="font-size:12pt">${d.title} <span style="font-weight:400;color:#6b727d">— continued</span></h1><div class="rule"></div>`
    }
    ${body}
    <div class="foot">
      Page ${i + 1} of ${d.pages.length} · Generated by <code>tools/website-sample-documents/generate.mjs</code>
      for the SAMAVESH prototype. Every organisation, person, figure and date in this document is
      invented. It is not a record of anything, it reproduces no departmental content, and it must
      not be cited or relied upon. The Department publishes its own documents at dosje.gov.in.
    </div>
  </div>`,
  )
  .join("")}`;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const pg = await browser.newPage();
const manifest = [];
for (const d of DOCS) {
  await pg.setContent(render(d), { waitUntil: "load" });
  const file = `${d.kind}.pdf`;
  await pg.pdf({ path: join(OUT, file), format: "A4", printBackground: true });
  manifest.push({ kind: d.kind, file, title: d.title, pages: d.pages.length });
  console.log(`  ${file.padEnd(20)} ${d.pages.length}pp`);
}
await browser.close();
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${DOCS.length} sample documents → apps/hub/public/website/sample-documents/`);
