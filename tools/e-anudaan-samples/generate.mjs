/**
 * Sample documents for the e-Anudaan prototype: one that PASSES for every document type, and one
 * that FAILS for every document check that type can fail (apps/hub/src/lib/e-anudaan/doc-checks.ts).
 *
 *   node tools/e-anudaan-samples/generate.mjs
 *
 * Writes apps/hub/public/e-anudaan/sample-documents/ and the manifest the demo dock reads,
 * apps/hub/src/lib/e-anudaan/sample-files.generated.ts. Regenerate; never hand-edit either.
 *
 * WHAT THESE ARE FOR. The prototype's checker reads a check id from a file's name —
 * `rent-agreement--validity-lapsed.pdf` — and answers with that check's verdict, so every
 * validation can be rehearsed with a real file, through the real upload path. Each file also LOOKS
 * like its defect when opened: the lapsed rent agreement carries a 2025 expiry, the unsigned one
 * has empty signature lines, the illegible one is a blurred low-resolution scan.
 *
 * WHAT THEY ARE NOT FOR. Every page carries a SAMPLE banner, a watermark and a footer saying it is
 * prototype demo data, and every organisation, person, account and figure is invented. That
 * marking is deliberate and must stay. These files exercise OUR checker, whose verdicts we author;
 * they are not a route past a real verification control, and a document engineered to read as
 * authentic grant evidence is not something this repo produces.
 *
 * PDFs are drawn with pdf-lib's standard fonts (pdf.mjs); the illegible scans and the two JPEG scans
 * are photographs of the same page rendered as HTML in a browser, blurred where they should be.
 *
 * Only files whose CONTENT differs are generated. Where a check is decided by the name or the
 * bytes alone — the outage, the dropped connection, an empty or oversized file, a password-
 * protected or mislabelled one — the dock builds the file in the browser from one of these
 * (`lib/e-anudaan/sample-files.ts`), so the repository does not carry forty copies of one page.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { renderPdf } from "./pdf.mjs";
import { ADDRESS, FY_CURRENT, FY_PREV, FY_TWO_BACK, ORG, OTHER_ADDRESS, OTHER_ORG, SUBJECTS, renderable } from "./subjects.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const OUT = join(ROOT, "apps/hub/public/e-anudaan/sample-documents");
const MANIFEST = join(ROOT, "apps/hub/src/lib/e-anudaan/sample-files.generated.ts");

/** Checks whose failing file differs in CONTENT from the passing one, in catalogue order. */
const CONTENT_CHECKS = [
  "wrong-year", "wrong-variant", "missing-particulars", "missing-parts", "other-organisation", "account-name",
  "blank-template", "validity-lapsed", "not-notarised", "unsigned", "incomplete-table", "address-mismatch",
  "bank-mismatch", "illegible",
];

/* ── Page furniture ─────────────────────────────────────────────────────────────────── */

const css = `
@page { size: A4; margin: 15mm 16mm 14mm; }
body { font: 10pt/1.5 Helvetica, Arial, sans-serif; color: #1b1b1b; margin: 0; }
.banner { background: #FFD323; border: 1.5px solid #8a6d00; color: #4a3b00; padding: 2.5mm 4mm;
  border-radius: 1.5mm; font-weight: 700; font-size: 8pt; letter-spacing: .05em; text-transform: uppercase; margin-bottom: 5mm; }
.issuer { font-size: 9pt; color: #444; text-transform: uppercase; letter-spacing: .06em; margin: 0 0 1mm; }
h1 { font-size: 15pt; margin: 0 0 1mm; }
.rule { height: 2px; background: #1b1b1b; margin: 2mm 0 5mm; }
h2 { font-size: 10.5pt; margin: 5mm 0 1.5mm; }
p { margin: 0 0 3mm; }
table { border-collapse: collapse; width: 100%; margin: 2mm 0 4mm; font-size: 9pt; }
td, th { border: 1px solid #b9b9b9; padding: 1.8mm 2.2mm; text-align: left; vertical-align: top; }
th { background: #f1f1f1; font-weight: 700; }
.kv th { width: 36%; }
.blank { color: transparent; border-bottom: 1px dotted #999; }
.sigs { margin-top: 12mm; display: flex; justify-content: space-between; gap: 10mm; font-size: 9pt; }
.sig { flex: 1; }
.sig .hand { font: italic 13pt Helvetica, Arial, sans-serif; color: #20306e; height: 8mm; }
.sig .line { border-top: 1px solid #555; padding-top: 1.2mm; }
.seal { width: 30mm; height: 30mm; border: 2px solid #6b2a86; border-radius: 50%; color: #6b2a86; display: flex;
  align-items: center; justify-content: center; text-align: center; font-size: 6.5pt; font-weight: 700; padding: 3mm;
  box-sizing: border-box; transform: rotate(-12deg); }
.stamp { border: 2px solid #9a1c1c; color: #9a1c1c; padding: 2mm 3mm; font-size: 7.5pt; font-weight: 700;
  display: inline-block; transform: rotate(-4deg); margin-top: 4mm; }
.watermark { position: fixed; top: 44%; left: 50%; transform: translate(-50%,-50%) rotate(-28deg);
  font-size: 64pt; font-weight: 800; color: rgba(0,0,0,.06); letter-spacing: .08em; z-index: 0; white-space: nowrap; }
.body { position: relative; z-index: 1; }
.foot { margin-top: 8mm; border-top: 1px solid #ddd; padding-top: 2mm; font-size: 7.5pt; color: #666; }
`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* ── One document, as the check would find it ──────────────────────────────────────── */

/** Replace every mention of a year, an organisation or an address throughout a subject. */
function mapStrings(subject, fn) {
  const walk = (v) => (typeof v === "string" ? fn(v) : Array.isArray(v) ? v.map(walk) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v);
  return walk(subject);
}

function shaped(subject, check) {
  let s = structuredClone(subject);
  const setField = (label, value) => { s.fields = (s.fields ?? []).map(([k, v]) => [k, k === label ? value : v]); };
  switch (check) {
    case "wrong-year": {
      const prior = (v) => v.replaceAll(FY_PREV, "§PREV§").replaceAll(FY_CURRENT, FY_PREV).replaceAll("§PREV§", FY_TWO_BACK)
        .replace(/31 March (\d{4})/g, (_m, y) => `31 March ${Number(y) - 1}`);
      s = mapStrings(s, prior);
      break;
    }
    case "wrong-variant":
      // The format's name leaves the document with the format; the variant's own title goes on after.
      s = mapStrings(s, (v) => v.replace(/\s*\(GFR 12-A\)/g, "").replace(/GFR 12-A( \(Provisional\))?/g, "Statement of Expenditure"));
      s.title = subject.variant;
      break;
    case "missing-particulars":
      for (const label of s.particulars ?? []) setField(label, null);
      break;
    case "missing-parts":
      s.parts = s.parts.slice(0, 1);
      break;
    case "other-organisation":
      s = mapStrings(s, (v) => v.replaceAll(ORG.toUpperCase(), OTHER_ORG.toUpperCase()).replaceAll(ORG, OTHER_ORG).replaceAll(ADDRESS, OTHER_ADDRESS));
      break;
    case "account-name":
      setField("Account Holder", "Sunita Deshpande (individual savings account)");
      break;
    case "bank-mismatch":
      setField("Account Number", "123456789099");
      setField("IFSC", "SBIN0000999");
      break;
    case "blank-template":
      s.fields = (s.fields ?? []).map(([k]) => [k, null]);
      if (s.table) s.table = { ...s.table, rows: s.table.rows.map((r) => r.map(() => null)) };
      s.parts = (s.parts ?? []).map(([k]) => [k, null]);
      s.sign = "blank";
      break;
    case "validity-lapsed":
      setField(s.validity[0], s.validity[1]);
      break;
    case "not-notarised":
      s.sign = "parties";
      break;
    case "unsigned":
      s.sign = "unsigned";
      break;
    case "incomplete-table": {
      const keep = s.table.head.length - s.incompleteColumns;
      s.table = { head: s.table.head.slice(0, keep), rows: s.table.rows.map((r) => r.slice(0, keep)) };
      break;
    }
    case "address-mismatch":
      setField(s.address[0], s.address[1]);
      break;
    default:
      break;
  }
  return s;
}

const cell = (v) => (v == null ? `<span class="blank">________________</span>` : esc(v));

function signatures(s) {
  const person = (name, role) => `<div class="sig"><div class="hand">${name ? esc(name) : ""}</div><div class="line">${esc(role)}</div></div>`;
  const seal = (text) => `<div class="seal">${esc(text)}</div>`;
  switch (s.sign) {
    case "none": return "";
    case "blank": return `<div class="sigs">${person("", "Signature")}${person("", "Name and designation")}</div>`;
    case "unsigned": return `<div class="sigs">${person("", "Secretary")}${person("", "President")}</div>`;
    case "authority": return `<div class="sigs">${person("S. Deshpande", "Secretary, " + ORG)}${person("R. Sharma", "President, " + ORG)}${seal(ORG + " · Pune")}</div>`;
    case "ca": return `<div class="sigs">${person("S. Deshpande", "Secretary, " + ORG)}${person("A. Deshpande", "For M/s Deshpande & Associates, Chartered Accountants · M.No. 123456 · UDIN 26123456AAAAAA0000")}${seal("Deshpande & Associates · Chartered Accountants · Pune")}</div>`;
    case "bank": return `<div class="sigs">${person("", "")}${person("V. Iyer", "Branch Manager")}${seal("State Bank of India · Hadapsar Branch")}</div>`;
    case "registrar": return `<div class="sigs">${person("", "")}${person("M. Kale", `For ${s.issuer}`)}${seal(s.issuer)}</div>`;
    case "notary": return `<div class="sigs">${person("S. Deshpande", "For " + ORG)}${person("R. Bhosale", "Second party")}</div><div class="stamp">NOTARIAL · Adv. P. Kulkarni, Notary Public, Pune · Reg. No. 1234/2019 · 4 Aug 2026</div>`;
    case "parties": return `<div class="sigs">${person("S. Deshpande", "For " + ORG)}${person("R. Bhosale", "Second party")}</div>`;
    default: return "";
  }
}

function html(subject, check, verdictWords) {
  const s = shaped(subject, check);
  const fields = s.fields?.length ? `<table class="kv">${s.fields.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${cell(v)}</td></tr>`).join("")}</table>` : "";
  const table = s.table ? `<table><tr>${s.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>${s.table.rows.map((r) => `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join("")}</tr>`).join("")}</table>` : "";
  const parts = (s.parts ?? []).map(([h, body]) => `<h2>${esc(h)}</h2><p>${cell(body)}</p>`).join("");
  return `<!doctype html><meta charset="utf-8"><style>${css}</style>
<div class="watermark">SAMPLE</div>
<div class="body">
  <div class="banner">Sample document · SAMAVESH prototype demo data · not a departmental record</div>
  <p class="issuer">${esc(s.issuer)}</p>
  <h1>${esc(s.title)}</h1>
  <div class="rule"></div>
  ${fields}${table}${parts}
  ${signatures(s)}
  <div class="foot">Generated by tools/e-anudaan-samples/generate.mjs for the SAMAVESH e-Anudaan prototype.
  Intended check result: <strong>${esc(verdictWords)}</strong>. Every organisation, person, account and figure in this
  document is invented. It describes no real body, project, sanction or beneficiary and is not evidence for any application.</div>
</div>`;
}

/** The same document as `html`, as the drawing model pdf.mjs takes. */
function model(subject, check, verdictWords) {
  const s = shaped(subject, check);
  const signature = (() => {
    switch (s.sign) {
      case "none": return null;
      case "blank": return { people: [["", "Signature"], ["", "Name and designation"]] };
      case "unsigned": return { people: [["", "Secretary"], ["", "President"]] };
      case "authority": return { people: [["S. Deshpande", `Secretary, ${ORG}`], ["R. Sharma", `President, ${ORG}`]], seal: `${ORG} · Pune` };
      case "ca": return { people: [["S. Deshpande", `Secretary, ${ORG}`], ["A. Deshpande", "For M/s Deshpande & Associates, Chartered Accountants · M.No. 123456 · UDIN 26123456AAAAAA0000"]], seal: "Deshpande & Associates · Chartered Accountants · Pune" };
      case "bank": return { people: [["", ""], ["V. Iyer", "Branch Manager, State Bank of India, Hadapsar"]], seal: "State Bank of India · Hadapsar Branch" };
      case "registrar": return { people: [["", ""], ["M. Kale", `For ${s.issuer}`]], seal: s.issuer };
      case "notary": return { people: [["S. Deshpande", `For ${ORG}`], ["R. Bhosale", "Second party"]], stamp: "NOTARIAL · Adv. P. Kulkarni, Notary Public, Pune · Reg. No. 1234/2019 · 4 Aug 2026" };
      case "parties": return { people: [["S. Deshpande", `For ${ORG}`], ["R. Bhosale", "Second party"]] };
      default: return null;
    }
  })();
  return {
    issuer: s.issuer, title: s.title, fields: s.fields, table: s.table, parts: s.parts, signature,
    footer: `Generated by tools/e-anudaan-samples/generate.mjs for the SAMAVESH e-Anudaan prototype. Intended check result: ${verdictWords}. Every organisation, person, account and figure in this document is invented. It describes no real body, project, sanction or beneficiary and is not evidence for any application.`,
  };
}

/* ── Render ─────────────────────────────────────────────────────────────────────────── */

const WORDS = {
  valid: "passes", "wrong-year": "wrong financial year", "wrong-variant": "wrong format of the document",
  "missing-particulars": "particulars missing", "missing-parts": "required parts missing",
  "other-organisation": "another organisation's document", "account-name": "account not in the organisation's name",
  "blank-template": "blank template", "validity-lapsed": "validity does not cover the year", "not-notarised": "not notarised",
  unsigned: "unsigned", "incomplete-table": "table incomplete", "address-mismatch": "address differs from the application",
  "bank-mismatch": "bank details differ from the application", illegible: "illegible scan", placeholder: "placeholder document",
};

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) unlinkSync(join(OUT, f)); // files only; the directory is flat

const browser = await chromium.launch();
const page = await browser.newPage();
const manifest = [];

async function pdf(name, drawing, meta) {
  writeFileSync(join(OUT, name), await renderPdf(drawing));
  manifest.push({ file: name, ...meta, kb: Math.ceil(statSync(join(OUT, name)).size / 1024) });
}

/** A scan too blurred and too coarse to read: a low-resolution JPEG of the page, in a PDF. */
async function illegible(name, content, meta) {
  await page.setViewportSize({ width: 620, height: 877 });
  await page.setContent(content.replace("</style>", "body{margin:18px;font-size:9pt} .body{filter:blur(1.6px) contrast(.55) brightness(1.08)}</style>"), { waitUntil: "load" });
  const jpg = await page.screenshot({ type: "jpeg", quality: 30, fullPage: false });
  const doc = await PDFDocument.create();
  const img = await doc.embedJpg(Uint8Array.from(jpg));
  const p = doc.addPage([595, 842]);
  p.drawImage(img, { x: 0, y: 0, width: 595, height: 842 });
  writeFileSync(join(OUT, name), await doc.save());
  manifest.push({ file: name, ...meta, kb: Math.ceil(statSync(join(OUT, name)).size / 1024) });
}

for (const subject of SUBJECTS) {
  const base = { stem: subject.stem, title: subject.title };
  await pdf(`${subject.stem}--valid.pdf`, model(subject, "valid", WORDS.valid), { ...base, check: "valid" });
  for (const check of CONTENT_CHECKS) {
    if (!renderable(subject, check)) continue;
    const name = `${subject.stem}--${check}.pdf`;
    if (check === "illegible") await illegible(name, html(subject, "valid", WORDS[check]), { ...base, check });
    else await pdf(name, model(subject, check, WORDS[check]), { ...base, check });
  }
}

// A scan of the PAN card and the registration certificate, as the images applicants often upload.
await page.setViewportSize({ width: 794, height: 1123 });
for (const stem of ["pan-card", "registration-certificate"]) {
  const subject = SUBJECTS.find((s) => s.stem === stem);
  await page.setContent(html(subject, "valid", WORDS.valid), { waitUntil: "load" });
  const name = `${stem}--valid.jpg`;
  writeFileSync(join(OUT, name), await page.screenshot({ type: "jpeg", quality: 70, fullPage: true }));
  manifest.push({ file: name, stem, title: subject.title, check: "valid", kb: Math.ceil(statSync(join(OUT, name)).size / 1024) });
}

// The placeholder the live portal rejects more often than anything else.
await pdf("specimen--placeholder.pdf", {
  issuer: "Test upload", title: "SPECIMEN — NOT A REAL DOCUMENT", watermark: "SPECIMEN",
  fields: [["Document", null], ["Organisation", null], ["Date", null]],
  parts: [["Note", "Test upload. Document to be replaced before submission."]],
  footer: `Generated by tools/e-anudaan-samples/generate.mjs. Intended check result: ${WORDS.placeholder}.`,
}, { stem: "specimen", title: "Specimen", check: "placeholder" });

await browser.close();

// Bytes-only files: a password-protected PDF, and a document that is not a PDF at all.
const lockedFrom = join(OUT, "registration-certificate--valid.pdf");
execFileSync("python3", ["-c", `
import sys
from pypdf import PdfReader, PdfWriter
r = PdfReader(sys.argv[1]); w = PdfWriter()
for p in r.pages: w.add_page(p)
w.encrypt(user_password="sankalp", owner_password="sankalp-owner", algorithm="RC4-128")
w.write(sys.argv[2])
`, lockedFrom, join(OUT, "sample--file-locked.pdf")]);
manifest.push({ file: "sample--file-locked.pdf", stem: "sample", title: "Password-protected PDF", check: "file-locked", kb: Math.ceil(statSync(join(OUT, "sample--file-locked.pdf")).size / 1024) });

execFileSync("python3", ["-c", `
import sys, zipfile
body = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
  '<w:p><w:r><w:t>SAMPLE - SAMAVESH prototype demo data. A Word document, uploaded where PDF, JPG or PNG is asked for.</w:t></w:r></w:p>'
  '</w:body></w:document>')
with zipfile.ZipFile(sys.argv[1], 'w', zipfile.ZIP_DEFLATED) as z:
  z.writestr('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  z.writestr('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  z.writestr('word/document.xml', body)
`, join(OUT, "sample--file-type.docx")]);
manifest.push({ file: "sample--file-type.docx", stem: "sample", title: "Word document", check: "file-type", kb: Math.ceil(statSync(join(OUT, "sample--file-type.docx")).size / 1024) });

/* ── The manifest ───────────────────────────────────────────────────────────────────── */

manifest.sort((a, b) => a.file.localeCompare(b.file));
const total = manifest.reduce((n, m) => n + m.kb, 0);
writeFileSync(MANIFEST, `/**
 * GENERATED by tools/e-anudaan-samples/generate.mjs — do not edit. ${manifest.length} files, ${total} KB.
 *
 * Every sample document in /e-anudaan/sample-documents/: the document type it is (\`stem\`, read by
 * \`topicsOfFile\`), and the check it is built to trip (\`check\`, read by \`checkIdOfFile\`).
 */

export interface SampleFile {
  file: string;
  stem: string;
  title: string;
  check: string;
  kb: number;
}

export const SAMPLE_FILES: readonly SampleFile[] = ${JSON.stringify(manifest, null, 2)};
`);
console.log(`${manifest.length} files, ${total} KB → apps/hub/public/e-anudaan/sample-documents/`);
