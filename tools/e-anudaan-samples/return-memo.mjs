/**
 * The sample return memo the e-Anudaan prototype opens from a returned bill's Return Order.
 *
 *   node tools/e-anudaan-samples/return-memo.mjs
 *
 * Writes apps/hub/public/e-anudaan/pfms/return-memo--sample.pdf.
 *
 * WHY. The PFMS BRD (FR-STS-005) asks e-Anudaan to show the return-order document PFMS hosts, "via
 * the configured link". NeGD has not supplied that link, so the prototype opens this stand-in until
 * it does (docs/plans/2026-09-29-e-anudaan-pfms.md §4, question 15).
 *
 * WHAT IT IS NOT. It is not a PFMS document and does not imitate one: no PFMS or government marks,
 * a SAMPLE banner and watermark, and a sentence saying what the real document is. The same marking
 * rule as every sample in tools/e-anudaan-samples/ applies and must stay.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../apps/hub/public/e-anudaan/pfms/return-memo--sample.pdf");

const doc = await PDFDocument.create();
doc.setTitle("Return Memo — Sample (e-Anudaan prototype)");
doc.setCreator("e-Anudaan prototype — sample data");
const page = doc.addPage([595.28, 841.89]); // A4
const regular = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const ink = rgb(0.11, 0.11, 0.11);
const muted = rgb(0.33, 0.33, 0.33);

page.drawText("SAMPLE", { x: 120, y: 330, size: 120, font: bold, color: rgb(0.85, 0.85, 0.85), rotate: degrees(35), opacity: 0.6 });

page.drawRectangle({ x: 45, y: 770, width: 505, height: 30, color: rgb(1, 0.83, 0.14), borderColor: rgb(0.54, 0.43, 0), borderWidth: 1 });
page.drawText("SAMPLE · PROTOTYPE STAND-IN · NOT A PFMS DOCUMENT", { x: 58, y: 781, size: 10, font: bold, color: rgb(0.29, 0.23, 0) });

let y = 735;
const line = (text, opts = {}) => {
  page.drawText(text, { x: 50, y, size: opts.size ?? 11, font: opts.bold ? bold : regular, color: opts.muted ? muted : ink });
  y -= opts.gap ?? 18;
};
line("Return Memo", { size: 20, bold: true, gap: 28 });
line("What this is", { bold: true });
line("A placeholder for the return memo PFMS hosts when it sends a bill back. In the live system,", { muted: true });
line("e-Anudaan opens PFMS's own memo through a link NeGD configures. That link is not yet supplied.", { muted: true, gap: 30 });

const rows = [
  ["Returned By", "Pay & Accounts Office"],
  ["Bill Type", "RPR-34 Grants-in-Aid Bill"],
  ["Reason", "As recorded against the bill in e-Anudaan's Return Order."],
  ["Next Step", "Returned without cancelling: the Maker corrects and resubmits (Bill Status R)."],
  ["", "Returned and cancelled: the Maker starts a fresh payment advice."],
];
for (const [k, v] of rows) {
  if (k) page.drawText(k, { x: 50, y, size: 11, font: bold, color: ink });
  page.drawText(v, { x: 170, y, size: 11, font: regular, color: ink });
  y -= 20;
}

page.drawLine({ start: { x: 50, y: 70 }, end: { x: 545, y: 70 }, thickness: 0.5, color: muted });
page.drawText("e-Anudaan prototype — sample data. Every figure and reference here is invented.", { x: 50, y: 55, size: 8.5, font: regular, color: muted });

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, await doc.save());
console.log(`wrote ${OUT}`);
