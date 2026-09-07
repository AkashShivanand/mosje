/**
 * Sample supporting documents for the e-Anudaan prototype.
 *
 * WHAT THESE ARE FOR. The prototype's upload step runs a document check with five outcomes
 * (verified / review / invalid / pending / unavailable). Demonstrating that check needs a
 * file for each outcome, so a reviewer can watch the flow behave rather than be told about
 * it. These are those files.
 *
 * WHAT THEY ARE NOT FOR. Every page carries a SAMPLE banner and says it is prototype demo
 * data. That is deliberate and must stay: the live e-Anudaan UAT portal rejects placeholder
 * documents by reading their content, and it is right to. These files are for OUR prototype,
 * whose verdicts we author; they are not a way past a real verification control, and a
 * document engineered to read as genuine grant evidence is not something this repo produces.
 * The live portal still needs a sanctioned test set from the department.
 *
 *   node --experimental-strip-types tools/sample-documents/generate.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../../apps/hub/public/e-anudaan/sample-documents");

/** Each entry: the verdict it is written to produce, and the body a reader will see. */
const DOCS = [
  {
    slug: "annual-report-valid",
    verdict: "verified",
    title: "Annual Report 2025-26",
    subtitle: "Sankalp Seva Sansthan (illustrative organisation)",
    rows: [["Financial Year", "2025-26"], ["Organisation", "Sankalp Seva Sansthan"],
           ["Registration", "Societies Registration Act, 1860"], ["Pages", "1 of 1"]],
    body: [
      "This sample stands in for an organisation's annual report. In the prototype it is written to produce a VERIFIED verdict: the checker finds the financial year, the organisation name and the required particulars, and returns full confidence.",
      "Every figure and name on this page is illustrative. No real organisation, project, sanction or beneficiary is described.",
    ],
  },
  {
    slug: "committee-list-needs-review",
    verdict: "review",
    title: "List of Managing Committee Members",
    subtitle: "Sankalp Seva Sansthan (illustrative organisation)",
    rows: [["Members listed", "5"], ["Financial Year", "2025-26"], ["Designations stated", "No"]],
    body: [
      "This sample produces a NEEDS REVIEW verdict. The members are listed with occupations and contact details, but no formal designations — President, Secretary, Treasurer — are stated, so automatic confidence falls short of the threshold and an officer confirms it by hand.",
      "Needs review is not a rejection. The applicant is not asked to do anything; the document proceeds to a human.",
    ],
  },
  {
    slug: "wrong-document-financial-statement",
    verdict: "invalid",
    title: "Statement of Income and Expenditure (Form VII)",
    subtitle: "Sankalp Seva Sansthan (illustrative organisation)",
    rows: [["Statement type", "Income & Expenditure"], ["Financial Year", "2025-26"], ["Registration number", "Not present"]],
    body: [
      "This sample produces a NOT VALID verdict when it is uploaded into a slot that asks for something else — a Registration Certificate, say. It is a well-formed, legible document; it is simply the wrong one.",
      "This is the case worth demonstrating, because it is the one a real applicant hits most: the file is fine, the slot is wrong, and the message has to say which document to fetch instead.",
    ],
  },
  {
    slug: "illegible-scan",
    verdict: "invalid",
    title: "Scanned Certificate — poor capture",
    subtitle: "Illustrative, deliberately degraded",
    rows: [["Legible fields", "0"], ["Capture quality", "Poor"]],
    body: [
      "This sample produces a NOT VALID verdict for the other common reason: the page is a photograph of a document taken badly, and nothing on it can be read with confidence.",
      "The remedy differs from the wrong-document case, and the prototype's message should differ too: rescan, rather than fetch a different paper.",
    ],
    degraded: true,
  },
  {
    slug: "bank-authorisation-valid",
    verdict: "verified",
    title: "Bank Authorisation Letter",
    subtitle: "Illustrative account particulars",
    rows: [["Account name", "Sankalp Seva Sansthan"], ["Account number", "0000 0000 0000 (illustrative)"],
           ["IFSC", "XXXX0000000 (illustrative)"], ["Branch", "Illustrative Branch"]],
    body: [
      "A second VERIFIED sample, so a demonstration can fill more than one slot with a passing document and show the checklist counter advance.",
      "The account particulars are deliberately non-resolving placeholders. They are shaped like the real thing so the layout is honest, and they identify no account.",
    ],
  },
];

const css = `
@page { size: A4; margin: 18mm; }
body { font: 10.5pt/1.6 Helvetica, Arial, sans-serif; color: #111; }
.banner { background: #FFD323; border: 2px solid #8a6d00; color: #4a3b00;
  padding: 4mm 5mm; border-radius: 2mm; font-weight: 700; font-size: 10pt;
  letter-spacing: .04em; text-transform: uppercase; margin-bottom: 7mm; }
h1 { font-size: 17pt; margin: 0 0 1mm; }
.sub { color: #555; margin: 0 0 4mm; font-size: 10pt; }
.rule { height: 3px; background: #0373DF; margin: 0 0 6mm; }
p { margin: 0 0 4mm; text-align: justify; }
table { border-collapse: collapse; width: 100%; margin: 5mm 0; font-size: 9.5pt; }
td, th { border: 1px solid #bbb; padding: 2.5mm; text-align: left; }
th { background: #eef4fb; width: 42%; }
.foot { margin-top: 8mm; border-top: 1px solid #ddd; padding-top: 3mm;
  font-size: 8.5pt; color: #666; }
.degraded { filter: blur(1.1px) contrast(0.62); opacity: .78; }
.watermark { position: fixed; top: 44%; left: 50%; transform: translate(-50%,-50%) rotate(-28deg);
  font-size: 62pt; font-weight: 800; color: rgba(3,115,223,.10); letter-spacing: .06em; }
`;

const page = (d) => `<style>${css}</style>
<div class="watermark">SAMPLE</div>
<div class="banner">Sample document · SAMAVESH prototype demo data · not a departmental record</div>
<div class="${d.degraded ? "degraded" : ""}">
  <h1>${d.title}</h1>
  <p class="sub">${d.subtitle}</p>
  <div class="rule"></div>
  ${d.body.map((b) => `<p>${b}</p>`).join("")}
  <table>${d.rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>
</div>
<div class="foot">
  Generated by <code>tools/sample-documents/generate.mjs</code> for the SAMAVESH e-Anudaan
  prototype. Intended verdict in the prototype: <strong>${d.verdict}</strong>.
  This file describes no real organisation, project, sanction or beneficiary, and is not
  evidence for any application.
</div>`;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const pg = await browser.newPage();
const manifest = [];
for (const d of DOCS) {
  await pg.setContent(page(d), { waitUntil: "load" });
  const file = `${d.slug}.pdf`;
  await pg.pdf({ path: join(OUT, file), format: "A4", printBackground: true });
  manifest.push({ slug: d.slug, file, verdict: d.verdict, title: d.title });
  console.log(`  ${file}  → ${d.verdict}`);
}
await browser.close();
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${DOCS.length} sample documents → apps/hub/public/e-anudaan/sample-documents/`);
