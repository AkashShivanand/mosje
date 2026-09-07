/**
 * Sample supporting documents for the e-Anudaan prototype.
 *
 * WHAT THESE ARE FOR. The prototype's upload step runs a document check with five outcomes
 * (verified / review / invalid / pending / unavailable). Demonstrating that check needs a file
 * for each outcome, substantial enough that a reviewer scrolling one on screen sees a document
 * rather than a stub. These are those files.
 *
 * WHAT THEY ARE NOT FOR. Every page carries a SAMPLE banner, a watermark and a footer saying it
 * is prototype demo data, and every organisation, person, account and figure in them is invented.
 * That marking is deliberate and must stay. The live e-Anudaan portal reads document content and
 * rejects placeholders, and it is right to; these files exercise OUR checker, whose verdicts we
 * author in doc-verification.ts. They are not a route past a real verification control, and a
 * document engineered to read as authentic grant evidence is not something this repo produces.
 * The live portal still needs a sanctioned test set from the department.
 *
 *   node --experimental-strip-types tools/sample-documents/generate.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const OUT = join(dirname(fileURLToPath(import.meta.url)),
  "../../apps/hub/public/e-anudaan/sample-documents");

/* ── Invented particulars, used consistently across every document ──────────────────── */
const ORG = {
  name: "Sankalp Seva Sansthan",
  reg: "MH/PUN/1860/51-54",
  regDate: "14 August 2016",
  darpan: "MH/2016/100000",
  address: "Plot 14, Shivaji Nagar, Pune 411005, Maharashtra",
  pan: "AAAAA0000A",
  fy: "2025-26",
};

const COMMITTEE = [
  ["Dr. Rajesh Kumar Sharma", "President", "MD (Psychiatry)", "Pune", "98000 00001"],
  ["Smt. Sunita Verma", "Secretary", "MSW (Social Work)", "Pune", "98000 00002"],
  ["Shri Anil Deshpande", "Treasurer", "M.Com, FCA", "Pune", "98000 00003"],
  ["Smt. Meera Joshi", "Member", "M.A. (Sociology)", "Satara", "98000 00004"],
  ["Shri Prakash Rane", "Member", "B.Ed", "Pune", "98000 00005"],
];

const ACCOUNTS = [
  ["Grant-in-Aid received — Ministry of Social Justice & Empowerment", "48,60,000", "—"],
  ["Interest on savings account", "1,12,400", "—"],
  ["Donations — individual (unrestricted)", "3,45,000", "—"],
  ["Salaries & honoraria — project staff", "—", "27,84,000"],
  ["Rent, electricity and water — project premises", "—", "6,42,000"],
  ["Provisions, kitchen and consumables", "—", "9,18,500"],
  ["Medical and referral expenses", "—", "2,96,200"],
  ["Vocational training materials", "—", "1,84,000"],
  ["Travel and field visits", "—", "1,12,700"],
  ["Audit fee, bank and statutory charges", "—", "88,000"],
];

const STAFF = [
  ["Project Director", "1", "Full time", "MSW", "45,000"],
  ["Counsellor", "2", "Full time", "M.A. Psychology", "28,000"],
  ["Medical Officer (visiting)", "1", "Part time", "MBBS", "22,000"],
  ["Vocational Instructor", "2", "Full time", "ITI / Diploma", "18,000"],
  ["Caretaker", "4", "Full time", "SSC", "14,000"],
  ["Cook / Support staff", "3", "Full time", "—", "12,000"],
];

/* ── Page furniture ─────────────────────────────────────────────────────────────────── */
const css = `
@page { size: A4; margin: 16mm 16mm 14mm; }
body { font: 10pt/1.55 Helvetica, Arial, sans-serif; color: #111; }
.banner { background: #FFD323; border: 2px solid #8a6d00; color: #4a3b00;
  padding: 3.5mm 4mm; border-radius: 2mm; font-weight: 700; font-size: 9pt;
  letter-spacing: .04em; text-transform: uppercase; margin-bottom: 6mm; }
h1 { font-size: 16pt; margin: 0 0 1mm; }
h2 { font-size: 11.5pt; margin: 6mm 0 2mm; border-bottom: 1px solid #ccc; padding-bottom: 1mm; }
.sub { color: #555; margin: 0 0 3mm; font-size: 9.5pt; }
.rule { height: 3px; background: #0373DF; margin: 0 0 5mm; }
p { margin: 0 0 3.5mm; text-align: justify; }
table { border-collapse: collapse; width: 100%; margin: 3mm 0 5mm; font-size: 9pt; }
td, th { border: 1px solid #bbb; padding: 2mm 2.2mm; text-align: left; vertical-align: top; }
th { background: #eef4fb; font-weight: 700; }
td.n, th.n { text-align: right; white-space: nowrap; }
.kv th { width: 38%; }
.page { page-break-after: always; }
.page:last-child { page-break-after: auto; }
.foot { margin-top: 7mm; border-top: 1px solid #ddd; padding-top: 2.5mm;
  font-size: 8pt; color: #666; }
.sig { margin-top: 10mm; display: flex; justify-content: space-between; font-size: 9pt; }
.sig div { border-top: 1px solid #888; padding-top: 1.5mm; width: 45%; }
.degraded { filter: blur(1.15px) contrast(.6); opacity: .8; }
.watermark { position: fixed; top: 45%; left: 50%;
  transform: translate(-50%,-50%) rotate(-28deg); font-size: 58pt; font-weight: 800;
  color: rgba(3,115,223,.09); letter-spacing: .06em; z-index: 0; }
.body { position: relative; z-index: 1; }
`;

const kv = (rows) => `<table class="kv">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;
const tbl = (head, rows, numeric = []) =>
  `<table><tr>${head.map((h, i) => `<th class="${numeric.includes(i) ? "n" : ""}">${h}</th>`).join("")}</tr>` +
  rows.map((r) => `<tr>${r.map((c, i) => `<td class="${numeric.includes(i) ? "n" : ""}">${c}</td>`).join("")}</tr>`).join("") +
  `</table>`;
const sign = (left, right) => `<div class="sig"><div>${left}</div><div>${right}</div></div>`;

/* ── The documents ──────────────────────────────────────────────────────────────────── */
const DOCS = [
  {
    slug: "annual-report-valid", verdict: "verified",
    title: `Annual Report ${ORG.fy}`, subtitle: `${ORG.name} · ${ORG.address}`,
    pages: [
      `<h2>1. The organisation</h2>
       <p>${ORG.name} is a society registered under the Societies Registration Act, 1860, working in the fields of de-addiction, rehabilitation and the welfare of indigent senior citizens across Pune and Satara districts of Maharashtra. It has operated a residential facility since 2017 and a day-care and outreach programme since 2019.</p>
       ${kv([["Registration number", ORG.reg], ["Date of registration", ORG.regDate],
             ["NGO-Darpan unique ID", ORG.darpan], ["PAN", ORG.pan],
             ["Registered office", ORG.address], ["Financial year reported", ORG.fy]])}
       <h2>2. Aims and objectives</h2>
       <p>The memorandum of association records the welfare of indigent senior citizens, the rehabilitation of persons affected by substance dependence, and the provision of vocational training to persons in recovery, among the society's principal aims.</p>`,
      `<h2>3. Activities during the year</h2>
       <p>The following table summarises the programmes run during ${ORG.fy} and the number of persons served under each. Figures are drawn from the attendance registers maintained at the project premises.</p>
       ${tbl(["Programme", "Location", "Persons served", "Sessions / days"],
             [["Residential de-addiction and rehabilitation", "Pune", "142", "365"],
              ["Day-care for indigent senior citizens", "Pune", "88", "298"],
              ["Vocational training — tailoring and handicraft", "Pune", "64", "180"],
              ["Community outreach and awareness", "Pune, Satara", "1,240", "96"],
              ["Family counselling", "Pune", "210", "148"]], [2, 3])}
       <h2>4. Staffing</h2>
       ${tbl(["Post", "Sanctioned", "Nature", "Qualification", "Monthly (₹)"], STAFF, [1, 4])}`,
      `<h2>5. Governance</h2>
       <p>The managing committee met four times during the year. Attendance and the minutes of each meeting are maintained at the registered office and are available for inspection.</p>
       ${tbl(["Name", "Designation", "Qualification", "District", "Contact"], COMMITTEE)}
       <h2>6. Statutory compliance</h2>
       ${kv([["Accounts audited by", "A. Deshpande & Associates, Chartered Accountants"],
             ["Audit completed on", "12 June 2026"],
             ["Income-tax return filed", "Yes — acknowledgement retained"],
             ["Annual return to Registrar", "Filed within the prescribed period"]])}
       ${sign("Secretary", "President")}`,
    ],
  },
  {
    slug: "audited-accounts-valid", verdict: "verified",
    title: `Statement of Income and Expenditure — ${ORG.fy}`,
    subtitle: `${ORG.name} · audited statement`,
    pages: [
      `<h2>Income and expenditure</h2>
       <p>The statement below covers the year ended 31 March 2026 and is presented in the form in which it was placed before the managing committee. All figures are in rupees.</p>
       ${tbl(["Particulars", "Income (₹)", "Expenditure (₹)"], ACCOUNTS, [1, 2])}
       ${tbl(["", "Income (₹)", "Expenditure (₹)"],
             [["<strong>Total</strong>", "<strong>53,17,400</strong>", "<strong>50,25,400</strong>"],
              ["<strong>Excess of income over expenditure</strong>", "", "<strong>2,92,000</strong>"]], [1, 2])}`,
      `<h2>Notes to the accounts</h2>
       <p>1. Grant-in-aid is recognised on receipt. The unspent balance at the year end is carried forward and is reflected in the utilisation certificate submitted separately.</p>
       <p>2. Salaries and honoraria are paid by bank transfer to accounts held in the names of the individual staff members. No payment in cash exceeded the statutory threshold.</p>
       <p>3. Rent is paid under a registered leave-and-licence agreement for the project premises; a copy is available for inspection.</p>
       <p>4. Fixed assets acquired from grant funds are held in the name of the society and are recorded in the asset register.</p>
       ${kv([["Auditor", "A. Deshpande & Associates, Chartered Accountants"],
             ["Membership number", "000000 (illustrative)"], ["Date of report", "12 June 2026"],
             ["Place", "Pune"]])}
       ${sign("Treasurer", "For A. Deshpande & Associates")}`,
    ],
  },
  {
    slug: "committee-list-needs-review", verdict: "review",
    title: "List of Managing Committee Members",
    subtitle: `${ORG.name} · ${ORG.fy}`,
    pages: [
      `<p>This sample is written to produce a <strong>needs review</strong> verdict in the prototype. The members are listed with occupations, districts and contact numbers, but the columns below deliberately omit the formal office each member holds, so an automatic check can identify the list without being able to confirm who the President, Secretary and Treasurer are.</p>
       ${tbl(["Name", "Occupation", "District", "Contact", "Member since"],
             COMMITTEE.map(([n, , q, d, c]) => [n, q, d, c, "2016"]))}
       <p>Needs review is not a rejection. Nothing is asked of the applicant; the document is routed to an officer who confirms it by hand.</p>
       ${sign("Secretary", "President")}`,
    ],
  },
  {
    slug: "wrong-document-financial-statement", verdict: "invalid",
    title: "Statement of Income and Expenditure (Form VII)",
    subtitle: `${ORG.name} · ${ORG.fy}`,
    pages: [
      `<p>This sample is written to produce a <strong>not valid</strong> verdict when it is uploaded into a slot that asks for something else — a Registration Certificate, say. It is a complete, legible financial statement. It is simply the wrong document for that slot, and it carries no registration number or date of registration for the checker to find.</p>
       ${tbl(["Particulars", "Income (₹)", "Expenditure (₹)"], ACCOUNTS.slice(0, 6), [1, 2])}
       <p>This is the case most worth demonstrating, because it is the one a real applicant meets most often: the file is fine, the slot is wrong, and the message has to name which document to fetch instead.</p>
       ${kv([["Registration number", "Not stated in this document"],
             ["Date of registration", "Not stated in this document"],
             ["Document type", "Income and expenditure statement"]])}`,
    ],
  },
  {
    slug: "illegible-scan", verdict: "invalid",
    title: "Certificate of Registration — scanned copy",
    subtitle: "Deliberately degraded capture",
    degraded: true,
    pages: [
      `<p>This sample produces a <strong>not valid</strong> verdict for the other common reason: the page is a photograph of a document taken badly, and nothing on it can be read with confidence.</p>
       ${kv([["Society", ORG.name], ["Registration number", ORG.reg],
             ["Date of registration", ORG.regDate], ["Registrar", "Registrar of Societies, Pune Division"]])}
       <p>The remedy differs from the wrong-document case, and the prototype's message differs with it: rescan the paper, rather than fetch a different one.</p>`,
    ],
  },
  {
    slug: "bank-authorisation-valid", verdict: "verified",
    title: "Bank Authorisation Letter", subtitle: `${ORG.name}`,
    pages: [
      `<p>To the Under Secretary, Ministry of Social Justice &amp; Empowerment, Government of India.</p>
       <p>We confirm that the account particulars below are held in the name of ${ORG.name} and request that any grant sanctioned under the scheme be credited to that account. The society undertakes to inform the Ministry of any change in these particulars before the next instalment falls due.</p>
       ${kv([["Account name", ORG.name], ["Account number", "0000 0000 0000 (illustrative)"],
             ["IFSC", "SBIN0000001 (illustrative)"], ["Bank and branch", "Illustrative Bank, Shivaji Nagar, Pune"],
             ["Account type", "Savings — society"], ["MICR", "000000000 (illustrative)"]])}
       <p>The account particulars above are non-resolving placeholders. They are shaped like the real thing so the layout is honest, and they identify no account at any bank.</p>
       ${sign("Treasurer", "Authorised signatory, for the bank")}`,
    ],
  },
];

/* ── Render ─────────────────────────────────────────────────────────────────────────── */
const render = (d) => `<style>${css}</style>
<div class="watermark">SAMPLE</div>
<div class="body ${d.degraded ? "degraded" : ""}">
${d.pages.map((body, i) => `
  <div class="page">
    <div class="banner">Sample document · SAMAVESH prototype demo data · not a departmental record</div>
    ${i === 0 ? `<h1>${d.title}</h1><p class="sub">${d.subtitle}</p><div class="rule"></div>`
              : `<h1 style="font-size:12pt">${d.title} <span style="font-weight:400;color:#666">— continued</span></h1><div class="rule"></div>`}
    ${body}
    <div class="foot">
      Page ${i + 1} of ${d.pages.length} · Generated by <code>tools/sample-documents/generate.mjs</code>
      for the SAMAVESH e-Anudaan prototype. Intended verdict: <strong>${d.verdict}</strong>.
      Every organisation, person, account and figure in this document is invented. It describes
      no real body, project, sanction or beneficiary and is not evidence for any application.
    </div>
  </div>`).join("")}
</div>`;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const pg = await browser.newPage();
const manifest = [];
for (const d of DOCS) {
  await pg.setContent(render(d), { waitUntil: "load" });
  const file = `${d.slug}.pdf`;
  await pg.pdf({ path: join(OUT, file), format: "A4", printBackground: true });
  manifest.push({ slug: d.slug, file, verdict: d.verdict, title: d.title, pages: d.pages.length });
  console.log(`  ${file.padEnd(42)} ${d.pages.length}pp → ${d.verdict}`);
}
await browser.close();
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${DOCS.length} sample documents → apps/hub/public/e-anudaan/sample-documents/`);
